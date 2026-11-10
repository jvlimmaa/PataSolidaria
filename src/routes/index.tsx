import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Menu, X, FileSpreadsheet, CopyX, BellOff, SearchX, HandCoins, Package, HeartHandshake, BellRing, LayoutDashboard, History, Check, ArrowRight, ShieldCheck, Gauge, Repeat, Sprout, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Logo, btn, Field } from "@/components/app/ui-bits";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { createDonationCheckout } from "@/lib/doacao.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pata Solidária — gestão integrada para ONGs" },
      { name: "description", content: "Acompanhe contribuições, bens e serviços de voluntários na Pata Solidária e apoie a causa animal." },
      { property: "og:title", content: "Pata Solidária — gestão integrada para ONGs" },
      { property: "og:description", content: "Contribuições, bens e serviços em um só lugar. Apoie a causa animal com a Pata Solidária." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.1 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`${className} transition-all duration-700 ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>{children}</div>;
}

const Section = ({ id, title, sub, children, tone }: { id: string; title: string; sub?: string; children: ReactNode; tone?: boolean }) => (
  <section id={id} className={`scroll-mt-20 px-5 py-16 sm:py-20 ${tone ? "bg-secondary" : ""}`}>
    <div className="mx-auto max-w-6xl">
      <Reveal><h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">{title}</h2>
        {sub && <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{sub}</p>}</Reveal>
      <div className="mt-10">{children}</div>
    </div>
  </section>
);

const Card = ({ icon: I, t, d }: { icon: typeof Package; t: string; d: string }) => (
  <Reveal className="h-full rounded-3xl border bg-card p-6 shadow-soft">
    <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary"><I className="h-6 w-6" /></div>
    <h3 className="text-lg font-bold">{t}</h3><p className="mt-1 text-muted-foreground">{d}</p>
  </Reveal>
);

const nav = [["problema", "Problema"], ["solucao", "Solução"], ["funcionalidades", "Funcionalidades"], ["perfis", "Perfis"], ["origem", "Origem"], ["doar", "Doar"], ["faq", "FAQ"], ["contato", "Contato"]];

function Home() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <header className="fixed inset-x-0 top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#topo" aria-label="Pata Solidária, início"><Logo className="h-14" /></a>
          <nav aria-label="Principal" className="hidden items-center gap-6 text-sm font-semibold lg:flex">
            {nav.map(([id, l]) => <a key={id} href={`#${id}`} className="hover:text-accent">{l}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/acesso" className={`${btn.accent} hidden sm:inline-flex`}>Experimente o sistema</Link>
            <button className="rounded-full p-2 lg:hidden" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        {open && (
          <nav aria-label="Menu móvel" className="flex flex-col gap-1 border-t bg-background px-5 py-3 lg:hidden">
            {nav.map(([id, l]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 font-semibold hover:bg-muted">{l}</a>)}
            <Link to="/acesso" className={`${btn.accent} mt-2`}>Experimente o sistema</Link>
          </nav>
        )}
      </header>

      <main id="topo">
        <section className="bg-hero px-5 pb-16 pt-28 sm:pt-36">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div className="reveal">
              <p className="mb-4 inline-block rounded-full bg-secondary px-4 py-1 text-sm font-bold text-primary">Gestão para ONGs de causa animal</p>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">Centralize e automatize a gestão da sua ONG.</h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">Contribuições, bens e serviços de voluntários em um só lugar — com acompanhamento dos vencimentos para cuidar de cada doador.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/acesso" className={btn.accent}>Experimente o sistema <ArrowRight className="h-4 w-4" /></Link>
                <a href="#problema" className={btn.ghost}>Saiba mais</a>
              </div>
            </div>
            <DashMock />
          </div>
        </section>

        <Section id="problema" title="Planilhas espalhadas custam doadores." sub="Controlar tudo à mão funciona até o dia em que uma renovação passa despercebida.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Card icon={BellOff} t="Sem alertas de renovação" d="Ninguém avisa que o meio de pagamento do doador está perto de expirar." />
            <Card icon={CopyX} t="Dados duplicados" d="O mesmo doador aparece em várias planilhas, com informações diferentes." />
            <Card icon={FileSpreadsheet} t="Erros manuais" d="Digitar e copiar valores abre espaço para falhas difíceis de achar." />
            <Card icon={SearchX} t="Pouca rastreabilidade" d="Difícil saber quem contribuiu, quando e de que forma." />
          </div>
        </Section>

        <Section id="solucao" title="Antes e depois." tone>
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal className="rounded-3xl border bg-card p-6">
              <p className="mb-3 font-bold text-muted-foreground">Antes: planilhas</p>
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                {["Maria S. | 50 | ?? | 11/2", "maria souza | 50,00 | cartao", "Carlos A. | | pix | venceu?", "Helena P. | 100 | ..."].map((r) => <div key={r} className="rounded border border-dashed px-2 py-1.5">{r}</div>)}
              </div>
            </Reveal>
            <Reveal className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-soft">
              <p className="mb-3 font-bold">Depois: Pata Solidária</p>
              <ul className="space-y-3">
                {["Registros reunidos por doador", "Aviso de possível duplicidade", "Acompanhamento das renovações", "Histórico de contribuições"].map((t) => <li key={t} className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-accent" />{t}</li>)}
              </ul>
            </Reveal>
          </div>
        </Section>

        <Section id="funcionalidades" title="Tudo que a gestão precisa.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card icon={HandCoins} t="Gestão de contribuições" d="Doadores mensais e pontuais, valores, formas de pagamento e vencimentos." />
            <Card icon={Package} t="Doações de bens" d="Registre ração, cobertores e outros itens recebidos, com doador e data." />
            <Card icon={HeartHandshake} t="Serviços de colaboradores" d="Horas e atividades de voluntários e colaboradores sempre registradas." />
            <Card icon={BellRing} t="Alertas e lembretes" d="Acompanhe os vencimentos e registre lembretes para seus doadores." />
            <Card icon={LayoutDashboard} t="Painel consolidado" d="Indicadores e evolução das contribuições em uma tela só." />
            <Card icon={History} t="Histórico e rastreabilidade" d="Cada contribuição e cada alteração, fácil de consultar." />
          </div>
        </Section>

        <Section id="perfis" title="Dois perfis, duas telas." sub="Gestores e colaboradores acompanham seus registros com acesso individual." tone>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { t: "Gestor da ONG", to: "/gestor", items: ["Visão geral e indicadores", "Cadastro de doadores com checagem de duplicidade", "Bens e serviços", "Envio de lembretes e relatórios"] },
              { t: "Colaborador / Doador", to: "/usuario", items: ["Resumo da minha contribuição", "Aviso de renovação e atualização do pagamento", "Histórico, doações de bens e serviços", "Preferências de lembrete"] },
            ].map((p) => (
              <Reveal key={p.t} className="flex flex-col rounded-3xl border bg-card p-7 shadow-soft">
                <h3 className="text-2xl font-bold">{p.t}</h3>
                <ul className="my-5 flex-1 space-y-2">{p.items.map((i) => <li key={i} className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-primary" />{i}</li>)}</ul>
                <Link to={p.to} className={btn.primary}>Abrir tela do {p.t.split(" ")[0]}</Link>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="como" title="Como funciona.">
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {["Cadastro do doador", "Registro das contribuições", "Acompanhamento no painel", "Consulta dos vencimentos", "Atualização do registro"].map((s, i) => (
              <Reveal key={s} className="rounded-3xl border bg-card p-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent font-display text-lg font-bold text-accent-foreground">{i + 1}</span>
                <p className="mt-3 font-bold">{s}</p>
              </Reveal>
            ))}
          </ol>
        </Section>

        <Section id="beneficios" title="O que muda na rotina." tone>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <Card icon={ShieldCheck} t="Integridade" d="Dados consistentes, sem duplicidades." />
            <Card icon={History} t="Rastreabilidade" d="Todo fluxo registrado." />
            <Card icon={Gauge} t="Eficiência" d="Menos tarefas manuais." />
            <Card icon={Repeat} t="Retenção" d="Renovações no prazo." />
            <Card icon={Sprout} t="Sustentabilidade" d="Receita mais previsível." />
          </div>
        </Section>

        <Section id="origem" title="Como o projeto nasceu." sub="Da conversa com quem vive o problema todos os dias.">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["Brainstorming", "Levantamento de demandas sociais locais, onde surgiu a dor recorrente em ONGs de causa animal."],
              ["Diagnóstico", "Conversa direta com a gestão da UPAR (União Protetora dos Animais da Região de Indaiatuba), que participou do diagnóstico e confirmou as dificuldades do uso de planilhas."],
              ["Entrevistas", "Gestores, ex-funcionários de ONGs e voluntários da causa animal."],
              ["Benchmarking", "Análise de soluções brasileiras existentes."],
            ].map(([t, d], i) => (
              <Reveal key={t} className="rounded-3xl border-t-4 border-accent bg-card p-5 shadow-soft">
                <p className="text-sm font-bold text-accent-foreground/70">Etapa {i + 1}</p>
                <h3 className="text-lg font-bold">{t}</h3><p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">A UPAR participou apenas do diagnóstico; não há parceria oficial, aval ou depoimento.</p>
        </Section>

        <Section id="mercado" title="Panorama do mercado." tone>
          <Reveal><p className="max-w-3xl text-lg text-muted-foreground">Soluções como ONGFácil, HYB e Nexus Social já centralizam cadastros de doadores, voluntários e beneficiários e tratam de adequações fiscais. A Pata Solidária foca em outro ponto: a automação do fluxo financeiro, os alertas de renovação e a simplicidade de uso.</p></Reveal>
        </Section>

        <Section id="doar" title="Contribua com o que você tem ou pode." sub="Toda doação faz diferença para os animais. Escolha o valor e doe com segurança pelo cartão." tone>
          <DoarCard />
        </Section>

        <Section id="faq" title="Perguntas frequentes.">
          <Accordion type="single" collapsible className="max-w-3xl rounded-3xl border bg-card px-6">
            {[
              ["O sistema já está disponível?", "Sim. Você pode criar uma conta para acompanhar contribuições, bens e serviços. O acesso de gestor é liberado pela equipe."],
              ["Meus registros ficam salvos?", "Sim. Os registros ficam salvos na sua conta. O gestor acompanha os dados da ONG e cada colaborador acessa seus próprios registros."],
              ["Como funcionam os lembretes?", "O gestor acompanha os vencimentos e registra lembretes. O envio por e-mail e WhatsApp ainda não está disponível."],
              ["Como evita cadastros duplicados?", "Ao cadastrar um doador, o sistema avisa se o e-mail já existe na lista."],
              ["Funciona no celular?", "Sim. A tela do Colaborador foi pensada primeiro para o celular."],
              ["Serve só para causa animal?", "Nasceu nesse contexto, mas o fluxo pode atender outras ONGs."],
            ].map(([q, a]) => (
              <AccordionItem key={q} value={q ?? ""}><AccordionTrigger className="text-left text-base font-bold">{q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{a}</AccordionContent></AccordionItem>
            ))}
          </Accordion>
        </Section>

        <Section id="contato" title="Fale com a equipe." tone>
          <a href="mailto:patasolidariafatec@gmail.com" className="mb-5 inline-block break-all font-bold text-primary">patasolidariafatec@gmail.com</a>
          <form className="max-w-lg" onSubmit={(e) => {
            e.preventDefault();
            const values = new FormData(e.currentTarget);
            const subject = encodeURIComponent(`Contato Pata Solidária — ${values.get("nome")}`);
            const body = encodeURIComponent(`Nome: ${values.get("nome")}\nE-mail: ${values.get("email")}\n\n${values.get("mensagem")}`);
            window.location.href = `mailto:patasolidariafatec@gmail.com?subject=${subject}&body=${body}`;
          }}>
            <Field label="Nome" name="nome" required /><Field label="E-mail" name="email" type="email" required />
            <label className="mb-4 block text-sm font-semibold">Mensagem<textarea name="mensagem" required rows={4} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 font-normal" /></label>
            <button className={btn.primary}>Abrir e-mail</button>
          </form>
        </Section>
      </main>

      <footer className="bg-primary px-5 py-10 text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0 max-w-3xl"><p className="font-display text-xl font-bold">Pata Solidária</p><p className="text-sm opacity-80">Projeto acadêmico — equipe de desenvolvimento.</p>
            <ul className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              {["João Victor Lima dos Santos", "Felipe Marinho de Araujo", "Matheus Beccari Caldeira", "Thierry Araújo Cavalheiro", "João Mateus Massayoshi Gomes Tomazin"].map(nome => <li key={nome}>{nome}</li>)}
            </ul>
          </div>
          <p className="shrink-0 text-sm opacity-80">© 2026 Pata Solidária</p>
        </div>
      </footer>
    </div>
  );
}

function DoarCard() {
  const [valor, setValor] = useState("");
  const [carregando, setCarregando] = useState(false);
  const iniciarDoacao = useServerFn(createDonationCheckout);

  const doar = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = Math.floor(Number(valor));
    if (!Number.isFinite(v) || v < 1) { toast.error("Informe um valor de pelo menos R$ 1."); return; }
    setCarregando(true);
    try {
      const { url } = await iniciarDoacao({ data: { valor: v } });
      window.location.href = url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível iniciar a doação.");
      setCarregando(false);
    }
  };

  return (
    <Reveal className="mx-auto max-w-lg rounded-3xl border bg-card p-7 text-center shadow-soft">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground"><HandCoins className="h-7 w-7" /></div>
      <p className="mt-4 text-muted-foreground">Sem compromisso mensal — escolha o quanto puder contribuir.</p>
      <form onSubmit={doar} className="mt-5">
        <label className="block text-left text-sm font-semibold">Valor da doação (R$)
          <input type="number" min={1} step={1} required value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ex: 30"
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-lg font-normal" />
        </label>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {[10, 30, 50, 100].map((v) => (
            <button key={v} type="button" onClick={() => setValor(String(v))}
              className={`rounded-full border px-4 py-1.5 text-sm font-bold ${valor === String(v) ? "bg-accent text-accent-foreground" : "bg-background"}`}>R$ {v}</button>
          ))}
        </div>
        <button disabled={carregando} className={`${btn.accent} mt-5 w-full disabled:opacity-60`}>
          {carregando ? <Loader2 className="h-4 w-4 animate-spin" /> : <HeartHandshake className="h-4 w-4" />}
          {carregando ? "Abrindo pagamento…" : "Doar agora"}
        </button>
        <p className="mt-3 text-xs text-muted-foreground">Pagamento processado com segurança pelo Stripe.</p>
      </form>
    </Reveal>
  );
}

function DashMock() {
  const bars = [40, 55, 50, 70, 80, 95];
  return (
    <div className="reveal rounded-3xl border bg-card p-5 shadow-soft" aria-hidden="true">
      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        {[["Doadores ativos", "42"], ["Renovações", "7"], ["Bens no mês", "18"]].map(([l, v]) => <div key={l} className="rounded-2xl bg-secondary p-3"><p className="font-display text-2xl font-bold text-primary">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>)}
      </div>
      <div className="flex h-36 items-end gap-3 rounded-2xl bg-muted p-4">
        {bars.map((h, i) => <div key={i} className={`flex-1 rounded-t-lg ${i === 5 ? "bg-accent" : "bg-primary"}`} style={{ height: `${h}%` }} />)}
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-warning p-3 text-sm font-semibold text-warning-foreground"><BellRing className="h-5 w-5" /> 3 renovações vencem em breve</div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Ilustração com dados fictícios</p>
    </div>
  );
}
