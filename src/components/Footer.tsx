import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-mist/40 bg-ink text-blush">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <img
            src="/images/logo-vivora-white.png"
            alt="Vivora"
            className="h-6 w-auto"
          />
          <p className="mt-3 max-w-xs text-sm text-blush/70">
            Roupa de treino para quem constrói força em casa, no seu ritmo, todos os dias.
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-mono uppercase tracking-wide text-blush/50">Loja</p>
          <ul className="flex flex-col gap-2 text-blush/80">
            <li><Link href="/loja">Catálogo completo</Link></li>
            <li><Link href="/loja?categoria=leggings">Leggings</Link></li>
            <li><Link href="/loja?categoria=conjuntos">Conjuntos</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-mono uppercase tracking-wide text-blush/50">Suporte</p>
          <ul className="flex flex-col gap-2 text-blush/80">
            <li><Link href="/carrinho">Carrinho</Link></li>
            <li><a href="#">Trocas e devoluções</a></li>
            <li><a href="#">Guia de medidas</a></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-mono uppercase tracking-wide text-blush/50">Vivora</p>
          <ul className="flex flex-col gap-2 text-blush/80">
            <li><a href="#">Sobre a marca</a></li>
            <li><a href="#">Blog fitness</a></li>
            <li><a href="#">Contato</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-blush/10 px-5 py-5 text-center font-mono text-[11px] text-blush/40">
        © {new Date().getFullYear()} Vivora. Todos os direitos reservados.
      </div>
    </footer>
  );
}
