# Polymarket Public API Research (Read-Only)

**Purpose:** Reference for a paper-trading research system. Documents ONLY public / read-only endpoints. No authenticated or order-placement endpoints are covered here.

**Last researched:** 2026-06-18

**Verification legend:**
- ✅ VERIFIED — confirmed against official source code (py-clob-client), official docs, or multiple independent sources.
- ⚠️ UNVERIFIED — assumption / single-source / not confirmed against a live response. Engineers MUST validate before relying on it.

> NOTE ON METHOD: The live API hosts (`gamma-api`, `clob`, `data-api`) and `docs.polymarket.com` return HTTP 403 to automated fetchers/sandboxes (Cloudflare bot protection), so live JSON could not be dumped from this environment. Field names below are taken from the **official `py-clob-client` source code** (ground truth for CLOB paths/params) and from official docs + multiple independent client libraries. Validate with a real `curl` from an allow-listed host before coding against exact field names marked ⚠️.

---

## 0. Host Map (quick reference)

| Surface | Base URL | Auth for read? |
|---|---|---|
| Gamma (markets/events metadata) | `https://gamma-api.polymarket.com` | ✅ None |
| CLOB (order book, prices, price history) | `https://clob.polymarket.com` | ✅ None for read |
| Data API (positions/activity/trades/holders/value/leaderboard) | `https://data-api.polymarket.com` | ✅ None |

> ⚠️ Do NOT copy the path prefixes (`/gamma/`, `/clob/`, `/data/`) seen in the third-party `polymarket-kit` project — those are that project's local proxy routes, not the real upstream paths. The real upstream paths are listed below without those prefixes.

---

## 1. Gamma API — `https://gamma-api.polymarket.com`

Indexes on-chain market data and enriches it with metadata (categorization, indexed volume). Best surface for **discovering markets/events and their metadata**.

### 1.1 `GET /markets` ✅
Returns an array of market objects.

**Query params** (✅ unless noted):
| Param | Type | Notes |
|---|---|---|
| `limit` | int | Page size. Default ~20; max ~500. |
| `offset` | int | Pagination offset. |
| `active` | bool | `true`/`false`. |
| `closed` | bool | `true`/`false`. |
| `archived` | bool | ⚠️ |
| `order` | string | Sort field, e.g. `volume`, `volume_24hr`, `liquidity`, `start_date`, `end_date`. |
| `ascending` | bool | Sort direction. |
| `id` | int | Filter by market id (repeatable). |
| `slug` | string | Filter by slug. |
| `clob_token_ids` | string | Filter by CLOB token id(s). ✅ (param name is snake_case) |
| `condition_ids` | string | ⚠️ Filter by conditionId. |
| `tag_id` | int | Filter by tag/category id. |
| `related_tags` | bool | ⚠️ Include related tags. |
| `liquidity_num_min` / `liquidity_num_max` | num | ⚠️ |
| `volume_num_min` / `volume_num_max` | num | ⚠️ |
| `start_date_min` / `start_date_max` | ISO date | ⚠️ |
| `end_date_min` / `end_date_max` | ISO date | ⚠️ |

**Key response fields per market** (✅ names confirmed across docs + multiple clients):
- `id` (string/int) — Gamma internal market id
- `question` (string) — the market question
- `conditionId` (hex string) — on-chain CTF condition id
- `questionID` ⚠️ — UMA question id
- `slug` (string) — URL slug
- `clobTokenIds` (string — **JSON-encoded array string**, e.g. `"[\"123...\",\"456...\"]"`; parse it) ✅
- `outcomes` (string — JSON-encoded array string, e.g. `"[\"Yes\", \"No\"]"`) ✅
- `outcomePrices` (string — JSON-encoded array string, e.g. `"[\"0.62\", \"0.38\"]"`) ✅
- `volume` (string/number) — total volume
- `volume24hr` ⚠️ — 24h volume
- `liquidity` (string/number)
- `active` (bool)
- `closed` (bool)
- `archived` ⚠️ (bool)
- `endDate` (ISO 8601 string)
- `startDate` (ISO 8601 string)
- `acceptingOrders` ⚠️ (bool)
- `enableOrderBook` ⚠️ (bool)
- `negRisk` / `negativeRisk` ⚠️ (bool) — multi-outcome neg-risk market
- `image`, `icon` ⚠️ (string URLs)
- `description` ⚠️ (string)

