# 11 — First 90 Days

Assumes up to 10 focused hours/day alongside full-time classes. Real availability is probably 5–7 hours on class days. Each task lists effort, prerequisites, tools, definition of done, required evidence, and the condition that stops or redirects work. Testing comes before infrastructure. No dashboards, microservices, agent orchestration or branding until the core value is shown.

**Earliest moment a real person gets measurable value:** end of week 2. An ADA coordinator or vendor receives a free, accurate report on their own documents, saying what a screen-reader user would hear and what to fix (T2/T4 in 12). The earliest moment that value is *validated* is end of week 3, when T1 confirms the verifier agrees with blind users.

## First 48 hours

| # | Task | Why | Effort | Prereqs / tools | Done when | Evidence | Stop / change if |
|---|---|---|---|---|---|---|---|
| 1 | Read 09 and rerun the experiment folder locally on the Mac | Own the evidence; check reproducibility | 3 h | Python, Node, Java, `claude` CLI | Scores within ±0.02 of 09 | Rerun log committed | Large deviations → investigate before anything else |
| 2 | Collect 30 real public PDFs from three California bodies (the founder's college, one city ≥50k, one county); include ≥8 forms and ≥5 multi-page packets | T1 corpus; measures real messiness | 3 h | Browser; public sites only | 30 files with source URLs and dates | `corpus/manifest.csv` | Fewer than 30 public PDFs → widen to five bodies |
| 3 | Count new PDF pages per year for those bodies (T3, partial) | Sizing input | 2 h | Site search, sitemaps, agenda archives | Page counts with method | `t3-volume.csv` | — |
| 4 | Extend the verifier to multi-page documents and AcroForm fields | Forms are the mandated documents; red team's top technical gap | 6 h | pikepdf, pdfplumber | Runs on all 30 files | Output per file | — |
| 5 | Write the T1 tester protocol: tasks per document, written by someone other than the founder if possible (a teacher, a friend), consent and pay terms | Prevents test leakage | 2 h | — | Protocol reviewed by one other person | Protocol doc | — |
| 6 | Contact LightHouse SF / NFB / ACB chapters about paid testers (founder sends; budget approved by founder) | T1 needs real users | 1 h | Founder consent; budget ~$1–1.5k | Messages sent | Sent log | No response in 5 days → try university disability resource centers |

## First 7 days

| Days | Task | Done when | Kill / redirect |
|---|---|---|---|
| 3–4 | Run verifier (Sonnet + Haiku) and a cross-family judge on the 30 documents; freeze predictions before testers start | Predictions hashed and committed before T1 | — |
| 3–5 | Interview 5 people with the script in 12: the founder's DSPS office, two clerks or web managers, two vendor staff | Notes with past-behavior answers | All five say a free tool already solves it → treat as T2 failure signal |
| 5–7 | Begin T1 sessions (remote screen share or in person); log every blocking failure per document | ≥2 testers through ≥15 documents | Testers unavailable → reschedule; do not substitute the founder's own judgment |
| 6–7 | Finish T3 across five cities and two colleges | Volume table | <5k new pages/yr typical → buyer route too small; prioritize vendor API (T4) |

**Day-7 decision:** if T1's first half shows agreement <70%, stop the verifier thesis and fall back (section "Fallback").

## First 30 days

| Week | Goal | Deliverables | Gate |
|---|---|---|---|
| 2 | Finish T1 (all 30 documents, 4–5 testers); compute agreement with 95% CIs | `t1-results.md` with raw data | ≥85% agreement, ≤10% false-flagged documents → continue |
| 2–3 | T2: reports to 20 coordinators (free, accurate, respectful); T4: free API trials with 3–5 vendors | 20 reports; 3–5 trials | — |
| 3 | Publish a methodology-first public benchmark: how real public documents and the major free/paid tools perform for screen-reader users, with blind-tester ground truth (testers credited with consent) | Public write-up and dataset (public documents only) | Do not publish vendor comparisons the data cannot support |
| 3–4 | Minimal usable product: upload or point at a URL → per-document report and evidence log; Supabase auth; one-click export | Live on Vercel with 3–5 real users | — |
| 4 | Count outcomes | ≥2 paid pilots (T2) or ≥1 paying vendor (T4) | Both 0 → STOP (12, section 5) |

## Days 31–60

| Goal | Tasks | Evidence | Stop / change |
|---|---|---|---|
| Reliability | Run-to-run variance; ensemble or cross-family judging for disputed findings; regression set from T1 | False-flag rate on held-out set ≤5% | False flags >10% persist → narrow categories to those with high precision |
| Coverage | Multi-page reading order, split tables, bookmarks, links, form tab order | T1-style check on 20 new documents | — |
| Measurement | Track per-customer: documents checked, findings fixed, re-check pass rate, time saved (ask) | Weekly metrics table | No repeat use after first report → product is a one-off audit, not a subscription |
| Commercial | Convert pilots; quote ACV; learn procurement path (card limit, small-purchase threshold, or via a vendor) | Signed pilot terms; invoices paid | Procurement requires insurance or an entity the founder cannot provide → route through a vendor partner |
| Entity | Form an LLC with a parent or adult officer; zero-data-retention API terms; basic DPA template; privacy policy | Documents filed | — |

## Days 61–90

| Goal | Evidence required | Stop / change |
|---|---|---|
| Repeat use | ≥60% of pilot customers run checks on new documents in month 2 without prompting | <30% → it is an audit service; reconsider pricing or fold into vendor API |
| Willingness to pay | ≥3 paying customers or ≥$1.5k MRR, from either buyers or vendors | Below → STOP or pivot to vendor-only |
| Improved outcomes | Customers' re-check pass rate rises; at least one documented case of a document fixed before a complaint | None → value unclear |
| Growth mechanism | Inbound from the benchmark (count), referrals between clerks or colleges, or a vendor reselling | Zero inbound after publication → distribution thesis wrong |
| Remediation decision | T5 on customer documents: automated clearance ≥85% → design paid remediation; otherwise stay verification-only | — |
| Fundraising readiness | If the 90-day gates pass: apply to YC (next batch after W27) and consider Z Fellows / 1517 Medici; do not leave college for this yet | Application drafts (14) |

## Fallback if the thesis dies

Return to `02-problem-database.csv` with the recurring pattern this research surfaced: generation became cheap while verification did not. The strongest next candidates to test under that lens are browser-agent outcome verification (WLD-04), inbound slop triage for maintainers (DEV-01), and screen-reader behavior testing for web apps (HCI-06). Each needs its own competitive check and a cheap decisive test before any build.
