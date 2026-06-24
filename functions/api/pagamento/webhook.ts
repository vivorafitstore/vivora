import { FirestoreClient } from "../../_lib/firestore";
import { consultarOrder } from "../../_lib/mercadopago";

interface Env {
  MERCADOPAGO_ACCESS_TOKEN: string;
  MERCADOPAGO_WEBHOOK_SECRET: string;
  FIREBASE_SERVICE_ACCOUNT: string;
  FIREBASE_PROJECT_ID: string;
}

async function validarAssinatura(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string | null,
  secret: string
): Promise<boolean> {
  if (!xSignature || !dataId) return false;

  let ts: string | null = null;
  let v1: string | null = null;
  for (const part of xSignature.split(",")) {
    const [k, v] = part.trim().split("=");
    if (k === "ts") ts = v;
    else if (k === "v1") v1 = v;
  }
  if (!ts || !v1) return false;

  const parts = [`id:${dataId.toLowerCase()}`];
  if (xRequestId) parts.push(`request-id:${xRequestId}`);
  parts.push(`ts:${ts}`);
  const manifest = parts.join(";") + ";";

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(manifest));
  const hex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hex === v1;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const dataId = url.searchParams.get("data.id");
    const xSignature = context.request.headers.get("x-signature");
    const xRequestId = context.request.headers.get("x-request-id");

    const valido = await validarAssinatura(
      xSignature,
      xRequestId,
      dataId,
      context.env.MERCADOPAGO_WEBHOOK_SECRET
    );

    if (!valido) {
      console.error("Webhook com assinatura inválida, ignorado.");
      // Devolvemos 200 mesmo assim para o Mercado Pago não ficar
      // reenviando uma notificação que nunca vai passar a validação.
      return new Response(null, { status: 200 });
    }

    const body = (await context.request.json()) as { type?: string; data?: { id?: string } };
    if (body.type !== "order") {
      return new Response(null, { status: 200 });
    }

    const orderId = body.data?.id ?? dataId;
    if (!orderId) return new Response(null, { status: 200 });

    const order = await consultarOrder(context.env.MERCADOPAGO_ACCESS_TOKEN, orderId);
    const externalReference = order.external_reference as string | undefined;
    if (!externalReference) return new Response(null, { status: 200 });

    const firestore = new FirestoreClient({
      projectId: context.env.FIREBASE_PROJECT_ID,
      serviceAccountJson: context.env.FIREBASE_SERVICE_ACCOUNT,
    });

    const aprovado = order.status === "processed";

    await firestore.updateDocument("pedidos", externalReference, {
      statusPagamento: order.status,
      status: aprovado ? "pago" : "pendente",
      atualizadoEm: Date.now(),
    });

    return new Response(null, { status: 200 });
  } catch (err) {
    console.error("Erro ao processar webhook do Mercado Pago:", err);
    // Mesmo em erro interno, respondemos 200: preferimos investigar pelo
    // log do que deixar o Mercado Pago reenviar repetidamente uma
    // notificação que pode estar falhando por um motivo não recuperável
    // (ex: pedido já não existe mais).
    return new Response(null, { status: 200 });
  }
};
