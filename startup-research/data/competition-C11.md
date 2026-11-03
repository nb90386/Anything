# C11 — Prediction-market execution-quality & resolution-risk monitor: competitive analysis

Retrieval date: 2026-11-02. Method: 13 web searches + 3 GitHub fetches. Non-GitHub primary pages (Kalshi PDF, arXiv, docs.polymarket.com) could not be fetched; claims from them are via search snippets and marked accordingly. Anything not cross-checked against a primary page is marked (unverified).

## 1. Verdict in one paragraph

The problem is real and current: a trader's GitHub issue (py-clob-client #338, opened 2026-05-02, 9 upvotes, three "same here" replies, no maintainer reply, repo archived 2026-05-25) documents ~35% of matched market BUYs reverting post-V2 with reverts skewed 3:1 toward profitable orders; an arXiv paper (2606.16852) counts ~1.95M reverted settlement transactions and says V2 "changed where Ghost Fills fail, rather than eliminating them." But the market is small, the data-redistribution terms are hostile (Kalshi), the wedge is already being sold cheaply by a solo operator (OrderBookTrade/GhostGuard, $299/mo), and the most obvious buyer of a data-API company (Polymarket) has already made its acquisition in this category (Dome, Feb 2026). Verdict: **maybe, leaning no** as a standalone data vendor; **plausible** as an acqui-hire-shaped research/tooling play.

## 2. Existing vendors (what they do, pricing, funding, users)

| Vendor | What it does | Pricing | Funding / status | Overlap with C11 |
|---|---|---|---|---|
| **Dome** (acquired by Polymarket, Feb 2026) | Unified Polymarket+Kalshi developer API (YC F25) | n/a now | $500K YC + $4.7M seed, then acquired, undisclosed sum (The Block, pulse2, crypto.news) | Signals Polymarket builds/buys data infra in-house; sets a ceiling on "independent API" exits |
| **Adjacent News** (adj.news) | Normalized API across Kalshi, Polymarket, Manifold, Metaculus (~40K markets), OHLC history, trades, semantic search, custom indices, cross-platform reference rates | No public price found; market/event endpoints unauthenticated, export endpoints token-gated | Manifund grant application exists; Dealroom listing; no priced round found (unverified) | Closest "data API" competitor; no execution-quality or oracle-risk product |
| **Polymarket Analytics** (polymarketanalytics.com) | Trader/wallet/position/trade database, dashboards | Free + ~$20/mo premium (bonus.com review, May 2026) | Crypto-fundraising lists an M&A entry tied to "PolyGun", no amount (unverified) | Retail-facing; no settlement/revert metrics |
| **Polysights** | AI summaries, 30+ metrics, insider/whale finder | Free tier + premium reportedly ~1.5 ETH/yr (Substack, unverified) | Founded 2024; Dealroom listing; no round found | Retail-facing |
| **PolyAlertHub** | Alerts, whale tracking, terminal | Free; $34.99 and $99.99/mo tiers (site structured data) | Unknown | Retail-facing |
| **OrderBookTrade / GhostGuard** (github.com/orderbooktrade/ghostguard) | Rust crate/CLI that verifies every CLOB fill on-chain and flags reverted settlements; webhook + dashboard; also a maker rebate underpayment tracker and V2 migration consulting | Open source MIT; subscription "from $299/mo single wallet" post-beta; $2.5K custom integration; $150/hr consulting; $2K–5K migration service | Solo operator ("Bruce"); 12 stars, 3 forks; onboarding 3–5 makers free in beta | **Direct overlap on the execution-quality wedge**, already priced |
| **arXiv 2606.16852 "The Ghosts of Polymarket"** | Academic measurement of ghost fills (1,090,016 V1 vs 862,423 V2 reverts), disclosed to Polymarket | Free | Academic | Free, authoritative baseline the startup would have to beat |
| **Kalshi official data distribution** | CNBC and CNN multi-year data deals, Tradeweb partnership (data first), ProCap research feed, Benzinga/Fiscal.ai KPI collaboration, Kalshi Research academic access, alpha "Bloomberg-style" pro terminal | Negotiated | Kalshi raised $1B at $40B (CNBC, Oct 29 2026) | Kalshi is building the data business itself |
| **Prediction Hunt, Telonex, APIBricks, PredictReport** | Third-party aggregators/resellers | Telonex/Prediction Hunt forbid redistribution without enterprise license | Unknown | Show the category exists but is crowded at the low end |
| **Hedgehog Markets, Dune, Bloomberg/Refinitiv** | No 2026 result tying any of these to prediction-market execution analytics; no Bloomberg/LSEG-Kalshi license found | — | — | Dune dashboards exist generally but none surfaced for revert/oracle analytics (not searched exhaustively) |

