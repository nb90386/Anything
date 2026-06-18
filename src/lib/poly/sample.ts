/**
 * SAMPLE DATA PROVIDER.
 *
 * Used ONLY when the live Polymarket public API is unreachable (e.g. restricted
 * network egress) AND ALLOW_SAMPLE_FALLBACK is true. Everything produced here is
 * tagged source="sample" and surfaced in the UI as "SAMPLE DATA" so it is never
 * mistaken for real metrics.
 *
 * Prices evolve as a deterministic random walk keyed on market id + time bucket,
 * so positions show realistic mark-to-market movement across ticks.
 */
import type { NormalizedMarket, NormalizedBook, PricePoint, OrderBookLevel } from "@/lib/types";
import type { RawLeaderEntry, RawPosition } from "@/lib/poly/client";

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clampPrice = (p: number) => Math.min(0.985, Math.max(0.015, p));

const SAMPLE_DEFS: { q: string; cat: string; base: number; vol: number; liq: number; drift: number }[] = [
  { q: "Will the Fed cut rates at the next FOMC meeting?", cat: "Economics", base: 0.62, vol: 480000, liq: 42000, drift: 0.4 },
  { q: "Will Bitcoin close above $120k this month?", cat: "Crypto", base: 0.38, vol: 920000, liq: 65000, drift: 1.1 },
  { q: "Will the incumbent win the presidential election?", cat: "Politics", base: 0.54, vol: 2300000, liq: 130000, drift: 0.3 },
  { q: "Will Team A win the championship series?", cat: "Sports", base: 0.47, vol: 350000, liq: 28000, drift: 0.9 },
  { q: "Will Team A win Game 1?", cat: "Sports", base: 0.51, vol: 120000, liq: 15000, drift: 1.2 },
  { q: "Will OpenAI release a new flagship model this quarter?", cat: "Tech", base: 0.71, vol: 210000, liq: 19000, drift: 0.5 },
  { q: "Will Ethereum flip $5k before quarter end?", cat: "Crypto", base: 0.29, vol: 540000, liq: 38000, drift: 1.3 },
  { q: "Will CPI come in below forecast this print?", cat: "Economics", base: 0.45, vol: 160000, liq: 12000, drift: 0.8 },
  { q: "Will the challenger win the state primary?", cat: "Politics", base: 0.33, vol: 280000, liq: 21000, drift: 0.6 },
  { q: "Will the party hold the Senate majority?", cat: "Politics", base: 0.58, vol: 410000, liq: 33000, drift: 0.35 },
  { q: "Will the named film win Best Picture?", cat: "Pop Culture", base: 0.41, vol: 95000, liq: 8000, drift: 0.7 },
  { q: "Will a hurricane make landfall this week?", cat: "Other", base: 0.22, vol: 60000, liq: 6000, drift: 1.0 },
  { q: "Will Solana close green this week?", cat: "Crypto", base: 0.55, vol: 320000, liq: 24000, drift: 1.1 },
  { q: "Will unemployment rise next report?", cat: "Economics", base: 0.36, vol: 140000, liq: 11000, drift: 0.6 },
  { q: "Will Team A win the league this season?", cat: "Sports", base: 0.44, vol: 230000, liq: 18000, drift: 0.5 },
  { q: "Will the tech IPO price above range?", cat: "Tech", base: 0.49, vol: 88000, liq: 7500, drift: 0.9 },
  { q: "Will the bill pass before the deadline?", cat: "Politics", base: 0.63, vol: 175000, liq: 14000, drift: 0.45 },
  { q: "Will BTC dominance exceed 60% this month?", cat: "Crypto", base: 0.4, vol: 270000, liq: 20000, drift: 0.8 },
  { q: "Will the GDP print beat consensus?", cat: "Economics", base: 0.52, vol: 130000, liq: 10000, drift: 0.7 },
  { q: "Will the underdog reach the final?", cat: "Sports", base: 0.27, vol: 110000, liq: 9000, drift: 1.0 },
];

function priceAt(id: string, base: number, drift: number, t: number): number {
  // random walk in 10-minute buckets up to time t
  const bucket = Math.floor(t / (10 * 60 * 1000));
  const rng = mulberry32(hash(id) ^ bucket);
  let p = base;
  // accumulate small steps deterministically across recent buckets
  for (let i = 0; i < (bucket % 200); i++) {
    const r2 = mulberry32(hash(id) ^ (bucket - i))();
    p += (r2 - 0.5) * 0.012 * drift;
    p += (base - p) * 0.02; // mild mean reversion to base
  }
  void rng;
  return clampPrice(p);
}

