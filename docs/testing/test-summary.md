# Test Summary

Last verified: 2026-07-01, against `npm run build` (production build) + `npm run db:seed`.

## Quality gates — status

| Gate | Status | Command |
|---|---|---|
| TypeScript strict, zero errors | ✅ Pass | `npm run typecheck` |
| ESLint, zero errors | ✅ Pass (14 pre-existing `no-explicit-any` warnings, see below) | `npm run lint` |
| Production build succeeds | ✅ Pass — all 13 routes compile | `npm run build` |
| Unit tests | ✅ 36/36 passing | `npm test` |
| End-to-end tests | ✅ 10/10 passing | `npm run test:e2e` |
| App starts and serves | ✅ Pass | `npm run dev` / `npm start` |
| Zero console/page errors on golden path | ✅ Verified via a scripted Playwright pass over all 9 pages + dark mode + role switch | — |

## Unit tests (36 tests, `tests/unit/`)

Coverage focuses on the deterministic mock AI engine — the part of the app doing genuine "intelligence" work,
where correctness actually matters and is fully testable without any external service:

- **`segment.test.ts`** — numbered-heading clause segmentation, paragraph-fallback splitting, noise filtering.
- **`classify.test.ts`** — clause category classification (liability/termination/confidentiality/fallback),
  clause-level risk heuristics (uncapped liability → critical, standard cap → low, sole-discretion termination →
  high, broad non-compete → high, no-match → low/null), portfolio risk aggregation and scoring.
- **`obligations.test.ts`** — absolute-date extraction, relative "within N days of the Effective Date" extraction,
  no-false-positive on non-trigger sentences, party attribution (us vs. counterparty), and due-date → status
  bucketing (overdue/due_soon/upcoming) against a fixed reference date.
- **`text-search.test.ts`** — tokenization/stopword removal, cosine similarity edge cases (identical vectors,
  disjoint vectors), relevance ranking, and snippet extraction.
- **`engine.test.ts`** — full `MockAnalysisEngine.ingest()` pipeline end-to-end (segmentation → classification →
  risk → obligations, on a realistic multi-clause sample), determinism across repeated runs, and `chat()` behavior
  (risk-question handling with citations, graceful no-match fallback).
- **`summary.test.ts`** — `buildSummary()` overview/highlights generation across risk and obligation states.

## End-to-end tests (10 tests, `tests/e2e/demo-flow.spec.ts`, Playwright)

Drives a real Chromium browser against the production build:

1. Landing page renders and links into the app
2. Dashboard shows real portfolio KPIs
3. Contracts list shows seeded contracts and links to detail
4. Contract detail page — Overview/Clauses/Risks/Obligations tabs all render real data
5. AI chat panel answers a question and gets a response
6. BusinessIQ insights page renders real charts
7. Search finds contracts by clause content
8. Approvals queue renders
9. **Upload page ingests a pasted contract end-to-end** — fills the form, submits, waits for real
   segmentation/classification/risk extraction to complete, and asserts the new contract detail page renders
10. Dark mode toggle switches the theme

Run with `npm run test:e2e` (spins up its own production build + server on port 3100automatically).

## Manual verification

In addition to the automated suite, every page was driven through a full scripted browser pass (landing → dashboard
→ contracts list → contract detail, all 6 tabs → AI chat → BusinessIQ → approvals (including a live approve action)
→ upload (sample quick-action) → search → version-diff compare view → dark mode → role switcher), with zero
JavaScript console errors and zero uncaught page errors observed. Screenshots were reviewed for visual correctness,
including dark mode.

## Known non-issues encountered during development

Two artifacts were investigated and confirmed **not** to be app bugs:

- A Framer Motion entrance animation briefly showing low-opacity content when a screenshot was captured mid-transition
  — a test-script timing issue (no wait after client-side navigation), not visible to a real user clicking through
  at normal speed.
- A stale-chunk `ChunkLoadError` seen once during iterative local testing, traced to a Next.js production server
  process left running across a rebuild (classic "rebuilt `.next` under a live server" issue) — resolved by always
  stopping the server before rebuilding. Not a defect in the app itself.

One real bug **was** found and fixed via this testing process: the BusinessIQ "Avg. Cycle Time" metric always
computed ~1 day because seeded sample contracts had no realistic creation-to-signature gap. Fixed by backdating
seed-only `createdAt` timestamps by a type-appropriate cycle length (see `src/lib/ingest.ts`), and a form-field
accessibility gap (`<label>` not associated to its input via `htmlFor`/`id`) was fixed in the upload form after the
e2e test for `getByLabel` surfaced it.

## What isn't covered

- No visual regression testing (screenshot diffing) — spot-checked manually instead.
- No load/performance testing — this is a single-user local demo, not a production service.
- The real-LLM providers (`AnthropicAnalysisEngine`, `OpenAIAnalysisEngine`) are not covered by automated tests
  since they require a live API key and network access; they are structurally type-checked and share the same
  interface contract as the fully-tested mock engine.
