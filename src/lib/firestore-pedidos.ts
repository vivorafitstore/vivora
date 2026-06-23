import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Pedido, StatusPedido, StepRastreio } from "./types";

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

export async function obterPedidoPorRastreio(codigo: string): Promise<Pedido | null> {
  const snap = await getDocs(
    query(collection(db, COL), where("codigoRastreio", "==", codigo))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Omit<Pedido, "id">) };
}

export async function atualizarStepsPedido(
  id: string,
  stepsRastreio: StepRastreio[]
): Promise<void> {
  await updateDoc(doc(db, COL, id), { stepsRastreio, atualizadoEm: Date.now() });
}

export async function atualizarObservacoesPedido(
  id: string,
  observacoes: string
): Promise<void> {
  await updateDoc(doc(db, COL, id), { observacoes, atualizadoEm: Date.now() });
}
