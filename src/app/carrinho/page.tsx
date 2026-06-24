"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, X, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatarPreco } from "@/lib/format";
import { ProductVisual } from "@/components/ProductVisual";
import { CheckoutClient } from "./CheckoutClient";

export default function CarrinhoPage() {
  const { items, subtotal, removerItem, atualizarQuantidade } = useCart();
  const [emCheckout, setEmCheckout] = useState(false);

  if (emCheckout) {
    return <CheckoutClient />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-2xl tracking-display text-ink">
          Seu carrinho está vazio
        </h1>
        <p className="mt-2 text-sm text-graphite/60">
          Volte para a loja e escolha as peças do seu próximo treino.
        </p>
        <Link
          href="/loja"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 font-display text-sm tracking-display text-white"
        >
          Ver coleção <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="mb-8 font-display text-2xl tracking-display text-ink">
        Carrinho ({items.length})
      </h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={`${item.varianteId}-${item.tamanho}`}
            className="flex items-center gap-4 rounded-2xl bg-white/60 p-4"
          >
            <ProductVisual
              paleta={item.paletaVisual}
              nome={item.nome}
              imagemUrl={item.imagemCard}
              className="h-20 w-20 shrink-0"
            />
            <div className="flex-1">
              <p className="font-display text-sm tracking-display text-ink">{item.nome}</p>
              <p className="text-xs text-graphite/60">
                {item.cor} · Tamanho {item.tamanho}
              </p>
              <p className="mt-1 text-sm text-ink">{formatarPreco(item.preco)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                aria-label="Diminuir quantidade"
                onClick={() =>
                  atualizarQuantidade(item.varianteId, item.tamanho, item.quantidade - 1)
                }
                className="rounded-full border border-mist p-1.5 hover:border-ink"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm">{item.quantidade}</span>
              <button
                aria-label="Aumentar quantidade"
                onClick={() =>
                  atualizarQuantidade(item.varianteId, item.tamanho, item.quantidade + 1)
                }
                className="rounded-full border border-mist p-1.5 hover:border-ink"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              aria-label="Remover item"
              onClick={() => removerItem(item.varianteId, item.tamanho)}
              className="text-graphite/40 hover:text-rose-deep"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-end gap-4 border-t border-mist/40 pt-6">
        <div className="flex w-full max-w-xs justify-between font-display text-lg tracking-display text-ink">
          <span>Subtotal</span>
          <span>{formatarPreco(subtotal)}</span>
        </div>
        <p className="text-xs text-graphite/50">
          Frete será combinado após a confirmação do pedido.
        </p>
        <button
          onClick={() => setEmCheckout(true)}
          className="w-full max-w-xs rounded-xl bg-ink px-6 py-4 text-center font-display text-sm tracking-display text-white transition hover:bg-plum"
        >
          Finalizar compra
        </button>
      </div>
    </div>
  );
}
