// Domain types for the Vivora storefront.
// These mirror the shape products/categories will eventually take in
// Firestore, so swapping the mock data source for live queries later is a
// drop-in change rather than a rewrite.

export type ProductCategory =
  | "leggings"
  | "tops"
  | "conjuntos"
  | "acessorios"
  | "calcados";

export interface ProductVariant {
  id: string;
  cor: string;
  corHex: string;
  tamanhos: string[];
}

export interface Product {
  id: string;
  slug: string;
  nome: string;
  categoria: ProductCategory;
  descricaoCurta: string;
  descricaoCompleta: string;
  beneficios: string[];
  preco: number;
  precoPromocional?: number;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  variantes: ProductVariant[];
  tags: string[];
  estoque: number;
  destaque?: boolean;
  novidade?: boolean;
  /** Gradient tokens used by the placeholder visual until real product
   *  photography is uploaded to Firebase Storage. */
  paletaVisual: [string, string];
}

export interface CartItem {
  productId: string;
  slug: string;
  nome: string;
  preco: number;
  varianteId: string;
  cor: string;
  tamanho: string;
  quantidade: number;
  paletaVisual: [string, string];
}

export interface Review {
  id: string;
  produtoId: string;
  autor: string;
  nota: number;
  comentario: string;
  data: string;
}
