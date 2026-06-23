import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Categoria, Subcategoria } from "./types";

const COL = "categorias";

export function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function listarCategorias(): Promise<Categoria[]> {
  const snap = await getDocs(query(collection(db, COL), orderBy("ordem", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Categoria, "id">) }));
}

export async function criarCategoria(label: string, ordem: number): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    label,
    slug: slugify(label),
    ordem,
    subcategorias: [] as Subcategoria[],
  });
  return ref.id;
}

export async function atualizarCategoria(
  id: string,
  dados: Partial<Pick<Categoria, "label" | "slug" | "ordem" | "subcategorias">>
): Promise<void> {
  await updateDoc(doc(db, COL, id), dados);
}

export async function excluirCategoria(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export async function adicionarSubcategoria(
  categoria: Categoria,
  label: string
): Promise<void> {
  const nova: Subcategoria = { label, slug: slugify(label) };
  await atualizarCategoria(categoria.id, {
    subcategorias: [...categoria.subcategorias, nova],
  });
}

export async function removerSubcategoria(
  categoria: Categoria,
  slug: string
): Promise<void> {
  await atualizarCategoria(categoria.id, {
    subcategorias: categoria.subcategorias.filter((s) => s.slug !== slug),
  });
}

export async function editarSubcategoria(
  categoria: Categoria,
  slugAntigo: string,
  novoLabel: string
): Promise<void> {
  await atualizarCategoria(categoria.id, {
    subcategorias: categoria.subcategorias.map((s) =>
      s.slug === slugAntigo ? { label: novoLabel, slug: slugify(novoLabel) } : s
    ),
  });
}

/** Cria as 5 categorias padrão do briefing, caso a coleção esteja vazia. */
export async function seedCategoriasPadrao(): Promise<void> {
  const padrao: { label: string; itens: string[] }[] = [
    {
      label: "Treine em Casa",
      itens: [
        "Mini Bands",
        "Kit de Elásticos",
        "Cárdio",
        "Pesos de tornozelo",
        "Step para exercícios",
        "Halteres ajustáveis",
      ],
    },
    {
      label: "Yoga & Pilates",
      itens: [
        "Tapete de yoga",
        "Bloco de yoga",
        "Faixa de alongamento",
        "Bola de pilates",
        "Meia antiderrapante",
      ],
    },
    {
      label: "Moda fitness",
      itens: [
        "Leggings",
        "Tops",
        "Conjuntos",
        "Camisetas",
        "Jaquetas",
      ],
    },
    {
      label: "Hidratação",
      itens: [
        "Garrafinhas motivacionais",
        "Shakers",
        "Copos térmicos",
        "Garrafa com marcador de horário",
      ],
    },
    {
      label: "Bem-estar",
      itens: [
        "Massageador corporal",
        "Pistola de massagem",
        "Rolo de liberação miofascial",
        "Faixa para postura",
        "Almofada lombar",
      ],
    },
  ];

  for (let i = 0; i < padrao.length; i++) {
    const cat = padrao[i];
    await addDoc(collection(db, COL), {
      label: cat.label,
      slug: slugify(cat.label),
      ordem: i,
      subcategorias: cat.itens.map((item) => ({ label: item, slug: slugify(item) })),
    });
  }
}
