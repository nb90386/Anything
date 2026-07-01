# System Design - Malbek Contract Intelligence Copilot

> Independent portfolio demo, not affiliated with Malbek Inc. This document describes the actual architecture of the v1 build: a Next.js 14 App Router application with a local SQLite data layer and a pluggable AI provider abstraction.

## 1. Goals of This Architecture

- Run entirely locally with zero external dependencies by default (`npm install && npm run dev` is the whole setup).
- Keep the AI layer swappable (mock → Anthropic/OpenAI) without touching feature code.
- Keep the data layer swappable (SQLite → Postgres) without a rewrite, by isolating all persistence behind a repository-style data access layer.
- Favor a normalized relational model over convenience JSON blobs, so every feature (dashboard, search, chat) reads structured data rather than re-parsing AI output.

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14, App Router | Co-locates UI and API routes; server components avoid shipping parsing/AI logic to the client |
| Language | TypeScript (strict mode) | Type safety across API boundaries and the data model |
| Styling | Tailwind CSS | Fast iteration, consistent design tokens across role-based views |
| Motion | Framer Motion | Diff highlighting, risk-severity transitions, dashboard chart entrances |
| Database | better-sqlite3 (local file, `data/app.db`) | Zero external setup; synchronous API keeps API route handlers simple; file-based DB fits a demo perfectly |
| File parsing | pdf-parse (PDF), mammoth (DOCX) | Mature, dependency-light libraries for server-side text extraction |
| Validation | zod | Runtime validation at every API boundary (see `security-model.md`) |
| Testing | Vitest (unit), Playwright (e2e) | Vitest for extraction/scoring logic, Playwright for the upload-to-export critical path |

## 3. Next.js App Router Structure

```
src/
  app/
    layout.tsx                 # root layout, role-switcher provider, theme
    page.tsx                   # portfolio dashboard (home)
    contracts/
      [id]/
        page.tsx               # contract detail (summary/clauses/risks/obligations tabs)
        versions/page.tsx      # version list + diff view
        approvals/page.tsx     # approval workflow
        chat/page.tsx          # per-contract AI chat
    insights/
      page.tsx                 # BusinessIQ-style commercial insights dashboard
    search/
      page.tsx                 # cross-repository search
    upload/
      page.tsx                 # upload / demo-seed entry point
    api/
      contracts/
        route.ts               # GET (list), POST (create/ingest)
        [id]/
          route.ts             # GET (detail)
          chat/route.ts        # POST (ask a question)
          versions/route.ts    # GET (list), POST (add version)
          approve/route.ts     # POST (advance approval step)
      search/route.ts          # GET (cross-repo search)
      insights/route.ts        # GET (portfolio aggregates)
      export/
        [id]/route.ts          # GET (executive report for one contract or 'portfolio')
      demo/
        reset/route.ts         # POST (reseed demo data)
  lib/
    db/
      client.ts                # better-sqlite3 singleton + migration runner
      schema.sql                # table definitions (see data-model.md)
      repositories/            # one module per entity: contracts.ts, clauses.ts, risks.ts, obligations.ts, approvals.ts, activity.ts, chatMessages.ts, versions.ts
    ai/
      provider.ts               # AIProvider interface + factory (reads AI_PROVIDER env var)
      providers/
        mockProvider.ts         # deterministic rule/regex/heuristic engine (default)
        anthropicProvider.ts    # documented hook, disabled unless ANTHROPIC_API_KEY set
        openaiProvider.ts       # documented hook, disabled unless OPENAI_API_KEY set
      extraction/
        clauseClassifier.ts     # keyword/regex-based classification into 14 categories
        riskHeuristics.ts       # risk severity + recommendation rules
        obligationExtractor.ts  # date/party/type extraction
      search/
        tfidf.ts                # local TF-IDF index + cosine similarity
      chat/
        retrieval.ts            # clause retrieval + answer synthesis for per-contract chat
    parsing/
      pdf.ts                     # pdf-parse wrapper
      docx.ts                    # mammoth wrapper
    validation/
      schemas.ts                 # zod schemas shared by API routes and forms
    demo/
      seedData.ts                 # the 8 sample contracts + amendment pair, as structured fixtures
  components/                    # UI components (RoleSwitcher, RiskBadge, ClauseCard, DiffView, ApprovalTimeline, etc.)
```

## 4. AI Provider Abstraction

All AI-driven features (summary, clause classification, risk extraction, obligation extraction, chat, and - conceptually - future drafting features) go through one interface:

```ts
interface AIProvider {
  summarize(contractText: string): Promise<string>;
  classifyClauses(contractText: string): Promise<ClauseCandidate[]>;
  extractRisks(clauses: ClauseCandidate[]): Promise<RiskCandidate[]>;
  extractObligations(contractText: string, clauses: ClauseCandidate[]): Promise<ObligationCandidate[]>;
  answerQuestion(question: string, contract: ContractContext): Promise<ChatAnswer>;
}
```

