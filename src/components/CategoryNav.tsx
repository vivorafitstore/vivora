"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { listarCategorias } from "@/lib/firestore-categorias";
import { Categoria } from "@/lib/types";

function useCategoriasPublicas() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    listarCategorias()
      .then(setCategorias)
      .catch(() => setCategorias([]));
  }, []);

  return categorias;
}

export function CategoryNavDesktop() {
  const categorias = useCategoriasPublicas();

  return (
    <nav className="hidden items-center gap-6 lg:flex">
      {categorias.map((cat) => (
        <div key={cat.id} className="group relative flex h-full items-center">
          <button
            type="button"
            className="flex items-center gap-1 text-sm text-graphite/80 transition hover:text-ink"
          >
            {cat.label}
            {cat.subcategorias.length > 0 && (
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
            )}
          </button>

          {cat.subcategorias.length > 0 && (
            <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
              <div className="w-60 rounded-2xl border border-mist/40 bg-white p-3 shadow-[0_12px_30px_rgba(74,31,92,0.12)]">
                <Link
                  href={`/loja?categoria=${cat.slug}`}
                  className="block px-2 pb-2 pt-1 text-[10px] uppercase tracking-[0.15em] text-graphite/40 hover:text-rose-deep"
                >
                  {cat.label}
                </Link>
                <ul className="flex flex-col gap-0.5">
                  {cat.subcategorias.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/loja?categoria=${cat.slug}&item=${item.slug}`}
                        className="block rounded-lg px-2 py-1.5 text-sm text-graphite/75 transition hover:bg-blush hover:text-ink"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export function CategoryNavMobile({ onNavigate }: { onNavigate?: () => void }) {
  const categorias = useCategoriasPublicas();

  return (
    <nav className="flex flex-col gap-1">
      {categorias.map((cat) => (
        <details key={cat.id} className="group border-t border-mist/30 py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm text-graphite/80">
            {cat.label}
            {cat.subcategorias.length > 0 && (
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            )}
          </summary>
          <ul className="flex flex-col gap-0.5 pb-2 pl-3">
            {cat.subcategorias.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/loja?categoria=${cat.slug}&item=${item.slug}`}
                  className="block py-1.5 text-sm text-graphite/65"
                  onClick={onNavigate}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </nav>
  );
}
