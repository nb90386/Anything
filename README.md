# PolyAlpha Lab

**Autonomous Polymarket paper-trading research system.**

> ⚠️ **Research tool only. Paper trading only. Not financial advice.**
> No real funds. No private keys. No wallet signing. No CLOB order placement. No authenticated endpoints.
> Uses only **public, read-only** Polymarket data.

PolyAlpha Lab runs a fully autonomous 7-day experiment that tests whether a portfolio of
prediction-market strategies can produce positive **risk-adjusted** returns on Polymarket —
entirely with $10,000 of paper money. It ingests public market/trader/order-book data,
generates signals from 9 strategy families, blends them with a self-learning ensemble,
sizes positions with hard-capped fractional Kelly, paper-trades them with conservative
fills, marks to market, compares against 8 baselines, and writes daily + final reports.

---

## What you get

- **Live premium dashboard** (10 pages): Command Center, Live Signals, Open Positions,
  Closed Trades, Strategy Lab, Smart Wallets, Market Intelligence, Risk Center, Reports,
  System Health.
- **Autonomous runner** that resumes entirely from database state (crash/restart safe).
- **Real Polymarket public API client** (Gamma / CLOB / Data API) with retries + backoff.
- **9 strategies + ensemble meta-strategy** with dynamic, slowly-learned weights.
- **Risk engine** with fractional Kelly, hard position/exposure/category caps, no leverage.
- **8 baselines** to prove (or disprove) edge.
- **Self-learning** via Bayesian win-rate posteriors with anti-overfitting guards.
- **Zero-config local run** (SQLite) and **production Postgres/Supabase** with one env switch.

---

## Quick start (zero config, local)

```bash
npm install
npm run db:migrate     # creates ./data/polyalpha.db (SQLite)
npm run db:seed 6      # start an experiment + run 6 ticks to populate the dashboard
npm run dev            # http://localhost:3000
```

Then open the dashboard, press **Run Tick Now** a few times (or run the continuous runner):

```bash
npm run runner         # ticks every TICK_MINUTES (default 10) forever, resumes from DB
```

> **Note on this build environment:** outbound network egress to `*.polymarket.com` is blocked
> here, so ingestion automatically falls back to a clearly-labeled **SAMPLE dataset**
> (`source="sample"`, purple banner in the UI). Deploy to Vercel / your machine (open egress)
> and it uses **live** Polymarket data with no code change.

---

## Architecture

```
Next.js 14 (App Router, RSC) ── premium dashboard (Tailwind glass UI, Recharts)
        │
        ├── /api/cron/tick   ← Vercel Cron / external scheduler (CRON_SECRET)
        ├── /api/control      ← start / pause / resume experiment
        │
   tick() orchestrator (src/lib/engine/experiment.ts)
        │  fully resumable from DB on every call
        ▼
   ingest → strategies(9) → ensemble → risk sizing → paper fills →
   mark-to-market/exits → baselines(8) → portfolio snapshot →
   self-learning → daily/final reports → heartbeat
        │
        ▼
   DB adapter (src/lib/db) ── SQLite (default) | Postgres/Supabase (DB_DRIVER=postgres)
```

| Layer | File(s) |
|---|---|
| Config + risk guardrails | `src/lib/config.ts` |
| DB adapter + portable schema | `src/lib/db/` |
| Polymarket client (retry/backoff/health) | `src/lib/poly/` |
| Ingestion (+ sample fallback) | `src/lib/ingest.ts` |
| Strategies | `src/lib/engine/strategies.ts` |
| Ensemble + gates | `src/lib/engine/ensemble.ts` |
| Risk sizing + caps | `src/lib/engine/risk.ts` |
| Paper trading + P/L | `src/lib/engine/paper.ts` |
| Baselines | `src/lib/engine/baselines.ts` |
| Self-learning | `src/lib/engine/learning.ts` |
| Reports | `src/lib/engine/reports.ts` |
| Orchestrator / runner | `src/lib/engine/experiment.ts`, `scripts/runner.ts` |

See **RESEARCH.md** for verified API endpoints/schemas and the quant/microstructure background.

---

## Strategies

