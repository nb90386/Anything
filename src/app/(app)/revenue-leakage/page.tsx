import { TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/landing/fade-in";
import { LeakageHero } from "@/components/revenue/leakage-hero";
import { LeakageCategoryChart } from "@/components/revenue/leakage-category-chart";
import { OpportunitiesTable, type OpportunityRow } from "@/components/revenue/opportunities-table";
import { computeRevenueIntelligence } from "@/lib/revenue/summary";
import { getLeakageOpportunities, listContracts } from "@/lib/db/repo";

export const dynamic = "force-dynamic";

export default function RevenueLeakagePage() {
  const summary = computeRevenueIntelligence();
  const contracts = listContracts();
  const contractTitleById = new Map(contracts.map((c) => [c.id, c.title]));

  const openOpportunities: OpportunityRow[] = getLeakageOpportunities()
    .filter((o) => o.status === "open")
    .sort((a, b) => b.estimatedValue - a.estimatedValue)
    .map((opportunity) => ({
      contractId: opportunity.contractId,
      contractTitle: contractTitleById.get(opportunity.contractId) ?? "Unknown contract",
      opportunity,
    }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <FadeIn className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">
            <TrendingDown className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            Revenue Leakage Detector
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-500 dark:text-ink-400">
            Revenue already sitting in the existing contract portfolio that is not being captured: missed
            escalators, discount creep, unclaimed credits. Not a headline AI claim, just contracts that need a
            conversation, each one with a next action attached.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <LeakageHero
          totalOpenLeakage={summary.totalOpenLeakage}
          currency={summary.currency}
          openOpportunityCount={summary.openOpportunityCount}
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Where the value is concentrated</CardTitle>
              <CardDescription>Open leakage value by category. Hover the info icon for what each category means.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {summary.byCategory.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-500 dark:text-ink-400">
                No open leakage opportunities to chart.
              </p>
            ) : (
              <LeakageCategoryChart data={summary.byCategory} currency={summary.currency} />
            )}
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.15}>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Every open opportunity</CardTitle>
              <CardDescription>
                Sorted by estimated value, highest first. Mark an item recovered once billing is corrected, or
                dismiss it if the finding does not apply.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <OpportunitiesTable rows={openOpportunities} />
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
