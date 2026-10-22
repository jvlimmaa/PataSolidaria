import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Home, Package, HeartHandshake, User, BellRing, Plus, LogOut } from "lucide-react";
import { Logo, Modal, Field, btn, StatusBadge } from "@/components/app/ui-bits";
import { Switch } from "@/components/ui/switch";
import { brl, dataBR, statusDe, proximoVencimento, type Donor, type Bem, type Servico } from "@/lib/demo-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStateSync, signOut } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/usuario")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Minha contribuição — Pata Solidária" },
    { name: "description", content: "Acompanhe sua contribuição mensal, renovação, doações de bens e serviços na Pata Solidária." },
    { property: "og:title", content: "Minha contribuição — Pata Solidária" },
    { property: "og:description", content: "Sua área de colaborador e doador." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  beforeLoad: async () => {
    // Só quem está logado vê a própria área.
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
  },
  loader: async () => {
    const { data } = await supabase.auth.getUser();
    const u = data.user!;
    return {
      userId: u.id,
      email: u.email ?? "",
      nome: String(u.user_metadata?.["nome"] ?? "").trim() || (u.email ?? "").split("@")[0] || "",
    };
  },
  component: Usuario,
});

const tabs = [{ id: "inicio", l: "Início", i: Home }, { id: "bens", l: "Bens", i: Package }, { id: "serv", l: "Serviços", i: HeartHandshake }, { id: "dados", l: "Meus dados", i: User }] as const;

