import Link from "next/link";
import { Product } from "@/lib/types";
import { formatarPreco } from "@/lib/format";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ produto }: { produto: Product }) {
  const temPromocao = !!produto.precoPromocional;

  return (
    <Link
      href={`/produto?slug=${produto.slug}`}
      className="group flex flex-col gap-3 rounded-2xl p-3 transition hover:bg-white/70"
    >
      <div className="relative aspect-[4/5] w-full">
        <ProductVisual
          paleta={produto.paletaVisual}
          nome={produto.nome}
          imagemUrl={produto.imagemCard}
          className="h-full w-full transition duration-500 group-hover:scale-[1.02]"
        />
        {produto.novidade && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] uppercase tracking-wide text-ink">
            Novidade
          </span>
        )}
        {temPromocao && !produto.novidade && (
          <span className="absolute left-3 top-3 rounded-full bg-rose px-3 py-1 text-[11px] uppercase tracking-wide text-white">
            Oferta
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-display text-sm tracking-display text-ink">{produto.nome}</h3>
        <p className="text-sm text-graphite/70">{produto.descricaoCurta}</p>
        <div className="mt-1 flex items-baseline gap-2">
          {temPromocao ? (
            <>
              <span className="text-sm text-rose-deep">
                {formatarPreco(produto.precoPromocional!)}
              </span>
              <span className="text-xs text-graphite/40 line-through">
                {formatarPreco(produto.preco)}
              </span>
            </>
          ) : (
            <span className="text-sm text-ink">{formatarPreco(produto.preco)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
