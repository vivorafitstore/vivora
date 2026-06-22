"use client";

import Link from "next/link";
import { useState } from "react";
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

export default function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [aba, setAba] = useState<"entrar" | "criar">("entrar");

  const titulo = aba === "entrar" ? "Bem-vinda de volta." : "Crie sua conta.";
  const subtitulo =
    aba === "entrar"
      ? "Entre para acompanhar seus pedidos e favoritos."
      : "Leve menos de um minuto para começar.";

  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      {/* Painel editorial — visível em telas grandes */}
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between bg-ink px-12 py-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(155deg, var(--plum) 0%, var(--ink) 55%, var(--rose-deep) 130%)",
          }}
        />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--rose)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--rose-deep)" }}
        />

        <div className="relative z-10">
          <Link href="/" className="font-display text-2xl tracking-display text-white">
            VIVORA
          </Link>

          <div className="mt-24 flex items-center gap-3">
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
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
              Vivora Fit Store
            </span>
          </div>

          <p className="font-display text-4xl italic leading-[1.15] text-white mt-6 max-w-md">
            Força é um ritmo que você constrói todos os dias.
          </p>

          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">
            Conjuntos, leggings e acessórios pensados para acompanhar sua
            disciplina — do treino em casa ao dia a dia.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-5">
          <div className="h-px w-full bg-white/15" />
          <div className="flex items-center gap-8">
            <div>
              <p className="font-display text-2xl text-white">12k+</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/45 mt-1">
                Clientes ativas
              </p>
            </div>
            <div>
              <p className="font-display text-2xl text-white">4.9</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/45 mt-1">
                Avaliação média
              </p>
            </div>
            <div>
              <p className="font-display text-2xl text-white">7 dias</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/45 mt-1">
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
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-rose-deep mb-4 flex items-center justify-center gap-2 lg:justify-start">
              <Sparkles className="h-3.5 w-3.5" />
              Área da cliente
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
            <div className="flex flex-col gap-4">
              {aba === "criar" && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite/60">
                    Nome
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
                    <input
                      type="text"
                      placeholder="Seu nome"
                      className="w-full rounded-xl border border-mist/60 bg-blush/40 pl-11 pr-4 py-3.5 text-sm text-ink placeholder:text-graphite/30 outline-none transition focus:border-rose focus:bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite/60">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full rounded-xl border border-mist/60 bg-blush/40 pl-11 pr-4 py-3.5 text-sm text-ink placeholder:text-graphite/30 outline-none transition focus:border-rose focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite/60">
                    Senha
                  </label>
                  {aba === "entrar" && (
                    <Link href="#" className="font-mono text-[11px] text-rose-deep hover:underline">
                      Esqueci a senha
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
                  <input
                    type={mostrarSenha ? "text" : "password"}
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
                  <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite/60">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-mist/60 bg-blush/40 pl-11 pr-12 py-3.5 text-sm text-ink placeholder:text-graphite/30 outline-none transition focus:border-rose focus:bg-white"
                    />
                  </div>
                </div>
              )}

              <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-4 font-display text-sm tracking-display text-white transition hover:bg-plum">
                {aba === "entrar" ? "Entrar" : "Criar conta"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-mist/40" />
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite/40">ou</span>
              <div className="h-px flex-1 bg-mist/40" />
            </div>

            <div className="text-center">
              <Link href="/loja" className="font-mono text-xs text-graphite/50 hover:text-rose-deep transition">
                Continuar sem criar conta →
              </Link>
            </div>
          </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-graphite/35 lg:justify-start">
            <ShieldCheck className="h-3.5 w-3.5 text-rose-deep/70" />
            Compra 100% segura · Dados protegidos
          </p>
        </div>
      </div>
    </div>
  );
}
