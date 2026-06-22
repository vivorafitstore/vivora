import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { getProductBySlug, getRelatedProducts, getReviewsForProduct, products } from "@/lib/products";
import { ProductVisual } from "@/components/ProductVisual";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatarPreco } from "@/lib/format";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const produto = getProductBySlug(params.slug);
  if (!produto) return {};
  return {
    title: `${produto.nome} — Vivora`,
    description: produto.descricaoCurta,
  };
}

export default function ProdutoPage({ params }: { params: { slug: string } }) {
  const produto = getProductBySlug(params.slug);
  if (!produto) notFound();

  const relacionados = getRelatedProducts(produto);
  const avaliacoes = getReviewsForProduct(produto.id);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="grid grid-cols-3 gap-3">
          <ProductVisual
            paleta={produto.paletaVisual}
            nome={produto.nome}
            className="col-span-3 aspect-[4/5]"
          />
          <ProductVisual paleta={produto.paletaVisual} nome={produto.nome} className="aspect-square" />
          <ProductVisual paleta={produto.paletaVisual} nome={produto.nome} className="aspect-square" />
          <ProductVisual paleta={produto.paletaVisual} nome={produto.nome} className="aspect-square" />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-rose-deep">
              {produto.tags.join(" · ")}
            </p>
            <h1 className="mt-2 font-display text-3xl tracking-display text-ink">
              {produto.nome}
            </h1>
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

          <ul className="flex flex-col gap-2">
            {produto.beneficios.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-graphite/80">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose" />
                {b}
              </li>
            ))}
          </ul>

          <div className="pulse-rule" />

          <AddToCartButton produto={produto} />

          <p className="font-mono text-xs text-graphite/50">
            {produto.estoque > 10 ? "Em estoque" : `Restam ${produto.estoque} unidades`}
          </p>
        </div>
      </div>

      {/* Avaliações */}
      {avaliacoes.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 font-display text-xl tracking-display text-ink">Avaliações</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {avaliacoes.map((review) => (
              <div key={review.id} className="rounded-2xl bg-white/60 p-5">
                <div className="mb-2 flex gap-0.5">
                  {Array.from({ length: review.nota }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-rose text-rose" />
                  ))}
                </div>
                <p className="text-sm text-graphite/80">{review.comentario}</p>
                <p className="mt-3 font-mono text-xs uppercase tracking-wide text-graphite/50">
                  {review.autor}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

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
