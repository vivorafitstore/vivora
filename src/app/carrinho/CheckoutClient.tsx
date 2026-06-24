"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Banknote,
  QrCode,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { atualizarUsuario } from "@/lib/firestore-usuarios";
import { criarPedido } from "@/lib/firestore-pedidos";
import { buscarCep } from "@/lib/cep";
import { formatarPreco } from "@/lib/format";
import { ProductVisual } from "@/components/ProductVisual";
import { Endereco, FormaPagamento, ItemPedido } from "@/lib/types";

const ENDERECO_VAZIO: Endereco = {
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

const FORMAS: { id: FormaPagamento; label: string; icon: typeof QrCode; descricao: string }[] = [
  { id: "pix", label: "Pix", icon: QrCode, descricao: "Chave enviada por e-mail após a confirmação" },
  { id: "boleto", label: "Boleto", icon: Banknote, descricao: "Vencimento em até 3 dias úteis" },
  { id: "cartao", label: "Cartão", icon: CreditCard, descricao: "Combinamos o pagamento por e-mail/WhatsApp" },
];

type Etapa = "endereco" | "pagamento" | "confirmado";

export function CheckoutClient() {
  const { usuario, perfil, carregando: carregandoAuth, recarregarPerfil } = useAuth();
  const { items, subtotal, limparCarrinho } = useCart();

  const [etapa, setEtapa] = useState<Etapa>("endereco");
  const [endereco, setEndereco] = useState<Endereco>(ENDERECO_VAZIO);
  const [telefone, setTelefone] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("pix");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pedidoId, setPedidoId] = useState<string | null>(null);

  // Pré-preenche com os dados já salvos no perfil, se houver — sincronizado
  // direto no render (comparando o valor já refletido) em vez de um efeito
  // ou ref, evitando tanto o re-render extra quanto o acesso a ref no render.
  const [perfilRefletido, setPerfilRefletido] = useState<typeof perfil>(null);
  if (perfil && perfil !== perfilRefletido) {
    setPerfilRefletido(perfil);
    if (perfil.endereco) setEndereco(perfil.endereco);
    if (perfil.telefone) setTelefone(perfil.telefone);
  }

  async function handleCepBlur() {
    if (!endereco.cep) return;
    setBuscandoCep(true);
    const resultado = await buscarCep(endereco.cep);
    if (resultado) {
      setEndereco((e) => ({
        ...e,
        rua: resultado.rua || e.rua,
        bairro: resultado.bairro || e.bairro,
        cidade: resultado.cidade || e.cidade,
        uf: resultado.uf || e.uf,
      }));
    }
    setBuscandoCep(false);
  }

  function validarEndereco() {
    return (
      endereco.cep &&
      endereco.rua &&
      endereco.numero &&
      endereco.bairro &&
      endereco.cidade &&
      endereco.uf &&
      telefone
    );
  }

  async function handleContinuarEndereco(e: React.FormEvent) {
    e.preventDefault();
    if (!validarEndereco()) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    setErro(null);
    setEtapa("pagamento");
  }

  async function handleConfirmarPedido() {
    if (!usuario) return;
    setEnviando(true);
    setErro(null);
    try {
      // Salva o endereço/telefone mais recente no perfil para a próxima compra.
      await atualizarUsuario(usuario.uid, { telefone, endereco });
      await recarregarPerfil();

      const itensPedido: ItemPedido[] = items.map((item) => ({
        produtoId: item.productId,
        produtoNome: item.nome,
        variante: item.cor,
        tamanho: item.tamanho,
        quantidade: item.quantidade,
        precoUnitario: item.preco,
      }));

      const id = await criarPedido({
        clienteId: usuario.uid,
        clienteNome: perfil?.nome || usuario.displayName || "",
        clienteEmail: usuario.email || "",
        clienteTelefone: telefone,
        enderecoEntrega: endereco,
        formaPagamento,
        itens: itensPedido,
        valorTotal: subtotal,
        status: "pendente",
      });

      setPedidoId(id);
      limparCarrinho();
      setEtapa("confirmado");
    } catch {
      setErro("Não foi possível finalizar o pedido. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  // Ainda carregando o estado de autenticação.
  if (carregandoAuth) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-graphite/40" />
      </div>
    );
  }

  // Checkout exige conta — é o que vincula o pedido ao cliente.
  if (!usuario) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="font-display text-2xl tracking-display text-ink">
          Entre para finalizar a compra
        </h1>
        <p className="mt-2 text-sm text-graphite/60">
          Crie uma conta ou entre para continuar com o checkout e acompanhar seu pedido.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 font-display text-sm tracking-display text-white transition hover:bg-plum"
        >
          Entrar ou criar conta <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (items.length === 0 && etapa !== "confirmado") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-2xl tracking-display text-ink">Seu carrinho está vazio</h1>
        <p className="mt-2 text-sm text-graphite/60">
          Volte para a loja e escolha as peças do seu próximo treino.
        </p>
        <Link
          href="/loja"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 font-display text-sm tracking-display text-white"
        >
          Ver coleção <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (etapa === "confirmado") {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-rose-deep" />
        <h1 className="font-display text-2xl tracking-display text-ink">Pedido confirmado!</h1>
        <p className="mt-2 text-sm text-graphite/60">
          Recebemos seu pedido{pedidoId ? ` #${pedidoId.slice(0, 8).toUpperCase()}` : ""}. Em breve
          entraremos em contato para confirmar o pagamento via{" "}
          {FORMAS.find((f) => f.id === formaPagamento)?.label}.
        </p>
        <Link
          href="/minha-conta/pedidos"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 font-display text-sm tracking-display text-white transition hover:bg-plum"
        >
          Ver meus pedidos <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="mb-8 font-display text-2xl tracking-display text-ink">Finalizar compra</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          {etapa === "endereco" && (
            <form onSubmit={handleContinuarEndereco} className="flex flex-col gap-5">
              <h2 className="font-display text-base tracking-display text-ink">Endereço de entrega</h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Telefone</label>
                <input
                  required
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">CEP</label>
                  <div className="relative">
                    <input
                      required
                      value={endereco.cep}
                      onChange={(e) => setEndereco((s) => ({ ...s, cep: e.target.value }))}
                      onBlur={handleCepBlur}
                      placeholder="00000-000"
                      className="w-full rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
                    />
                    {buscandoCep && (
                      <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-graphite/40" />
                    )}
                  </div>
                </div>

                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Rua</label>
                  <input
                    required
                    value={endereco.rua}
                    onChange={(e) => setEndereco((s) => ({ ...s, rua: e.target.value }))}
                    className="rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Número</label>
                  <input
                    required
                    value={endereco.numero}
                    onChange={(e) => setEndereco((s) => ({ ...s, numero: e.target.value }))}
                    className="rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Complemento</label>
                  <input
                    value={endereco.complemento}
                    onChange={(e) => setEndereco((s) => ({ ...s, complemento: e.target.value }))}
                    className="rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Bairro</label>
                  <input
                    required
                    value={endereco.bairro}
                    onChange={(e) => setEndereco((s) => ({ ...s, bairro: e.target.value }))}
                    className="rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Cidade</label>
                  <input
                    required
                    value={endereco.cidade}
                    onChange={(e) => setEndereco((s) => ({ ...s, cidade: e.target.value }))}
                    className="rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">UF</label>
                  <input
                    required
                    maxLength={2}
                    value={endereco.uf}
                    onChange={(e) => setEndereco((s) => ({ ...s, uf: e.target.value.toUpperCase() }))}
                    className="rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
                  />
                </div>
              </div>

              {erro && <p className="text-sm text-rose-deep">{erro}</p>}

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center gap-2 self-start rounded-xl bg-ink px-6 py-3.5 font-display text-sm tracking-display text-white transition hover:bg-plum"
              >
                Continuar para pagamento <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {etapa === "pagamento" && (
            <div className="flex flex-col gap-5">
              <button
                onClick={() => setEtapa("endereco")}
                className="flex items-center gap-1.5 text-xs text-graphite/55 hover:text-ink"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Voltar para o endereço
              </button>

              <h2 className="font-display text-base tracking-display text-ink">Forma de pagamento</h2>

              <div className="flex flex-col gap-3">
                {FORMAS.map((forma) => {
                  const Icon = forma.icon;
                  const selecionada = formaPagamento === forma.id;
                  return (
                    <button
                      key={forma.id}
                      type="button"
                      onClick={() => setFormaPagamento(forma.id)}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                        selecionada ? "border-rose bg-blush/40" : "border-mist/50 hover:border-mist"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${selecionada ? "text-rose-deep" : "text-graphite/50"}`} />
                      <div>
                        <p className="font-display text-sm tracking-display text-ink">{forma.label}</p>
                        <p className="text-xs text-graphite/50">{forma.descricao}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-graphite/45">
                O pagamento é confirmado manualmente pela nossa equipe após o pedido — você
                receberá as instruções por e-mail.
              </p>

              {erro && <p className="text-sm text-rose-deep">{erro}</p>}

              <button
                onClick={handleConfirmarPedido}
                disabled={enviando}
                className="mt-2 inline-flex items-center justify-center gap-2 self-start rounded-xl bg-ink px-6 py-3.5 font-display text-sm tracking-display text-white transition hover:bg-plum disabled:opacity-50"
              >
                {enviando ? "Confirmando..." : "Confirmar pedido"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Resumo do pedido */}
        <div className="w-full shrink-0 lg:w-72">
          <div className="rounded-2xl border border-mist/40 bg-white p-5">
            <p className="mb-4 text-[11px] uppercase tracking-[0.1em] text-graphite/45">Resumo</p>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={`${item.varianteId}-${item.tamanho}`} className="flex items-center gap-3">
                  <ProductVisual
                    paleta={item.paletaVisual}
                    nome={item.nome}
                    imagemUrl={item.imagemCard}
                    className="h-12 w-12 shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-ink">{item.nome}</p>
                    <p className="text-[11px] text-graphite/50">
                      {item.cor} · {item.tamanho} · x{item.quantidade}
                    </p>
                  </div>
                  <p className="text-xs text-ink">{formatarPreco(item.preco * item.quantidade)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-mist/30 pt-3 font-display text-sm tracking-display text-ink">
              <span>Total</span>
              <span>{formatarPreco(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
