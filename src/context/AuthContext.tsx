"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { criarUsuario, obterUsuario } from "@/lib/firestore-usuarios";
import { Usuario } from "@/lib/types";

interface AuthState {
  usuario: User | null;
  perfil: Usuario | null;
  carregando: boolean;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  login: (email: string, senha: string) => Promise<void>;
  loginComGoogle: () => Promise<{ perfilIncompleto: boolean }>;
  logout: () => Promise<void>;
  trocarSenha: (novaSenha: string) => Promise<void>;
  recarregarPerfil: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  async function carregarPerfil(u: User | null) {
    if (!u) {
      setPerfil(null);
      return;
    }
    const p = await obterUsuario(u.uid);
    setPerfil(p);
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUsuario(u);
      await carregarPerfil(u);
      setCarregando(false);
    });
    return unsub;
  }, []);

  async function registrar(nome: string, email: string, senha: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);
    await updateProfile(cred.user, { displayName: nome });
    await criarUsuario({
      uid: cred.user.uid,
      nome,
      email,
      perfilIncompleto: false,
    });
    await carregarPerfil(cred.user);
  }

  async function login(email: string, senha: string) {
    await signInWithEmailAndPassword(auth, email, senha);
  }

  async function loginComGoogle() {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const existente = await obterUsuario(cred.user.uid);

    if (!existente) {
      await criarUsuario({
        uid: cred.user.uid,
        nome: cred.user.displayName ?? "",
        email: cred.user.email ?? "",
        perfilIncompleto: true,
      });
      await carregarPerfil(cred.user);
      return { perfilIncompleto: true };
    }

    await carregarPerfil(cred.user);
    return { perfilIncompleto: !!existente.perfilIncompleto };
  }

  async function logout() {
    await signOut(auth);
  }

  async function trocarSenha(novaSenha: string) {
    if (!auth.currentUser) throw new Error("Nenhum usuário logado");
    await updatePassword(auth.currentUser, novaSenha);
  }

  async function recarregarPerfil() {
    await carregarPerfil(auth.currentUser);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        perfil,
        carregando,
        registrar,
        login,
        loginComGoogle,
        logout,
        trocarSenha,
        recarregarPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
