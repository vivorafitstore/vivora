"use client";

import { useState, useEffect, useRef } from "react";
import { X, MessageCircle, ChevronLeft } from "lucide-react";

// ─── tipos ───────────────────────────────────────────────────────────────────
type Msg = {
  id: number;
  from: "bot" | "user";
  text: string;
  time: string;
};

type MenuKey =
  | "main"
  | "produtos"
  | "entrega"
  | "pagamento"
  | "pedido"
  | "trocas"
  | "tamanhos"
  | "sobre"
  | "suporte";

// ─── dados ───────────────────────────────────────────────────────────────────
const menus: Record<
  MenuKey,
  { question: string; buttons: { label: string; reply: string; next?: MenuKey }[] }
> = {
  main: {
    question: "Como podemos ajudar você hoje?",
    buttons: [
      { label: "🛍️ Produtos", reply: "Produtos", next: "produtos" },
      { label: "🚚 Entrega", reply: "Entrega", next: "entrega" },
      { label: "💳 Pagamento", reply: "Pagamento", next: "pagamento" },
      { label: "📦 Meu Pedido", reply: "Meu Pedido", next: "pedido" },
      { label: "🔄 Trocas e Devoluções", reply: "Trocas e Devoluções", next: "trocas" },
      { label: "📏 Tamanhos", reply: "Tamanhos", next: "tamanhos" },
      { label: "🏪 Sobre a Vivora", reply: "Sobre a Vivora", next: "sobre" },
      { label: "📞 Falar com Suporte", reply: "Suporte", next: "suporte" },
    ],
  },
  produtos: {
    question: "Sobre quais produtos você gostaria de saber?",
    buttons: [
      {
        label: "🔥 Mais vendidos",
        reply: "Mais vendidos",
        next: undefined,
      },
      { label: "👚 Conjuntos fitness", reply: "Conjuntos fitness" },
      { label: "✨ Macaquinhos", reply: "Macaquinhos" },
      { label: "🏋️ Leggings", reply: "Leggings" },
      { label: "🆕 Novidades", reply: "Novidades" },
      { label: "⬅️ Voltar", reply: "Voltar ao menu", next: "main" },
    ],
  },
  entrega: {
    question: "Qual informação sobre entrega você procura?",
    buttons: [
      { label: "🕐 Prazo de entrega", reply: "Prazo de entrega" },
      { label: "💰 Valor do frete", reply: "Valor do frete" },
      { label: "🇧🇷 Entregam em todo Brasil?", reply: "Entregam em todo Brasil?" },
      { label: "🔎 Rastreamento", reply: "Rastreamento" },
      { label: "⬅️ Voltar", reply: "Voltar ao menu", next: "main" },
    ],
  },
  pagamento: {
    question: "Selecione uma opção:",
    buttons: [
      { label: "💳 Formas de pagamento", reply: "Formas de pagamento" },
      { label: "💰 Parcelamento", reply: "Parcelamento" },
      { label: "🔒 Segurança", reply: "Segurança" },
      { label: "⬅️ Voltar", reply: "Voltar ao menu", next: "main" },
    ],
  },
  pedido: {
    question: "Escolha uma opção:",
    buttons: [
      { label: "📦 Onde está meu pedido?", reply: "Onde está meu pedido?" },
      { label: "🚚 Pedido atrasado", reply: "Pedido atrasado" },
      { label: "📍 Alterar endereço", reply: "Alterar endereço" },
      { label: "❌ Cancelar pedido", reply: "Cancelar pedido" },
      { label: "⬅️ Voltar", reply: "Voltar ao menu", next: "main" },
    ],
  },
  trocas: {
    question: "Sobre o que deseja ajuda?",
    buttons: [
      { label: "🔄 Solicitar troca", reply: "Solicitar troca" },
      { label: "↩️ Solicitar devolução", reply: "Solicitar devolução" },
      { label: "⚠️ Produto com defeito", reply: "Produto com defeito" },
      { label: "⬅️ Voltar", reply: "Voltar ao menu", next: "main" },
    ],
  },
  tamanhos: {
    question: "Qual sua dúvida?",
    buttons: [
      { label: "📏 Tabela de medidas", reply: "Tabela de medidas" },
      { label: "👕 Estou entre dois tamanhos", reply: "Estou entre dois tamanhos" },
      { label: "🇧🇷 Tamanho padrão brasileiro?", reply: "Tamanho padrão brasileiro?" },
      { label: "⬅️ Voltar", reply: "Voltar ao menu", next: "main" },
    ],
  },
  sobre: {
    question: "Escolha uma opção:",
    buttons: [
      { label: "💜 Quem somos", reply: "Quem somos" },
      { label: "🏪 Loja física", reply: "Loja física" },
      { label: "📧 Contato", reply: "Contato" },
      { label: "⬅️ Voltar", reply: "Voltar ao menu", next: "main" },
    ],
  },
  suporte: {
    question: "📧 Precisa de ajuda personalizada?\nNossa equipe está pronta para atender você.",
    buttons: [
      { label: "✉️ Enviar e-mail", reply: "Falar com Suporte" },
      { label: "⬅️ Voltar", reply: "Voltar ao menu", next: "main" },
    ],
  },
};

