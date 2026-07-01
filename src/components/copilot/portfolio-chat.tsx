"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const QUICK_PROMPTS = [
  "Which contracts create the most revenue leakage?",
  "Which renewals need attention this quarter?",
  "What clauses are most often negotiated?",
  "Which deals are blocked by legal approval?",
  "What is our total exposure from non-standard indemnity clauses?",
  "Give me a portfolio summary.",
];

interface PortfolioMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citedContractIds?: string[];
}

function renderContent(content: string) {
  // Same lightweight markdown-ish rendering as the per-contract chat panel:
  // **bold**, _italic_, bullet lines starting with "- " or "* ".
  const lines = content.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();
    const isBullet = /^[-*]\s+/.test(trimmed);
    const text = isBullet ? trimmed.replace(/^[-*]\s+/, "") : line;
    const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).filter(Boolean);
    const rendered = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={j} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
        return (
          <em key={j} className="text-ink-500 dark:text-ink-400">
            {part.slice(1, -1)}
          </em>
        );
      }
      return <span key={j}>{part}</span>;
    });
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

export function PortfolioChat() {
  const [messages, setMessages] = useState<PortfolioMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    const userMessage: PortfolioMessage = { id: `user-${Date.now()}`, role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      if (data.content) {
        setMessages((prev) => [
          ...prev,
          { id: `assistant-${Date.now()}`, role: "assistant", content: data.content, citedContractIds: data.citedContractIds ?? [] },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `error-${Date.now()}`, role: "assistant", content: "Something went wrong answering that. Please try again." },
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
    <Card className="flex h-[calc(100vh-11rem)] min-h-[480px] flex-col">
      <div className="flex items-center gap-2.5 border-b border-ink-100 px-5 py-4 dark:border-ink-800">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">Ask the whole portfolio</p>
          <p className="truncate text-xs text-ink-500 dark:text-ink-400">
            Reasons across all contracts, not just one. For a single contract, use the chat on its detail page.
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500">
              <Bot className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-ink-700 dark:text-ink-200">Ask anything about the portfolio</p>
            <p className="max-w-sm text-xs text-ink-500 dark:text-ink-400">
              Grounded in the actual contract data on screen elsewhere in this app. Try a quick prompt below.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={cn("flex gap-2.5", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  m.role === "user"
                    ? "bg-ink-900 text-white dark:bg-white dark:text-ink-900"
                    : "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"
                )}
              >
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className="max-w-[80%] space-y-2">
                <div
                  className={cn(
                    "space-y-1 rounded-xl2 px-4 py-3 text-[13px] leading-relaxed",
                    m.role === "user"
                      ? "bg-ink-900 text-white dark:bg-white dark:text-ink-900"
                      : "bg-ink-50 text-ink-800 dark:bg-ink-800/70 dark:text-ink-100"
                  )}
                >
                  {renderContent(m.content)}
                </div>
                {m.citedContractIds && m.citedContractIds.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {m.citedContractIds.map((id) => (
                      <Link
                        key={id}
                        href={`/contracts/${id}`}
                        className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] font-medium text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
                      >
                        View source contract
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
        {loading ? (
          <div className="flex gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1 rounded-xl2 bg-ink-50 px-4 py-3 dark:bg-ink-800/70">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400" />
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-ink-100 px-5 py-4 dark:border-ink-800">
        {messages.length === 0 ? (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => sendMessage(p)}
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
            placeholder="Ask a question across the whole portfolio..."
            className="h-10 flex-1 rounded-lg border border-ink-200 bg-white px-3.5 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-brand-500 dark:border-ink-700 dark:bg-ink-900 dark:text-white dark:placeholder:text-ink-500"
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send message">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </Card>
  );
}
