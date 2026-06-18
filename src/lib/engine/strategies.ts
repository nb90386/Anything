/**
 * Strategy engine (Quant + Strategy Agents). Each strategy is a PURE function of
 * a MarketView (and the full set, for cross-market work). Strategies return a
 * raw conviction score in [0,1], a side, confidence, and human-readable
 * evidence/rationale. Hard entry GATES (spread, liquidity, freshness, extreme
 * price) are applied in the ensemble layer; strategies also self-attenuate when
 * their preconditions are weak.
 *
 * No strategy uses future data. All inputs are point-in-time snapshots.
 */
import type { MarketView } from "@/lib/repo";
import type { StrategySignal, StrategyId, Side } from "@/lib/types";
import { clamp, sigmoid, ema, returns, std, zScore, bookImbalance, mean } from "@/lib/engine/indicators";

const EXTREME_HI = 0.95;
const EXTREME_LO = 0.05;

function yesPrice(v: MarketView): number | null {
  if (v.book?.midpoint != null) return v.book.midpoint;
  if (v.priceSeries.length) return v.priceSeries[v.priceSeries.length - 1];
  return null;
}

type Gen = (v: MarketView, all: MarketView[]) => StrategySignal | null;

// 1) TOP-TRADER CONSENSUS -----------------------------------------------------
const topTraderConsensus: Gen = (v) => {
  const y = v.yesConsensus;
  const n = v.noConsensus;
  const winner = y.count >= n.count ? ("YES" as Side) : ("NO" as Side);
  const w = winner === "YES" ? y : n;
  const loser = winner === "YES" ? n : y;
  // require >=3 aligned and >=2 same side (count itself), and clear majority
  if (w.count < 3 || w.count < 2) return null;
  if (w.count <= loser.count) return null; // need net consensus, not a split
  const rankQuality = clamp((300 - Math.min(w.avgRank, 300)) / 300); // better (lower) rank -> higher
  const dominance = clamp((w.count - loser.count) / (w.count + loser.count + 1));
  const sizeFactor = clamp(Math.log10(1 + w.size) / 5);
  const score = clamp(0.35 * clamp(w.count / 6) + 0.3 * rankQuality + 0.2 * dominance + 0.15 * sizeFactor);
  return {
    strategy: "TOP_TRADER_CONSENSUS",
    marketId: v.market.id,
    side: winner,
    score,
    confidence: clamp(0.4 + 0.1 * w.count),
    evidence: { alignedTraders: w.count, opposing: loser.count, avgRank: +w.avgRank.toFixed(0), size: Math.round(w.size) },
    rationale: `${w.count} top traders aligned ${winner} (avg rank ${w.avgRank.toFixed(0)}) vs ${loser.count} opposing`,
  };
};

// 2) SMART-WALLET MOMENTUM ----------------------------------------------------
const smartWalletMomentum: Gen = (v) => {
  const y = v.yesConsensus;
  const n = v.noConsensus;
  const totalPnl = Math.abs(y.sumPnl) + Math.abs(n.sumPnl);
  if (totalPnl < 50_000) return null; // need meaningful smart money present
  const side: Side = y.sumPnl >= n.sumPnl ? "YES" : "NO";
  const edge = (Math.max(y.sumPnl, n.sumPnl) - Math.min(y.sumPnl, n.sumPnl)) / (totalPnl + 1);
  const profitableWallets = side === "YES" ? y.count : n.count;
  if (profitableWallets < 2) return null;
  const score = clamp(0.5 * edge + 0.3 * clamp(Math.log10(1 + totalPnl) / 7) + 0.2 * clamp(profitableWallets / 5));
  return {
    strategy: "SMART_WALLET_MOMENTUM",
    marketId: v.market.id,
    side,
    score,
    confidence: clamp(0.35 + 0.1 * profitableWallets),
    evidence: { yesPnl: Math.round(y.sumPnl), noPnl: Math.round(n.sumPnl), edge: +edge.toFixed(2), wallets: profitableWallets },
    rationale: `Profitable wallets net ${side} (PnL edge ${(edge * 100).toFixed(0)}%, ${profitableWallets} wallets)`,
  };
};

