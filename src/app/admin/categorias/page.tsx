"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Check, X, Sparkles } from "lucide-react";
import {
  listarCategorias,
  criarCategoria,
  atualizarCategoria,
  excluirCategoria,
  adicionarSubcategoria,
  removerSubcategoria,
  editarSubcategoria,
  seedCategoriasPadrao,
} from "@/lib/firestore-categorias";
import { Categoria } from "@/lib/types";

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [novaSubPorCategoria, setNovaSubPorCategoria] = useState<Record<string, string>>({});
  const [editandoCategoria, setEditandoCategoria] = useState<string | null>(null);
  const [labelEditado, setLabelEditado] = useState("");
  const [editandoSub, setEditandoSub] = useState<{ catId: string; slug: string } | null>(null);
  const [subLabelEditado, setSubLabelEditado] = useState("");

  async function carregar() {
    setCarregando(true);
    const dados = await listarCategorias();
    setCategorias(dados);
    setCarregando(false);
  }

  useEffect(() => {
    listarCategorias().then((dados) => {
      setCategorias(dados);
      setCarregando(false);
    });
  }, []);

  async function handleSeed() {
    await seedCategoriasPadrao();
    await carregar();
  }

  async function handleCriarCategoria(e: React.FormEvent) {
    e.preventDefault();
    if (!novaCategoria.trim()) return;
    await criarCategoria(novaCategoria.trim(), categorias.length);
    setNovaCategoria("");
    await carregar();
  }

  async function handleExcluirCategoria(id: string) {
    if (!confirm("Excluir esta categoria e todas as subcategorias dela?")) return;
    await excluirCategoria(id);
    await carregar();
  }

  async function handleSalvarLabel(cat: Categoria) {
    if (labelEditado.trim() && labelEditado !== cat.label) {
      await atualizarCategoria(cat.id, { label: labelEditado.trim() });
      await carregar();
    }
    setEditandoCategoria(null);
  }

  async function handleAdicionarSub(cat: Categoria) {
    const texto = novaSubPorCategoria[cat.id]?.trim();
    if (!texto) return;
    await adicionarSubcategoria(cat, texto);
    setNovaSubPorCategoria((s) => ({ ...s, [cat.id]: "" }));
    await carregar();
  }

  async function handleRemoverSub(cat: Categoria, slug: string) {
    await removerSubcategoria(cat, slug);
    await carregar();
  }

  async function handleSalvarSub(cat: Categoria) {
    if (editandoSub && subLabelEditado.trim()) {
      await editarSubcategoria(cat, editandoSub.slug, subLabelEditado.trim());
      await carregar();
    }
    setEditandoSub(null);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl tracking-display text-ink">Categorias</h1>
          <p className="text-sm text-graphite/60">
            Gerencie as categorias e subcategorias exibidas no menu da loja.
          </p>
        </div>
        {!carregando && categorias.length === 0 && (
          <button
            onClick={handleSeed}
            className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 font-display text-sm tracking-display text-white transition hover:bg-plum"
          >
            <Sparkles className="h-4 w-4" />
            Importar categorias padrão
          </button>
        )}
      </div>

      <form onSubmit={handleCriarCategoria} className="flex gap-3">
        <input
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          placeholder="Nova categoria, ex: Treine em Casa"
          className="flex-1 rounded-xl border border-mist/50 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-rose"
        />
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 font-display text-sm tracking-display text-white transition hover:bg-plum"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </button>
      </form>

      {carregando ? (
        <p className="font-mono text-xs text-graphite/45">Carregando categorias...</p>
      ) : categorias.length === 0 ? (
        <p className="rounded-2xl border border-mist/40 bg-white p-6 text-sm text-graphite/60">
          Nenhuma categoria cadastrada ainda. Clique em &quot;Importar categorias padrão&quot;
          para criar as 5 categorias do briefing, ou adicione uma manualmente acima.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {categorias.map((cat) => (
            <div key={cat.id} className="rounded-2xl border border-mist/40 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                {editandoCategoria === cat.id ? (
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      value={labelEditado}
                      onChange={(e) => setLabelEditado(e.target.value)}
                      autoFocus
                      className="flex-1 rounded-lg border border-mist/50 px-3 py-1.5 text-sm outline-none focus:border-rose"
                    />
                    <button onClick={() => handleSalvarLabel(cat)} className="text-rose-deep">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditandoCategoria(null)} className="text-graphite/40">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <p className="font-display text-base tracking-display text-ink">{cat.label}</p>
                )}

                {editandoCategoria !== cat.id && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setEditandoCategoria(cat.id);
                        setLabelEditado(cat.label);
                      }}
                      className="text-graphite/40 transition hover:text-ink"
                      aria-label="Editar categoria"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleExcluirCategoria(cat.id)}
                      className="text-graphite/40 transition hover:text-rose-deep"
                      aria-label="Excluir categoria"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-graphite/35">
                /loja?categoria={cat.slug}
              </p>

              <ul className="mt-4 flex flex-col gap-1">
                {cat.subcategorias.map((sub) => (
                  <li
                    key={sub.slug}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-blush/60"
                  >
                    {editandoSub?.catId === cat.id && editandoSub.slug === sub.slug ? (
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          value={subLabelEditado}
                          onChange={(e) => setSubLabelEditado(e.target.value)}
                          autoFocus
                          className="flex-1 rounded-lg border border-mist/50 px-2 py-1 text-sm outline-none focus:border-rose"
                        />
                        <button onClick={() => handleSalvarSub(cat)} className="text-rose-deep">
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setEditandoSub(null)} className="text-graphite/40">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm text-graphite/75">{sub.label}</span>
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => {
                              setEditandoSub({ catId: cat.id, slug: sub.slug });
                              setSubLabelEditado(sub.label);
                            }}
                            className="text-graphite/35 transition hover:text-ink"
                            aria-label="Editar subcategoria"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoverSub(cat, sub.slug)}
                            className="text-graphite/35 transition hover:text-rose-deep"
                            aria-label="Remover subcategoria"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex gap-2">
                <input
                  value={novaSubPorCategoria[cat.id] ?? ""}
                  onChange={(e) =>
                    setNovaSubPorCategoria((s) => ({ ...s, [cat.id]: e.target.value }))
                  }
                  placeholder="Nova subcategoria"
                  className="flex-1 rounded-lg border border-mist/40 bg-blush/30 px-3 py-1.5 text-sm outline-none focus:border-rose"
                />
                <button
                  onClick={() => handleAdicionarSub(cat)}
                  className="rounded-lg border border-mist/40 px-3 py-1.5 text-sm text-graphite/70 transition hover:bg-blush"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
