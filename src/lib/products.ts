import { Product, Review } from "./types";

// Mock catalog. The shape matches the planned Firestore "produtos"
// collection 1:1, so the future fetch layer only needs to swap this
// in-memory array for a `getDocs(collection(db, "produtos"))` call.

export const products: Product[] = [
  {
    id: "p01",
    slug: "legging-pulse-recorte",
    nome: "Legging Pulse Recorte",
    categoria: "leggings",
    descricaoCurta: "Cintura alta, sustentação total, recorte assimétrico.",
    descricaoCompleta:
      "Legging de compressão média com cintura alta e painel de sustentação dupla. O recorte assimétrico na lateral acompanha o movimento do quadril sem marcar costura, pensada para treino de força e HIIT.",
    beneficios: [
      "Tecido com secagem rápida e compressão média",
      "Cintura alta com sustentação dupla",
      "Bolso lateral para celular",
      "Costura plana — zero atrito",
    ],
    preco: 219.9,
    precoPromocional: 179.9,
    avaliacaoMedia: 4.8,
    totalAvaliacoes: 312,
    variantes: [
      { id: "v1", cor: "Ameixa", corHex: "#4a1f5c", tamanhos: ["P", "M", "G", "GG"] },
      { id: "v2", cor: "Preto", corHex: "#150e1a", tamanhos: ["P", "M", "G", "GG"] },
      { id: "v3", cor: "Rosa Sofisticado", corHex: "#d6486f", tamanhos: ["P", "M", "G"] },
    ],
    tags: ["mais vendido", "treino de força"],
    estoque: 84,
    destaque: true,
    paletaVisual: ["#4a1f5c", "#d6486f"],
  },
  {
    id: "p02",
    slug: "top-impacto-cruzado",
    nome: "Top Impacto Cruzado",
    categoria: "tops",
    descricaoCurta: "Sustentação alta, alças cruzadas nas costas.",
    descricaoCompleta:
      "Top de sustentação alta pensado para treinos de alto impacto. Alças cruzadas nas costas distribuem o peso e mantêm o caimento no lugar do aquecimento à última série.",
    beneficios: [
      "Sustentação alta para alto impacto",
      "Alças cruzadas — sem deslizar",
      "Forro duplo respirável",
    ],
    preco: 149.9,
    avaliacaoMedia: 4.7,
    totalAvaliacoes: 198,
    variantes: [
      { id: "v1", cor: "Preto", corHex: "#150e1a", tamanhos: ["P", "M", "G"] },
      { id: "v2", cor: "Blush", corHex: "#cdb9c4", tamanhos: ["P", "M", "G"] },
    ],
    tags: ["alto impacto"],
    estoque: 56,
    novidade: true,
    paletaVisual: ["#d6486f", "#f7eef1"],
  },
  {
    id: "p03",
    slug: "conjunto-disciplina",
    nome: "Conjunto Disciplina",
    categoria: "conjuntos",
    descricaoCurta: "Top + legging em par proposital, tecido fio duplo.",
    descricaoCompleta:
      "Conjunto pensado para quem treina em casa sem perder presença: top de sustentação média e legging cropped em fio duplo, com a mesma paleta tonal do início ao fim do treino.",
    beneficios: [
      "Peças pensadas para combinar perfeitamente",
      "Fio duplo — opacidade total",
      "Cropped — não desliza na cintura",
    ],
    preco: 339.9,
    precoPromocional: 289.9,
    avaliacaoMedia: 4.9,
    totalAvaliacoes: 421,
    variantes: [
      { id: "v1", cor: "Ameixa", corHex: "#4a1f5c", tamanhos: ["P", "M", "G", "GG"] },
      { id: "v2", cor: "Preto", corHex: "#150e1a", tamanhos: ["P", "M", "G", "GG"] },
    ],
    tags: ["mais vendido", "kit completo"],
    estoque: 41,
    destaque: true,
    paletaVisual: ["#150e1a", "#4a1f5c"],
  },
  {
    id: "p04",
    slug: "faixa-resistencia-trio",
    nome: "Trio Faixas de Resistência",
    categoria: "acessorios",
    descricaoCurta: "Três níveis de carga para treino funcional em casa.",
    descricaoCompleta:
      "Conjunto com três faixas de resistência (leve, média, intensa) em látex têxtil, indicadas para ativação de glúteo, treino funcional e mobilidade. Vem com bolsa de transporte.",
    beneficios: [
      "Três níveis de carga progressiva",
      "Têxtil antiderrapante — não enrola",
      "Bolsa de transporte incluída",
    ],
    preco: 99.9,
    avaliacaoMedia: 4.6,
    totalAvaliacoes: 267,
    variantes: [
      { id: "v1", cor: "Rosa Sofisticado", corHex: "#d6486f", tamanhos: ["Único"] },
    ],
    tags: ["acessório", "treino funcional"],
    estoque: 130,
    paletaVisual: ["#cdb9c4", "#d6486f"],
  },
  {
    id: "p05",
    slug: "tenis-base-flex",
    nome: "Tênis Base Flex",
    categoria: "calcados",
    descricaoCurta: "Solado multidireção para treino funcional indoor.",
    descricaoCompleta:
      "Tênis de treino indoor com solado de multidireção, indicado para HIIT, treino funcional e levantamento leve. Cabedal em malha respirável e entressola de resposta média.",
    beneficios: [
      "Solado multidireção — estabilidade em mudanças de direção",
      "Cabedal em malha respirável",
      "Entressola de resposta média",
    ],
    preco: 459.9,
    avaliacaoMedia: 4.7,
    totalAvaliacoes: 145,
    variantes: [
      { id: "v1", cor: "Preto/Ameixa", corHex: "#150e1a", tamanhos: ["34", "35", "36", "37", "38", "39", "40"] },
    ],
    tags: ["novidade"],
    estoque: 38,
    novidade: true,
    paletaVisual: ["#4a1f5c", "#150e1a"],
  },
  {
    id: "p06",
    slug: "legging-cropped-respiro",
    nome: "Legging Cropped Respiro",
    categoria: "leggings",
    descricaoCurta: "Cropped, tecido perfurado para treinos intensos.",
    descricaoCompleta:
      "Versão cropped da nossa legging de treino, com painéis perfurados nas áreas de maior calor corporal. Cintura média e bolso traseiro para chave ou cartão.",
    beneficios: [
      "Painéis perfurados — ventilação onde importa",
      "Cintura média sem marcar",
      "Bolso traseiro discreto",
    ],
    preco: 189.9,
    avaliacaoMedia: 4.5,
    totalAvaliacoes: 89,
    variantes: [
      { id: "v1", cor: "Blush", corHex: "#cdb9c4", tamanhos: ["P", "M", "G"] },
      { id: "v2", cor: "Preto", corHex: "#150e1a", tamanhos: ["P", "M", "G", "GG"] },
    ],
    tags: ["treino intenso"],
    estoque: 67,
    paletaVisual: ["#f7eef1", "#4a1f5c"],
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    produtoId: "p01",
    autor: "Camila R.",
    nota: 5,
    comentario:
      "Não marca nada e fica firme até no final do treino de pernas. Comprei em duas cores.",
    data: "2026-04-02",
  },
  {
    id: "r2",
    produtoId: "p01",
    autor: "Bia S.",
    nota: 5,
    comentario: "Cintura alta de verdade, não enrola nem desce no agachamento.",
    data: "2026-03-18",
  },
  {
    id: "r3",
    produtoId: "p03",
    autor: "Fernanda A.",
    nota: 5,
    comentario: "O conjunto fechou tão bem que virou meu uniforme de treino.",
    data: "2026-05-01",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.categoria === product.categoria)
    .slice(0, limit);
}

export function getReviewsForProduct(productId: string): Review[] {
  return reviews.filter((r) => r.produtoId === productId);
}

export const categoryLabels: Record<Product["categoria"], string> = {
  leggings: "Leggings",
  tops: "Tops",
  conjuntos: "Conjuntos",
  acessorios: "Acessórios",
  calcados: "Calçados",
};