> IMPORTANT GOTCHA ✅: `clobTokenIds`, `outcomes`, and `outcomePrices` are returned as **JSON-encoded strings**, not native arrays. You must `JSON.parse` / `json.loads` them.

### 1.2 `GET /events` ✅
Events group multiple related markets (e.g. one election event containing many candidate markets).

**Query params:** `limit`, `offset`, `order`, `ascending`, `id`, `slug`, `archived`, `active`, `closed`, `tag`, `tag_id`, `tag_slug` ⚠️, `related_tags` ⚠️, `series_id` ⚠️, `liquidity_min`/`liquidity_max` ⚠️, `volume_min`/`volume_max` ⚠️, `start_date_min`/`max`, `end_date_min`/`max`.

**Response:** array of event objects. Each event has `id`, `slug`, `title` ⚠️, `description` ⚠️, `startDate`, `endDate`, `active`, `closed`, `volume`, `liquidity`, and a nested **`markets`** array whose elements have the same shape as §1.1.

### 1.3 Other Gamma helpers ⚠️
- `GET /tags` — list categories/tags.
- `GET /sports` — sports metadata.

### Example working URLs (Gamma)
```
https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=5&order=volume&ascending=false
https://gamma-api.polymarket.com/events?slug=fed-decision-in-october
https://gamma-api.polymarket.com/markets?clob_token_ids=<TOKEN_ID>
```

---

## 2. CLOB API — `https://clob.polymarket.com`

Everything keys off a **`token_id`** = per-outcome ERC-1155 asset id. A binary market has TWO token ids (Yes and No), each with its own order book. Get token ids from Gamma's `clobTokenIds`.

> Paths below are taken verbatim from the official `py_clob_client/endpoints.py` ✅.

### 2.1 Order book
- `GET /book?token_id={TOKEN_ID}` ✅ — full order book for one outcome.
  - Response (OrderBookSummary, ✅ from source `clob_types.py`):
    `market` (conditionId), `asset_id` (token id), `timestamp`, `bids` (array of `{price, size}`), `asks` (array of `{price, size}`), `min_order_size`, `neg_risk` (bool), `tick_size`, `last_trade_price`, `hash`.
    Each `OrderSummary` = `{ "price": "0.62", "size": "1234.5" }`.
- `POST /books` ✅ — batch order books. Body = array of `BookParams` = `{ "token_id": "...", "side": "" }`. Up to ~500 tokens.

### 2.2 Prices
- `GET /price?token_id={TOKEN_ID}&side={BUY|SELL}` ✅ — `side=BUY` → best ask; `side=SELL` → best bid. Returns `{ "price": "0.62" }`.
- `POST /prices` ✅ — batch; body = array of `BookParams` (`{token_id, side}`).
- `GET /midpoint?token_id={TOKEN_ID}` ✅ — midpoint = (best bid + best ask)/2. Returns `{ "mid": "0.615" }` ⚠️ (field name `mid`).
- `POST /midpoints` ✅ — batch midpoints.
- `GET /spread?token_id={TOKEN_ID}` ✅ — bid/ask spread. Returns `{ "spread": "0.01" }` ⚠️.
- `POST /spreads` ✅ — batch spreads.
- `GET /last-trade-price?token_id={TOKEN_ID}` ✅ — last traded price.
- `POST /last-trades-prices` ✅ — batch.

