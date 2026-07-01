# Security Model - Malbek Contract Intelligence Copilot

> Independent portfolio demo, not affiliated with Malbek Inc. This document is intentionally honest about what is and isn't implemented. Enterprise CLM buyers (and Malbek's own security posture, which emphasizes that AI inputs/outputs are never used to train third-party models) treat security as a first-order product requirement, not an afterthought - this doc reflects that mindset even where the demo itself takes shortcuts appropriate to its scope.

## 1. What This Demo Is and Isn't

This is a **single-tenant, local-first demo application**, not a production SaaS product. It is designed to be run by one person, locally, against seeded or self-uploaded demo data. It is explicitly **not** hardened for multi-user, internet-exposed, or real-contract-data use. Every gap below is documented rather than silently ignored, in line with the principle that "security-mindedness as a visible design choice" is itself a credibility signal.

## 2. Authentication & Authorization

**Current state:** There is no real authentication. The role switcher (Legal/Sales/Finance/Procurement) is a client-side UI state change only - it alters which dashboard widgets are emphasized, not what data is fetchable. Anyone with access to the running app has full read/write access to all contracts.

**Why this is acceptable for v1:** The demo's purpose is to show data-modeling and product thinking, not to simulate a login flow. Building fake auth would add surface area without adding signal.

**What real auth would look like (documented plan, not built):**
- Session-based authentication (NextAuth.js or equivalent) with credentials or SSO.
- Real RBAC: each role (Legal, Sales, Finance, Procurement, Admin) maps to actual server-side authorization checks on API routes - not just UI filtering - including field-level restrictions (e.g., only Finance/Admin can see contract `value`).
- For enterprise readiness: **SSO/SAML** (Okta, Azure AD, Google Workspace) as the primary login path, matching what mid-market/enterprise CLM buyers expect as baseline, plus SCIM for user provisioning.
- Multi-tenant data isolation with an `organization_id` on every table and row-level security enforced at the query layer, not just application logic.

## 3. Input Validation

**Current state:** Every API route validates request bodies/query params with **zod** schemas before touching the database or file system. Examples:
- Contract metadata (title, counterparty, type, department, value, dates) is validated against an enum/type/shape schema before insert.
- Chat questions are validated for type and length before being passed to the AI provider.
- Search queries are validated and length-capped before being used to build the TF-IDF query vector.

Invalid input returns a `400` with a structured error, never a raw stack trace or unvalidated pass-through to the database.

## 4. File Upload Validation

**Current state:**
- Accepted MIME types are allow-listed: PDF, DOCX, and plain text only. Any other type is rejected at the API boundary before parsing is attempted.
- File size is capped (10 MB) to prevent resource-exhaustion from oversized uploads.
- Parsing (`pdf-parse`, `mammoth`) runs against the file buffer in-memory; the app does not execute, eval, or render uploaded file content as code or markup - it is treated strictly as text input.
- Parsing failures (corrupt file, unsupported encoding) are caught and surfaced as a clean user-facing error rather than crashing the request handler.

**Not implemented (documented gap):** virus/malware scanning of uploaded files, which a real product handling arbitrary user uploads at scale would need (e.g., ClamAV or a cloud AV scanning service in the ingestion pipeline).

## 5. SQL Injection Avoidance

**Current state:** All database access goes through `better-sqlite3`'s prepared statement API (`db.prepare(sql).run(params)` / `.get(params)` / `.all(params)`). No SQL string in the codebase is built via template-literal concatenation of user input - every dynamic value is passed as a bound parameter. Repository modules (`lib/db/repositories/*`) are the only code allowed to touch the database directly, which keeps this guarantee enforceable in one place rather than scattered across API routes.

## 6. XSS Considerations

