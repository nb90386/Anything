# 16 — Open Questions

Ordered by how much the answer would change the decision. Each has the cheapest way to answer it.

## 1. Decision-critical (answer in the first 3 weeks)

| # | Question | Current state | Cheapest answer |
|---|---|---|---|
| 1 | Does the semantic verifier agree with blind screen-reader users on real multi-page documents and forms? | UNVALIDATED; only proxy ground truth (09) | T1: 30 real PDFs, 4–5 paid testers, frozen predictions, ≥85% agreement gate (12) |
| 2 | Will a public buyer pay for verification without remediation? | UNVALIDATED; red team's most likely cause of death | T2: 20 free reports + $500 pilot offer |
| 3 | Will a remediation vendor pay for QA on its own output? | UNVALIDATED | T4: free API trial, then $0.05–0.15/page |
| 4 | How many new mandated PDF pages does a real city/county/college publish per year? | ASSUMED (8k–60k) | T3: count from public sites, 1 day |
| 5 | What is the real false-flag rate on real documents? | 0/19 observed (CI up to 18%) | Held-out set from T1 |

## 2. Important (answer in 30–60 days)

| # | Question | Notes |
|---|---|---|
| 6 | Are PAC (axes4), Siteimprove or Adobe shipping semantic verification? | A 2026 review claims PAC has "AI-assisted semantic analysis" (UNVERIFIED). Install PAC on a Windows machine and test it on the injected-defect set. |
| 7 | Does a cross-family judge (non-Claude model) reduce correlated errors? | Not tested. |
| 8 | Is run-to-run variance acceptable? | Not measured. |
| 9 | What is the automated clearance rate on real customer documents? | 13–29% flagged on single pages (09); multi-page unknown. |
| 10 | How do cities actually buy at this size (card limits, small-purchase thresholds, cooperative contracts)? | Red team found incumbents hold cooperative contracts (WA DES 02024; Sourcewell/SHI). |
| 11 | How should the founder contract as a minor (parent-held LLC, adult officer)? | Needs a lawyer or a parent; voidability of minors' contracts flagged (UNVERIFIED specifics). |
| 12 | What data-handling terms (zero retention, DPA) are needed before any non-public document? | Needed before T5 on customer documents. |

## 3. Strategic (answer before raising money)

| # | Question |
|---|---|
| 13 | Does the verifier transfer to private-sector documents (bank statements, insurance notices) and to web/app screen-reader behavior? This decides venture scale. |
| 14 | Will DOJ re-propose the rule's substance during the extension, and how does the NFB lawsuit resolve? |
| 15 | Is HHS Section 504 enforcement creating paid demand from hospitals and clinics now? |
| 16 | Can the blind-user corpus be built ethically and at scale (fair pay, consent, credit) as a durable asset? |
| 17 | Could the company partner with an industry body (the PDF Association, which published the LLM-reading-order idea) instead of competing with it? |

## 4. Research gaps from this session

- Reddit and Hacker News could not be read directly; firsthand complaints came through search snippets and GitHub issues.
- The YC RFS, YC application pages and Thiel FAQ were reconstructed from secondary sources.
- Perplexity was not available. last30days, Roast Room and founder-skill were inspected but not installed (no network for their runtime sources; persona tools add no evidence).
- veraPDF was not run. The rule checker is an approximation.
- The shared search budget limited breadth in the first discovery pass; several domain angles listed in each agent's notes were not searched (problem records note them in `key_unknowns`).
- No interviews and no customer contact of any kind occurred.

## 5. Fallback directions if the primary thesis dies

Same pattern ("generation got cheap, verification did not"), each needing its own competitive check:
- Screen-reader behavior testing for web apps (HCI-06), a natural extension that could also become the primary if documents prove too narrow.
- Independent outcome verification for browser/computer agents (WLD-04, MKT-02/03).
- Inbound triage with automated reproduction for open-source maintainers (DEV-01).