// 3) ORDER-BOOK IMBALANCE -----------------------------------------------------
const orderbookImbalance: Gen = (v) => {
  const b = v.book;
  if (!b || b.bid_depth + b.ask_depth < 200) return null; // avoid thin markets
  const imb = bookImbalance(b.bid_depth, b.ask_depth);
  if (Math.abs(imb) < 0.25) return null;
  const side: Side = imb > 0 ? "YES" : "NO";
  const depthQuality = clamp(Math.log10(1 + b.bid_depth + b.ask_depth) / 5);
  const tightSpread = b.spread != null ? clamp(1 - b.spread / 0.06) : 0.3;
  const score = clamp(0.6 * Math.abs(imb) + 0.25 * depthQuality + 0.15 * tightSpread);
  return {
    strategy: "ORDERBOOK_IMBALANCE",
    marketId: v.market.id,
    side,
    score,
    confidence: clamp(0.3 + Math.abs(imb)),
    evidence: { imbalance: +imb.toFixed(2), bidDepth: Math.round(b.bid_depth), askDepth: Math.round(b.ask_depth), spread: b.spread },
    rationale: `Book pressure favors ${side} (imbalance ${(imb * 100).toFixed(0)}%)`,
  };
};

// 4) MOMENTUM / BREAKOUT ------------------------------------------------------
const momentumBreakout: Gen = (v) => {
  const s = v.priceSeries;
  if (s.length < 12) return null;
  const last = s[s.length - 1];
  if (last >= EXTREME_HI || last <= EXTREME_LO) return null; // don't chase extremes
  const fast = ema(s.slice(-10), 5);
  const slow = ema(s, 20);
  const slope = s[s.length - 1] - s[Math.max(0, s.length - 6)];
  const rising = fast > slow && slope > 0;
  const falling = fast < slow && slope < 0;
  if (!rising && !falling) return null;
  const side: Side = rising ? "YES" : "NO";
  const strength = clamp(Math.abs(slope) / 0.08); // 8c move over window -> strong
  const sep = clamp(Math.abs(fast - slow) / 0.05);
  const score = clamp(0.55 * strength + 0.45 * sep);
  return {
    strategy: "MOMENTUM_BREAKOUT",
    marketId: v.market.id,
    side,
    score,
    confidence: clamp(0.35 + 0.4 * strength),
    evidence: { fast: +fast.toFixed(3), slow: +slow.toFixed(3), slope: +slope.toFixed(3), last: +last.toFixed(3) },
    rationale: `${rising ? "Up" : "Down"}trend continuation (EMA5 ${fast.toFixed(2)} vs EMA20 ${slow.toFixed(2)})`,
  };
};

// 5) MEAN REVERSION / OVERREACTION -------------------------------------------
const meanReversion: Gen = (v) => {
  const s = v.priceSeries;
  if (s.length < 15) return null;
  const last = s[s.length - 1];
  if (last >= EXTREME_HI || last <= EXTREME_LO) return null;
  const z = zScore(s);
  if (Math.abs(z) < 1.8) return null; // only fade sharp moves
  // widening spread supports an overreaction thesis
  const spreadWide = v.book?.spread != null && v.book.spread > 0.025;
  const side: Side = z > 0 ? "NO" : "YES"; // fade the move
  const vol = std(returns(s));
  const score = clamp(0.5 * clamp((Math.abs(z) - 1.8) / 2) + 0.2 * (spreadWide ? 1 : 0.3) + 0.3 * clamp(vol / 0.05));
  return {
    strategy: "MEAN_REVERSION",
    marketId: v.market.id,
    side,
    score,
    confidence: clamp(0.3 + 0.15 * Math.abs(z)),
    evidence: { z: +z.toFixed(2), last: +last.toFixed(3), spreadWide, vol: +vol.toFixed(3) },
    rationale: `Overreaction fade: price z-score ${z.toFixed(1)}σ, fading toward mean (${side})`,
  };
};

