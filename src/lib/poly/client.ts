/**
 * Polymarket PUBLIC API client. Read-only.
 *
 * Endpoint shapes verified in RESEARCH.md against the official py-clob-client
 * source and Polymarket docs. Key gotcha: Gamma returns clobTokenIds / outcomes
 * / outcomePrices as JSON-encoded STRINGS — we parse them defensively.
 */
import { config } from "@/lib/config";
import { fetchJson } from "@/lib/poly/http";
import type { NormalizedMarket, NormalizedBook, PricePoint, OrderBookLevel } from "@/lib/types";

const { gamma, clob, data } = config.poly;

function parseMaybeJson<T>(v: unknown, fallback: T): T {
  if (v == null) return fallback;
  if (Array.isArray(v)) return v as unknown as T;
  if (typeof v === "string") {
    try {
      return JSON.parse(v) as T;
    } catch {
      return fallback;
    }
  }
  return (v as T) ?? fallback;
}

function inferCategory(m: any): string {
  const tags = parseMaybeJson<string[]>(m?.tags, []);
  const text = `${m?.category ?? ""} ${m?.question ?? ""} ${tags.join(" ")}`.toLowerCase();
  if (/election|president|senate|primary|democrat|republican|congress|governor|poll/.test(text)) return "Politics";
  if (/\b(nba|nfl|mlb|nhl|soccer|football|tennis|ufc|game|match|league|cup|playoff)\b/.test(text)) return "Sports";
  if (/bitcoin|btc|eth|crypto|solana|token|coin/.test(text)) return "Crypto";
  if (/fed|rate|cpi|gdp|inflation|economy|jobs|recession/.test(text)) return "Economics";
  if (/movie|oscar|album|celebrity|tv|award|show/.test(text)) return "Pop Culture";
  if (/openai|google|ai|tech|apple|launch|model|gpt/.test(text)) return "Tech";
  return m?.category || "Other";
}

// ---------------------------------------------------------------- Gamma markets
export interface RawGammaMarket {
  id: string;
  conditionId?: string;
  question: string;
  slug?: string;
  active?: boolean;
  closed?: boolean;
  endDate?: string;
  volume?: number | string;
  volumeNum?: number;
  liquidity?: number | string;
  liquidityNum?: number;
  clobTokenIds?: string | string[];
  outcomes?: string | string[];
  outcomePrices?: string | string[];
  bestBid?: number;
  bestAsk?: number;
  spread?: number;
  lastTradePrice?: number;
  category?: string;
  tags?: unknown;
}

export function normalizeMarket(m: RawGammaMarket): NormalizedMarket {
  const tokenIds = parseMaybeJson<string[]>(m.clobTokenIds, []);
  const outcomes = parseMaybeJson<string[]>(m.outcomes, ["Yes", "No"]);
  const prices = parseMaybeJson<string[]>(m.outcomePrices, []).map(Number);
  // Map YES/NO to token ids by outcome label position.
  const yesIdx = outcomes.findIndex((o) => /yes/i.test(o));
  const idxYes = yesIdx >= 0 ? yesIdx : 0;
  const idxNo = idxYes === 0 ? 1 : 0;
  const yesPrice = Number.isFinite(prices[idxYes]) ? prices[idxYes] : null;
  const bestBid = typeof m.bestBid === "number" ? m.bestBid : null;
  const bestAsk = typeof m.bestAsk === "number" ? m.bestAsk : null;
  const spread =
    typeof m.spread === "number" ? m.spread : bestBid != null && bestAsk != null ? +(bestAsk - bestBid).toFixed(4) : null;
  const volume = Number(m.volumeNum ?? m.volume ?? 0) || 0;
  const liquidity = Number(m.liquidityNum ?? m.liquidity ?? 0) || 0;

  // data quality: penalize missing microstructure
  let dq = 1;
  if (yesPrice == null) dq -= 0.3;
  if (bestBid == null || bestAsk == null) dq -= 0.2;
  if (!tokenIds.length) dq -= 0.2;
  dq = Math.max(0, +dq.toFixed(2));

  return {
    id: m.conditionId || m.id,
    question: m.question,
    slug: m.slug || "",
    category: inferCategory(m),
    yesTokenId: tokenIds[idxYes] ?? null,
    noTokenId: tokenIds[idxNo] ?? null,
    active: m.active !== false,
    closed: m.closed === true,
    endDate: m.endDate ?? null,
    volume,
    liquidity,
    yesPrice,
    bestBid,
    bestAsk,
    spread,
    source: "gamma",
    dataQuality: dq,
  };
}