**Current state:** Two categories of untrusted text flow into the UI: (1) raw contract text (uploaded or seeded) and (2) AI-generated output (summaries, risk notes, chat answers).
- React's default JSX rendering escapes all string content by default; the app renders contract text and AI output as plain text/children, **not** via `dangerouslySetInnerHTML`, anywhere in the current codebase.
- The one place formatting matters - the diff view - highlights additions/removals using React components and CSS classes driven by a structured diff data structure (arrays of `{type, text}` segments), not by injecting raw HTML strings, which avoids the classic "diff renderer becomes an XSS vector" trap.
- AI-generated Markdown-like output (e.g., chat answers) is rendered through a constrained, escaping-safe renderer rather than raw HTML injection if/when Markdown formatting is added.

## 7. Secrets & Environment Variables

**Current state:**
- No secrets are committed to the repository. `.env.local` (gitignored) holds `AI_PROVIDER`, and optionally `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` if a live provider is enabled.
- `.env.example` in the repo documents every supported variable with a placeholder, so a reviewer can see exactly what's configurable without any real key being present.
- API keys are read server-side only (`process.env.*` inside API routes/provider modules) and are never sent to the browser bundle - Next.js's client/server module boundary is relied on here, and no `NEXT_PUBLIC_*` prefix is used for any credential.
- The mock AI provider requires zero secrets, so the default demo experience has no secret-handling surface area at all.

## 8. Data at Rest

**Current state:** Contract data (including uploaded file text) is stored unencrypted in the local SQLite file (`data/app.db`). This is acceptable for demo/synthetic data only.

**What real encryption-at-rest would require:** disk-level or column-level encryption for a hosted database (e.g., Postgres with encrypted storage volumes, or application-level encryption of contract text/PII fields), plus a key management strategy (KMS) - not implemented here, and not meaningful to fake for a local SQLite demo.

## 9. Audit Logging

**Current state:** The `activity` table records a best-effort event log (who/what/when) for actions like upload, extraction, approval decisions, and version additions - sufficient to demonstrate the *concept* of an audit trail in the UI's Activity tab.

**Gap vs. real audit logging:** this is not tamper-evident, not exported to an immutable/external log store, and not comprehensive (e.g., read access isn't logged). A production system would need write-once audit storage, correlation with an authenticated actor identity (not just a free-text name field), and retention policies aligned to compliance requirements (e.g., 7-year retention for contract-related records in some industries).

## 10. Enterprise-Readiness Gap List (Honest, Not Implemented)

| Requirement | Status in this demo | What it would take |
|---|---|---|
| SSO/SAML | Not implemented | NextAuth.js + SAML/OIDC provider integration, org-level identity federation |
| Full RBAC enforcement | Not implemented (UI-only role switch) | Server-side authorization middleware on every API route, field-level permission checks |
| Multi-tenancy | Not implemented | `organization_id` scoping on every table, tenant-aware query layer |
| Audit logging (tamper-evident) | Partial (best-effort activity log) | Immutable/append-only log store, actor identity binding, retention policy |
| Encryption at rest | Not implemented (local unencrypted SQLite) | Hosted DB with encrypted storage, KMS-managed keys, possibly column-level encryption for sensitive fields |
| Encryption in transit | Implicit (localhost/dev) | TLS termination at the hosting layer for any real deployment |
| SOC 2 / compliance readiness | Not applicable at this stage | Formal policies, access reviews, vendor risk management, third-party audit - a business process investment, not just code |
| Malware scanning on upload | Not implemented | AV scanning step in the ingestion pipeline before parsing |
| Rate limiting / abuse prevention | Not implemented | Per-IP/per-session rate limits on upload and AI-backed endpoints |

## 11. Summary Posture

For a portfolio demo running locally against synthetic/seeded contract data, the current posture (validated input, parameterized queries, no committed secrets, safe rendering, documented file-upload limits) is proportionate and reasonably careful. Every item explicitly deferred above is deferred with a stated reason and a stated plan - not silently ignored - which is itself the intended signal: knowing what "real" enterprise security requires, and being explicit about the gap between a demo and a production-ready CLM system, matters more here than pretending the gap doesn't exist.
