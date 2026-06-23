import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Pedido, StatusPedido } from "./types";

const COL = "pedidos";

export async function listarPedidos(): Promise<Pedido[]> {
  const snap = await getDocs(query(collection(db, COL), orderBy("criadoEm", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Pedido, "id">) }));
}

export async function criarPedido(
  dados: Omit<Pedido, "id" | "criadoEm" | "atualizadoEm">
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...dados,
    criadoEm: Date.now(),
    atualizadoEm: Date.now(),
  });
  return ref.id;
}

export async function atualizarStatusPedido(
  id: string,
  status: StatusPedido
): Promise<void> {
  await updateDoc(doc(db, COL, id), { status, atualizadoEm: Date.now() });
}

export async function atualizarRastreioPedido(
  id: string,
  codigoRastreio: string,
  transportadora?: string
): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    codigoRastreio,
    ...(transportadora ? { transportadora } : {}),
    atualizadoEm: Date.now(),
  });
}

export async function atualizarObservacoesPedido(
  id: string,
  observacoes: string
): Promise<void> {
  await updateDoc(doc(db, COL, id), { observacoes, atualizadoEm: Date.now() });
}
