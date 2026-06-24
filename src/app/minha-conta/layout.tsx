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
  const { usuario, carregando, logout } = useAuth();
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

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="mb-8 font-display text-2xl tracking-display text-ink">Minha conta</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="flex shrink-0 gap-1 overflow-x-auto md:w-52 md:flex-col">
          {NAV.map((item) => {
            const ativo = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
                  ativo ? "bg-ink text-white" : "text-graphite/75 hover:bg-blush hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={async () => {
              await logout();
              router.replace("/");
            }}
            className="mt-2 flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-graphite/70 transition hover:bg-blush hover:text-rose-deep md:mt-auto"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </aside>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
