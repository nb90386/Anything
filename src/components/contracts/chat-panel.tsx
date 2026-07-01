"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

const QUICK_PROMPTS = [
  "What are the risks?",
  "Summarize termination terms",
  "What are the payment terms?",
  "Any auto-renewal traps?",
];

function renderContent(content: string) {
  // Very lightweight markdown-ish rendering: **bold** and bullet lines starting with "- " or "* ".
  const lines = content.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();
    const isBullet = /^[-*]\s+/.test(trimmed);
    const text = isBullet ? trimmed.replace(/^[-*]\s+/, "") : line;
    const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    const rendered = parts.map((part, j) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={j} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={j}>{part}</span>
      )
    );
    if (isBullet) {
      return (
        <li key={i} className="ml-4 list-disc">
          {rendered}
        </li>
      );
    }
    if (trimmed === "") return <br key={i} />;
    return <p key={i}>{rendered}</p>;
  });
}

export function ChatPanel({ contractId, contractTitle }: { contractId: string; contractTitle: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/contracts/${contractId}/chat`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setMessages(data.messages ?? []);
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [contractId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    const optimistic: ChatMessage = {
      id: `optimistic-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setLoading(true);
    try {
      const res = await fetch(`/api/contracts/${contractId}/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Something went wrong reaching the AI assistant. Please try again.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <Card className="flex h-[calc(100vh-8.5rem)] flex-col lg:sticky lg:top-20">
      <div className="flex items-center gap-2.5 border-b border-ink-100 px-4 py-3.5 dark:border-ink-800">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">Ask AI about this contract</p>
          <p className="truncate text-xs text-ink-500 dark:text-ink-400">{contractTitle}</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {historyLoading ? (
          <div className="flex h-full items-center justify-center text-ink-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500">
              <Bot className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-ink-700 dark:text-ink-200">Ask anything about this contract</p>
            <p className="text-xs text-ink-500 dark:text-ink-400">
              Grounded in the actual clauses — try a quick prompt below.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={cn("flex gap-2", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  m.role === "user"
                    ? "bg-ink-900 text-white dark:bg-white dark:text-ink-900"
                    : "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"
                )}
              >
                {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>
              <div
                className={cn(
                  "max-w-[85%] space-y-1 rounded-xl2 px-3.5 py-2.5 text-[13px] leading-relaxed",
                  m.role === "user"
                    ? "bg-ink-900 text-white dark:bg-white dark:text-ink-900"
                    : "bg-ink-50 text-ink-800 dark:bg-ink-800/70 dark:text-ink-100"
                )}
              >
                {renderContent(m.content)}
              </div>
            </div>
          ))
        )}
        {loading ? (
          <div className="flex gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-center gap-1 rounded-xl2 bg-ink-50 px-3.5 py-2.5 dark:bg-ink-800/70">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400" />
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-ink-100 px-4 py-3 dark:border-ink-800">
        {messages.length === 0 && !historyLoading ? (
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setInput(p)}
                className="rounded-full border border-ink-200 px-2.5 py-1 text-xs text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-ink-700 dark:text-ink-300 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
              >
                {p}
              </button>
            ))}
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about this contract..."
            className="h-9 flex-1 rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-brand-500 dark:border-ink-700 dark:bg-ink-900 dark:text-white dark:placeholder:text-ink-500"
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send message">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </Card>
  );
}
