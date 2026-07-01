# PRD: Malbek Revenue Intelligence and Contract Risk Command Center (v2 Upgrade)

> Independent portfolio demo, not affiliated with Malbek Inc. This PRD covers the v2 upgrade that rebuilds "Contract Intelligence Copilot" into "Malbek Revenue Intelligence and Contract Risk Command Center": an intelligence layer positioned above the existing v0.1 CLM feature set. See `docs/research/malbek-upgrade-research.md` for the market research this PRD is built on.

## 1. Summary

v2 keeps everything in v0.1 that already works (contract detail, version diffing, approvals, upload/parsing, the deterministic mock-AI engine, the SQLite data model) and adds a new intelligence layer: a Revenue Leakage Detector, a Contract Risk Radar, a Clause Drift Analyzer, Negotiation Intelligence briefs, an integrated Executive BusinessIQ Dashboard, Role-Based Command Centers for five personas, an AI Portfolio Copilot (upgraded from single-document chat to portfolio-wide reasoning), and a guided Demo Story Mode. The visual and interaction design is upgraded to a premium enterprise-AI standard (see `docs/design/design-direction.md`).

## 2. Goals

- **G1: Prove the "intelligence layer above a CLM" thesis in the product itself.** An executive lands on one dashboard and can pivot into Risk Radar, Revenue Leakage, or Clause Drift without leaving a coherent narrative or re-orienting to a new mental model each time.
- **G2: Make revenue and risk numbers as explainable as v0.1's clause risk already is.** Every dollar figure in the Revenue Leakage Detector and every point on the Risk Radar must be traceable, by click, to the contract and clause that produced it.
- **G3: Turn version diffing (already built) into drift analytics (net new).** The Clause Drift Analyzer is the highest-leverage module because it extends existing, working infrastructure rather than starting from zero.
- **G4: Give each of five roles (Legal, Sales, Finance, Procurement, CEO) a command center that answers their specific question first**, not a generic dashboard with a role label on it.
- **G5: Preserve the zero-friction demo property.** `AI_PROVIDER=mock` by default, seeded data, no external accounts, sub-5-minute path from `npm install` to a full walkthrough, now including a guided Demo Story Mode for unattended or low-context viewing.
- **G6: Upgrade the visual bar to match "premium enterprise AI" benchmarks** (Linear, Stripe, Vercel, Ramp, Retool) without becoming a generic AI SaaS template. See `docs/design/design-direction.md`.

## 3. Non-Goals

- Claiming to replace or out-build Malbek's actual BusinessIQ, Icertis Vera, or Sirion Optimization Insights technology. This is an intelligence-layer *demo*, not a competing commercial product.
- Real billing/invoice system integration. Revenue leakage figures are computed against a synthetic "expected vs. billed" dataset, clearly labeled as illustrative.
- A live, collaborative redlining/editing tool. Negotiation Intelligence is a synthesis/briefing feature built from existing version-history data, not a new editor.
- Real authentication, multi-tenancy, or RBAC enforcement (unchanged from v0.1; role-based views remain a UX lens, not an access boundary).
- Real third-party integrations (Salesforce, SAP, Slack, DocuSign) beyond conceptual architecture notes.
- Mobile-native apps.
- Production-grade legal or financial accuracy. All outputs remain illustrative and clearly labeled as such.

## 4. Preserved from v0.1 (not rebuilt, may be re-skinned visually)

| Capability | Status in v2 |
|---|---|
| Contract detail view (summary, clauses, risks, obligations) | Preserved; visual refresh only |
| Version/amendment diffing engine | Preserved and **extended** (becomes the data source for Clause Drift Analyzer) |
| Approval workflow simulation | Preserved; visual refresh, integrated into Sales/Legal command centers as a bottleneck signal |
| Contract upload/parsing (`pdf-parse`, `mammoth`) | Preserved unchanged |
| Deterministic mock AI engine (clause classification, risk extraction, obligation extraction) | Preserved; extended with new extraction outputs needed for leakage/drift (see 5.1, 5.4) |
| AI chat over a single contract | Preserved; superseded in primary nav by the AI Portfolio Copilot (see 5.7), but per-contract chat remains on the contract detail page |
| Cross-repository search | Preserved; surfaced inside the Copilot and command palette rather than as a standalone page only |
| SQLite + `better-sqlite3` data layer | Preserved; schema extended, not replaced |
| Executive report export (v0.1) | Preserved; upgraded and unified with the new Command Center report export (see 5.8) |
| Demo reset / seeded dataset | Preserved; seed data extended with pricing/billing/escalation fields needed for leakage calculations |

