import { getClauseDrift, listContracts } from "../db/repo";
import type { ClauseCategory, RiskRadarSummary } from "../types";
import { avgDrift } from "./clause-drift";

const DRIFT_ALERT_THRESHOLD = 40;

export function computeRiskRadar(): RiskRadarSummary {
  const contracts = listContracts();
  const allDrift = getClauseDrift();

  const byCategoryMap = new Map<ClauseCategory, { total: number; count: number }>();
  for (const d of allDrift) {
    const entry = byCategoryMap.get(d.category) ?? { total: 0, count: 0 };
    entry.total += d.driftScore;
    entry.count += 1;
    byCategoryMap.set(d.category, entry);
  }
  const byCategory = Array.from(byCategoryMap.entries())
    .map(([category, v]) => ({ category, avgDrift: Math.round(v.total / v.count), count: v.count }))
    .sort((a, b) => b.avgDrift - a.avgDrift);

  const byContract = new Map<string, typeof allDrift>();
  for (const d of allDrift) {
    const list = byContract.get(d.contractId) ?? [];
    list.push(d);
    byContract.set(d.contractId, list);
  }

  const worstContracts = Array.from(byContract.entries())
    .map(([contractId, findings]) => ({
      contractId,
      title: contracts.find((c) => c.id === contractId)?.title ?? "Unknown contract",
      avgDrift: avgDrift(findings),
      findingCount: findings.length,
    }))
    .sort((a, b) => b.avgDrift - a.avgDrift)
    .slice(0, 10);

  return {
    avgDriftScore: avgDrift(allDrift),
    contractsAboveThreshold: Array.from(byContract.values()).filter((f) => avgDrift(f) >= DRIFT_ALERT_THRESHOLD).length,
    byCategory,
    worstContracts,
  };
}
