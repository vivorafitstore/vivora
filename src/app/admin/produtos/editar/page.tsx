"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { obterProduto } from "@/lib/firestore-produtos";
import { Product } from "@/lib/types";
import { ProductForm } from "@/components/admin/ProductForm";

export default function EditarProdutoPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [produto, setProduto] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    obterProduto(id).then(setProduto);
  }, [id]);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/produtos"
        className="flex w-fit items-center gap-1.5 text-sm text-graphite/60 transition hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para produtos
      </Link>

      {!id ? (
        <p className="rounded-2xl border border-mist/40 bg-white p-6 text-sm text-graphite/60">
          Produto não encontrado.
        </p>
      ) : produto === undefined ? (
        <p className="font-mono text-xs text-graphite/45">Carregando produto...</p>
      ) : produto === null ? (
        <p className="rounded-2xl border border-mist/40 bg-white p-6 text-sm text-graphite/60">
          Produto não encontrado.
        </p>
      ) : (
        <>
          <div>
            <h1 className="font-display text-2xl tracking-display text-ink">
              Editar — {produto.nome}
            </h1>
            <p className="text-sm text-graphite/60">As alterações refletem na loja imediatamente.</p>
          </div>
          <ProductForm produtoExistente={produto} />
        </>
      )}
    </div>
  );
}
