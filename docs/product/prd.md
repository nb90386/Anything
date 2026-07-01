# PRD - Malbek Contract Intelligence Copilot

> Independent portfolio demo, not affiliated with Malbek Inc. This PRD documents the v1 scope as actually built: a local-first, offline-capable Next.js application with a deterministic AI layer and an optional real-LLM upgrade path.

## 1. Summary

Malbek Contract Intelligence Copilot is a single-tenant, local-first web app that ingests contracts (upload or seeded demo data), extracts structured intelligence (clauses, risks, obligations) with source-level traceability, and exposes that intelligence through role-specific dashboards, a single-document AI chat, cross-repository search, amendment diffing, an approval-workflow simulation, and an exportable executive report.

## 2. Goals

- **G1 - Prove domain modeling depth.** Represent contracts, versions, clauses, risks, obligations, approvals, and activity as normalized, related entities that other features query, not a single blob of AI text.
- **G2 - Make every AI output explainable.** Every risk, clause classification, and chat answer must cite the clause(s) or source text it was derived from.
- **G3 - Demonstrate portfolio-level synthesis.** At least two features (BusinessIQ-style dashboard, cross-repository search) must reason across the whole contract set, not one document at a time.
- **G4 - Zero-friction demo.** The app must run locally with no external services, API keys, or network calls required (`AI_PROVIDER=mock` by default), and seed itself with realistic sample contracts on first run.
- **G5 - Show a credible upgrade path.** The AI provider and the SQLite data layer must be abstracted cleanly enough that swapping in a real LLM (Anthropic/OpenAI) or a hosted Postgres database is a configuration change, not a rewrite.

## 3. Non-Goals

- Real user authentication, multi-tenancy, or account management.
- Real e-signature integration (DocuSign/Adobe Sign).
- Real third-party integrations (Salesforce, SAP, Slack) - these are referenced only in roadmap/architecture docs as future direction.
- Production-grade legal accuracy of AI-generated risk assessments - outputs are illustrative, not legal advice, and the app should say so.
- Concurrent multi-user editing or real-time collaboration.
- Mobile-native app (responsive web only).

## 4. Functional Requirements by Feature Area

### 4.1 Contract Ingestion
- FR-1: Users can upload a PDF, DOCX, or plain-text contract file (max 10 MB) via a drag-and-drop or file-picker UI.
- FR-2: Uploaded files are parsed server-side (`pdf-parse` for PDF, `mammoth` for DOCX) into plain text before any downstream processing.
- FR-3: Users can instead load any of 8+ seeded demo contracts (MSA, NDA, SaaS Subscription, Procurement, DPA, Reseller, SOW, Employment) plus one Amendment pair, with one click, no file needed.
- FR-4: On ingestion, the app automatically runs clause classification, risk extraction, and obligation extraction and persists the results before returning the user to the contract detail view.

### 4.2 AI Extraction (Summary, Risk, Clauses, Obligations)
- FR-5: Every contract detail page shows an AI-generated plain-language summary (3-6 sentences).
- FR-6: Contract text is segmented and classified into up to 14 clause categories (liability, indemnification, termination, payment, confidentiality, IP, governing law, SLA, renewal, data privacy, non-compete, force majeure, warranty, assignment). Unclassified text is not forced into a category.
- FR-7: Each identified risk has a severity (low/medium/high/critical), a category, a plain-language recommendation, and a link to the source clause.
- FR-8: Obligations are extracted with description, responsible party, type, due date (if determinable), and status (upcoming/due soon/overdue/complete), computed relative to the current date.
- FR-9: All extraction results are structured records (not free text) so they can be queried, filtered, and aggregated elsewhere in the app.

### 4.3 Amendment / Version Comparison
- FR-10: A contract can have multiple versions; each version stores full text, a change summary, and metadata (label, created date/author).
- FR-11: A diff view shows clause-level and text-level changes between any two versions of a contract, distinguishing additions, deletions, and modifications.
- FR-12: The seeded demo set includes at least one base contract + amendment pair specifically to exercise this feature out of the box.

