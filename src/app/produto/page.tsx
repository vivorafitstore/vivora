"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Star, ArrowLeft } from "lucide-react";
import { obterProdutoPorSlug, listarProdutos } from "@/lib/firestore-produtos";
import { ProductVisual } from "@/components/ProductVisual";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatarPreco } from "@/lib/format";
import { Product } from "@/lib/types";

export default function ProdutoPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [produto, setProduto] = useState<Product | null | undefined>(undefined);
  const [relacionados, setRelacionados] = useState<Product[]>([]);
  const [fotoAtiva, setFotoAtiva] = useState(0);

  useEffect(() => {
    if (!slug) return;
    obterProdutoPorSlug(slug).then(async (p) => {
      setProduto(p);
      setFotoAtiva(0);
      if (p) {
        const todos = await listarProdutos();
        setRelacionados(
          todos.filter((x) => x.id !== p.id && x.categoria === p.categoria && x.ativo !== false).slice(0, 4)
        );
      }
    });
  }, [slug]);

  if (!slug) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="font-display text-xl tracking-display text-ink">Produto não encontrado</p>
        <Link
          href="/loja"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-rose-deep hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para a loja
        </Link>
      </div>
    );
  }

  if (produto === undefined) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="font-mono text-xs text-graphite/45">Carregando produto...</p>
      </div>
    );
  }

  if (produto === null) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="font-display text-xl tracking-display text-ink">Produto não encontrado</p>
        <Link
          href="/loja"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-rose-deep hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para a loja
        </Link>
      </div>
    );
  }

  const fotos = produto.imagens?.length ? produto.imagens : [];
  const fotoCard = produto.imagemCard;
  const galeriaCompleta = fotoCard ? [fotoCard, ...fotos] : fotos;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <ProductVisual
            paleta={produto.paletaVisual}
            nome={produto.nome}
            imagemUrl={galeriaCompleta[fotoAtiva]}
            className="aspect-[4/5] w-full"
          />
          {galeriaCompleta.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {galeriaCompleta.map((url, i) => (
                <button
                  key={url + i}
                  onClick={() => setFotoAtiva(i)}
                  className={`overflow-hidden rounded-xl border-2 transition ${
                    i === fotoAtiva ? "border-rose" : "border-transparent"
                  }`}
                >
                  <ProductVisual
                    paleta={produto.paletaVisual}
                    nome={produto.nome}
                    imagemUrl={url}
                    className="aspect-square w-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            {produto.tags.length > 0 && (
              <p className="font-mono text-xs uppercase tracking-wide text-rose-deep">
                {produto.tags.join(" · ")}
              </p>
            )}
            <h1 className="mt-2 font-display text-3xl tracking-display text-ink">
              {produto.nome}
            </h1>
            {produto.totalAvaliacoes > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.round(produto.avaliacaoMedia)
                          ? "fill-rose text-rose"
                          : "text-mist"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-graphite/60">
                  {produto.avaliacaoMedia.toFixed(1)} ({produto.totalAvaliacoes} avaliações)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            {produto.precoPromocional ? (
              <>
                <span className="font-display text-2xl tracking-display text-rose-deep">
                  {formatarPreco(produto.precoPromocional)}
                </span>
                <span className="font-mono text-base text-graphite/40 line-through">
                  {formatarPreco(produto.preco)}
                </span>
              </>
            ) : (
              <span className="font-display text-2xl tracking-display text-ink">
                {formatarPreco(produto.preco)}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-graphite/75">{produto.descricaoCompleta}</p>

          {produto.beneficios.length > 0 && (
            <ul className="flex flex-col gap-2">
              {produto.beneficios.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-graphite/80">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          <div className="pulse-rule" />

          <AddToCartButton produto={produto} />

          <p className="font-mono text-xs text-graphite/50">
            {produto.estoque <= 0
              ? "Sem estoque no momento"
              : produto.estoque > 10
                ? "Em estoque"
                : `Restam ${produto.estoque} unidades`}
          </p>
        </div>
      </div>

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 font-display text-xl tracking-display text-ink">
            Você também pode gostar
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {relacionados.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
