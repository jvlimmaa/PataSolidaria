import { describe, expect, it } from "vitest";
import { isNewAccount, META_PIXEL_ID } from "@/lib/meta-pixel";

describe("Medição de cadastros na Meta", () => {
  const agora = Date.parse("2026-11-13T12:00:00Z");
  it("conta como cadastro novo uma conta criada há 5 minutos", () => {
    expect(isNewAccount("2026-11-13T11:55:00Z", agora)).toBe(true);
  });
  it("não conta um login de conta criada há 1 hora", () => {
    expect(isNewAccount("2026-11-13T11:00:00Z", agora)).toBe(false);
  });
  it("usa o pixel Pata Solidaria escolhido para a campanha", () => {
    expect(META_PIXEL_ID).toBe("1484799986947265");
  });
});
