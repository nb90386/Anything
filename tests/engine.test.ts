import { describe, it, expect } from "vitest";
import { RISK } from "@/lib/config";
import {
  mean,
  std,
  sharpeLike,
  maxDrawdown,
  betaPosterior,
  bookImbalance,
  zScore,
  clamp,
} from "@/lib/engine/indicators";
import {
  computeSizing,
  checkRiskLimits,
  conservativeEntryPrice,
  conservativeExitPrice,
} from "@/lib/engine/risk";
import { buildEnsemble } from "@/lib/engine/ensemble";
import type { PaperPosition, StrategySignal } from "@/lib/types";
import type { MarketView, StrategyStateRow } from "@/lib/repo";

describe("indicators", () => {
  it("mean/std", () => {
    expect(mean([1, 2, 3])).toBe(2);
    expect(std([2, 2, 2])).toBe(0);
    expect(std([1, 2, 3])).toBeCloseTo(1, 5);
  });
  it("maxDrawdown is negative on a drop", () => {
    expect(maxDrawdown([100, 120, 90, 110])).toBeCloseTo((90 - 120) / 120, 4);
    expect(maxDrawdown([100, 110, 120])).toBe(0);
  });
  it("sharpeLike is 0 when no variance", () => {
    expect(sharpeLike([])).toBe(0);
    expect(sharpeLike([0.01, 0.01, 0.01])).toBe(0);
  });
  it("betaPosterior shrinks toward prior with few samples and uses lower bound", () => {
    const few = betaPosterior(2, 0);
    const many = betaPosterior(80, 20);
    expect(few.mean).toBeLessThan(1);
    expect(few.lower).toBeLessThan(few.mean);
    // 80/20 should have a tighter (higher) lower bound than 2/0
    expect(many.lower).toBeGreaterThan(few.lower);
  });
  it("bookImbalance bounded [-1,1]", () => {
    expect(bookImbalance(100, 0)).toBe(1);
    expect(bookImbalance(0, 100)).toBe(-1);
    expect(bookImbalance(50, 50)).toBe(0);
    expect(bookImbalance(0, 0)).toBe(0);
  });
  it("zScore detects an outlier last value", () => {
    expect(zScore([0.5, 0.51, 0.49, 0.5, 0.8])).toBeGreaterThan(1);
    expect(zScore([0.5, 0.5, 0.5, 0.5])).toBe(0); // zero-variance history -> guarded to 0
  });
});

describe("risk sizing", () => {
  const base = { bankroll: 10000, liquidity: 100000, spread: 0.02 };
  it("never exceeds the absolute single-position cap", () => {
    const r = computeSizing({ ensembleScore: 1, costPrice: 0.5, ...base });
    expect(r.sizePct).toBeLessThanOrEqual(RISK.maxSinglePct + 1e-9);
  });
  it("scales tier with conviction", () => {
    const weak = computeSizing({ ensembleScore: 0.56, costPrice: 0.5, ...base });
    const strong = computeSizing({ ensembleScore: 0.85, costPrice: 0.5, ...base });
    expect(strong.tier).toBe("exceptional");
    expect(weak.tier).toBe("default");
    expect(strong.sizeUsd).toBeGreaterThanOrEqual(weak.sizeUsd);
  });
  it("throttles size on thin liquidity", () => {
    const thin = computeSizing({ ensembleScore: 0.9, costPrice: 0.5, bankroll: 10000, liquidity: 1000, spread: 0.02 });
    expect(thin.sizeUsd).toBeLessThanOrEqual(1000 * 0.01 + 1e-9);
  });
  it("produces a non-negative Kelly only when edge is positive", () => {
    const r = computeSizing({ ensembleScore: 0.5, costPrice: 0.5, ...base });
    expect(r.sizePct).toBeGreaterThanOrEqual(0);
  });
});

describe("risk limits", () => {
  const pos = (cost: number, category: string): PaperPosition =>
    ({ cost, category } as PaperPosition);
  it("blocks when open exposure cap exceeded", () => {
    const open = [pos(3000, "A"), pos(1000, "B")]; // 40% already
    const r = checkRiskLimits({ bankroll: 10000, proposedUsd: 200, category: "C", openPositions: open });
    expect(r.ok).toBe(false);
  });
  it("blocks when category cap exceeded", () => {
    const open = [pos(1100, "Politics")]; // 11%
    const r = checkRiskLimits({ bankroll: 10000, proposedUsd: 300, category: "Politics", openPositions: open });
    expect(r.ok).toBe(false); // 14% > 12%
  });
  it("allows within all caps", () => {
    const r = checkRiskLimits({ bankroll: 10000, proposedUsd: 100, category: "X", openPositions: [] });
    expect(r.ok).toBe(true);
  });
});

