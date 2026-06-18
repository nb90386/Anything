/**
 * Paper-trading engine (Paper Trading Agent). Simulates entries/exits, marks
 * positions to market at conservative prices, computes P/L, and snapshots the
 * portfolio. PAPER MONEY ONLY — no real orders, no signing, no funds.
 *
 * Accounting is fully reconstructable from the DB (resumable):
 *   cash       = bankroll + Σ realized_pl(closed) − Σ cost(open)
 *   open_value = Σ current_value(open)
 *   total      = cash + open_value
 */
import { getDb, newId, nowIso } from "@/lib/db";
import { RISK } from "@/lib/config";
import { log } from "@/lib/logger";
import { conservativeExitPrice } from "@/lib/engine/risk";
import { maxDrawdown, sharpeLike, clamp } from "@/lib/engine/indicators";
import { latestBook, priceSeries } from "@/lib/repo";
import type { PaperPosition, EnsembleSignal, StrategyId, Side, ExitReason } from "@/lib/types";
import type { MarketView } from "@/lib/repo";
import type { SizingResult } from "@/lib/engine/risk";

export async function openPosition(args: {
  experimentId: string;
  view: MarketView;
  signal: EnsembleSignal;
  strategy: StrategyId | "ENSEMBLE";
  side: Side;
  entryPrice: number;
  sizing: SizingResult;
}): Promise<PaperPosition> {
  const db = getDb();
  const { experimentId, view, signal, strategy, side, entryPrice, sizing } = args;
  const id = newId("pos");
  const cost = +(entryPrice * sizing.shares).toFixed(2);
  const stopPrice = +clamp(entryPrice * (1 + RISK.stopLossPct), 0.005, 0.995).toFixed(4);
  const takePrice = +clamp(entryPrice * (1 + RISK.takeProfitPct), 0.005, 0.995).toFixed(4);
  const evidence = JSON.stringify({
    ensembleScore: signal.ensembleScore,
    contributions: signal.contributions,
    reasons: signal.reasons,
    spread: view.book?.spread,
    liquidity: view.market.liquidity,
    modelProb: sizing.modelProb,
    tier: sizing.tier,
  });
  const ts = nowIso();
  await db.run(
    `INSERT INTO paper_positions (id, experiment_id, strategy, market_id, question, category, side, status, entry_price, shares, cost,
      entry_spread, entry_slippage, entry_liquidity, signal_score, risk_score, peak_value, stop_price, take_price,
      current_price, current_value, unrealized_pl, realized_pl, evidence, opened_at, source, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [id, experimentId, strategy, view.market.id, view.market.question, view.market.category, side, "OPEN",
     entryPrice, sizing.shares, cost, view.book?.spread ?? null, RISK.slippagePenalty, view.market.liquidity,
     signal.ensembleScore, sizing.riskScore, cost, stopPrice, takePrice, entryPrice, cost, 0, 0, evidence, ts, "paper-engine", ts, ts]
  );
  await db.run(
    `INSERT INTO paper_trade_events (id, experiment_id, position_id, type, price, shares, pl, reason, detail, ts, source, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [newId("ev"), experimentId, id, "OPEN", entryPrice, sizing.shares, 0, "entry", JSON.stringify({ strategy, tier: sizing.tier }), ts, "paper-engine", ts]
  );
  // bump strategy trade counter
  await db.run(`UPDATE strategy_state SET trades = trades + 1, updated_at=? WHERE experiment_id=? AND strategy=?`, [ts, experimentId, strategy]);
  await log.info("paper", `OPEN ${side} ${view.market.question.slice(0, 50)} @ ${entryPrice} ($${cost})`, { strategy, score: signal.ensembleScore });
  return (await db.get<PaperPosition>(`SELECT * FROM paper_positions WHERE id=?`, [id]))!;
}

export async function closePosition(p: PaperPosition, exitPrice: number, reason: ExitReason): Promise<void> {
  const db = getDb();
  const realized = +((exitPrice - p.entry_price) * p.shares).toFixed(2);
  const ts = nowIso();
  await db.run(
    `UPDATE paper_positions SET status='CLOSED', exit_price=?, exit_reason=?, current_price=?, current_value=?,
       unrealized_pl=0, realized_pl=?, closed_at=?, updated_at=? WHERE id=?`,
    [exitPrice, reason, exitPrice, +(exitPrice * p.shares).toFixed(2), realized, ts, ts, p.id]
  );
  await db.run(
    `INSERT INTO paper_trade_events (id, experiment_id, position_id, type, price, shares, pl, reason, detail, ts, source, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [newId("ev"), p.experiment_id, p.id, "CLOSE", exitPrice, p.shares, realized, reason, null, ts, "paper-engine", ts]
  );
  // update strategy win/loss + realized pl
  const win = realized > 0 ? 1 : 0;
  const loss = realized <= 0 ? 1 : 0;
  await db.run(
    `UPDATE strategy_state SET wins = wins + ?, losses = losses + ?, realized_pl = realized_pl + ?, updated_at=?
     WHERE experiment_id=? AND strategy=?`,
    [win, loss, realized, ts, p.experiment_id, p.strategy]
  );
  await log.info("paper", `CLOSE ${p.side} ${p.question.slice(0, 50)} @ ${exitPrice} (${reason}) P/L $${realized}`, { reason });
}

/** Mark all open positions to conservative exit price; trigger price-based exits. */
export async function markToMarket(experimentId: string, experimentEnding = false): Promise<{ updated: number; closed: number }> {
  const db = getDb();
  const open = await db.all<PaperPosition>(`SELECT * FROM paper_positions WHERE experiment_id=? AND status='OPEN'`, [experimentId]);
  let updated = 0;
  let closed = 0;
  for (const p of open) {
    const book = await latestBook(p.market_id);
    const series = await priceSeries(p.market_id, 5);
    const yesPx = book?.midpoint ?? series.at(-1) ?? p.entry_price;
    const market = await db.get<{ closed: number; active: number }>(`SELECT closed, active FROM markets WHERE id=?`, [p.market_id]);
    const bookAge = book ? (Date.now() - new Date(book.ts).getTime()) / 60000 : Infinity;

    const exitPrice = conservativeExitPrice(p.side, book?.midpoint ?? null, book?.best_bid ?? null, book?.best_ask ?? null, yesPx);
    const currentValue = +(exitPrice * p.shares).toFixed(2);
    const unrealized = +(currentValue - p.cost).toFixed(2);
    const plPct = p.cost > 0 ? (currentValue - p.cost) / p.cost : 0;
    const peakValue = Math.max(p.peak_value ?? p.cost, currentValue);
    const ts = nowIso();
    await db.run(
      `UPDATE paper_positions SET current_price=?, current_value=?, unrealized_pl=?, peak_value=?, updated_at=? WHERE id=?`,
      [exitPrice, currentValue, unrealized, peakValue, ts, p.id]
    );
    updated++;

    // ---- exit decisions (conservative) ----
    let reason: ExitReason | null = null;
    if (market?.closed === 1 || market?.active === 0) reason = "MARKET_RESOLVED";
    else if (experimentEnding) reason = "EXPERIMENT_END";
    else if (plPct <= RISK.stopLossPct) reason = "STOP_LOSS";
    else if (plPct >= RISK.takeProfitPct) reason = "TAKE_PROFIT";
    else if (bookAge > RISK.staleMinutes * 1.5 && book) reason = "STALE_DATA";
    else if (book?.spread != null && book.spread > RISK.maxSpread * 1.5) reason = "LIQUIDITY_GONE";
    else {
      // trailing stop: armed after +15%, exit if we give back from the peak
      const peakPct = p.cost > 0 ? (peakValue - p.cost) / p.cost : 0;
      if (peakPct >= RISK.trailingActivatePct) {
        const giveback = (peakValue - currentValue) / Math.max(peakValue, 0.0001);
        if (giveback >= RISK.trailingGivebackPct) reason = "TRAILING_STOP";
      }
    }
    if (reason) {
      await closePosition({ ...p, current_price: exitPrice, current_value: currentValue }, exitPrice, reason);
      closed++;
    }
  }
  return { updated, closed };
}

export interface PortfolioComputed {
  cash: number;
  openValue: number;
  totalValue: number;
  realizedPl: number;
  unrealizedPl: number;
  openPositions: number;
  exposurePct: number;
  totalReturnPct: number;
  maxDrawdownPct: number;
  winRate: number;
  sharpeLike: number;
}

export async function computePortfolio(experimentId: string, bankroll: number): Promise<PortfolioComputed> {
  const db = getDb();
  const open = await db.all<PaperPosition>(`SELECT * FROM paper_positions WHERE experiment_id=? AND status='OPEN'`, [experimentId]);
  const closed = await db.all<PaperPosition>(`SELECT realized_pl FROM paper_positions WHERE experiment_id=? AND status='CLOSED'`, [experimentId]);
  const realizedPl = +closed.reduce((s, p) => s + (p.realized_pl ?? 0), 0).toFixed(2);
  const openCost = +open.reduce((s, p) => s + p.cost, 0).toFixed(2);
  const openValue = +open.reduce((s, p) => s + (p.current_value ?? p.cost), 0).toFixed(2);
  const unrealizedPl = +(openValue - openCost).toFixed(2);
  const cash = +(bankroll + realizedPl - openCost).toFixed(2);
  const totalValue = +(cash + openValue).toFixed(2);
  const wins = closed.filter((p) => (p.realized_pl ?? 0) > 0).length;
  const winRate = closed.length ? +(wins / closed.length).toFixed(3) : 0;

  // equity curve from prior snapshots for drawdown + sharpe-like
  const snaps = await db.all<{ total_value: number }>(
    `SELECT total_value FROM portfolio_snapshots WHERE experiment_id=? ORDER BY ts ASC`,
    [experimentId]
  );
  const equity = [...snaps.map((s) => s.total_value), totalValue];
  const rets: number[] = [];
  for (let i = 1; i < equity.length; i++) if (equity[i - 1] > 0) rets.push((equity[i] - equity[i - 1]) / equity[i - 1]);

  return {
    cash,
    openValue,
    totalValue,
    realizedPl,
    unrealizedPl,
    openPositions: open.length,
    exposurePct: +clamp(openCost / bankroll, 0, 10).toFixed(4),
    totalReturnPct: +(((totalValue - bankroll) / bankroll)).toFixed(4),
    maxDrawdownPct: maxDrawdown(equity),
    winRate,
    sharpeLike: sharpeLike(rets),
  };
}

export async function snapshotPortfolio(experimentId: string, bankroll: number): Promise<PortfolioComputed> {
  const db = getDb();
  const pf = await computePortfolio(experimentId, bankroll);
  const ts = nowIso();
  await db.run(
    `INSERT INTO portfolio_snapshots (id, experiment_id, ts, cash, open_value, total_value, realized_pl, unrealized_pl,
       open_positions, exposure_pct, total_return_pct, max_drawdown_pct, win_rate, sharpe_like, source, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [newId("pf"), experimentId, ts, pf.cash, pf.openValue, pf.totalValue, pf.realizedPl, pf.unrealizedPl,
     pf.openPositions, pf.exposurePct, pf.totalReturnPct, pf.maxDrawdownPct, pf.winRate, pf.sharpeLike, "paper-engine", ts]
  );
  return pf;
}
