"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X, Link2 } from "lucide-react";
import { Categoria, Product, ProductVariant } from "@/lib/types";
import { listarCategorias } from "@/lib/firestore-categorias";
import { criarProduto, atualizarProduto, slugify } from "@/lib/firestore-produtos";

const PALETAS_SUGERIDAS: [string, string][] = [
  ["#4a1f5c", "#d6486f"],
  ["#150e1a", "#4a1f5c"],
  ["#d6486f", "#f7eef1"],
  ["#b22e56", "#f0aabb"],
];

function novaVariante(): ProductVariant {
  return {
    id: Math.random().toString(36).slice(2, 9),
    cor: "",
    corHex: "#150e1a",
    tamanhos: ["Único"],
  };
}

export function ProductForm({ produtoExistente }: { produtoExistente?: Product }) {
  const router = useRouter();
  const editando = !!produtoExistente;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState(produtoExistente?.nome ?? "");
  const [slug, setSlug] = useState(produtoExistente?.slug ?? "");
  const [slugEditadoManualmente, setSlugEditadoManualmente] = useState(editando);
  const [categoria, setCategoria] = useState(produtoExistente?.categoria ?? "");
  const [subcategoria, setSubcategoria] = useState(produtoExistente?.subcategoria ?? "");
  const [descricaoCurta, setDescricaoCurta] = useState(produtoExistente?.descricaoCurta ?? "");
  const [descricaoCompleta, setDescricaoCompleta] = useState(
    produtoExistente?.descricaoCompleta ?? ""
  );
  const [beneficios, setBeneficios] = useState<string[]>(
    produtoExistente?.beneficios?.length ? produtoExistente.beneficios : [""]
  );
  const [preco, setPreco] = useState(produtoExistente?.preco?.toString() ?? "");
  const [emPromocao, setEmPromocao] = useState(!!produtoExistente?.precoPromocional);
  const [precoPromocional, setPrecoPromocional] = useState(
    produtoExistente?.precoPromocional?.toString() ?? ""
  );
  const [estoque, setEstoque] = useState(produtoExistente?.estoque?.toString() ?? "0");
  const [tags, setTags] = useState(produtoExistente?.tags?.join(", ") ?? "");
  const [destaque, setDestaque] = useState(!!produtoExistente?.destaque);
  const [novidade, setNovidade] = useState(!!produtoExistente?.novidade);
  const [ativo, setAtivo] = useState(produtoExistente?.ativo ?? true);
  const [paletaVisual, setPaletaVisual] = useState<[string, string]>(
    produtoExistente?.paletaVisual ?? PALETAS_SUGERIDAS[0]
  );
  const [variantes, setVariantes] = useState<ProductVariant[]>(
    produtoExistente?.variantes?.length ? produtoExistente.variantes : [novaVariante()]
  );

  const [imagemCard, setImagemCard] = useState(produtoExistente?.imagemCard ?? "");
  const [imagens, setImagens] = useState<string[]>(
    produtoExistente?.imagens?.length ? produtoExistente.imagens : [""]
  );

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    listarCategorias().then(setCategorias);
  }, []);

  const categoriaSelecionada = categorias.find((c) => c.slug === categoria);

  function atualizarBeneficio(i: number, valor: string) {
    setBeneficios((b) => b.map((item, idx) => (idx === i ? valor : item)));
  }

  function atualizarVariante(i: number, dados: Partial<ProductVariant>) {
    setVariantes((v) => v.map((item, idx) => (idx === i ? { ...item, ...dados } : item)));
  }

  function atualizarImagemGaleria(i: number, valor: string) {
    setImagens((imgs) => imgs.map((url, idx) => (idx === i ? valor : url)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!nome.trim() || !categoria || !preco) {
      setErro("Preencha ao menos nome, categoria e preço.");
      return;
    }

    setSalvando(true);
    try {
      const dados = {
        nome: nome.trim(),
        slug: slug.trim() || slugify(nome),
        categoria,
        subcategoria: subcategoria || undefined,
        descricaoCurta: descricaoCurta.trim(),
        descricaoCompleta: descricaoCompleta.trim(),
        beneficios: beneficios.map((b) => b.trim()).filter(Boolean),
        preco: parseFloat(preco),
        precoPromocional: emPromocao && precoPromocional ? parseFloat(precoPromocional) : undefined,
        avaliacaoMedia: produtoExistente?.avaliacaoMedia ?? 0,
        totalAvaliacoes: produtoExistente?.totalAvaliacoes ?? 0,
        variantes,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        estoque: parseInt(estoque, 10) || 0,
        destaque,
        novidade,
        ativo,
        imagemCard: imagemCard.trim() || undefined,
        imagens: imagens.map((i) => i.trim()).filter(Boolean),
        paletaVisual,
      };

      if (editando) {
        await atualizarProduto(produtoExistente!.id, dados);
      } else {
        await criarProduto(dados);
      }
      router.push("/admin/produtos");
    } catch {
      setErro("Não foi possível salvar o produto. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {erro && (
        <p className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose-deep">
          {erro}
        </p>
      )}

      {/* Identificação */}
      <Secao titulo="Identificação">
        <Campo label="Nome do produto">
          <input
            value={nome}
            onChange={(e) => {
              const valor = e.target.value;
              setNome(valor);
              if (!slugEditadoManualmente) setSlug(slugify(valor));
            }}
            className="campo-input"
            placeholder="Ex: Legging Cintura Alta Vivora"
          />
        </Campo>
        <Campo label="Slug (URL)">
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEditadoManualmente(true);
            }}
            className="campo-input font-mono text-xs"
          />
        </Campo>
      </Secao>

      {/* Categoria */}
      <Secao titulo="Categoria">
        <Campo label="Categoria">
          <select
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
              setSubcategoria("");
            }}
            className="campo-input"
          >
            <option value="">Selecione...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Subcategoria">
          <select
            value={subcategoria}
            onChange={(e) => setSubcategoria(e.target.value)}
            disabled={!categoriaSelecionada}
            className="campo-input disabled:opacity-40"
          >
            <option value="">Nenhuma</option>
            {categoriaSelecionada?.subcategorias.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label}
              </option>
            ))}
          </select>
        </Campo>
      </Secao>

      {/* Descrição */}
      <Secao titulo="Descrição">
        <Campo label="Descrição curta (aparece no card)">
          <input
            value={descricaoCurta}
            onChange={(e) => setDescricaoCurta(e.target.value)}
            className="campo-input"
          />
        </Campo>
        <Campo label="Descrição completa (página do produto)">
          <textarea
            value={descricaoCompleta}
            onChange={(e) => setDescricaoCompleta(e.target.value)}
            rows={4}
            className="campo-input resize-none"
          />
        </Campo>
        <Campo label="Benefícios (lista)">
          <div className="flex flex-col gap-2">
            {beneficios.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={b}
                  onChange={(e) => atualizarBeneficio(i, e.target.value)}
                  className="campo-input"
                  placeholder="Ex: Tecido com compressão média"
                />
                <button
                  type="button"
                  onClick={() => setBeneficios((arr) => arr.filter((_, idx) => idx !== i))}
                  className="text-graphite/40 transition hover:text-rose-deep"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setBeneficios((arr) => [...arr, ""])}
              className="flex w-fit items-center gap-1.5 text-sm text-rose-deep"
            >
              <Plus className="h-3.5 w-3.5" /> Adicionar benefício
            </button>
          </div>
        </Campo>
      </Secao>

      {/* Preço e estoque */}
      <Secao titulo="Preço e estoque">
        <Campo label="Preço (R$)">
          <input
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="campo-input"
          />
        </Campo>
        <Campo label="Estoque (unidades)">
          <input
            type="number"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            className="campo-input"
          />
        </Campo>
        <label className="flex items-center gap-2 text-sm text-graphite/75">
          <input
            type="checkbox"
            checked={emPromocao}
            onChange={(e) => setEmPromocao(e.target.checked)}
          />
          Produto em promoção
        </label>
        {emPromocao && (
          <Campo label="Preço promocional (R$)">
            <input
              type="number"
              step="0.01"
              value={precoPromocional}
              onChange={(e) => setPrecoPromocional(e.target.value)}
              className="campo-input"
            />
          </Campo>
        )}
      </Secao>

      {/* Fotos */}
      <Secao titulo="Fotos">
        <Campo label="URL da foto do card (capa do produto)">
          <div className="flex items-center gap-4">
            {imagemCard ? (
              <div className="relative h-24 w-20 overflow-hidden rounded-xl">
                <img src={imagemCard} alt="" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div
                className="grid h-24 w-20 place-items-center rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${paletaVisual[0]}, ${paletaVisual[1]})`,
                }}
              >
                <span className="font-mono text-[9px] text-white/70">sem foto</span>
              </div>
            )}
            <div className="relative flex-1">
              <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
              <input
                value={imagemCard}
                onChange={(e) => setImagemCard(e.target.value)}
                placeholder="https://... (link da foto, ex: da Shopee)"
                className="campo-input pl-10"
              />
            </div>
          </div>
        </Campo>

        <Campo label="Outras fotos do produto (galeria) — cole uma URL por campo">
          <div className="flex flex-col gap-2">
            {imagens.map((url, i) => (
              <div key={i} className="flex items-center gap-3">
                {url ? (
                  <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-12 w-10 shrink-0 rounded-lg bg-mist/30" />
                )}
                <div className="relative flex-1">
                  <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
                  <input
                    value={url}
                    onChange={(e) => atualizarImagemGaleria(i, e.target.value)}
                    placeholder="https://..."
                    className="campo-input pl-10"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setImagens((arr) => arr.filter((_, idx) => idx !== i))}
                  className="text-graphite/40 transition hover:text-rose-deep"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setImagens((arr) => [...arr, ""])}
              className="flex w-fit items-center gap-1.5 text-sm text-rose-deep"
            >
              <Plus className="h-3.5 w-3.5" /> Adicionar foto
            </button>
          </div>
        </Campo>

        <Campo label="Cores do gradiente (placeholder enquanto não há foto)">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={paletaVisual[0]}
              onChange={(e) => setPaletaVisual([e.target.value, paletaVisual[1]])}
              className="h-9 w-9 rounded-lg border border-mist/50"
            />
            <input
              type="color"
              value={paletaVisual[1]}
              onChange={(e) => setPaletaVisual([paletaVisual[0], e.target.value])}
              className="h-9 w-9 rounded-lg border border-mist/50"
            />
            <div className="flex gap-1.5">
              {PALETAS_SUGERIDAS.map((p) => (
                <button
                  key={p.join("")}
                  type="button"
                  onClick={() => setPaletaVisual(p)}
                  className="h-7 w-7 rounded-full border border-white/50"
                  style={{ background: `linear-gradient(135deg, ${p[0]}, ${p[1]})` }}
                />
              ))}
            </div>
          </div>
        </Campo>
      </Secao>

      {/* Variantes */}
      <Secao titulo="Cores e tamanhos">
        <div className="flex flex-col gap-3">
          {variantes.map((v, i) => (
            <div key={v.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-mist/40 p-3">
              <input
                value={v.cor}
                onChange={(e) => atualizarVariante(i, { cor: e.target.value })}
                placeholder="Nome da cor"
                className="campo-input w-36"
              />
              <input
                type="color"
                value={v.corHex}
                onChange={(e) => atualizarVariante(i, { corHex: e.target.value })}
                className="h-9 w-9 rounded-lg border border-mist/50"
              />
              <input
                value={v.tamanhos.join(", ")}
                onChange={(e) =>
                  atualizarVariante(i, {
                    tamanhos: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                placeholder="Tamanhos: P, M, G"
                className="campo-input flex-1"
              />
              <button
                type="button"
                onClick={() => setVariantes((arr) => arr.filter((_, idx) => idx !== i))}
                className="text-graphite/40 transition hover:text-rose-deep"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setVariantes((arr) => [...arr, novaVariante()])}
            className="flex w-fit items-center gap-1.5 text-sm text-rose-deep"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar cor
          </button>
        </div>
      </Secao>

      {/* Organização */}
      <Secao titulo="Organização">
        <Campo label="Tags (separadas por vírgula)">
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="campo-input" />
        </Campo>
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-sm text-graphite/75">
            <input type="checkbox" checked={destaque} onChange={(e) => setDestaque(e.target.checked)} />
            Mostrar em destaque na home
          </label>
          <label className="flex items-center gap-2 text-sm text-graphite/75">
            <input type="checkbox" checked={novidade} onChange={(e) => setNovidade(e.target.checked)} />
            Marcar como novidade
          </label>
          <label className="flex items-center gap-2 text-sm text-graphite/75">
            <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
            Produto ativo (visível na loja)
          </label>
        </div>
      </Secao>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={salvando}
          className="rounded-xl bg-ink px-6 py-3.5 font-display text-sm tracking-display text-white transition hover:bg-plum disabled:opacity-50"
        >
          {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar produto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produtos")}
          className="rounded-xl border border-mist/50 px-6 py-3.5 font-display text-sm tracking-display text-graphite/70 transition hover:bg-blush"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-mist/40 bg-white p-6">
      <h2 className="mb-5 font-display text-base tracking-display text-ink">{titulo}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[11px] uppercase tracking-[0.12em] text-graphite/55">
        {label}
      </label>
      {children}
    </div>
  );
}
