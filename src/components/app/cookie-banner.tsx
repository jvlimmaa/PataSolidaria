import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { needsAnswer, onConsentChange, readChoice, saveChoices, type Purpose } from "@/lib/consent";
import { isNewAccount, trackMetaPageView, trackMetaRegistration } from "@/lib/meta-pixel";
import { supabase } from "@/integrations/supabase/client";
import { btn } from "@/components/app/ui-bits";

const PURPOSES: Purpose[] = ["analytics", "advertising"];
const OPEN_EVENT = "open-cookie-settings";

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CookieSettingsLink({ className = "" }: { className?: string }) {
  return <button type="button" onClick={openCookieSettings} className={`underline underline-offset-2 ${className}`}>Configurações de cookies</button>;
}

/** Envia visitas e novos cadastros ao pixel da Meta somente com permissão de publicidade. */
export function MetaPixelTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => { void trackMetaPageView(); }, [pathname]);
  useEffect(() => {
    const off = onConsentChange(() => { void trackMetaPageView(); });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user;
      if (event === "SIGNED_IN" && u && isNewAccount(u.created_at)) void trackMetaRegistration(u.id);
    });
    return () => { off(); data.subscription.unsubscribe(); };
  }, []);
  return null;
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [settings, setSettings] = useState(false);
  const [sw, setSw] = useState<Record<Purpose, boolean>>({ analytics: false, advertising: false });
  const [gpc, setGpc] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    void needsAnswer(PURPOSES).then((n) => { if (alive && n) setShow(true); });
    const open = () => {
      setGpc((navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true);
      setSw({ analytics: readChoice("analytics") === "granted", advertising: readChoice("advertising") === "granted" });
      setSettings(true); setShow(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => { alive = false; window.removeEventListener(OPEN_EVENT, open); };
  }, []);
  useEffect(() => { if (show) ref.current?.focus(); }, [show, settings]);

  if (!show) return null;
  const all = (c: "granted" | "denied") => { saveChoices({ analytics: c, advertising: c }); setShow(false); setSettings(false); };

  return (
    <div ref={ref} tabIndex={-1} role="region" aria-label="Cookies e privacidade"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-3xl border bg-card p-5 text-card-foreground shadow-soft outline-none sm:inset-x-auto sm:right-5 sm:bottom-5">
      {!settings ? (<>
        <p className="font-display text-lg font-bold">Cookies e privacidade</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Contamos as visitas sem cookies. Se você aceitar, também medimos cliques e usamos cookies de publicidade para saber quais anúncios trazem novos cadastros.{" "}
          <Link to="/privacidade" className="font-semibold text-primary underline">Política de privacidade</Link>
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className={btn.primary} onClick={() => all("granted")}>Aceitar tudo</button>
          <button className={btn.primary} onClick={() => all("denied")}>Recusar tudo</button>
        </div>
        <button className="mt-2 w-full text-sm font-semibold underline" onClick={() => { setSw({ analytics: readChoice("analytics") === "granted", advertising: readChoice("advertising") === "granted" }); setSettings(true); }}>Configurações de cookies</button>
      </>) : (<>
        <p className="font-display text-lg font-bold">Configurações de cookies</p>
        {gpc && <p className="mt-2 rounded-xl bg-muted p-3 text-sm">Seu navegador pede que sites não rastreiem você, então medição e publicidade ficam desligadas.</p>}
        <ul className="mt-3 space-y-3 text-sm">
          <li className="flex items-start justify-between gap-3"><span><b>Necessários</b><br /><span className="text-muted-foreground">Mantêm o login e o funcionamento do site.</span></span><span className="text-xs font-bold text-muted-foreground">Sempre ativos</span></li>
          {([["analytics", "Medição de uso, fornecida pela Lovable", "Conta cliques para entendermos como o site é usado."], ["advertising", "Publicidade, fornecida pela Meta", "Mostra à Meta visitas e novos cadastros vindos dos anúncios."]] as const).map(([p, t, d]) => (
            <li key={p} className="flex items-start justify-between gap-3">
              <label htmlFor={`ck-${p}`}><b>{t}</b><br /><span className="text-muted-foreground">{d}</span></label>
              <input id={`ck-${p}`} type="checkbox" role="switch" className="mt-1 h-5 w-5 accent-[var(--primary)]" disabled={gpc}
                checked={!gpc && sw[p]} onChange={(e) => setSw((s) => ({ ...s, [p]: e.target.checked }))} />
            </li>
          ))}
        </ul>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className={btn.primary} onClick={() => { saveChoices({ analytics: sw.analytics ? "granted" : "denied", advertising: sw.advertising ? "granted" : "denied" }); setShow(false); setSettings(false); }}>Salvar escolhas</button>
          <button className={btn.ghost} onClick={() => { setSettings(false); void needsAnswer(PURPOSES).then(setShow); }}>Fechar</button>
        </div>
      </>)}
    </div>
  );
}
