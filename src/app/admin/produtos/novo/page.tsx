"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NovoProdutoPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/produtos"
        className="flex w-fit items-center gap-1.5 text-sm text-graphite/60 transition hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para produtos
      </Link>
      <div>
        <h1 className="font-display text-2xl tracking-display text-ink">Novo produto</h1>
        <p className="text-sm text-graphite/60">
          Ao salvar, a página pública do produto é criada automaticamente.
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
