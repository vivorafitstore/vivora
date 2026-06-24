import { FirestoreClient } from "../../_lib/firestore";
import { consultarOrder } from "../../_lib/mercadopago";

interface Env {
  MERCADOPAGO_ACCESS_TOKEN: string;
  FIREBASE_SERVICE_ACCOUNT: string;
  FIREBASE_PROJECT_ID: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const orderId = new URL(context.request.url).searchParams.get("orderId");
    const pedidoId = new URL(context.request.url).searchParams.get("pedidoId");

    if (!orderId || !pedidoId) {
      return Response.json({ erro: "Parâmetros orderId e pedidoId são obrigatórios." }, { status: 400 });
    }

    const order = await consultarOrder(context.env.MERCADOPAGO_ACCESS_TOKEN, orderId);
    const pagamento = order.transactions?.payments?.[0];

    // O pagamento pode ter sido confirmado pelo webhook entre uma
    // consulta e outra do polling — sincronizamos o Firestore aqui
    // também, como reforço, e não só no webhook.
    if (order.status === "processed" && pagamento?.status === "processed") {
      const firestore = new FirestoreClient({
        projectId: context.env.FIREBASE_PROJECT_ID,
        serviceAccountJson: context.env.FIREBASE_SERVICE_ACCOUNT,
      });
      await firestore.updateDocument("pedidos", pedidoId, {
        status: "pago",
        statusPagamento: order.status,
        atualizadoEm: Date.now(),
      });
    }

    return Response.json({
      status: order.status,
      paymentStatus: pagamento?.status ?? null,
      aprovado: order.status === "processed",
    });
  } catch (err) {
    console.error("Erro ao consultar status do pagamento:", err);
    return Response.json({ erro: "Não foi possível consultar o status." }, { status: 500 });
  }
};
