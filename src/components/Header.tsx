"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, User, Search } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { CategoryNavDesktop, CategoryNavMobile } from "@/components/CategoryNav";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItens } = useCart();
  const [menuAberto, setMenuAberto] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [busca, setBusca] = useState("");

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    if (busca.trim()) {
      router.push(`/loja?busca=${encodeURIComponent(busca.trim())}`);
      setBuscaAberta(false);
      setBusca("");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-mist/40 bg-blush/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex shrink-0 items-center">
          <img
            src="/images/logo-vivora-black.png"
            alt="Vivora"
            className="h-7 w-auto md:h-8"
          />
        </Link>

        <CategoryNavDesktop />

        <div className="flex flex-1 items-center justify-end gap-4">
          <button
            type="button"
            aria-label="Buscar"
            onClick={() => setBuscaAberta((v) => !v)}
            className={`flex items-center transition ${
              buscaAberta ? "text-rose" : "text-graphite/70 hover:text-ink"
            }`}
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            href="/login"
            aria-label="Entrar na conta"
            className={`hidden md:flex items-center gap-1 text-sm transition ${
              pathname === "/login" ? "text-rose" : "text-graphite/70 hover:text-ink"
            }`}
          >
            <User className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-[0.15em]">Entrar</span>
          </Link>

          <Link
            href="/carrinho"
            aria-label="Abrir carrinho"
            className="relative flex items-center gap-1 text-ink"
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

      {/* Barra de busca expansível */}
      {buscaAberta && (
        <div className="border-t border-mist/40 bg-blush px-5 py-3">
          <form
            onSubmit={buscar}
            className="mx-auto flex max-w-6xl items-center gap-3 rounded-xl border border-mist/50 bg-white px-4 py-2.5"
          >
            <Search className="h-4 w-4 text-graphite/40" />
            <input
              autoFocus
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar produtos, categorias..."
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-graphite/35"
            />
            <button
              type="button"
              aria-label="Fechar busca"
              onClick={() => setBuscaAberta(false)}
              className="text-graphite/40 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {menuAberto && (
        <div className="border-t border-mist/40 px-5 py-3 lg:hidden">
          <CategoryNavMobile onNavigate={() => setMenuAberto(false)} />
          <Link
            href="/login"
            className="block border-t border-mist/30 py-2 pt-3 text-sm text-graphite/80"
            onClick={() => setMenuAberto(false)}
          >
            Entrar / Criar conta
          </Link>
        </div>
      )}
    </header>
  );
}
