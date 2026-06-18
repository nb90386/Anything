/** Statistical + microstructure helpers used across strategies and analytics. */

export function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}
export function std(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
}
export function clamp(x: number, lo = 0, hi = 1): number {
  return Math.min(hi, Math.max(lo, x));
}
/** logistic squashing for turning unbounded scores into [0,1] */
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}
export function ema(xs: number[], period: number): number {
  if (!xs.length) return 0;
  const k = 2 / (period + 1);
  let e = xs[0];
  for (let i = 1; i < xs.length; i++) e = xs[i] * k + e * (1 - k);
  return e;
}
/** simple returns of a price series */
export function returns(xs: number[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < xs.length; i++) if (xs[i - 1] !== 0) out.push((xs[i] - xs[i - 1]) / xs[i - 1]);
  return out;
}
/** annualization-free Sharpe-like ratio: mean/std of a return series */
export function sharpeLike(rets: number[]): number {
  const s = std(rets);
  if (s === 0) return 0;
  return +(mean(rets) / s).toFixed(3);
}
/** max drawdown of an equity curve, returned as a negative fraction */
export function maxDrawdown(equity: number[]): number {
  let peak = -Infinity;
  let mdd = 0;
  for (const v of equity) {
    peak = Math.max(peak, v);
    if (peak > 0) mdd = Math.min(mdd, (v - peak) / peak);
  }
  return +mdd.toFixed(4);
}
export function pctChange(from: number, to: number): number {
  return from === 0 ? 0 : (to - from) / from;
}

/**
 * Bayesian win-rate estimate using a Beta(α,β) posterior with a weak prior.
 * Returns posterior mean and a conservative lower confidence bound (mean - z*sd),
 * which the self-learning engine uses so a few lucky wins don't spike a weight.
 */
export function betaPosterior(wins: number, losses: number, priorA = 2, priorB = 2) {
  const a = priorA + wins;
  const b = priorB + losses;
  const m = a / (a + b);
  const variance = (a * b) / ((a + b) ** 2 * (a + b + 1));
  const sd = Math.sqrt(variance);
  return { mean: m, sd, lower: clamp(m - 1.64 * sd), upper: clamp(m + 1.64 * sd) };
}

/** order-book imbalance in [-1,1]; positive favors YES (more bid pressure). */
export function bookImbalance(bidDepth: number, askDepth: number): number {
  const tot = bidDepth + askDepth;
  if (tot <= 0) return 0;
  return (bidDepth - askDepth) / tot;
}

/** z-score of the last value vs a trailing window */
export function zScore(series: number[]): number {
  if (series.length < 3) return 0;
  const hist = series.slice(0, -1);
  const m = mean(hist);
  const s = std(hist);
  if (s === 0) return 0;
  return (series[series.length - 1] - m) / s;
}
