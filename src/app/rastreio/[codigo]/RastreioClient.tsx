"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, MapPin, CheckCircle, Clock, ExternalLink, ChevronRight } from "lucide-react";
import { obterPedidoPorRastreio } from "@/lib/firestore-pedidos";
import { Pedido, StepRastreio } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente",
  pago: "Pago",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

function formatarData(ts: number) {
  return new Date(ts).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RastreioClient({ codigo }: { codigo: string }) {
  const codigoDecoded = decodeURIComponent(codigo);
  const [pedido, setPedido] = useState<Pedido | null | "not-found">(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!codigoDecoded) return;
    obterPedidoPorRastreio(codigoDecoded)
      .then((p) => setPedido(p ?? "not-found"))
      .catch(() => setPedido("not-found"))
      .finally(() => setLoading(false));
  }, [codigoDecoded]);

  const steps: StepRastreio[] =
    pedido && pedido !== "not-found" ? (pedido.stepsRastreio ?? []) : [];

  return (
    <div className="min-h-screen bg-blush py-12">
      <div className="mx-auto max-w-xl px-5">

        {/* header */}
        <div className="mb-8">
          <Link href="/" className="mb-6 block">
            <img src="/images/logo-vivora-black.png" alt="Vivora" className="h-7 w-auto" />
          </Link>
          <h1 className="font-display text-2xl tracking-display text-ink">Rastreio do pedido</h1>
          <p className="mt-1 font-mono text-sm text-graphite/45">{codigoDecoded}</p>
        </div>

        {/* loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-xs uppercase tracking-[0.15em] text-graphite/40">Buscando pedido...</p>
          </div>
        )}

        {/* não encontrado */}
        {!loading && pedido === "not-found" && (
          <div className="rounded-2xl border border-mist/40 bg-white p-8 text-center">
            <Package className="mx-auto mb-4 h-10 w-10 text-mist" />
            <p className="font-display text-lg tracking-display text-ink">Código não encontrado</p>
            <p className="mt-2 text-sm text-graphite/55">
              Verifique se o código está correto ou aguarde alguns minutos após o envio para ele
              aparecer no sistema.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-rose-deep hover:underline"
            >
              Voltar para a loja <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* pedido encontrado */}
        {!loading && pedido && pedido !== "not-found" && (
          <div className="flex flex-col gap-5">

            {/* card resumo */}
            <div className="rounded-2xl border border-mist/40 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-base tracking-display text-ink">{pedido.clienteNome}</p>
                  <p className="mt-0.5 text-xs text-graphite/45">{pedido.clienteEmail}</p>
                </div>
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.08em]"
                  style={{
                    background: pedido.status === "entregue" ? "#fde8ef" : pedido.status === "enviado" ? "#f0ebf5" : "#f7eef1",
                    color: pedido.status === "entregue" ? "#b22f56" : pedido.status === "enviado" ? "#4a1f5c" : "#2b232f99",
                  }}
                >
                  {STATUS_LABEL[pedido.status] ?? pedido.status}
                </span>
              </div>

              {pedido.transportadora && (
                <p className="mt-3 text-xs text-graphite/45">
                  Transportadora:{" "}
                  <span className="font-medium text-graphite/70">{pedido.transportadora}</span>
                </p>
              )}

              <a
                href={`https://rastreamento.correios.com.br/app/index.php?objetos=${codigoDecoded}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 rounded-xl border border-mist/40 px-4 py-2.5 text-xs text-graphite/60 transition hover:border-plum/40 hover:text-plum"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Rastrear também nos Correios
              </a>
            </div>

            {/* timeline */}
            {steps.length === 0 ? (
              <div className="rounded-2xl border border-mist/40 bg-white p-6 text-center">
                <Clock className="mx-auto mb-3 h-8 w-8 text-mist" />
                <p className="font-display text-base tracking-display text-ink">Rastreio em breve</p>
                <p className="mt-2 text-sm text-graphite/55">
                  Seu pedido foi recebido! Assim que for postado, as atualizações de rastreio
                  aparecerão aqui. Enquanto isso, você pode usar o código abaixo diretamente no
                  site da transportadora.
                </p>
                <p className="mt-4 rounded-xl bg-blush px-4 py-3 font-mono text-sm font-medium text-ink">
                  {codigoDecoded}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-mist/40 bg-white p-5">
                <p className="mb-5 text-[11px] uppercase tracking-[0.1em] text-graphite/45">Atualizações</p>
                <div className="flex flex-col">
                  {[...steps].reverse().map((step, i, arr) => {
                    const isFirst = i === 0;
                    const isLast = i === arr.length - 1;
                    return (
                      <div key={step.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                            style={{
                              background: isFirst ? "#4a1f5c" : "#f7eef1",
                              border: isFirst ? "none" : "2px solid #cdb9c4",
                            }}
                          >
                            {isFirst
                              ? <CheckCircle className="h-4 w-4 text-white" />
                              : <div className="h-2 w-2 rounded-full bg-mist" />}
                          </div>
                          {!isLast && (
                            <div className="my-1 w-px flex-1 bg-mist/50" style={{ minHeight: 24 }} />
                          )}
                        </div>

                        <div className={`${isLast ? "pb-0" : "pb-6"}`}>
                          <p
                            className="font-display text-sm tracking-display"
                            style={{ color: isFirst ? "#4a1f5c" : "#2b232f" }}
                          >
                            {step.etapa}
                          </p>
                          {step.descricao && (
                            <p className="mt-0.5 text-sm text-graphite/60">{step.descricao}</p>
                          )}
                          <div className="mt-1.5 flex flex-wrap items-center gap-3">
                            {step.local && (
                              <span className="flex items-center gap-1 text-[11px] text-graphite/40">
                                <MapPin className="h-3 w-3" /> {step.local}
                              </span>
                            )}
                            <span className="text-[11px] text-graphite/35">
                              {formatarData(step.criadoEm)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 text-sm text-graphite/45 hover:text-rose-deep"
            >
              Voltar para a loja <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
