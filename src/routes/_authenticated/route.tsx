import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout protegido: o gate de sessão é gerenciado pela integração do Cloud.
// Rotas filhas podem adicionar seus próprios checks (ex.: papel de gestor).
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: () => <Outlet />,
});
