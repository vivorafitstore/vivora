import { FirestoreClient } from "../../_lib/firestore";
import { criarOrderCartao } from "../../_lib/mercadopago";

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
      cpf?: string;
      token: string;
      paymentMethodId: string;
      installments: number;
    };

    if (!body.pedidoId || !body.valor || !body.email || !body.token || !body.paymentMethodId) {
      return Response.json({ erro: "Dados incompletos." }, { status: 400 });
    }

    const order = await criarOrderCartao({
      accessToken: context.env.MERCADOPAGO_ACCESS_TOKEN,
      valor: body.valor,
      externalReference: body.pedidoId,
      email: body.email,
      cpf: body.cpf,
      token: body.token,
      paymentMethodId: body.paymentMethodId,
      installments: body.installments || 1,
      idempotencyKey: `cartao-${body.pedidoId}-${Date.now()}`,
    });

    const pagamento = order.transactions?.payments?.[0];

    const firestore = new FirestoreClient({
      projectId: context.env.FIREBASE_PROJECT_ID,
      serviceAccountJson: context.env.FIREBASE_SERVICE_ACCOUNT,
    });

    const aprovado = pagamento?.status === "processed" || order.status === "processed";

    await firestore.updateDocument("pedidos", body.pedidoId, {
      mpOrderId: order.id,
      mpPaymentId: pagamento?.id ?? null,
      statusPagamento: order.status,
      status: aprovado ? "pago" : "pendente",
      atualizadoEm: Date.now(),
    });

    return Response.json({
      orderId: order.id,
      paymentId: pagamento?.id ?? null,
      status: order.status,
      statusDetail: pagamento?.status_detail ?? null,
      aprovado,
    });
  } catch (err) {
    const mpErr = err as { mpResponse?: { message?: string; cause?: unknown }; status?: number };
    console.error("Erro ao criar pagamento com cartão:", {
      status: mpErr.status,
      mpResponse: mpErr.mpResponse,
      message: (err as Error)?.message,
    });

    // Erros do Mercado Pago costumam vir com uma mensagem útil pro
    // comprador entender por que a transação foi recusada — repassamos
    // ela em vez de só um erro genérico.
    const mensagem =
      mpErr.mpResponse?.message ?? "Não foi possível processar o pagamento. Verifique os dados do cartão.";

    return Response.json(
      { erro: mensagem, detalhes: mpErr.mpResponse ?? null },
      { status: mpErr.status === 400 ? 400 : 500 }
    );
  }
};
