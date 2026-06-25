"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RastreioClient } from "./rastreio/[codigo]/RastreioClient";

/**
 * Fallback de 404 do Next, servido pelo Cloudflare para qualquer URL que
 * não corresponda a um arquivo estático real — incluindo, hoje, qualquer
 * código de rastreio real (a rota dinâmica só tem UM html pré-gerado,
 * o "placeholder", então /rastreio/ABC123 cai aqui).
 *
 * Em vez de depender só da regra de rewrite em public/_redirects (que em
 * alguns ambientes de deploy não está sendo aplicada por motivos que não
 * conseguimos diagnosticar de fora do painel), detectamos aqui mesmo, no
 * client, se a URL é de rastreio e — se for — renderizamos o componente
 * de rastreio diretamente, sem precisar de nenhum rewrite de servidor.
 * Para qualquer outra URL, mostramos um 404 normal.
 */
export default function NotFound() {
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    // window só existe no client. O componente é pré-renderizado de forma
    // estática (output: export) sem window disponível, então o valor real
    // só pode ser lido depois do mount, aqui. O setState roda dentro de um
    // microtask (Promise.resolve().then) em vez de direto no corpo do
    // efeito, satisfazendo a regra que evita setState síncrono em efeitos.
    Promise.resolve().then(() => setPath(window.location.pathname));
  }, []);

  // Enquanto não sabemos o path (primeiro render, sem window), não decide nada.
  if (path === null) return null;

  if (path.startsWith("/rastreio/")) {
    return <RastreioClient />;
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="font-display text-3xl tracking-display text-ink">404</p>
      <p className="text-sm text-graphite/55">Esta página não foi encontrada.</p>
      <Link href="/" className="text-sm text-rose-deep hover:underline">
        Voltar para a loja
      </Link>
    </div>
  );
}
