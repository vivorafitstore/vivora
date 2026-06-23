// Domain types for the Vivora storefront.
// Produtos, categorias e pedidos agora vivem no Firestore — estes tipos
// descrevem o formato dos documentos das coleções `produtos`, `categorias`
// e `pedidos`.

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
  /** slug da categoria (coleção `categorias`) */
  categoria: string;
  /** slug da subcategoria, opcional */
  subcategoria?: string;
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
  ativo?: boolean;
  /** URL da foto principal (card / capa), no Firebase Storage */
  imagemCard?: string;
  /** URLs das demais fotos do produto */
  imagens?: string[];
  /** Gradiente usado como placeholder visual enquanto não há foto real */
  paletaVisual: [string, string];
  criadoEm?: number;
  atualizadoEm?: number;
}

export interface Subcategoria {
  slug: string;
  label: string;
}

export interface Categoria {
  id: string;
  slug: string;
  label: string;
  ordem: number;
  subcategorias: Subcategoria[];
}

export type StatusPedido = "pendente" | "pago" | "enviado" | "entregue" | "cancelado";

export interface StepRastreio {
  id: string;
  etapa: string;
  descricao: string;
  local: string;
  criadoEm: number;
}

export interface ItemPedido {
  produtoId: string;
  produtoNome: string;
  variante?: string;
  tamanho?: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Pedido {
  id: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone?: string;
  itens: ItemPedido[];
  valorTotal: number;
  status: StatusPedido;
  codigoRastreio?: string;
  transportadora?: string;
  stepsRastreio?: StepRastreio[];
  observacoes?: string;
  criadoEm: number;
  atualizadoEm?: number;
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
  imagemCard?: string;
}

export interface Review {
  id: string;
  produtoId: string;
  autor: string;
  nota: number;
  comentario: string;
  data: string;
}