### 2.3 Price history ✅ (PRIMARY time-series endpoint)
- `GET /prices-history` ✅
  - **Required:** `market={TOKEN_ID}` ✅ — note the param is named `market` but the VALUE is the **CLOB token id**, not the conditionId. (Common mistake.)
  - **Time range (choose one approach):**
    - `startTs` (unix seconds) + `endTs` (unix seconds), OR
    - `interval` ∈ `{ 1m, 1h, 6h, 1d, 1w, max }` (`all` also seen) ✅
  - `fidelity` (int, minutes) — resolution of returned points; default 1. ✅
  - **Response shape** ✅:
    ```json
    { "history": [ { "t": 1718700000, "p": 0.62 }, { "t": 1718700060, "p": 0.63 } ] }
    ```
    `t` = unix timestamp (seconds), `p` = price.
  - ⚠️ Known issue: returns empty data for resolved markets at sub-12h granularities (py-clob-client issues #189, #216). For backfill of closed markets, prefer `interval=max` or coarse `fidelity`.

### 2.4 Market lists (CLOB-side)
- `GET /markets?next_cursor=MA==` ✅ — cursor-paginated CLOB markets. Default cursor `MA==` (base64 of `0`). Response includes `next_cursor`, `limit`, `count`, `data[]`.
- `GET /sampling-markets?next_cursor=MA==` ✅ — markets that have rewards/are "sampled".
- `GET /simplified-markets`, `GET /sampling-simplified-markets` ✅ — lighter-weight variants.
- `GET /markets/{condition_id}` ✅ — single market by conditionId.
- `GET /tick-size?token_id=...`, `GET /neg-risk?token_id=...` ✅ — market params.

### 2.5 Health
- `GET /` health / `GET /time` ✅ — server time (unix seconds).

### Example working URLs (CLOB)
```
https://clob.polymarket.com/book?token_id=<TOKEN_ID>
https://clob.polymarket.com/midpoint?token_id=<TOKEN_ID>
https://clob.polymarket.com/prices-history?market=<TOKEN_ID>&interval=1d&fidelity=10
```

---

## 3. Data API — `https://data-api.polymarket.com`

Keyed by the on-chain **proxy wallet address** (`0x...`), NOT a username. Use it to track whales, reconstruct portfolios, audit fills.

### 3.1 `GET /positions?user={0xADDRESS}` ✅
Current open positions.
**Params:** `user` (required), `market` ⚠️ (conditionId filter), `sizeThreshold` ⚠️, `limit` ⚠️, `offset` ⚠️, `sortBy` ∈ `{TOKENS, CURRENT, INITIAL, CASHPNL, PERCENTPNL, TITLE, RESOLVING, PRICE}` ⚠️, `sortDirection` ⚠️.
**Response fields** (⚠️ confirmed via docs summary + clients, validate names):
`proxyWallet`, `asset` (token id), `conditionId`, `size`, `avgPrice`, `initialValue`, `currentValue`, `cashPnl`, `percentPnl`, `totalBought`, `realizedPnl`, `percentRealizedPnl`, `curPrice`, `redeemable` (bool), `mergeable` (bool), `title`, `slug`, `icon`, `eventSlug`, `outcome`, `outcomeIndex`, `oppositeOutcome`, `oppositeAsset`, `endDate`, `negativeRisk`.

### 3.2 `GET /activity?user={0xADDRESS}` ✅
Combined activity feed.
**Params:** `user` (required), `limit`, `offset`, `type` ∈ `{TRADE, SPLIT, MERGE, REDEEM, REWARD, CONVERSION}` ⚠️, `start`/`end` (unix ts) ⚠️, `market` ⚠️.
**Response fields** ⚠️: `proxyWallet`, `timestamp`, `conditionId`, `type`, `size`, `usdcSize`, `transactionHash`, `price`, `asset`, `side`, `outcomeIndex`, `title`, `outcome`, plus profile info (`name`, `pseudonym`, `profileImage`).

### 3.3 `GET /trades` ✅
Historical fills. **Params:** `user={0x...}` ⚠️ and/or `market={conditionId}` ⚠️, `limit`, `offset`, `side` ⚠️, `takerOnly` ⚠️.
**Response fields** ⚠️: `proxyWallet`, `side` (BUY/SELL), `asset`, `conditionId`, `size`, `price`, `timestamp`, `transactionHash`, `outcome`, `outcomeIndex`, `title`, `slug`.

### 3.4 `GET /holders?market={CONDITION_ID}` ✅ (a.k.a. top holders)
Top holders for a market. **Params:** `market` (conditionId) ⚠️, `limit` ⚠️.
**Response fields** ⚠️: `proxyWallet`, `outcome`/`outcomeIndex`, `asset`, `size`, `value`, plus profile info. (Variant path `/top-holders` seen in some clients ⚠️.)

### 3.5 `GET /value?user={0xADDRESS}` ✅
Total current USD value of open positions. **Params:** `user` (required). **Response** ⚠️: `{ "user": "0x...", "value": 1234.56 }` (field name `value`).

### Example working URLs (Data)
```
https://data-api.polymarket.com/positions?user=0xYOURPROXYWALLET
https://data-api.polymarket.com/activity?user=0xYOURPROXYWALLET&limit=50
https://data-api.polymarket.com/value?user=0xYOURPROXYWALLET
```

---

## 4. Leaderboard (top traders by volume & profit)

Historically a standalone `lb-api.polymarket.com` host existed. As of 2026 the official docs expose leaderboard rankings through the **Data API host**. ⚠️ The exact path is the least-certain item in this doc — validate both candidates:

- ⚠️ Candidate A (per docs/clients): `GET https://data-api.polymarket.com/v1/leaderboard`
  **Params:** `category` (default `OVERALL`; also `POLITICS, SPORTS, ESPORTS, CRYPTO, CULTURE, MENTIONS, WEATHER, ECONOMICS, TECH, FINANCE`), `timePeriod` (`DAY, WEEK, MONTH, ALL`; default `DAY`), `orderBy` (`PNL, VOL`; default `PNL`), `limit` (1–50, default 25).
- ⚠️ Candidate B (older pattern): `GET https://lb-api.polymarket.com/leaderboard?window={day|week|month|all}&orderBy={pnl|vol}`
- ⚠️ Candidate C: `GET https://data-api.polymarket.com/profit?window=all&address=0x...` (per-wallet profit lookup).

**Response fields** ⚠️: `rank`, `proxyWallet`, `userName`/`name`, `vol`, `pnl`, `profileImage`, `xUsername`, `verifiedBadge`.

**Recommendation:** Implement against Candidate A first; if 404, fall back to Candidate B. Key results by `proxyWallet` (not username) and feed those wallets into Data API §3 for verified per-wallet positions/PnL.

---

## 5. Price History — consolidated

PRIMARY: `GET https://clob.polymarket.com/prices-history?market={TOKEN_ID}&interval={1m|1h|6h|1d|1w|max}&fidelity={minutes}` ✅
- Time-range alternative: `&startTs=<unix>&endTs=<unix>` instead of `interval`.
- Response: `{ "history": [ {"t": <unix_sec>, "p": <price 0..1>} ] }` ✅.
- Caveat: sub-12h granularity can be empty for resolved markets — use `interval=max` for backfill.

---

## 6. Rate Limits

⚠️ These are not enforced contractually and can change; treat as guidance and implement backoff. Polymarket throttles via Cloudflare (requests are queued/delayed before a hard `429`).

| Host / endpoint | Approx. limit |
|---|---|
| Global Cloudflare cap | ~15,000 req / 10 s |
| CLOB general | ~9,000 / 10 s |
| CLOB market-data single (`/book`, `/price`, `/midpoint`) | ~1,500 / 10 s |
| CLOB batch (`/books`, `/prices`) | ~500 / 10 s |
| Gamma general | ~4,000 / 10 s |
| Gamma `/events` | ~500 / 10 s |
| Gamma `/markets` | ~300 / 10 s |
| Gamma search | ~350 / 10 s |
| Data API general | ~1,000 / 10 s |
| Data API `/trades` | ~200 / 10 s |
| Data API `/positions` | ~150 / 10 s |

**Backoff policy:** on `429`, exponential backoff with jitter — start 1 s, double up to 60 s, add random jitter. For a research/paper-trading poller, a conservative safe default is **≤5 req/s per host** with batching where possible.

---

## 7. Open-Source Tools / Libraries

- **py-clob-client** (official Python, CLOB) — https://github.com/Polymarket/py-clob-client (note: README says archived; recommends unified SDK, but still the canonical path/param reference).
- **clob-client** (official TypeScript/JS) — https://github.com/Polymarket/clob-client
- **polymarket-cli** (official CLI) — https://github.com/Polymarket/polymarket-cli
- **agents** (official example trading agents) — https://github.com/Polymarket/agents
- **agent-skills / market-data** (official agent skill docs) — https://github.com/Polymarket/agent-skills
- **polymarket-kit** (third-party fully-typed SDK + OpenAPI proxy) — https://github.com/HuakunShen/polymarket-kit
- **polymarket-apis** (PyPI) — https://pypi.org/project/polymarket-apis/
- **The Graph subgraphs** (on-chain CTF data) — https://thegraph.com/docs/en/subgraphs/guides/polymarket/

---

## 8. Fallback Endpoint Map

| Need | Primary | Fallback(s) |
|---|---|---|
| List/discover markets + metadata | Gamma `GET /markets` | CLOB `GET /markets` (cursor) → then enrich; or `GET /events` and read nested `markets[]` |
| Token ids for a market | Gamma `clobTokenIds` (parse JSON string) | CLOB `GET /markets/{conditionId}` → `tokens[]` |
| Current price | CLOB `GET /midpoint` | CLOB `GET /price?side=BUY/SELL`; or Gamma `outcomePrices` (slower to update); or CLOB `GET /last-trade-price` |
| Order book depth | CLOB `GET /book` | CLOB `POST /books` (batch) |
| Spread | CLOB `GET /spread` | derive from `GET /book` (best ask − best bid) |
| Price history | CLOB `GET /prices-history` | The Graph subgraph (on-chain swaps); reconstruct from `/trades`; use `interval=max` if fine granularity empty |
| User positions | Data `GET /positions` | reconstruct from Data `GET /activity` / `GET /trades`; or The Graph |
| Portfolio value | Data `GET /value` | sum `currentValue` over `GET /positions` |
| Market holders | Data `GET /holders` | The Graph subgraph holder query |
| Leaderboard | Data `GET /v1/leaderboard` | `lb-api.polymarket.com/leaderboard`; or rank wallets yourself via `/trades` aggregation |
| Any host returns 403 to a bot/sandbox | retry from allow-listed host w/ browser-like UA | use official SDK (py-clob-client / clob-client) which sets proper headers |

---

## 9. Research Notes (concise)

**Prediction-market strategy research.** Polymarket prices are tradable probabilities; edges come from (a) information/forecasting advantages vs. the consensus probability, (b) cross-market arbitrage (mutually-exclusive outcomes whose prices sum ≠ 1, or correlated markets that violate logical bounds), (c) liquidity provision / spread capture, and (d) calendar/resolution-timing effects (favorite-longshot bias, late convergence toward 0/1). Backtests should use the CLOB `prices-history` series aligned to resolution outcomes and account for the fact that probabilities are bounded [0,1] and heteroskedastic near the edges.

**Algorithmic trading validation best practices.** Use strict walk-forward / out-of-sample testing with a clean train/validation/test split that respects time order (no look-ahead, no shuffling). Simulate realistic fills using the actual order book (depth and spread from `/book`), include fees and slippage, and avoid survivorship bias by including resolved/closed markets. Track risk-adjusted metrics (Sharpe/Sortino, max drawdown, hit rate, calibration/Brier score) — not just total PnL. Paper-trade live before any capital, and compare live calibration to backtest.

**Overfitting prevention.** Keep the parameter count low relative to the number of independent market events; prefer simple, economically-motivated signals. Use cross-validation across markets and time, penalize complexity (regularization), and apply a deflated Sharpe / multiple-testing correction when scanning many strategies — the more configurations you try, the more a high backtest Sharpe is just luck. Reserve a final lock-box test set touched once. Watch for data-snooping via repeated re-tuning on the same history.

**Kelly criterion & fractional sizing.** For a binary bet at price `p` (cost) with your estimated true probability `q`, the Kelly fraction of bankroll is `f* = (q − p) / (1 − p)` for a Yes buy that pays $1 (edge over the price, normalized by downside). Full Kelly maximizes log-growth but is highly volatile and very sensitive to probability-estimate error; in practice use **fractional Kelly (¼–½)** to cut variance and drawdowns, cap per-market exposure, and never size on an edge you can't justify out-of-sample. With estimation uncertainty, shrink `q` toward the market price before sizing.

**Bayesian updating.** Treat the market price as a prior probability and update it with new evidence via Bayes' rule; for repeated binary signals a Beta-Binomial conjugate model is convenient (Beta prior + observed successes/failures → Beta posterior). Use the posterior mean as your `q` for Kelly, and the posterior variance to gauge confidence (shrink position size when the posterior is wide). This naturally blends the crowd's information (price) with your private signal and prevents overreaction to small samples.

**Market microstructure (order-book imbalance, spread, depth).** From `/book`: **spread** (best ask − best bid) measures transaction cost and liquidity; **depth** (cumulative size within X of mid) measures how much you can trade without moving price; **order-book imbalance** = (bid volume − ask volume)/(bid + ask) is a short-horizon directional signal (more bid depth → upward pressure). Mid-price and microprice (depth-weighted mid) are better fair-value estimates than last trade in thin books. For paper trading, model fills by walking the book and assume you pay the spread on market orders; account for the fact that Polymarket books are often thin, so large orders incur meaningful slippage.

---

## 10. Sources

- Polymarket Docs — Gamma Markets API (Fetching Markets): https://docs.polymarket.com/developers/gamma-markets-api/get-markets
- Polymarket Docs — CLOB Public Methods: https://docs.polymarket.com/developers/CLOB/clients/methods-public
- Polymarket Docs — Get prices history (timeseries): https://docs.polymarket.com/developers/CLOB/timeseries
- Polymarket Docs — Get current positions for a user: https://docs.polymarket.com/api-reference/core/get-current-positions-for-a-user
- Polymarket Docs — Get trades for a user or markets: https://docs.polymarket.com/api-reference/core/get-trades-for-a-user-or-markets
- Polymarket Docs — Get trader leaderboard rankings: https://docs.polymarket.com/api-reference/core/get-trader-leaderboard-rankings
- Polymarket Docs — API Rate Limits: https://docs.polymarket.com/quickstart/introduction/rate-limits
- py-clob-client `endpoints.py` (paths, verified): https://github.com/Polymarket/py-clob-client/blob/main/py_clob_client/endpoints.py
- py-clob-client `client.py` / `clob_types.py` (methods, field types): https://github.com/Polymarket/py-clob-client
- py-clob-client issues #189, #216 (prices-history empty-data caveat): https://github.com/Polymarket/py-clob-client/issues/216
- Polymarket agent-skills (market-data.md): https://github.com/Polymarket/agent-skills/blob/main/market-data.md
- HuakunShen/polymarket-kit (typed SDK + OpenAPI; note proxy path prefixes): https://github.com/HuakunShen/polymarket-kit
- shaunlebron — Polymarket Data API gist: https://gist.github.com/shaunlebron/0dd3338f7dea06b8e9f8724981bb13bf
- FrenFlow — Polymarket API Developer's Guide (2026): https://www.frenflow.com/blog/polymarket-api-guide
- pm.wiki — Polymarket API Guide 2026: https://pm.wiki/learn/polymarket-api
- AgentBets — Polymarket Rate Limits Guide: https://agentbets.ai/guides/polymarket-rate-limits-guide/
- Chainstack — Polymarket API for Developers: https://chainstack.com/polymarket-api-for-developers/
- The Graph — Polymarket subgraphs: https://thegraph.com/docs/en/subgraphs/guides/polymarket/
