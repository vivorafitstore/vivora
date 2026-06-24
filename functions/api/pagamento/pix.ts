import { FirestoreClient } from "../../_lib/firestore";
import { criarOrderPix } from "../../_lib/mercadopago";

interface Env {
  MERCADOPAGO_ACCESS_TOKEN: string;
  FIREBASE_SERVICE_ACCOUNT: string;
  FIREBASE_PROJECT_ID: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as {
      pedidoId: string;
      valor: number;
      email: string;
    };

    if (!body.pedidoId || !body.valor || !body.email) {
      return Response.json({ erro: "Dados incompletos." }, { status: 400 });
    }

    const order = await criarOrderPix({
      accessToken: context.env.MERCADOPAGO_ACCESS_TOKEN,
      valor: body.valor,
      externalReference: body.pedidoId,
      email: body.email,
      idempotencyKey: `pix-${body.pedidoId}`,
    });

    const pagamento = order.transactions?.payments?.[0];
    if (!pagamento) {
      return Response.json({ erro: "Mercado Pago não retornou dados do pagamento." }, { status: 502 });
    }

    const firestore = new FirestoreClient({
      projectId: context.env.FIREBASE_PROJECT_ID,
      serviceAccountJson: context.env.FIREBASE_SERVICE_ACCOUNT,
    });

    await firestore.updateDocument("pedidos", body.pedidoId, {
      mpOrderId: order.id,
      mpPaymentId: pagamento.id,
      statusPagamento: order.status,
      atualizadoEm: Date.now(),
    });

    return Response.json({
      orderId: order.id,
      paymentId: pagamento.id,
      status: order.status,
      qrCode: pagamento.payment_method?.qr_code ?? null,
      qrCodeBase64: pagamento.payment_method?.qr_code_base64 ?? null,
      ticketUrl: pagamento.payment_method?.ticket_url ?? null,
    });
  } catch (err) {
    console.error("Erro ao criar pagamento Pix:", err);
    return Response.json({ erro: "Não foi possível gerar o Pix. Tente novamente." }, { status: 500 });
  }
};
