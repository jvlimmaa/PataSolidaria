export type Status = "Ativo" | "Vencendo em breve" | "Vencido";
export type Donor = { id: number; nome: string; email: string; valor: number; forma: string; vencimento: string; status: Status };

export const initialDonors: Donor[] = [
  { id: 1, nome: "Marina Souza", email: "marina@exemplo.com", valor: 50, forma: "Cartão de crédito", vencimento: "2026-11-20", status: "Ativo" },
  { id: 2, nome: "Carlos Almeida", email: "carlos@exemplo.com", valor: 30, forma: "PIX recorrente", vencimento: "2026-10-22", status: "Vencendo em breve" },
  { id: 3, nome: "Helena Prado", email: "helena@exemplo.com", valor: 100, forma: "Cartão de crédito", vencimento: "2026-10-18", status: "Vencendo em breve" },
  { id: 4, nome: "Rafael Nogueira", email: "rafael@exemplo.com", valor: 25, forma: "Boleto", vencimento: "2026-09-30", status: "Vencido" },
  { id: 5, nome: "Beatriz Lima", email: "beatriz@exemplo.com", valor: 75, forma: "PIX recorrente", vencimento: "2026-12-05", status: "Ativo" },
  { id: 6, nome: "Tiago Ferreira", email: "tiago@exemplo.com", valor: 40, forma: "Cartão de crédito", vencimento: "2026-10-27", status: "Vencendo em breve" },
];

export type Bem = { id: number; item: string; qtd: string; doador: string; data: string };
export const initialBens: Bem[] = [
  { id: 1, item: "Ração para cães adultos", qtd: "20 kg", doador: "Marina Souza", data: "2026-10-05" },
  { id: 2, item: "Cobertores", qtd: "12 un.", doador: "Beatriz Lima", data: "2026-10-08" },
  { id: 3, item: "Areia higiênica", qtd: "8 pacotes", doador: "Tiago Ferreira", data: "2026-10-10" },
  { id: 4, item: "Caixas de transporte", qtd: "3 un.", doador: "Helena Prado", data: "2026-10-12" },
];

export type Servico = { id: number; quem: string; o_que: string; data: string; horas: number };
export const initialServicos: Servico[] = [
  { id: 1, quem: "Lucas Martins", o_que: "Passeio com os cães do abrigo", data: "2026-10-04", horas: 3 },
  { id: 2, quem: "Ana Beatriz", o_que: "Fotos para campanha de adoção", data: "2026-10-07", horas: 2 },
  { id: 3, quem: "Dr. Paulo (voluntário)", o_que: "Triagem veterinária", data: "2026-10-09", horas: 4 },
  { id: 4, quem: "Camila Rocha", o_que: "Organização da feira de adoção", data: "2026-10-11", horas: 5 },
];

export const meses = [
  { m: "Mai", v: 1850 }, { m: "Jun", v: 2100 }, { m: "Jul", v: 1980 },
  { m: "Ago", v: 2400 }, { m: "Set", v: 2650 }, { m: "Out", v: 2900 },
];

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const dataBR = (iso: string) => iso.split("-").reverse().join("/");
