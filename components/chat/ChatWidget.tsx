"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/lib/chatbot";

type UIMessage = ChatMessage & { id: string };

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { id: uid(), role: "assistant", content: t("greeting") },
      ]);
    }
  }, [open, messages.length, t]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open, sending]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const suggestions = t.raw("suggestions") as string[];

  async function send(content: string) {
    const trimmed = content.trim();
    if (!trimmed || sending) return;

    const userMsg: UIMessage = { id: uid(), role: "user", content: trimmed };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!data.reply) {
        throw new Error(data.error ?? "Empty reply");
      }
      setMessages((m) => [
        ...m,
        { id: uid(), role: "assistant", content: data.reply ?? "" },
      ]);
    } catch {
      setError(t("error"));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    send(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <>
      <motion.button
        type="button"
        data-chat-trigger
        aria-label={open ? t("close") : t("open")}
        onClick={() => setOpen((v) => !v)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className={`group fixed bottom-5 right-5 z-40 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-accent px-0 text-[0.95rem] font-medium text-accent-fg shadow-[0_14px_40px_-12px_rgb(var(--accent)/0.7)] transition hover:brightness-110 sm:bottom-6 sm:right-6 ${
          open ? "w-14" : "w-14 sm:w-auto sm:px-5"
        }`}
      >
        {!open && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full bg-accent/40"
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="grid h-14 w-14 place-items-center"
            >
              <X className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="inline-flex items-center gap-2"
            >
              <span className="grid h-14 w-14 place-items-center sm:h-auto sm:w-auto">
                <MessageCircle className="h-6 w-6 sm:h-5 sm:w-5" />
              </span>
              <span className="hidden pr-1 sm:inline">{t("buttonLabel")}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            role="dialog"
            aria-label={t("title")}
            className="fixed bottom-24 right-4 z-40 flex h-[min(78vh,620px)] w-[min(calc(100vw-2rem),400px)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft sm:right-6"
          >
            <header className="flex items-start gap-3 border-b border-border bg-surface-2/50 p-4">
              <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                <Sparkles className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-emerald-500" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold tracking-tight">
                  {t("title")}
                </h2>
                <p className="mt-0.5 text-xs leading-snug text-muted">
                  {t("subtitle")}
                </p>
              </div>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto p-4"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
                      m.role === "user"
                        ? "bg-accent text-accent-fg"
                        : "bg-surface-2 text-fg"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-surface-2 px-3.5 py-2.5 text-[14px] text-muted">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" />
                      <span
                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted"
                        style={{ animationDelay: "300ms" }}
                      />
                    </span>
                    {t("typing")}
                  </div>
                </div>
              )}
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
              {messages.length <= 1 && !sending && (
                <div className="pt-1">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted">
                    {t("suggestionsLabel")}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-border bg-surface px-2.5 py-1 text-[12px] text-muted transition hover:border-fg/20 hover:text-fg"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={onSubmit}
              className="flex items-end gap-2 border-t border-border bg-surface p-3"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={t("placeholder")}
                rows={1}
                className="max-h-28 min-h-[40px] flex-1 resize-none rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-fg placeholder:text-muted/70 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <button
                type="submit"
                aria-label={t("send")}
                disabled={sending || !input.trim()}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-fg transition hover:brightness-110 disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
            <p className="border-t border-border bg-surface-2/50 px-3 py-1.5 text-center text-[10px] text-muted">
              {t("disclaimer")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
