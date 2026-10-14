import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Heart, ArrowLeft } from "lucide-react";
import { Logo, DemoTag } from "@/components/app/ui-bits";

export const Route = createFileRoute("/acesso")({
  head: () => ({ meta: [
    { title: "Acesso ao protótipo — Pata Solidária" },
    { name: "description", content: "Escolha entrar como Gestor da ONG ou como Colaborador/Doador no protótipo com dados fictícios." },
    { property: "og:title", content: "Acesso ao protótipo — Pata Solidária" },
    { property: "og:description", content: "Escolha um perfil e explore o sistema." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Acesso,
});

function Acesso() {
  return (
    <main className="bg-hero flex min-h-screen flex-col items-center px-5 py-8">
      <div className="flex w-full max-w-3xl items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft className="h-4 w-4" /> Voltar ao site</Link>
        <DemoTag />
      </div>
      <Logo className="mt-6 h-28" />
      <h1 className="mt-2 text-center text-3xl font-bold">Como você quer entrar?</h1>
      <p className="mt-1 text-muted-foreground">Acesso simulado, sem login real.</p>
      <div className="mt-8 grid w-full max-w-3xl gap-5 md:grid-cols-2">
        {[
          { to: "/gestor", i: Building2, t: "Entrar como Gestor da ONG", d: "Painel administrativo: doadores, bens, serviços, alertas e relatórios." },
          { to: "/usuario", i: Heart, t: "Entrar como Colaborador/Doador", d: "Minha contribuição, renovação, histórico e meus dados." },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="group rounded-3xl border bg-card p-7 shadow-soft transition hover:-translate-y-1 hover:border-accent">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground"><c.i className="h-7 w-7" /></div>
            <h2 className="text-xl font-bold">{c.t}</h2><p className="mt-1 text-muted-foreground">{c.d}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
