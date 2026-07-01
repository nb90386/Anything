# Data Model - Malbek Contract Intelligence Copilot

> Independent portfolio demo, not affiliated with Malbek Inc. This document is the full entity/relationship reference for the SQLite schema (`lib/db/schema.sql`), accessed exclusively through parameterized-query repository modules (see `docs/architecture/security-model.md`, Section 5).

## 1. Design Principles

- **Structured over blob.** AI outputs (clauses, risks, obligations) are first-class rows with foreign keys, not JSON dumped into a `contracts.ai_output` column. This is what lets the dashboard, search, and chat features all query the same underlying facts instead of re-parsing text.
- **Source traceability by construction.** `clauses` is the join point between raw contract text and every derived insight - `risks` and `chat_messages.cited_clause_ids` point back to specific clause rows, not to free-floating text.
- **Versioning is explicit.** `contract_versions` and `clauses.version_id` mean a clause always belongs to a specific version of the document, which is what makes amendment diffing possible without guesswork.
- **SQLite-appropriate typing.** SQLite is dynamically typed; the "Type" column below documents the *intended* application-level type (enforced via zod at the API boundary), with the SQLite storage class noted in parentheses where it matters.

## 2. Entity-Relationship Overview (Text Diagram)

```
contracts 1───* contract_versions
contracts 1───* clauses ────* (belongs to one) contract_versions
contracts 1───* risks ───── (0..1) clauses
contracts 1───* obligations
contracts 1───* approvals
contracts 1───* activity
contracts 1───* chat_messages
```

Every child table carries a `contract_id` foreign key so portfolio-wide aggregation (dashboard, insights, search) never needs to join through more than one hop from `contracts`.

## 3. Table: `contracts`

The root entity - one row per contract (independent of how many versions/amendments it has).

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK, UUID) | |
| `title` | TEXT, required | e.g., "MSA - Acme Vendor Services" |
| `counterparty` | TEXT, required | The other party's name |
| `type` | TEXT, required | Enum: `MSA`, `NDA`, `SaaS Subscription`, `Procurement`, `DPA`, `Reseller`, `SOW`, `Employment`, `Amendment`, `Other` |
| `status` | TEXT, required | Enum: `draft`, `in_review`, `approved`, `active`, `expired`, `terminated` |
| `department` | TEXT | Enum: `Legal`, `Sales`, `Finance`, `Procurement`, `Engineering`, `HR`, `Other` |
| `owner_name` | TEXT | Internal owner of record (display name, not a user FK - no auth system in this demo) |
| `value` | REAL | Total contract value; nullable for non-monetary agreements (e.g., NDA) |
| `currency` | TEXT | ISO 4217 code, e.g., `USD`; default `USD` |
| `effective_date` | TEXT (ISO date) | |
| `expiration_date` | TEXT (ISO date) | Nullable for evergreen/no-fixed-term agreements |
| `auto_renew` | INTEGER (bool 0/1) | |
| `renewal_notice_days` | INTEGER | Days of notice required before auto-renewal locks in; drives obligation generation |
| `risk_score` | REAL | Computed aggregate (0-100) from associated `risks` rows; recalculated on extraction |
| `file_name` | TEXT | Original uploaded filename; null for seeded demo contracts |
| `source` | TEXT | Enum: `upload`, `demo_seed` |
| `created_at` | TEXT (ISO datetime) | |
| `updated_at` | TEXT (ISO datetime) | |

**Relationships:** parent of `contract_versions`, `clauses`, `risks`, `obligations`, `approvals`, `activity`, `chat_messages` (all via `contract_id`, `ON DELETE CASCADE`).

## 4. Table: `contract_versions`

One row per document version, including the original upload (v1) and any amendments.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK, UUID) | |
| `contract_id` | TEXT (FK → `contracts.id`) | |
| `version_number` | INTEGER, required | 1, 2, 3... monotonic per contract |
| `label` | TEXT | e.g., "Original", "Amendment 1 - Payment Terms Update" |
| `content` | TEXT, required | Full extracted plain text of this version |
| `change_summary` | TEXT | AI- or user-provided description of what changed vs. the prior version; null for v1 |
| `created_at` | TEXT (ISO datetime) | |
| `created_by` | TEXT | Display name of uploader/author (no auth FK) |

**Relationships:** belongs to `contracts`; parent of `clauses` (via `version_id`). `UNIQUE(contract_id, version_number)`.

## 5. Table: `clauses`

The atomic unit of extracted structure - one row per identified clause within a specific version.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK, UUID) | |
| `contract_id` | TEXT (FK → `contracts.id`) | Denormalized for fast portfolio-wide clause queries (search, insights) without joining through versions |
| `version_id` | TEXT (FK → `contract_versions.id`) | The specific version this clause instance belongs to |
| `category` | TEXT, required | One of the 14: `liability`, `indemnification`, `termination`, `payment`, `confidentiality`, `ip`, `governing_law`, `sla`, `renewal`, `data_privacy`, `non_compete`, `force_majeure`, `warranty`, `assignment` |
| `heading` | TEXT | Section heading as it appears in source, if detectable |
| `text` | TEXT, required | The clause's source text - this is what risk flags and chat citations point back to |
| `risk_level` | TEXT | Enum: `none`, `low`, `medium`, `high`, `critical`; may be `none` for a clause with no associated risk |
| `risk_note` | TEXT | Short rationale, nullable |
| `sort_order` | INTEGER | Position within the document, for reconstructing reading order in the UI |

