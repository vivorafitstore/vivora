"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { listarPedidosDoCliente } from "@/lib/firestore-pedidos";
import { formatarPreco } from "@/lib/format";
import { ProductVisual } from "@/components/ProductVisual";
import { Pedido } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente",
  pago: "Pago",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const ABAS = ["em-andamento", "carrinho", "concluidos"] as const;
type Aba = (typeof ABAS)[number];

const ABA_LABEL: Record<Aba, string> = {
  "em-andamento": "Em andamento",
  carrinho: "No carrinho",
  concluidos: "Concluídos",
};

function formatarData(ts: number) {
  return new Date(ts).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function PedidosPage() {
  const { usuario } = useAuth();
  const { items, subtotal } = useCart();
  const [aba, setAba] = useState<Aba>("em-andamento");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) return;
    listarPedidosDoCliente(usuario.uid)
      .then(setPedidos)
      .catch((err) => {
        console.error("Erro ao listar pedidos do cliente:", err);
        setErro(
          "Não foi possível carregar seus pedidos agora. Tente novamente em alguns instantes."
        );
      })
      .finally(() => setCarregando(false));
  }, [usuario]);

  const emAndamento = pedidos.filter((p) => p.status === "pendente" || p.status === "pago" || p.status === "enviado");
  const concluidos = pedidos.filter((p) => p.status === "entregue" || p.status === "cancelado");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl tracking-display text-ink">Pedidos</h2>
        <p className="mt-1 text-sm text-graphite/55">Acompanhe suas compras e o que está no carrinho.</p>
      </div>

      <div className="flex gap-1 rounded-full bg-blush/60 p-1 self-start">
        {ABAS.map((a) => (
          <button
            key={a}
            onClick={() => setAba(a)}
            className={`rounded-full px-4 py-2 text-xs font-display tracking-display transition ${
              aba === a ? "bg-ink text-white" : "text-graphite/60 hover:text-ink"
            }`}
          >
            {ABA_LABEL[a]}
            {a === "carrinho" && items.length > 0 && (
              <span className="ml-1.5">({items.length})</span>
            )}
          </button>
        ))}
      </div>

      {aba !== "carrinho" && carregando && (
        <p className="text-sm text-graphite/45">Carregando pedidos...</p>
      )}

      {aba !== "carrinho" && !carregando && erro && (
        <p className="rounded-2xl border border-rose/30 bg-blush/40 p-4 text-sm text-rose-deep">{erro}</p>
      )}

      {aba === "em-andamento" && !carregando && !erro && (
        emAndamento.length === 0 ? (
          <EstadoVazio mensagem="Você ainda não tem pedidos em andamento." />
        ) : (
          <div className="flex flex-col gap-4">
            {emAndamento.map((pedido) => (
              <PedidoCard key={pedido.id} pedido={pedido} comRastreio />
            ))}
          </div>
        )
      )}

      {aba === "concluidos" && !carregando && !erro && (
        concluidos.length === 0 ? (
          <EstadoVazio mensagem="Nenhum pedido concluído ainda." />
        ) : (
          <div className="flex flex-col gap-4">
            {concluidos.map((pedido) => (
              <PedidoCard key={pedido.id} pedido={pedido} />
            ))}
          </div>
        )
      )}

      {aba === "carrinho" && (
        items.length === 0 ? (
          <div className="rounded-2xl border border-mist/30 bg-white p-8 text-center shadow-[0_4px_24px_rgba(74,31,92,0.05)]">
            <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-mist" />
            <p className="font-display text-base tracking-display text-ink">Seu carrinho está vazio</p>
            <Link
              href="/loja"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-rose-deep hover:underline"
            >
              Ver coleção <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-mist/30 bg-white p-5 shadow-[0_4px_24px_rgba(74,31,92,0.05)]">
              {items.map((item) => (
                <div key={`${item.varianteId}-${item.tamanho}`} className="flex items-center gap-4">
                  <ProductVisual
                    paleta={item.paletaVisual}
                    nome={item.nome}
                    imagemUrl={item.imagemCard}
                    className="h-14 w-14 shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-display text-sm tracking-display text-ink">{item.nome}</p>
                    <p className="text-xs text-graphite/55">
                      {item.cor} · Tam {item.tamanho} · Qtd {item.quantidade}
                    </p>
                  </div>
                  <p className="text-sm text-ink">{formatarPreco(item.preco * item.quantidade)}</p>
                </div>
              ))}
              <div className="flex justify-between border-t border-mist/30 pt-3 font-display text-sm tracking-display text-ink">
                <span>Subtotal</span>
                <span>{formatarPreco(subtotal)}</span>
              </div>
            </div>
            <Link
              href="/carrinho"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 font-display text-sm tracking-display text-white transition hover:bg-plum"
            >
              Ir para o carrinho <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )
      )}
    </div>
  );
}

function EstadoVazio({ mensagem }: { mensagem: string }) {
  return (
    <div className="rounded-2xl border border-mist/30 bg-white p-8 text-center shadow-[0_4px_24px_rgba(74,31,92,0.05)]">
      <Package className="mx-auto mb-3 h-8 w-8 text-mist" />
      <p className="text-sm text-graphite/55">{mensagem}</p>
    </div>
  );
}

function PedidoCard({ pedido, comRastreio }: { pedido: Pedido; comRastreio?: boolean }) {
  return (
    <div className="rounded-2xl border border-mist/30 bg-white p-5 shadow-[0_4px_24px_rgba(74,31,92,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-sm tracking-display text-ink">
            Pedido #{pedido.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="mt-0.5 text-xs text-graphite/45">{formatarData(pedido.criadoEm)}</p>
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

      <div className="mt-3 flex flex-col gap-1">
        {pedido.itens.map((item, i) => (
          <p key={i} className="text-xs text-graphite/60">
            {item.quantidade}x {item.produtoNome}
            {item.variante ? ` · ${item.variante}` : ""}
            {item.tamanho ? ` · ${item.tamanho}` : ""}
          </p>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-mist/30 pt-3">
        <p className="font-display text-sm tracking-display text-ink">{formatarPreco(pedido.valorTotal)}</p>
        {comRastreio && pedido.codigoRastreio && (
          <Link
            href={`/rastreio/${encodeURIComponent(pedido.codigoRastreio)}`}
            className="flex items-center gap-1 text-xs text-rose-deep hover:underline"
          >
            Rastrear pedido <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
