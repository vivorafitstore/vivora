"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [aba, setAba] = useState<"entrar" | "criar">("entrar");

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">

        {/* Eyebrow */}
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-rose-deep mb-4 text-center">
          Área da cliente
        </p>

        {/* Título */}
        <h1 className="font-display text-4xl tracking-display text-ink text-center mb-2 whitespace-pre-line">
          {aba === "entrar" ? "Bem-vinda
de volta." : "Crie sua
conta."}
        </h1>

        {/* Pulse rule decorativo */}
        <div className="flex justify-center mt-4 mb-10">
          <div className="pulse-rule pulse-anim w-28" />
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl bg-white/60 p-1 mb-8 border border-mist/40">
          {(["entrar", "criar"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setAba(tab)}
              className={`flex-1 rounded-xl py-2.5 font-display text-xs tracking-display transition ${
                aba === tab
                  ? "bg-ink text-white shadow-sm"
                  : "text-graphite/60 hover:text-ink"
              }`}
            >
              {tab === "entrar" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {aba === "criar" && (
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite/60">
                Nome
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                className="rounded-xl border border-mist/60 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-graphite/30 outline-none transition focus:border-rose focus:bg-white"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite/60">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="rounded-xl border border-mist/60 bg-white/70 px-4 py-3.5 text-sm text-ink placeholder:text-graphite/30 outline-none transition focus:border-rose focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite/60">
                Senha
              </label>
              {aba === "entrar" && (
                <Link
                  href="#"
                  className="font-mono text-[11px] text-rose-deep hover:underline"
                >
                  Esqueci a senha
                </Link>
              )}
            </div>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-mist/60 bg-white/70 px-4 py-3.5 pr-12 text-sm text-ink placeholder:text-graphite/30 outline-none transition focus:border-rose focus:bg-white"
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
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-mist/60 bg-white/70 px-4 py-3.5 pr-12 text-sm text-ink placeholder:text-graphite/30 outline-none transition focus:border-rose focus:bg-white"
                />
              </div>
            </div>
          )}

          <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-4 font-display text-sm tracking-display text-white transition hover:bg-plum">
            {aba === "entrar" ? "Entrar" : "Criar conta"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-mist/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite/40">ou</span>
          <div className="h-px flex-1 bg-mist/40" />
        </div>

        {/* Continue sem login */}
        <div className="text-center">
          <Link
            href="/loja"
            className="font-mono text-xs text-graphite/50 hover:text-rose-deep transition"
          >
            Continuar sem criar conta →
          </Link>
        </div>

        {/* Nota de segurança */}
        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-graphite/30">
          Compra 100% segura · Dados protegidos
        </p>
      </div>
    </div>
  );
}
