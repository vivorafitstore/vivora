import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Star } from "lucide-react";
import { products, reviews } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductVisual } from "@/components/ProductVisual";

const beneficios = [
  { icone: Truck, titulo: "Frete grátis", texto: "Em compras acima de R$ 250 para todo o Brasil." },
  { icone: RotateCcw, titulo: "Troca fácil", texto: "Até 30 dias para trocar tamanho ou cor, sem custo." },
  { icone: ShieldCheck, titulo: "Compra segura", texto: "Pagamento protegido em todas as etapas." },
];

const perguntas = [
  {
    pergunta: "Como escolher o tamanho certo?",
    resposta:
      "Cada produto tem uma tabela de medidas própria na página do produto. Em caso de dúvida entre dois tamanhos, recomendamos o maior para peças de compressão.",
  },
  {
    pergunta: "Qual o prazo de entrega?",
    resposta:
      "O prazo varia por região e aparece no checkout antes da confirmação do pedido, com rastreamento disponível na sua área de pedidos.",
  },
  {
    pergunta: "Posso trocar um produto em promoção?",
    resposta:
      "Sim. Peças em promoção seguem a mesma política de troca de 30 dias das demais peças da loja.",
  },
];

export default function HomePage() {
  const destaques = products.filter((p) => p.destaque);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-12 md:grid-cols-2 md:items-center md:pt-20">
        <div className="flex flex-col gap-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-rose-deep">
            Treino em casa · Força todo dia
          </p>
          <h1 className="font-display text-4xl leading-[1.05] tracking-display text-ink md:text-6xl">
            Sua disciplina
            <br />
            tem um ritmo.
          </h1>
          <p className="max-w-md text-base text-graphite/75">
            Roupa de treino feita para quem constrói força sem sair de casa — cintura que
            sustenta, tecido que acompanha cada repetição, presença em cada série.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/loja"
              className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-4 font-display text-sm tracking-display text-white transition hover:bg-plum"
            >
              Ver coleção <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="pulse-rule pulse-anim w-28" />
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-4">
          <ProductVisual
            paleta={["#4a1f5c", "#d6486f"]}
            nome="Coleção Vivora"
            className="col-span-2 aspect-[16/9]"
          />
          <ProductVisual paleta={["#150e1a", "#4a1f5c"]} nome="Conjuntos" className="aspect-square" />
          <ProductVisual paleta={["#d6486f", "#f7eef1"]} nome="Leggings" className="aspect-square" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5">
        <div className="pulse-rule" />
      </div>

      {/* Benefícios */}
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 md:grid-cols-3">
        {beneficios.map(({ icone: Icone, titulo, texto }) => (
          <div key={titulo} className="flex items-start gap-4 rounded-2xl bg-white/60 p-5">
            <Icone className="mt-1 h-5 w-5 text-rose-deep" />
            <div>
              <p className="font-display text-sm tracking-display text-ink">{titulo}</p>
              <p className="mt-1 text-sm text-graphite/70">{texto}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Destaques */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl tracking-display text-ink">Mais procurados</h2>
          <Link href="/loja" className="text-sm text-rose-deep hover:underline">
            Ver tudo
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {destaques.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      </section>

      {/* Faixa de marca */}
      <section className="my-16 bg-ink py-16 text-blush">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-rose">
            Vivora existe por isso
          </p>
          <p className="mt-4 font-display text-2xl leading-snug tracking-display md:text-3xl">
            Treinar em casa não é treinar menos. É treinar no seu ritmo, com a sua roupa
            sustentando cada decisão de continuar.
          </p>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="mb-6 font-display text-2xl tracking-display text-ink">
          Quem treina, confirma
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
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

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="mb-6 font-display text-2xl tracking-display text-ink">Perguntas frequentes</h2>
        <div className="flex flex-col divide-y divide-mist/40">
          {perguntas.map((item) => (
            <details key={item.pergunta} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-sm tracking-display text-ink">
                {item.pergunta}
                <span className="text-rose-deep transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-graphite/70">{item.resposta}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
