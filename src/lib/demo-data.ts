export type Status = "Ativo" | "Vencendo em breve" | "Vencido";
export type Donor = { id: string; nome: string; email: string; valor: number; forma: string; vencimento: string };
export type Bem = { id: string; item: string; qtd: string; doador: string; data: string };
export type Servico = { id: string; quem: string; o_que: string; data: string; horas: number };

export const meses = [
  { m: "Mai", v: 1850 }, { m: "Jun", v: 2100 }, { m: "Jul", v: 1980 },
  { m: "Ago", v: 2400 }, { m: "Set", v: 2650 }, { m: "Out", v: 2900 },
];

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const dataBR = (iso: string) => iso.split("-").reverse().join("/");

/** Status calculado a partir da data de vencimento (não é salvo no banco). */
export function statusDe(vencimento: string, hoje = new Date()): Status {
  const dias = Math.round((new Date(vencimento + "T12:00:00").getTime() - hoje.getTime()) / 86400000);
  if (dias < 0) return "Vencido";
  if (dias <= 30) return "Vencendo em breve";
  return "Ativo";
}

/** Renova a data de vencimento em 30 dias a partir do vencimento atual (ou de hoje). */
export function proximoVencimento(vencimento: string, hoje = new Date()): string {
  const base = new Date(vencimento + "T12:00:00").getTime() > hoje.getTime() ? new Date(vencimento + "T12:00:00") : hoje;
  const d = new Date(base.getTime() + 30 * 86400000);
  return d.toISOString().slice(0, 10);
}
