interface ProductVisualProps {
  paleta: [string, string];
  nome: string;
  className?: string;
  /** URL real da foto do produto (Firebase Storage). Se ausente, usa o gradiente. */
  imagemUrl?: string;
}

/**
 * Mostra a foto real do produto quando disponível (`imagemUrl`, vinda do
 * Firebase Storage). Sem foto, cai no gradiente placeholder com a marca
 * Vivora — útil para produtos recém-cadastrados sem fotos ainda.
 */
export function ProductVisual({ paleta, nome, className = "", imagemUrl }: ProductVisualProps) {
  if (imagemUrl) {
    return (
      <img
        src={imagemUrl}
        alt={nome}
        className={`rounded-2xl object-cover ${className}`}
      />
    );
  }

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
