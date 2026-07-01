"use client";

import { DonutChart } from "@tremor/react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { titleCase, formatMoney } from "@/lib/utils";
import { LEAKAGE_CATEGORY_COPY } from "@/components/revenue/leakage-category-copy";
import type { LeakageCategory } from "@/lib/types";

const COLORS = ["violet", "fuchsia", "amber", "rose", "cyan", "indigo", "lime"] as const;

const DOT_CLASSES: Record<(typeof COLORS)[number], string> = {
  violet: "bg-violet-500",
  fuchsia: "bg-fuchsia-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  cyan: "bg-cyan-500",
  indigo: "bg-indigo-500",
  lime: "bg-lime-500",
};

export function LeakageCategoryChart({
  data,
  currency,
}: {
  data: { category: LeakageCategory; value: number; count: number }[];
  currency: string;
}) {
  const chartData = data.map((d) => ({ name: titleCase(d.category), value: d.value }));

  return (
    <TooltipProvider delayDuration={150}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
        <DonutChart
          data={chartData}
          category="value"
          index="name"
          colors={[...COLORS]}
          valueFormatter={(v: number) => formatMoney(v, currency)}
          className="h-64"
        />
        <div className="space-y-2.5">
          {data.map((d, i) => (
            <div key={d.category} className="flex items-center justify-between gap-2 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT_CLASSES[COLORS[i % COLORS.length]]}`} />
                <span className="truncate font-medium text-ink-700 dark:text-ink-200">{titleCase(d.category)}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" aria-label={`What is ${titleCase(d.category)}`} className="shrink-0 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">{LEAKAGE_CATEGORY_COPY[d.category]}</TooltipContent>
                </Tooltip>
              </div>
              <span className="shrink-0 tabular-nums text-ink-500 dark:text-ink-400">
                {formatMoney(d.value, currency)} &middot; {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
