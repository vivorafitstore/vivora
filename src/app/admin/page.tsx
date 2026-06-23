"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Tags, Receipt, AlertTriangle, ArrowRight } from "lucide-react";
import { listarProdutos } from "@/lib/firestore-produtos";
import { listarCategorias } from "@/lib/firestore-categorias";
import { listarPedidos } from "@/lib/firestore-pedidos";
import { Product, Categoria, Pedido } from "@/lib/types";
import { formatarPreco } from "@/lib/format";

export default function AdminDashboard() {
  const [produtos, setProdutos] = useState<Product[] | null>(null);
  const [categorias, setCategorias] = useState<Categoria[] | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listarProdutos(), listarCategorias(), listarPedidos()])
      .then(([p, c, ped]) => {
        setProdutos(p);
        setCategorias(c);
        setPedidos(ped);
      })
      .catch((e) => setErro(e.message ?? "Erro ao carregar dados."));
  }, []);

  const carregando = produtos === null || categorias === null || pedidos === null;
  const semEstoque = produtos?.filter((p) => p.estoque <= 0).length ?? 0;
  const estoqueBaixo = produtos?.filter((p) => p.estoque > 0 && p.estoque <= 5).length ?? 0;
  const faturamento =
    pedidos?.reduce((acc, p) => acc + (p.status !== "cancelado" ? p.valorTotal : 0), 0) ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl tracking-display text-ink">Visão geral</h1>
        <p className="text-sm text-graphite/60">Resumo da loja em tempo real.</p>
      </div>

      {erro && (
        <div className="flex items-center gap-2 rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose-deep">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {erro}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardStat
          icone={Package}
          label="Produtos cadastrados"
          valor={carregando ? "—" : produtos!.length}
          href="/admin/produtos"
        />
        <CardStat
          icone={Tags}
          label="Categorias"
          valor={carregando ? "—" : categorias!.length}
          href="/admin/categorias"
        />
        <CardStat
          icone={Receipt}
          label="Pedidos"
          valor={carregando ? "—" : pedidos!.length}
          href="/admin/vendas"
        />
        <CardStat
          icone={Receipt}
          label="Faturamento (pedidos válidos)"
          valor={carregando ? "—" : formatarPreco(faturamento)}
          href="/admin/vendas"
        />
      </div>

      {!carregando && (semEstoque > 0 || estoqueBaixo > 0) && (
        <div className="rounded-2xl border border-mist/40 bg-white p-5">
          <p className="mb-3 font-display text-base tracking-display text-ink">
            Atenção ao estoque
          </p>
          <div className="flex flex-col gap-2 text-sm text-graphite/70">
            {semEstoque > 0 && (
              <p>
                <span className="font-medium text-rose-deep">{semEstoque}</span> produto(s) sem
                estoque.
              </p>
            )}
            {estoqueBaixo > 0 && (
              <p>
                <span className="font-medium text-rose-deep">{estoqueBaixo}</span> produto(s) com
                estoque baixo (≤ 5 unidades).
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/produtos/novo"
          className="flex items-center justify-between rounded-2xl bg-ink px-6 py-5 text-white transition hover:bg-plum"
        >
          <span className="font-display text-sm tracking-display">Cadastrar novo produto</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/admin/categorias"
          className="flex items-center justify-between rounded-2xl border border-mist/40 bg-white px-6 py-5 text-ink transition hover:bg-blush"
        >
          <span className="font-display text-sm tracking-display">Gerenciar categorias</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function CardStat({
  icone: Icone,
  label,
  valor,
  href,
}: {
  icone: typeof Package;
  label: string;
  valor: string | number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-2xl border border-mist/40 bg-white p-5 transition hover:shadow-[0_8px_24px_rgba(74,31,92,0.08)]"
    >
      <Icone className="h-5 w-5 text-rose-deep" />
      <div>
        <p className="font-display text-2xl tracking-display text-ink">{valor}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-graphite/45">
          {label}
        </p>
      </div>
    </Link>
  );
}
