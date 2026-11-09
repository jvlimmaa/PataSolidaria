import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";
import { Logo, btn } from "@/components/app/ui-bits";

export const Route = createFileRoute("/doacao/sucesso")({
  head: () => ({
    meta: [
      { title: "Obrigado pela doação — Pata Solidária" },
      { name: "description", content: "Sua doação foi recebida. Obrigado por apoiar a Pata Solidária." },
      { property: "og:title", content: "Obrigado pela doação — Pata Solidária" },
      { property: "og:description", content: "Sua doação foi recebida. Obrigado por apoiar a Pata Solidária." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DoacaoSucesso,
});

function DoacaoSucesso() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-5">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-soft">
        <Logo className="mx-auto h-16" />
        <div className="mx-auto mt-6 grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground">
          <HeartHandshake className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl font-bold">Muito obrigado!</h1>
        <p className="mt-2 text-muted-foreground">
          Sua doação foi recebida com sucesso. Cada contribuição ajuda a manter o trabalho das ONGs de causa animal.
        </p>
        <Link to="/" className={`${btn.primary} mt-6 w-full`}>Voltar ao início</Link>
      </div>
    </div>
  );
}