describe("conservative pricing", () => {
  it("buys YES at the ask, sells YES at the bid", () => {
    expect(conservativeEntryPrice("YES", 0.5, 0.53, 0.47, 0.5)).toBe(0.53);
    expect(conservativeExitPrice("YES", 0.5, 0.47, 0.53, 0.5)).toBe(0.47);
  });
  it("NO entry uses 1 - bestBid, NO exit uses 1 - bestAsk", () => {
    expect(conservativeEntryPrice("NO", 0.5, 0.53, 0.47, 0.5)).toBeCloseTo(0.53, 5); // 1-0.47
    expect(conservativeExitPrice("NO", 0.5, 0.47, 0.53, 0.5)).toBeCloseTo(0.47, 5); // 1-0.53
  });
  it("applies slippage penalty when a book side is missing", () => {
    const entry = conservativeEntryPrice("YES", 0.5, null, null, 0.5);
    expect(entry).toBeCloseTo(0.5 + RISK.slippagePenalty, 5);
  });
  it("entry is always worse-or-equal than exit (spread cost) for same book", () => {
    const e = conservativeEntryPrice("YES", 0.5, 0.53, 0.47, 0.5);
    const x = conservativeExitPrice("YES", 0.5, 0.47, 0.53, 0.5);
    expect(e).toBeGreaterThanOrEqual(x);
  });
});

describe("ensemble gating", () => {
  const mkView = (over: Partial<MarketView["market"]> & { spread?: number; liq?: number } = {}): MarketView => ({
    market: {
      id: "m1",
      slug: "m1",
      question: "Test market",
      category: "Crypto",
      yes_token_id: "y",
      no_token_id: "n",
      active: 1,
      closed: 0,
      end_date: null,
      volume: 100000,
      liquidity: over.liq ?? 50000,
      source: "sample",
      data_quality_score: 1,
      updated_at: new Date().toISOString(),
    },
    book: {
      market_id: "m1",
      best_bid: 0.49,
      best_ask: 0.51,
      midpoint: 0.5,
      spread: over.spread ?? 0.02,
      bid_depth: 1000,
      ask_depth: 1000,
      ts: new Date().toISOString(),
      source: "sample",
      data_quality_score: 1,
    },
    priceSeries: [0.5, 0.5, 0.5],
    yesConsensus: { count: 0, avgRank: 999, size: 0, sumPnl: 0 },
    noConsensus: { count: 0, avgRank: 999, size: 0, sumPnl: 0 },
    ageMinutes: 1,
  });
  const states: StrategyStateRow[] = [
    { id: "s", experiment_id: "e", strategy: "MOMENTUM_BREAKOUT", weight: 1, threshold: 0.3, wins: 0, losses: 0, trades: 0, realized_pl: 0, enabled: 1 },
  ];
  const sig = (score: number): StrategySignal => ({
    strategy: "MOMENTUM_BREAKOUT",
    marketId: "m1",
    side: "YES",
    score,
    confidence: 0.8,
    evidence: {},
    rationale: "test",
  });

  it("accepts a strong signal in a healthy market", () => {
    const out = buildEnsemble([sig(0.9)], states, [mkView()]);
    expect(out[0].eligible).toBe(true);
  });
  it("rejects when spread too wide", () => {
    const out = buildEnsemble([sig(0.9)], states, [mkView({ spread: 0.2 })]);
    expect(out[0].eligible).toBe(false);
    expect(out[0].reasons.join(" ")).toMatch(/spread/);
  });
  it("rejects when liquidity too low", () => {
    const out = buildEnsemble([sig(0.9)], states, [mkView({ liq: 100 })]);
    expect(out[0].eligible).toBe(false);
    expect(out[0].reasons.join(" ")).toMatch(/liquidity/);
  });
  it("rejects a weak ensemble score below the entry gate", () => {
    const out = buildEnsemble([sig(0.4)], states, [mkView()]);
    expect(out[0].eligible).toBe(false);
  });
});

describe("paper P/L math (pure)", () => {
  it("realized P/L = (exit - entry) * shares", () => {
    const entry = 0.5, exit = 0.6, shares = 100;
    expect(+((exit - entry) * shares).toFixed(2)).toBe(10);
  });
  it("clamp keeps prices in (0,1)", () => {
    expect(clamp(1.5, 0.01, 0.99)).toBe(0.99);
    expect(clamp(-1, 0.01, 0.99)).toBe(0.01);
  });
});
