"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AdminAuthState {
  usuario: User | null;
  ehAdmin: boolean;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthState | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [ehAdmin, setEhAdmin] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUsuario(u);
      if (u) {
        // A custom claim "admin" só aparece no token depois de um login
        // novo ou de um refresh forçado — por isso forçamos aqui (force=true)
        // em vez de confiar no token em cache, que pode ser de antes da
        // claim existir.
        const tokenResult = await u.getIdTokenResult(true);
        setEhAdmin(tokenResult.claims.admin === true);
      } else {
        setEhAdmin(false);
      }
      setCarregando(false);
    });
    return unsub;
  }, []);

  async function login(email: string, senha: string) {
    await signInWithEmailAndPassword(auth, email, senha);
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AdminAuthContext.Provider value={{ usuario, ehAdmin, carregando, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth deve ser usado dentro de AdminAuthProvider");
  return ctx;
}

