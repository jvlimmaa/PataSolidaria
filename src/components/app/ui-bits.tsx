import { useEffect, useRef, useState, type ReactNode } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import logo from "@/assets/logo-pata-solidaria-limpa.png.asset.json";
import type { Status } from "@/lib/demo-data";

export const Logo = ({ className = "h-10" }: { className?: string }) => (
  <img src={logo.url} alt="Pata Solidária" className={`${className} w-auto`} />
);

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("input,select,button,textarea")?.focus();
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    return () => { document.removeEventListener("keydown", h); prev?.focus(); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-4 sm:items-center" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className="reveal w-full max-w-md rounded-3xl bg-card p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Fechar" className="rounded-full p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const Field = ({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="mb-3 block text-sm font-semibold">
    {label}
    <input {...p} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 font-normal" />
  </label>
);

export const PasswordField = ({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => {
  const [ver, setVer] = useState(false);
  return (
    <label className="mb-3 block text-sm font-semibold">
      {label}
      <span className="relative mt-1 block">
        <input {...p} type={ver ? "text" : "password"} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 pr-11 font-normal" />
        <button
          type="button"
          onClick={() => setVer((v) => !v)}
          aria-pressed={ver}
          aria-label={ver ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {ver ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </span>
    </label>
  );
};

export const btn = {
  primary: "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90",
  accent: "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition hover:brightness-95",
  ghost: "inline-flex items-center justify-center gap-2 rounded-full border border-input bg-card px-5 py-2.5 text-sm font-bold transition hover:bg-muted",
};

export const StatusBadge = ({ s }: { s: Status }) => {
  const c = s === "Ativo" ? "bg-success text-success-foreground" : s === "Vencido" ? "bg-destructive/15 text-destructive" : "bg-warning text-warning-foreground";
  return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${c}`}>{s}</span>;
};

export const DemoTag = () => (
  <span className="rounded-full bg-warning px-3 py-1 text-xs font-bold text-warning-foreground">Dados fictícios de demonstração</span>
);