const replies: Record<string, string> = {
  "Mais vendidos":
    "🔥 Nossos produtos mais procurados são os conjuntos fitness, leggings de cintura alta e macaquinhos modeladores.",
  "Conjuntos fitness":
    "👚 Temos conjuntos fitness desenvolvidos para proporcionar conforto, mobilidade e ótimo caimento para seus treinos.",
  Macaquinhos:
    "✨ Os macaquinhos Vivora oferecem praticidade, estilo e conforto para treinos e atividades do dia a dia.",
  Leggings:
    "🏋️ Nossas leggings possuem modelagem moderna, cintura alta e tecido confortável para maior segurança durante os exercícios.",
  Novidades:
    "🆕 Estamos sempre adicionando novos produtos à coleção. Confira a seção de novidades da loja.",
  "Prazo de entrega":
    "🚚 O prazo de entrega varia conforme sua localização e pode ser consultado antes de finalizar a compra.",
  "Valor do frete":
    "📦 O frete é grátis em compras acima de R$ 300. Para valores menores, é calculado automaticamente no checkout após informar seu CEP.",
  "Entregam em todo Brasil?":
    "🇧🇷 Sim! Realizamos entregas para todo o território nacional.",
  Rastreamento:
    "🔎 Assim que seu pedido for enviado, você receberá o código de rastreamento por e-mail.",
  "Formas de pagamento":
    "💳 Aceitamos cartão de crédito, PIX e outras formas disponíveis no checkout.",
  Parcelamento:
    "💰 Compras no cartão podem ser parceladas conforme as condições exibidas durante a finalização do pedido.",
  Segurança:
    "🔒 Todas as transações são protegidas por tecnologia de criptografia e ambiente seguro.",
  "Onde está meu pedido?":
    "📦 Você pode acompanhar seu pedido através do código de rastreamento enviado por e-mail.",
  "Pedido atrasado":
    "🚚 Em alguns períodos pode ocorrer atraso logístico. Recomendamos acompanhar o rastreamento atualizado.",
  "Alterar endereço":
    "📍 Caso o pedido ainda não tenha sido processado, entre em contato com nosso suporte.",
  "Cancelar pedido":
    "❌ O cancelamento depende do status atual do pedido. Entre em contato com nossa equipe para verificar a possibilidade.",
  "Solicitar troca":
    "🔄 Você pode solicitar a troca seguindo nossa política disponível no site.",
  "Solicitar devolução":
    "↩️ Caso seu pedido esteja dentro das condições da política de devolução, nossa equipe poderá orientar o processo.",
  "Produto com defeito":
    "⚠️ Entre em contato com nosso suporte enviando fotos do produto para análise.",
  "Tabela de medidas":
    "📏 Cada produto possui tabela de medidas disponível na própria página do produto.",
  "Estou entre dois tamanhos":
    "👕 Se estiver entre dois tamanhos, recomendamos escolher o maior para mais conforto.",
  "Tamanho padrão brasileiro?":
    "🇧🇷 Sim, nossas peças seguem o padrão brasileiro informado na descrição dos produtos.",
  "Quem somos":
    "💜 A Vivora é uma loja especializada em moda fitness feminina, oferecendo produtos modernos, confortáveis e estilosos.",
  "Loja física": "🏪 Atualmente operamos exclusivamente online.",
  Contato:
    "📧 Nossa equipe está disponível para ajudar através dos canais de atendimento da loja.",
  "Falar com Suporte": "__email__",
};

function now() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

let idSeq = 0;
function nextId() {
  return ++idSeq;
}

