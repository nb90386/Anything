/**
 * Ensemble meta-strategy. Blends per-strategy signals into one score per market
 * using dynamic strategy weights (managed by the self-learning engine), then
 * applies HARD entry gates (microstructure + freshness + risk pre-checks).
 */
import { RISK } from "@/lib/config";
import type { MarketView, StrategyStateRow } from "@/lib/repo";
import type { StrategySignal, EnsembleSignal, StrategyId, Side } from "@/lib/types";
import { clamp } from "@/lib/engine/indicators";

export function buildEnsemble(
  signals: StrategySignal[],
  states: StrategyStateRow[],
  views: MarketView[]
): EnsembleSignal[] {
  const weightMap = new Map<StrategyId, { weight: number; threshold: number; enabled: boolean }>();
  for (const s of states) weightMap.set(s.strategy, { weight: s.weight, threshold: s.threshold, enabled: s.enabled === 1 });
  const viewMap = new Map(views.map((v) => [v.market.id, v]));

  // group signals by market+side
  const byMarket = new Map<string, StrategySignal[]>();
  for (const s of signals) {
    const arr = byMarket.get(s.marketId) ?? [];
    arr.push(s);
    byMarket.set(s.marketId, arr);
  }

  const out: EnsembleSignal[] = [];
  for (const [marketId, sigs] of byMarket) {
    const view = viewMap.get(marketId);
    if (!view) continue;

    // net score per side (weighted), only counting enabled strategies above their threshold
    const sideScore: Record<Side, number> = { YES: 0, NO: 0 };
    const sideWeight: Record<Side, number> = { YES: 0, NO: 0 };
    const contributions: { strategy: StrategyId; weight: number; score: number }[] = [];
    for (const sig of sigs) {
      const st = weightMap.get(sig.strategy);
      if (!st || !st.enabled) continue;
      if (sig.score < st.threshold) continue;
      sideScore[sig.side] += sig.score * st.weight;
      sideWeight[sig.side] += st.weight;
      contributions.push({ strategy: sig.strategy, weight: st.weight, score: +sig.score.toFixed(3) });
    }
    const side: Side = sideScore.YES >= sideScore.NO ? "YES" : "NO";
    const oppScore = side === "YES" ? sideScore.NO : sideScore.YES;
    const totalWeight = sideWeight[side] || 1;
    // net conviction = weighted score on the dominant side, discounted by opposing pressure
    const gross = sideScore[side] / totalWeight;
    const conflictPenalty = clamp(oppScore / (sideScore[side] + 0.0001));
    const ensembleScore = clamp(gross * (1 - 0.5 * conflictPenalty));
    const topStrategy =
      contributions.filter((c) => sigs.find((s) => s.strategy === c.strategy)?.side === side)
        .sort((a, b) => b.weight * b.score - a.weight * a.score)[0]?.strategy ?? contributions[0]?.strategy ?? "ENSEMBLE";

    // ---- eligibility gates ----
    const reasons: string[] = [];
    const m = view.market;
    const book = view.book;
    const price = book?.midpoint ?? (view.priceSeries.at(-1) ?? null);
    let eligible = true;
    const fail = (r: string) => {
      eligible = false;
      reasons.push(r);
    };

    if (m.closed || !m.active) fail("market inactive/closed");
    if (view.ageMinutes > RISK.staleMinutes) fail(`stale data (${view.ageMinutes.toFixed(0)}m old)`);
    if (price == null) fail("no valid price");
    if (book?.spread != null && book.spread > RISK.maxSpread) fail(`spread too wide (${(book.spread * 100).toFixed(1)}c)`);
    if (book?.spread == null) reasons.push("no live book spread (will use slippage penalty)");
    if (m.liquidity < RISK.minLiquidity) fail(`liquidity too low ($${Math.round(m.liquidity)})`);
    if (price != null && (price > 0.97 || price < 0.03)) fail("price too extreme");
    if (ensembleScore < RISK.minSignalScore) fail(`ensemble score ${ensembleScore.toFixed(2)} < ${RISK.minSignalScore}`);
    if (contributions.length === 0) fail("no qualifying strategy contributions");

    if (eligible) reasons.unshift(`accepted: score ${ensembleScore.toFixed(2)}, ${contributions.length} strategies aligned`);

    out.push({
      marketId,
      side,
      ensembleScore,
      contributions,
      eligible,
      reasons,
      topStrategy,
    });
  }

  return out.sort((a, b) => b.ensembleScore - a.ensembleScore);
}
