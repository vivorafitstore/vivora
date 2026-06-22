"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products, categoryLabels } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/lib/types";

type Ordenacao = "relevancia" | "menor-preco" | "maior-preco" | "novidades";

const categorias = Object.entries(categoryLabels) as [Product["categoria"], string][];

export function CatalogClient() {
  const searchParams = useSearchParams();
  const categoriaInicial = searchParams.get("categoria") as Product["categoria"] | null;

  const buscaInicial = searchParams.get("busca") ?? "";

  const [categoriaAtiva, setCategoriaAtiva] = useState<Product["categoria"] | "todas">(
    categoriaInicial ?? "todas"
  );
  const [busca, setBusca] = useState(buscaInicial);
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("relevancia");

  const resultado = useMemo(() => {
    let lista = [...products];

    if (categoriaAtiva !== "todas") {
      lista = lista.filter((p) => p.categoria === categoriaAtiva);
    }

    if (busca.trim()) {
      const termo = busca.trim().toLowerCase();
      lista = lista.filter(
        (p) =>
          p.nome.toLowerCase().includes(termo) ||
          p.tags.some((t) => t.toLowerCase().includes(termo))
      );
    }

    switch (ordenacao) {
      case "menor-preco":
        lista.sort(
          (a, b) => (a.precoPromocional ?? a.preco) - (b.precoPromocional ?? b.preco)
        );
        break;
      case "maior-preco":
        lista.sort(
          (a, b) => (b.precoPromocional ?? b.preco) - (a.precoPromocional ?? a.preco)
        );
        break;
      case "novidades":
        lista.sort((a, b) => Number(b.novidade) - Number(a.novidade));
        break;
      default:
        lista.sort((a, b) => Number(b.destaque) - Number(a.destaque));
    }

    return lista;
  }, [categoriaAtiva, busca, ordenacao]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-rose-deep">Catálogo</p>
        <h1 className="font-display text-3xl tracking-display text-ink">Loja completa</h1>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoriaAtiva("todas")}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              categoriaAtiva === "todas"
                ? "border-ink bg-ink text-white"
                : "border-mist text-graphite hover:border-ink"
            }`}
          >
            Todas
          </button>
          {categorias.map(([valor, label]) => (
            <button
              key={valor}
              onClick={() => setCategoriaAtiva(valor)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                categoriaAtiva === valor
                  ? "border-ink bg-ink text-white"
                  : "border-mist text-graphite hover:border-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produto"
            className="rounded-lg border border-mist bg-white px-3 py-2 text-sm outline-none focus:border-rose"
          />
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
            className="rounded-lg border border-mist bg-white px-3 py-2 text-sm outline-none focus:border-rose"
          >
            <option value="relevancia">Relevância</option>
            <option value="menor-preco">Menor preço</option>
            <option value="maior-preco">Maior preço</option>
            <option value="novidades">Novidades</option>
          </select>
        </div>
      </div>

      {resultado.length === 0 ? (
        <div className="rounded-2xl bg-white/60 p-10 text-center">
          <p className="font-display text-sm tracking-display text-ink">
            Nenhum produto encontrado
          </p>
          <p className="mt-1 text-sm text-graphite/60">
            Tente outra categoria ou ajuste o termo de busca.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {resultado.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </div>
  );
}