function Usuario() {
  useAuthStateSync();
  const { userId, email, nome } = Route.useLoaderData();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("inicio");
  const [modal, setModal] = useState<null | "contrib" | "pag" | "bem" | "serv">(null);
  const close = () => setModal(null);
  const fd = (e: React.FormEvent) => { e.preventDefault(); return Object.fromEntries(new FormData(e.target as HTMLFormElement)) as any; };

  const { data: contribuicoes = [] } = useQuery({
    queryKey: ["minhas-contribuicoes", userId],
    queryFn: async (): Promise<Donor[]> => {
      const { data, error } = await supabase.from("contributions").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((c) => ({ id: c.id, nome: c.nome, email: c.email, valor: Number(c.valor), forma: c.forma, vencimento: c.vencimento }));
    },
  });
  const { data: bens = [] } = useQuery({
    queryKey: ["meus-bens", userId],
    queryFn: async (): Promise<Bem[]> => {
      const { data, error } = await supabase.from("bens").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((b) => ({ id: b.id, item: b.item, qtd: b.qtd, doador: b.doador, data: b.data }));
    },
  });
  const { data: servs = [] } = useQuery({
    queryKey: ["meus-servicos", userId],
    queryFn: async (): Promise<Servico[]> => {
      const { data, error } = await supabase.from("servicos").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((s) => ({ id: s.id, quem: s.quem, o_que: s.o_que, data: s.data, horas: s.horas }));
    },
  });
  const { data: prefs } = useQuery({
    queryKey: ["minhas-preferencias", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("preferences").select("*").eq("user_id", userId).maybeSingle();
      if (error) throw error;
      return data ?? { user_id: userId, email: true, whatsapp: false, antecedencia: 15 };
    },
  });

  const gravar = useMutation({
    mutationFn: async ({ tabela, row }: { tabela: "contributions" | "bens" | "servicos"; row: Record<string, unknown> }) => {
      const { error } = await (supabase.from(tabela) as any).insert({ ...row, user_id: userId });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries(); toast.success("Salvo no seu cadastro."); close(); },
    onError: (e: Error) => toast.error("Não foi possível salvar: " + e.message),
  });

  const atualizarPagamento = useMutation({
    mutationFn: async ({ id, forma }: { id: string; forma: string }) => {
      const { data, error } = await supabase.from("contributions").update({ forma }).eq("id", id).select("vencimento").single();
      if (error) throw error;
      const { error: e2 } = await supabase.from("contributions").update({ vencimento: proximoVencimento(data.vencimento) }).eq("id", id);
      if (e2) throw e2;
    },
    onSuccess: () => { queryClient.invalidateQueries(); toast.success("Forma de pagamento atualizada."); close(); },
    onError: (e: Error) => toast.error("Não foi possível atualizar: " + e.message),
  });

  const gravarPrefs = useMutation({
    mutationFn: async (patch: { email?: boolean; whatsapp?: boolean; antecedencia?: number }) => {
      const { error } = await supabase.from("preferences").update(patch).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(),
    onError: (e: Error) => toast.error("Não foi possível salvar: " + e.message),
  });

  const ativa = contribuicoes[0];
  const status = ativa ? statusDe(ativa.vencimento) : null;
  const dias = ativa ? Math.round((new Date(ativa.vencimento + "T12:00:00").getTime() - Date.now()) / 86400000) : null;

  const Lista = ({ items, empty, btnLabel, m, render }: { items: { id: string; data: string }[]; empty: string; btnLabel: string; m: "bem" | "serv"; render: (x: any) => React.ReactNode }) => (
    <div className="space-y-3">
      {items.map((x) => <div key={x.id} className="rounded-2xl border bg-card p-4">{render(x)}</div>)}
      {!items.length && <p className="rounded-2xl border bg-card p-6 text-center text-muted-foreground">{empty}</p>}
      <button className={`${btn.accent} w-full`} onClick={() => setModal(m)}><Plus className="h-4 w-4" />{btnLabel}</button>
    </div>
  );

  return (
    <div className="mx-auto min-h-screen max-w-xl bg-background pb-24 md:my-6 md:min-h-0 md:rounded-[2rem] md:border md:shadow-soft">
      <div className="flex items-center justify-between gap-2 border-b px-5 py-3">
        <Link to="/" className="text-sm font-bold">← Voltar ao site</Link>
        <button onClick={async () => { await signOut(queryClient); navigate({ to: "/auth", replace: true }); }} className="inline-flex items-center gap-1 text-sm font-bold"><LogOut className="h-4 w-4" />Sair</button>
      </div>
      <div className="flex items-center justify-between px-5 pt-4"><Logo className="h-14" /></div>

      <main className="space-y-5 p-5">
        {tab === "inicio" && (<>
          <h1 className="text-3xl font-bold">Olá, {nome.split(" ")[0]}!</h1>
          {ativa ? (
            <>
              <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-soft">
                <p className="text-sm opacity-80">Minha contribuição mensal</p>
                <p className="font-display text-5xl font-bold">{brl(ativa.valor)}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div><p className="opacity-70">Pagamento</p><p className="font-bold">{ativa.forma}</p></div>
                  <div><p className="opacity-70">Próxima renovação</p><p className="font-bold">{dataBR(ativa.vencimento)}</p></div>
                </div>
              </div>
              {status !== "Ativo" ? (
                <div className="rounded-3xl bg-warning p-5 text-warning-foreground">
                  <p className="flex items-center gap-2 font-bold"><BellRing className="h-5 w-5" />{status === "Vencido" ? "Sua contribuição está vencida" : `Sua renovação vence em ${dias} dias`}</p>
                  <p className="mt-1 text-sm">Atualize sua forma de pagamento para continuar ajudando.</p>
                  <button className={`${btn.primary} mt-3 w-full`} onClick={() => setModal("pag")}>Atualizar forma de pagamento</button>
                </div>
              ) : <p className="rounded-3xl bg-success p-5 font-bold text-success-foreground">Tudo certo! Sua contribuição está em dia.</p>}
            </>
          ) : (
            <div className="rounded-3xl border bg-card p-6">
              <h2 className="text-lg font-bold">Você ainda não tem contribuição registrada</h2>
              <p className="mt-1 text-sm text-muted-foreground">Cadastre sua contribuição mensal para acompanhar vencimentos e receber avisos.</p>
              <button className={`${btn.accent} mt-4 w-full`} onClick={() => setModal("contrib")}><Plus className="h-4 w-4" />Registrar contribuição</button>
            </div>
          )}
          {contribuicoes.length > 1 && (
            <div className="rounded-3xl border bg-card">
              <p className="border-b p-4 font-bold">Outras contribuições</p>
              {contribuicoes.slice(1).map((c) => <div key={c.id} className="flex items-center justify-between border-b p-4 last:border-b-0"><span>{dataBR(c.vencimento)}</span><b>{brl(c.valor)}</b><StatusBadge s={statusDe(c.vencimento)} /></div>)}
            </div>
          )}
        </>)}

        {tab === "bens" && (<>
          <h1 className="text-2xl font-bold">Minhas doações de bens</h1>
          <Lista items={bens} empty="Nenhuma doação ainda." btnLabel="Registrar doação de bens" m="bem"
            render={(b) => <><p className="font-bold">{b.item}</p><p className="text-sm text-muted-foreground">{b.qtd} · {dataBR(b.data)}</p></>} />
        </>)}

        {tab === "serv" && (<>
          <h1 className="text-2xl font-bold">Meus serviços prestados</h1>
          <Lista items={servs} empty="Nenhum serviço ainda." btnLabel="Registrar serviço" m="serv"
            render={(s) => <><p className="font-bold">{s.o_que}</p><p className="text-sm text-muted-foreground">{s.horas} h · {dataBR(s.data)}</p></>} />
        </>)}

        {tab === "dados" && (<>
          <h1 className="text-2xl font-bold">Meus dados</h1>
          <div className="rounded-3xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">Nome</p><p className="font-bold">{nome}</p>
            <p className="mt-3 text-sm text-muted-foreground">E-mail</p><p className="font-bold">{email}</p>
          </div>
          {prefs && (
            <div className="space-y-4 rounded-3xl border bg-card p-5">
              <p className="font-bold">Preferências de lembrete</p>
              <div className="flex items-center justify-between"><span id="email">Lembrete por e-mail</span>
                <Switch aria-labelledby="email" checked={prefs.email} disabled={gravarPrefs.isPending} onCheckedChange={(c) => gravarPrefs.mutate({ email: c })} /></div>
              <div className="flex items-center justify-between"><span id="whats">Lembrete por WhatsApp</span>
                <Switch aria-labelledby="whats" checked={prefs.whatsapp} disabled={gravarPrefs.isPending} onCheckedChange={(c) => gravarPrefs.mutate({ whatsapp: c })} /></div>
              <label className="flex items-center justify-between gap-3 text-sm font-semibold">Avisar
                <input type="number" min={1} max={60} defaultValue={prefs.antecedencia} onBlur={(e) => gravarPrefs.mutate({ antecedencia: Number(e.target.value) })}
                  className="w-20 rounded-xl border border-input bg-background px-3 py-2 text-right" /> dias antes
              </label>
            </div>
          )}
        </>)}
      </main>

      <nav aria-label="Menu inferior" className="fixed inset-x-0 bottom-0 z-30 mx-auto grid max-w-xl grid-cols-4 border-t bg-card md:rounded-b-[2rem]">
        {tabs.map((t) => <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id} className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${tab === t.id ? "text-accent-foreground" : "text-muted-foreground"}`}><span className={`rounded-full px-4 py-1 ${tab === t.id ? "bg-accent" : ""}`}><t.i className="h-5 w-5" /></span>{t.l}</button>)}
      </nav>

      <Modal open={modal === "contrib"} onClose={close} title="Registrar contribuição">
        <form onSubmit={(e) => { const v = fd(e); gravar.mutate({ tabela: "contributions", row: { nome, email, valor: Number(v.valor), forma: v.forma, vencimento: v.venc } }); }}>
          <Field label="Valor mensal (R$)" name="valor" type="number" min="1" required />
          <label className="mb-3 block text-sm font-semibold">Forma de pagamento
            <select name="forma" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 font-normal"><option>Cartão de crédito</option><option>PIX recorrente</option><option>Boleto</option></select></label>
          <Field label="Primeiro vencimento" name="venc" type="date" required />
          <button className={`${btn.primary} w-full`}>Salvar</button>
        </form>
      </Modal>

      <Modal open={modal === "pag"} onClose={close} title="Atualizar forma de pagamento">
        <form onSubmit={(e) => { const v = fd(e); atualizarPagamento.mutate({ id: ativa!.id, forma: v.forma }); }}>
          <label className="mb-3 block text-sm font-semibold">Forma de pagamento
            <select name="forma" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 font-normal"><option>Cartão de crédito</option><option>PIX recorrente</option><option>Boleto</option></select></label>
          <p className="mb-3 text-sm text-muted-foreground">A renovação será confirmada e o próximo vencimento calculado em 30 dias.</p>
          <button className={`${btn.primary} w-full`}>Confirmar atualização</button>
        </form>
      </Modal>

      <Modal open={modal === "bem"} onClose={close} title="Registrar doação de bens">
        <form onSubmit={(e) => { const v = fd(e); gravar.mutate({ tabela: "bens", row: { item: v.item, qtd: v.qtd, doador: nome, data: new Date().toISOString().slice(0, 10) } }); }}>
          <Field label="Item" name="item" required /><Field label="Quantidade" name="qtd" required />
          <button className={`${btn.primary} w-full`}>Registrar</button></form>
      </Modal>

      <Modal open={modal === "serv"} onClose={close} title="Registrar serviço">
        <form onSubmit={(e) => { const v = fd(e); gravar.mutate({ tabela: "servicos", row: { quem: nome, o_que: v.o_que, data: new Date().toISOString().slice(0, 10), horas: Number(v.horas) } }); }}>
          <Field label="O que você fez?" name="o_que" required /><Field label="Horas" name="horas" type="number" min="1" required />
          <button className={`${btn.primary} w-full`}>Registrar</button></form>
      </Modal>
    </div>
  );
}