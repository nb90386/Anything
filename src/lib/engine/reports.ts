/**
 * Report engine. Daily reports summarize each 24h window; the final report
 * renders the 7-day verdict vs baselines plus lessons and a v2 roadmap.
 */
import { getDb, newId, nowIso } from "@/lib/db";
import { computePortfolio } from "@/lib/engine/paper";
import { BASELINES, BASELINE_LABELS, type BaselineId } from "@/lib/engine/baselines";
import { STRATEGY_META } from "@/lib/types";

async function baselineReturns(experimentId: string): Promise<{ id: BaselineId; label: string; ret: number }[]> {
  const db = getDb();
  const out: { id: BaselineId; label: string; ret: number }[] = [];
  for (const b of BASELINES) {
    const row = await db.get<{ total_return_pct: number }>(
      `SELECT total_return_pct FROM baseline_snapshots WHERE experiment_id=? AND baseline=? ORDER BY ts DESC LIMIT 1`,
      [experimentId, b]
    );
    out.push({ id: b, label: BASELINE_LABELS[b], ret: row?.total_return_pct ?? 0 });
  }
  return out;
}

export async function generateDailyReport(experimentId: string, day: number, bankroll: number): Promise<void> {
  const db = getDb();
  const pf = await computePortfolio(experimentId, bankroll);
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const closedToday = await db.all<{ realized_pl: number; strategy: string; exit_reason: string }>(
    `SELECT realized_pl, strategy, exit_reason FROM paper_positions WHERE experiment_id=? AND status='CLOSED' AND closed_at>=?`,
    [experimentId, since]
  );
  const openedToday = await db.get<{ c: number }>(
    `SELECT COUNT(*) AS c FROM paper_positions WHERE experiment_id=? AND opened_at>=?`,
    [experimentId, since]
  );
  const states = await db.all<{ strategy: string; weight: number; wins: number; losses: number; realized_pl: number }>(
    `SELECT strategy, weight, wins, losses, realized_pl FROM strategy_state WHERE experiment_id=? ORDER BY realized_pl DESC`,
    [experimentId]
  );
  const baselines = await baselineReturns(experimentId);
  const beat = baselines.filter((b) => pf.totalReturnPct > b.ret).length;

  const realizedToday = closedToday.reduce((s, t) => s + (t.realized_pl ?? 0), 0);
  const wins = closedToday.filter((t) => (t.realized_pl ?? 0) > 0).length;
  const topStrat = states[0];

  const summary = [
    `Day ${day}: portfolio $${pf.totalValue.toLocaleString()} (${(pf.totalReturnPct * 100).toFixed(2)}% total return).`,
    `Today: ${openedToday?.c ?? 0} trades opened, ${closedToday.length} closed, realized $${realizedToday.toFixed(2)} (${wins}/${closedToday.length} winners).`,
    `Unrealized $${pf.unrealizedPl.toFixed(2)} across ${pf.openPositions} open positions; exposure ${(pf.exposurePct * 100).toFixed(1)}%.`,
    `Risk: max drawdown ${(pf.maxDrawdownPct * 100).toFixed(2)}%, Sharpe-like ${pf.sharpeLike}.`,
    topStrat ? `Top strategy by P/L: ${STRATEGY_META[topStrat.strategy as keyof typeof STRATEGY_META]?.label ?? topStrat.strategy} ($${topStrat.realized_pl.toFixed(2)}).` : "",
    `Beating ${beat}/${baselines.length} baselines.`,
  ].filter(Boolean).join(" ");

  const metrics = { portfolio: pf, baselines, states, closedToday: closedToday.length, realizedToday, beat };
  const ts = nowIso();
  const existing = await db.get<{ id: string }>(`SELECT id FROM daily_reports WHERE experiment_id=? AND day=?`, [experimentId, day]);
  if (existing) {
    await db.run(`UPDATE daily_reports SET ts=?, summary=?, metrics=? WHERE id=?`, [ts, summary, JSON.stringify(metrics), existing.id]);
  } else {
    await db.run(
      `INSERT INTO daily_reports (id, experiment_id, day, ts, summary, metrics, source, created_at) VALUES (?,?,?,?,?,?,?,?)`,
      [newId("dr"), experimentId, day, ts, summary, JSON.stringify(metrics), "report-engine", ts]
    );
  }
}

