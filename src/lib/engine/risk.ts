/**
 * Risk engine (Risk Agent). Owns position sizing and the HARD exposure caps.
 * The self-learning engine may adjust signal thresholds and strategy weights but
 * can NEVER relax anything in here — these are the lab's guardrails.
 *
 * Sizing = fractional Kelly, then hard-capped by per-signal tier and the absolute
 * single-position cap. Leverage is impossible (cash-settled paper shares only).
 */
import { RISK } from "@/lib/config";
import { clamp } from "@/lib/engine/indicators";
import type { PaperPosition, Side } from "@/lib/types";

export interface SizingInput {
  ensembleScore: number; // 0..1
  costPrice: number; // price of the share being bought (YES->price, NO->1-price)
  bankroll: number;
  liquidity: number;
  spread: number | null;
}
export interface SizingResult {
  sizePct: number;
  sizeUsd: number;
  shares: number;
  modelProb: number;
  kellyRaw: number;
  riskScore: number; // 0..1, higher = riskier
  tier: "default" | "strong" | "exceptional";
}

export function computeSizing(input: SizingInput): SizingResult {
  const { ensembleScore, costPrice, bankroll, liquidity, spread } = input;
  const p = clamp(costPrice, 0.02, 0.98);
  // model probability edge from ensemble conviction (bounded, conservative)
  const edgeProb = (ensembleScore - 0.5) * 0.15; // max ~7.5% edge at score=1
  const modelProb = clamp(p + edgeProb, 0.02, 0.98);
  // Kelly for a binary share bought at cost p paying $1 on win:
  // net odds b = (1-p)/p ; f* = w - (1-w)/b
  const b = (1 - p) / p;
  const kellyRaw = b > 0 ? modelProb - (1 - modelProb) / b : 0;
  const kellyFractional = Math.max(0, kellyRaw) * RISK.kellyFraction;

  // signal tier cap
  let tier: SizingResult["tier"] = "default";
  let tierCap: number = RISK.defaultSizePct;
  if (ensembleScore >= 0.8) {
    tier = "exceptional";
    tierCap = RISK.exceptionalSizePct;
  } else if (ensembleScore >= 0.68) {
    tier = "strong";
    tierCap = RISK.strongSizePct;
  }

  // liquidity throttle: never size beyond a small fraction of available liquidity
  const liqCap = liquidity > 0 ? (liquidity * 0.01) / bankroll : RISK.maxSinglePct;

  const sizePct = clamp(Math.min(kellyFractional, tierCap, liqCap, RISK.maxSinglePct), 0, RISK.maxSinglePct);
  const sizeUsd = +(bankroll * sizePct).toFixed(2);
  const shares = +(sizeUsd / p).toFixed(2);

  // risk score for display: worse spread / lower liquidity / bigger size => riskier
  const spreadRisk = spread != null ? clamp(spread / RISK.maxSpread) : 0.5;
  const liqRisk = clamp(1 - Math.log10(1 + liquidity) / 5);
  const sizeRisk = clamp(sizePct / RISK.maxSinglePct);
  const riskScore = +clamp(0.4 * spreadRisk + 0.35 * liqRisk + 0.25 * sizeRisk).toFixed(2);

  return { sizePct, sizeUsd, shares, modelProb: +modelProb.toFixed(3), kellyRaw: +kellyRaw.toFixed(3), riskScore, tier };
}

export interface RiskCheckInput {
  bankroll: number;
  proposedUsd: number;
  category: string;
  openPositions: PaperPosition[];
}
export interface RiskCheckResult {
  ok: boolean;
  reasons: string[];
  exposurePct: number;
  categoryExposurePct: number;
}

export function checkRiskLimits(input: RiskCheckInput): RiskCheckResult {
  const { bankroll, proposedUsd, category, openPositions } = input;
  const reasons: string[] = [];
  const openCost = openPositions.reduce((s, p) => s + p.cost, 0);
  const catCost = openPositions.filter((p) => p.category === category).reduce((s, p) => s + p.cost, 0);

  const newExposure = (openCost + proposedUsd) / bankroll;
  const newCatExposure = (catCost + proposedUsd) / bankroll;
  // correlated proxy = same category (markets in a category move together)
  const newCorrelated = newCatExposure;

  let ok = true;
  if (newExposure > RISK.maxOpenExposurePct) {
    ok = false;
    reasons.push(`open exposure ${(newExposure * 100).toFixed(1)}% > ${(RISK.maxOpenExposurePct * 100).toFixed(0)}% cap`);
  }
  if (newCatExposure > RISK.maxCategoryExposurePct) {
    ok = false;
    reasons.push(`${category} exposure ${(newCatExposure * 100).toFixed(1)}% > ${(RISK.maxCategoryExposurePct * 100).toFixed(0)}% cap`);
  }
  if (newCorrelated > RISK.maxCorrelatedExposurePct) {
    ok = false;
    reasons.push(`correlated exposure ${(newCorrelated * 100).toFixed(1)}% > ${(RISK.maxCorrelatedExposurePct * 100).toFixed(0)}% cap`);
  }
  if (ok) reasons.push("risk limits OK");
  return { ok, reasons, exposurePct: newExposure, categoryExposurePct: newCatExposure };
}

/** Conservative entry price: pay the ask (or midpoint + slippage penalty). */
export function conservativeEntryPrice(side: Side, midpoint: number | null, bestAsk: number | null, bestBid: number | null, yesPrice: number): number {
  // We buy the chosen outcome's share. For YES we want the YES ask; for NO the
  // NO ask ≈ 1 - YES bid. When a book side is missing, use midpoint + slippage.
  if (side === "YES") {
    if (bestAsk != null) return clamp(bestAsk, 0.01, 0.99);
    const mid = midpoint ?? yesPrice;
    return clamp(mid + RISK.slippagePenalty, 0.01, 0.99);
  } else {
    // NO ask ≈ 1 - YES best bid
    if (bestBid != null) return clamp(1 - bestBid, 0.01, 0.99);
    const mid = midpoint ?? yesPrice;
    return clamp(1 - mid + RISK.slippagePenalty, 0.01, 0.99);
  }
}

/** Conservative exit price: sell into the bid (or midpoint - slippage penalty). */
export function conservativeExitPrice(side: Side, midpoint: number | null, bestBid: number | null, bestAsk: number | null, yesPrice: number): number {
  if (side === "YES") {
    if (bestBid != null) return clamp(bestBid, 0.01, 0.99);
    const mid = midpoint ?? yesPrice;
    return clamp(mid - RISK.slippagePenalty, 0.01, 0.99);
  } else {
    // selling NO ≈ 1 - YES best ask
    if (bestAsk != null) return clamp(1 - bestAsk, 0.01, 0.99);
    const mid = midpoint ?? yesPrice;
    return clamp(1 - mid - RISK.slippagePenalty, 0.01, 0.99);
  }
}