// 6) RESOLUTION DRIFT ---------------------------------------------------------
const resolutionDrift: Gen = (v) => {
  const p = yesPrice(v);
  if (p == null) return null;
  const end = v.market.end_date ? new Date(v.market.end_date).getTime() : null;
  if (!end) return null;
  const daysToEnd = (end - Date.now()) / 86400000;
  if (daysToEnd < 0 || daysToEnd > 14) return null; // approaching resolution only
  const confident = p > 0.82 || p < 0.18;
  if (!confident) return null;
  const tightSpread = v.book?.spread != null ? v.book.spread < 0.03 : true;
  if (!tightSpread) return null;
  const side: Side = p > 0.5 ? "YES" : "NO";
  const conviction = Math.abs(p - 0.5) * 2; // 0..1
  const timeFactor = clamp((14 - daysToEnd) / 14);
  const liqFactor = clamp(Math.log10(1 + v.market.liquidity) / 5);
  const score = clamp(0.45 * conviction + 0.3 * timeFactor + 0.25 * liqFactor);
  return {
    strategy: "RESOLUTION_DRIFT",
    marketId: v.market.id,
    side,
    score,
    confidence: clamp(0.4 + 0.3 * conviction),
    evidence: { price: +p.toFixed(3), daysToEnd: +daysToEnd.toFixed(1), liquidity: v.market.liquidity },
    rationale: `Confident ${side} (${(p * 100).toFixed(0)}%) drifting to resolution in ${daysToEnd.toFixed(1)}d`,
  };
};

// 7) CROSS-MARKET CONSISTENCY -------------------------------------------------
const BROAD = /(championship|series|league|tournament|election|season|overall|final)/i;
const NARROW = /(game\s*\d|game 1|state|primary|round|match|leg|next)/i;
const crossMarketConsistency: Gen = (v, all) => {
  const p = yesPrice(v);
  if (p == null) return null;
  const isNarrow = NARROW.test(v.market.question);
  const isBroad = BROAD.test(v.market.question);
  if (!isNarrow && !isBroad) return null;
  // find a paired market in same category of the opposite breadth
  const partner = all.find((o) => {
    if (o.market.id === v.market.id || o.market.category !== v.market.category) return false;
    return isNarrow ? BROAD.test(o.market.question) : NARROW.test(o.market.question);
  });
  if (!partner) return null;
  const pp = yesPrice(partner);
  if (pp == null) return null;
  // Logical constraint approximation: a NARROW (subset) event should not be more
  // likely than its BROAD (superset) counterpart. If P(narrow) > P(broad)+buffer,
  // there's an inconsistency. Bet to correct: short the rich leg.
  const narrowP = isNarrow ? p : pp;
  const broadP = isNarrow ? pp : p;
  const buffer = 0.06; // after spread/slippage cushion
  const gap = narrowP - broadP - buffer;
  if (gap <= 0) return null;
  const thisIsRich = isNarrow; // narrow leg is the overpriced one
  const side: Side = thisIsRich ? "NO" : "YES";
  const score = clamp(gap / 0.2);
  return {
    strategy: "CROSS_MARKET_CONSISTENCY",
    marketId: v.market.id,
    side,
    score,
    confidence: clamp(0.3 + gap),
    evidence: { thisPrice: +p.toFixed(3), partnerPrice: +pp.toFixed(3), partner: partner.market.question, gap: +gap.toFixed(3) },
    rationale: `Cross-market gap ${(gap * 100).toFixed(0)}% vs "${partner.market.question.slice(0, 40)}…"; correcting ${side}`,
  };
};

