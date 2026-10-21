import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, Heart, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/app/ui-bits";

export const Route = createFileRoute("/acesso")({
  head: () => ({ meta: [
    { title: "Acesso ao sistema — Pata Solidária" },
    { name: "description", content: "Conheça os dois perfis do sistema Pata Solidária e crie sua conta para acompanhar contribuições, bens e serviços." },
    { property: "og:title", content: "Acesso ao sistema — Pata Solidária" },
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
      </div>
      <Logo className="mt-6 h-28" />
      <h1 className="mt-2 text-center text-3xl font-bold">Como você quer entrar?</h1>
      <p className="mt-1 text-muted-foreground">Crie sua conta ou faça login para acessar.</p>
      <div className="mt-8 grid w-full max-w-3xl gap-5 md:grid-cols-2">
        {[
          { t: "Painel do Gestor da ONG", d: "Doadores, bens, serviços, alertas e relatórios — acesso liberado pela equipe da ONG." },
          { t: "Colaborador / Doador", d: "Minha contribuição, renovação, histórico, doações de bens e serviços, preferências de lembrete." },
        ].map((c, i) => (
          <div key={i} className="rounded-3xl border bg-card p-7 shadow-soft">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground">{i === 0 ? <Building2 className="h-7 w-7" /> : <Heart className="h-7 w-7" />}</div>
            <h2 className="text-xl font-bold">{c.t}</h2><p className="mt-1 text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>
      <Link to="/auth" className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-bold text-primary-foreground transition hover:opacity-90">Entrar ou criar conta</Link>
    </main>
  );
}