export function sampleMarkets(now = Date.now()): NormalizedMarket[] {
  return SAMPLE_DEFS.map((d, i) => {
    const id = `sample-${i}-${d.cat.toLowerCase()}`;
    const yes = +priceAt(id, d.base, d.drift, now).toFixed(3);
    const spread = +(0.01 + (hash(id) % 5) / 100).toFixed(3);
    const bestBid = +Math.max(0.01, yes - spread / 2).toFixed(3);
    const bestAsk = +Math.min(0.99, yes + spread / 2).toFixed(3);
    return {
      id,
      question: d.q,
      slug: id,
      category: d.cat,
      yesTokenId: `${id}-YES`,
      noTokenId: `${id}-NO`,
      active: true,
      closed: false,
      endDate: new Date(now + (3 + (i % 20)) * 86400000).toISOString(),
      volume: d.vol,
      liquidity: d.liq,
      yesPrice: yes,
      bestBid,
      bestAsk,
      spread,
      source: "sample",
      dataQuality: 0.8,
    };
  });
}

export function sampleBook(market: NormalizedMarket, side: "YES" | "NO" = "YES"): NormalizedBook {
  const mid = side === "YES" ? market.yesPrice ?? 0.5 : 1 - (market.yesPrice ?? 0.5);
  const spread = market.spread ?? 0.02;
  const bestBid = clampPrice(mid - spread / 2);
  const bestAsk = clampPrice(mid + spread / 2);
  const liqScale = market.liquidity / 50;
  const rng = mulberry32(hash(market.id + side));
  const bids: OrderBookLevel[] = [];
  const asks: OrderBookLevel[] = [];
  for (let i = 0; i < 8; i++) {
    bids.push({ price: +clampPrice(bestBid - i * 0.01).toFixed(3), size: Math.round(liqScale * (1 + rng() * 3)) });
    asks.push({ price: +clampPrice(bestAsk + i * 0.01).toFixed(3), size: Math.round(liqScale * (1 + rng() * 3)) });
  }
  // introduce occasional imbalance so the order-book strategy has signal
  const imbalance = rng();
  if (imbalance > 0.6) bids.forEach((b) => (b.size = Math.round(b.size * 1.8)));
  else if (imbalance < 0.4) asks.forEach((a) => (a.size = Math.round(a.size * 1.8)));
  const bidDepth = bids.reduce((s, l) => s + l.size, 0);
  const askDepth = asks.reduce((s, l) => s + l.size, 0);
  return {
    tokenId: side === "YES" ? market.yesTokenId! : market.noTokenId!,
    bids,
    asks,
    bestBid,
    bestAsk,
    midpoint: +mid.toFixed(3),
    spread: +(bestAsk - bestBid).toFixed(3),
    bidDepth,
    askDepth,
    source: "sample",
    dataQuality: 0.8,
  };
}

export function samplePriceHistory(market: NormalizedMarket, points = 120, now = Date.now()): PricePoint[] {
  const out: PricePoint[] = [];
  const def = SAMPLE_DEFS.find((_, i) => `sample-${i}-${_.cat.toLowerCase()}` === market.id);
  const base = def?.base ?? 0.5;
  const drift = def?.drift ?? 0.8;
  const step = 10 * 60 * 1000; // 10m
  for (let i = points; i >= 0; i--) {
    const t = now - i * step;
    out.push({ t: Math.floor(t / 1000), p: +priceAt(market.id, base, drift, t).toFixed(3) });
  }
  return out;
}

export function sampleLeaderboard(): RawLeaderEntry[] {
  const names = ["0xWhaleAlpha", "0xQuantEdge", "0xMomoKing", "0xSharpBettor", "0xValueHunter", "0xEventTrader", "0xBookFader", "0xConsensus", "0xDriftRider", "0xCrossArb"];
  return names.map((n, i) => ({
    proxyWallet: `0x${(hash(n).toString(16) + "0".repeat(40)).slice(0, 40)}`,
    name: n,
    pseudonym: n,
    rank: i + 1,
    pnl: Math.round(500000 / (i + 1) + (hash(n) % 50000)),
    volume: Math.round(5000000 / (i + 1) + (hash(n) % 200000)),
  }));
}

/** Sample positions: top wallets cluster into a few markets to create consensus. */
export function samplePositions(wallet: string, markets: NormalizedMarket[]): RawPosition[] {
  const rng = mulberry32(hash(wallet));
  const n = 3 + Math.floor(rng() * 4);
  const picks = [...markets].sort(() => rng() - 0.5).slice(0, n);
  return picks.map((m) => {
    const yesProb = m.yesPrice ?? 0.5;
    const side = rng() < yesProb ? "Yes" : "No"; // bias toward the favored side -> consensus
    const cur = side === "Yes" ? yesProb : 1 - yesProb;
    return {
      conditionId: m.id,
      asset: side === "Yes" ? m.yesTokenId! : m.noTokenId!,
      outcome: side,
      title: m.question,
      size: Math.round(1000 + rng() * 9000),
      avgPrice: +Math.max(0.05, cur - 0.05 + rng() * 0.05).toFixed(3),
      curPrice: +cur.toFixed(3),
      cashPnl: Math.round((rng() - 0.4) * 5000),
      percentPnl: +((rng() - 0.4) * 30).toFixed(1),
    };
  });
}