### 4.4 Approval Workflow Simulation
- FR-13: Each contract has an ordered sequence of approval steps, each with a role (Legal, Finance, Executive, etc.), an approver name, and a status (pending/approved/rejected).
- FR-14: Users can advance the workflow (approve/reject a step) and see the change reflected immediately, with an activity log entry created.
- FR-15: The UI visually distinguishes completed, active, and blocked steps, and surfaces how long a contract has sat at its current step.

### 4.5 Portfolio Dashboard & BusinessIQ-Style Insights
- FR-16: A portfolio dashboard aggregates all contracts by status, type, department, and risk level.
- FR-17: A commercial-insights ("BusinessIQ-style") view shows spend by department and contract type, risk distribution across the portfolio, a renewal pipeline (contracts expiring in the next 30/60/90 days), and average approval cycle time.
- FR-18: All aggregate figures are computed from the underlying structured data (not hardcoded), so they update as contracts are added or change.

### 4.6 AI Chat Over a Single Contract
- FR-19: Each contract has a chat interface where a user can ask natural-language questions about that contract only.
- FR-20: Answers are retrieval-based: relevant clauses are selected via keyword/similarity matching against the question, and the response cites the specific clause(s) used.
- FR-21: Chat history persists per contract and is visible on revisit.

### 4.7 Cross-Repository Search
- FR-22: A global search lets users query across all ingested contracts using natural language or keywords.
- FR-23: Relevance ranking uses local TF-IDF/cosine-similarity scoring computed at query time - no external vector database or network call.
- FR-24: Results show the matching contract, the matching clause/snippet, and a relevance indicator.

### 4.8 Role-Based Views
- FR-25: A lightweight, client-side role switcher (Legal / Sales / Finance / Procurement) changes which dashboard widgets and default views are emphasized, without requiring login.
- FR-26: Role switching is instant and does not gate access to any data (this is a UX lens, not an authorization boundary - documented explicitly in the security model).

### 4.9 Executive Report Export
- FR-27: Users can export a board-ready summary report (portfolio risk, renewal exposure, cycle time, key flags) as a downloadable document from the insights view.
- FR-28: The export reflects live data at time of export, not a static snapshot.

### 4.10 Demo Mode & AI Provider Abstraction
- FR-29: A "reset demo data" action restores the seeded contract set to its original state at any time.
- FR-30: The AI provider is selected via `AI_PROVIDER` env var (`mock` | `anthropic` | `openai`); the mock provider is fully functional offline and is the default. No API key is required to run or demo the app.

## 5. Success Metrics (Demo/Portfolio Context)

This is a portfolio artifact, not a SaaS product - metrics are about demo quality and credibility, not usage/revenue:

| Metric | Target |
|---|---|
| Time from `npm install` to a working demo | Under 5 minutes, zero external accounts/keys |
| Cold-start seed time (demo mode reset) | Under 3 seconds |
| Feature areas fully clickable in a live 5-7 min demo | All 9 (ingestion, extraction, diff, approvals, dashboard, insights, chat, search, export) |
| AI outputs with a visible source citation | 100% of risks, clause classifications, and chat answers |
| Unit test coverage on extraction/scoring logic | Meaningful coverage on clause classification, risk heuristics, obligation status computation, TF-IDF search |
| E2E test coverage on critical path | Upload → extract → view risk → chat → export, as a Playwright flow |
| Reviewer reaction (qualitative) | A CLM-industry reviewer recognizes the domain model as "real," not a UI mockup |

## 6. Explicitly Deferred (Out of Scope for v1)

- Real authentication/SSO, RBAC enforcement, multi-tenant data isolation
- Postgres/Supabase or any hosted database (SQLite file only; see architecture doc for upgrade path)
- Real e-signature, CRM, or ERP integrations
- Live LLM calls enabled by default (supported via config, not the demo default)
- Redlining/collaborative editing of contract text
- Contract drafting from templates or deal parameters
- Mobile-native apps
- Multi-language contract support
- Audit-grade compliance logging (SOC 2, encryption at rest) - see `docs/architecture/security-model.md` for the honest gap analysis
