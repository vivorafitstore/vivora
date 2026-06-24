"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import type { ICardPaymentFormData, ICardPaymentBrickPayer } from "@mercadopago/sdk-react/esm/bricks/cardPayment/type";

interface Props {
  pedidoId: string;
  valor: number;
  email: string;
  onAprovado: () => void;
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ?? "";

// Inicializa o SDK uma única vez por carregamento da página — não depende
// de nenhum estado do componente, então não precisa estar em um efeito.
if (PUBLIC_KEY) {
  initMercadoPago(PUBLIC_KEY, { locale: "pt-BR" });
}

export function PagamentoCartao({ pedidoId, valor, email, onAprovado }: Props) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(!PUBLIC_KEY ? "Configuração de pagamento ausente. Contate o suporte." : null);

  async function handleSubmit(formData: ICardPaymentFormData<ICardPaymentBrickPayer>) {
    setEnviando(true);
    setErro(null);
    try {
      const res = await fetch("/api/pagamento/cartao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pedidoId,
          valor,
          email,
          cpf: formData.payer?.identification?.number,
          token: formData.token,
          paymentMethodId: formData.payment_method_id,
          installments: formData.installments,
        }),
      });
      const data = await res.json();

      if (!res.ok || data.erro) {
        setErro(data.erro ?? "Pagamento recusado. Verifique os dados do cartão.");
        setEnviando(false);
        return;
      }

      if (data.aprovado) {
        onAprovado();
      } else {
        setErro("Pagamento em análise. Vamos avisar você quando for confirmado.");
      }
    } catch {
      setErro("Não foi possível processar o pagamento. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (!PUBLIC_KEY) {
    return <p className="py-10 text-center text-sm text-rose-deep">{erro}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <CardPayment
        initialization={{ amount: valor, payer: { email } }}
        customization={{ paymentMethods: { types: { excluded: ["debit_card", "prepaid_card"] } } }}
        onSubmit={handleSubmit}
        onError={() => setErro("Não foi possível carregar o formulário de cartão.")}
      />
      {enviando && (
        <p className="flex items-center justify-center gap-2 text-xs text-graphite/55">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processando pagamento...
        </p>
      )}
      {erro && <p className="text-center text-sm text-rose-deep">{erro}</p>}
    </div>
  );
}
