"use client";

import { useEffect, useState } from "react";
import { listarProdutos } from "@/lib/firestore-produtos";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/lib/types";

export function FeaturedProducts() {
  const [produtos, setProdutos] = useState<Product[] | null>(null);

  useEffect(() => {
    listarProdutos().then((lista) =>
      setProdutos(lista.filter((p) => p.destaque && p.ativo !== false))
    );
  }, []);

  if (produtos === null) {
    return <p className="font-mono text-xs text-graphite/45">Carregando produtos...</p>;
  }

  if (produtos.length === 0) {
    return (
      <p className="rounded-2xl bg-white/60 p-8 text-sm text-graphite/60">
        Nenhum produto em destaque ainda. Cadastre produtos no painel admin e marque
        &quot;Mostrar em destaque na home&quot;.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {produtos.map((produto) => (
        <ProductCard key={produto.id} produto={produto} />
      ))}
    </div>
  );
}
