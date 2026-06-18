/**
 * Central runtime configuration. All values are read from the environment with
 * safe defaults so the system runs with zero setup (local SQLite, sample data).
 *
 * Research tool only. Paper trading only. Not financial advice.
 */

function num(v: string | undefined, d: number): number {
  const n = v == null ? NaN : Number(v);
  return Number.isFinite(n) ? n : d;
}
function bool(v: string | undefined, d: boolean): boolean {
  if (v == null) return d;
  return ["1", "true", "yes", "on"].includes(v.toLowerCase());
}

export const config = {
  db: {
    driver: (process.env.DB_DRIVER || "sqlite").toLowerCase() as "sqlite" | "postgres",
    sqlitePath: process.env.SQLITE_PATH || "./data/polyalpha.db",
    databaseUrl: process.env.DATABASE_URL || "",
  },
  cronSecret: process.env.CRON_SECRET || "change-me-to-a-long-random-secret",
  poly: {
    gamma: (process.env.POLY_GAMMA_BASE || "https://gamma-api.polymarket.com").replace(/\/$/, ""),
    clob: (process.env.POLY_CLOB_BASE || "https://clob.polymarket.com").replace(/\/$/, ""),
    data: (process.env.POLY_DATA_BASE || "https://data-api.polymarket.com").replace(/\/$/, ""),
  },
  startingBankroll: num(process.env.STARTING_BANKROLL, 10_000),
  allowSampleFallback: bool(process.env.ALLOW_SAMPLE_FALLBACK, true),
  sentryDsn: process.env.SENTRY_DSN || "",
} as const;

/**
 * Risk + sizing constants. These are the lab's hard guardrails. The
 * self-learning engine may nudge *signal thresholds and strategy weights* but
 * is NEVER permitted to relax these caps (enforced in the risk engine).
 */
export const RISK = {
  defaultSizePct: 0.005, // 0.5% of bankroll
  strongSizePct: 0.01, // 1.0%
  exceptionalSizePct: 0.015, // 1.5%
  maxSinglePct: 0.02, // 2.0% absolute hard cap
  maxOpenExposurePct: 0.35, // 35%
  maxCategoryExposurePct: 0.12, // 12%
  maxCorrelatedExposurePct: 0.15, // 15%
  kellyFraction: 0.25, // fractional Kelly only; hard-capped by maxSinglePct
  // Exit rules
  stopLossPct: -0.15, // -15% of position value
  takeProfitPct: 0.25, // +25%
  trailingActivatePct: 0.15, // arm trailing stop after +15%
  trailingGivebackPct: 0.08, // give back 8% from peak
  // Microstructure acceptance gates
  maxSpread: 0.06, // 6 cents max acceptable bid/ask spread
  minLiquidity: 2_000, // min market liquidity (USD-ish, per Gamma) to trade
  slippagePenalty: 0.01, // 1 cent conservative slippage when no book side
  staleMinutes: 20, // data older than this is "stale"
  minSignalScore: 0.55, // ensemble score gate for entry [0..1]
  minStrategyWeight: 0.05, // below this a strategy is effectively disabled
} as const;

export const EXPERIMENT_DAYS = 7;
