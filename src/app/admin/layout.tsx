"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  Receipt,
  LogOut,
} from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";

const NAV = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/vendas", label: "Vendas", icon: Receipt },
];

function AdminShell({ children }: { children: ReactNode }) {
  const { usuario, carregando, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !usuario && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [carregando, usuario, pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blush">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-graphite/50">
          Carregando...
        </p>
      </div>
    );
  }

  if (!usuario) return null;

  return (
    <div className="flex min-h-screen bg-blush">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-mist/40 bg-white px-4 py-6 md:flex">
        <Link href="/" className="mb-8 flex items-center px-2">
          <img src="/images/logo-vivora-black.png" alt="Vivora" className="h-6 w-auto" />
        </Link>

        <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-graphite/40">
          Painel admin
        </p>

        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const ativo =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
                  ativo
                    ? "bg-ink text-white"
                    : "text-graphite/75 hover:bg-blush hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2 px-2 pt-6">
          <p className="truncate font-mono text-[11px] text-graphite/40">{usuario.email}</p>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-graphite/70 transition hover:bg-blush hover:text-rose-deep"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Topbar mobile simples */}
      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-mist/40 bg-white px-5 py-3 md:hidden">
          <Link href="/" className="flex items-center">
            <img src="/images/logo-vivora-black.png" alt="Vivora" className="h-6 w-auto" />
          </Link>
          <button
            onClick={() => logout()}
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite/60"
          >
            Sair
          </button>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-b border-mist/40 bg-white px-3 py-2 md:hidden">
          {NAV.map((item) => {
            const ativo =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition ${
                  ativo ? "bg-ink text-white" : "text-graphite/65"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="px-5 py-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
