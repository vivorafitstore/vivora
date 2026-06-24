import { doc, getDoc, setDoc } from "firebase/firestore";
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
  // setDoc com merge em vez de updateDoc: tolera o caso do documento ainda
  // não existir (ex: cliente que pulou "Dados pessoais" e foi direto pro
  // checkout, ou contas antigas criadas antes desse fluxo existir).
  // updateDoc lançaria "No document to update" nesse caso.
  await setDoc(
    doc(db, COL, uid),
    {
      uid,
      ...dados,
      atualizadoEm: Date.now(),
    },
    { merge: true }
  );
}

export async function completarPerfilGoogle(
  uid: string,
  telefone: string,
  endereco: Endereco
): Promise<void> {
  await setDoc(
    doc(db, COL, uid),
    {
      uid,
      telefone,
      endereco,
      perfilIncompleto: false,
      atualizadoEm: Date.now(),
    },
    { merge: true }
  );
}
