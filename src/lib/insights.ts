import { listContracts, getObligations, allApprovalsWithContract } from "./db/repo";
import type { PortfolioInsights } from "./types";
import { daysUntil } from "./utils";

export function computeInsights(): PortfolioInsights {
  const contracts = listContracts();
  const currency = contracts[0]?.currency ?? "USD";
  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);

  const riskDistribution = { low: 0, medium: 0, high: 0, critical: 0 };
  for (const c of contracts) {
    if (c.riskScore >= 70) riskDistribution.critical++;
    else if (c.riskScore >= 40) riskDistribution.high++;
    else if (c.riskScore >= 15) riskDistribution.medium++;
    else riskDistribution.low++;
  }

  const statusDistribution: PortfolioInsights["statusDistribution"] = {
    draft: 0,
    in_review: 0,
    negotiation: 0,
    pending_approval: 0,
    executed: 0,
    expired: 0,
    terminated: 0,
  };
  for (const c of contracts) statusDistribution[c.status]++;

  const valueByDepartment = Object.values(
    contracts.reduce<Record<string, { department: any; value: number }>>((acc, c) => {
      acc[c.department] ??= { department: c.department, value: 0 };
      acc[c.department].value += c.value;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  const valueByType = Object.values(
    contracts.reduce<Record<string, { type: any; value: number }>>((acc, c) => {
      acc[c.type] ??= { type: c.type, value: 0 };
      acc[c.type].value += c.value;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  const upcomingRenewals = contracts
    .filter((c) => c.expirationDate && c.status === "executed")
    .map((c) => ({
      contractId: c.id,
      title: c.title,
      expirationDate: c.expirationDate as string,
      value: c.value,
      autoRenew: c.autoRenew,
    }))
    .filter((r) => {
      const d = daysUntil(r.expirationDate);
      return d !== null && d <= 180;
    })
    .sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());

  const allObligations = getObligations();
  const overdueObligations = allObligations
    .filter((o) => o.status === "overdue")
    .map((o) => ({
      contractId: o.contractId,
      contractTitle: contracts.find((c) => c.id === o.contractId)?.title ?? "Unknown",
      obligation: o,
    }));

  const approvalsPending = allApprovalsWithContract().filter((a) => a.approval.status === "pending").length;

  const highRiskContracts = contracts
    .filter((c) => c.riskScore >= 40)
    .sort((a, b) => b.riskScore - a.riskScore)
    .map((c) => ({ contractId: c.id, title: c.title, riskScore: c.riskScore }));

  const cycleTimesDays = contracts.map((c) => {
    const created = new Date(c.createdAt).getTime();
    const effective = new Date(c.effectiveDate).getTime();
    return Math.max(1, Math.round((effective - created) / (1000 * 60 * 60 * 24))) || 14;
  });
  const avgCycleTimeDays =
    cycleTimesDays.length > 0 ? Math.round(cycleTimesDays.reduce((a, b) => a + b, 0) / cycleTimesDays.length) : 0;

  const monthlyMap = new Map<string, { value: number; count: number }>();
  for (const c of contracts) {
    const month = c.effectiveDate.slice(0, 7);
    const entry = monthlyMap.get(month) ?? { value: 0, count: 0 };
    entry.value += c.value;
    entry.count += 1;
    monthlyMap.set(month, entry);
  }
  const monthlyExecutedValue = Array.from(monthlyMap.entries())
    .map(([month, v]) => ({ month, ...v }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const counterpartyMap = new Map<string, { value: number; count: number }>();
  for (const c of contracts) {
    const entry = counterpartyMap.get(c.counterparty) ?? { value: 0, count: 0 };
    entry.value += c.value;
    entry.count += 1;
    counterpartyMap.set(c.counterparty, entry);
  }
  const topCounterpartiesByValue = Array.from(counterpartyMap.entries())
    .map(([counterparty, v]) => ({ counterparty, ...v }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return {
    totalContracts: contracts.length,
    totalValue,
    currency,
    avgCycleTimeDays,
    riskDistribution,
    statusDistribution,
    valueByDepartment: valueByDepartment as any,
    valueByType: valueByType as any,
    upcomingRenewals,
    overdueObligations,
    approvalsPending,
    highRiskContracts,
    monthlyExecutedValue,
    topCounterpartiesByValue,
  };
}
