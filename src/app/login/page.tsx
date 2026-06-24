"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ERROS_FIREBASE: Record<string, string> = {
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/invalid-email": "E-mail inválido.",
  "auth/user-not-found": "Não encontramos uma conta com esse e-mail.",
  "auth/wrong-password": "E-mail ou senha incorretos.",
  "auth/email-already-in-use": "Já existe uma conta com esse e-mail.",
  "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
  "auth/popup-closed-by-user": "Login com Google cancelado.",
};

function mensagemErro(err: unknown): string {
  const code = (err as { code?: string })?.code;
  return (code && ERROS_FIREBASE[code]) || "Algo deu errado. Tente novamente.";
}

export default function LoginPage() {
  const { login, registrar, loginComGoogle } = useAuth();
  const router = useRouter();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [aba, setAba] = useState<"entrar" | "criar">("entrar");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const titulo = aba === "entrar" ? "Bem-vindo(a) de volta." : "Crie sua conta.";
  const subtitulo =
    aba === "entrar"
      ? "Entre para acompanhar seus pedidos e favoritos."
      : "Leva menos de um minuto para começar.";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (aba === "criar" && senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setEnviando(true);
    try {
      if (aba === "entrar") {
        await login(email, senha);
      } else {
        await registrar(nome, email, senha);
      }
      router.replace("/");
    } catch (err) {
      setErro(mensagemErro(err));
    } finally {
      setEnviando(false);
    }
  }

  async function handleGoogle() {
    setErro(null);
    setEnviando(true);
    try {
      const { perfilIncompleto } = await loginComGoogle();
      router.replace(perfilIncompleto ? "/minha-conta/completar-perfil" : "/");
    } catch (err) {
      setErro(mensagemErro(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      {/* Painel editorial — visível em telas grandes */}
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-end bg-ink px-12 py-12 self-stretch">
        <img
          src="/images/login-hero.jpg"
          alt="Pessoa treinando em casa com vestimenta Vivora"
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />

        <div className="pointer-events-none absolute inset-0 bg-black/45" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(21,14,26,0.15) 0%, rgba(21,14,26,0.25) 35%, rgba(21,14,26,0.94) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "linear-gradient(155deg, var(--plum) 0%, transparent 45%, var(--rose-deep) 140%)",
            mixBlendMode: "multiply",
          }}
        />

        <Link href="/" className="absolute left-12 top-12 z-10">
          <img
            src="/images/logo-vivora-white.png"
            alt="Vivora"
            className="h-7 w-auto"
          />
        </Link>

        <div className="relative z-10 flex flex-col gap-7">
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 opacity-90"
              fill="none"
              stroke="white"
              strokeWidth="1.4"
              aria-hidden="true"
            >
              <path d="M3 12h4l2-5 4 10 2-5h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/60">
              Vivora Fit Store
            </span>
          </div>

          <p className="font-display text-4xl italic leading-[1.15] text-white max-w-md">
            Força é um ritmo que você constrói todos os dias.
          </p>

          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            Conjuntos, leggings e acessórios pensados para acompanhar sua
            disciplina — do treino em casa ao dia a dia.
          </p>

          <div className="h-px w-full bg-white/15" />

          <div className="flex items-center gap-8">
            <div>
              <p className="font-display text-2xl text-white">12k+</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/45 mt-1">
                Clientes
              </p>
            </div>
            <div>
              <p className="font-display text-2xl text-white">4.9</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/45 mt-1">
                Avaliação média
              </p>
            </div>
            <div>
              <p className="font-display text-2xl text-white">7 dias</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/45 mt-1">
                Troca garantida
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Painel de formulário */}
      <div className="flex items-center justify-center px-5 py-14 sm:py-20">
        <div className="w-full max-w-[26rem]">
          <div className="mb-10 text-center lg:text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-rose-deep mb-4 flex items-center justify-center gap-2 lg:justify-start">
              <Sparkles className="h-3.5 w-3.5" />
              Área do cliente
            </p>

            <h1 className="font-display text-4xl tracking-display text-ink mb-2">
              {titulo}
            </h1>
            <p className="text-sm text-graphite/55">{subtitulo}</p>
          </div>

          <div className="flex rounded-full bg-white p-1 mb-8 border border-mist/50 shadow-[0_1px_2px_rgba(21,14,26,0.04)]">
            {(["entrar", "criar"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAba(tab)}
                className={`flex-1 rounded-full py-2.5 font-display text-xs tracking-display transition-all duration-200 ${
                  aba === tab
                    ? "bg-ink text-white shadow-sm"
                    : "text-graphite/55 hover:text-ink"
                }`}
              >
                {tab === "entrar" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-mist/40 bg-white/80 p-6 sm:p-8 shadow-[0_8px_30px_rgba(74,31,92,0.07)]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {aba === "criar" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">
                    Nome
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full rounded-xl border border-mist/60 bg-blush/40 pl-11 pr-4 py-3.5 text-sm text-ink placeholder:text-graphite/30 outline-none transition focus:border-rose focus:bg-white"
                    />
                  </div>
                </div>
              )}

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
                    placeholder="seu@email.com"
                    className="w-full rounded-xl border border-mist/60 bg-blush/40 pl-11 pr-4 py-3.5 text-sm text-ink placeholder:text-graphite/30 outline-none transition focus:border-rose focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">
                    Senha
                  </label>
                  {aba === "entrar" && (
                    <Link href="#" className="text-[11px] text-rose-deep hover:underline">
                      Esqueci a senha
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    required
                    minLength={6}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-mist/60 bg-blush/40 pl-11 pr-12 py-3.5 text-sm text-ink placeholder:text-graphite/30 outline-none transition focus:border-rose focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-graphite/40 hover:text-ink transition"
                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {aba === "criar" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      required
                      minLength={6}
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-mist/60 bg-blush/40 pl-11 pr-12 py-3.5 text-sm text-ink placeholder:text-graphite/30 outline-none transition focus:border-rose focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {erro && <p className="text-sm text-rose-deep">{erro}</p>}

              <button
                type="submit"
                disabled={enviando}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-4 font-display text-sm tracking-display text-white transition hover:bg-plum disabled:opacity-50"
              >
                {enviando ? "Aguarde..." : aba === "entrar" ? "Entrar" : "Criar conta"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-mist/40" />
              <span className="text-[11px] uppercase tracking-[0.15em] text-graphite/40">ou</span>
              <div className="h-px flex-1 bg-mist/40" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={enviando}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-mist/60 bg-white px-6 py-3.5 text-sm text-ink transition hover:border-graphite/30 disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3.01h3.86c2.26-2.09 3.56-5.17 3.56-8.87z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.86l-3.86-3.01c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.24 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.32c-.24-.72-.38-1.49-.38-2.32s.14-1.6.38-2.32V6.57H1.27A11.93 11.93 0 0 0 0 12c0 1.93.46 3.76 1.27 5.43l4-3.11z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.24 2.7 1.27 6.57l4 3.11C6.22 6.86 8.87 4.75 12 4.75z"
                />
              </svg>
              Continuar com Google
            </button>

            <div className="mt-5 text-center">
              <Link href="/loja" className="text-xs text-graphite/50 hover:text-rose-deep transition">
                Continuar sem criar conta →
              </Link>
            </div>
          </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-center text-[10px] uppercase tracking-[0.15em] text-graphite/35 lg:justify-start">
            <ShieldCheck className="h-3.5 w-3.5 text-rose-deep/70" />
            Compra 100% segura · Dados protegidos
          </p>
        </div>
      </div>
    </div>
  );
}
