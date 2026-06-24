const MP_BASE_URL = "https://api.mercadopago.com";

export interface MercadoPagoOrderPayment {
  id: string;
  status: string;
  status_detail?: string;
  amount?: string;
  payment_method?: {
    id?: string;
    type?: string;
    token?: string;
    installments?: number;
    qr_code?: string;
    qr_code_base64?: string;
    ticket_url?: string;
  };
}

export interface MercadoPagoOrder {
  id: string;
  type: string;
  status: string;
  status_detail?: string;
  external_reference?: string;
  total_amount?: string;
  transactions?: {
    payments?: MercadoPagoOrderPayment[];
  };
}

interface CriarOrderPixInput {
  accessToken: string;
  valor: number;
  externalReference: string;
  email: string;
  idempotencyKey: string;
}

interface CriarOrderCartaoInput {
  accessToken: string;
  valor: number;
  externalReference: string;
  email: string;
  cpf?: string;
  token: string;
  paymentMethodId: string;
  installments: number;
  idempotencyKey: string;
}

function formatAmount(valor: number): string {
  return valor.toFixed(2);
}

async function callMercadoPago(
  accessToken: string,
  idempotencyKey: string,
  body: unknown
): Promise<MercadoPagoOrder> {
  const res = await fetch(`${MP_BASE_URL}/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as MercadoPagoOrder;
  if (!res.ok) {
    const err = new Error(
      `Mercado Pago respondeu ${res.status}: ${JSON.stringify(data)}`
    ) as Error & { mpResponse?: unknown; status?: number };
    err.mpResponse = data;
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function criarOrderPix({
  accessToken,
  valor,
  externalReference,
  email,
  idempotencyKey,
}: CriarOrderPixInput) {
  return callMercadoPago(accessToken, idempotencyKey, {
    type: "online",
    processing_mode: "automatic",
    total_amount: formatAmount(valor),
    external_reference: externalReference,
    transactions: {
      payments: [
        {
          amount: formatAmount(valor),
          payment_method: {
            id: "pix",
            type: "bank_transfer",
          },
          // Pix expira em 1 hora — dá margem confortável ao cliente e
          // evita deixar o pedido pendente por muito tempo. O mínimo
          // aceito pela API é 30 minutos.
          expiration_time: "PT1H",
        },
      ],
    },
    payer: { email },
  });
}

export async function criarOrderCartao({
  accessToken,
  valor,
  externalReference,
  email,
  cpf,
  token,
  paymentMethodId,
  installments,
  idempotencyKey,
}: CriarOrderCartaoInput) {
  return callMercadoPago(accessToken, idempotencyKey, {
    type: "online",
    processing_mode: "automatic",
    total_amount: formatAmount(valor),
    external_reference: externalReference,
    transactions: {
      payments: [
        {
          amount: formatAmount(valor),
          payment_method: {
            id: paymentMethodId,
            type: "credit_card",
            token,
            installments,
          },
        },
      ],
    },
    payer: {
      email,
      ...(cpf ? { identification: { type: "CPF", number: cpf } } : {}),
    },
  });
}

export async function consultarOrder(accessToken: string, orderId: string): Promise<MercadoPagoOrder> {
  const res = await fetch(`${MP_BASE_URL}/v1/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = (await res.json()) as MercadoPagoOrder;
  if (!res.ok) {
    throw new Error(`Mercado Pago respondeu ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}
