/**
 * Self-Learning engine (Self-Learning Agent). Adjusts strategy WEIGHTS and entry
 * THRESHOLDS slowly, using Bayesian win-rate estimates with conservative lower
 * confidence bounds and minimum-sample guards. It NEVER touches risk caps and
 * never enables real trading.
 *
 * Anti-overfitting principles applied here:
 *  - Beta(α,β) posterior with a weak prior so a few lucky wins can't spike a weight.
 *  - Decisions use the LOWER confidence bound, not the point estimate.
 *  - Weight moves are EMA-smoothed (max ~20% step) and bounded [floor, cap].
 *  - Below MIN_SAMPLE trades, the prior dominates (little movement).
 *  - Only realized (closed, point-in-time) results are used — no future data.
 */
import { getDb, newId, nowIso } from "@/lib/db";
import { STRATEGIES } from "@/lib/types";
import { RISK } from "@/lib/config";
import { betaPosterior, clamp } from "@/lib/engine/indicators";
import { log } from "@/lib/logger";
import type { StrategyId } from "@/lib/types";

const BASE_WEIGHT = 1 / STRATEGIES.length;
const MIN_SAMPLE = 6;
const STEP = 0.2; // EMA smoothing toward target
const WEIGHT_CAP = 0.28;
const WEIGHT_FLOOR = 0.02;
const BASE_THRESHOLD = 0.45;

export async function initStrategyStates(experimentId: string): Promise<void> {
  const db = getDb();
  for (const strategy of STRATEGIES) {
    const existing = await db.get<{ id: string }>(
      `SELECT id FROM strategy_state WHERE experiment_id=? AND strategy=?`,
      [experimentId, strategy]
    );
    if (existing) continue;
    const ts = nowIso();
    await db.run(
      `INSERT INTO strategy_state (id, experiment_id, strategy, weight, threshold, wins, losses, trades, realized_pl, enabled, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [newId("ss"), experimentId, strategy, BASE_WEIGHT, BASE_THRESHOLD, 0, 0, 0, 0, 1, ts, ts]
    );
  }
}

export async function runLearning(experimentId: string): Promise<{ updates: number }> {
  const db = getDb();
  const states = await db.all<{
    strategy: StrategyId;
    weight: number;
    threshold: number;
    wins: number;
    losses: number;
    trades: number;
    realized_pl: number;
  }>(`SELECT strategy, weight, threshold, wins, losses, trades, realized_pl FROM strategy_state WHERE experiment_id=?`, [experimentId]);
  if (!states.length) return { updates: 0 };

  // 1) compute a quality score per strategy from the conservative win-rate bound
  const targets = states.map((s) => {
    const post = betaPosterior(s.wins, s.losses);
    // quality blends the lower win-rate bound with realized-pl sign (risk-adjusted-ish)
    const plPerTrade = s.trades > 0 ? s.realized_pl / s.trades : 0;
    const plFactor = clamp(0.5 + plPerTrade / 40); // ±$40/trade maps to [0,1]
    const sampleConfidence = clamp(s.trades / (s.trades + MIN_SAMPLE)); // shrink toward prior when few trades
    const quality = post.lower * 0.6 + plFactor * 0.4;
    // blend toward neutral (0.5) when sample is small
    const blended = 0.5 + (quality - 0.5) * sampleConfidence;
    return { ...s, quality: blended, post };
  });

  // 2) target weights ∝ quality, normalized, then bounded
  const qSum = targets.reduce((s, t) => s + Math.max(t.quality, 0.01), 0);
  const updates: { strategy: StrategyId; field: string; oldV: number; newV: number; reason: string; sample: number }[] = [];

  let newWeights = targets.map((t) => {
    const rawTarget = (Math.max(t.quality, 0.01) / qSum); // sums to 1
    const target = clamp(rawTarget, WEIGHT_FLOOR, WEIGHT_CAP);
    // EMA smoothing toward target (slow)
    const moved = t.weight + STEP * (target - t.weight);
    return { strategy: t.strategy, weight: clamp(moved, WEIGHT_FLOOR, WEIGHT_CAP), prev: t.weight, t };
  });
  // renormalize so weights sum to 1
  const wSum = newWeights.reduce((s, x) => s + x.weight, 0);
  newWeights = newWeights.map((x) => ({ ...x, weight: +(x.weight / wSum).toFixed(4) }));

  const ts = nowIso();
  for (const nw of newWeights) {
    const enabled = nw.weight >= RISK.minStrategyWeight ? 1 : 0;
    // threshold: raise it when the strategy's lower win bound is poor; lower it when strong
    const desiredThreshold = clamp(BASE_THRESHOLD + (0.5 - nw.t.post.lower) * 0.3, 0.3, 0.7);
    const newThreshold = +(nw.t.threshold + STEP * (desiredThreshold - nw.t.threshold)).toFixed(4);

    if (Math.abs(nw.weight - nw.prev) > 0.0005) {
      updates.push({ strategy: nw.strategy, field: "weight", oldV: nw.prev, newV: nw.weight, reason: `Bayesian winLB=${nw.t.post.lower.toFixed(2)} over ${nw.t.trades} trades`, sample: nw.t.trades });
    }
    if (Math.abs(newThreshold - nw.t.threshold) > 0.0005) {
      updates.push({ strategy: nw.strategy, field: "threshold", oldV: nw.t.threshold, newV: newThreshold, reason: `adjust gate to winLB=${nw.t.post.lower.toFixed(2)}`, sample: nw.t.trades });
    }

    await db.run(
      `UPDATE strategy_state SET weight=?, threshold=?, enabled=?, updated_at=? WHERE experiment_id=? AND strategy=?`,
      [nw.weight, newThreshold, enabled, ts, experimentId, nw.strategy]
    );
  }

  for (const u of updates) {
    await db.run(
      `INSERT INTO self_learning_updates (id, experiment_id, ts, strategy, field, old_value, new_value, reason, sample_size, source, created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [newId("sl"), experimentId, ts, u.strategy, u.field, u.oldV, u.newV, u.reason, u.sample, "learning-engine", ts]
    );
  }
  if (updates.length) await log.info("learning", `applied ${updates.length} weight/threshold updates`);
  return { updates: updates.length };
}
