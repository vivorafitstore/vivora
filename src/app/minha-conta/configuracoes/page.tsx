"use client";

import { useState } from "react";
import { Lock, KeyRound } from "lucide-react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  reauthenticateWithPopup,
} from "firebase/auth";
import { useAuth } from "@/context/AuthContext";

export default function ConfiguracoesPage() {
  const { usuario, trocarSenha } = useAuth();

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const ehContaGoogle = usuario?.providerData?.[0]?.providerId === "google.com";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(false);

    if (novaSenha !== confirmarNovaSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (novaSenha.length < 6) {
      setErro("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (!usuario?.email) return;

    setEnviando(true);
    try {
      // Reautentica antes de trocar a senha — o Firebase exige login
      // recente para operações sensíveis como essa.
      if (ehContaGoogle) {
        await reauthenticateWithPopup(usuario, new GoogleAuthProvider());
      } else {
        const credencial = EmailAuthProvider.credential(usuario.email, senhaAtual);
        await reauthenticateWithCredential(usuario, credencial);
      }

      await trocarSenha(novaSenha);
      setSucesso(true);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarNovaSenha("");
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setErro("Senha atual incorreta.");
      } else {
        setErro("Não foi possível alterar a senha. Tente novamente.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-mist/40 bg-white p-6">
      <div>
        <h2 className="font-display text-lg tracking-display text-ink">Configurações</h2>
        <p className="mt-1 text-sm text-graphite/55">Gerencie a segurança da sua conta.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-graphite/60">
          <KeyRound className="h-3.5 w-3.5" /> Trocar senha
        </p>

        {!ehContaGoogle && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Senha atual</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
              <input
                type="password"
                required
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className="w-full rounded-xl border border-mist/60 bg-blush/40 pl-11 pr-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
              />
            </div>
          </div>
        )}

        {ehContaGoogle && (
          <p className="text-xs text-graphite/55">
            Sua conta usa login do Google. Vamos pedir que você confirme com o Google antes de
            definir uma senha para a Vivora.
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Nova senha</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
            <input
              type="password"
              required
              minLength={6}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full rounded-xl border border-mist/60 bg-blush/40 pl-11 pr-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-[0.15em] text-graphite/60">Confirmar nova senha</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite/35" />
            <input
              type="password"
              required
              minLength={6}
              value={confirmarNovaSenha}
              onChange={(e) => setConfirmarNovaSenha(e.target.value)}
              className="w-full rounded-xl border border-mist/60 bg-blush/40 pl-11 pr-4 py-3 text-sm text-ink outline-none focus:border-rose focus:bg-white"
            />
          </div>
        </div>

        {erro && <p className="text-sm text-rose-deep">{erro}</p>}
        {sucesso && <p className="text-sm text-rose-deep">Senha alterada com sucesso!</p>}

        <button
          type="submit"
          disabled={enviando}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 font-display text-sm tracking-display text-white transition hover:bg-plum disabled:opacity-50"
        >
          {enviando ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}
