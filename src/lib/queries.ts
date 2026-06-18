/** Read-side aggregation for the dashboard (server components). */
import { getDb, ensureSchema } from "@/lib/db";
import { getActiveExperiment, getLatestExperiment, isSampleMode } from "@/lib/repo";
import { BASELINES, BASELINE_LABELS } from "@/lib/engine/baselines";
import { EXPERIMENT_DAYS } from "@/lib/config";
import type { ExperimentRun } from "@/lib/types";

export async function pageContext(): Promise<{ exp: ExperimentRun | undefined; sample: boolean }> {
  await ensureSchema();
  const exp = (await getActiveExperiment()) ?? (await getLatestExperiment());
  const sample = await isSampleMode();
  return { exp, sample };
}

export async function commandCenter() {
  await ensureSchema();
  const db = getDb();
  const { exp, sample } = await pageContext();
  if (!exp) return { exp: null, sample, pf: null, equity: [], strategies: [], baselines: [], health: await healthSummary() };

  const pf = await db.get<any>(`SELECT * FROM portfolio_snapshots WHERE experiment_id=? ORDER BY ts DESC LIMIT 1`, [exp.id]);
  const snaps = await db.all<{ ts: string; total_value: number }>(
    `SELECT ts, total_value FROM portfolio_snapshots WHERE experiment_id=? ORDER BY ts ASC LIMIT 500`,
    [exp.id]
  );
  const equity = snaps.map((s) => ({ t: new Date(s.ts).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), v: s.total_value }));
  const strategies = await db.all<any>(
    `SELECT strategy, weight, wins, losses, trades, realized_pl, enabled FROM strategy_state WHERE experiment_id=? ORDER BY realized_pl DESC`,
    [exp.id]
  );
  const baselines = await baselineComparison(exp.id);
  return { exp, sample, pf, equity, strategies, baselines, health: await healthSummary() };
}

export async function baselineComparison(experimentId: string) {
  const db = getDb();
  const out: { id: string; label: string; ret: number; value: number }[] = [];
  for (const b of BASELINES) {
    const row = await db.get<{ total_return_pct: number; total_value: number }>(
      `SELECT total_return_pct, total_value FROM baseline_snapshots WHERE experiment_id=? AND baseline=? ORDER BY ts DESC LIMIT 1`,
      [experimentId, b]
    );
    out.push({ id: b, label: BASELINE_LABELS[b], ret: row?.total_return_pct ?? 0, value: row?.total_value ?? 0 });
  }
  return out.sort((a, b) => b.ret - a.ret);
}

export async function liveSignals() {
  const db = getDb();
  const { exp, sample } = await pageContext();
  if (!exp) return { exp: null, sample, signals: [] };
  // latest ensemble signal per market
  const rows = await db.all<any>(
    `SELECT e.*, m.question, m.category, m.liquidity FROM ensemble_signals e
     JOIN markets m ON m.id = e.market_id
     WHERE e.experiment_id=? AND e.ts = (SELECT MAX(ts) FROM ensemble_signals WHERE experiment_id=?)
     ORDER BY e.ensemble_score DESC`,
    [exp.id, exp.id]
  );
  return {
    exp,
    sample,
    signals: rows.map((r) => ({
      ...r,
      reasons: JSON.parse(r.reasons || "[]"),
      contributions: JSON.parse(r.contributions || "[]"),
    })),
  };
}

export async function openPositions() {
  const db = getDb();
  const { exp, sample } = await pageContext();
  if (!exp) return { exp: null, sample, positions: [] };
  const positions = await db.all<any>(
    `SELECT * FROM paper_positions WHERE experiment_id=? AND status='OPEN' ORDER BY opened_at DESC`,
    [exp.id]
  );
  return { exp, sample, positions: positions.map((p) => ({ ...p, evidence: safeParse(p.evidence) })) };
}

export async function closedTrades() {
  const db = getDb();
  const { exp, sample } = await pageContext();
  if (!exp) return { exp: null, sample, trades: [] };
  const trades = await db.all<any>(
    `SELECT * FROM paper_positions WHERE experiment_id=? AND status='CLOSED' ORDER BY closed_at DESC LIMIT 300`,
    [exp.id]
  );
  return { exp, sample, trades };
}

export async function strategyLab() {
  const db = getDb();
  const { exp, sample } = await pageContext();
  if (!exp) return { exp: null, sample, states: [] };
  const states = await db.all<any>(
    `SELECT * FROM strategy_state WHERE experiment_id=? ORDER BY weight DESC`,
    [exp.id]
  );
  const updates = await db.all<any>(
    `SELECT * FROM self_learning_updates WHERE experiment_id=? ORDER BY ts DESC LIMIT 40`,
    [exp.id]
  );
  return { exp, sample, states, updates };
}

