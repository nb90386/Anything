# 15 — Rejected Ideas

Every candidate from `04-opportunity-longlist.md` that was not selected, with the evidence that rejected it. Scores are in `07-scoring-model.csv`. "Kill evidence" is cited in the named competition or red-team files. Ideas are rejected for this founder now; several are good businesses for someone else.

## Rejected after competitive analysis or red team

| ID | Idea | Final status | Decisive reason |
|---|---|---|---|
| C01-original | VLM remediation engine as the product | Rejected (reshaped into the primary thesis) | Extraction at parity with free OpenDataLoader on 31 real pages (0.906 vs 0.892); Ally tags PDFs free in-licence; archive mostly exempt (09, competition-C01). |
| C05 | Public-records triage / intake-flood defense | KILL | Incumbent portals own the data and already sell AI redaction/search; flags cannot safely trigger denials; SB 1159's tool may be the free statutory provenance tool; California-only hook; $1–6K/yr ceiling (red-team-raw). Resurrect only if public NextRequest logs show >25% duplicate/bulk/commercial requests. |
| C02 | Pharmacy below-cost/floor-law evidence | VALIDATE FIRST, leaning KILL; not pursued | PSAOs, RxDelta, nadaclookup already sell it; appeals paid ~10%; regulators (WV) already find and order restitution; HIPAA business-associate duties and BAAs a minor cannot reliably sign; plan-type classification problem. |
| C07 | Medicaid coverage retention for providers | Rejected | GSA OES randomized trial found extra texts/calls did not change renewals; CMS/state tools and $600M vendor pledges own verification; Fortuna Health ($22M) owns navigation; FQHC budgets near zero. |
| C06 | Patient-directed records retrieval for law firms | Rejected | ChartSquad/Arctrieval already sell it; Codes Health inside Filevine; courts want custodian-certified copies; Human API and Ciitizen precedent. |
| C03 | Maintained PDF-form engine + API | Rejected | @cantoo/pdf-lib and Documenso LibPDF maintained; fills sell for 0.1–10 cents; only XFA hybrid gap remains (possible small niche). |
| C04 | IEEPA refund recovery + customs compliance | Rejected | Flexport free refund calculator; ~76% of refund dollars processed; 19 CFR 111 limits fee-based preparation; crowded classification market. |
| C11 | Prediction-market execution/resolution monitor | Rejected | GhostGuard sells fill verification at $299/mo; Polymarket bought Dome; Kalshi developer agreement forbids aggregation/redistribution; small paying base. The founder's existing Polymarket work does not change this. |

## Rejected at scoring (hard rejection rules or low scores)

| ID | Idea | Reason |
|---|---|---|
| C16 | Credit-report dispute engine | HARD REJECT: Credit Repair Organizations Act exposure for a paid consumer tool run by a solo minor. |
| C19 | IEP drafting assistant | HARD REJECT: no differentiation (MagicSchool, Brisk, Frontline) and FERPA exposure. |
| C20 | Green Button connector layer | HARD REJECT: Bayou, UtilityAPI and Arcadia already do it with funding; utility terms-of-service risk. |
| C22 | Child-care subsidy claims tool | HARD REJECT: Brightwheel, Procare, Playground cover it; tiny budgets. |
| C23 | Agent-safe workspace runtime | HARD REJECT: platform-owned surface; vendors ship containment monthly. |
| C24 | Citation-integrity gate | HARD REJECT: check is commoditized (235 GitHub repos tagged citation verification); publishers build in-house. |
| C08 | Agent outcome verification | Low score (57.5): real failures, weak payer today, platforms likely absorb. Same "verification" pattern as the winner; kept as a fallback direction. |
| C09 | Orphaned solar servicing marketplace | Lead-gen economics; shrinking cohort. |
| C10 | Broker-spoofing shield for owner-operators | Weak payer; CheckMyBroker, Highway, factoring companies. |
| C12 | AS9102 first-article automation | Niche TAM; incumbents adding AI; ITAR data handling. |
| C13 | EU CRA reporting autopilot | Crowded compliance SaaS; enforcement-driven demand. |
| C14 | ADU permit pre-check + shot clock | Symbium exists; small per-project revenue; California-only. |
| C15 | OSS inbound triage + reproduction | Strong pain, weak payer (unpaid maintainers); GitHub is the natural owner. Fallback direction. |
| C17 | Medical bill error detection (founder's earlier "Second Opinion" concept) | Consumer acquisition cost; Goodbill/Resolve; general chat assistants handle easy cases. |
| C18 | Transfer-credit pre-check | Founder is the user, but the payer is weak and ASSIST/Transferology exist. |
| C21 | Local domain speech recognition | Heavily funded AI scribe category; local-only is a niche. |

## Problems not converted into candidates

About 60 of the 102 recorded problems were not turned into candidates. Reasons per problem (crowded, weak payer, procurement-gated, not software-shaped, weak evidence) are listed at the end of `04-opportunity-longlist.md`.

## What the rejections taught

1. In 2026 an AI feature is usually shipped by whoever owns the data, the customer relationship or the procurement vehicle within months. Seven of eight finalists died on that.
2. The candidates that survived longest share one structure: generation got cheap while verification did not, and a liable party needs proof. That pattern drives the fallback list in 11 and 16.
3. Legal capacity matters for a 17-year-old: HIPAA business-associate agreements, CROA, customs-business licensing, insurance and indemnity all removed otherwise interesting options.
