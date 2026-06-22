"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const links = [
  { href: "/loja", label: "Loja" },
  { href: "/loja?categoria=leggings", label: "Leggings" },
  { href: "/loja?categoria=conjuntos", label: "Conjuntos" },
  { href: "/loja?categoria=acessorios", label: "Acessórios" },
];

export function Header() {
  const pathname = usePathname();
  const { totalItens } = useCart();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-mist/40 bg-blush/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-lg tracking-display text-ink">
          VIVORA
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const ativo = pathname === link.href.split("?")[0];
            return (
              <Link
                key={link.label}
                href={link.href}
                className="relative pb-1 text-sm text-graphite/80 transition hover:text-ink"
              >
                {link.label}
                {ativo && (
                  <span className="pulse-rule pulse-anim absolute -bottom-[1px] left-0 right-0" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/carrinho"
            aria-label="Abrir carrinho"
            className="relative flex items-center gap-1 text-ink"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItens > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose font-mono text-[10px] text-white">
                {totalItens}
              </span>
            )}
          </Link>
          <button
            aria-label="Abrir menu"
            className="md:hidden"
            onClick={() => setMenuAberto((v) => !v)}
          >
            {menuAberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuAberto && (
        <nav className="flex flex-col gap-1 border-t border-mist/40 px-5 py-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="py-2 text-sm text-graphite/80"
              onClick={() => setMenuAberto(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
