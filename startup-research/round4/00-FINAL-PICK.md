# Final pick after comparing six AI-proposed ideas

Date: November 3, 2026. Each idea was attacked by a separate research agent that was told to kill it and to check the claims of the AI that proposed it. Full reports are in this folder. No customer has been contacted; revenue numbers are projections.

## Scoreboard

| Idea (proposed by) | Verdict | What killed it, or what kept it alive |
|---|---|---|
| GridProof, solar interconnection pre-check (ChatGPT) | KILL | Most delay is the utilities' fault: PG&E and SCE meet Rule 21 review deadlines only 27–45% of the time against a 95% standard. PowerClerk is adding its own AI pre-check. California home solar connections fell from ~271k (2023) to ~145k (2024), and Freedom Forever, the #1 installer, filed Chapter 11 in April 2026. GreenLancer already does the whole application for about $99. |
| StateProof, verified AI agent actions (ChatGPT) | KILL | It is a feature: Microsoft gives invariant checks away free under MIT; Arcade, AIR ($50M seed) and others own the layer; no standalone revenue found for after-the-fact state checks. |
| ZoningProof, zoning pre-check (Gemini, which gave it BUILD and 88/100) | KILL | San Jose is piloting CivCheck to pre-check ADU applications for free; California has a statewide Archistar contract; similar tools cost $29–104 (Buildability, PlanCheckerPro); GreenLite raised ~$86M. None of Gemini's "VERIFIED" claims held up, and 30–50% zoning rejections was false (rejections are mostly missing information). |
| Denial appeals for practices and patients (Grok) | KILL | Patient appeals are free (Counterforce Health, Fight Health Insurance); practices pay $5–20 per appeal (Muni, EZAppeal) or get it inside Waystar and athena; HIPAA business-associate agreements, security reviews and SOC 2 for every practice. |
| RFQ reader for machine shops (DeepSeek) | KILL | Uptool ($6M seed, from $195) and Forgepoint ($9.8M seed, Oct 2026) sell exactly this; Paperless Parts gives AI email intake free; defense drawings fall under ITAR and CMMC. "Underserved segment" was false. |
| Accessibility service for local governments (this lab) | **SURVIVES, weakened** | Demand is legally anchored (April 26, 2027 / 2028), money is moving (17+ local contracts in 2026), cities are deleting documents rather than fixing them (Iowa). But AI-only remediation now sells for ~$0.30/page, an open-source ASU/AWS pipeline does simple pages for cents, and Granicus and CivicPlus are adding automatic remediation for new documents. Selling simple pages at $3 is dead. |

The pattern: every AI proposed the same shape of business, checking paperwork with AI before a gatekeeper sees it. In 2026 that shape gets copied within months by whoever owns the gatekeeper's portal or the customer's software. Only the idea with a legal deadline, a liable buyer already spending, and hard work automation still fails at survived.

## The pick: a Title II readiness service for local governments

Not "PDF remediation at $3 a page." Three things together:

1. **The audit (fast money).** Crawl a city's, county's or district's public website and inventory every PDF. Sort each into one of four piles: still needed to access a service and must be fixed; can be archived under the rule's exception; can be deleted; can be turned into a web page. Run the PDF/UA validator and the semantic checker on every must-fix file. Deliver a plain report: how many pages must be fixed, what it should cost, what to archive or delete, and what is riskiest. Flat fee, about $1,500–5,000 depending on size, delivered in a week.
2. **The hard fixes.** Fix the documents automation fails at: fillable forms, tables, scanned pages, agenda packets on a 48-hour clock. Simple pages at about $1.50–2 with verification; forms, tables and scans at $5–12 (comparable prices: AoD Expert from $12, Accessible.org $4–11.50).
3. **Monthly checking (recurring).** Each month, independently verify the new documents the city publishes, including those made by Granicus, CivicPlus or Adobe tools, and fix what fails. About $300–1,000 a month.

Why this combination wins:
- The audit answers the question every one of these bodies has right now: what do we actually have to fix before April? Iowa cities are deleting documents because nobody gave them that answer.
- The fixes target exactly where cheap AI tools fail (our tests: tables, lists and reading order were the leftover failures).
- The monthly check is the round-1 verifier idea, now attached to something people buy, and it rides on top of whatever tool the city already licenses instead of fighting it.

## Tested so far (on real documents)

| Test | Result |
|---|---|
| Official PDF/UA validator after our automatic finishing step | 20 of 32 real pages passed |
| Pages fully done with no human work (validator + semantic check) | 13 of 32 (41%) |
| AI labels for fillable form fields, real IRS 1040 | 19 of 20 sampled clearly correct, $0.11 for 120 fields |
| Semantic checker vs standard checks, subtle defects | caught 13 of 15 vs 0 of 15 |
| What is still hand work | tables, lists, reading order, some scans |

## Example customer

A city of about 100,000 people with an assumed 30,000 posted PDF pages:
- Audit: $3,000.
- After triage, assume 4,000 pages must be fixed: 3,000 simple at $1.75 ($5,250) plus 1,000 forms, tables and scans at $8 ($8,000). Total $13,250.
- Monthly checking: $500.
- Total in the first three months: about $17,750. That is under the no-bid limit in many California cities, or split across fiscal periods.

All page counts and the triage split are assumptions until the first real audit.

## Money targets

| Month | What has to happen | Revenue (illustrative) |
|---|---|---|
| 1 | LLC with a parent, insurance, pipeline packaged, 3 free sample audits | $0 |
| 2 | 2 paid audits | ~$5,000 |
| 3 | 2 audits + 1 fix package | ~$10,000–15,000 |
| 6 | 2–3 audits/month + fixes + 5 monitoring clients | ~$8,000–15,000/month |

The audit is the fastest money because it is mostly automated: crawling, the validator and the checker do the work, and you write the summary. Fix work is capped by your hours until automation improves.

## Honest ceiling

This is the best-supported path among the six to real money within a few months. Nothing in the evidence supports calling any of the six a billion-dollar idea. The bigger version exists: accessibility verification for every organization under the EU Accessibility Act, ADA Title III and HHS Section 504. It has to be earned from service revenue and data, not assumed.

## Kill criteria

- No paid audit within 6 weeks of offering free samples to 15 Bay Area cities and counties of 50k+.
- Real must-fix volume per city turns out under ~1,000 pages after triage.
- A court ruling or DOJ rewrite removes urgency before you have customers. An NFB win would do the opposite: the earlier dates would return and demand would accelerate.