export async function getMarkets(opts: { limit?: number; offset?: number } = {}): Promise<NormalizedMarket[]> {
  const { limit = 100, offset = 0 } = opts;
  const url = `${gamma}/markets?limit=${limit}&offset=${offset}&active=true&closed=false&order=volume&ascending=false`;
  const raw = await fetchJson<RawGammaMarket[]>(url);
  return (Array.isArray(raw) ? raw : []).map(normalizeMarket).filter((m) => m.yesTokenId);
}

// ----------------------------------------------------------------- CLOB book
interface RawBook {
  bids?: { price: string | number; size: string | number }[];
  asks?: { price: string | number; size: string | number }[];
  tick_size?: string;
}
function normLevels(levels: { price: string | number; size: string | number }[] = []): OrderBookLevel[] {
  return levels.map((l) => ({ price: Number(l.price), size: Number(l.size) })).filter((l) => Number.isFinite(l.price));
}

export async function getBook(tokenId: string): Promise<NormalizedBook> {
  const url = `${clob}/book?token_id=${encodeURIComponent(tokenId)}`;
  const raw = await fetchJson<RawBook>(url);
  const bids = normLevels(raw.bids).sort((a, b) => b.price - a.price);
  const asks = normLevels(raw.asks).sort((a, b) => a.price - b.price);
  const bestBid = bids[0]?.price ?? null;
  const bestAsk = asks[0]?.price ?? null;
  const midpoint = bestBid != null && bestAsk != null ? +((bestBid + bestAsk) / 2).toFixed(4) : null;
  const spread = bestBid != null && bestAsk != null ? +(bestAsk - bestBid).toFixed(4) : null;
  // depth within 5 cents of top of book
  const bidDepth = bids.filter((l) => bestBid != null && l.price >= bestBid - 0.05).reduce((s, l) => s + l.size, 0);
  const askDepth = asks.filter((l) => bestAsk != null && l.price <= bestAsk + 0.05).reduce((s, l) => s + l.size, 0);
  let dq = 1;
  if (!bids.length || !asks.length) dq -= 0.5;
  return {
    tokenId,
    bids,
    asks,
    bestBid,
    bestAsk,
    midpoint,
    spread,
    bidDepth,
    askDepth,
    source: "clob",
    dataQuality: Math.max(0, +dq.toFixed(2)),
  };
}

export async function getMidpoint(tokenId: string): Promise<number | null> {
  try {
    const r = await fetchJson<{ mid?: string }>(`${clob}/midpoint?token_id=${encodeURIComponent(tokenId)}`);
    const v = Number(r.mid);
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

export async function getPricesHistory(tokenId: string, interval = "1d", fidelity = 5): Promise<PricePoint[]> {
  const url = `${clob}/prices-history?market=${encodeURIComponent(tokenId)}&interval=${interval}&fidelity=${fidelity}`;
  const r = await fetchJson<{ history?: { t: number; p: number }[] }>(url);
  return (r.history ?? []).map((h) => ({ t: Number(h.t), p: Number(h.p) })).filter((x) => Number.isFinite(x.p));
}

// ----------------------------------------------------------------- Leaderboard
export interface RawLeaderEntry {
  proxyWallet?: string;
  address?: string;
  name?: string;
  pseudonym?: string;
  pnl?: number;
  amount?: number;
  volume?: number;
  rank?: number;
}
/** Leaderboard endpoint is the least-certain; we try the documented path. */
export async function getLeaderboard(window: "DAY" | "WEEK" | "MONTH" = "WEEK", limit = 50): Promise<RawLeaderEntry[]> {
  const url = `${data}/v1/leaderboard?category=OVERALL&timePeriod=${window}&orderBy=PNL&limit=${limit}`;
  const r = await fetchJson<RawLeaderEntry[] | { data?: RawLeaderEntry[] }>(url);
  return Array.isArray(r) ? r : (r.data ?? []);
}

// ----------------------------------------------------------------- Positions
export interface RawPosition {
  conditionId?: string;
  asset?: string;
  size?: number;
  avgPrice?: number;
  curPrice?: number;
  cashPnl?: number;
  percentPnl?: number;
  outcome?: string;
  title?: string;
}
export async function getPositions(proxyWallet: string): Promise<RawPosition[]> {
  const url = `${data}/positions?user=${encodeURIComponent(proxyWallet)}`;
  const r = await fetchJson<RawPosition[]>(url);
  return Array.isArray(r) ? r : [];
}
