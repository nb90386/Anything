# 13 — MVP Architecture

Goal: the smallest production-credible system that verifies public PDFs and returns trustworthy, explainable findings with an evidence trail. Verification-only for the MVP; remediation is deferred until real flag rates are known (06, 12-T5).

## 1. Shape

```
Next.js (Vercel)                  Supabase (Postgres, Auth, Storage)          Worker (DigitalOcean VPS, 4 GB)
- upload / URL submit   --->      - organizations, users (RLS)        <--->  - Python job runner (poll queue table)
- report viewer                   - documents, pages, findings               - pikepdf / pdfplumber / pypdfium2
- evidence export                 - jobs (queue), evidence_log (hash chain)  - OpenDataLoader (Java) for baseline tags
                                  - storage: originals, page PNGs            - model calls (Anthropic API)
```

Why this shape: one web app plus one long-running worker. No microservices, no agent framework. A Postgres table used as a job queue (`SELECT ... FOR UPDATE SKIP LOCKED`) is enough until hundreds of documents per hour. Add Trigger.dev only if retries and scheduling become painful. The 4 GB VPS can render and parse single pages comfortably. Very large packets should be processed page by page with streaming, never loaded whole.

## 2. Pipeline per document

1. **Ingest** (deterministic): fetch from a public URL or upload; SHA-256; store the original; record source URL and retrieval time.
2. **Inspect** (deterministic): PDF version, tagged or not, language, forms, encryption, page count; split pages.
3. **Rule checks** (deterministic): PDF/UA machine checks. Use veraPDF (Java, open source) in production, since it could not be installed in this sandbox, plus the extra checks from `verifiers.rule_check`.
4. **Screen-reader serialization** (deterministic): tag tree in traversal order with text, roles, alt, form field names and tab order. Cross-page continuity for multi-page structures.
5. **Semantic judge** (AI): page image + serialization → findings by category and severity, with evidence.
6. **Second opinion on disputed findings** (AI): a different model family or a second prompt for any major finding, so one model's blind spot is less likely to decide the verdict.
7. **Report** (deterministic templating from findings): plain-language explanation and fix per finding.
8. **Evidence log** (deterministic): append-only rows hashed with the previous row's hash; export as signed JSON + PDF summary.

## 3. Where AI is used, and why

| Step | Exact job | Why AI is needed | Required accuracy | Evaluation | Failure handling | Human oversight | Cost (measured) | Privacy |
|---|---|---|---|---|---|---|---|---|
| Semantic judge | Decide whether tag roles, order and alt text match what the page visibly communicates | The mismatch is about meaning; no rule can know a bold line is a heading or a grid is a table | Agreement with blind-user task failures ≥85%; false-flagged documents ≤10% (T1 gate) | Held-out labeled set from T1 plus injected-defect regression suite; run-to-run variance | Low-confidence or disputed findings marked "needs review", never "pass" | Founder reviews disputed findings during pilots; customers can contest a finding | $0.004/page (Haiku) to $0.06/page (Sonnet) | Public documents only in MVP; zero-data-retention API terms before any non-public document |
| Second opinion | Confirm or reject a major finding | Reduces correlated errors | Should cut false flags without losing recall | Measure on held-out set | Disagreement → "needs review" | Same | Only on flagged pages (~15–30%) | Same |
| Alt text quality (later) | Judge whether alt text conveys the image's purpose | Requires image understanding | Precision ≥90% on "meaningless" flags | Labeled sample | Report as advisory | Same | Small | Same |

Where deterministic software is better than AI, and AI must not be used: fetching, hashing, parsing PDF structure, PDF/UA syntax rules, page counts, form field inventories, report templating, the evidence log, billing, and access control. The extraction engine is commodity, so use open-source tagging (OpenDataLoader) when a baseline tag tree is needed rather than paying a model to extract.

Small local models: not used for the judge. In this session Haiku was close to Sonnet on blanket defects (24/27 vs 27/27) but miscalibrated list severity, and local open-weight models were not tested. Do not assume a local model is adequate because it is cheap. Test it on the T1 set first.

## 4. Data model (core tables)

- `organizations(id, name, type, jurisdiction)`
- `users(id, org_id, role)` with Supabase Auth and row-level security by `org_id`
- `documents(id, org_id, source_url, sha256, retrieved_at, pages, tagged, lang)`
- `pages(id, document_id, n, png_path, serialization_json)`
- `findings(id, page_id, category, severity, evidence, model, prompt_version, confidence, status[open|disputed|fixed|accepted])`
- `jobs(id, document_id, state, attempts, last_error, locked_at)`
- `evidence_log(id, org_id, document_id, event, payload_json, prev_hash, hash, created_at)`
- `labels(id, page_id, tester_id, task, outcome, notes)` for the blind-user corpus, with tester consent recorded

## 5. Security and operations

- **Least privilege:** the web app uses the Supabase anon key with RLS; only the worker holds the service key, on the VPS, never in the browser or repo. The API key for the model provider lives only on the worker.
- **Data provenance:** every finding records model ID, prompt version, input hashes and time; reports are reproducible.
- **Auditability:** append-only hash-chained evidence log; exports include the chain.
- **Privacy:** the MVP accepts only public URLs or uploads the user attests are public. Before non-public documents: zero-data-retention terms with the model provider, a DPA, deletion on request, and no FERPA/HIPAA/CJIS material without a compliance review.
- **Claims discipline:** never market "compliant" or "certified" (FTC accessiBe order). Report findings and evidence only.
- **Testing:** pytest regression suite (injected defects + T1 held-out labels); Playwright end-to-end tests for upload → report; CI on GitHub Actions.
- **Observability:** structured logs from the worker; per-job timing, model cost and error rate in a Postgres table; alert on job failure via email. No dashboard until there are customers.
- **Recovery:** idempotent jobs keyed by document hash; retry with backoff; dead-letter state after three attempts; nightly Supabase backup.
- **Scale path (only when warranted):** more worker processes on the VPS; then a second VPS; batch API for model calls (about half the cost) for non-urgent archives.

## 6. Build order

1. Worker CLI that takes a PDF and prints findings (already prototyped in `experiments/c01-accessible-pdf/verify`).
2. Multi-page and form support; veraPDF integration.
3. Supabase schema + job table; worker polls.
4. Next.js upload and report pages; evidence export.
5. URL crawl of a public site's PDFs (respecting robots.txt and rate limits).
6. Vendor API endpoint with API keys and per-page metering.

Use the official Vercel and Supabase agent skills when implementation begins.
