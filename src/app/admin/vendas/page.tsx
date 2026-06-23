"use client";

import { useEffect, useState } from "react";
import { Truck, Save, ChevronDown, ChevronUp } from "lucide-react";
import { listarPedidos, atualizarRastreioPedido, atualizarStatusPedido } from "@/lib/firestore-pedidos";
import { Pedido, StatusPedido } from "@/lib/types";
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

export default function AdminVendasPage() {
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const [aberto, setAberto] = useState<string | null>(null);
  const [rastreios, setRastreios] = useState<Record<string, string>>({});
  const [transportadoras, setTransportadoras] = useState<Record<string, string>>({});
  const [salvandoId, setSalvandoId] = useState<string | null>(null);

  async function carregar() {
    const dados = await listarPedidos();
    setPedidos(dados);
    setRastreios(
      Object.fromEntries(dados.map((p) => [p.id, p.codigoRastreio ?? ""]))
    );
    setTransportadoras(
      Object.fromEntries(dados.map((p) => [p.id, p.transportadora ?? ""]))
    );
  }

  useEffect(() => {
    listarPedidos().then((dados) => {
      setPedidos(dados);
      setRastreios(Object.fromEntries(dados.map((p) => [p.id, p.codigoRastreio ?? ""])));
      setTransportadoras(Object.fromEntries(dados.map((p) => [p.id, p.transportadora ?? ""])));
    });
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
          Pedidos dos clientes, com campo para colar o código de rastreio do fornecedor
          (dropshipping).
        </p>
      </div>

      {pedidos === null ? (
        <p className="font-mono text-xs text-graphite/45">Carregando pedidos...</p>
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
                  <p className="font-display text-sm tracking-display text-ink">
                    {p.clienteNome}
                  </p>
                  <p className="font-mono text-[11px] text-graphite/45">{p.clienteEmail}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-ink">{formatarPreco(p.valorTotal)}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] ${STATUS_COR[p.status]}`}
                  >
                    {STATUS_LABEL[p.status]}
                  </span>
                  {aberto === p.id ? (
                    <ChevronUp className="h-4 w-4 text-graphite/40" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-graphite/40" />
                  )}
                </div>
              </button>

              {aberto === p.id && (
                <div className="flex flex-col gap-5 border-t border-mist/30 px-5 py-5">
                  <div>
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-graphite/45">
                      Itens do pedido
                    </p>
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

                  <div className="flex flex-wrap items-center gap-2">
                    <p className="mr-2 font-mono text-[11px] uppercase tracking-[0.1em] text-graphite/45">
                      Status
                    </p>
                    {(Object.keys(STATUS_LABEL) as StatusPedido[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatus(p, s)}
                        className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition ${
                          p.status === s
                            ? "bg-ink text-white"
                            : "bg-blush/60 text-graphite/55 hover:bg-blush"
                        }`}
                      >
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-end gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-graphite/45">
                        Transportadora
                      </label>
                      <input
                        value={transportadoras[p.id] ?? ""}
                        onChange={(e) =>
                          setTransportadoras((t) => ({ ...t, [p.id]: e.target.value }))
                        }
                        placeholder="Ex: Correios, Jadlog..."
                        className="campo-input w-44"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5">
                      <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-graphite/45">
                        Código de rastreio (colado da Shopee)
                      </label>
                      <input
                        value={rastreios[p.id] ?? ""}
                        onChange={(e) => setRastreios((r) => ({ ...r, [p.id]: e.target.value }))}
                        placeholder="Cole aqui o código de rastreio"
                        className="campo-input font-mono"
                      />
                    </div>
                    <button
                      onClick={() => handleSalvarRastreio(p)}
                      disabled={salvandoId === p.id}
                      className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 font-display text-sm tracking-display text-white transition hover:bg-plum disabled:opacity-50"
                    >
                      {salvandoId === p.id ? (
                        "Salvando..."
                      ) : (
                        <>
                          <Save className="h-4 w-4" /> Salvar
                        </>
                      )}
                    </button>
                  </div>

                  {p.codigoRastreio && (
                    <p className="flex items-center gap-2 font-mono text-xs text-graphite/50">
                      <Truck className="h-3.5 w-3.5" />
                      Rastreio atual: {p.codigoRastreio}
                      {p.transportadora ? ` · ${p.transportadora}` : ""}
                    </p>
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