export async function generateFinalReport(experimentId: string, bankroll: number): Promise<void> {
  const db = getDb();
  const pf = await computePortfolio(experimentId, bankroll);
  const baselines = await baselineReturns(experimentId);
  const beat = baselines.filter((b) => pf.totalReturnPct > b.ret).length;
  const states = await db.all<{ strategy: string; weight: number; wins: number; losses: number; trades: number; realized_pl: number }>(
    `SELECT strategy, weight, wins, losses, trades, realized_pl FROM strategy_state WHERE experiment_id=? ORDER BY realized_pl DESC`,
    [experimentId]
  );
  const best = states[0];
  const worst = states[states.length - 1];

  let verdict: string;
  if (pf.totalReturnPct > 0 && beat >= 6) verdict = "PROMISING — positive risk-adjusted return and beat the majority of baselines.";
  else if (pf.totalReturnPct > 0) verdict = "INCONCLUSIVE-POSITIVE — positive return but did not clearly dominate baselines.";
  else if (beat >= 5) verdict = "INCONCLUSIVE — negative return but outperformed most naive baselines (defensive value).";
  else verdict = "NOT VALIDATED — did not produce positive risk-adjusted returns over the window.";

  const summary = [
    `7-day result: $${pf.totalValue.toLocaleString()} from $${bankroll.toLocaleString()} (${(pf.totalReturnPct * 100).toFixed(2)}%).`,
    `Realized $${pf.realizedPl.toFixed(2)}, unrealized $${pf.unrealizedPl.toFixed(2)}, win rate ${(pf.winRate * 100).toFixed(1)}%.`,
    `Max drawdown ${(pf.maxDrawdownPct * 100).toFixed(2)}%, Sharpe-like ${pf.sharpeLike}. Beat ${beat}/${baselines.length} baselines.`,
  ].join(" ");

  const lessons = [
    best ? `Best contributor: ${STRATEGY_META[best.strategy as keyof typeof STRATEGY_META]?.label ?? best.strategy} (P/L $${best.realized_pl.toFixed(2)}, ${best.wins}W/${best.losses}L).` : "",
    worst ? `Weakest: ${STRATEGY_META[worst.strategy as keyof typeof STRATEGY_META]?.label ?? worst.strategy} (P/L $${worst.realized_pl.toFixed(2)}).` : "",
    "Sample sizes over a single week are small — treat all per-strategy verdicts as low-confidence and prone to noise.",
    "Conservative entry/exit (ask-in, bid-out, slippage penalty) materially reduces edge vs naive midpoint baselines; that gap is the realistic cost of trading.",
  ].filter(Boolean);

  const v2 = [
    "Extend the window to 4–8 weeks for statistically meaningful per-strategy confidence intervals.",
    "Add real walk-forward re-fitting with a held-out validation split rather than only live weight nudging.",
    "Incorporate true historical fills/volume deltas for the news-reaction and order-book strategies.",
    "Model correlated resolution risk explicitly (events that resolve together) beyond category proxies.",
    "Add Monte Carlo bootstrap of the trade sequence to bound the equity-curve uncertainty.",
  ];

  const metrics = { portfolio: pf, baselines, states, beat };
  const ts = nowIso();
  const existing = await db.get<{ id: string }>(`SELECT id FROM final_reports WHERE experiment_id=?`, [experimentId]);
  if (existing) {
    await db.run(`UPDATE final_reports SET ts=?, verdict=?, summary=?, metrics=?, lessons=?, v2_roadmap=? WHERE id=?`,
      [ts, verdict, summary, JSON.stringify(metrics), JSON.stringify(lessons), JSON.stringify(v2), existing.id]);
  } else {
    await db.run(
      `INSERT INTO final_reports (id, experiment_id, ts, verdict, summary, metrics, lessons, v2_roadmap, source, created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [newId("fr"), experimentId, ts, verdict, summary, JSON.stringify(metrics), JSON.stringify(lessons), JSON.stringify(v2), "report-engine", ts]
    );
  }
}
