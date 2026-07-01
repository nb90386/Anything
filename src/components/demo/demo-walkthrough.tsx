"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DemoStep } from "@/components/demo/demo-steps";

export function DemoWalkthrough({ steps }: { steps: DemoStep[] }) {
  const [index, setIndex] = useState(0);
  const current = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setIndex((i) => Math.min(steps.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [steps.length]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <button
            key={s.step}
            onClick={() => setIndex(i)}
            aria-label={`Go to step ${s.step}`}
            aria-current={i === index}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === index ? "w-8 bg-brand-600 dark:bg-brand-400" : "w-2 bg-ink-200 hover:bg-ink-300 dark:bg-ink-700 dark:hover:bg-ink-600"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto max-w-3xl rounded-2xl border border-ink-100 bg-white p-8 shadow-elevated dark:border-ink-800 dark:bg-ink-900 sm:p-12"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Step {current.step} of {steps.length}
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-ink-950 dark:text-white sm:text-3xl">
            {current.headline}
          </h2>

          {current.stat.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-8">
              {current.stat.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-semibold tabular-nums text-ink-900 dark:text-white">{s.value}</p>
                  <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{s.label}</p>
                </div>
              ))}
            </div>
          ) : null}

          <p className="mt-6 text-base leading-relaxed text-ink-600 dark:text-ink-300">{current.body}</p>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-dashed border-brand-200 bg-brand-50/50 p-4 text-sm text-brand-800 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200">
            <MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              <span className="font-semibold">What to say: </span>
              {current.presenterNote}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="outline">
              <Link href={current.href}>
                {current.linkLabel}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={isFirst}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))} disabled={isLast}>
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-xs text-ink-400 dark:text-ink-500">
        Use the arrow keys to move between steps, or click a dot above.
      </p>
    </div>
  );
}