- **`mockProvider`** (default, `AI_PROVIDER=mock`): a deterministic engine - regex/keyword clause segmentation, a rules table mapping clause patterns to risk severity/recommendation, date/party pattern extraction for obligations, and TF-IDF retrieval feeding a templated answer synthesizer for chat. It is genuinely functional (structured, source-cited output), not a canned demo response - the same contract always produces the same analysis, which also makes it deterministic for tests.
- **`anthropicProvider`** / **`openaiProvider`**: documented, code-complete hooks that call the respective chat completion APIs with a prompt that requests the same structured JSON shape the mock provider returns (so downstream code - UI, DB writes - is provider-agnostic). Activated only when `AI_PROVIDER=anthropic|openai` **and** the corresponding API key env var is present; the app fails closed to the mock provider with a console warning if the key is missing, rather than crashing.
- A single factory function (`getAIProvider()`) reads `process.env.AI_PROVIDER` once per server process and returns the appropriate implementation; feature code never imports a concrete provider directly.

## 5. Data Layer

- `better-sqlite3` opens `data/app.db` as a singleton on first import, synchronously, which fits Next.js API route handlers well (no connection pooling complexity).
- A lightweight migration runner applies `schema.sql` (idempotent `CREATE TABLE IF NOT EXISTS`) on startup - see `docs/architecture/data-model.md` for the full table list.
- All queries go through per-entity repository modules using **parameterized queries only** (`db.prepare(...).run(params)`), never string-concatenated SQL - see `docs/architecture/security-model.md`.
- Demo seed data (`lib/demo/seedData.ts`) is inserted via the same repository layer used by real ingestion, so seeded contracts exercise the identical code path as an uploaded contract.

## 6. Request Flow (Text Diagrams)

### 6.1 Contract upload → extraction

```
Browser (upload/page.tsx)
   │  POST /api/contracts (multipart file)
   ▼
API route: app/api/contracts/route.ts
   │  1. zod-validate metadata fields
   │  2. parsing/pdf.ts or parsing/docx.ts → plain text
   │  3. ai/provider.ts → getAIProvider()
   │       summarize() ─────────────► contract.summary (persisted on contracts row)
   │       classifyClauses() ──────► clauses repository (bulk insert)
   │       extractRisks(clauses) ──► risks repository (bulk insert, FK to clause_id)
   │       extractObligations() ───► obligations repository (bulk insert)
   │  4. contract_versions: insert v1 with full text
   │  5. activity: insert "uploaded" + "analyzed" events
   ▼
Response: { contract, clauses, risks, obligations }
   │
   ▼
Browser redirects to /contracts/[id]
```

### 6.2 Per-contract chat

```
Browser (chat/page.tsx)
   │ POST /api/contracts/[id]/chat { question }
   ▼
API route
   │ 1. zod-validate { question: string }
   │ 2. load contract's clauses from DB
   │ 3. ai/chat/retrieval.ts: TF-IDF match question against clause text
   │ 4. getAIProvider().answerQuestion(question, { topClauses })
   │ 5. persist chat_messages row (role=user, then role=assistant with cited_clause_ids)
   ▼
Response: { answer, citedClauseIds }
```

### 6.3 Cross-repository search

```
Browser (search/page.tsx)
   │ GET /api/search?q=...
   ▼
API route
   │ 1. load all clauses/contracts text (in-memory corpus, rebuilt per request for demo scale)
   │ 2. lib/ai/search/tfidf.ts: build/query TF-IDF vectors, cosine similarity rank
   ▼
Response: { results: [{ contractId, clauseId, snippet, score }] }
```

### 6.4 Insights dashboard

```
Browser (insights/page.tsx)
   │ GET /api/insights
   ▼
API route
   │ aggregate queries across contracts/obligations/approvals/risks tables:
   │   - spend by department/type (GROUP BY on contracts.value)
   │   - risk distribution (GROUP BY on risks.severity)
   │   - renewal pipeline (WHERE expiration_date BETWEEN now AND now+90d)
   │   - avg approval cycle time (approvals.decided_at deltas per contract)
   ▼
Response: { spend, riskDistribution, renewalPipeline, cycleTime }
```

## 7. Deployment Notes

- **Vercel-compatible for the Next.js app itself** - the frontend/API routes deploy cleanly to Vercel's serverless/edge runtime.
- **Constraint: `better-sqlite3` requires a persistent, writable local filesystem.** Vercel's serverless functions are ephemeral and read-only outside `/tmp`, so a SQLite file written during one invocation is not guaranteed to persist or be visible to the next. This makes the current data layer **suitable for local demo/dev and for single-process deployments (e.g., a small VM, Docker container, Railway/Fly.io/Render instance with a persistent volume) but not for Vercel's default serverless deployment model.**
- **Upgrade path:** because all persistence goes through the repository layer (`lib/db/repositories/*`), swapping `better-sqlite3` for a Postgres client (e.g., `postgres.js` or Prisma against Supabase/Neon/RDS) means rewriting the repository implementations only - API routes, extraction logic, and UI are unaffected. This is the recommended next step before any real hosted deployment, and is called out explicitly in `docs/product/feature-roadmap.md` under "Next."
- For a pure demo/portfolio walkthrough (the actual current use case), running locally (`npm run dev`) or in a single persistent container is the intended deployment target - not production Vercel hosting.
