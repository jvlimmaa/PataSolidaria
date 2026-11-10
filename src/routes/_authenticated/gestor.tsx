import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { LayoutDashboard, HandCoins, Package, HeartHandshake, BellRing, FileBarChart, Plus, Search, ArrowLeft, LogOut } from "lucide-react";
import { Logo, Modal, Field, btn, StatusBadge } from "@/components/app/ui-bits";
import { brl, dataBR, statusDe, type Donor, type Bem, type Servico } from "@/lib/demo-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStateSync, signOut } from "@/lib/auth";
import { downloadReportCsv } from "@/lib/report-csv";

export const Route = createFileRoute("/_authenticated/gestor")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Painel do Gestor — Pata Solidária" },
    { name: "description", content: "Painel do Gestor: contribuições, bens, serviços, alertas e relatórios." },
    { property: "og:title", content: "Painel do Gestor — Pata Solidária" },
    { property: "og:description", content: "Painel administrativo da ONG." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  beforeLoad: async () => {
    // Somente o papel de gestor acessa o painel administrativo.
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    if (!roles?.some((r) => r.role === "gestor")) throw redirect({ to: "/usuario" });
  },
  loader: async () => {
    const { data } = await supabase.auth.getUser();
    return { userId: data.user?.id ?? "" };
  },
  component: Gestor,
});

const tabs = [
  { id: "geral", l: "Visão geral", i: LayoutDashboard }, { id: "contrib", l: "Contribuições", i: HandCoins },
  { id: "bens", l: "Bens", i: Package }, { id: "serv", l: "Serviços", i: HeartHandshake },
  { id: "alertas", l: "Alertas", i: BellRing }, { id: "rel", l: "Relatórios", i: FileBarChart },
] as const;

const th = "px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground";
const td = "px-4 py-3";
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const Wrap = ({ children }: { children: React.ReactNode }) => <div className="overflow-x-auto rounded-3xl border bg-card">{children}</div>;