// 8) LIQUIDITY / SPREAD FADE --------------------------------------------------
const liquiditySpreadFade: Gen = (v) => {
  const b = v.book;
  if (!b || b.spread == null) return null;
  const typical = 0.02;
  if (b.spread < typical * 2) return null; // only abnormally wide spreads
  if (b.bid_depth + b.ask_depth < 300) return null; // need depth to support exit
  const s = v.priceSeries;
  if (s.length < 5) return null;
  const recentMean = mean(s.slice(-8));
  const last = s[s.length - 1];
  const side: Side = last < recentMean ? "YES" : "NO"; // expect snap back to mean
  const anomaly = clamp((b.spread - typical) / 0.06);
  const depthQuality = clamp(Math.log10(1 + b.bid_depth + b.ask_depth) / 5);
  const score = clamp(0.5 * anomaly + 0.3 * depthQuality + 0.2 * clamp(Math.abs(last - recentMean) / 0.05));
  return {
    strategy: "LIQUIDITY_SPREAD_FADE",
    marketId: v.market.id,
    side,
    score,
    confidence: clamp(0.3 + anomaly * 0.4),
    evidence: { spread: b.spread, typical, last: +last.toFixed(3), recentMean: +recentMean.toFixed(3) },
    rationale: `Abnormal spread ${(b.spread * 100).toFixed(1)}c with depth; fading to mean (${side})`,
  };
};

// 9) NEWS / EVENT REACTION (proxy: large single-step jump + reversal watch) ----
const newsEventReaction: Gen = (v) => {
  const s = v.priceSeries;
  if (s.length < 6) return null;
  const r = returns(s);
  const lastRet = r[r.length - 1] ?? 0;
  if (Math.abs(lastRet) < 0.06) return null; // require a notable jump
  const last = s[s.length - 1];
  if (last >= EXTREME_HI || last <= EXTREME_LO) return null;
  // Empirically many fast prediction-market jumps partially mean-revert; fade with low confidence.
  const side: Side = lastRet > 0 ? "NO" : "YES";
  const magnitude = clamp((Math.abs(lastRet) - 0.06) / 0.1);
  const score = clamp(0.55 * magnitude + 0.2);
  return {
    strategy: "NEWS_EVENT_REACTION",
    marketId: v.market.id,
    side,
    score: score * 0.8, // proxy signal: deliberately attenuated
    confidence: clamp(0.25 + magnitude * 0.3),
    evidence: { jump: +lastRet.toFixed(3), last: +last.toFixed(3), note: "proxy: price-jump reaction (no news scraping)" },
    rationale: `Sharp ${(lastRet * 100).toFixed(0)}% move detected; fading likely overreaction (${side})`,
  };
};

const GENERATORS: { id: StrategyId; gen: Gen }[] = [
  { id: "TOP_TRADER_CONSENSUS", gen: topTraderConsensus },
  { id: "SMART_WALLET_MOMENTUM", gen: smartWalletMomentum },
  { id: "ORDERBOOK_IMBALANCE", gen: orderbookImbalance },
  { id: "MOMENTUM_BREAKOUT", gen: momentumBreakout },
  { id: "MEAN_REVERSION", gen: meanReversion },
  { id: "RESOLUTION_DRIFT", gen: resolutionDrift },
  { id: "CROSS_MARKET_CONSISTENCY", gen: crossMarketConsistency },
  { id: "LIQUIDITY_SPREAD_FADE", gen: liquiditySpreadFade },
  { id: "NEWS_EVENT_REACTION", gen: newsEventReaction },
];

export function generateSignals(views: MarketView[]): StrategySignal[] {
  const out: StrategySignal[] = [];
  for (const v of views) {
    for (const { gen } of GENERATORS) {
      try {
        const sig = gen(v, views);
        if (sig && sig.score > 0.01) out.push(sig);
      } catch {
        /* a single strategy error must not break the batch */
      }
    }
  }
  return out;
}