**Relationships:** belongs to `contracts` and `contract_versions`; referenced by `risks.clause_id` and `chat_messages.cited_clause_ids`.

## 6. Table: `risks`

A flagged risk, generally (but not always) tied to a specific clause.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK, UUID) | |
| `contract_id` | TEXT (FK → `contracts.id`) | |
| `clause_id` | TEXT (FK → `clauses.id`), nullable | Nullable to allow portfolio/document-level risks not tied to one clause (e.g., "missing data privacy clause") |
| `title` | TEXT, required | Short label, e.g., "Uncapped Liability" |
| `description` | TEXT, required | Plain-language explanation |
| `severity` | TEXT, required | Enum: `low`, `medium`, `high`, `critical` |
| `category` | TEXT | Mirrors clause category taxonomy where applicable, for filtering |
| `recommendation` | TEXT | Suggested mitigation, plain language |

**Relationships:** belongs to `contracts`; optionally belongs to `clauses`. Aggregated into `contracts.risk_score` and the portfolio risk-distribution insight.

## 7. Table: `obligations`

Extracted commitments with due dates, independent of the approval workflow.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK, UUID) | |
| `contract_id` | TEXT (FK → `contracts.id`) | |
| `description` | TEXT, required | e.g., "Provide 60 days' written notice before renewal" |
| `party` | TEXT | Enum: `us`, `counterparty`, `both` |
| `type` | TEXT | Enum: `renewal_notice`, `payment`, `deliverable`, `compliance`, `reporting`, `other` |
| `due_date` | TEXT (ISO date), nullable | Nullable when only a relative trigger (e.g., "30 days after termination") is extractable without an anchor date |
| `status` | TEXT, required | Enum: `upcoming`, `due_soon`, `overdue`, `complete` - computed relative to current date at read time (`due_soon` = within 14 days, `overdue` = past due and not complete) |

**Relationships:** belongs to `contracts`. Powers the renewal pipeline and obligation-tracker views; `renewal_notice` type obligations are typically derived from `contracts.renewal_notice_days` + `expiration_date`.

## 8. Table: `approvals`

Ordered, role-gated approval workflow steps for a contract.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK, UUID) | |
| `contract_id` | TEXT (FK → `contracts.id`) | |
| `step_order` | INTEGER, required | 1, 2, 3... defines sequence; a step only becomes actionable once all prior steps are `approved` |
| `approver_role` | TEXT, required | Enum: `Legal`, `Finance`, `Procurement`, `Executive`, `Sales` |
| `approver_name` | TEXT | Display name (no auth FK) |
| `status` | TEXT, required | Enum: `pending`, `active`, `approved`, `rejected` |
| `decided_at` | TEXT (ISO datetime), nullable | Null until a decision is made; used to compute approval cycle time |
| `comment` | TEXT, nullable | Optional note left by the approver |

**Relationships:** belongs to `contracts`. `UNIQUE(contract_id, step_order)`. Drives the cycle-time metric in Insights (`decided_at` deltas between consecutive steps).

## 9. Table: `activity`

Append-style event log for a contract's lifecycle (see also `security-model.md` Section 9 on audit-log limitations).

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK, UUID) | |
| `contract_id` | TEXT (FK → `contracts.id`) | |
| `actor` | TEXT | Display name or `system` for automated events (e.g., extraction) |
| `action` | TEXT, required | Enum-like string: `uploaded`, `analyzed`, `version_added`, `approval_decided`, `chat_asked`, `exported`, `demo_reset` |
| `detail` | TEXT, nullable | Free-text context, e.g., "Approved Legal step" |
| `created_at` | TEXT (ISO datetime) | |

**Relationships:** belongs to `contracts`. Read-only from the UI's Activity tab; insert-only from application code (no update/delete repository methods exposed).

## 10. Table: `chat_messages`

Per-contract AI chat history (retrieval-based, single-document scope).

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK, UUID) | |
| `contract_id` | TEXT (FK → `contracts.id`) | |
| `role` | TEXT, required | Enum: `user`, `assistant` |
| `content` | TEXT, required | The message text |
| `cited_clause_ids` | TEXT, nullable | JSON-encoded array of `clauses.id` values the assistant's answer drew from; null for `role='user'` rows |
| `created_at` | TEXT (ISO datetime) | |

**Relationships:** belongs to `contracts`. `cited_clause_ids` is the one intentional JSON-array-in-TEXT column in the schema - a deliberate exception because it's an ordered list of foreign keys rendered as citation chips in the UI, not a substitute for structured relational data elsewhere.

## 11. Cross-Cutting Notes

- **Cascade deletes:** all child tables use `ON DELETE CASCADE` on `contract_id` so demo reset (`POST /api/demo/reset`) can cleanly wipe and reseed without orphaned rows.
- **IDs:** UUIDs (generated via `crypto.randomUUID()`) rather than autoincrement integers, so seed fixtures can reference stable, human-readable IDs across `lib/demo/seedData.ts` without depending on insert order.
- **Timestamps:** stored as ISO 8601 strings (SQLite has no native datetime type); all comparisons/sorting happen either in SQL (`datetime()` functions) or in the application layer after fetch, depending on the query.
- **Computed vs. stored:** `contracts.risk_score` is stored (recomputed on each extraction run) for fast dashboard aggregation; `obligations.status` is computed at read time from `due_date` rather than stored, since "overdue" is a function of the current date, not a fact that should require a background job to keep in sync for a local demo.
