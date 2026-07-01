import { getLeakageOpportunities, listContracts } from "../db/repo";
import type { LeakageCategory, RevenueIntelligenceSummary } from "../types";

export function computeRevenueIntelligence(): RevenueIntelligenceSummary {
  const contracts = listContracts();
  const opportunities = getLeakageOpportunities().filter((o) => o.status === "open");
  const currency = contracts[0]?.currency ?? "USD";

  const byCategoryMap = new Map<LeakageCategory, { value: number; count: number }>();
  for (const o of opportunities) {
    const entry = byCategoryMap.get(o.category) ?? { value: 0, count: 0 };
    entry.value += o.estimatedValue;
    entry.count += 1;
    byCategoryMap.set(o.category, entry);
  }
  const byCategory = Array.from(byCategoryMap.entries())
    .map(([category, v]) => ({ category, ...v }))
    .sort((a, b) => b.value - a.value);

  const topOpportunities = [...opportunities]
    .sort((a, b) => b.estimatedValue - a.estimatedValue)
    .slice(0, 8)
    .map((opportunity) => ({
      contractId: opportunity.contractId,
      contractTitle: contracts.find((c) => c.id === opportunity.contractId)?.title ?? "Unknown contract",
      opportunity,
    }));

  return {
    totalOpenLeakage: opportunities.reduce((sum, o) => sum + o.estimatedValue, 0),
    currency,
    openOpportunityCount: opportunities.length,
    byCategory,
    topOpportunities,
  };
}
