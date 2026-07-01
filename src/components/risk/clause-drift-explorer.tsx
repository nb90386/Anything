"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, GitCompareArrows } from "lucide-react";
import { Select } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DriftTypeBadge, DRIFT_TYPE_LABELS } from "@/components/risk/drift-type-badge";
import { DriftSeverityBadge, driftSeverityColorClass } from "@/components/risk/drift-severity-badge";
import { titleCase } from "@/lib/utils";
import type { ClauseCategory, DriftType } from "@/lib/types";

export interface DriftExplorerRow {
  id: string;
  contractId: string;
  contractTitle: string;
  category: ClauseCategory;
  driftScore: number;
  driftType: DriftType;
  summary: string;
  standardClauseTitle: string | null;
  executedText: string | null;
  standardText: string | null;
  playbookPosition: string | null;
}

export function ClauseDriftExplorer({ rows, categories }: { rows: DriftExplorerRow[]; categories: ClauseCategory[] }) {
  const [category, setCategory] = useState<string>("all");
  const [driftType, setDriftType] = useState<string>("all");

  const filtered = useMemo(() => {
    return rows
      .filter((r) => (category === "all" ? true : r.category === category))
      .filter((r) => (driftType === "all" ? true : r.driftType === driftType))
      .sort((a, b) => b.driftScore - a.driftScore);
  }, [rows, category, driftType]);

  const hasFilters = category !== "all" || driftType !== "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-56">
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {titleCase(c)}
            </option>
          ))}
        </Select>
        <Select value={driftType} onChange={(e) => setDriftType(e.target.value)} className="sm:w-56">
          <option value="all">All drift types</option>
          {(Object.keys(DRIFT_TYPE_LABELS) as DriftType[]).map((t) => (
            <option key={t} value={t}>
              {DRIFT_TYPE_LABELS[t]}
            </option>
          ))}
        </Select>
        {hasFilters ? (
          <button
            onClick={() => {
              setCategory("all");
              setDriftType("all");
            }}
            className="text-xs font-medium text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
          >
            Clear filters
          </button>
        ) : null}
        <span className="text-xs text-ink-400 sm:ml-auto">
          {filtered.length} of {rows.length} findings
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<GitCompareArrows className="h-5 w-5" />}
          title="No clause drift findings match these filters"
          description="Try a different category or drift type, or clear filters to see the full list."
        />
      ) : (
        <div className="overflow-hidden rounded-xl2 border border-ink-100 bg-white shadow-card dark:border-ink-800 dark:bg-ink-900">
          <Accordion type="single" collapsible className="divide-y divide-ink-100 dark:divide-ink-800">
            {filtered.map((row) => (
              <AccordionItem key={row.id} value={row.id} className="border-b border-ink-100 px-5 last:border-b-0 dark:border-ink-800">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <div className="flex w-full flex-wrap items-center gap-4 text-left">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/contracts/${row.contractId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 truncate text-sm font-semibold text-ink-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
                        >
                          {row.contractTitle}
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                        </Link>
                        <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
                          {titleCase(row.category)}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-ink-500 dark:text-ink-400">{row.summary}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <DriftTypeBadge type={row.driftType} />
                      <DriftSeverityBadge score={row.driftScore} />
                      <div className="hidden items-center gap-2 sm:flex">
                        <Progress value={row.driftScore} className="w-24" barClassName={driftSeverityColorClass(row.driftScore)} />
                        <span className="w-9 text-right text-xs font-semibold tabular-nums text-ink-600 dark:text-ink-300">
                          {row.driftScore}/100
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <p className="mb-3 text-sm text-ink-700 dark:text-ink-200">{row.summary}</p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-ink-100 bg-ink-25 p-3 dark:border-ink-800 dark:bg-ink-900/50">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                        Executed clause text
                      </p>
                      <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink-700 dark:text-ink-200">
                        {row.executedText ?? "Clause text not on file."}
                      </p>
                    </div>
                    <div className="rounded-lg border border-brand-100 bg-brand-50/40 p-3 dark:border-brand-500/20 dark:bg-brand-500/5">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
                        Playbook standard{row.standardClauseTitle ? `: ${row.standardClauseTitle}` : ""}
                      </p>
                      <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink-700 dark:text-ink-200">
                        {row.standardText ?? "No playbook entry exists for this clause category."}
                      </p>
                      {row.playbookPosition ? (
                        <p className="mt-2 text-[12px] italic text-ink-500 dark:text-ink-400">{row.playbookPosition}</p>
                      ) : null}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
