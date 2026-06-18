/**
 * Experiment orchestrator + autonomous tick (Reliability + orchestration).
 *
 * One `tick()` is the unit of autonomous work. It is idempotent-ish and fully
 * resumable: all state (experiment, positions, weights, snapshots) lives in the
 * DB, so a crashed/restarted process simply calls tick() again and continues.
 *
 * PAPER TRADING ONLY. No real orders, no signing, no funds.
 */
import { getDb, ensureSchema, newId, nowIso } from "@/lib/db";
import { config, RISK, EXPERIMENT_DAYS } from "@/lib/config";
import { log, heartbeat } from "@/lib/logger";
import { runIngest } from "@/lib/ingest";
import { buildMarketViews, getActiveExperiment, getStrategyStates, getOpenPositions } from "@/lib/repo";
import { generateSignals } from "@/lib/engine/strategies";
import { buildEnsemble } from "@/lib/engine/ensemble";
import { computeSizing, checkRiskLimits, conservativeEntryPrice } from "@/lib/engine/risk";
import { openPosition, markToMarket, snapshotPortfolio, computePortfolio } from "@/lib/engine/paper";
import { runBaselines, bestWalletPicks } from "@/lib/engine/baselines";
import { initStrategyStates, runLearning } from "@/lib/engine/learning";
import { generateDailyReport, generateFinalReport } from "@/lib/engine/reports";
import type { ExperimentRun } from "@/lib/types";

const MAX_CONCURRENT_POSITIONS = 25;
const MIN_TRADE_USD = 5;

export async function getSetting(key: string): Promise<string | undefined> {
  await ensureSchema();
  const db = getDb();
  const r = await db.get<{ value: string }>(`SELECT value FROM system_settings WHERE key=?`, [key]);
  return r?.value;
}
export async function setSetting(key: string, value: string): Promise<void> {
  await ensureSchema();
  const db = getDb();
  const ts = nowIso();
  await db.run(
    `INSERT INTO system_settings (id, key, value, source, created_at, updated_at) VALUES (?,?,?,?,?,?)
     ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at`,
    [newId("set"), key, value, "system", ts, ts]
  );
}

