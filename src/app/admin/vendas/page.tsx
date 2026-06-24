"use client";

import { useEffect, useState } from "react";
import {
  Truck, Save, ChevronDown, ChevronUp, Plus, Trash2, MapPin, Package,
} from "lucide-react";
import {
  listarPedidos,
  atualizarRastreioPedido,
  atualizarStatusPedido,
  atualizarStepsPedido,
} from "@/lib/firestore-pedidos";
import { Pedido, StatusPedido, StepRastreio } from "@/lib/types";
import { formatarPreco } from "@/lib/format";

const STATUS_LABEL: Record<StatusPedido, string> = {
  pendente: "Pendente",
  pago: "Pago",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const STATUS_COR: Record<StatusPedido, string> = {
  pendente: "bg-mist/40 text-graphite/60",
  pago: "bg-blush text-rose-deep",
  enviado: "bg-plum/10 text-plum",
  entregue: "bg-rose/10 text-rose-deep",
  cancelado: "bg-graphite/10 text-graphite/50",
};

const PRESETS = [
  { etapa: "Pedido em separação", descricao: "Pedido recebido e em processo de separação.", local: "" },
  { etapa: "Pedido enviado", descricao: "Objeto postado e encaminhado para transporte.", local: "" },
  { etapa: "Em trânsito", descricao: "Objeto encaminhado para distribuição.", local: "" },
  { etapa: "Saiu para entrega", descricao: "Objeto saiu para entrega ao destinatário.", local: "" },
  { etapa: "Entregue", descricao: "Objeto entregue ao destinatário com sucesso.", local: "" },
  { etapa: "Tentativa de entrega", descricao: "Tentativa de entrega não realizada, destinatário ausente.", local: "" },
  { etapa: "Aguardando retirada", descricao: "Objeto disponível para retirada na agência.", local: "" },
];

function gerarId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatarData(ts: number) {
  return new Date(ts).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── Editor de steps ────────────────────────────────────────────────────────
function StepsEditor({ pedido, onSaved }: { pedido: Pedido; onSaved: () => void }) {
  const [steps, setSteps] = useState<StepRastreio[]>(pedido.stepsRastreio ?? []);
  const [salvando, setSalvando] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  function addStep(preset?: (typeof PRESETS)[number]) {
    setSteps((prev) => [
      ...prev,
      {
        id: gerarId(),
        etapa: preset?.etapa ?? "",
        descricao: preset?.descricao ?? "",
        local: preset?.local ?? "",
        criadoEm: Date.now(),
      },
    ]);
    setShowPresets(false);
  }

  function removeStep(id: string) {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  }

  function updateField(id: string, field: keyof StepRastreio, value: string) {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  async function salvar() {
    setSalvando(true);
    try {
      await atualizarStepsPedido(pedido.id, steps);
      onSaved();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.1em] text-graphite/45">
          Steps de rastreio
        </p>
        <div className="relative">
          <button
            onClick={() => setShowPresets((v) => !v)}
            className="flex items-center gap-1.5 rounded-xl bg-ink px-3 py-2 font-display text-xs tracking-display text-white transition hover:bg-plum"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar step
          </button>

          {showPresets && (
            <div className="absolute right-0 top-10 z-20 w-64 rounded-2xl border border-mist/40 bg-white shadow-xl">
              <p className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-[0.12em] text-graphite/40">
                Pré-sets
              </p>
              {PRESETS.map((p) => (
                <button
                  key={p.etapa}
                  onClick={() => addStep(p)}
                  className="flex w-full flex-col gap-0.5 px-3 py-2.5 text-left transition hover:bg-blush"
                >
                  <span className="text-sm font-medium text-ink">{p.etapa}</span>
                  <span className="text-[11px] text-graphite/50">{p.descricao}</span>
                </button>
              ))}
              <div className="border-t border-mist/30 px-3 py-2">
                <button
                  onClick={() => addStep()}
                  className="text-xs text-rose-deep hover:underline"
                >
                  + Step em branco
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {steps.length === 0 ? (
        <p className="rounded-xl border border-dashed border-mist/60 p-4 text-center text-xs text-graphite/40">
          Nenhum step adicionado ainda. Clique em &quot;Adicionar step&quot; para começar.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="relative flex gap-3 rounded-xl border border-mist/40 bg-blush/30 p-4"
            >
              {/* linha vertical de timeline */}
              <div className="flex flex-col items-center gap-1 pt-1">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                  style={{ background: i === 0 ? "#4a1f5c" : i === steps.length - 1 ? "#d6486f" : "#cdb9c4" }}
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-mist/60" style={{ minHeight: 16 }} />
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    value={step.etapa}
                    onChange={(e) => updateField(step.id, "etapa", e.target.value)}
                    placeholder="Etapa (ex: Em trânsito)"
                    className="campo-input flex-1 font-medium"
                  />
                  <button
                    onClick={() => removeStep(step.id)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-graphite/30 transition hover:bg-rose/10 hover:text-rose-deep"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  value={step.descricao}
                  onChange={(e) => updateField(step.id, "descricao", e.target.value)}
                  placeholder="Descrição (ex: Objeto encaminhado para distribuição)"
                  className="campo-input"
                />
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-graphite/30" />
                  <input
                    value={step.local}
                    onChange={(e) => updateField(step.id, "local", e.target.value)}
                    placeholder="Local (ex: São Paulo - SP)"
                    className="campo-input"
                  />
                </div>
                <p className="text-[10px] text-graphite/35">{formatarData(step.criadoEm)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {steps.length > 0 && (
        <button
          onClick={salvar}
          disabled={salvando}
          className="flex items-center gap-2 self-end rounded-xl bg-ink px-4 py-2.5 font-display text-sm tracking-display text-white transition hover:bg-plum disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {salvando ? "Salvando..." : "Salvar steps"}
        </button>
      )}
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────
export default function AdminVendasPage() {
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const [aberto, setAberto] = useState<string | null>(null);
  const [rastreios, setRastreios] = useState<Record<string, string>>({});
  const [transportadoras, setTransportadoras] = useState<Record<string, string>>({});
  const [salvandoId, setSalvandoId] = useState<string | null>(null);

  async function carregar() {
    const dados = await listarPedidos();
    setPedidos(dados);
    setRastreios(Object.fromEntries(dados.map((p) => [p.id, p.codigoRastreio ?? ""])));
    setTransportadoras(Object.fromEntries(dados.map((p) => [p.id, p.transportadora ?? ""])));
  }

  useEffect(() => {
    let cancelado = false;

    listarPedidos().then((dados) => {
      if (cancelado) return;
      setPedidos(dados);
      setRastreios(Object.fromEntries(dados.map((p) => [p.id, p.codigoRastreio ?? ""])));
      setTransportadoras(Object.fromEntries(dados.map((p) => [p.id, p.transportadora ?? ""])));
    });

    return () => {
      cancelado = true;
    };
  }, []);

  async function handleSalvarRastreio(p: Pedido) {
    setSalvandoId(p.id);
    try {
      await atualizarRastreioPedido(p.id, rastreios[p.id] ?? "", transportadoras[p.id] ?? "");
      await carregar();
    } finally {
      setSalvandoId(null);
    }
  }

  async function handleStatus(p: Pedido, status: StatusPedido) {
    await atualizarStatusPedido(p.id, status);
    await carregar();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl tracking-display text-ink">Vendas</h1>
        <p className="text-sm text-graphite/60">
          Gerencie pedidos, código de rastreio e steps de acompanhamento.
        </p>
      </div>

      {pedidos === null ? (
        <p className="text-xs text-graphite/45">Carregando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p className="rounded-2xl border border-mist/40 bg-white p-6 text-sm text-graphite/60">
          Nenhum pedido ainda. Quando o checkout estiver funcionando, as compras dos clientes
          vão aparecer aqui automaticamente.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {pedidos.map((p) => (
            <div key={p.id} className="rounded-2xl border border-mist/40 bg-white">
              <button
                onClick={() => setAberto(aberto === p.id ? null : p.id)}
                className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <div>
                  <p className="font-display text-sm tracking-display text-ink">{p.clienteNome}</p>
                  <p className="text-[11px] text-graphite/45">{p.clienteEmail}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-ink">{formatarPreco(p.valorTotal)}</p>
                    {p.stepsRastreio && p.stepsRastreio.length > 0 && (
                      <p className="text-[10px] text-graphite/40">
                        {p.stepsRastreio.length} step{p.stepsRastreio.length > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] ${STATUS_COR[p.status]}`}>
                    {STATUS_LABEL[p.status]}
                  </span>
                  {aberto === p.id
                    ? <ChevronUp className="h-4 w-4 text-graphite/40" />
                    : <ChevronDown className="h-4 w-4 text-graphite/40" />}
                </div>
              </button>

              {aberto === p.id && (
                <div className="flex flex-col gap-6 border-t border-mist/30 px-5 py-5">

                  {/* itens */}
                  <div>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.1em] text-graphite/45">Itens do pedido</p>
                    <ul className="flex flex-col gap-1">
                      {p.itens.map((item, i) => (
                        <li key={i} className="flex justify-between text-sm text-graphite/75">
                          <span>
                            {item.quantidade}x {item.produtoNome}
                            {item.tamanho ? ` — ${item.tamanho}` : ""}
                          </span>
                          <span>{formatarPreco(item.precoUnitario * item.quantidade)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* status */}
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="mr-2 text-[11px] uppercase tracking-[0.1em] text-graphite/45">Status</p>
                    {(Object.keys(STATUS_LABEL) as StatusPedido[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatus(p, s)}
                        className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.08em] transition ${
                          p.status === s ? "bg-ink text-white" : "bg-blush/60 text-graphite/55 hover:bg-blush"
                        }`}
                      >
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>

                  {/* código de rastreio */}
                  <div>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.1em] text-graphite/45">Código de rastreio</p>
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-graphite/40">Transportadora</label>
                        <input
                          value={transportadoras[p.id] ?? ""}
                          onChange={(e) => setTransportadoras((t) => ({ ...t, [p.id]: e.target.value }))}
                          placeholder="Ex: Correios, Jadlog..."
                          className="campo-input w-44"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-1.5">
                        <label className="text-[11px] text-graphite/40">Código (cole da Shopee)</label>
                        <input
                          value={rastreios[p.id] ?? ""}
                          onChange={(e) => setRastreios((r) => ({ ...r, [p.id]: e.target.value }))}
                          placeholder="Cole aqui o código de rastreio"
                          className="campo-input"
                        />
                      </div>
                      <button
                        onClick={() => handleSalvarRastreio(p)}
                        disabled={salvandoId === p.id}
                        className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 font-display text-sm tracking-display text-white transition hover:bg-plum disabled:opacity-50"
                      >
                        {salvandoId === p.id ? "Salvando..." : <><Save className="h-4 w-4" /> Salvar</>}
                      </button>
                    </div>
                    {p.codigoRastreio && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-graphite/45">
                        <Truck className="h-3.5 w-3.5" />
                        Código atual: <span className="font-mono font-medium text-ink">{p.codigoRastreio}</span>
                        {p.transportadora ? ` · ${p.transportadora}` : ""}
                      </p>
                    )}
                  </div>

                  {/* steps de rastreio */}
                  <div className="rounded-2xl border border-mist/30 bg-blush/20 p-4">
                    <StepsEditor pedido={p} onSaved={carregar} />
                  </div>

                  {/* link público */}
                  {p.codigoRastreio && (
                    <div className="flex items-center gap-2 rounded-xl bg-plum/5 px-4 py-3">
                      <Package className="h-4 w-4 shrink-0 text-plum" />
                      <p className="text-xs text-graphite/60">
                        Link público do cliente:{" "}
                        <a
                          href={`/rastreio/${p.codigoRastreio}`}
                          target="_blank"
                          className="font-medium text-plum hover:underline"
                        >
                          /rastreio/{p.codigoRastreio}
                        </a>
                      </p>
                    </div>
                  )}

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
