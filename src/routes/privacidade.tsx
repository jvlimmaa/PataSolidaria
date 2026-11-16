import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CookieSettingsLink } from "@/components/app/cookie-banner";

export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [
    { title: "Política de privacidade — Pata Solidária" },
    { name: "description", content: "Quais dados a Pata Solidária coleta, com quem compartilha e como mudar suas escolhas de cookies." },
    { property: "og:title", content: "Política de privacidade — Pata Solidária" },
    { property: "og:description", content: "Dados coletados, compartilhamento com parceiros e suas escolhas de cookies." },
    { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Privacidade,
});

const H = ({ children }: { children: React.ReactNode }) => <h2 className="mt-8 font-display text-xl font-bold">{children}</h2>;

function Privacidade() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 leading-relaxed">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft className="h-4 w-4" /> Voltar ao site</Link>
      <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">Política de privacidade</h1>
      <p className="mt-2 text-sm text-muted-foreground">Atualizada em 13 de novembro de 2026.</p>

      <H>Dados da sua conta</H>
      <p>Quando você cria uma conta, guardamos seu nome, e-mail e os registros que você ou sua ONG cadastram (contribuições, bens doados e serviços). Se entrar com Google, recebemos seu nome e e-mail da sua conta Google.</p>

      <H>Doações</H>
      <p>Pagamentos de doação são feitos na página segura do Stripe. Não guardamos dados do cartão.</p>

      <H>Medição de visitas</H>
      <p>Contamos as visitas ao site sem cookies e sem identificar você. Se você aceitar a medição, também contamos cliques para entender como o site é usado.</p>

      <H>Publicidade (Meta)</H>
      <p>Se você permitir a publicidade, o site carrega o pixel da Meta (Facebook e Instagram), que usa cookies. Ele informa à Meta as páginas visitadas e quando uma conta nova é criada. A Meta usa isso para medir os resultados dos nossos anúncios e mostrá-los a pessoas parecidas com quem se cadastrou. Não enviamos seu nome, e-mail nem os registros da sua ONG para a Meta. Se você recusar, nada disso é enviado.</p>

      <H>Suas escolhas</H>
      <p>Você pode aceitar, recusar ou mudar suas escolhas a qualquer momento em <CookieSettingsLink className="font-semibold text-primary" />. A mudança vale na hora. Se o seu navegador enviar o sinal de privacidade (Global Privacy Control), a medição e a publicidade ficam desligadas.</p>

      <H>Contato</H>
      <p>Para pedir acesso, correção ou exclusão dos seus dados, escreva para <a className="font-semibold text-primary" href="mailto:patasolidariafatec@gmail.com">patasolidariafatec@gmail.com</a>.</p>
    </main>
  );
}