export async function startExperiment(bankroll = config.startingBankroll): Promise<ExperimentRun> {
  await ensureSchema();
  const db = getDb();
  const existing = await getActiveExperiment();
  if (existing) {
    if (existing.status === "PAUSED") return resumeExperiment();
    return existing;
  }
  const id = newId("exp");
  const start = new Date();
  const end = new Date(start.getTime() + EXPERIMENT_DAYS * 86400000);
  const ts = nowIso();
  await db.run(
    `INSERT INTO experiment_runs (id, status, starting_bankroll, start_at, planned_end_at, current_day, source, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [id, "RUNNING", bankroll, start.toISOString(), end.toISOString(), 1, "system", ts, ts]
  );
  await initStrategyStates(id);
  await setSetting("starting_bankroll", String(bankroll));
  await log.info("experiment", `started experiment ${id} (bankroll $${bankroll}, ${EXPERIMENT_DAYS}d)`);
  return (await db.get<ExperimentRun>(`SELECT * FROM experiment_runs WHERE id=?`, [id]))!;
}

export async function pauseExperiment(): Promise<ExperimentRun | undefined> {
  const db = getDb();
  const exp = await getActiveExperiment();
  if (!exp || exp.status !== "RUNNING") return exp;
  await db.run(`UPDATE experiment_runs SET status='PAUSED', updated_at=? WHERE id=?`, [nowIso(), exp.id]);
  await log.info("experiment", `paused experiment ${exp.id}`);
  return db.get<ExperimentRun>(`SELECT * FROM experiment_runs WHERE id=?`, [exp.id]);
}

export async function resumeExperiment(): Promise<ExperimentRun> {
  const db = getDb();
  const exp = await getActiveExperiment();
  if (!exp) return startExperiment();
  await db.run(`UPDATE experiment_runs SET status='RUNNING', updated_at=? WHERE id=?`, [nowIso(), exp.id]);
  await initStrategyStates(exp.id); // resume safety
  await log.info("experiment", `resumed experiment ${exp.id}`);
  return (await db.get<ExperimentRun>(`SELECT * FROM experiment_runs WHERE id=?`, [exp.id]))!;
}

async function finalize(exp: ExperimentRun, bankroll: number) {
  const db = getDb();
  // close everything at conservative price, end-of-experiment
  await markToMarket(exp.id, true);
  await snapshotPortfolio(exp.id, bankroll);
  await generateFinalReport(exp.id, bankroll);
  await db.run(`UPDATE experiment_runs SET status='COMPLETED', ended_at=?, updated_at=? WHERE id=?`, [nowIso(), nowIso(), exp.id]);
  await log.info("experiment", `experiment ${exp.id} COMPLETED`);
}

export interface TickResult {
  ok: boolean;
  status: string;
  experimentId?: string;
  day?: number;
  mode?: "live" | "sample";
  signals?: number;
  eligible?: number;
  opened?: number;
  closed?: number;
  portfolioValue?: number;
  durationMs: number;
  message?: string;
}

export async function tick(): Promise<TickResult> {
  const started = Date.now();
  await ensureSchema();
  const exp = await getActiveExperiment();
  if (!exp) {
    await heartbeat("tick", true, Date.now() - started, { skipped: "no active experiment" });
    return { ok: true, status: "NO_EXPERIMENT", durationMs: Date.now() - started, message: "No active experiment. Start one from the Command Center." };
  }
  const bankroll = exp.starting_bankroll || config.startingBankroll;

  // recovery-safe: ensure strategy states exist
  await initStrategyStates(exp.id);

  // time bookkeeping
  const now = Date.now();
  const elapsedDays = (now - new Date(exp.start_at).getTime()) / 86400000;
  const day = Math.min(EXPERIMENT_DAYS, Math.floor(elapsedDays) + 1);
  const ended = now >= new Date(exp.planned_end_at).getTime();

  if (exp.status === "PAUSED") {
    await heartbeat("tick", true, Date.now() - started, { skipped: "paused" });
    return { ok: true, status: "PAUSED", experimentId: exp.id, day, durationMs: Date.now() - started };
  }

  try {
    // 1) refresh data
    const ingest = await runIngest();

    // 2) build views + signals
    const views = await buildMarketViews(40);
    const signals = generateSignals(views);
    const db = getDb();
    const ts = nowIso();
    for (const s of signals) {
      await db.run(
        `INSERT INTO strategy_signals (id, experiment_id, strategy, market_id, side, score, confidence, rationale, evidence, ts, source, data_quality_score, created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [newId("sig"), exp.id, s.strategy, s.marketId, s.side, s.score, s.confidence, s.rationale, JSON.stringify(s.evidence), ts, "strategy-engine", 1, ts]
      );
    }

    // 3) ensemble
    const states = await getStrategyStates(exp.id);
    const ensemble = buildEnsemble(signals, states, views);
    for (const e of ensemble) {
      await db.run(
        `INSERT INTO ensemble_signals (id, experiment_id, market_id, side, ensemble_score, top_strategy, eligible, reasons, contributions, ts, source, data_quality_score, created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [newId("ens"), exp.id, e.marketId, e.side, e.ensembleScore, e.topStrategy, e.eligible ? 1 : 0, JSON.stringify(e.reasons), JSON.stringify(e.contributions), ts, "ensemble", 1, ts]
      );
    }

    // 4) entries (only if experiment not ending)
    let opened = 0;
    const viewMap = new Map(views.map((v) => [v.market.id, v]));
    if (!ended) {
      const open = await getOpenPositions(exp.id);
      const openMarketIds = new Set(open.map((p) => p.market_id));
      let openCount = open.length;
      for (const e of ensemble.filter((x) => x.eligible)) {
        if (openCount >= MAX_CONCURRENT_POSITIONS) break;
        if (openMarketIds.has(e.marketId)) continue; // one position per market
        const v = viewMap.get(e.marketId);
        if (!v) continue;
        const yesPx = v.book?.midpoint ?? v.priceSeries.at(-1) ?? 0.5;
        const entryPrice = conservativeEntryPrice(e.side, v.book?.midpoint ?? null, v.book?.best_ask ?? null, v.book?.best_bid ?? null, yesPx);
        const sizing = computeSizing({ ensembleScore: e.ensembleScore, costPrice: entryPrice, bankroll, liquidity: v.market.liquidity, spread: v.book?.spread ?? null });
        if (sizing.sizeUsd < MIN_TRADE_USD) continue;
        const freshOpen = await getOpenPositions(exp.id);
        const risk = checkRiskLimits({ bankroll, proposedUsd: sizing.sizeUsd, category: v.market.category, openPositions: freshOpen });
        // persist a risk snapshot for this decision
        await db.run(
          `INSERT INTO risk_snapshots (id, experiment_id, ts, exposure_pct, category_exposure, correlated_exposure, worst_case_loss, drawdown_pct, limits_ok, detail, source, created_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
          [newId("rk"), exp.id, ts, risk.exposurePct, JSON.stringify({ [v.market.category]: risk.categoryExposurePct }), risk.categoryExposurePct, -sizing.sizeUsd, 0, risk.ok ? 1 : 0, JSON.stringify({ market: e.marketId, reasons: risk.reasons, sizing }), "risk-engine", ts]
        );
        if (!risk.ok) continue;
        await openPosition({ experimentId: exp.id, view: v, signal: e, strategy: e.topStrategy, side: e.side, entryPrice, sizing });
        openMarketIds.add(e.marketId);
        openCount++;
        opened++;
      }
    }

    // 5) mark to market + exits
    const mtm = await markToMarket(exp.id, ended);

    // 6) baselines
    const bestPicks = await bestWalletPicks();
    await runBaselines(exp.id, bankroll, { views, signals, ensemble, bestWalletPositions: bestPicks });

    // 7) portfolio snapshot
    const pf = await snapshotPortfolio(exp.id, bankroll);

    // 8) self-learning (slow)
    await runLearning(exp.id);

    // 9) day rollover + reports
    await db.run(`UPDATE experiment_runs SET current_day=?, updated_at=? WHERE id=?`, [day, nowIso(), exp.id]);
    await generateDailyReport(exp.id, day, bankroll);

    if (ended) {
      await finalize(exp, bankroll);
    }

    const result: TickResult = {
      ok: true,
      status: ended ? "COMPLETED" : "RUNNING",
      experimentId: exp.id,
      day,
      mode: ingest.mode,
      signals: signals.length,
      eligible: ensemble.filter((e) => e.eligible).length,
      opened,
      closed: mtm.closed,
      portfolioValue: pf.totalValue,
      durationMs: Date.now() - started,
    };
    await heartbeat("tick", true, result.durationMs, result);
    return result;
  } catch (err) {
    await log.error("tick", "tick failed", { error: String(err) });
    await heartbeat("tick", false, Date.now() - started, { error: String(err) });
    return { ok: false, status: "ERROR", experimentId: exp.id, day, durationMs: Date.now() - started, message: String(err) };
  }
}
