import { describe, expect, it } from "vitest";
import { createReportCsv, csvCell } from "@/lib/report-csv";

describe("Report CSV", () => {
  it("exports actual contribution amounts and donated goods and hours", () => {
    const csv = createReportCsv(
      [{ id: "1", nome: "Ana", email: "ana@example.com", valor: 30, forma: "Cartão", vencimento: "2026-12-01" }],
      [{ id: "2", item: "Ração", qtd: "2 kg", doador: "Ana", data: "2026-11-10" }],
      [{ id: "3", quem: "Ana", o_que: "Passeio", horas: 2, data: "2026-11-10" }],
    );
    expect(csv).toContain('"30,00"');
    expect(csv).toContain('"Ração";"";"2 kg"');
    expect(csv).toContain('"Passeio";"";"";"2"');
    expect(createReportCsv([], [], []).split("\r\n")).toHaveLength(1);
  });
  it("escapes quotes and neutralizes spreadsheet formula input", () => {
    expect(csvCell('=HYPERLINK("x")')).toBe('"\'=HYPERLINK(""x"")"');
    expect(csvCell("Ana; Souza")).toBe('"Ana; Souza"');
  });
});