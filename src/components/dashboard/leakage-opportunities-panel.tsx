import Link from "next/link";
import { ArrowRight, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney, titleCase } from "@/lib/utils";
import type { LeakageConfidence, RevenueIntelligenceSummary } from "@/lib/types";

const CONFIDENCE_TONE: Record<LeakageConfidence, "success" | "warning" | "danger"> = {
  high: "danger",
  medium: "warning",
  low: "success",
};

/**
 * The single clearest "so what do I do about it" moment in the app: the
 * highest-value open revenue leakage findings, each traceable by click to
 * the contract behind it. Deliberately the most visually prominent panel on
 * the dashboard, per the CEO demo story's Act 1 opening beat.
 */
export function LeakageOpportunitiesPanel({ summary }: { summary: RevenueIntelligenceSummary }) {
  if (summary.topOpportunities.length === 0) {
    return (
      <EmptyState
        icon={<TrendingDown className="h-5 w-5" />}
        title="No open leakage found"
        description="Every detected leakage opportunity has been recovered or dismissed."
      />
    );
  }

  return (
    <ul className="divide-y divide-ink-100 dark:divide-ink-800">
      {summary.topOpportunities.map(({ contractId, contractTitle, opportunity }) => (
        <li key={opportunity.id}>
          <Link
            href={`/contracts/${contractId}`}
            className="flex items-center justify-between gap-4 py-3.5 transition-colors hover:bg-ink-25 dark:hover:bg-ink-800/40"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-ink-900 dark:text-white">{opportunity.title}</p>
              </div>
              <p className="mt-0.5 truncate text-xs text-ink-400 dark:text-ink-500">
                {contractTitle} &middot; {titleCase(opportunity.category)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Badge tone={CONFIDENCE_TONE[opportunity.confidence]} className="hidden sm:inline-flex">
                {titleCase(opportunity.confidence)} confidence
              </Badge>
              <span className="text-base font-semibold tabular-nums text-red-600 dark:text-red-400">
                {formatMoney(opportunity.estimatedValue, opportunity.currency)}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-ink-300 dark:text-ink-600" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
