"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export function AddToCartButton({ produto }: { produto: Product }) {
  const { adicionarItem } = useCart();
  const [varianteId, setVarianteId] = useState(produto.variantes[0].id);
  const [tamanho, setTamanho] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState(false);

  const variante = produto.variantes.find((v) => v.id === varianteId)!;
  const preco = produto.precoPromocional ?? produto.preco;

  function handleAdicionar() {
    if (!tamanho) return;
    adicionarItem({
      productId: produto.id,
      slug: produto.slug,
      nome: produto.nome,
      preco,
      varianteId: variante.id,
      cor: variante.cor,
      tamanho,
      quantidade: 1,
      paletaVisual: produto.paletaVisual,
    });
    setConfirmado(true);
    setTimeout(() => setConfirmado(false), 2200);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-graphite/50">
          Cor — {variante.cor}
        </p>
        <div className="flex gap-2">
          {produto.variantes.map((v) => (
            <button
              key={v.id}
              aria-label={`Selecionar cor ${v.cor}`}
              aria-pressed={v.id === varianteId}
              onClick={() => {
                setVarianteId(v.id);
                setTamanho(null);
              }}
              className={`h-9 w-9 rounded-full border-2 transition ${
                v.id === varianteId ? "border-rose" : "border-transparent"
              }`}
              style={{ backgroundColor: v.corHex }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-graphite/50">
          Tamanho
        </p>
        <div className="flex flex-wrap gap-2">
          {variante.tamanhos.map((t) => (
            <button
              key={t}
              onClick={() => setTamanho(t)}
              aria-pressed={tamanho === t}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                tamanho === t
                  ? "border-ink bg-ink text-white"
                  : "border-mist text-graphite hover:border-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleAdicionar}
        disabled={!tamanho}
        className="rounded-xl bg-rose px-6 py-4 font-display text-sm tracking-display text-white transition hover:bg-rose-deep disabled:cursor-not-allowed disabled:opacity-40"
      >
        {confirmado ? "Adicionado ao carrinho" : "Adicionar ao carrinho"}
      </button>
      {!tamanho && (
        <p className="text-xs text-graphite/50">Escolha um tamanho para continuar.</p>
      )}
    </div>
  );
}
