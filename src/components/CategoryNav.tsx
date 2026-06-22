import Link from "next/link";
import { ChevronDown } from "lucide-react";

export interface Categoria {
  label: string;
  slug: string;
  itens: string[];
}

export const categorias: Categoria[] = [
  {
    label: "Treine em Casa",
    slug: "treine-em-casa",
    itens: [
      "Mini Bands",
      "Kit de Elásticos",
      "Cárdio",
      "Pesos de tornozelo",
      "Step para exercícios",
      "Halteres ajustáveis",
    ],
  },
  {
    label: "Yoga & Pilates",
    slug: "yoga-pilates",
    itens: [
      "Tapete de yoga",
      "Bloco de yoga",
      "Faixa de alongamento",
      "Bola de pilates",
      "Meia antiderrapante",
    ],
  },
  {
    label: "Moda fitness",
    slug: "moda-fitness",
    itens: [
      "Tapete de yoga",
      "Bloco de yoga",
      "Faixa de alongamento",
      "Bola de pilates",
      "Meia antiderrapante",
    ],
  },
  {
    label: "Hidratação",
    slug: "hidratacao",
    itens: [
      "Garrafinhas motivacionais",
      "Shakers",
      "Copos térmicos",
      "Garrafa com marcador de horário",
    ],
  },
  {
    label: "Bem-estar",
    slug: "bem-estar",
    itens: [
      "Massageador corporal",
      "Pistola de massagem",
      "Rolo de liberação miofascial",
      "Faixa para postura",
      "Almofada lombar",
    ],
  },
];

function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Navegação desktop — cada categoria expande as subcategorias ao passar o mouse. */
export function CategoryNavDesktop() {
  return (
    <nav className="hidden items-center gap-6 lg:flex">
      <Link href="/loja" className="text-sm text-graphite/80 transition hover:text-ink">
        Loja
      </Link>

      {categorias.map((cat) => (
        <div key={cat.slug} className="group relative flex h-full items-center">
          <button
            type="button"
            className="flex items-center gap-1 text-sm text-graphite/80 transition hover:text-ink"
          >
            {cat.label}
            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
          </button>

          <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
            <div className="w-60 rounded-2xl border border-mist/40 bg-white p-3 shadow-[0_12px_30px_rgba(74,31,92,0.12)]">
              <p className="px-2 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-graphite/40">
                {cat.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {cat.itens.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/loja?categoria=${cat.slug}&item=${slugify(item)}`}
                      className="block rounded-lg px-2 py-1.5 text-sm text-graphite/75 transition hover:bg-blush hover:text-ink"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </nav>
  );
}

/** Navegação mobile — categorias em acordeão (details/summary). */
export function CategoryNavMobile({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      <Link
        href="/loja"
        className="py-2 text-sm text-graphite/80"
        onClick={onNavigate}
      >
        Loja
      </Link>

      {categorias.map((cat) => (
        <details key={cat.slug} className="group border-t border-mist/30 py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm text-graphite/80">
            {cat.label}
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>
          <ul className="flex flex-col gap-0.5 pb-2 pl-3">
            {cat.itens.map((item) => (
              <li key={item}>
                <Link
                  href={`/loja?categoria=${cat.slug}&item=${slugify(item)}`}
                  className="block py-1.5 text-sm text-graphite/65"
                  onClick={onNavigate}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </nav>
  );
}
