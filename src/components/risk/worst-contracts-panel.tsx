"use client";

import Link from "next/link";
import { ArrowUpRight, Radar } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { titleCase } from "@/lib/utils";
import { DriftSeverityBadge, driftSeverityColorClass } from "@/components/risk/drift-severity-badge";
import type { ClauseDriftFinding } from "@/lib/types";

interface WorstContractRow {
  contractId: string;
  title: string;
  avgDrift: number;
  findingCount: number;
}

export function WorstContractsPanel({
  worstContracts,
  findingsByContract,
}: {
  worstContracts: WorstContractRow[];
  findingsByContract: Record<string, ClauseDriftFinding[]>;
}) {
  if (worstContracts.length === 0) {
    return (
      <EmptyState
        icon={<Radar className="h-5 w-5" />}
        title="No drift findings yet"
        description="Once contracts are compared against the house playbook, the highest-drift contracts will surface here."
      />
    );
  }

  return (
    <Accordion type="single" collapsible className="divide-y divide-ink-100 dark:divide-ink-800">
      {worstContracts.map((row) => {
        const findings = (findingsByContract[row.contractId] ?? []).slice().sort((a, b) => b.driftScore - a.driftScore);
        return (
          <AccordionItem key={row.contractId} value={row.contractId} className="border-b border-ink-100 last:border-b-0 dark:border-ink-800">
            <AccordionTrigger className="px-1 py-4 hover:no-underline">
              <div className="flex w-full flex-wrap items-center gap-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/contracts/${row.contractId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 truncate text-sm font-semibold text-ink-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
                  >
                    {row.title}
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                  </Link>
                  <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                    {row.findingCount} clause {row.findingCount === 1 ? "finding" : "findings"} measured against the playbook
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <DriftSeverityBadge score={row.avgDrift} />
                  <div className="flex items-center gap-2">
                    <Progress value={row.avgDrift} className="w-28" barClassName={driftSeverityColorClass(row.avgDrift)} />
                    <span className="w-10 text-right text-xs font-semibold tabular-nums text-ink-600 dark:text-ink-300">
                      {row.avgDrift}/100
                    </span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-1 pb-5">
              <div className="space-y-3">
                {findings.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-lg border border-ink-100 bg-ink-25 p-3 dark:border-ink-800 dark:bg-ink-900/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                        {titleCase(f.category)}
                        {f.standardClauseTitle ? ` vs. "${f.standardClauseTitle}"` : ""}
                      </span>
                      <DriftSeverityBadge score={f.driftScore} />
                    </div>
                    <p className="mt-1.5 text-sm text-ink-700 dark:text-ink-200">{f.summary}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
