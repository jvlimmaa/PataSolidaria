import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Home, History, Package, HeartHandshake, User, BellRing, Plus } from "lucide-react";
import { Logo, Modal, Field, btn, DemoTag } from "@/components/app/ui-bits";
import { Switch } from "@/components/ui/switch";
import { brl, dataBR } from "@/lib/demo-data";

export const Route = createFileRoute("/usuario")({
  head: () => ({ meta: [
    { title: "Tela do Colaborador — Pata Solidária" },
    { name: "description", content: "Protótipo da tela do Colaborador/Doador: minha contribuição, renovação, histórico, bens e serviços (dados fictícios)." },
    { property: "og:title", content: "Tela do Colaborador — Pata Solidária" },
    { property: "og:description", content: "Experiência mobile-first de demonstração." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Usuario,
});

const tabs = [{ id: "inicio", l: "Início", i: Home }, { id: "hist", l: "Histórico", i: History }, { id: "bens", l: "Bens", i: Package }, { id: "serv", l: "Serviços", i: HeartHandshake }, { id: "dados", l: "Meus dados", i: User }] as const;

function Usuario() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("inicio");
  const [forma, setForma] = useState("Cartão final 4821");
  const [venc, setVenc] = useState("2026-10-22");
  const [alerta, setAlerta] = useState(true);
  const [hist, setHist] = useState([["2026-09-22", 30], ["2026-08-22", 30], ["2026-07-22", 30], ["2026-06-22", 30]] as [string, number][]);
  const [bens, setBens] = useState([{ i: "Ração para gatos", q: "5 kg", d: "2026-09-10" }]);
  const [servs, setServs] = useState([{ i: "Passeio com cães", q: "2 h", d: "2026-09-18" }]);
  const [modal, setModal] = useState<null | "pag" | "bem" | "serv">(null);
  const [prefs, setPrefs] = useState({ email: true, whats: false });
  const fd = (e: React.FormEvent) => { e.preventDefault(); return Object.fromEntries(new FormData(e.target as HTMLFormElement)) as Record<string, string>; };
  const close = () => setModal(null);
  const hoje = new Date("2026-10-14").getTime();
  const dias = Math.round((new Date(venc).getTime() - hoje) / 86400000);

  const List = ({ items, empty, btnLabel, m }: { items: { i: string; q: string; d: string }[]; empty: string; btnLabel: string; m: "bem" | "serv" }) => (
    <div><div className="space-y-3">{items.map((x, k) => <div key={k} className="rounded-2xl border bg-card p-4"><p className="font-bold">{x.i}</p><p className="text-sm text-muted-foreground">{x.q} · {dataBR(x.d)}</p></div>)}{!items.length && <p className="text-muted-foreground">{empty}</p>}</div>
      <button className={`${btn.accent} mt-4 w-full`} onClick={() => setModal(m)}><Plus className="h-4 w-4" />{btnLabel}</button></div>
  );

  return (
    <div className="mx-auto min-h-screen max-w-xl bg-background pb-24 md:my-6 md:min-h-0 md:rounded-[2rem] md:border md:shadow-soft">
      <div className="flex items-center justify-between gap-2 border-b px-5 py-3">
        <Link to="/" className="text-sm font-bold">← Voltar ao site</Link>
        <Link to="/acesso" className="text-sm font-bold text-primary">Trocar de perfil</Link>
      </div>
      <div className="flex items-center justify-between px-5 pt-4"><Logo className="h-14" /><DemoTag /></div>

      <main className="space-y-5 p-5">
        {tab === "inicio" && (<>
          <h1 className="text-3xl font-bold">Olá, Marina! 🐾</h1>
          <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-soft">
            <p className="text-sm opacity-80">Minha contribuição mensal</p>
            <p className="font-display text-5xl font-bold">{brl(30)}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p className="opacity-70">Pagamento</p><p className="font-bold">{forma}</p></div><div><p className="opacity-70">Próxima renovação</p><p className="font-bold">{dataBR(venc)}</p></div></div>
          </div>
          {dias <= 30 ? (
            <div className="rounded-3xl bg-warning p-5 text-warning-foreground">
              <p className="flex items-center gap-2 font-bold"><BellRing className="h-5 w-5" />Sua renovação vence em {dias} dias</p>
              <p className="mt-1 text-sm">Atualize sua forma de pagamento para continuar ajudando.</p>
              <button className={`${btn.primary} mt-3 w-full`} onClick={() => setModal("pag")}>Atualizar forma de pagamento</button>
            </div>
          ) : <p className="rounded-3xl bg-success p-5 font-bold text-success-foreground">Tudo certo! Sua contribuição está em dia. 💚</p>}
        </>)}
        {tab === "hist" && (<><h1 className="text-2xl font-bold">Histórico de contribuições</h1>
          <div className="divide-y rounded-3xl border bg-card">{hist.map(([d, v], k) => <div key={k} className="flex justify-between p-4"><span>{dataBR(d)}</span><b>{brl(v)}</b></div>)}</div></>)}
        {tab === "bens" && (<><h1 className="text-2xl font-bold">Minhas doações de bens</h1><List items={bens} empty="Nenhuma doação ainda." btnLabel="Registrar doação de bens" m="bem" /></>)}
        {tab === "serv" && (<><h1 className="text-2xl font-bold">Meus serviços prestados</h1><List items={servs} empty="Nenhum serviço ainda." btnLabel="Registrar serviço" m="serv" /></>)}
        {tab === "dados" && (<><h1 className="text-2xl font-bold">Meus dados</h1>
          <div className="rounded-3xl border bg-card p-5"><p className="text-sm text-muted-foreground">Nome</p><p className="font-bold">Marina Souza (fictício)</p><p className="mt-3 text-sm text-muted-foreground">E-mail</p><p className="font-bold">marina@exemplo.com</p></div>
          <div className="space-y-4 rounded-3xl border bg-card p-5">
            <p className="font-bold">Preferências de lembrete</p>
            {[["email", "Lembrete por e-mail"], ["whats", "Lembrete por WhatsApp"]].map(([k, l]) => <div key={k} className="flex items-center justify-between"><span id={k}>{l}</span><Switch aria-labelledby={k} checked={prefs[k as "email"]} onCheckedChange={(c) => setPrefs({ ...prefs, [k]: c })} /></div>)}
            <div className="flex items-center justify-between"><span id="al">Avisar 15 dias antes</span><Switch aria-labelledby="al" checked={alerta} onCheckedChange={setAlerta} /></div>
          </div></>)}
      </main>

      <nav aria-label="Menu inferior" className="fixed inset-x-0 bottom-0 z-30 mx-auto grid max-w-xl grid-cols-5 border-t bg-card md:rounded-b-[2rem]">
        {tabs.map((t) => <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id} className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${tab === t.id ? "text-accent-foreground" : "text-muted-foreground"}`}><span className={`rounded-full px-4 py-1 ${tab === t.id ? "bg-accent" : ""}`}><t.i className="h-5 w-5" /></span>{t.l}</button>)}
      </nav>

      <Modal open={modal === "pag"} onClose={close} title="Atualizar forma de pagamento">
        <form onSubmit={(e) => { const v = fd(e); setForma(`Cartão final ${v.num.slice(-4)}`); setVenc("2026-11-22"); setHist([["2026-10-14", 30], ...hist]); toast.success("Renovação confirmada (simulado)."); close(); }}>
          <Field label="Número do cartão (fictício)" name="num" inputMode="numeric" pattern="[0-9 ]{8,19}" placeholder="0000 0000 0000 0000" required />
          <Field label="Validade" name="val" placeholder="MM/AA" required /><button className={`${btn.primary} w-full`}>Confirmar renovação</button></form>
      </Modal>
      <Modal open={modal === "bem"} onClose={close} title="Registrar doação de bens">
        <form onSubmit={(e) => { const v = fd(e); setBens([{ i: v.item, q: v.qtd, d: "2026-10-14" }, ...bens]); toast.success("Doação registrada (simulado)."); close(); }}>
          <Field label="Item" name="item" required /><Field label="Quantidade" name="qtd" required /><button className={`${btn.primary} w-full`}>Registrar</button></form>
      </Modal>
      <Modal open={modal === "serv"} onClose={close} title="Registrar serviço">
        <form onSubmit={(e) => { const v = fd(e); setServs([{ i: v.o_que, q: `${v.horas} h`, d: "2026-10-14" }, ...servs]); toast.success("Serviço registrado (simulado)."); close(); }}>
          <Field label="O que você fez?" name="o_que" required /><Field label="Horas" name="horas" type="number" min="1" required /><button className={`${btn.primary} w-full`}>Registrar</button></form>
      </Modal>
    </div>
  );
}
