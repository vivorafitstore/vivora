import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Endereco, Usuario } from "./types";

const COL = "usuarios";

export async function obterUsuario(uid: string): Promise<Usuario | null> {
  const snap = await getDoc(doc(db, COL, uid));
  if (!snap.exists()) return null;
  return snap.data() as Usuario;
}

export async function criarUsuario(usuario: Omit<Usuario, "criadoEm">): Promise<void> {
  await setDoc(doc(db, COL, usuario.uid), {
    ...usuario,
    criadoEm: Date.now(),
  });
}

export async function atualizarUsuario(
  uid: string,
  dados: Partial<Omit<Usuario, "uid" | "criadoEm">>
): Promise<void> {
  await updateDoc(doc(db, COL, uid), {
    ...dados,
    atualizadoEm: Date.now(),
  });
}

export async function completarPerfilGoogle(
  uid: string,
  telefone: string,
  endereco: Endereco
): Promise<void> {
  await updateDoc(doc(db, COL, uid), {
    telefone,
    endereco,
    perfilIncompleto: false,
    atualizadoEm: Date.now(),
  });
}
