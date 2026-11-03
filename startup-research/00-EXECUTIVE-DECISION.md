# 00 — Executive Decision

Research period: November 2–3, 2026. Evidence base: 102 problems from 13 domain investigations, 24 candidates, 8 competitive analyses, an independent red team, and four technical experiments on real documents. No customer, user or buyer has been contacted. Every commercial claim below is **UNVALIDATED** until the tests in `12-customer-validation-plan.md` are run with real people.

---

## THE COMPANY I WOULD BUILD

**Company concept:** An independent verifier for document accessibility.

**One-sentence description:** Software that checks whether a published document actually works for a blind screen-reader user, explains every failure in plain language, and keeps a dated evidence record, for the public bodies that are legally liable for what they publish and the vendors who remediate for them.

**Who desperately needs it:** ADA coordinators, web managers and clerks at US cities and counties over 50,000 people and at public colleges. They must meet WCAG 2.1 AA for new documents by April 26, 2027 (smaller entities by April 26, 2028), and they stay liable for vendor output. Second, remediation vendors who need automated QA to cut human review. Desperation is inferred from observed behavior, not confirmed by interviews: counties chose to post fewer documents online, and cities issued 2026 remediation RFPs.

**What is broken:** Auto-tagging became free and everywhere in 2025–2026 (Acrobat, Anthology Ally, OpenDataLoader, CivicPlus, Siteimprove), but no buyer can tell whether the output works. The checkers in use verify syntax, such as whether tags and alt attributes exist. They do not verify meaning: whether headings, tables, lists and reading order match the page. In this session, a syntax-style checker passed every case where headings were tagged as paragraphs, lists were flattened, or reading order was wrong.

**The non-obvious insight:** Generating accessibility fixes has become cheap and automatic, but verifying them has not, and whoever produces the fix cannot credibly grade it. So the value is moving from remediation to neutral verification.

**The actual invention:** A semantic verification engine. It compares the rendered page with the tag tree in screen-reader order, combines deterministic PDF/UA checks with a model judge, and is calibrated against a corpus labeled by blind users completing real tasks. That corpus is the part that does not exist and takes longest to copy.

**Why it can start with one founder:** It is pure software on the founder's existing stack. The prototype was built and tested on real documents in one day for about $10 of model usage (241 calls). The target documents are public, so the founder can show value on a buyer's own documents without asking permission. The founder's college is itself a Title II entity, and Bay Area blind-user organizations are reachable for paid testing.

**Why now:** Title II dates are fixed for 2027/2028, extended once but not removed. HHS Section 504 was not extended, and the EU Accessibility Act has applied since June 2025. Free auto-tagging floods the market with unverified output. Model judging now costs $0.004–$0.06 per page (measured).

**What makes it difficult to copy:** Today, nothing. The prompt and code can be copied in a weekend. Defensibility has to be earned through three things:
- A blind-user-labeled failure corpus.
- A public benchmark that vendors are measured against.
- Neutrality: not selling the remediation it grades.
- Evidence histories built into customers' publishing workflows.
If Siteimprove, Adobe or PAC ships a trusted semantic checker first, this becomes a feature.

**The first product:** Point it at a public website or upload PDFs. It returns a per-document report of what a screen-reader user would hear, what is wrong, and how to fix it, plus an exportable evidence log. A metered API offers the same checks to remediation vendors. Verification only: no remediation, no guarantee, and no "compliant" claims.

**What must be proven in seven days:**
- **Agreement:** on 30 real public PDFs, including forms and multi-page packets, the verifier's findings agree with blind testers' task failures. The target is at least 85%, completed by about day 14.
- **Volume:** real cities publish enough new PDF pages a year to matter. Day 1 measurement.
- **Demand:** first interviews show coordinators or vendors already spend money or effort checking accessibility output. Five interviews.

**The most likely reason it fails:** Nobody pays for verification as a separate product. Buyers remediate on request through bureaus that already guarantee their output, such as Allyant and AbleDocs, or accept free tagging from tools they already license. Meanwhile an incumbent adds a semantic check.

**Verdict: VALIDATE FIRST.** This is not BUILD. The problem and the verification gap are real and measured. Willingness to pay, the moat, and venture scale are not. Spend three weeks on the tests in 12 before writing production code. Stop if blind-user agreement is below 70%, or if neither public buyers nor vendors will pay.

