interface ProductVisualProps {
  paleta: [string, string];
  nome: string;
  className?: string;
}

/**
 * Stands in for a real product photo. The catalog has no photography yet,
 * so each product carries a `paletaVisual` pair (two hex tokens) and renders
 * as a soft diagonal gradient card with the Vivora pulse mark. Swapping this
 * for <Image src={produto.imagemUrl} /> once photos exist in Firebase
 * Storage is the only change needed — the rest of the layout is unaffected.
 */
export function ProductVisual({ paleta, nome, className = "" }: ProductVisualProps) {
  return (
    <div
      role="img"
      aria-label={nome}
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl ${className}`}
      style={{
        background: `linear-gradient(135deg, ${paleta[0]} 0%, ${paleta[1]} 100%)`,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-10 w-10 opacity-80"
        fill="none"
        stroke="white"
        strokeWidth="1.4"
        aria-hidden="true"
      >
        <path d="M3 12h4l2-5 4 10 2-5h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
