# TESTING.md — PolyAlpha Lab

Research tool only. Paper trading only. Not financial advice.

## How to run

```bash
npm run typecheck     # strict TS, 0 errors
npm test              # vitest unit suite
npm run build         # production build
npm run db:migrate && npm run db:seed 6   # end-to-end engine exercise
```

## Automated unit tests (`tests/engine.test.ts`) — 23 tests, all passing

| Area | What is asserted |
|---|---|
| Indicators | `mean`/`std`, `maxDrawdown` (negative on drop, 0 on monotonic rise), `sharpeLike` (0 with no variance), `betaPosterior` (shrinks to prior with few samples; lower bound < mean; tighter bound with more data), `bookImbalance` bounded `[-1,1]`, `zScore` outlier detection + zero-variance guard |
| Risk sizing | never exceeds absolute single-position cap (2%); tier scales with conviction (default→strong→exceptional); liquidity throttle (≤1% of liquidity); non-negative Kelly |
| Risk limits | blocks on open-exposure breach; blocks on category-cap breach; allows within caps |
| Conservative pricing | YES buys ask / sells bid; NO uses `1−bid` / `1−ask`; slippage penalty when a book side is missing; entry ≥ exit (spread cost) |
| Ensemble gating | accepts strong signal in healthy market; rejects wide spread; rejects low liquidity; rejects weak score below entry gate |
| Paper P/L | realized P/L = `(exit − entry) × shares`; price clamp bounds |

## End-to-end engine exercise (verified)

`npm run db:seed 6` against SQLite produced real, persisted behavior:

- Ingestion fell back to **SAMPLE** data (network egress blocked) and logged the warning.
- 49–64 strategy signals/tick; 5–15 ensemble-eligible after gates.
- Risk-checked entries opened across sizing tiers ($40–$150) and **tapered as exposure caps
  filled** (opens went 5 → 6 → 3 → 1 → 0 as the 35% cap approached).
- Conservative fills produced the expected immediate spread cost on mark-to-market.
- Baselines, portfolio snapshots, and 10–18 self-learning weight/threshold updates/tick.
- Daily report generated; experiment + strategy state persisted (resume verified by
  re-running `tick` — it continued the same experiment id).

## Manual QA — dashboard (verified via `npm start` + HTTP probes)

| Page | Result |
|---|---|
| `/` Command Center | 200 · renders KPIs, equity chart, strategy leaderboard, baseline comparison, controls |
| `/signals` | 200 · ensemble signals with accept/reject reasons + contributions |
| `/positions` | 200 · open positions, conservative marks, stop/TP, decay |
| `/closed` | 200 · trade history + exit reason + mistake analysis |
| `/strategies` | 200 · weights, Bayesian win-rate CIs, learning log |
| `/wallets` | 200 · tracked leaderboard wallets + holdings |
| `/markets` | 200 · liquidity/spread/sparkline/order-book snapshot |
| `/risk` | 200 · exposure by category, limit status, sizing decisions |
| `/reports` | 200 · daily reports + final verdict (when complete) |
| `/health` | 200 · API hosts, heartbeats, freshness, logs |
| `POST /api/cron/tick` | 200 · `{ ok, status:"RUNNING", signals, eligible, portfolioValue, ... }` |
| Disclaimer | present on every page ("Paper trading only … Not financial advice") |

## Crash / restart recovery

All state (experiment, positions, weights, snapshots, reports) lives in the DB. The runner and
cron call the same idempotent `tick()`; a killed process resumes on the next tick with no loss.
`initStrategyStates` runs on every tick/resume as a safety net. Verified by stopping the server
mid-run and re-invoking the tick — the same experiment continued and positions were re-marked.

## Not covered / future test work

- Live-API contract tests (blocked by egress here; client shapes verified against RESEARCH.md).
- Postgres adapter is covered by the shared SQL path but exercised here on SQLite; run
  `DB_DRIVER=postgres npm run db:migrate` against a real Supabase instance before production.
