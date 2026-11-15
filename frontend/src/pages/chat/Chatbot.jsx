import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, User } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { InlineNotice } from "../../components/ui/PageState";
import { api } from "../../lib/api";

const SUGGESTIONS = [
  "Como está a minha exploração esta semana?",
  "O que significa o estado da análise?",
  "Quando devo regar a minha cultura?",
];

export const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  const sendQuestion = async (question) => {
    const trimmed = question.trim();
    if (!trimmed || sending) return;
    setError("");
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setSending(true);
    try {
      const data = await api.chat({ lang: "pt", question: trimmed });
      const reply =
        data?.text ||
        "O assistente não está disponível neste momento (a chave de IA não está configurada no servidor). As restantes funcionalidades continuam a funcionar.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply, available: Boolean(data?.text) },
      ]);
    } catch (err) {
      setError(err.message || "Não foi possível contactar o assistente.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Não consegui responder agora. Tente novamente mais tarde.",
          available: false,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendQuestion(input);
  };

  return (
    <AppLayout>
      <header className="mb-8">
        <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
          Assistência
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Assistente
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--color-text-secondary)]">
          Perguntas sobre a aplicação e agricultura em geral. O assistente não
          inventa dados da sua exploração.
        </p>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="min-h-[320px] flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-warm-bg)]">
                <MessageCircle size={22} className="text-[var(--color-primary)]" />
              </div>
              <p className="font-display text-lg font-semibold">
                Como posso ajudar?
              </p>
              <p className="mt-1 max-w-sm text-sm text-[var(--color-text-secondary)]">
                Faça uma pergunta ou escolha uma sugestão para começar.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendQuestion(suggestion)}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-warm-bg)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-fresh-green)]/40"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    message.role === "user"
                      ? "bg-[var(--color-primary)] text-white"
                      : "border border-[var(--color-border)] bg-[var(--color-warm-bg)] text-[var(--color-primary)]"
                  }`}
                >
                  {message.role === "user" ? <User size={17} /> : <Bot size={17} />}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    message.role === "user"
                      ? "bg-[var(--color-primary)] text-white"
                      : "border border-[var(--color-border)] bg-[var(--color-warm-bg)]"
                  }`}
                >
                  {message.text}
                  {message.role === "assistant" && message.available === false && (
                    <p className="mt-2 text-xs opacity-80">
                      Resposta automática: a IA não está configurada no servidor.
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
          {sending && (
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
              A escrever...
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-[var(--color-border)] p-4">
          {error && (
            <div className="mb-3">
              <InlineNotice>{error}</InlineNotice>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <label className="sr-only" htmlFor="chat-input">
              Pergunta
            </label>
            <textarea
              id="chat-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendQuestion(input);
                }
              }}
              rows={1}
              maxLength={500}
              placeholder="Escreva a sua pergunta..."
              className="max-h-32 min-h-11 flex-1 resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-fresh-green)]/60"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              aria-label="Enviar pergunta"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            {input.length}/500 · Recomendações gerais; não substituem um
            agrónomo.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};
