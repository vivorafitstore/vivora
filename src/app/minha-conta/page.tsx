"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { atualizarUsuario } from "@/lib/firestore-usuarios";
import { buscarCep } from "@/lib/cep";
import { Endereco } from "@/lib/types";

const ENDERECO_VAZIO: Endereco = {
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

export default function DadosPessoaisPage() {
  const { usuario, perfil, recarregarPerfil } = useAuth();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState<Endereco>(ENDERECO_VAZIO);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  // O perfil chega de forma assíncrona do Firestore (depois do primeiro
  // render). Sincronizamos o state local com ele assim que chega, comparando
  // contra o valor de perfil já refletido — padrão "Adjusting state in
  // render" do React, sem efeito e sem ref (que também não pode ser lido
  // durante o render).
  const [perfilRefletido, setPerfilRefletido] = useState<typeof perfil>(null);
  if (perfil && perfil !== perfilRefletido) {
    setPerfilRefletido(perfil);
    setNome(perfil.nome ?? "");
    setTelefone(perfil.telefone ?? "");
    setEndereco(perfil.endereco ? { ...ENDERECO_VAZIO, ...perfil.endereco } : ENDERECO_VAZIO);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario) return;
    setSalvando(true);
    setSalvo(false);
    try {
      await atualizarUsuario(usuario.uid, { nome, telefone, endereco });
      await recarregarPerfil();
      setSalvo(true);
      setTimeout(() => setSalvo(false), 3000);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-2xl border border-mist/40 bg-white p-6"
    >
      <div>
        <h2 className="font-display text-lg tracking-display text-ink">Dados pessoais</h2>
        <p className="mt-1 text-sm text-graphite/55">
          Mantenha seus dados atualizados para facilitar suas compras e entregas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">E-mail</label>
          <input
            value={perfil?.email ?? usuario?.email ?? ""}
            disabled
            className="rounded-xl border border-mist/40 bg-mist/20 px-4 py-3 text-sm text-graphite/50"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Telefone</label>
          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(00) 00000-0000"
            className="rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
          />
        </div>
      </div>

      <div className="h-px bg-mist/30" />

      <div>
        <p className="mb-4 text-[11px] uppercase tracking-[0.15em] text-graphite/60">Endereço</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">CEP</label>
            <div className="relative">
              <input
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

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Rua</label>
            <input
              value={endereco.rua}
              onChange={(e) => setEndereco((s) => ({ ...s, rua: e.target.value }))}
              className="rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Número</label>
            <input
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
              value={endereco.bairro}
              onChange={(e) => setEndereco((s) => ({ ...s, bairro: e.target.value }))}
              className="rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Cidade</label>
            <input
              value={endereco.cidade}
              onChange={(e) => setEndereco((s) => ({ ...s, cidade: e.target.value }))}
              className="rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">UF</label>
            <input
              value={endereco.uf}
              onChange={(e) => setEndereco((s) => ({ ...s, uf: e.target.value.toUpperCase() }))}
              maxLength={2}
              className="rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={salvando}
          className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 font-display text-sm tracking-display text-white transition hover:bg-plum disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {salvando ? "Salvando..." : "Salvar alterações"}
        </button>
        {salvo && <p className="text-sm text-rose-deep">Dados salvos com sucesso!</p>}
      </div>
    </form>
  );
}
