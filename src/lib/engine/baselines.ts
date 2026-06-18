/**
 * Baseline engine. Eight naive/reference strategies the lab must beat. Each gets
 * the same starting bankroll and trades buy-and-hold style (open per its rule,
 * hold to resolution/experiment end) so the comparison is apples-to-apples.
 *
 * Valuation uses simple midpoints (baselines are intentionally naive — no
 * conservative slippage modeling), which makes them a tougher bar to beat.
 */
import { getDb, newId, nowIso } from "@/lib/db";
import type { MarketView } from "@/lib/repo";
import type { StrategySignal, EnsembleSignal, Side } from "@/lib/types";

export const BASELINES = [
  "CASH",
  "RANDOM",
  "CONSENSUS_EW",
  "BEST_WALLET_COPY",
  "MOMENTUM_ONLY",
  "MEANREV_ONLY",
  "BUYHOLD_SIGNALS",
  "MIDPOINT_NAIVE",
] as const;
export type BaselineId = (typeof BASELINES)[number];

export const BASELINE_LABELS: Record<BaselineId, string> = {
  CASH: "No-Trade Cash",
  RANDOM: "Random Eligible",
  CONSENSUS_EW: "Equal-Weight Consensus",
  BEST_WALLET_COPY: "Best-Wallet Copy",
  MOMENTUM_ONLY: "Momentum Only",
  MEANREV_ONLY: "Mean-Reversion Only",
  BUYHOLD_SIGNALS: "Buy & Hold All Signals",
  MIDPOINT_NAIVE: "Midpoint Naive Entry",
};

const MAX_HOLDINGS = 10;

function yesPx(v: MarketView): number {
  return v.book?.midpoint ?? v.priceSeries.at(-1) ?? 0.5;
}
function costPriceFor(side: Side, v: MarketView): number {
  const p = yesPx(v);
  return side === "YES" ? p : 1 - p;
}

interface Pick {
  marketId: string;
  side: Side;
}

function pickFor(
  baseline: BaselineId,
  ctx: { views: MarketView[]; signals: StrategySignal[]; ensemble: EnsembleSignal[]; bestWalletPositions: Pick[] }
): Pick[] {
  const { views, signals, ensemble, bestWalletPositions } = ctx;
  const eligible = views.filter((v) => v.market.liquidity > 1000);
  switch (baseline) {
    case "CASH":
      return [];
    case "RANDOM": {
      const shuffled = [...eligible].sort((a, b) => (a.market.id < b.market.id ? -1 : 1)).sort(() => Math.random() - 0.5);
      return shuffled.slice(0, MAX_HOLDINGS).map((v) => ({ marketId: v.market.id, side: "YES" as Side }));
    }
    case "CONSENSUS_EW":
      return eligible
        .filter((v) => Math.max(v.yesConsensus.count, v.noConsensus.count) >= 2)
        .map((v) => ({ marketId: v.market.id, side: (v.yesConsensus.count >= v.noConsensus.count ? "YES" : "NO") as Side }))
        .slice(0, MAX_HOLDINGS);
    case "BEST_WALLET_COPY":
      return bestWalletPositions.slice(0, MAX_HOLDINGS);
    case "MOMENTUM_ONLY":
      return signals
        .filter((s) => s.strategy === "MOMENTUM_BREAKOUT")
        .map((s) => ({ marketId: s.marketId, side: s.side }))
        .slice(0, MAX_HOLDINGS);
    case "MEANREV_ONLY":
      return signals
        .filter((s) => s.strategy === "MEAN_REVERSION")
        .map((s) => ({ marketId: s.marketId, side: s.side }))
        .slice(0, MAX_HOLDINGS);
    case "BUYHOLD_SIGNALS":
      return ensemble.filter((e) => e.eligible).map((e) => ({ marketId: e.marketId, side: e.side })).slice(0, MAX_HOLDINGS);
    case "MIDPOINT_NAIVE":
      return [...eligible].sort((a, b) => b.market.liquidity - a.market.liquidity).slice(0, MAX_HOLDINGS).map((v) => ({ marketId: v.market.id, side: "YES" as Side }));
  }
}

