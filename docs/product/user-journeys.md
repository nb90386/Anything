# User Journeys — Malbek Contract Intelligence Copilot

> Independent portfolio demo, not affiliated with Malbek Inc. Each journey below is a concrete, screen-by-screen walkthrough through the actual app as built, mapped to the personas in `user-personas.md`.

---

## Journey 1 — Legal Counsel: "Upload a new vendor contract and get a risk briefing in under a minute"

**Persona:** Priya, In-House Counsel
**Goal:** Understand the risk profile of a brand-new vendor MSA before her afternoon call, without reading all 22 pages herself.

1. **Landing / Dashboard.** Priya opens the app and lands on the portfolio dashboard. She clicks **"Upload Contract."**
2. **Upload screen.** She drags in a vendor MSA PDF. A progress indicator shows parsing (`pdf-parse` extracting text server-side), then "Analyzing contract..." while clause classification, risk extraction, and obligation extraction run.
3. **Contract detail view — Summary tab.** She's dropped onto the new contract's detail page. The top of the page shows a 3-6 sentence plain-language AI summary and a headline risk score.
4. **Risk tab.** She clicks into the **Risks** panel: a list of flagged risks sorted by severity (critical → low), each with a category tag, a one-line recommendation, and a "View source clause" link.
5. **Source traceability.** She clicks "View source clause" on a "High — Indemnification" flag. The app scrolls to and highlights the exact clause text in the document viewer, with the risk note shown inline next to it — she can verify the AI's reasoning in one click instead of trusting it blindly.
6. **Clause browser.** She switches to the **Clauses** tab, which lists all 14 possible categories with the ones present in this contract populated (e.g., Liability, Termination, Governing Law, Confidentiality) — she immediately sees which standard protections are *missing* (no Data Privacy clause present) as much as which are risky.
7. **Obligations tab.** She checks **Obligations** and sees a due-date-sorted list (e.g., "Renewal notice due in 45 days — status: upcoming") auto-extracted from the termination/renewal language.
8. **Outcome.** In under a minute of active reading, Priya has a defensible summary, a prioritized risk list she can act on, and confirmation of exactly which clauses are missing — ready for her call.

---

## Journey 2 — Finance: "Review renewal exposure across the portfolio"

**Persona:** Elena, Commercial Finance Analyst
**Goal:** Answer "what are we on the hook for renewing in the next quarter, and where's our risk concentrated" for a Monday leadership sync.

1. **Role switch.** Elena opens the app and uses the role switcher in the header to select **Finance**. The dashboard re-emphasizes spend, renewal, and obligation widgets over legal-clause detail.
2. **Portfolio dashboard.** She sees portfolio-wide tiles: total active contract value, count by status, and a risk-distribution chart across the whole contract set (not just one document).
3. **Insights / BusinessIQ-style view.** She navigates to **Insights**. The **Renewal Pipeline** panel shows contracts grouped into 30/60/90-day expiration windows, each with counterparty, value, and auto-renew flag.
4. **Drill into a risky renewal.** She clicks a SaaS Subscription contract flagged "auto-renews in 22 days, notice window closes in 7 days." This opens the contract detail page directly to its **Obligations** tab, where the renewal-notice obligation is shown as "Due Soon."
5. **Spend breakdown.** Back in Insights, she reviews **Spend by Department** and **Spend by Contract Type** charts, both computed live from the `contracts.value`/`department`/`type` fields across the portfolio — she can see Procurement's vendor spend dominates while Sales' customer-side value is concentrated in three large MSAs.
6. **Cycle-time check.** She glances at **Average Approval Cycle Time**, broken out by contract type, to flag to leadership that Procurement contracts are taking noticeably longer to clear approval than Sales contracts.
7. **Cross-repository search.** Curious whether other contracts share the same risky auto-renewal pattern, she runs a search: *"auto-renewal without notice period."* The TF-IDF-ranked results surface three more contracts with similar language, each with a relevance score and a matching snippet.
8. **Outcome.** Elena leaves the session with a specific, numbers-backed list of renewal risk to raise Monday — sourced entirely from structured data, not a manual document review.

---

## Journey 3 — Executive: "Review the BusinessIQ-style dashboard and export a board-ready report"

**Persona:** David, CEO/Executive Evaluator (also representative of a real internal exec persona)
**Goal:** Get a five-minute, board-level view of contract risk and commercial exposure, then walk away with a shareable artifact.

1. **Role switch to Executive-style view.** From the dashboard, David (or the presenter, on his behalf) opens **Insights**, which is the closest analog to Malbek's own BusinessIQ.
2. **Top-line tiles.** He sees portfolio value, active contract count, overall risk distribution (critical/high/medium/low), and renewal exposure at a glance — all computed from live data, not hardcoded numbers.
3. **Risk distribution chart.** He clicks into the risk chart and sees it's not just a count — hovering a segment shows which specific contracts contribute to "critical" risk, each clickable through to its detail page.
4. **Renewal pipeline.** He reviews the same 30/60/90-day renewal view Elena used, understanding it as the "revenue leakage / exposure" story BusinessIQ is built to tell.
5. **Export.** He clicks **"Export Executive Report."** The app generates a board-ready summary document reflecting current portfolio state (risk summary, renewal exposure, cycle time, flagged contracts) and downloads it.
6. **Outcome.** David has a tangible artifact — proof the dashboard isn't just a pretty screen but a real reporting layer he could hand to a board today, and (in the demo context) proof the candidate understands that executives want *artifacts*, not just dashboards.

---

## Journey 4 — Legal Counsel: "Track a contract through amendment and approval"

**Persona:** Priya, In-House Counsel
**Goal:** Confirm what actually changed in an amended vendor agreement and move it through internal approval.

1. **Open the base contract.** Priya opens the seeded "MSA — Amendment 1" pair from Demo Mode and lands on the base version's detail page.
2. **Versions tab.** She switches to **Versions**, sees v1 (original) and v2 (amendment) listed with labels and change summaries, and clicks **"Compare v1 → v2."**
3. **Diff view.** The comparison view shows clause-level changes: which clauses were added, removed, or modified, with modified clauses shown in an inline before/after diff (not just a raw text diff) — she immediately sees the payment terms clause changed from Net 30 to Net 45 and a new SLA clause was added.
4. **Approvals tab.** Satisfied the amendment is acceptable, she switches to **Approvals** and sees the ordered workflow: Legal (her step, currently pending) → Finance → Executive.
5. **Approve the step.** She approves her step with an optional comment. The UI immediately shows Finance's step becoming active, and an activity log entry ("Priya approved — Legal step") is recorded.
6. **Activity log.** She checks the **Activity** tab to confirm a full timeline of the contract's lifecycle — upload, extraction, version comparison, and now her approval — all timestamped.
7. **Outcome.** Priya has verified the exact commercial change in the amendment and moved the contract forward in a visible, auditable workflow, without needing to cross-reference a separate email thread or spreadsheet.