Adjacent funded startups competing for the same trader/fund wallet: Elastics ($2M pre-seed), ParlayX ($1.25M pre-seed), Pascal ($9M), PredictPro ($4M), Opinion ($20M).

## 3. Platform constraints

- **Kalshi Developer Agreement** (S3 PDF, date not shown in snippet): prohibits collecting, caching, aggregating or storing API data except to facilitate your own trading, and prohibits sharing with third parties without prior written consent; access terminable at Kalshi's discretion. **This alone blocks the Kalshi half of the product unless Kalshi signs a license, and Kalshi is monetizing data itself (CNBC, CNN, Tradeweb, ProCap).**
- **Polymarket**: the Exchange participant agreement says API access may be suspended or terminated at any time and references an "API Usage Policy" whose text was not found. However, Polymarket settlement is on-chain (Polygon), so revert/oracle data can be reconstructed from public chain data without the API, which is how the arXiv authors and GhostGuard work. This is the one durable, license-free data source the startup has.
- **Crackdowns**: none found against third-party tools. Polymarket's Oct 29 2026 trading halt was a third-party vendor (DebugBear) compromise, not an API crackdown, but it shows Polymarket will cut vendor dependencies fast.
- **CFTC**: nothing found restricting the *sale of analytics*; the regulatory fight is about sports contracts and state preemption (Third Circuit April 2026; DOJ/CFTC suits vs IL/AZ/CT). Reselling Kalshi (a DCM) market data is a contractual, not a CFTC, issue.

## 4. Paying demand

- Price points actually observed: $20/mo (Polymarket Analytics), $35–$100/mo (PolyAlertHub), $299/mo (GhostGuard, pre-launch), ~1.5 ETH/yr (Polysights, unverified). No evidence of four- or five-figure annual data contracts from funds.
- Active-trader base: Polymarket reported ATH 477,850 monthly active traders in October (source dating ambiguous 2025 vs 2026); The Block had ~643K (April) / 733K (March) global users; Pew found the typical user made 46 trades over 10 days (retail, small). Kalshi self-reports 2–4M monthly users and "800% institutional volume growth in six months" (unaudited). Combined monthly volume ~$21B (TRM Labs) / $150B cumulative (Yahoo).
- Institutional entry: ICE up to $2B into Polymarket; Tradeweb and Jump Trading with Kalshi; no hedge-fund or market-maker participation data found. Realistic buyer universe for a $300–$2,000/mo feed: low hundreds of API makers/bots.

## 5. Is the problem being solved by the platforms?

- **Polymarket reverts/ghost fills**: V2 (April 28) replaced nonces with timestamps and refactored matching; KuCoin and QuantVPS write-ups call it "addressed but not fully resolved"; a tweet (Autonomous_Chad) claims a "definitive root-cause fix on Monday" (undated, unverified); a KuCoin post attributes to Polymarket's VP Engineering that a full fix is "coming very soon" (secondhand). Issue #338 has no maintainer response. Net: partially mitigated, actively being worked on by Polymarket, and GhostGuard's own README says the real fix is a smart-contract wallet. **The headline 35% figure is one trader's 34-trade sample; the arXiv paper's aggregate shows V2 reverts of similar magnitude to V1, not 35% of all fills.**
- **UMA**: WSJ (May 2026) investigation on voter concentration; >1,150 disputed markets in first five months of 2026 (secondary source); no confirmed structural reform by Polymarket or UMA. This is the most durable, unsolved part of the thesis.
- **Kalshi**: Outcome Review Committee at Kalshi's sole discretion; Golan v. Kalshi class action (Khamenei market, $0.29 scalar settlement). Rule-ambiguity scoring is a credible need, but the data to score it is public rulebook text, not licensed data.

