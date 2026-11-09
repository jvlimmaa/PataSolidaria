import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import Stripe from "stripe";

// Preço de R$ 1,00 por unidade: a quantidade define o valor livre da doação.
const DONATION_PRICE_ID = "price_1UZswiFmDp4XUVTeYNI2XLje";

export const createDonationCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: { valor: number }) => {
    const valor = Math.floor(Number(data?.valor));
    if (!Number.isFinite(valor) || valor < 1 || valor > 100000) {
      throw new Error("Informe um valor entre R$ 1 e R$ 100.000.");
    }
    return { valor };
  })
  .handler(async ({ data }) => {
    const key = process.env["STRIPE_SECRET_KEY"];
    if (!key) throw new Error("Pagamento indisponível no momento.");

    const stripe = new Stripe(key, { apiVersion: "2026-10-28.endive" });
    const origin = getRequestHeader("origin") ?? getRequestHeader("referer")?.replace(/\/$/, "") ?? "";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: DONATION_PRICE_ID, quantity: data.valor }],
      success_url: `${origin}/doacao/sucesso`,
      cancel_url: `${origin}/#doar`,
    });

    if (!session.url) throw new Error("Não foi possível iniciar o pagamento.");
    return { url: session.url };
  });
