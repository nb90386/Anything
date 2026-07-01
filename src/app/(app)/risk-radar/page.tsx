import { Radar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/landing/fade-in";
import { RiskKpiRow } from "@/components/risk/risk-kpi-row";
import { DriftCategoryChart } from "@/components/risk/drift-category-chart";
import { WorstContractsPanel } from "@/components/risk/worst-contracts-panel";
import { computeRiskRadar } from "@/lib/risk/radar-summary";
import { driftSeverityLabel } from "@/lib/risk/clause-drift";
import { getClauseDrift } from "@/lib/db/repo";
import type { ClauseDriftFinding } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function RiskRadarPage() {
  const radar = computeRiskRadar();
  const allFindings = getClauseDrift();
  const severeFindings = allFindings.filter((f) => driftSeverityLabel(f.driftScore) === "severe").length;

  const findingsByContract = allFindings.reduce<Record<string, ClauseDriftFinding[]>>((acc, f) => {
    (acc[f.contractId] ??= []).push(f);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <FadeIn className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">
            <Radar className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            Contract Risk Radar
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-500 dark:text-ink-400">
            Every clause in the portfolio measured against the house playbook Legal actually wants, not a generic
            risk score. Drift shows how far executed language has moved from that standard, and where to focus the
            next playbook conversation.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <RiskKpiRow
          avgDriftScore={radar.avgDriftScore}
          contractsAboveThreshold={radar.contractsAboveThreshold}
          totalFindings={allFindings.length}
          severeFindings={severeFindings}
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Drift by clause category</CardTitle>
              <CardDescription>
                Average drift score per category, worst first. This is where a playbook update pays off fastest.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {radar.byCategory.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-500 dark:text-ink-400">
                No clause drift has been computed yet.
              </p>
            ) : (
              <DriftCategoryChart data={radar.byCategory} />
            )}
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.15}>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Contracts furthest from the playbook</CardTitle>
              <CardDescription>
                Ranked by average drift score. Expand a contract to see exactly which clauses drifted and why,
                every score here traces back to a specific clause comparison, not a black box.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <WorstContractsPanel worstContracts={radar.worstContracts} findingsByContract={findingsByContract} />
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