## 6. Could Polymarket/Kalshi/Dune ship this in a quarter?

Polymarket: yes for execution quality — it owns the matcher and Dome, and needs fill/confirmation stats to retain makers; it will not publish a voter-concentration score against its own oracle. Kalshi: already selling data; would not license an outsider to grade its settlements. Dune: anyone can post a revert dashboard today. If platforms ship fill-quality stats, the defensible remainder is the *independent* resolution-risk layer (oracle concentration, rule-ambiguity, dispute outcomes): a research product with a smaller wallet.

## 7. Shutdowns and pivots

No shutdowns of Polymarket Analytics, PolyAlertHub, or Hedgehog Markets found. Notable exits/pivots: Dome acquired by Polymarket (second official acquisition); py-clob-client archived May 25 2026 in favor of v2 clients; Polymarket Analytics' M&A entry tied to PolyGun (unverified). The pattern is consolidation into the platform, not independent vendor growth.

## 8. Would the startup win?

Against retail dashboards: different buyer, irrelevant. Against GhostGuard: must beat a free MIT crate plus $299/mo from a solo operator with maker relationships. Against Adjacent: breadth but no execution/oracle depth; out-nicheable. Against Polymarket itself: loses on execution-quality data the moment Polymarket publishes confirmation stats; wins only on independence (oracle/resolution risk). The strongest version of C11 is a narrow, independent "resolution risk" rating service for Polymarket (on-chain, license-free) plus Kalshi rule-ambiguity scoring from public rulebooks, priced for a few dozen funds and makers, positioned for acquisition, not a broad data API.

## Sources (retrieved 2026-11-02)

