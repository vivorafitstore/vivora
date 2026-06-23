import Link from "next/link";
import { Truck, ShieldCheck, RotateCcw, Star } from "lucide-react";
import { reviews } from "@/lib/products";
import { HeroSlider, type HeroSlide } from "@/components/HeroSlider";
import { FeaturedProducts } from "@/components/FeaturedProducts";

const heroSlides: HeroSlide[] = [
  {
    imagem: "/images/hero/slide-promo.jpg",
    kicker: "Promoção especial",
    titulo: "Preços até 40% OFF na compra de dois itens.",
    texto:
      "Mais economia para você — compre 2 itens e ganhe o desconto. Treinos em casa, mais saúde e qualidade de vida.",
    cta: { label: "Ver promoção", href: "/loja" },
  },
  {
    imagem: "/images/hero/slide-1.jpg",
    kicker: "Treino em casa · Força todo dia",
    titulo: "Sua disciplina tem um ritmo.",
    texto:
      "Roupa de treino feita para quem constrói força sem sair de casa — cintura que sustenta, tecido que acompanha cada repetição, presença em cada série.",
    cta: { label: "Ver coleção", href: "/loja" },
  },
  {
    imagem: "/images/hero/slide-2.jpg",
    kicker: "Nova coleção",
    titulo: "Conjuntos para todo o seu treino.",
    texto:
      "Peças pensadas em conjunto, do aquecimento ao alongamento, com tecido que acompanha cada movimento.",
    cta: { label: "Ver conjuntos", href: "/loja?categoria=moda-fitness&item=conjuntos" },
  },
  {
    imagem: "/images/hero/slide-3.jpg",
    kicker: "Mais vendido",
    titulo: "Leggings que sustentam cada série.",
    texto:
      "Compressão certa, cintura alta e tecido que não marca — feita para o treino e para o seu dia.",
    cta: { label: "Ver leggings", href: "/loja?categoria=moda-fitness&item=leggings" },
  },
];

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
  return (
    <div className="flex flex-col">
      <HeroSlider slides={heroSlides} />

      <div className="mx-auto max-w-6xl px-5">
        <div className="pulse-rule" />
      </div>

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

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl tracking-display text-ink">Mais procurados</h2>
          <Link href="/loja" className="text-sm text-rose-deep hover:underline">
            Ver tudo
          </Link>
        </div>
        <FeaturedProducts />
      </section>

      <section className="my-16 bg-ink py-16 text-blush">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-rose">
            Vivora existe por isso
          </p>
          <p className="mt-4 font-display text-2xl leading-snug tracking-display md:text-3xl">
            Treinar em casa não é treinar menos. É treinar no seu ritmo, com a roupa certa
            sustentando cada decisão de continuar.
          </p>
        </div>
      </section>

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
              <p className="mt-3 text-xs uppercase tracking-wide text-graphite/50">
                {review.autor}
              </p>
            </div>
          ))}
        </div>
      </section>

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
