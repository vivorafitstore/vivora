"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { listarProdutos, excluirProduto } from "@/lib/firestore-produtos";
import { Product } from "@/lib/types";
import { formatarPreco } from "@/lib/format";

export default function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<Product[] | null>(null);
  const [busca, setBusca] = useState("");

  async function carregar() {
    setProdutos(await listarProdutos());
  }

  useEffect(() => {
    listarProdutos().then(setProdutos);
  }, []);

  async function handleExcluir(p: Product) {
    if (!confirm(`Excluir "${p.nome}"? Essa ação não pode ser desfeita.`)) return;
    await excluirProduto(p.id);
    await carregar();
  }

  const filtrados = produtos?.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl tracking-display text-ink">Produtos</h1>
          <p className="text-sm text-graphite/60">
            {produtos ? `${produtos.length} produto(s) cadastrado(s)` : "Carregando..."}
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 font-display text-sm tracking-display text-white transition hover:bg-plum"
        >
          <Plus className="h-4 w-4" />
          Novo produto
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar produto..."
          className="campo-input pl-10"
        />
      </div>

      {!produtos ? (
        <p className="font-mono text-xs text-graphite/45">Carregando produtos...</p>
      ) : filtrados!.length === 0 ? (
        <p className="rounded-2xl border border-mist/40 bg-white p-6 text-sm text-graphite/60">
          Nenhum produto encontrado. Cadastre o primeiro produto clicando em &quot;Novo
          produto&quot;.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-mist/40 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-mist/30 text-graphite/45">
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em]">Foto</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em]">Nome</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em]">Categoria</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em]">Preço</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em]">Estoque</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em]">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtrados!.map((p) => (
                <tr key={p.id} className="border-b border-mist/20 last:border-0">
                  <td className="px-4 py-3">
                    {p.imagemCard ? (
                      <img src={p.imagemCard} alt="" className="h-12 w-10 rounded-lg object-cover" />
                    ) : (
                      <div
                        className="h-12 w-10 rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${p.paletaVisual[0]}, ${p.paletaVisual[1]})`,
                        }}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink">{p.nome}</td>
                  <td className="px-4 py-3 text-graphite/65">{p.categoria}</td>
                  <td className="px-4 py-3">
                    {p.precoPromocional ? (
                      <span className="text-rose-deep">{formatarPreco(p.precoPromocional)}</span>
                    ) : (
                      formatarPreco(p.preco)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.estoque <= 5 ? "text-rose-deep" : "text-graphite/70"}>
                      {p.estoque}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] ${
                        p.ativo === false
                          ? "bg-mist/40 text-graphite/50"
                          : "bg-rose/10 text-rose-deep"
                      }`}
                    >
                      {p.ativo === false ? "Inativo" : "Ativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/produtos/editar?id=${p.id}`}
                        className="text-graphite/40 transition hover:text-ink"
                        aria-label="Editar produto"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleExcluir(p)}
                        className="text-graphite/40 transition hover:text-rose-deep"
                        aria-label="Excluir produto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
