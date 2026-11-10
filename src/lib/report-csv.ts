import type { Bem, Donor, Servico } from "./demo-data";

/** Neutralize spreadsheet formulas while preserving accented text and separators. */
export function csvCell(value: string | number): string {
  const text = String(value);
  const safe = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function createReportCsv(donors: Donor[], bens: Bem[], servicos: Servico[]): string {
  const rows: (string | number)[][] = [
    ["Tipo", "Nome / Doador", "E-mail", "Item / Atividade", "Valor (R$)", "Quantidade", "Horas", "Pagamento", "Data / Vencimento"],
    ...donors.map(d => ["Contribuição", d.nome, d.email, "", d.valor.toFixed(2).replace(".", ","), "", "", d.forma, d.vencimento]),
    ...bens.map(b => ["Bem", b.doador, "", b.item, "", b.qtd, "", "", b.data]),
    ...servicos.map(s => ["Serviço", s.quem, "", s.o_que, "", "", s.horas, "", s.data]),
  ];
  return "\uFEFF" + rows.map(row => row.map(csvCell).join(";")).join("\r\n");
}

export function downloadReportCsv(donors: Donor[], bens: Bem[], servicos: Servico[]) {
  const url = URL.createObjectURL(new Blob([createReportCsv(donors, bens, servicos)], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "pata-solidaria-relatorio.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}