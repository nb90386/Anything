"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import type { Contract } from "@/lib/types";

export function ReportPicker({ contracts }: { contracts: Contract[] }) {
  const [mode, setMode] = useState<"portfolio" | "contract">("portfolio");
  const [contractId, setContractId] = useState<string>(contracts[0]?.id ?? "");

  const selected = contracts.find((c) => c.id === contractId);
  const exportHref = mode === "portfolio" ? "/api/report/portfolio" : `/api/export/${contractId}`;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Choose a report</CardTitle>
          <CardDescription>Portfolio-wide, or a single contract&apos;s executive report.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("portfolio")}
            className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
              mode === "portfolio"
                ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/15 dark:text-brand-300"
                : "border-ink-200 text-ink-600 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-300 dark:hover:bg-ink-800/50"
            }`}
          >
            Portfolio summary report
          </button>
          <button
            type="button"
            onClick={() => setMode("contract")}
            className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
              mode === "contract"
                ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/15 dark:text-brand-300"
                : "border-ink-200 text-ink-600 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-300 dark:hover:bg-ink-800/50"
            }`}
          >
            Single contract report
          </button>
        </div>

        {mode === "contract" ? (
          <div className="space-y-2">
            <Select value={contractId} onChange={(e) => setContractId(e.target.value)}>
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} &middot; {c.counterparty} &middot; {formatMoney(c.value, c.currency)}
                </option>
              ))}
            </Select>
            {selected ? (
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Uses the existing per-contract executive report: overview, risks, obligations, and approval status
                for {selected.title}.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Aggregates every contract in the portfolio into one board-ready markdown document.
          </p>
        )}

        <Button asChild disabled={mode === "contract" && !contractId}>
          <a href={exportHref} download>
            <Download className="h-4 w-4" />
            Export {mode === "portfolio" ? "portfolio report" : "contract report"}
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
