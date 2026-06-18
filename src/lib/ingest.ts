/**
 * Data ingestion pipeline (Data Engineer Agent).
 *
 * Strategy: try LIVE public Polymarket data first; on any failure (e.g. network
 * egress restrictions) fall back to clearly-labeled SAMPLE data when allowed.
 * Everything is persisted as snapshots so the experiment can resume from DB
 * state and so strategies have history to work with.
 */
import { config } from "@/lib/config";
import { getDb, ensureSchema, newId, nowIso } from "@/lib/db";
import { log } from "@/lib/logger";
import * as poly from "@/lib/poly/client";
import * as sample from "@/lib/poly/sample";
import type { NormalizedMarket, NormalizedBook, PricePoint } from "@/lib/types";

export interface IngestResult {
  mode: "live" | "sample";
  markets: number;
  books: number;
  pricePoints: number;
  traders: number;
  positions: number;
  startedAt: string;
  durationMs: number;
}

const MAX_MARKETS = 40;
const MAX_TRADERS = 15;

async function upsertMarket(m: NormalizedMarket) {
  const db = getDb();
  await db.run(
    `INSERT INTO markets (id, slug, question, category, yes_token_id, no_token_id, active, closed, end_date, volume, liquidity, source, data_quality_score, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(id) DO UPDATE SET slug=excluded.slug, question=excluded.question, category=excluded.category,
       yes_token_id=excluded.yes_token_id, no_token_id=excluded.no_token_id, active=excluded.active, closed=excluded.closed,
       end_date=excluded.end_date, volume=excluded.volume, liquidity=excluded.liquidity, source=excluded.source,
       data_quality_score=excluded.data_quality_score, updated_at=excluded.updated_at`,
    [m.id, m.slug, m.question, m.category, m.yesTokenId, m.noTokenId, m.active ? 1 : 0, m.closed ? 1 : 0, m.endDate,
     m.volume, m.liquidity, m.source, m.dataQuality, nowIso(), nowIso()]
  );
  await db.run(
    `INSERT INTO market_snapshots (id, market_id, ts, yes_price, best_bid, best_ask, spread, volume, liquidity, active, closed, source, data_quality_score, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [newId("ms"), m.id, nowIso(), m.yesPrice, m.bestBid, m.bestAsk, m.spread, m.volume, m.liquidity,
     m.active ? 1 : 0, m.closed ? 1 : 0, m.source, m.dataQuality, nowIso()]
  );
}

async function storeBook(marketId: string, b: NormalizedBook) {
  const db = getDb();
  await db.run(
    `INSERT INTO market_orderbooks (id, market_id, token_id, ts, best_bid, best_ask, midpoint, spread, bid_depth, ask_depth, book_json, source, data_quality_score, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [newId("ob"), marketId, b.tokenId, nowIso(), b.bestBid, b.bestAsk, b.midpoint, b.spread, b.bidDepth, b.askDepth,
     JSON.stringify({ bids: b.bids.slice(0, 10), asks: b.asks.slice(0, 10) }), b.source, b.dataQuality, nowIso()]
  );
}

async function storePrices(marketId: string, tokenId: string, pts: PricePoint[], source: string) {
  const db = getDb();
  if (!pts.length) return 0;
  // Only insert points newer than the latest stored ts for this market. This
  // seeds a real history on the first tick (from prices-history) and then
  // accumulates one new point per tick without duplicating rows.
  const row = await db.get<{ maxts: number }>(`SELECT MAX(ts) AS maxts FROM market_prices WHERE market_id=?`, [marketId]);
  const since = row?.maxts ?? 0;
  const recent = pts.slice(-60).filter((p) => p.t > since);
  let n = 0;
  for (const p of recent) {
    await db.run(
      `INSERT INTO market_prices (id, market_id, token_id, ts, price, source, created_at) VALUES (?,?,?,?,?,?,?)`,
      [newId("mp"), marketId, tokenId, p.t, p.p, source, nowIso()]
    );
    n++;
  }
  return n;
}

async function upsertTrader(address: string, handle: string | null, rank: number | null, pnl: number | null, vol: number | null, source: string): Promise<string> {
  const db = getDb();
  const existing = await db.get<{ id: string }>(`SELECT id FROM traders WHERE address=?`, [address]);
  const id = existing?.id ?? newId("tr");
  await db.run(
    `INSERT INTO traders (id, address, handle, rank, pnl, volume, source, data_quality_score, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(address) DO UPDATE SET handle=excluded.handle, rank=excluded.rank, pnl=excluded.pnl,
       volume=excluded.volume, source=excluded.source, updated_at=excluded.updated_at`,
    [id, address, handle, rank, pnl, vol, source, source === "sample" ? 0.8 : 1, nowIso(), nowIso()]
  );
  await db.run(
    `INSERT INTO trader_snapshots (id, trader_id, ts, rank, pnl, volume, source, data_quality_score, created_at) VALUES (?,?,?,?,?,?,?,?,?)`,
    [newId("trs"), id, nowIso(), rank, pnl, vol, source, source === "sample" ? 0.8 : 1, nowIso()]
  );
  return id;
}

export async function runIngest(): Promise<IngestResult> {
  await ensureSchema();
  const started = Date.now();
  const startedAt = nowIso();
  let mode: "live" | "sample" = "live";
  let markets: NormalizedMarket[] = [];

  try {
    markets = await poly.getMarkets({ limit: 80 });
    if (!markets.length) throw new Error("no markets returned");
  } catch (err) {
    if (!config.allowSampleFallback) throw err;
    await log.warn("ingest", "live markets fetch failed; using SAMPLE data", { error: String(err) });
    mode = "sample";
    markets = sample.sampleMarkets();
  }

  // sort by a tradeable-quality heuristic, keep top N
  markets = markets
    .filter((m) => m.active && !m.closed)
    .sort((a, b) => b.liquidity + b.volume / 100 - (a.liquidity + a.volume / 100))
    .slice(0, MAX_MARKETS);

  let books = 0;
  let pricePoints = 0;
  for (const m of markets) {
    await upsertMarket(m);
    if (!m.yesTokenId) continue;
    try {
      const book = mode === "live" ? await poly.getBook(m.yesTokenId) : sample.sampleBook(m, "YES");
      await storeBook(m.id, book);
      books++;
      // refine market microstructure from the live book if present
      if (book.bestBid != null) m.bestBid = book.bestBid;
      if (book.bestAsk != null) m.bestAsk = book.bestAsk;
      if (book.spread != null) m.spread = book.spread;
      if (book.midpoint != null) m.yesPrice = book.midpoint;
    } catch (err) {
      await log.warn("ingest", `book fetch failed for ${m.id}`, { error: String(err) });
    }
    try {
      const hist = mode === "live" ? await poly.getPricesHistory(m.yesTokenId, "1d", 10) : sample.samplePriceHistory(m);
      pricePoints += await storePrices(m.id, m.yesTokenId, hist, mode);
    } catch (err) {
      await log.warn("ingest", `price history failed for ${m.id}`, { error: String(err) });
    }
  }

  // --- traders / leaderboard / positions ---
  let traders = 0;
  let positions = 0;
  try {
    let leaders = mode === "live" ? await poly.getLeaderboard("WEEK", MAX_TRADERS) : sample.sampleLeaderboard();
    if (!leaders.length && config.allowSampleFallback) leaders = sample.sampleLeaderboard();
    leaders = leaders.slice(0, MAX_TRADERS);
    const db = getDb();
    for (const [i, l] of leaders.entries()) {
      const addr = l.proxyWallet || l.address;
      if (!addr) continue;
      const traderId = await upsertTrader(addr, l.name || l.pseudonym || null, l.rank ?? i + 1, l.pnl ?? null, l.volume ?? null, mode === "live" ? "leaderboard" : "sample");
      traders++;
      try {
        const pos = mode === "live" ? await poly.getPositions(addr) : sample.samplePositions(addr, markets);
        for (const p of pos) {
          if (!p.conditionId) continue;
          await db.run(
            `INSERT INTO trader_positions (id, trader_id, market_id, side, size, avg_price, ts, source, data_quality_score, created_at)
             VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [newId("tp"), traderId, p.conditionId, /yes/i.test(p.outcome || "") ? "YES" : "NO", p.size ?? null, p.avgPrice ?? null,
             nowIso(), mode === "live" ? "data-api" : "sample", mode === "live" ? 1 : 0.8, nowIso()]
          );
          positions++;
        }
      } catch (err) {
        await log.warn("ingest", `positions fetch failed for ${addr}`, { error: String(err) });
      }
    }
  } catch (err) {
    await log.warn("ingest", "leaderboard/positions ingest failed", { error: String(err) });
  }

  const result: IngestResult = {
    mode,
    markets: markets.length,
    books,
    pricePoints,
    traders,
    positions,
    startedAt,
    durationMs: Date.now() - started,
  };
  await log.info("ingest", `ingest complete (${mode})`, result);
  return result;
}
