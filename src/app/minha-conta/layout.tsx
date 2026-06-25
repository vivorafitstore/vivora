"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { User, Receipt, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/minha-conta", label: "Dados pessoais", icon: User },
  { href: "/minha-conta/pedidos", label: "Pedidos", icon: Receipt },
  { href: "/minha-conta/configuracoes", label: "Configurações", icon: Settings },
];

export default function MinhaContaLayout({ children }: { children: ReactNode }) {
  const { usuario, perfil, carregando, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isCompletarPerfil = pathname === "/minha-conta/completar-perfil";

  useEffect(() => {
    if (!carregando && !usuario) {
      router.replace("/login");
    }
  }, [carregando, usuario, router]);

  if (isCompletarPerfil) {
    return <>{children}</>;
  }

  if (carregando) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-xs uppercase tracking-[0.15em] text-graphite/50">Carregando...</p>
      </div>
    );
  }

  if (!usuario) return null;

  const nome = perfil?.nome?.trim() || usuario.displayName?.trim() || "";
  const inicial = nome ? nome[0].toUpperCase() : usuario.email?.[0]?.toUpperCase() ?? "?";
  const primeiroNome = nome.split(" ")[0];

  return (
    <div className="bg-blush/30">
      {/* cabeçalho de boas-vindas */}
      <div className="border-b border-mist/40 bg-gradient-to-b from-blush/70 to-transparent">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-5 py-10">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xl text-white">
            {inicial}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-rose-deep">Minha conta</p>
            <h1 className="font-display text-2xl tracking-display text-ink">
              {primeiroNome ? `Olá, ${primeiroNome}` : "Bem-vinda"}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="flex flex-col gap-8 md:flex-row">
          <aside className="flex shrink-0 gap-1.5 overflow-x-auto md:w-52 md:flex-col">
            {NAV.map((item) => {
              const ativo = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${
                    ativo
                      ? "bg-white text-ink shadow-[0_2px_12px_rgba(74,31,92,0.08)]"
                      : "text-graphite/60 hover:bg-white/60 hover:text-ink"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${ativo ? "text-rose-deep" : "text-graphite/40"}`} />
                  {item.label}
                </Link>
              );
            })}

            <div className="my-2 h-px bg-mist/40 md:mx-0" />

            <button
              onClick={async () => {
                await logout();
                router.replace("/");
              }}
              className="flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-graphite/55 transition hover:bg-white/60 hover:text-rose-deep"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </aside>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