1. **Top-Trader Consensus** — ≥3 quality traders aligned, ≥2 same side, net of opposition.
2. **Smart-Wallet Momentum** — net PnL-weighted positioning of profitable wallets.
3. **Order-Book Imbalance** — bid/ask depth imbalance, thin-market guarded.
4. **Momentum / Breakout** — EMA5 vs EMA20 + slope, avoids price extremes.
5. **Mean Reversion** — fades z-score moves ≥1.8σ with widening spreads.
6. **Resolution Drift** — confident outcomes near resolution with tight spreads.
7. **Cross-Market Consistency** — narrow(subset) vs broad(superset) probability gaps.
8. **Liquidity / Spread Fade** — abnormally wide spreads with depth to exit.
9. **News / Event Reaction** — proxy: large single-step jump reversal (no scraping).
10. **Ensemble** — dynamic-weight blend with conflict penalty + entry gates.

**Entry gates:** active market, fresh data (<20m), valid price, spread ≤6¢, liquidity ≥$2k,
non-extreme price, ensemble score ≥0.55, risk checks pass.
**Exit rules:** resolution, −15% stop, +25% take-profit, trailing stop after +15%,
stale data, liquidity gone, experiment end. **Conservative pricing**: buy the ask, sell the
bid, else midpoint ± slippage penalty.

## Risk

`$10k` bankroll · default 0.5% / strong 1.0% / exceptional 1.5% · **hard cap 2.0%** per
position · max open exposure 35% · per-category 12% · correlated 15% · **fractional Kelly
(0.25×) hard-capped** · **no leverage** (impossible — cash-settled paper shares). These caps
live in `src/lib/config.ts`'s `RISK` and the self-learning engine can never relax them.

## Self-learning (anti-overfitting)

Beta(α,β) posteriors with a weak prior; decisions use the **lower** confidence bound, not the
point estimate; EMA-smoothed weight moves (≤20%/update) bounded `[2%, 28%]`; the prior
dominates below the minimum sample size; only realized (point-in-time) results are used.

## Baselines

No-trade cash · random eligible · equal-weight consensus · best-wallet copy · momentum-only ·
mean-reversion-only · buy-&-hold all signals · midpoint naive entry. The Command Center shows
exactly how many PolyAlpha is beating.

---

## Production deploy (Vercel + Supabase)

1. **Supabase**: create a project, run `supabase/migrations/0001_init.sql` (SQL editor).
2. **Vercel**: import the repo. Set env vars:
   - `DB_DRIVER=postgres`
   - `DATABASE_URL=postgres://...@db.<project>.supabase.co:5432/postgres`
   - `CRON_SECRET=<long random string>`
   - (optional) `STARTING_BANKROLL`, `ALLOW_SAMPLE_FALLBACK=false` for strict-live.
3. Deploy. `vercel.json` registers a cron hitting `/api/cron/tick` every 10 minutes.
4. Open the dashboard → **Start 7-Day Experiment**. It now runs unattended; each cron tick
   refreshes data, trades, learns, and writes reports. Restarting changes nothing — state is
   in Postgres.

**Alternative runner** (VPS/pm2/systemd, no Vercel cron): `TICK_MINUTES=10 npm run runner`.

### Environment variables

See `.env.example`. Defaults run locally on SQLite with sample fallback and no secrets.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run db:migrate` | create/upgrade schema |
| `npm run db:seed [n]` | start experiment + run `n` ticks |
| `npm run tick` | run one tick |
| `npm run runner` | continuous autonomous loop |
| `npm test` | unit tests (vitest) |
| `npm run typecheck` | TS check |
| `npm run build` | production build |

---

## Known limitations

- **Single-week sample size is small** — per-strategy verdicts are low-confidence by nature.
  This is surfaced honestly in the final report.
- **News/Event strategy is a price-jump proxy**, not real news ingestion (no scraping).
- **Cross-market consistency** uses keyword heuristics to pair broad/narrow markets, not a
  formal logical model of market relationships.
- **Sample mode** figures are synthetic and clearly labeled; only live deployments produce
  real metrics.
- Resolution outcomes are marked at last conservative price (markets resolve outside the
  window); no oracle of final settlement is assumed.

## Version 2 roadmap

- 4–8 week windows for meaningful confidence intervals.
- True walk-forward refit with held-out validation splits.
- Real historical fills/volume deltas for book + news strategies.
- Explicit correlated-resolution modeling beyond category proxies.
- Monte Carlo bootstrap of the trade sequence to bound equity-curve uncertainty.
- Redis/Upstash caching + Sentry wiring (stubs present).

---

Built as an autonomous research lab. **Paper trading only. Not financial advice.**