export async function runBaselines(
  experimentId: string,
  bankroll: number,
  ctx: { views: MarketView[]; signals: StrategySignal[]; ensemble: EnsembleSignal[]; bestWalletPositions: Pick[] }
): Promise<void> {
  const db = getDb();
  const viewMap = new Map(ctx.views.map((v) => [v.market.id, v]));
  const perPosition = bankroll / MAX_HOLDINGS;

  for (const baseline of BASELINES) {
    const held = await db.all<{ market_id: string; side: Side; shares: number; cost: number; entry_price: number }>(
      `SELECT market_id, side, shares, cost, entry_price FROM baseline_positions WHERE experiment_id=? AND baseline=? AND status='OPEN'`,
      [experimentId, baseline]
    );
    const heldSet = new Set(held.map((h) => `${h.market_id}:${h.side}`));
    const picks = pickFor(baseline, ctx);

    // open new holdings (buy-and-hold) up to cap
    for (const pk of picks) {
      if (held.length >= MAX_HOLDINGS) break;
      const key = `${pk.marketId}:${pk.side}`;
      if (heldSet.has(key)) continue;
      const v = viewMap.get(pk.marketId);
      if (!v) continue;
      const price = costPriceFor(pk.side, v);
      if (price <= 0.01 || price >= 0.99) continue;
      const shares = +(perPosition / price).toFixed(2);
      const ts = nowIso();
      await db.run(
        `INSERT INTO baseline_positions (id, experiment_id, baseline, market_id, side, entry_price, shares, cost, status, opened_at, source, created_at, updated_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [newId("bp"), experimentId, baseline, pk.marketId, pk.side, price, shares, +(price * shares).toFixed(2), "OPEN", ts, "baseline-engine", ts, ts]
      );
      heldSet.add(key);
      held.push({ market_id: pk.marketId, side: pk.side, shares, cost: +(price * shares).toFixed(2), entry_price: price });
    }

    // value = bankroll - invested + current value of holdings
    const current = await db.all<{ market_id: string; side: Side; shares: number; cost: number }>(
      `SELECT market_id, side, shares, cost FROM baseline_positions WHERE experiment_id=? AND baseline=? AND status='OPEN'`,
      [experimentId, baseline]
    );
    const invested = current.reduce((s, h) => s + h.cost, 0);
    let holdingsValue = 0;
    for (const h of current) {
      const v = viewMap.get(h.market_id);
      const price = v ? costPriceFor(h.side, v) : h.cost / Math.max(h.shares, 1);
      holdingsValue += price * h.shares;
    }
    const totalValue = +(bankroll - invested + holdingsValue).toFixed(2);
    const ts = nowIso();
    await db.run(
      `INSERT INTO baseline_snapshots (id, experiment_id, baseline, ts, total_value, total_return_pct, source, created_at)
       VALUES (?,?,?,?,?,?,?,?)`,
      [newId("bs"), experimentId, baseline, ts, totalValue, +(((totalValue - bankroll) / bankroll)).toFixed(4), "baseline-engine", ts]
    );
  }
}

/** Pull the highest-PnL wallet's current positions, normalized into picks. */
export async function bestWalletPicks(): Promise<Pick[]> {
  const db = getDb();
  const top = await db.get<{ id: string }>(`SELECT id FROM traders ORDER BY COALESCE(pnl,0) DESC LIMIT 1`);
  if (!top) return [];
  const rows = await db.all<{ market_id: string; side: Side }>(
    `SELECT market_id, side FROM trader_positions WHERE trader_id=? ORDER BY ts DESC`,
    [top.id]
  );
  const seen = new Set<string>();
  const picks: Pick[] = [];
  for (const r of rows) {
    const key = `${r.market_id}:${r.side}`;
    if (seen.has(key)) continue;
    seen.add(key);
    picks.push({ marketId: r.market_id, side: r.side });
  }
  return picks;
}