- https://github.com/Polymarket/py-clob-client/issues/338
- https://arxiv.org/html/2606.16852v1
- https://arxiv.org/abs/2606.16852
- https://github.com/Polymarket/rs-clob-client-v2/issues/36
- https://github.com/nautechsystems/nautilus_trader/issues/3844
- https://docs.polymarket.com/v2-migration
- https://www.quantvps.com/blog/polymarket-clob-central-limit-order-book
- https://www.quantvps.com/blog/polymarket-fixes-ghost-fills-clob-v2-upgrade
- https://www.kucoin.com/news/flash/polymarket-v2-launches-ghost-fills-addressed-but-not-fully-resolved
- https://www.kucoin.com/news/insight/POL/69f873492f8d6c000732226a
- https://x.com/Autonomous_Chad/status/2050690992882221273
- https://github.com/orderbooktrade/ghostguard
- https://github.com/OrderBookTrade/v2-migration
- https://www.theblock.co/post/390546/polymarket-buys-fresh-prediction-market-api-startup-dome-marking-second-official-acquisition
- https://pulse2.com/polymarket-acquires-prediction-market-api-startup-dome/
- https://crypto.news/polymarket-acquires-prediction-market-api-startup-dome/
- https://crypto-fundraising.info/projects/polymarket-analytics/
- https://predictreport.io/blog/best-prediction-market-apis-builders
- https://www.apibricks.io/blog/prediction-market-api-one-data-layer-for-the-future-of-event-markets
- https://techfundingnews.com/polymarket-400m-15b-valuation-ice-nyse-investment/
- https://fintech.global/2026/05/06/elastics-raises-2m-pre-seed-for-ai-prediction-market-agents/
- https://fortune.com/2026/07/16/exclusive-prediction-market-startup-pascal-9-million-heavyweights-kalshi-and-polymarket/
- https://www.coindesk.com/business/2026/02/04/opinion-raises-usd20-million-as-prediction-markets-draw-capital-in-a-weak-crypto-market
- https://cryptorank.io/insights/deals/parlay-x-pre-seed-2026-09-03
- https://www.thesaasnews.com/news/predictpro-raises-4m-strategic-investment/
- https://www.cnbc.com/2026/10/29/kalshi-40-billion-valuation-funding-round.html
- https://www.quicknode.com/builders-guide/tools/adjacent-news-by-adjacent-news
- https://observablehq.com/@adjacent/adjacent-news-api-exploration
- https://app.dealroom.co/companies/adjacent_markets
- https://adjacentresearchxyz.notion.site/Adjacent-News-Manifund-Application-f686227d78ab4cd49f7fe8ffcd1b52fb
- https://stacymuur.substack.com/p/polymarket-trading-tools-masterclass
- https://app.dealroom.co/companies/polysights
- https://pm.wiki/uk/projects/polysights
- https://orrery.me/research/best-polymarket-analytics-tools/markdown
- https://www.bonus.com/prediction-markets/tools/polymarket-analytics/
- https://polyalerthub.com/
- https://polyalerthub.com/comparisons
- https://launchpoly.com/category/analytics
- https://kalshi-public-docs.s3.amazonaws.com/Kalshi-Developer-Agreement.pdf
- https://www.predictionhunt.com/terms-of-service
- https://telonex.io/terms
- https://apidocs.polymarketexchange.com/isv-partners/participant-agreement
- https://www.marketdata.app/docs/account/data-policies/data-redistribution/
- https://huggingface.co/datasets/trentmkelly/polymarket_historical_data
- https://www.pulse.bot/fintech/news/kalshi-expands-data-distribution-with-procap-research-deal-40d839fb-571c-4321-bba5-53a4a3465038/
- https://a-teaminsight.com/blog/tradeweb-and-kalshi-announce-strategic-partnership-to-expand-institutional-access-to-prediction-markets/?brand=madi
- https://news.bloomberglaw.com/financial-accounting/wall-street-bond-trading-hub-tradeweb-strikes-deal-with-kalshi
- https://www.financemagnates.com/institutional-forex/tradeweb-backs-kalshi-after-jump-trading-to-push-prediction-markets-to-institutions/
- https://ground.news/article/prediction-giant-kalshi-strikes-a-new-media-partnership-with-cnbc-days-after-its-cnn-deal_0cdeec
- https://digitalmoneybox.com/news/research/cnbc-taps-kalshi-to-bring-real-time-prediction-data-into-financial-coverage
- https://www.kucoin.com/news/flash/kalshi-launches-bloomberg-terminal-style-interface-for-prediction-market-traders
- https://finance.yahoo.com/markets/crypto/articles/polymarket-kalshi-volumes-hit-150b-145540046.html
- https://www.pewresearch.org/short-reads/2026/07/22/what-we-know-about-the-typical-polymarket-user/
- https://www.trmlabs.com/resources/blog/how-prediction-markets-scaled-to-usd-21b-in-monthly-volume-in-2026
- https://startupfortune.com/kalshi-and-polymarket-just-posted-their-biggest-trading-month-on-record/
- https://predictionscout.com/research/prediction-market-statistics/
- https://blockonomi.com/prediction-market-statistics-2026-kalshi-polymarket-and-the-numbers-behind-the-boom
- https://www.nbcnews.com/business/consumer/polymarket-trading-halt-hack-wallets-rcna606405
- https://rollingout.com/2026/10/29/polymarket-halts-trading-exploit-users/
- https://orochi.network/blog/oracle-manipulation-in-polymarket-2025
- https://laikalabs.ai/news/polymarket-uma-oracle-resolution-disputes-scrutiny
- https://www.turbinefi.com/blog/how-prediction-markets-resolve-oracles-disputes-2026
- https://www.webopedia.com/crypto/learn/polymarkets-uma-oracle-controversy/
- https://polymarkets.co.il/en/guide/uma-disputes/
- https://truthinadvertising.org/wp-content/uploads/2026/03/Golan-v-Kalshi-complaint.pdf
- https://decrypt.co/360293/kalshi-sued-refusing-pay-out-prediction-market-iran-leader-death
- https://www.financemagnates.com/fintech/khamenei-out-market-becomes-legal-headache-for-kalshi/
- https://www.mondaq.com/unitedstates/arbitration-dispute-resolution/1749320/its-not-on-the-house-the-risks-of-ambiguity-in-prediction-markets
- https://help.underdogfantasy.com/en/articles/14127596-settlement-issues-disputes
- https://pm.wiki/tr/learn/is-kalshi-legal