---

## How strong is this, honestly?

- **This is the best option found, and it is not a proven venture-scale company.** The base case is a $1–10M ARR business or an acquisition by a remediation or web-governance vendor (06).
- **The billion-dollar version would require several things to come true at once:**
  - The verifier becomes the reference standard.
  - It expands from US public documents to private-sector documents under the EU Accessibility Act, ADA Title III and HHS Section 504.
  - It extends to web and app screen-reader testing.
  - It reaches about $100M ARR before incumbents bundle the feature.
  That is possible, not probable.
- **Nothing else survived.** Seven of the eight finalists in competitive analysis died the same way: the incumbent that owns the data or the customer relationship had already shipped the AI feature. This idea survived because a seller cannot credibly audit itself.

## Evidence that supports the decision (VERIFIED in this session)

| Finding | Number | Where |
|---|---|---|
| Model structure extraction vs best free engine, 31 real pages | 0.906 vs 0.892 overall (parity; engine is commodity) | 09 §3 |
| Haiku extraction cost | $0.004/page at 0.873 overall | 09 §3 |
| Semantic verifier vs rule checker, blanket injected defects | 27/27 vs 13/27 | 09 §4 |
| Same, subtle single-element defects | 13/15 (Sonnet), 11/15 (Haiku) vs 0/15 | 09 §4 |
| Real auto-tagged pages: defective tables / headings flagged | 8/10 and 3/5, with 0/19 false flags; rule checker 0/15 | 09 §5 |
| Closed loop, real pages still needing a human | 13% structural, 29% including alt text | 09 §6 |
| Federal document conformance | 37% of agencies' top-viewed documents fully conformant | 02, HCI-01 |

Confidence intervals are wide (for example, 0/19 false flags still allows up to 18%). The proxy ground truth is not blind users. See 09 §7.

## Backup choices

1. **Neutral pharmacy reimbursement-floor evidence engine (C02): VALIDATE FIRST, leaning KILL.** The money per violation is real and 2026 floor laws are live. But regulators and plaintiff firms already do the analysis, and HIPAA business-associate duties are hard for a minor. Test: two weeks of calls to three state associations and two plaintiff firms; kill if none would pay $5–20k for an evidence pack.
2. **Records-request intake-flood defense (C05): KILL unless a one-week test surprises.** Incumbent portals own the data, and a flag cannot safely trigger a denial. Test: public NextRequest logs from five California cities; resurrect only if over 25% of requests are duplicate, bulk or commercial and clerks say they would act on flags.

If all three fail, return to the problem database with the pattern this research found: generation got cheap while verification did not. Test web-app screen-reader verification (HCI-06), browser-agent outcome verification (WLD-04) and maintainer inbound triage (DEV-01) next (16 §5).

## What I would not do

- Do not leave college or apply to the Thiel Fellowship on this evidence (14).
- Do not build remediation, guarantees or a dashboard before T1 and T2/T4 pass.
- Do not market anything as "compliant" or "certified". The FTC's accessiBe order is the precedent.
- Do not send outreach, spend the testing budget, or touch non-public documents without the founder's own decision.

## File map

| File | Contents |
|---|---|
| 01 | Methodology, environment inventory, limitations |
| 02 / data/problem-database.json | 102 evidence-backed problems, 583 source citations |
| 03 | Source library (1,314 unique URLs) |
| 04 | 24 candidates, 16 fields each |
| 05 / data/competition-*.md | Competitive analyses for the top 8 |
| 06 / tools/market_model.py | Bottom-up sizing and unit economics |
| 07 / tools/score.py | Two-pass weighted scoring with sensitivity analysis |
| 08 / data/red-team-raw.md | Red team: 8 perspectives × 3 finalists, with responses |
| 09 / experiments/ | Technical experiments, code and raw outputs |
| 10 | Primary thesis |
| 11 | First 90 days with gates |
| 12 | Customer validation plan, interview script, drafts (unsent) |
| 13 | MVP architecture |
| 14 | YC, Thiel and investor assessment |
| 15 | Rejected ideas |
| 16 | Open questions |
| RESEARCH-LOG.md | Resume log |
