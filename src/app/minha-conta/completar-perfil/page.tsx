"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { completarPerfilGoogle } from "@/lib/firestore-usuarios";
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

export default function CompletarPerfilPage() {
  const { usuario, recarregarPerfil } = useAuth();
  const router = useRouter();

  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState<Endereco>(ENDERECO_VAZIO);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [enviando, setEnviando] = useState(false);

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
    setEnviando(true);
    try {
      await completarPerfilGoogle(usuario.uid, telefone, endereco);
      await recarregarPerfil();
      router.replace("/");
    } finally {
      setEnviando(false);
    }
  }

  if (!usuario) return null;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl tracking-display text-ink">Quase lá!</h1>
        <p className="mt-2 text-sm text-graphite/55">
          Só precisamos de mais alguns dados para facilitar suas próximas entregas.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 rounded-3xl border border-mist/40 bg-white p-6"
      >
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
            <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Bairro</label>
            <input
              required
              value={endereco.bairro}
              onChange={(e) => setEndereco((s) => ({ ...s, bairro: e.target.value }))}
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

          <div className="col-span-3 flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Cidade</label>
            <input
              required
              value={endereco.cidade}
              onChange={(e) => setEndereco((s) => ({ ...s, cidade: e.target.value }))}
              className="rounded-xl border border-mist/60 bg-blush/40 px-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 font-display text-sm tracking-display text-white transition hover:bg-plum disabled:opacity-50"
        >
          {enviando ? "Salvando..." : "Concluir cadastro"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
