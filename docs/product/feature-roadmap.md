# Feature Roadmap — Malbek Contract Intelligence Copilot

> Independent portfolio demo, not affiliated with Malbek Inc. This roadmap is written the way a real product manager would frame it: what's actually shipped in the v1 demo, what's the credible next iteration, and what's a longer-term bet — including the honest infrastructure trade-offs made to ship a solo, time-boxed project.

---

## Now — What's Built in the v1 Demo

Everything below is implemented and demoable offline, with no external accounts or API keys required.

- **Contract ingestion** — PDF/DOCX/text upload (`pdf-parse`, `mammoth`) plus one-click seeded demo contracts (MSA, NDA, SaaS Subscription, Procurement, DPA, Reseller, SOW, Employment, and an Amendment pair).
- **AI extraction pipeline** — summary generation, 14-category clause classification, risk extraction with severity/recommendation, and obligation extraction with due dates and status — all running through a deterministic, offline mock AI engine by default (`AI_PROVIDER=mock`).
- **Source-traceable outputs** — every risk and clause classification links back to the exact source text that produced it.
- **Amendment/version diffing** — clause-level comparison between any two versions of a contract.
- **Approval workflow simulation** — ordered, role-gated approval steps (Legal, Finance, Executive, etc.) with status tracking and activity logging.
- **Portfolio dashboard** — aggregate view across the full contract set by status, type, department, and risk.
- **BusinessIQ-style insights dashboard** — spend by department/type, risk distribution, 30/60/90-day renewal pipeline, average approval cycle time.
- **AI chat over a single contract** — retrieval-based Q&A that cites the clauses it drew from.
- **Cross-repository search** — local TF-IDF/cosine-similarity relevance ranking across all contracts, no external vector DB.
- **Role-based views** — lightweight client-side switcher for Legal/Sales/Finance/Procurement perspectives over the same data.
- **Executive report export** — downloadable, board-ready summary generated from live portfolio data.
- **Demo mode** — one-click reset to a rich, realistic seeded dataset.
- **Provider abstraction** — clean interface so `AI_PROVIDER=anthropic|openai` can be enabled via env var without touching feature code.
- **Local persistence** — `better-sqlite3` file database, zero external setup.
- **Test coverage** — Vitest unit tests on extraction/scoring logic, Playwright e2e tests on the critical upload-to-export path.

---

## Next — The Credible Following Iteration

These are the changes a real team would prioritize immediately after this demo, if greenlit as an actual product initiative:

- **Live LLM provider hardening.** Wire up the `anthropic`/`openai` provider paths for production use: streaming responses, retry/backoff, cost/token guardrails, and a graceful fallback to the mock engine on provider failure.
- **Real authentication.** Replace the client-side role switcher with actual session-based auth (see `docs/architecture/security-model.md`) and enforce role-based access at the API layer, not just the UI.
- **Postgres migration.** Move off the local SQLite file to a hosted Postgres instance (the data layer is already designed to make this a swap, not a rewrite — see `docs/architecture/system-design.md`).
- **Multi-tenant data isolation.** Support more than one organization's contract set in the same deployment, with row-level isolation.
- **Bulk ingestion.** Batch upload of an entire contract folder/zip, with a queue and progress UI instead of one-at-a-time upload.
- **Clause library / playbook configuration.** Let a legal team define their own "acceptable range" per clause category so risk scoring reflects their actual playbook instead of generic heuristics.
- **Richer diffing.** Extend amendment diffing to track cumulative drift across 3+ amendments to the same base contract, not just pairwise comparison.
- **Audit-grade activity log.** Expand the activity table into a genuine, exportable audit trail suitable for compliance review.

---

## Later — Longer-Term Bets

These represent the direction the product could grow toward if it were a real, funded CLM offering rather than a demo — deliberately speculative and framed as bets, not commitments:

- **Real integrations.** Salesforce (bi-directional sync), SAP/NetSuite (procurement/finance), Slack/Teams (approval notifications), DocuSign/Adobe Sign (e-signature handoff) — mirroring the integration surface enterprise CLM buyers expect as baseline.
- **AI-assisted redlining and negotiation.** A drafting/negotiation copilot that proposes fallback clause language during a simulated redline, grounded in the org's own playbook and negotiation history.
- **Cross-contract risk aggregation at scale.** "Which of our 400 contracts have an MFN clause that conflicts with this new deal" — true portfolio-wide reasoning beyond dashboard aggregation, likely requiring a proper vector index once the corpus outgrows local TF-IDF.
- **Vendor/counterparty concentration graph.** Aggregate exposure to a single counterparty across all their related contracts, visualized as a relationship graph.
- **Agentic workflow actions.** Move from "surface information" to "take bounded action" — e.g., auto-drafting a renewal-notice email when an obligation hits "due soon," pending human approval.
- **Enterprise-readiness track.** SSO/SAML, full RBAC, encryption at rest, SOC 2 readiness — see `docs/architecture/security-model.md` for the specific, honest gap list this would need to close.
- **Multi-language contract support.** Normalize extracted terms from non-English contracts into the same structured schema.

---

## Explicitly Not Planned

To keep the roadmap honest, a few things are deliberately excluded even from "Later," because they'd change what this product is rather than extend it:

- Becoming a full e-signature product (DocuSign/Adobe Sign integration is the intended path, not a native competitor).
- Contract drafting-from-scratch as a primary use case — this product's core value is intelligence over existing contracts, not authoring.
- A generic document-management platform — scope stays anchored to contract lifecycle intelligence, not file storage broadly.
