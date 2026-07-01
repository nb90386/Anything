import { GitCompareArrows } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeIn } from "@/components/landing/fade-in";
import { DriftSummaryStrip } from "@/components/risk/drift-summary-strip";
import { ClauseDriftExplorer, type DriftExplorerRow } from "@/components/risk/clause-drift-explorer";
import { getClauseDrift, getClauses, getStandardClauses, listContracts } from "@/lib/db/repo";
import { findStandardClause } from "@/lib/risk/standard-clauses-data";
import type { Clause, ClauseCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function ClauseDriftPage() {
  const findings = getClauseDrift();
  const contracts = listContracts();
  const standardClauses = getStandardClauses();

  // Clauses are stored per contract, so group findings by contract to avoid
  // one getClauses() call per finding.
  const findingsByContract = new Map<string, typeof findings>();
  for (const f of findings) {
    const list = findingsByContract.get(f.contractId) ?? [];
    list.push(f);
    findingsByContract.set(f.contractId, list);
  }

  const clausesById = new Map<string, Clause>();
  for (const contractId of findingsByContract.keys()) {
    for (const clause of getClauses(contractId)) clausesById.set(clause.id, clause);
  }

  const rows: DriftExplorerRow[] = findings.map((f) => {
    const contract = contracts.find((c) => c.id === f.contractId);
    const clause = clausesById.get(f.clauseId);
    const standard = findStandardClause(f.category, standardClauses);
    return {
      id: f.id,
      contractId: f.contractId,
      contractTitle: contract?.title ?? "Unknown contract",
      category: f.category,
      driftScore: f.driftScore,
      driftType: f.driftType,
      summary: f.summary,
      standardClauseTitle: f.standardClauseTitle,
      executedText: clause?.text ?? null,
      standardText: standard?.standardText ?? null,
      playbookPosition: standard?.playbookPosition ?? null,
    };
  });

  const categories = Array.from(new Set(findings.map((f) => f.category))).sort() as ClauseCategory[];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <FadeIn>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">
          <GitCompareArrows className="h-6 w-6 text-brand-600 dark:text-brand-400" />
          Clause Drift Analyzer
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-500 dark:text-ink-400">
          Every executed clause in the portfolio compared line by line against the approved playbook. Risk Radar
          shows where drift concentrates across the portfolio; this page is for drilling into one finding at a time
          and reading the actual language side by side.
        </p>
      </FadeIn>

      {findings.length === 0 ? (
        <FadeIn delay={0.05}>
          <EmptyState
            icon={<GitCompareArrows className="h-5 w-5" />}
            title="No clause drift findings on file"
            description="Drift is computed when contracts are seeded or uploaded. Reset demo data from Settings to regenerate findings."
          />
        </FadeIn>
      ) : (
        <>
          <FadeIn delay={0.05}>
            <DriftSummaryStrip findings={findings} />
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>All drift findings</CardTitle>
                  <CardDescription>
                    Worst first. Expand a finding to see the executed clause text next to the matching playbook
                    standard.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ClauseDriftExplorer rows={rows} categories={categories} />
              </CardContent>
            </Card>
          </FadeIn>
        </>
      )}
    </div>
  );
}
