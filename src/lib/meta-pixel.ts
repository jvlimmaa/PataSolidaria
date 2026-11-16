import { canTrack } from "@/lib/consent";

/** Pixel "Pata Solidaria" escolhido para a conta de anúncios do projeto. */
export const META_PIXEL_ID = "1484799986947265";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};
type FbWindow = Window & { fbq?: Fbq; _fbq?: Fbq };

let initialized = false;
let granted = false;

function fbq(...args: unknown[]) {
  const f = (window as FbWindow).fbq;
  if (!f) return;
  if (f.callMethod) f.callMethod.apply(f, args);
  else f.queue.push(args);
}

/** Snippet base da Meta: cria a fila e carrega fbevents.js uma única vez. */
function loadPixel() {
  const w = window as FbWindow;
  if (w.fbq) return;
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod.apply(n, args);
    else n.queue.push(args);
  } as Fbq;
  w.fbq = n;
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  const t = document.createElement("script");
  t.async = true;
  t.src = "https://connect.facebook.net/en_US/fbevents.js";
  const s = document.getElementsByTagName("script")[0];
  s?.parentNode?.insertBefore(t, s);
}

/** Liga ou desliga o pixel conforme a escolha de publicidade do visitante. Retorna true quando pode enviar. */
export async function syncMetaPixel(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const allowed = await canTrack("advertising");
  if (allowed) {
    loadPixel();
    if (!initialized) {
      fbq("init", META_PIXEL_ID, {}, { agent: "lovable" });
      initialized = true;
    } else if (!granted) {
      fbq("consent", "grant");
    }
    granted = true;
  } else if (initialized && granted) {
    fbq("consent", "revoke");
    granted = false;
  } else {
    granted = false;
  }
  return granted;
}

export async function trackMetaPageView() {
  if (await syncMetaPixel()) fbq("track", "PageView");
}

/** Conta uma conta nova uma única vez por usuário; o mesmo ID evita contagem dupla. */
export async function trackMetaRegistration(userId: string) {
  const key = `meta_registration_${userId}`;
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
  } catch {
    /* sem armazenamento: segue sem marcar */
  }
  if (await syncMetaPixel()) fbq("track", "CompleteRegistration", {}, { eventID: `signup-${userId}` });
}

/** Conta nova = criada há menos de 15 minutos no momento do primeiro login. */
export function isNewAccount(createdAt: string | undefined, now = Date.now()): boolean {
  if (!createdAt) return false;
  const t = Date.parse(createdAt);
  return Number.isFinite(t) && now - t >= 0 && now - t < 15 * 60_000;
}
