"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  /** Caminho da imagem em /public, ex: "/images/hero/slide-1.jpg" */
  imagem: string;
  kicker: string;
  titulo: string;
  texto: string;
  cta: { label: string; href: string };
}

const AUTOPLAY_MS = 6000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [ativo, setAtivo] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const irPara = useCallback(
    (index: number) => {
      setAtivo((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  const proximo = useCallback(() => irPara(ativo + 1), [ativo, irPara]);
  const anterior = useCallback(() => irPara(ativo - 1), [ativo, irPara]);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setAtivo((v) => (v + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, ativo]);

  return (
    <section
      className="relative h-[78vh] min-h-[560px] w-full overflow-hidden bg-ink"
      aria-roledescription="carrossel"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.imagem}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === ativo ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={i !== ativo}
        >
          <img
            src={slide.imagem}
            alt={slide.titulo}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Opacidade preta + degrade de marca para legibilidade */}
          <div className="absolute inset-0 bg-black/35" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(95deg, rgba(21,14,26,0.85) 0%, rgba(21,14,26,0.45) 38%, rgba(21,14,26,0.05) 65%)",
            }}
          />

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-5">
            <div className="max-w-lg">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-rose">
                {slide.kicker}
              </p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-display text-white md:text-6xl">
                {slide.titulo}
              </h1>
              <p className="mt-5 max-w-md text-base text-white/75">{slide.texto}</p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  href={slide.cta.href}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-display text-sm tracking-display text-ink transition hover:bg-blush"
                >
                  {slide.cta.label} <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="pulse-rule pulse-anim w-28" />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Setas */}
      {slides.length > 1 && (
        <>
          <button
            onClick={anterior}
            aria-label="Slide anterior"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/20 p-2.5 text-white backdrop-blur transition hover:bg-black/40 md:left-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={proximo}
            aria-label="Próximo slide"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/20 p-2.5 text-white backdrop-blur transition hover:bg-black/40 md:right-8"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Indicadores */}
      {slides.length > 1 && (
        <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.imagem}
              onClick={() => irPara(i)}
              aria-label={`Ir para slide ${i + 1}`}
              aria-current={i === ativo}
              className={`h-1.5 rounded-full transition-all ${
                i === ativo ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