export async function smartWallets() {
  const db = getDb();
  const { sample } = await pageContext();
  const traders = await db.all<any>(`SELECT * FROM traders ORDER BY COALESCE(pnl,0) DESC LIMIT 30`);
  const enriched = [];
  for (const t of traders) {
    const pos = await db.all<{ market_id: string; side: string; size: number }>(
      `SELECT market_id, side, size FROM trader_positions WHERE trader_id=? ORDER BY ts DESC LIMIT 8`,
      [t.id]
    );
    const score = await db.get<any>(`SELECT * FROM wallet_scores WHERE trader_id=? ORDER BY ts DESC LIMIT 1`, [t.id]);
    enriched.push({ ...t, positions: pos, score });
  }
  return { sample, traders: enriched };
}

export async function marketIntel() {
  const db = getDb();
  const { sample } = await pageContext();
  const markets = await db.all<any>(
    `SELECT * FROM markets WHERE active=1 AND closed=0 ORDER BY (liquidity + volume/100.0) DESC LIMIT 40`
  );
  const enriched = [];
  for (const m of markets) {
    const book = await db.get<any>(`SELECT * FROM market_orderbooks WHERE market_id=? ORDER BY ts DESC LIMIT 1`, [m.id]);
    const prices = await db.all<{ price: number }>(`SELECT price FROM market_prices WHERE market_id=? ORDER BY ts DESC LIMIT 60`, [m.id]);
    enriched.push({ ...m, book, series: prices.map((p) => p.price).reverse() });
  }
  return { sample, markets: enriched };
}

export async function riskCenter() {
  const db = getDb();
  const { exp, sample } = await pageContext();
  if (!exp) return { exp: null, sample, positions: [], byCategory: [], latestRisk: null, pf: null };
  const positions = await db.all<any>(`SELECT * FROM paper_positions WHERE experiment_id=? AND status='OPEN'`, [exp.id]);
  const pf = await db.get<any>(`SELECT * FROM portfolio_snapshots WHERE experiment_id=? ORDER BY ts DESC LIMIT 1`, [exp.id]);
  const catMap = new Map<string, number>();
  for (const p of positions) catMap.set(p.category, (catMap.get(p.category) || 0) + p.cost);
  const byCategory = [...catMap.entries()].map(([category, cost]) => ({ category, cost, pct: cost / exp.starting_bankroll })).sort((a, b) => b.cost - a.cost);
  const latestRisk = await db.get<any>(`SELECT * FROM risk_snapshots WHERE experiment_id=? ORDER BY ts DESC LIMIT 1`, [exp.id]);
  const decisions = await db.all<any>(`SELECT * FROM risk_snapshots WHERE experiment_id=? ORDER BY ts DESC LIMIT 20`, [exp.id]);
  return { exp, sample, positions, byCategory, latestRisk, pf, decisions };
}

export async function reports() {
  const db = getDb();
  const { exp, sample } = await pageContext();
  if (!exp) return { exp: null, sample, daily: [], final: null };
  const daily = await db.all<any>(`SELECT * FROM daily_reports WHERE experiment_id=? ORDER BY day DESC`, [exp.id]);
  const final = await db.get<any>(`SELECT * FROM final_reports WHERE experiment_id=? ORDER BY ts DESC LIMIT 1`, [exp.id]);
  return {
    exp,
    sample,
    daily,
    final: final ? { ...final, lessons: safeParse(final.lessons) || [], v2: safeParse(final.v2_roadmap) || [], metrics: safeParse(final.metrics) } : null,
  };
}

export async function healthSummary() {
  const db = getDb();
  await ensureSchema();
  const hosts = await db.all<any>(
    `SELECT host, MAX(created_at) AS last, SUM(ok) AS oks, COUNT(*) AS total FROM api_health_checks GROUP BY host`
  );
  const lastTick = await db.get<any>(`SELECT * FROM cron_heartbeats WHERE job='tick' ORDER BY created_at DESC LIMIT 1`);
  const tickCount = await db.get<{ c: number }>(`SELECT COUNT(*) AS c FROM cron_heartbeats WHERE job='tick'`);
  const errors = await db.all<any>(`SELECT * FROM system_logs WHERE level IN ('ERROR','WARN') ORDER BY created_at DESC LIMIT 25`);
  const lastIngest = await db.get<any>(`SELECT MAX(created_at) AS last FROM market_snapshots`);
  const staleMin = lastIngest?.last ? (Date.now() - new Date(lastIngest.last).getTime()) / 60000 : null;
  return { hosts, lastTick, tickCount: tickCount?.c ?? 0, errors, staleMin };
}

export async function systemHealth() {
  const db = getDb();
  const base = await healthSummary();
  const heartbeats = await db.all<any>(`SELECT * FROM cron_heartbeats ORDER BY created_at DESC LIMIT 30`);
  const logs = await db.all<any>(`SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 60`);
  const apiChecks = await db.all<any>(`SELECT * FROM api_health_checks ORDER BY created_at DESC LIMIT 30`);
  const { sample } = await pageContext();
  return { ...base, heartbeats, logs, apiChecks, sample };
}

export { EXPERIMENT_DAYS };

function safeParse(s: any) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
