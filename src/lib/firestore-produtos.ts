import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "./firebase";
import { Product } from "./types";

const COL = "produtos";

export function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function listarProdutos(): Promise<Product[]> {
  const snap = await getDocs(query(collection(db, COL), orderBy("criadoEm", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) }));
}

export async function obterProduto(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Product, "id">) };
}

export async function obterProdutoPorSlug(slug: string): Promise<Product | null> {
  const snap = await getDocs(query(collection(db, COL), where("slug", "==", slug)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Omit<Product, "id">) };
}

export async function criarProduto(
  dados: Omit<Product, "id" | "criadoEm" | "atualizadoEm">
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...dados,
    criadoEm: Date.now(),
    atualizadoEm: Date.now(),
  });
  return ref.id;
}

export async function atualizarProduto(
  id: string,
  dados: Partial<Product>
): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...dados, atualizadoEm: Date.now() });
}

export async function excluirProduto(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

/** Sobe uma imagem para o Storage em produtos/{produtoId}/{timestamp-nome} e retorna a URL pública. */
export async function enviarImagemProduto(
  produtoId: string,
  arquivo: File
): Promise<string> {
  const caminho = `produtos/${produtoId}/${Date.now()}-${slugify(arquivo.name)}`;
  const storageRef = ref(storage, caminho);
  await uploadBytes(storageRef, arquivo);
  return getDownloadURL(storageRef);
}

export async function removerImagemProduto(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // Se a URL não corresponder a um arquivo válido do Storage, ignora.
  }
}
