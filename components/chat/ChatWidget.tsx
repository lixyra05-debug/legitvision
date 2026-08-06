"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { matchResponse } from "./chatbot-responses";

// Helper pour basculer matchResponse selon locale courant (passé via closure du composant)

type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text: string;
};

/**
 * Design system : emerald dosé, surfaces opaques. Le panneau utilisait
 * `.glass-card` (backdrop-filter) — dernier vestige de glassmorphism du produit,
 * remplacé par une surface élevée pleine. Le vert ne porte ici que ce qui se
 * clique : le bouton flottant, l'envoi, et la bulle du message utilisateur.
 */
const pulseAnimation = {
  animation: "pulse-glow var(--dur-ambient) ease-in-out infinite",
};

export function ChatWidget() {
  const { t, locale } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { id: ++idCounterRef.current, role: "bot", text: t("chatbot.welcome") },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, messages.length]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (typing) return;
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = {
      id: ++idCounterRef.current,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    const reply = matchResponse(trimmed, locale);
    const delay = 900 + Math.random() * 800;
    typingTimerRef.current = window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: ++idCounterRef.current, role: "bot", text: reply },
      ]);
      setTyping(false);
      typingTimerRef.current = null;
    }, delay);
  }

  return (
    <div ref={panelRef}>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-line bg-popover shadow-2xl shadow-black/60">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-surface">
                <MessageCircle className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-ui font-semibold leading-tight">
                  {t("chatbot.title")}
                </p>
                <p className="text-caption leading-tight text-muted-foreground">
                  En ligne
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-fast hover:bg-surface-hover hover:text-foreground"
              aria-label="Fermer le chat"
            >
              <X className="size-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-md px-3.5 py-2 text-body ${
                    msg.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-surface text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-1 rounded-md bg-surface px-4 py-3"
                  aria-label="L'assistant écrit"
                  role="status"
                >
                  <span
                    className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={submit}
            className="flex items-center gap-2 border-t border-line px-3 py-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chatbot.placeholder")}
              className="h-9 flex-1"
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground transition-colors duration-fast hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Envoyer"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        style={open ? undefined : pulseAnimation}
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground transition-[transform,background-color] duration-fast hover:scale-105 hover:bg-accent-hover active:scale-95"
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant"}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  );
}
