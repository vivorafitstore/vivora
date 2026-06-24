"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, User, Search } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CategoryNavDesktop, CategoryNavMobile } from "@/components/CategoryNav";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItens } = useCart();
  const { usuario } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const [busca, setBusca] = useState("");

  if (pathname?.startsWith("/admin")) return null;

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    if (busca.trim()) {
      router.push(`/loja?busca=${encodeURIComponent(busca.trim())}`);
      setBusca("");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-mist/40 bg-blush/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <img
            src="/images/logo-vivora-black.png"
            alt="Vivora"
            className="h-7 w-auto md:h-8"
          />
        </Link>

        {/* Nav categorias */}
        <CategoryNavDesktop />

        {/* Barra de busca compacta — sempre visível no desktop */}
        <form
          onSubmit={buscar}
          className="hidden lg:flex items-center gap-2 rounded-full border border-mist/60 bg-white/70 px-3.5 py-2 w-52 transition focus-within:border-rose focus-within:bg-white focus-within:w-64"
          style={{ transition: "width 0.2s ease" }}
        >
          <Search className="h-3.5 w-3.5 shrink-0 text-graphite/40" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar..."
            className="flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-graphite/35 min-w-0"
          />
          {busca && (
            <button type="button" onClick={() => setBusca("")} className="text-graphite/40 hover:text-ink">
              <X className="h-3 w-3" />
            </button>
          )}
        </form>

        {/* Ações */}
        <div className="flex items-center gap-4">
          {/* Busca mobile — lupa */}
          <button
            type="button"
            aria-label="Buscar"
            onClick={() => {
              const el = document.getElementById("busca-mobile");
              el?.focus();
            }}
            className="lg:hidden text-graphite/70 hover:text-ink transition"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            href={usuario ? "/minha-conta" : "/login"}
            aria-label={usuario ? "Minha conta" : "Entrar na conta"}
            className={`hidden md:flex items-center gap-1 transition ${
              pathname === "/login" || pathname?.startsWith("/minha-conta")
                ? "text-rose"
                : "text-graphite/70 hover:text-ink"
            }`}
          >
            <User className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-[0.15em]">
              {usuario ? "Minha conta" : "Entrar"}
            </span>
          </Link>

          <Link
            href="/carrinho"
            aria-label="Abrir carrinho"
            className="relative flex items-center text-ink"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItens > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose text-[10px] text-white">
                {totalItens}
              </span>
            )}
          </Link>

          <button
            aria-label="Abrir menu"
            className="lg:hidden"
            onClick={() => setMenuAberto((v) => !v)}
          >
            {menuAberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Busca mobile expandida */}
      <div className="lg:hidden border-t border-mist/30 bg-blush px-5 py-2.5">
        <form
          onSubmit={buscar}
          className="flex items-center gap-2 rounded-full border border-mist/50 bg-white/80 px-3.5 py-2"
        >
          <Search className="h-3.5 w-3.5 shrink-0 text-graphite/40" />
          <input
            id="busca-mobile"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produtos..."
            className="flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-graphite/35"
          />
          {busca && (
            <button type="button" onClick={() => setBusca("")} className="text-graphite/40 hover:text-ink">
              <X className="h-3 w-3" />
            </button>
          )}
        </form>
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <div className="border-t border-mist/40 px-5 py-3 lg:hidden">
          <CategoryNavMobile onNavigate={() => setMenuAberto(false)} />
          <Link
            href={usuario ? "/minha-conta" : "/login"}
            className="block border-t border-mist/30 py-2 pt-3 text-sm text-graphite/80"
            onClick={() => setMenuAberto(false)}
          >
            {usuario ? "Minha conta" : "Entrar / Criar conta"}
          </Link>
        </div>
      )}
    </header>
  );
}
