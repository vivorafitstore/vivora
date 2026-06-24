"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Copy, Check, Clock } from "lucide-react";

interface Props {
  pedidoId: string;
  valor: number;
  email: string;
  onPago: () => void;
}

interface RespostaPix {
  orderId: string;
  paymentId: string;
  status: string;
  qrCode: string | null;
  qrCodeBase64: string | null;
  ticketUrl: string | null;
  erro?: string;
}

export function PagamentoPix({ pedidoId, valor, email, onPago }: Props) {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [dados, setDados] = useState<RespostaPix | null>(null);
  const [copiado, setCopiado] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cria o Pix uma única vez ao montar — sem dependências reativas, então
  // não precisamos nos preocupar com reexecução por mudança de props.
  useEffect(() => {
    let cancelado = false;

    fetch("/api/pagamento/pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pedidoId, valor, email }),
    })
      .then((res) => res.json())
      .then((data: RespostaPix) => {
        if (cancelado) return;
        if (data.erro) {
          setErro(data.erro);
        } else {
          setDados(data);
        }
      })
      .catch(() => {
        if (!cancelado) setErro("Não foi possível gerar o Pix. Tente novamente.");
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Faz polling do status a cada 4s enquanto aguarda o pagamento.
  useEffect(() => {
    if (!dados?.orderId) return;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/pagamento/status?orderId=${dados.orderId}&pedidoId=${pedidoId}`
        );
        const data = await res.json();
        if (data.aprovado) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          onPago();
        }
      } catch {
        // Falha de rede pontual no polling não é crítica — tenta de novo
        // no próximo ciclo.
      }
    }, 4000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [dados?.orderId, pedidoId, onPago]);

  async function copiarCodigo() {
    if (!dados?.qrCode) return;
    await navigator.clipboard.writeText(dados.qrCode);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  if (carregando) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-graphite/40" />
        <p className="text-sm text-graphite/55">Gerando seu Pix...</p>
      </div>
    );
  }

  if (erro || !dados?.qrCodeBase64) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-rose-deep">{erro ?? "Não foi possível gerar o Pix."}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <div className="flex items-center gap-1.5 rounded-full bg-blush/60 px-3 py-1.5 text-[11px] text-graphite/60">
        <Clock className="h-3.5 w-3.5" />
        Aguardando pagamento — expira em 1 hora
      </div>

      <img
        src={`data:image/png;base64,${dados.qrCodeBase64}`}
        alt="QR Code do Pix"
        className="h-56 w-56 rounded-xl border border-mist/40"
      />

      <button
        onClick={copiarCodigo}
        className="flex items-center gap-2 rounded-xl border border-mist/60 bg-white px-4 py-2.5 text-xs text-ink transition hover:border-graphite/30"
      >
        {copiado ? (
          <>
            <Check className="h-3.5 w-3.5 text-rose-deep" /> Código copiado!
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" /> Copiar código Pix
          </>
        )}
      </button>

      <p className="max-w-xs text-xs text-graphite/50">
        Abra o app do seu banco, escaneie o QR Code ou cole o código copiado na opção Pix Copia e
        Cola. A confirmação é automática.
      </p>

      <div className="flex items-center gap-2 text-xs text-graphite/45">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Verificando pagamento...
      </div>
    </div>
  );
}
