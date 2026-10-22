import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Chrome } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Logo, Field, btn } from "@/components/app/ui-bits";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Entrar — Pata Solidária" },
    { name: "description", content: "Crie sua conta ou entre no sistema da Pata Solidária para acompanhar contribuições, bens e serviços." },
    { property: "og:title", content: "Entrar — Pata Solidária" },
    { property: "og:description", content: "Crie sua conta ou entre no sistema da Pata Solidária." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  beforeLoad: async () => {
    // Usuários já logados vão direto para a tela deles.
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
      throw redirect({ to: roles?.some((r) => r.role === "gestor") ? "/gestor" : "/usuario" });
    }
  },
  component: AuthPage,
});

async function landingFor(userId: string): Promise<"/gestor" | "/usuario"> {
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  return roles?.some((r) => r.role === "gestor") ? "/gestor" : "/usuario";
}

function AuthPage() {
  const navigate = useNavigate();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [busy, setBusy] = useState(false);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const v = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as { email: string; senha: string };
    const { data, error } = await supabase.auth.signInWithPassword({ email: v.email, password: v.senha });
    setBusy(false);
    if (error) { toast.error("Não foi possível entrar: " + error.message); return; }
    if (data.user) navigate({ to: await landingFor(data.user.id), replace: true });
  };

  const criar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const v = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as { nome: string; email: string; senha: string };
    const { data, error } = await supabase.auth.signUp({
      email: v.email, password: v.senha,
      options: { data: { nome: v.nome }, emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    if (error) { toast.error("Não foi possível criar a conta: " + error.message); return; }
    if (data.user && data.session) navigate({ to: await landingFor(data.user.id), replace: true });
    else toast.success("Conta criada! Agora entre com seu e-mail e senha.");
  };

  const google = async () => {
    // Redireciona para o Google e volta ao site; a sessão é detectada ao retornar.
    const r = await (await import("@/integrations/lovable")).lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) toast.error("Não foi possível iniciar o login com Google: " + r.error.message);
  };

  return (
    <main className="bg-hero flex min-h-screen flex-col items-center px-5 py-8">
      <div className="flex w-full max-w-md items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft className="h-4 w-4" /> Voltar ao site</Link>
      </div>
      <Logo className="mt-6 h-24" />
      <div className="mt-4 w-full max-w-md rounded-3xl border bg-card p-6 shadow-soft">
        <div className="mb-5 flex rounded-full bg-muted p-1 text-sm font-bold">
          {(["entrar", "criar"] as const).map((m) => (
            <button key={m} onClick={() => setModo(m)} aria-pressed={modo === m}
              className={`flex-1 rounded-full py-2 transition ${modo === m ? "bg-card shadow" : "text-muted-foreground"}`}>
              {m === "entrar" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        {modo === "entrar" ? (
          <form onSubmit={entrar}>
            <Field label="E-mail" name="email" type="email" required autoComplete="email" />
            <Field label="Senha" name="senha" type="password" required autoComplete="current-password" />
            <button disabled={busy} className={`${btn.primary} w-full`}>{busy ? "Entrando..." : "Entrar"}</button>
          </form>
        ) : (
          <form onSubmit={criar}>
            <Field label="Nome" name="nome" required autoComplete="name" />
            <Field label="E-mail" name="email" type="email" required autoComplete="email" />
            <Field label="Senha" name="senha" type="password" required minLength={6} autoComplete="new-password" />
            <button disabled={busy} className={`${btn.primary} w-full`}>{busy ? "Criando..." : "Criar conta"}</button>
          </form>
        )}

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />ou<span className="h-px flex-1 bg-border" /></div>
        <button onClick={google} disabled={busy} className={`${btn.ghost} w-full`}><Chrome className="h-4 w-4" />Continuar com Google</button>
      </div>
      <p className="mt-4 max-w-md text-center text-sm text-muted-foreground">
        Ao criar conta no site, você entra como Colaborador/Doador. O acesso ao painel do Gestor é liberado pela equipe.
      </p>
    </main>
  );
}