// ─── componente ──────────────────────────────────────────────────────────────
export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [menu, setMenu] = useState<MenuKey>("main");
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // mensagem de boas-vindas ao abrir pela primeira vez
  useEffect(() => {
    if (open && !started) {
      setStarted(true);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMsgs([
          {
            id: nextId(),
            from: "bot",
            text: "Olá! 👋\n\nBem-vinda à Vivora.\n\nComo podemos ajudar você hoje?",
            time: now(),
          },
        ]);
      }, 900);
    }
  }, [open, started]);

  // scroll automático
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  function addMsg(msg: Omit<Msg, "id">) {
    setMsgs((prev) => [...prev, { ...msg, id: nextId() }]);
  }

  function handleButton(btn: (typeof menus)[MenuKey]["buttons"][number]) {
    // mensagem do usuário
    addMsg({ from: "user", text: btn.label, time: now() });

    // se navega para um menu
    if (btn.next) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMenu(btn.next!);
        addMsg({ from: "bot", text: menus[btn.next!].question, time: now() });
      }, 600);
      return;
    }

    // resposta pré-definida
    const reply = replies[btn.reply];
    if (!reply) return;

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      if (reply === "__email__") {
        addMsg({
          from: "bot",
          text: "✉️ Você pode nos contatar pelo e-mail:\n\nvivorafitstore@gmail.com\n\nNossa equipe responde em até 1 dia útil. 💜",
          time: now(),
        });
        setTimeout(() => {
          window.open("mailto:vivorafitstore@gmail.com", "_blank");
        }, 400);
      } else {
        addMsg({ from: "bot", text: reply, time: now() });
      }
    }, 700);
  }

  const currentMenu = menus[menu];

  return (
    <>
      {/* botão flutuante */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir chat"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg, #4a1f5c, #d6486f)" }}
      >
        {open ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <MessageCircle className="h-5 w-5 text-white" />
        )}
      </button>

      {/* janela do chat */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl"
          style={{
            width: "min(380px, calc(100vw - 2rem))",
            height: "min(580px, calc(100vh - 8rem))",
            background: "#fff",
          }}
        >
          {/* header */}
          <div
            className="flex shrink-0 items-center gap-3 px-4 py-3"
            style={{ background: "linear-gradient(135deg, #4a1f5c, #d6486f)" }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Vivora</p>
              <p className="text-[11px] text-white/70">Atendimento online</p>
            </div>
            {menu !== "main" && (
              <button
                onClick={() => {
                  setMenu("main");
                  setTyping(true);
                  setTimeout(() => {
                    setTyping(false);
                    addMsg({ from: "bot", text: menus.main.question, time: now() });
                  }, 400);
                }}
                className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[11px] text-white/90 transition hover:bg-white/25"
              >
                <ChevronLeft className="h-3 w-3" />
                Menu
              </button>
            )}
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* mensagens */}
          <div className="flex-1 overflow-y-auto px-4 py-4" style={{ background: "#f7eef1" }}>
            {msgs.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                  style={
                    msg.from === "bot"
                      ? { background: "#fff", color: "#2b232f", borderRadius: "4px 18px 18px 18px" }
                      : {
                          background: "linear-gradient(135deg, #4a1f5c, #d6486f)",
                          color: "#fff",
                          borderRadius: "18px 4px 18px 18px",
                        }
                  }
                >
                  {msg.text.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < msg.text.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                  <p
                    className="mt-1 text-[10px] opacity-50"
                    style={{ textAlign: msg.from === "user" ? "right" : "left" }}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* indicador de digitação */}
            {typing && (
              <div className="mb-3 flex justify-start">
                <div
                  className="flex items-center gap-1 rounded-2xl px-4 py-3"
                  style={{ background: "#fff", borderRadius: "4px 18px 18px 18px" }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="block h-1.5 w-1.5 rounded-full"
                      style={{
                        background: "#cdb9c4",
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* botões do menu atual */}
          {!typing && msgs.length > 0 && (
            <div
              className="shrink-0 border-t px-3 py-3"
              style={{ borderColor: "#cdb9c4", background: "#fff" }}
            >
              <div className="flex flex-wrap gap-1.5">
                {currentMenu.buttons.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => handleButton(btn)}
                    className="rounded-full border px-3 py-1.5 text-xs font-medium transition hover:opacity-80 active:scale-95"
                    style={{
                      borderColor: "#4a1f5c",
                      color: "#4a1f5c",
                      background: "transparent",
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}