## 5. Functional Requirements by Module

### 5.1 Revenue Leakage Detector

- FR-1: The system computes, per contract, an "expected value" based on contracted pricing terms (base price, escalators, discount schedule, SLA penalty terms) and compares it against a synthetic "captured value" dataset (seeded, illustrative billing data).
- FR-2: The system flags four leakage categories: missed price escalators (an escalation clause exists and its trigger date has passed without an increase applied), uncaptured auto-renewal uplifts (a renewal occurred without an expected price step-up), discount creep (an active discount exceeds its approved/expiration terms), and unrecovered SLA penalties (an SLA breach occurred without a corresponding penalty credit/charge).
- FR-3: A single, primary "revenue at risk this quarter" figure is shown as the top-level object of the module, not buried in a report.
- FR-4: Every dollar figure is clickable and drills down to the specific contract, clause, and computed math behind it (e.g., "escalator clause specifies 3% annual increase effective Jan 1; last invoiced amount unchanged since prior year: $42,000 at risk").
- FR-5: Leakage findings can be filtered by department, contract type, and counterparty, and aggregate correctly at every filter level.
- FR-6: The module is visually and functionally linked to the Executive BusinessIQ Dashboard (a summary card links directly into the full detector) and to the Contract Risk Radar (leakage risk is one weighted input into radar positioning).
- FR-7: All leakage calculations are clearly labeled "illustrative, based on seeded demo data" in the UI, consistent with v0.1's non-goal of legal/financial accuracy.

### 5.2 Contract Risk Radar

- FR-8: A dedicated, cross-portfolio visual (not a table) plots contracts by risk concentration across at least two axes (e.g., financial exposure vs. clause-risk severity), with department, counterparty, or contract type as a selectable grouping dimension.
- FR-9: The radar is interactive: hovering/selecting a cluster or point reveals the underlying contract(s); clicking navigates to contract detail.
- FR-10: Risk positioning is computed from existing v0.1 risk-extraction data plus the new leakage and drift signals (a contract with high clause risk, active leakage, and heavy playbook drift should visibly cluster as the highest-priority zone).
- FR-11: The radar has a legible, accessible fallback state (e.g., an equivalent sortable table view) for cases where the primary visual isn't appropriate (reduced motion, small viewport, accessibility mode).
- FR-12: The radar updates live as underlying contract data changes (new upload, approval status change, demo reset).

### 5.3 Executive BusinessIQ Dashboard

- FR-13: One dashboard is the landing surface for the intelligence layer, integrating summary cards from Revenue Leakage, Risk Radar, Clause Drift, and Negotiation Intelligence, plus the preserved v0.1 portfolio aggregates (status, type, department, renewal pipeline, approval cycle time).
- FR-14: Each summary card is a real preview (a live mini-chart or key number), not a static label, and links directly into its full module.
- FR-15: `/insights` (the v0.1 BusinessIQ-style page) is **folded into this new dashboard** rather than kept as a separate, parallel page (see `docs/architecture/upgrade-plan.md` for the explicit routing decision and rationale).

### 5.4 Clause Drift Analyzer

- FR-16: The system computes drift for each tracked clause category in two dimensions: (a) deviation from a configurable "house playbook" baseline at the current version, and (b) cumulative change across the contract's full version/amendment history (extending the existing v0.1 diff engine's output rather than replacing it).
- FR-17: Drift is visualized as a trend, not just a point-in-time flag: a clause that has moved further from the playbook baseline with each amendment is visibly distinguishable from one that deviated once and stabilized.
- FR-18: A configurable house playbook (acceptable ranges per clause category: liability caps, indemnification scope, payment terms, termination notice, etc.) is editable in Settings and drives both the point-in-time deviation flag and the drift trend calculation.
- FR-19: Drift findings link back to the specific version/amendment and the specific clause text that produced them, preserving the source-traceability standard set in v0.1.
- FR-20: The seeded demo dataset includes at least one contract with a multi-amendment history specifically constructed to demonstrate visible, worsening drift over time.

### 5.5 Negotiation Intelligence Briefs

