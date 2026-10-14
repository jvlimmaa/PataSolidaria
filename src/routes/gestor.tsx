import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { LayoutDashboard, HandCoins, Package, HeartHandshake, BellRing, FileBarChart, Plus, Search, ArrowLeft, Repeat, AlertTriangle } from "lucide-react";
import { Logo, Modal, Field, btn, StatusBadge, DemoTag } from "@/components/app/ui-bits";
import { initialDonors, initialBens, initialServicos, meses, brl, dataBR, type Donor, type Bem, type Servico } from "@/lib/demo-data";

export const Route = createFileRoute("/gestor")({
  head: () => ({ meta: [
    { title: "Tela do Gestor — Pata Solidária" },
    { name: "description", content: "Protótipo do painel do Gestor: contribuições, bens, serviços, alertas e relatórios (dados fictícios)." },
    { property: "og:title", content: "Tela do Gestor — Pata Solidária" },
    { property: "og:description", content: "Painel administrativo de demonstração." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Gestor,
});

const tabs = [
  { id: "geral", l: "Visão geral", i: LayoutDashboard }, { id: "contrib", l: "Contribuições", i: HandCoins },
  { id: "bens", l: "Bens", i: Package }, { id: "serv", l: "Serviços", i: HeartHandshake },
  { id: "alertas", l: "Alertas", i: BellRing }, { id: "rel", l: "Relatórios", i: FileBarChart },
] as const;

const th = "px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground";
const td = "px-4 py-3";
const Wrap = ({ children }: { children: React.ReactNode }) => <div className="overflow-x-auto rounded-3xl border bg-card">{children}</div>;

function Gestor() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("geral");
  const [donors, setDonors] = useState<Donor[]>(initialDonors);
  const [bens, setBens] = useState<Bem[]>(initialBens);
  const [servs, setServs] = useState<Servico[]>(initialServicos);
  const [modal, setModal] = useState<null | "donor" | "bem" | "serv" | "lembrete">(null);
  const [q, setQ] = useState(""); const [f, setF] = useState("Todos");
  const [dupe, setDupe] = useState(false);
  const [alvo, setAlvo] = useState<Donor[]>([]);
  const fila = donors.filter((d) => d.status !== "Ativo");
  const lista = useMemo(() => donors.filter((d) => (f === "Todos" || d.status === f) && (d.nome + d.email).toLowerCase().includes(q.toLowerCase())), [donors, q, f]);
  const close = () => { setModal(null); setDupe(false); };
  const fd = (e: React.FormEvent) => { e.preventDefault(); return Object.fromEntries(new FormData(e.target as HTMLFormElement)) as Record<string, string>; };

  const Head = ({ t, action, label, m }: { t: string; action?: boolean; label?: string; m?: typeof modal }) => (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold sm:text-3xl">{t}</h1>
      {action && <button className={btn.accent} onClick={() => setModal(m!)}><Plus className="h-4 w-4" />{label}</button>}
    </div>
  );

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar p-5 text-sidebar-foreground md:flex">
        <div className="mb-6 rounded-2xl bg-background p-2"><Logo className="h-20 mx-auto" /></div>
        <nav aria-label="Gestor" className="flex flex-1 flex-col gap-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-semibold ${tab === t.id ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"}`}><t.i className="h-5 w-5" />{t.l}</button>
          ))}
        </nav>
        <Link to="/acesso" className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-sidebar-accent">Trocar de perfil</Link>
        <Link to="/" className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-sidebar-accent">Voltar ao site</Link>
      </aside>

      <div className="min-w-0 flex-1 pb-24 md:pb-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-card px-5 py-3">
          <div className="flex items-center gap-2 md:hidden"><Link to="/" aria-label="Voltar ao site" className="rounded-full p-2 hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link><Logo className="h-9" /></div>
          <DemoTag />
          <Link to="/acesso" className="inline-flex items-center gap-1 text-sm font-bold md:hidden"><Repeat className="h-4 w-4" />Trocar de perfil</Link>
        </div>

        <main className="mx-auto max-w-5xl p-5 sm:p-8">
          {tab === "geral" && (<>
            <Head t="Visão geral" />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[["Doadores ativos", donors.filter((d) => d.status === "Ativo").length + 36], ["Renovações em 30 dias", fila.length], ["Bens no mês", bens.length + 14], ["Serviços registrados", servs.length + 9]].map(([l, v]) => (
                <div key={l} className="rounded-3xl border bg-card p-5"><p className="font-display text-4xl font-bold text-primary">{v}</p><p className="mt-1 text-sm text-muted-foreground">{l}</p></div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold">Contribuições por mês</h2>
              <svg viewBox="0 0 360 180" className="w-full" role="img" aria-label="Gráfico de barras das contribuições por mês">
                {meses.map((m, i) => { const h = (m.v / 3000) * 140; return (<g key={m.m}>
                  <rect x={20 + i * 57} y={150 - h} width="38" height={h} rx="8" fill={i === 5 ? "var(--accent)" : "var(--primary)"} />
                  <text x={39 + i * 57} y={168} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">{m.m}</text>
                  <text x={39 + i * 57} y={144 - h} textAnchor="middle" fontSize="10" fill="var(--foreground)">{m.v}</text></g>); })}
              </svg>
            </div>
          </>)}

          {tab === "contrib" && (<>
            <Head t="Contribuições" action label="Novo doador" m="donor" />
            <div className="mb-4 flex flex-wrap gap-3">
              <label className="relative min-w-52 flex-1"><span className="sr-only">Buscar</span><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou e-mail" className="w-full rounded-full border border-input bg-card py-2.5 pl-9 pr-3" /></label>
              <select aria-label="Filtrar por status" value={f} onChange={(e) => setF(e.target.value)} className="rounded-full border border-input bg-card px-4 py-2.5">{["Todos", "Ativo", "Vencendo em breve", "Vencido"].map((s) => <option key={s}>{s}</option>)}</select>
            </div>
            <Wrap><table className="w-full text-sm"><thead><tr><th className={th}>Doador</th><th className={th}>Valor</th><th className={th}>Pagamento</th><th className={th}>Vencimento</th><th className={th}>Status</th></tr></thead>
              <tbody>{lista.map((d) => <tr key={d.id} className="border-t"><td className={td}><b>{d.nome}</b><br /><span className="text-muted-foreground">{d.email}</span></td><td className={td}>{brl(d.valor)}</td><td className={td}>{d.forma}</td><td className={td}>{dataBR(d.vencimento)}</td><td className={td}><StatusBadge s={d.status} /></td></tr>)}
                {!lista.length && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Nenhum doador encontrado.</td></tr>}</tbody></table></Wrap>
          </>)}

          {tab === "bens" && (<><Head t="Doações de bens" action label="Registrar doação" m="bem" />
            <Wrap><table className="w-full text-sm"><thead><tr><th className={th}>Item</th><th className={th}>Qtd.</th><th className={th}>Doador</th><th className={th}>Data</th></tr></thead>
              <tbody>{bens.map((b) => <tr key={b.id} className="border-t"><td className={td}><b>{b.item}</b></td><td className={td}>{b.qtd}</td><td className={td}>{b.doador}</td><td className={td}>{dataBR(b.data)}</td></tr>)}</tbody></table></Wrap></>)}

          {tab === "serv" && (<><Head t="Serviços prestados" action label="Registrar serviço" m="serv" />
            <Wrap><table className="w-full text-sm"><thead><tr><th className={th}>Quem</th><th className={th}>O quê</th><th className={th}>Data</th><th className={th}>Horas</th></tr></thead>
              <tbody>{servs.map((s) => <tr key={s.id} className="border-t"><td className={td}><b>{s.quem}</b></td><td className={td}>{s.o_que}</td><td className={td}>{dataBR(s.data)}</td><td className={td}>{s.horas} h</td></tr>)}</tbody></table></Wrap></>)}

          {tab === "alertas" && (<>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold sm:text-3xl">Alertas e lembretes</h1>
              <button className={btn.accent} disabled={!fila.length} onClick={() => { setAlvo(fila); setModal("lembrete"); }}><BellRing className="h-4 w-4" />Enviar para todos</button></div>
            <div className="space-y-3">{fila.map((d) => (
              <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border bg-card p-4">
                <div><p className="font-bold">{d.nome}</p><p className="text-sm text-muted-foreground">{brl(d.valor)} · {d.forma} · vence em {dataBR(d.vencimento)}</p></div>
                <div className="flex items-center gap-3"><StatusBadge s={d.status} /><button className={btn.ghost} onClick={() => { setAlvo([d]); setModal("lembrete"); }}>Enviar lembrete</button></div>
              </div>))}
              {!fila.length && <p className="rounded-3xl border bg-card p-6 text-center text-muted-foreground">Nenhuma renovação pendente. Tudo em dia!</p>}</div>
          </>)}

          {tab === "rel" && (<><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold sm:text-3xl">Relatórios</h1><button className={btn.accent} onClick={() => toast.success("Relatório exportado (simulado).")}>Exportar</button></div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[["Arrecadado em outubro", brl(donors.reduce((s, d) => s + d.valor, 0) * 12)], ["Bens recebidos", `${bens.length + 14} itens`], ["Horas de serviço", `${servs.reduce((s, x) => s + x.horas, 0) + 38} h`]].map(([l, v]) => <div key={l} className="rounded-3xl border bg-card p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="font-display text-2xl font-bold text-primary">{v}</p></div>)}
            </div><p className="mt-4 text-sm text-muted-foreground">Resumo do período com dados fictícios.</p></>)}
        </main>
      </div>

      <nav aria-label="Menu inferior" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t bg-sidebar text-sidebar-foreground md:hidden">
        {tabs.map((t) => <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id} className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${tab === t.id ? "text-sidebar-primary" : ""}`}><t.i className="h-5 w-5" />{t.l}</button>)}
      </nav>

      <Modal open={modal === "donor"} onClose={close} title="Novo doador">
        <form onSubmit={(e) => { const v = fd(e); if (!dupe && donors.some((d) => d.email.toLowerCase() === v.email.toLowerCase())) { setDupe(true); return; }
          setDonors([{ id: Date.now(), nome: v.nome, email: v.email, valor: Number(v.valor), forma: v.forma, vencimento: v.venc, status: "Ativo" }, ...donors]); toast.success("Doador cadastrado (simulado)."); close(); }}>
          <Field label="Nome" name="nome" required /><Field label="E-mail" name="email" type="email" required onChange={() => setDupe(false)} />
          {dupe && <p role="alert" className="mb-3 flex gap-2 rounded-xl bg-warning p-3 text-sm font-semibold text-warning-foreground"><AlertTriangle className="h-5 w-5 shrink-0" />Possível duplicidade: este e-mail já está cadastrado. Clique em salvar para cadastrar mesmo assim.</p>}
          <Field label="Valor (R$)" name="valor" type="number" min="1" required />
          <label className="mb-3 block text-sm font-semibold">Forma de pagamento<select name="forma" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 font-normal"><option>Cartão de crédito</option><option>PIX recorrente</option><option>Boleto</option></select></label>
          <Field label="Vencimento" name="venc" type="date" required /><button className={`${btn.primary} w-full`}>Salvar</button>
        </form>
      </Modal>
      <Modal open={modal === "bem"} onClose={close} title="Registrar doação de bens">
        <form onSubmit={(e) => { const v = fd(e); setBens([{ id: Date.now(), item: v.item, qtd: v.qtd, doador: v.doador, data: "2026-10-14" }, ...bens]); toast.success("Doação registrada (simulado)."); close(); }}>
          <Field label="Item" name="item" required /><Field label="Quantidade" name="qtd" required /><Field label="Doador" name="doador" required /><button className={`${btn.primary} w-full`}>Registrar</button></form>
      </Modal>
      <Modal open={modal === "serv"} onClose={close} title="Registrar serviço">
        <form onSubmit={(e) => { const v = fd(e); setServs([{ id: Date.now(), quem: v.quem, o_que: v.o_que, data: "2026-10-14", horas: Number(v.horas) }, ...servs]); toast.success("Serviço registrado (simulado)."); close(); }}>
          <Field label="Quem" name="quem" required /><Field label="O quê" name="o_que" required /><Field label="Horas" name="horas" type="number" min="1" required /><button className={`${btn.primary} w-full`}>Registrar</button></form>
      </Modal>
      <Modal open={modal === "lembrete"} onClose={close} title="Pré-visualização da mensagem">
        <p className="rounded-2xl bg-muted p-4 text-sm">Olá, {alvo.length === 1 ? alvo[0].nome.split(" ")[0] : "[nome]"}! Sua contribuição mensal na Pata Solidária está perto do vencimento. Atualize sua forma de pagamento para continuar ajudando os animais. Obrigado!</p>
        <p className="my-3 text-sm text-muted-foreground">Destinatários: {alvo.map((a) => a.nome).join(", ")}</p>
        <button className={`${btn.accent} w-full`} onClick={() => { toast.success(`${alvo.length} lembrete(s) enviado(s) (simulado).`); close(); }}>Confirmar envio</button>
      </Modal>
    </div>
  );
}
