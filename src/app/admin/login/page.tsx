"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      await login(email, senha);
      router.replace("/admin");
    } catch {
      setErro("E-mail ou senha incorretos.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-blush px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img src="/images/logo-vivora-black.png" alt="Vivora" className="h-7 w-auto" />
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-graphite/45">
            <ShieldCheck className="h-3.5 w-3.5" />
            Painel administrativo
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-3xl border border-mist/40 bg-white p-7 shadow-[0_8px_30px_rgba(74,31,92,0.07)]"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">
              E-mail
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-mist/60 bg-blush/40 pl-11 pr-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
                placeholder="admin@vivora.com.br"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">
              Senha
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full rounded-xl border border-mist/60 bg-blush/40 pl-11 pr-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          {erro && <p className="text-sm text-rose-deep">{erro}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 rounded-xl bg-ink px-6 py-3.5 font-display text-sm tracking-display text-white transition hover:bg-plum disabled:opacity-50"
          >
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-graphite/35">
          Acesso restrito à equipe Vivora.
        </p>
      </div>
    </div>
  );
}