- FR-21: For any contract with more than one version, the system generates a "negotiation brief": number of negotiation rounds (derived from version count), which clause categories changed most, which party's position each change favored (directional, not adversarial framing), and how this contract's negotiation pattern compares to the portfolio's typical pattern for its contract type.
- FR-22: Briefs are generated from existing version-history and clause-classification data; this module does not require or introduce a live redlining editor.
- FR-23: A portfolio-level summary view lists all contracts with notable negotiation patterns (e.g., unusually high round count, unusual concession pattern) rather than requiring the user to open each contract individually.
- FR-24: Briefs are exportable as part of the unified report export (5.8).

### 5.6 Role-Based Command Centers (Legal, Sales, Finance, Procurement, CEO)

- FR-25: Each of five roles has a distinct landing view (not just a filtered dashboard) built around that role's primary question: Legal (clause risk and playbook compliance), Sales (deal velocity and approval bottlenecks), Finance (revenue at risk and renewal cost exposure), Procurement (vendor/counterparty concentration and SLA recovery), CEO (single-page synthesis of all four).
- FR-26: Role switching remains instant and client-side (unchanged from v0.1's security model: a UX lens, not an authorization boundary), but now changes which command center loads, not just which widgets are emphasized on one shared page.
- FR-27: Each command center reuses the same underlying data model and the same module components (Risk Radar, Revenue Leakage, Drift, Negotiation Intelligence); no role gets a fake or separately-maintained dataset.

### 5.7 AI Portfolio Copilot

- FR-28: The chat interface is upgraded from single-contract Q&A (preserved as-is on contract detail pages) to a portfolio-wide copilot accessible from a dedicated `/copilot` route and a command-palette shortcut.
- FR-29: The Copilot can answer cross-contract questions (e.g., "which contracts have both high clause risk and active revenue leakage") by querying the structured data model, and always cites the specific contracts/clauses used, consistent with v0.1's explainability standard.
- FR-30: The Copilot remains retrieval-based against local structured data by default (`AI_PROVIDER=mock`); the same provider abstraction from v0.1 applies without modification.

### 5.8 Demo Story Mode

- FR-31: A guided, narrated walkthrough mode (`/demo`) steps a viewer through the CEO demo narrative (see `docs/product/ceo-demo-story.md`) with a fixed sequence of screens, highlighted UI elements, and short contextual callouts, advancing manually (click/keyboard) rather than on a timer.
- FR-32: Demo Story Mode uses the same live data and components as the rest of the app; it is a guided tour layer, not a separate set of screenshots or a video.
- FR-33: The unified report export (referenced in 5.1, 5.4, 5.5) produces a single board-ready document combining portfolio risk, revenue leakage, drift findings, and negotiation highlights, reflecting live data at export time.

## 6. Success Criteria (Demo Context, Not SaaS Metrics)

This remains a portfolio artifact. Success is measured as demo credibility and technical completeness, not usage or revenue:

| Criterion | Target |
|---|---|
| Time from `npm install` to full v2 walkthrough | Under 5 minutes, zero external accounts/keys |
| New routes load with zero console errors | 100% (`/risk-radar`, `/revenue-leakage`, `/clause-drift`, `/copilot`, `/demo`, `/report`, `/settings`) |
| Dollar figures and risk-radar points with visible source traceability | 100% |
| Command centers with a genuinely distinct primary view per role | 5 of 5 (Legal, Sales, Finance, Procurement, CEO) |
| Modules reachable from the Executive Dashboard without a page reload feeling like a context switch | Revenue Leakage, Risk Radar, Clause Drift, Negotiation Intelligence all linked with live preview cards |
| Demo Story Mode completes a full narrated pass | Under 7 minutes, matching the CEO demo story outline |
| Unit test coverage on new calculation logic | Meaningful coverage on leakage calculation, drift scoring, radar positioning, negotiation-brief generation |
| Reviewer reaction (qualitative) | A CLM-industry reviewer recognizes this as a coherent intelligence layer, not four unrelated feature demos bolted together |

## 7. Explicitly Deferred (Out of Scope for v2)

- Real billing/ERP/CRM data integration for leakage calculations (synthetic dataset only).
- Live collaborative redlining/editing.
- Real authentication, RBAC enforcement, or multi-tenant isolation.
- Multiple configurable playbooks per business unit/region (single house playbook only in v2).
- Live LLM-backed negotiation prediction (briefs are generated from structured history data, not a predictive model).
- Postgres migration (tracked separately in `docs/architecture/system-design.md`; not required for v2 scope).