function Gestor() {
  useAuthStateSync();
  const { userId } = Route.useLoaderData();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("geral");
  const [modal, setModal] = useState<null | "donor" | "bem" | "serv" | "lembrete">(null);
  const [q, setQ] = useState(""); const [f, setF] = useState("Todos");
  const [dupe, setDupe] = useState(false);
  const [alvo, setAlvo] = useState<Donor[]>([]);

  const { data: donors = [] } = useQuery({
    queryKey: ["contributions"],
    queryFn: async (): Promise<Donor[]> => {
      const { data, error } = await supabase.from("contributions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((c) => ({ id: c.id, nome: c.nome, email: c.email, valor: Number(c.valor), forma: c.forma, vencimento: c.vencimento }));
    },
  });
  const { data: bens = [] } = useQuery({
    queryKey: ["bens"],
    queryFn: async (): Promise<Bem[]> => {
      const { data, error } = await supabase.from("bens").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((b) => ({ id: b.id, item: b.item, qtd: b.qtd, doador: b.doador, data: b.data }));
    },
  });
  const { data: servs = [] } = useQuery({
    queryKey: ["servicos"],
    queryFn: async (): Promise<Servico[]> => {
      const { data, error } = await supabase.from("servicos").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((s) => ({ id: s.id, quem: s.quem, o_que: s.o_que, data: s.data, horas: s.horas }));
    },
  });

  const salvar = useMutation({
    mutationFn: async ({ tabela, row }: { tabela: "contributions" | "bens" | "servicos"; row: Record<string, unknown> }) => {
      const { error } = await (supabase.from(tabela) as any).insert(row);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Registro salvo no sistema.");
      close();
    },
    onError: (e: Error) => toast.error("Não foi possível salvar: " + e.message),
  });

  const enviarLembretes = useMutation({
    mutationFn: async ({ ids, destinatarios, mensagem }: { ids: (string | null)[]; destinatarios: string; mensagem: string }) => {
      const { error } = await supabase.from("reminders").insert(ids.map((cid) => ({ contribution_id: cid, destinatarios, mensagem, user_id: userId })));
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      queryClient.invalidateQueries();
      toast.success(`Lembrete registrado para ${v.ids.length} pessoa(s). O envio por e-mail continua simulado no protótipo.`);
      close();
    },
    onError: (e: Error) => toast.error("Não foi possível registrar: " + e.message),
  });

  const fila = useMemo(() => donors.filter((d) => statusDe(d.vencimento) !== "Ativo"), [donors]);
  const lista = useMemo(() => donors.filter((d) => (f === "Todos" || statusDe(d.vencimento) === f) && (d.nome + d.email).toLowerCase().includes(q.toLowerCase())), [donors, q, f]);
  const close = () => { setModal(null); setDupe(false); };
  const fd = (e: React.FormEvent) => { e.preventDefault(); return Object.fromEntries(new FormData(e.target as HTMLFormElement)) as any; };

  // Contribuições somadas por mês de vencimento, para o gráfico de barras.
  const porMes = useMemo(() => {
    const soma = new Map<string, number>();
    for (const d of donors) {
      const k = d.vencimento.slice(0, 7);
      if (!/^\d{4}-\d{2}$/.test(k)) continue;
      soma.set(k, (soma.get(k) ?? 0) + d.valor);
    }
    return [...soma.entries()].sort().slice(-6).map(([k, v]) => ({ m: MESES[Number(k.slice(5, 7)) - 1] ?? k.slice(5, 7), v }));
  }, [donors]);
  const topo = Math.max(...porMes.map((x) => x.v), 1);

  const Head = ({ t, action, label, m }: { t: string; action?: boolean; label?: string; m?: typeof modal }) => (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold sm:text-3xl">{t}</h1>
      {action && <button className={btn.accent} onClick={() => { if (m) setModal(m); }}><Plus className="h-4 w-4" />{label}</button>}
    </div>
  );

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar p-5 text-sidebar-foreground md:flex">
        <div className="mb-6"><Logo className="mx-auto h-auto w-full" /></div>
        <nav aria-label="Gestor" className="flex flex-1 flex-col gap-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-semibold ${tab === t.id ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"}`}><t.i className="h-5 w-5" />{t.l}</button>
          ))}
        </nav>
        <button onClick={async () => { await signOut(queryClient); navigate({ to: "/auth", replace: true }); }} className="rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-sidebar-accent">Sair da conta</button>
        <Link to="/" className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-sidebar-accent">Voltar ao site</Link>
      </aside>

      <div className="min-w-0 flex-1 pb-24 md:pb-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-card px-5 py-3">
          <div className="flex items-center gap-2 md:hidden"><Link to="/" aria-label="Voltar ao site" className="rounded-full p-2 hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link><Logo className="h-9" /></div>
          <button onClick={async () => { await signOut(queryClient); navigate({ to: "/auth", replace: true }); }} className="inline-flex items-center gap-1 text-sm font-bold"><LogOut className="h-4 w-4" />Sair</button>
        </div>

        <main className="mx-auto max-w-5xl p-5 sm:p-8">
          {tab === "geral" && (<>
            <Head t="Visão geral" />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[["Doadores ativos", donors.filter((d) => statusDe(d.vencimento) === "Ativo").length], ["Renovações em 30 dias", fila.length], ["Bens registrados", bens.length], ["Serviços registrados", servs.length]].map(([l, v]) => (
                <div key={l} className="rounded-3xl border bg-card p-5"><p className="font-display text-4xl font-bold text-primary">{v}</p><p className="mt-1 text-sm text-muted-foreground">{l}</p></div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold">Contribuições por mês</h2>
              {porMes.length ? <svg viewBox="0 0 360 180" className="w-full" role="img" aria-label="Gráfico de barras das contribuições por mês">
                {porMes.map((m, i) => { const h = Math.max((m.v / topo) * 125, 4); return (<g key={m.m + i}>
                  <rect x={20 + i * 57} y={150 - h} width="38" height={h} rx="8" fill={i === porMes.length - 1 ? "var(--accent)" : "var(--primary)"} />
                  <text x={39 + i * 57} y={168} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">{m.m}</text>
                  <text x={39 + i * 57} y={144 - h} textAnchor="middle" fontSize="10" fill="var(--foreground)">{m.v.toLocaleString("pt-BR")}</text></g>); })}
              </svg> : <p className="text-sm text-muted-foreground">Nenhuma contribuição registrada ainda — o gráfico aparece assim que houver lançamentos.</p>}
            </div>
          </>)}

          {tab === "contrib" && (<>
            <Head t="Contribuições" action label="Novo doador" m="donor" />
            <div className="mb-4 flex flex-wrap gap-3">
              <label className="relative min-w-52 flex-1"><span className="sr-only">Buscar</span><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou e-mail" className="w-full rounded-full border border-input bg-card py-2.5 pl-9 pr-3" /></label>
              <select aria-label="Filtrar por status" value={f} onChange={(e) => setF(e.target.value)} className="rounded-full border border-input bg-card px-4 py-2.5">{["Todos", "Ativo", "Vencendo em breve", "Vencido"].map((s) => <option key={s}>{s}</option>)}</select>
            </div>
            <Wrap><table className="w-full text-sm"><thead><tr><th className={th}>Doador</th><th className={th}>Valor</th><th className={th}>Pagamento</th><th className={th}>Vencimento</th><th className={th}>Status</th></tr></thead>
              <tbody>{lista.map((d) => <tr key={d.id} className="border-t"><td className={td}><b>{d.nome}</b><br /><span className="text-muted-foreground">{d.email}</span></td><td className={td}>{brl(d.valor)}</td><td className={td}>{d.forma}</td><td className={td}>{dataBR(d.vencimento)}</td><td className={td}><StatusBadge s={statusDe(d.vencimento)} /></td></tr>)}
                {!lista.length && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Nenhum doador encontrado.</td></tr>}</tbody></table></Wrap>
          </>)}

          {tab === "bens" && (<><Head t="Doações de bens" action label="Registrar doação" m="bem" />
            <Wrap><table className="w-full text-sm"><thead><tr><th className={th}>Item</th><th className={th}>Qtd.</th><th className={th}>Doador</th><th className={th}>Data</th></tr></thead>
              <tbody>{bens.map((b) => <tr key={b.id} className="border-t"><td className={td}><b>{b.item}</b></td><td className={td}>{b.qtd}</td><td className={td}>{b.doador}</td><td className={td}>{dataBR(b.data)}</td></tr>)}
                {!bens.length && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Nenhum bem registrado ainda.</td></tr>}</tbody></table></Wrap></>)}

          {tab === "serv" && (<><Head t="Serviços prestados" action label="Registrar serviço" m="serv" />
            <Wrap><table className="w-full text-sm"><thead><tr><th className={th}>Quem</th><th className={th}>O quê</th><th className={th}>Data</th><th className={th}>Horas</th></tr></thead>
              <tbody>{servs.map((s) => <tr key={s.id} className="border-t"><td className={td}><b>{s.quem}</b></td><td className={td}>{s.o_que}</td><td className={td}>{dataBR(s.data)}</td><td className={td}>{s.horas} h</td></tr>)}
                {!servs.length && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Nenhum serviço registrado ainda.</td></tr>}</tbody></table></Wrap></>)}

          {tab === "alertas" && (<>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold sm:text-3xl">Alertas e lembretes</h1>
              <button className={btn.accent} disabled={!fila.length} onClick={() => { setAlvo(fila); setModal("lembrete"); }}><BellRing className="h-4 w-4" />Enviar para todos</button></div>
            <div className="space-y-3">{fila.map((d) => (
              <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border bg-card p-4">
                <div><p className="font-bold">{d.nome}</p><p className="text-sm text-muted-foreground">{brl(d.valor)} · {d.forma} · vence em {dataBR(d.vencimento)}</p></div>
                <div className="flex items-center gap-3"><StatusBadge s={statusDe(d.vencimento)} /><button className={btn.ghost} onClick={() => { setAlvo([d]); setModal("lembrete"); }}>Enviar lembrete</button></div>
              </div>))}
              {!fila.length && <p className="rounded-3xl border bg-card p-6 text-center text-muted-foreground">Nenhuma renovação pendente. Tudo em dia!</p>}</div>
          </>)}

          {tab === "rel" && (<><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold sm:text-3xl">Relatórios</h1><button className={btn.accent} onClick={() => downloadReportCsv(donors, bens, servs)}><FileBarChart className="h-4 w-4" />Exportar CSV</button></div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[["Arrecadado (soma das contribuições)", brl(donors.reduce((s, d) => s + d.valor, 0))], ["Bens recebidos", `${bens.length} itens`], ["Horas de serviço", `${servs.reduce((s, x) => s + x.horas, 0)} h`]].map(([l, v]) => <div key={l} className="rounded-3xl border bg-card p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="font-display text-2xl font-bold text-primary">{v}</p></div>)}
            </div><p className="mt-4 text-sm text-muted-foreground">Resumo do período com os dados cadastrados no sistema.</p></>)}
        </main>
      </div>

      <nav aria-label="Menu inferior" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t bg-sidebar text-sidebar-foreground md:hidden">
        {tabs.map((t) => <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id} className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${tab === t.id ? "text-sidebar-primary" : ""}`}><t.i className="h-5 w-5" />{t.l}</button>)}
      </nav>

      <Modal open={modal === "donor"} onClose={close} title="Novo doador">
        <form onSubmit={(e) => { const v = fd(e); if (!dupe && donors.some((d) => d.email.toLowerCase() === String(v.email).toLowerCase())) { setDupe(true); return; }
          salvar.mutate({ tabela: "contributions", row: { nome: v.nome, email: v.email, valor: Number(v.valor), forma: v.forma, vencimento: v.venc } }); }}>
          <Field label="Nome" name="nome" required /><Field label="E-mail" name="email" type="email" required onChange={() => setDupe(false)} />
          {dupe && <p role="alert" className="mb-3 flex gap-2 rounded-xl bg-warning p-3 text-sm font-semibold text-warning-foreground">Possível duplicidade: este e-mail já está cadastrado. Clique em salvar para cadastrar mesmo assim.</p>}
          <Field label="Valor (R$)" name="valor" type="number" min="1" required />
          <label className="mb-3 block text-sm font-semibold">Forma de pagamento<select name="forma" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 font-normal"><option>Cartão de crédito</option><option>PIX recorrente</option><option>Boleto</option></select></label>
          <Field label="Vencimento" name="venc" type="date" required /><button className={`${btn.primary} w-full`}>Salvar</button>
        </form>
      </Modal>
      <Modal open={modal === "bem"} onClose={close} title="Registrar doação de bens">
        <form onSubmit={(e) => { const v = fd(e); salvar.mutate({ tabela: "bens", row: { item: v.item, qtd: v.qtd, doador: v.doador, data: new Date().toISOString().slice(0, 10) } }); }}>
          <Field label="Item" name="item" required /><Field label="Quantidade" name="qtd" required /><Field label="Doador" name="doador" required /><button className={`${btn.primary} w-full`}>Registrar</button></form>
      </Modal>
      <Modal open={modal === "serv"} onClose={close} title="Registrar serviço">
        <form onSubmit={(e) => { const v = fd(e); salvar.mutate({ tabela: "servicos", row: { quem: v.quem, o_que: v.o_que, data: new Date().toISOString().slice(0, 10), horas: Number(v.horas) } }); }}>
          <Field label="Quem" name="quem" required /><Field label="O quê" name="o_que" required /><Field label="Horas" name="horas" type="number" min="1" required /><button className={`${btn.primary} w-full`}>Registrar</button></form>
      </Modal>
      <Modal open={modal === "lembrete"} onClose={close} title="Pré-visualização da mensagem">
        <p className="rounded-2xl bg-muted p-4 text-sm">Olá, {alvo.length === 1 ? alvo[0]?.nome.split(" ")[0] : "[nome]"}! Sua contribuição mensal na Pata Solidária está perto do vencimento. Atualize sua forma de pagamento para continuar ajudando os animais. Obrigado!</p>
        <p className="my-3 text-sm text-muted-foreground">Destinatários: {alvo.map((a) => a.nome).join(", ")}</p>
        <button className={`${btn.accent} w-full`} disabled={enviarLembretes.isPending} onClick={() => enviarLembretes.mutate({ ids: alvo.map((a) => a.id), destinatarios: alvo.map((a) => a.nome).join(", "), mensagem: "Sua contribuição mensal na Pata Solidária está perto do vencimento. Atualize sua forma de pagamento para continuar ajudando os animais. Obrigado!" })}>Confirmar envio</button>
      </Modal>
    </div>
  );
}
