/** Read/aggregate helpers over the persisted state. Used by engines + UI API. */
import { getDb, ensureSchema } from "@/lib/db";
import type { ExperimentRun, PaperPosition, StrategyId, Side } from "@/lib/types";

export interface MarketRow {
  id: string;
  slug: string;
  question: string;
  category: string;
  yes_token_id: string | null;
  no_token_id: string | null;
  active: number;
  closed: number;
  end_date: string | null;
  volume: number;
  liquidity: number;
  source: string;
  data_quality_score: number;
  updated_at: string;
}

export interface BookRow {
  market_id: string;
  best_bid: number | null;
  best_ask: number | null;
  midpoint: number | null;
  spread: number | null;
  bid_depth: number;
  ask_depth: number;
  ts: string;
  source: string;
  data_quality_score: number;
}

export interface ConsensusRow {
  market_id: string;
  side: Side;
  trader_count: number;
  avg_rank: number;
  total_size: number;
}

export interface MarketView {
  market: MarketRow;
  book: BookRow | null;
  priceSeries: number[];
  yesConsensus: ConsensusSide;
  noConsensus: ConsensusSide;
  ageMinutes: number;
}

export interface ConsensusSide {
  count: number;
  avgRank: number;
  size: number;
  sumPnl: number;
}

export async function getActiveExperiment(): Promise<ExperimentRun | undefined> {
  await ensureSchema();
  const db = getDb();
  return db.get<ExperimentRun>(
    `SELECT * FROM experiment_runs WHERE status IN ('RUNNING','PAUSED') ORDER BY created_at DESC LIMIT 1`
  );
}

export async function getLatestExperiment(): Promise<ExperimentRun | undefined> {
  await ensureSchema();
  const db = getDb();
  return db.get<ExperimentRun>(`SELECT * FROM experiment_runs ORDER BY created_at DESC LIMIT 1`);
}

export async function latestBook(marketId: string): Promise<BookRow | null> {
  const db = getDb();
  const r = await db.get<BookRow>(
    `SELECT * FROM market_orderbooks WHERE market_id=? ORDER BY ts DESC LIMIT 1`,
    [marketId]
  );
  return r ?? null;
}

export async function priceSeries(marketId: string, limit = 80): Promise<number[]> {
  const db = getDb();
  const rows = await db.all<{ price: number }>(
    `SELECT price FROM market_prices WHERE market_id=? ORDER BY ts DESC LIMIT ?`,
    [marketId, limit]
  );
  return rows.map((r) => r.price).reverse();
}

/** Aggregate top-trader positions per market+side for consensus strategies. */
export async function marketConsensus(marketId: string): Promise<Record<Side, ConsensusSide>> {
  const db = getDb();
  const rows = await db.all<{ side: Side; cnt: number; avgrank: number; sz: number; pnl: number }>(
    `SELECT tp.side AS side, COUNT(*) AS cnt, AVG(COALESCE(t.rank, 999)) AS avgrank,
            SUM(COALESCE(tp.size,0)) AS sz, SUM(COALESCE(t.pnl,0)) AS pnl
     FROM trader_positions tp JOIN traders t ON t.id = tp.trader_id
     WHERE tp.market_id=?
     GROUP BY tp.side`,
    [marketId]
  );
  const out: Record<Side, ConsensusSide> = {
    YES: { count: 0, avgRank: 999, size: 0, sumPnl: 0 },
    NO: { count: 0, avgRank: 999, size: 0, sumPnl: 0 },
  };
  for (const r of rows) {
    if (r.side === "YES" || r.side === "NO") out[r.side] = { count: r.cnt, avgRank: r.avgrank, size: r.sz, sumPnl: r.pnl };
  }
  return out;
}

export async function buildMarketViews(limit = 40): Promise<MarketView[]> {
  await ensureSchema();
  const db = getDb();
  const markets = await db.all<MarketRow>(
    `SELECT * FROM markets WHERE active=1 AND closed=0 ORDER BY (liquidity + volume/100.0) DESC LIMIT ?`,
    [limit]
  );
  const views: MarketView[] = [];
  for (const m of markets) {
    const book = await latestBook(m.id);
    const series = await priceSeries(m.id);
    const cons = await marketConsensus(m.id);
    const ageMinutes = book ? (Date.now() - new Date(book.ts).getTime()) / 60000 : Infinity;
    views.push({
      market: m,
      book,
      priceSeries: series,
      yesConsensus: cons.YES,
      noConsensus: cons.NO,
      ageMinutes,
    });
  }
  return views;
}

export async function getOpenPositions(experimentId: string): Promise<PaperPosition[]> {
  const db = getDb();
  return db.all<PaperPosition>(
    `SELECT * FROM paper_positions WHERE experiment_id=? AND status='OPEN' ORDER BY opened_at DESC`,
    [experimentId]
  );
}
export async function getClosedPositions(experimentId: string, limit = 200): Promise<PaperPosition[]> {
  const db = getDb();
  return db.all<PaperPosition>(
    `SELECT * FROM paper_positions WHERE experiment_id=? AND status='CLOSED' ORDER BY closed_at DESC LIMIT ?`,
    [experimentId, limit]
  );
}

export interface StrategyStateRow {
  id: string;
  experiment_id: string;
  strategy: StrategyId;
  weight: number;
  threshold: number;
  wins: number;
  losses: number;
  trades: number;
  realized_pl: number;
  enabled: number;
}
export async function getStrategyStates(experimentId: string): Promise<StrategyStateRow[]> {
  const db = getDb();
  return db.all<StrategyStateRow>(`SELECT * FROM strategy_state WHERE experiment_id=?`, [experimentId]);
}

export async function latestPortfolio(experimentId: string) {
  const db = getDb();
  return db.get<any>(
    `SELECT * FROM portfolio_snapshots WHERE experiment_id=? ORDER BY ts DESC LIMIT 1`,
    [experimentId]
  );
}

export async function isSampleMode(): Promise<boolean> {
  const db = getDb();
  const r = await db.get<{ c: number }>(`SELECT COUNT(*) AS c FROM markets WHERE source='sample'`);
  const live = await db.get<{ c: number }>(`SELECT COUNT(*) AS c FROM markets WHERE source!='sample'`);
  return (r?.c ?? 0) > 0 && (live?.c ?? 0) === 0;
}
