"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, MapPin, CheckCircle2, Circle, ChevronRight, Truck } from "lucide-react";
import { obterPedidoPorRastreio } from "@/lib/firestore-pedidos";
import { Pedido, StepRastreio } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente",
  pago: "Pago",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

// Ordem de progresso para a barra visual — cancelado fica fora da escala.
const PROGRESSO_ORDEM = ["pendente", "pago", "enviado", "entregue"];

function indiceProgresso(status: string): number {
  const i = PROGRESSO_ORDEM.indexOf(status);
  return i === -1 ? 0 : i;
}

function formatarData(ts: number) {
  return new Date(ts).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RastreioClient() {
  // Lemos o código direto de window.location (não via useParams) porque
  // este componente é renderizado em dois contextos diferentes: pela rota
  // real /rastreio/[codigo] (onde só existe um shell pré-gerado, o
  // "placeholder", já que os códigos reais não existem no momento do
  // build) e pelo not-found.tsx (fallback do Cloudflare quando nenhum
  // arquivo bate com a URL). window.location funciona identicamente nos
  // dois casos; useParams não existe fora da árvore de rota real.
  const [codigoDecoded, setCodigoDecoded] = useState("");
  const [pedido, setPedido] = useState<Pedido | null | "not-found">(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.resolve().then(() => {
      const partes = window.location.pathname.split("/").filter(Boolean);
      const codigoBruto = partes[partes.length - 1] ?? "";
      setCodigoDecoded(decodeURIComponent(codigoBruto));
    });
  }, []);

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

            {/* card de status com barra de progresso */}
            <div className="overflow-hidden rounded-2xl border border-mist/40 bg-white">
              <div className="bg-gradient-to-br from-ink to-plum px-6 py-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                      <Truck className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.15em] text-white/60">
                        Status atual
                      </p>
                      <p className="font-display text-lg tracking-display">
                        {STATUS_LABEL[pedido.status] ?? pedido.status}
                      </p>
                    </div>
                  </div>
                  {pedido.transportadora && (
                    <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.08em]">
                      {pedido.transportadora}
                    </span>
                  )}
                </div>

                {pedido.status !== "cancelado" && (
                  <div className="mt-6 flex items-center gap-1.5">
                    {PROGRESSO_ORDEM.map((s, i) => (
                      <div
                        key={s}
                        className="h-1.5 flex-1 rounded-full transition-colors"
                        style={{
                          background:
                            i <= indiceProgresso(pedido.status) ? "#fff" : "rgba(255,255,255,0.2)",
                        }}
                      />
                    ))}
                  </div>
                )}
                {pedido.status !== "cancelado" && (
                  <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.06em] text-white/50">
                    {PROGRESSO_ORDEM.map((s) => (
                      <span key={s}>{STATUS_LABEL[s]}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="font-display text-sm tracking-display text-ink">{pedido.clienteNome}</p>
                  <p className="text-xs text-graphite/45">{pedido.clienteEmail}</p>
                </div>
                <p className="font-mono text-xs text-graphite/40">{codigoDecoded}</p>
              </div>
            </div>

            {/* timeline */}
            {steps.length === 0 ? (
              <div className="rounded-2xl border border-mist/40 bg-white p-6 text-center">
                <Package className="mx-auto mb-3 h-8 w-8 text-mist" />
                <p className="font-display text-base tracking-display text-ink">Rastreio em breve</p>
                <p className="mt-2 text-sm text-graphite/55">
                  Seu pedido foi recebido! Assim que for postado, as atualizações de rastreio
                  aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-mist/40 bg-white p-6">
                <p className="mb-6 text-[11px] uppercase tracking-[0.1em] text-graphite/45">
                  Histórico de atualizações
                </p>
                <div className="flex flex-col">
                  {[...steps].reverse().map((step, i, arr) => {
                    const isFirst = i === 0;
                    const isLast = i === arr.length - 1;
                    return (
                      <div key={step.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                            style={{
                              background: "#4a1f5c",
                              boxShadow: isFirst ? "0 0 0 4px rgba(74,31,92,0.12)" : "none",
                            }}
                          >
                            {isFirst ? (
                              <CheckCircle2 className="h-4.5 w-4.5 text-white" strokeWidth={2.2} />
                            ) : (
                              <Circle className="h-2.5 w-2.5 fill-white text-white" />
                            )}
                          </span>
                          {!isLast && <div className="my-1 w-0.5 flex-1 bg-plum/25" style={{ minHeight: 32 }} />}
                        </div>

                        <div className={`${isLast ? "pb-0" : "pb-7"} pt-1`}>
                          <div className="flex flex-wrap items-baseline gap-2">
                            <p
                              className="font-display text-base tracking-display"
                              style={{ color: isFirst ? "#4a1f5c" : "#2b232f" }}
                            >
                              {step.etapa}
                            </p>
                            <span className="text-[11px] text-graphite/40">
                              {formatarData(step.criadoEm)}
                            </span>
                          </div>
                          {step.descricao && (
                            <p className="mt-1 text-sm text-graphite/60">{step.descricao}</p>
                          )}
                          {step.local && (
                            <span className="mt-1.5 flex items-center gap-1 text-[11px] text-graphite/40">
                              <MapPin className="h-3 w-3" /> {step.local}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* etapa final implícita, em cinza, quando ainda não chegou */}
                  {pedido.status !== "entregue" && pedido.status !== "cancelado" && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-mist/60">
                          <Circle className="h-2.5 w-2.5 text-mist/60" />
                        </span>
                      </div>
                      <div className="pt-2">
                        <p className="font-display text-base tracking-display text-graphite/35">
                          Entrega realizada
                        </p>
                      </div>
                    </div>
                  )}
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
