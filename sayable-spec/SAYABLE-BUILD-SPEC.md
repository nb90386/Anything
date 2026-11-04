# Sayable — Complete Build Specification (v1.0, November 4, 2026)

This document is self-contained. It is written to be handed to an AI assistant (ChatGPT or Claude Code) that will turn it into step-by-step build prompts, and to the founder who will build it. It describes what to build, in what order, how each part works, the exact AI prompts that were already tested, the data model, the rules that must never be broken, how to test it, and how to run the business around it.

Working code from the research phase already exists in the GitHub repository `nb90386/Anything`, branch `claude/polyalpha-research-lab-qq7cve`, folder `startup-research/experiments/`. Section 19 explains which files to reuse.

---

## 1. What Sayable is

Sayable helps cities and counties make their public documents usable for blind residents before the federal deadline of April 26, 2027. Our software scans a government's whole website and shows exactly which documents must be fixed, which can be archived, and which can be deleted. We then fix the documents that matter: AI handles the routine pages, and people fix the hard parts like forms and tables. Every file is checked before delivery, by the official accessibility validator and by our own checker that catches problems standard tools miss.

### Plain-language background (for anyone reading this cold)
- Blind people use **screen readers**, software that reads the screen aloud.
- A PDF only works with a screen reader if it contains hidden **tags**: labels saying "this is a heading", "this is a table and these are its header cells", "this box is where you type your name", plus a correct **reading order** and **alt text** for images.
- **WCAG 2.1 AA** is the web accessibility standard. **PDF/UA-1 (ISO 14289-1)** is the PDF accessibility standard. **veraPDF** is the free, official open-source validator for PDF/UA.
- **ADA Title II** (28 CFR Part 35, Subpart H, adopted 2024) requires state and local governments to meet WCAG 2.1 AA for web content and "conventional electronic documents". A DOJ interim final rule (April 20, 2026) set the compliance dates to **April 26, 2027** (public entities with population ≥ 50,000) and **April 26, 2028** (smaller entities and special districts). A lawsuit by the National Federation of the Blind could restore earlier dates; DOJ said it may propose substantive changes. Check the Federal Register before quoting dates.
- **Exceptions (28 CFR 35.201):** preexisting conventional electronic documents posted before the compliance date are excepted unless they are currently used to apply for, access, or participate in a service; archived web content (created before the compliance date, kept only for reference/research/recordkeeping, not altered, kept in a clearly marked archive area) is excepted; certain third-party content and individualized password-protected documents are excepted. **Conforming alternate versions (35.202)** are allowed only where direct accessibility is not possible due to technical or legal limitations. Sayable gives inventories and recommendations, never legal advice; the customer decides.

### What the research established (so the builder knows the real numbers)
| Fact | Value | Source/notes |
|---|---|---|
| Pages fully deliverable with no human work (passed veraPDF PDF/UA-1 and our semantic check) | 13 of 32 real pages (41%) | Our test on opendataloader-bench pages |
| Pages passing veraPDF after our deterministic finishing step | 20 of 32 | Same set |
| Semantic checker vs standard rule checks on subtle tag defects | caught 13/15 vs 0/15 | Injected defects on tagged fixtures |
| Semantic checker on real auto-tagged pages | flagged 8/10 broken tables, 3/5 broken heading structures, 0/19 false flags | Same set |
| AI accessible names for form fields (IRS 1040, 120 fields) | 19 of 20 sampled clearly correct, $0.11 total | Caveat: model may know this form |
| AI cost per page | ~$0.004 (Haiku check) to ~$0.15 (Sonnet check + fix + re-check) | Measured |
| Still hand work | tables, lists, reading order, scanned pages, unembedded fonts, link annotations | Measured |
| Price ceiling in the market | Washington State cooperative contract 02024: ~$3.34/page simple, ~$4.60 complex; AI-only tools ~$0.30/page | Public contract and vendor pages |
| Buyers check deliverables with | Adobe Acrobat accessibility checker, PAC 2024, veraPDF; manual screen-reader tests | 2025–2026 RFPs |
| Human remediation speed (industry) | 3–12 min per standard page; complex tables 15–30+ min | Practitioner sources |

---

## 2. Products and pricing (what the software must support)

| Product | What the customer gets | Price (starting point) | Software needed |
|---|---|---|---|
| **Readiness Audit** | Inventory of every PDF on their public site, sorted into Must fix / Archive candidate / Delete candidate / Convert-to-web-page candidate; accessibility check results; cost estimate; risk ranking; written report | $1,500–5,000 flat by entity size | Crawler, triage, inspector, checks, audit report generator |
| **Readiness Package** | Audit + remediation of all must-fix documents, each delivered with a check report | From ~$12,000; per-page tiers inside: simple ~$1.50–2, forms/tables/scans ~$5–12 | Full pipeline + human queue + delivery |
| **Agenda Desk** | Monthly: customer sends each meeting packet; Sayable returns it remediated within 24–48 hours (California requires agendas posted 72 hours before regular meetings) | $500–1,500/month | Intake (upload/email), SLA timers, pipeline, queue |
| **Check-before-post** (self-serve) | City staff drop a PDF into a web page before publishing; get pass/fail, plain-language fixes, optional auto-fix | $99–299/month per entity | Pipeline in check-only mode, simple UI |
| **White-label** | Same pipeline and delivery for web agencies and remediation firms with overflow work | Per page, negotiated | Same as Package, branded reports off |

---

## 3. Rules that must never be broken (put these in CLAUDE.md)

1. **Never claim "compliant", "certified", "guaranteed compliant", "100% accessible" or "ADA approved"** in reports, UI or marketing. Report what was checked and the results ("Passed veraPDF PDF/UA-1 validation; passed Sayable semantic check; reviewed by a person"). The FTC's 2025 order against accessiBe is the precedent.
2. **Public documents only** until a data-processing agreement and zero-data-retention terms with the AI provider are in place. The crawler only fetches publicly linked files. Do not process FERPA, HIPAA, CJIS or HR material.
3. **Every delivered file is re-checked** with veraPDF and the semantic checker after the last change. No file is marked delivered unless it passed both or a human explicitly overrode with a written reason.
4. **The AI never invents document text.** Fixes change tags, order, alt text and field names only. Visual content stays identical (except when explicitly producing an HTML conversion).
5. **Triage is a recommendation.** The customer makes archive/delete decisions. The report says so.
6. **Respect robots.txt, rate-limit crawling (≤ 1 request/second per host), identify the crawler with a generic user agent and a contact URL for the business, never log in, never bypass access controls.**
7. **Secrets never in the repo or browser.** The AI API key and Supabase service key live only on the worker.
8. **Tests must pass before every commit** (the regression suite in Section 14).

---

## 4. Tech stack and accounts

| Layer | Choice | Notes |
|---|---|---|
| Pipeline language | Python 3.12+ | All PDF work |
| PDF libraries | `pikepdf` (structure/tag editing), `pdfplumber` (text + marked-content IDs), `pypdfium2` (page rendering), `Pillow` | Verified working |
| Auto-tagger | `opendataloader-pdf` (Apache-2.0, Python wrapper around a Java engine) | `pip install opendataloader-pdf`; needs Java 11+ (use Java 21). Output formats include `json`, `markdown`, `tagged-pdf` |
| OCR for scanned pages | `ocrmypdf` (Tesseract) as the first option; OpenDataLoader "hybrid" mode as a second option | NOT yet tested in this project; must be tested in Milestone 3 |
| PDF/UA validator | veraPDF 1.28.x CLI (Java) | Verified: Maven artifact `org.verapdf.apps:greenfield-apps:1.28.2`, main class `org.verapdf.apps.GreenfieldCliWrapper`, flags `--flavour ua1 --format json`. Alternatively the official installer from verapdf.org |
| AI models | Anthropic API, `claude-haiku-5-5` (cheap first pass), `claude-sonnet-5-5` (fixes, disputed checks) | Pay-as-you-go API key. Do NOT use the Claude Max subscription for customer batches (usage limits) |
| Web app | Next.js (App Router) + TypeScript + Tailwind, deployed on Vercel | |
| Database/auth/storage | Supabase (Postgres, Auth with magic links, Storage) | Row-level security on every table |
| Worker host | DigitalOcean VPS, 4 GB RAM, Ubuntu | Runs Python + Java; one job at a time is fine |
| Crawler | Playwright (Python) or `httpx` + HTML parsing for static sites | Playwright only when pages need JavaScript |
| Email intake (Agenda Desk) | Postmark or Mailgun inbound webhook, or n8n | Later milestone |
| Hand-fix tool | Adobe Acrobat Pro (Mac) | Human queue |
| Optional checker | PAC 2024 (Windows only) | Buyers sometimes require it |
| Payments | Stripe Invoicing or plain PDF invoices; governments pay by PO/ACH/check, net 30 | |

Accounts to create (under a parent-managed LLC): Anthropic API, Supabase, Vercel, GitHub, DigitalOcean (exists), domain + business email, Adobe Acrobat Pro, Stripe, insurance broker.

Environment variables:
```
ANTHROPIC_API_KEY=            # worker only
SUPABASE_URL=
SUPABASE_ANON_KEY=            # web app
SUPABASE_SERVICE_ROLE_KEY=    # worker only
VERAPDF_CMD=/opt/verapdf/verapdf   # or path to wrapper script
SAYABLE_MODEL_FAST=claude-haiku-5-5
SAYABLE_MODEL_STRONG=claude-sonnet-5-5
CRAWLER_USER_AGENT="SayableBot/0.1 (+https://<your-domain>/bot)"
```

---

## 5. System architecture

```
                 ┌──────────────────────────────────────────────┐
 Customer  ───►  │ Next.js app (Vercel)                         │
 Founder   ───►  │  - customer portal: upload, status, download │
                 │  - admin: audits, human queue, delivery      │
                 │  - check-before-post page                    │
                 └───────────────┬──────────────────────────────┘
                                 │ Supabase JS (anon key + RLS)
                 ┌───────────────▼──────────────────────────────┐
                 │ Supabase: Postgres tables, Auth, Storage     │
                 │  buckets: originals/ outputs/ pages/ reports/│
                 │  table jobs = the work queue                 │
                 └───────────────▲──────────────────────────────┘
                                 │ service key (worker only)
                 ┌───────────────┴──────────────────────────────┐
                 │ Python worker (DigitalOcean VPS)             │
                 │  polls jobs (FOR UPDATE SKIP LOCKED)         │
                 │  runs pipeline: crawl/triage/inspect/autotag │
                 │  rules check (veraPDF) / semantic check (AI) │
                 │  auto-fix (AI edits) / finish / re-check     │
                 │  uploads results, updates rows               │
                 └──────────────────────────────────────────────┘
```

Start without the web app: Milestones 1–3 are a command-line tool that reads a folder and writes a folder. The web app comes in Milestone 5.

---

## 6. Repository layout

```
sayable/
  CLAUDE.md                     # rules from Section 3 + how to run tests
  README.md
  pipeline/                     # Python package
    __init__.py
    config.py                   # env vars, model names, thresholds
    ingest.py                   # hashing, page split, metadata
    inspect.py                  # classify file: tagged? forms? scanned? tables? page tier
    crawl.py                    # public-site PDF inventory
    triage.py                   # must-fix / archive / delete / convert recommendations
    autotag.py                  # OpenDataLoader tagged-pdf (+ OCR path)
    tagtree.py                  # read struct tree, serialize in screen-reader order, element ids
    rules.py                    # veraPDF wrapper + extra deterministic checks
    semantic.py                 # AI semantic check (prompt in Section 8.6)
    fix.py                      # AI edit proposals + safe application with pikepdf
    finish.py                   # deterministic PDF/UA finishing (Section 8.9)
    forms.py                    # AI field names (TU) + tab order
    report.py                   # per-document check report (JSON + HTML + PDF)
    audit_report.py             # Readiness Audit report
    ai.py                       # Anthropic client, retries, JSON parsing, cost logging
    run.py                      # CLI entry: python -m pipeline.run ...
  worker/
    worker.py                   # job loop for Supabase
  app/                          # Next.js (Milestone 5)
  supabase/
    migrations/0001_init.sql    # schema in Section 10
  tests/
    fixtures/                   # tagged ground-truth PDFs, injected-defect cases
    bench/                      # 32 real pages + expected outcomes (not committed if license unclear: download script)
    test_rules.py test_semantic.py test_finish.py test_fix.py test_triage.py test_end_to_end.py
  scripts/
    install_verapdf.sh
    fetch_bench.sh              # clones opendataloader-bench (Apache-2.0) for tests
```

---

## 7. CLI (Milestones 1–4)

```
python -m pipeline.run check   IN_DIR OUT_DIR          # check only: rules + semantic, reports
python -m pipeline.run fix     IN_DIR OUT_DIR          # full pipeline: autotag → check → fix → finish → recheck
python -m pipeline.run audit   https://www.city.gov OUT_DIR --max-files 5000 --sample 25
python -m pipeline.run finish  IN_DIR OUT_DIR          # deterministic finishing only
python -m pipeline.run forms   IN.pdf OUT.pdf          # field names
```

Per input file, OUT_DIR gets: `name.pdf` (result), `name.report.json`, `name.report.html`, and for failures `name.page-N.png` + findings. A `summary.csv` lists every file with status: `auto_pass`, `needs_human`, `human_done`, `failed`.

---

## 8. Pipeline modules in detail

### 8.1 ingest.py
- Input: a PDF path. Compute SHA-256; reject encrypted files that cannot be opened (record status `encrypted`); record page count, file size, PDF version, producer, creation/mod dates, title, language.
- Split logic: process per page for checks; keep the original file for output (never re-render content).

### 8.2 inspect.py — decide the page tier and route
For each document and page, compute:
- `tagged`: `/StructTreeRoot` exists in catalog.
- `has_text_layer`: pdfplumber extracts ≥ 20 characters on the page. If not → `scanned`.
- `has_form`: catalog has `/AcroForm` with fields; `xfa`: `/XFA` present (XFA = flag `unsupported_xfa`, needs human).
- `has_tables`: OpenDataLoader JSON reports a `table` element on the page, or the semantic check reports a table.
- `multi_column`: optional heuristic from text x-positions.
- `tier`: `simple` (text, headings, lists) or `complex` (tables, forms, scans, multi-column, charts). Used for pricing and estimates.

### 8.3 crawl.py — public site inventory (Readiness Audit)
- Input: start URL, max pages, max files. Same-domain only plus known document hosts the city links to (e.g., `*.granicus.com`, `*.civicplus.com`, `*.blob.core.usgovcloudapi.net`, `*.legistar.com`) — keep an allowlist the operator confirms per audit.
- Read robots.txt; obey disallow; ≤ 1 request/second per host; timeouts; retries with backoff; resume from a saved queue.
- For each HTML page: collect links to `.pdf` or responses with `Content-Type: application/pdf`; store `pdf_url`, `referrer_url`, `link_text`, page title of referrer.
- For each PDF: HEAD (size, Last-Modified), then download to `originals/` up to a size cap (e.g., 200 MB); compute hash; dedupe by hash.
- Output: `inventory.csv` with url, referrer, link_text, bytes, last_modified, pdf_creation_date, pages, sha256, tagged, has_form, scanned.

### 8.4 triage.py — recommendations, not decisions
Deterministic rules first, then AI to classify document type from page 1 text (Haiku). Each file gets one recommendation and the reasons:
- **Must fix** if any: has a form; link text or referrer page contains service words (apply, application, permit, license, form, request, register, fee, payment, eligibility, program, how to); document type in {application, form, current agenda/packet (within last N months), fee schedule, notice of hearing, instructions, map needed for a service}; posted on or after the compliance date.
- **Archive candidate** if: posted before the compliance date AND document type in {old minutes, old agendas older than N months, historical reports, budgets for closed fiscal years} AND not linked from a service page. Report reminds the customer of the archive conditions (kept only for reference/research/recordkeeping, not altered, clearly marked archive area).
- **Delete candidate** if: duplicate hash of another file; expired notices/events older than N months; empty or broken files.
- **Convert-to-web-page candidate** if: 1–2 pages, text only, no tables/forms, information that belongs on a web page.
- Output: per-file recommendation + reason codes; counts per pile; page counts per pile and per tier.

### 8.5 autotag.py
- If `tagged` already: keep existing tags (check them; do not re-tag blindly).
- If untagged with text layer: OpenDataLoader → `tagged-pdf` output. Python: `opendataloader_pdf.convert(input_path=[...], output_dir=..., format="json,tagged-pdf", quiet=True)`. Visual appearance is preserved; tags are added.
- If scanned: run OCR first (`ocrmypdf --skip-text` or `--force-ocr` as appropriate), then OpenDataLoader. Mark OCR pages for human review in v1 until OCR quality is measured.
- Keep OpenDataLoader's JSON (element types, bounding boxes) for later steps.

### 8.6 semantic.py — the checker (tested prompt; keep wording)
Steps: render the page to PNG at 150 DPI (pypdfium2); serialize the tag tree in screen-reader traversal order as indented lines `Role: text [Alt="..."]` (text from marked-content IDs via pdfplumber `chars[].mcid`); send image + tree to the model; parse JSON.

Prompt (tested; returned the results in Section 1):
```
You are auditing whether a tagged PDF works for a screen-reader user. The rendered page is attached.
Below is the PDF's tag tree in the exact order a screen reader traverses it (role: text). Compare it to what a sighted reader sees.
Report only real, user-impacting mismatches, in these categories:
- heading_missing: visually evident headings tagged as paragraphs or plain text
- heading_level: heading levels that do not match the visual hierarchy (e.g., section headings tagged H4 under an H1, or skipped levels)
- reading_order: tag order differs from the logical visual reading order
- table_headers: tables whose header row/column is not tagged as header cells
- list_structure: visual lists not tagged as lists/list items
- missing_content: visible meaningful text absent from the tag tree
- alt_text: images with missing or meaningless alt text
TAG TREE:
{tree}
Return ONLY JSON: {"defects":[{"category":"...","severity":"major|minor","evidence":"short"}],"pass":true|false}. Use an empty list if the structure is correct.
```
Routing: run with `claude-haiku-5-5` first (~$0.004/page). If Haiku reports any major finding, or reports only minor list findings (Haiku under-rated list severity in tests), re-run with `claude-sonnet-5-5` (~$0.06/page) and use Sonnet's verdict. Store model, prompt version, input hashes, raw output.

Pass rule per page: no `major` defects. Minor findings are reported but do not block.

### 8.7 rules.py — deterministic checks
- Run veraPDF: `verapdf --flavour ua1 --format json FILE...` (batch 20 files per call). Parse `report.jobs[].validationResult[0].details`: `compliant`, `ruleSummaries[]` with `clause`, `testNumber`, `description`, `failedChecks`. Map common clauses to plain-language explanations (table below).
- Extra checks (from `verifiers.rule_check`): struct tree present and Marked=true; catalog `/Lang` set; no untagged text (chars with no MCID, or MCIDs not referenced by any struct element); first heading is H1 and no skipped levels; every Table contains TH; every Figure has `/Alt`.

Common veraPDF PDF/UA-1 failures seen and their fix:
| Rule | Meaning | Fix |
|---|---|---|
| 7.1-8 | No XMP metadata stream | finish.py adds XMP with `dc:title` and `pdfuaid:part=1` |
| 7.1-10 | DisplayDocTitle not true | finish.py sets ViewerPreferences/DisplayDocTitle |
| 7.1-3 | Content neither tagged nor artifact | tag it or mark as Artifact in content stream |
| 7.1-5 | Non-standard structure type used | do not invent roles (our early bug used `/Artifact` as a struct role) |
| 7.2-34 | No natural language set | set catalog `/Lang` |
| 7.4.2-1 | Heading levels skipped / first not H1 | normalize heading levels |
| 7.3-1 | Figure without alt text | AI alt text or mark decorative as artifact |
| 7.18.x | Annotations/links not in structure, no Tabs=/S | add `/Link` struct elements with OBJR; set page `/Tabs /S` |
| 7.21.4.1-1 | Font program not embedded | usually needs human (re-embed font in Acrobat) |
| 7.21.4.2-2 | Incomplete CIDSet | delete `/CIDSet` from font descriptors (finish.py) |

### 8.8 fix.py — AI-proposed edits, applied safely
Serialize the tag tree with stable element ids `[i] Role: text`. Ask the strong model for minimal edits. Tested allowed edits:
```
{"id":N,"role":"H1|H2|H3|H4|P|LI|TH|TD|Caption|Figure"}   change a role
{"id":N,"alt":"concise alt text"}                          alt text on Figure ("" for decorative)
{"id":N,"artifact":true}                                   running header/footer/page number/decoration
{"reorder_top":[ids...]}                                    new order of the document root's children
```
Prompt (tested):
```
You are remediating a tagged PDF so it works for screen-reader users. The page image is attached.
Below is the tag tree; each element has an id in brackets. Propose minimal edits so the tags match the visible structure.
Allowed edits: (list above)
Do not invent text. If something cannot be fixed with these edits (e.g., a table that was never detected, list items that need regrouping), list it under "unfixable".
TAG TREE:
{tree}
Return ONLY JSON: {"edits":[...],"unfixable":["short reason", ...]}
```
Application rules (pikepdf):
- Role change: set `/S`. Only standard PDF structure types (ISO 32000-1 Table 333–340). Never `/Artifact` as a struct role.
- Artifact: remove the element from its parent `/K`, and in the page content stream replace that element's `BDC` (with its MCID) by `/Artifact BMC` (see finish.py implementation).
- Reorder: only children of the document root; keep any not listed in original order after the listed ones.
- Alt: set `/Alt` string on Figure elements.
- After applying: run finish.py, then rules + semantic again. Keep the result only if it is no worse (fewer major findings and no new veraPDF failures); else keep the previous version and send to the human queue.
- **Do not ship `make_table` / `make_list` regrouping yet.** A first attempt cleared 0 of 11 pages and created a reference cycle (infinite recursion) in one file. Tables and lists go to the human queue in v1. Revisit in Milestone 7 with cycle-safe tree construction and tests.

### 8.9 finish.py — deterministic PDF/UA finishing (no AI)
Run on every output, in this order:
1. XMP metadata: `dc:title` (document title or cleaned filename), `pdfuaid:part = 1` (pikepdf `open_metadata`).
2. Catalog `/Lang` (default `en-US` unless detected otherwise); `/ViewerPreferences/DisplayDocTitle true`; `/MarkInfo/Marked true`; `/Info/Title`.
3. Pages with annotations: `/Tabs /S`.
4. Elements typed `/Artifact` in the struct tree → remove from tree + convert their marked content to `/Artifact BMC` in the content stream.
5. Headings: first heading becomes H1; no level jumps by more than 1 (H1→H4 becomes H1→H2).
6. Delete `/CIDSet` from font descriptors (removes rule 7.21.4.2-2 failures).
Measured effect: veraPDF passes went from 0/32 to 20/32 on real pages.

### 8.10 forms.py — accessible names for fields
- Render the page at ~110 DPI; draw each widget rectangle (from `/Annots` with `/Subtype /Widget`, PDF coords → image coords with y flipped) in red with its index number in blue.
- Ask the strong model for a tooltip per field index (tested prompt): "For each numbered field, write the accessible name a screen-reader user should hear (a short tooltip, e.g. 'Line 1a, Total amount from Form(s) W-2, box 1' or 'Filing status: Single'). Use the printed text near the field. Return ONLY JSON: {"labels":[{"i":0,"tu":"..."}]}".
- Write `/TU` on each field (on the terminal field dictionary, or the widget's parent).
- Tab order: set page `/Tabs /S`; ensure widgets are referenced from the struct tree via `/Form` elements with OBJR (needed for full PDF/UA; implement in Milestone 4).
- Human spot check: show the numbered image next to the labels in the queue UI; human approves or edits.

### 8.11 report.py — per-document check report
Contents: file name, hash, pages; tier; final status; veraPDF result (pass/fail + failed rules in plain language); semantic result per page; what was changed automatically; what a person changed; date/time; tool versions; the statement "Checked with veraPDF (PDF/UA-1 profile) and the Sayable semantic checker. This report is not a legal certification of compliance." Output JSON + HTML + PDF (HTML → PDF with Playwright; the report itself must be an accessible, tagged PDF).

### 8.12 audit_report.py — Readiness Audit report
Sections: summary (counts of PDFs and pages; how many in each pile); what the law covers in plain words with dates; Must-fix list (sorted by risk: forms and service pages first); Archive and Delete candidates with reasons; check results on must-fix files (or on a sample of N if the set is huge); estimated cost by tier (simple vs complex page counts × prices); recommended plan and timeline before the deadline; methodology and limits; "not legal advice" statement. Attach `inventory.csv`.

### 8.13 Human queue
A page enters the queue when: semantic major findings remain after auto-fix, veraPDF failures remain that finish.py cannot fix, the page is scanned/OCR'd, it has forms (spot check labels), or `unsupported_xfa`. Queue item shows: page image, findings, links to download the current PDF; founder fixes in Acrobat Pro, uploads the file; the system re-runs checks automatically; timer records minutes per page (the key business metric).

---

## 9. AI usage details (ai.py)

- Use the official `anthropic` Python SDK. Send page images as base64 PNG image blocks plus text. Ask for JSON only; parse the first `{`…last `}`; validate against a schema (pydantic); on parse failure retry once with "Return valid JSON only".
- Retries: exponential backoff on 429/5xx; max 3 attempts; then mark the page `needs_human` with reason `ai_unavailable`.
- Log per call: model, input/output tokens, cost estimate, latency, prompt version, page hash. Daily cost cap setting.
- Content filter risk: verbatim transcription of copyrighted pages can be blocked. The checker and fixer do not ask for transcription, but handle a blocked/failed response by sending the page to the human queue.
- Model choice must be re-tested whenever models change; the regression suite is the gate.
- Do not use local models for checking until they pass the regression suite.

---

## 10. Database schema (supabase/migrations/0001_init.sql)

```sql
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text check (kind in ('city','county','school_district','college','special_district','agency','partner')),
  population int,
  website text,
  created_at timestamptz default now()
);
create table memberships (
  user_id uuid references auth.users on delete cascade,
  org_id uuid references organizations on delete cascade,
  role text check (role in ('owner','member')) default 'member',
  primary key (user_id, org_id)
);
create table admins ( user_id uuid primary key references auth.users on delete cascade );

create table projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations on delete cascade,
  type text check (type in ('audit','package','agenda_desk','check','whitelabel')),
  status text default 'open',
  due_at timestamptz,
  price_cents int,
  created_at timestamptz default now()
);
create table documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade,
  source_url text, referrer_url text, link_text text,
  original_path text, output_path text,
  sha256 text, bytes bigint, pages int,
  tagged bool, has_form bool, scanned bool, tier text,
  triage text check (triage in ('must_fix','archive','delete','convert','undecided')) default 'undecided',
  triage_reasons text[],
  status text check (status in ('queued','processing','auto_pass','needs_human','human_done','delivered','failed')) default 'queued',
  verapdf_compliant bool, verapdf_failed text[],
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table pages (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents on delete cascade,
  n int not null,
  image_path text,
  tier text,
  semantic_pass bool,
  status text default 'queued',
  human_minutes numeric,
  unique (document_id, n)
);
create table findings (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages on delete cascade,
  source text check (source in ('verapdf','rules','semantic')),
  category text, severity text, evidence text,
  model text, prompt_version text,
  status text check (status in ('open','fixed_auto','fixed_human','accepted','disputed')) default 'open',
  created_at timestamptz default now()
);
create table jobs (
  id bigserial primary key,
  kind text check (kind in ('crawl','triage','process_document','recheck','report','audit_report')),
  payload jsonb not null,
  state text check (state in ('queued','running','done','failed')) default 'queued',
  attempts int default 0, last_error text,
  locked_at timestamptz, created_at timestamptz default now()
);
create table ai_calls (
  id bigserial primary key, page_id uuid, model text, purpose text,
  input_tokens int, output_tokens int, cost_usd numeric, latency_ms int,
  prompt_version text, created_at timestamptz default now()
);
create table events (  -- append-only evidence log
  id bigserial primary key, org_id uuid, document_id uuid,
  event text, payload jsonb, prev_hash text, hash text, created_at timestamptz default now()
);
-- RLS: enable on all tables; customers see rows where org_id is in their memberships (via joins);
-- admins see everything; the worker uses the service role.
```
Worker claims jobs with:
```sql
update jobs set state='running', locked_at=now(), attempts=attempts+1
where id = (select id from jobs where state='queued' order by id for update skip locked limit 1)
returning *;
```
Storage buckets (private): `originals`, `outputs`, `pages`, `reports`. Customers download via signed URLs.

---

## 11. Web app (Next.js) — Milestone 5+

Customer side:
- Magic-link login. Dashboard: their projects with progress bars (documents total / auto_pass / needs_human / delivered).
- Upload page (drag-and-drop many PDFs) → creates documents + jobs.
- Project page: table of documents with status, download result + report, bulk download zip.
- Audit page: audit report viewer + inventory download.
- Check-before-post page: upload one PDF → result in under a minute (check-only), optional "fix it" button.

Admin (founder) side:
- Organizations and projects CRUD; start an audit from a URL.
- Human queue: next page needing work, image, findings, download/upload, timer, "mark fixed".
- Delivery: mark project delivered when all must-fix documents are `auto_pass` or `human_done`; generate final report.
- Metrics page: auto-pass rate, human minutes per page, pages/day, AI cost per page.

Accessibility of the app itself: the app must pass axe-core checks and work with a screen reader (we sell accessibility; dogfood it). Add Playwright + `@axe-core/playwright` tests.

---

## 12. Worker

- `worker.py` loop: claim job → run the matching pipeline function → upload artifacts → update rows → write `events` → mark done; on exception, store `last_error`, retry up to 3 times, then `failed`.
- One process on the 4 GB VPS; run Java tools sequentially to stay within memory; temporary files in a per-job directory, deleted after upload.
- systemd service with auto-restart; logs to journald; a daily summary email (cost, pages processed, failures).

---

## 13. Security and privacy

- Supabase RLS on every table; service key only on the worker.
- Private storage buckets; signed URLs with short expiry.
- Public-documents-only policy enforced in UI copy and terms; uploads require a checkbox "These documents are already public or contain no personal, health, student or law-enforcement information."
- AI provider: use API terms with no training on data; seek zero-data-retention before any non-public documents.
- Delete originals and outputs N days after delivery unless the customer is on a subscription (setting).
- Dependency pinning; `pip-audit` / `npm audit` in CI.

---

## 14. Testing and quality gates

Regression suite (must pass before merging):
1. **Fixtures:** 5 synthetic tagged documents (benefits letter, syllabus, city agenda, two-column report, form) plus untagged and scanned variants; ground truth structure JSON. (Exists in `experiments/c01-accessible-pdf/fixtures`.)
2. **Injected defects:** 32 blanket + 15 subtle cases (heading→P, H2→H4, reversed order, TH→TD, lists flattened, content untagged). Gate: semantic checker detects ≥ 26/27 blanket and ≥ 12/15 subtle with 0/5 false flags on clean files. (Exists in `experiments/c01-accessible-pdf/verify/`.)
3. **Real pages:** 32 pages from `opendataloader-bench` (Apache-2.0; fetch with `git clone https://github.com/opendataloader-project/opendataloader-bench`, deterministic sample seed 42; list in `experiments/c01-accessible-pdf/bench/results-claude-sonnet-5-5.json` under "sample"). Gate: ≥ 13/32 pages pass both veraPDF and semantic after the full pipeline; no crashes; AI cost ≤ $0.20/page average.
4. **finish.py unit tests:** each rule in 8.9 produces the expected catalog/struct changes; veraPDF failures 7.1-8, 7.1-10, 7.2-34, 7.21.4.2-2 disappear.
5. **fix.py safety tests:** applying edits never changes rendered page pixels (compare renders before/after with a tolerance); never creates cycles in the struct tree (walk with a visited set); never uses non-standard roles.
6. **Triage tests:** small synthetic inventories with known expected piles.
7. **End-to-end:** CLI `fix` on a folder produces outputs, reports and `summary.csv`.

Metrics to log per run: auto-pass rate, veraPDF pass rate, semantic pass rate, AI cost/page, seconds/page, human minutes/page.

Still to validate with real people (not software tests): agreement between the checker and blind screen-reader users on 30 real city documents; buyers accepting files checked with veraPDF + Acrobat checker.

---

## 15. Milestones (build in this order)

| # | Milestone | Definition of done |
|---|---|---|
| 1 | **Pipeline CLI from the research code** | `python -m pipeline.run fix` works on the 32-page bench set and reproduces ≥ 13/32 fully passing; tests 1–5 pass; README explains install (Python, Java 21, veraPDF, OpenDataLoader) |
| 2 | **Real-document hardening** | Multi-page documents (document-level checks: title, language, heading order across pages, bookmarks for > 20 pages); link annotations as `/Link` struct elements; encrypted/broken file handling; batch of 50 mixed real public PDFs runs without crashing |
| 3 | **Scans and forms** | OCR path tested on 10 scanned pages (measure text accuracy + checker results); forms.py writes TU + Form struct elements; tested on 3 public government forms |
| 4 | **Audit** | `audit` command crawls a city site politely, builds `inventory.csv`, triage piles, checks a sample, generates the audit report PDF/HTML; tested on one real public Bay Area city site |
| 5 | **Supabase + worker** | Schema migrated; worker processes uploaded documents end to end; storage + signed URLs; events log |
| 6 | **Web app** | Customer portal, admin queue with timer, delivery, check-before-post page; app passes axe tests |
| 7 | **Throughput** | Most common hand fixes automated one by one (start with tables and lists using cycle-safe regrouping); auto-pass rate tracked weekly |
| 8 | **Agenda Desk** | Email/upload intake, 24–48 h SLA timers, reminders, monthly invoice summary |

The first sale does not need Milestones 5–8. A free sample (Milestone 1–4 output for 20 real documents of one city) is the first sales asset.

---

## 16. Business setup checklist (founder + parent)

- California LLC with a parent as manager and signer (minors' contracts are voidable under California Family Code §6710). Filing ~$70, Statement of Information $20, $800/yr franchise tax.
- EIN from the IRS (free); business bank account; W-9 ready.
- Insurance: general liability + professional liability (E&O), ~$80–120/month for basic limits; cities often ask $1–2M limits, sometimes cyber; get quotes before the first contract.
- Adobe Acrobat Pro; domain + email; simple website with plain claims (no "compliant" promises); terms of service and a "not legal advice" statement.
- Sales assets: free sample of 20 fixed documents for one city; a 30-second before/after screen-reader audio clip of one of their forms; one-page price sheet with the three packages; plain description (Section 1).
- First targets: Bay Area cities and counties over 50,000 population (deadline April 26, 2027). Contacts: ADA coordinator, city clerk, web/communications manager, IT manager.
- Channels that avoid procurement friction: white-label work for web agencies and established remediation firms with overflow.
- Pricing under small-purchase limits where possible (many California cities allow city-manager approval up to $10k–50k; some require comparable quotes above $10k).
- Stop rule: no paid audit within 6 weeks of offering free samples to 15 cities and 5 agencies → stop and rethink.

---

## 17. Known limitations and open questions

- No blind user has yet confirmed the checker's verdicts; plan a paid test with 4–5 screen-reader users on 30 real documents.
- Multi-page documents, OCR quality and forms tab order are not yet measured.
- Table and list regrouping is not automated (first attempt failed).
- Fonts that are not embedded usually need human repair.
- Real page volumes per city are estimates (mid-size city likely 10–30k new agenda pages/year; one county RFP cited ~400,000 PDF pages).
- Competitors: CivicPlus DocAccess (HTML transcripts), Granicus (automatic PDF remediation preview), AudioEye, Allyant, Equidox, AbleDocs, AI-only tools at ~$0.30/page, open-source ASU/AWS pipeline. Sayable's edge: triage of what must be fixed, hard documents, independent verification, 48-hour agenda turnaround, local service.
- Legal dates and exceptions can change; re-check the Federal Register and the NFB v. DOJ case status before selling.

---

## 18. Glossary

Tag / structure tree: hidden labels in a PDF describing headings, paragraphs, lists, tables, figures. MCID: marked-content ID linking page content to a tag. Artifact: decoration a screen reader should skip. Alt text: description of an image. TU: a form field's accessible name (tooltip). PDF/UA-1: ISO 14289-1 accessibility standard for PDF. veraPDF: open-source PDF/UA validator. WCAG 2.1 AA: web accessibility guidelines required by the Title II rule. PAC 2024: free Windows PDF accessibility checker. Remediation: fixing a document's accessibility.

---

## 19. Reusing the research code

Clone: `git clone https://github.com/nb90386/Anything && cd Anything && git checkout claude/polyalpha-research-lab-qq7cve`. Relevant files under `startup-research/experiments/`:

| File | What it does | Becomes |
|---|---|---|
| `c01-accessible-pdf/verify/verifiers.py` | Tag-tree serialization, rule checks, semantic check (via `claude -p`) | `tagtree.py`, `rules.py`, `semantic.py` (switch to the Anthropic API) |
| `c01-accessible-pdf/verify/make_cases.py`, `make_subtle.py` | Injected-defect generators | `tests/fixtures` builders |
| `c01-accessible-pdf/render.js`, `gt_and_strip.py`, `fixtures/` | Synthetic fixtures + ground truth | `tests/fixtures` |
| `c01-accessible-pdf/bench/run_bench.py`, `bench/eval/` | Benchmark runner + Apache-2.0 metric code | `tests/bench` tooling |
| `c02-remediation-service/fixloop.py` | Element-id serialization, AI edit proposals, safe application | `fix.py` |
| `c02-remediation-service/fixloop2.py` | Table/list regrouping attempt (has a cycle bug) | reference only, do not ship |
| `c03-pdfua/finish.py` | Deterministic PDF/UA finishing | `finish.py` |
| `c03-pdfua/vera_batch.py` | veraPDF batch wrapper | `rules.py` |
| `c04-forms/label_fields.py` | Numbered-field image + AI tooltips | `forms.py` |

Research documents explaining the decision: `startup-research/round4/00-FINAL-PICK.md`, `round3/VIABILITY.md`, `round3/BUILD-PLAN.md`, `09-technical-feasibility.md`.

---

## 20. Starter prompt sequence for Claude Code (adapt as needed)

Run these one at a time in a new repo, reviewing and committing after each.

1. **Setup:** "Create a new repo `sayable` with the layout in SAYABLE-BUILD-SPEC.md Section 6. Write CLAUDE.md containing the rules in Section 3 and how to run tests. Add a Python 3.12 project (pyproject) with pikepdf, pdfplumber, pypdfium2, Pillow, opendataloader-pdf, anthropic, pydantic, httpx, pytest. Add `scripts/install_verapdf.sh` that installs veraPDF 1.28.x for macOS and Ubuntu (Maven dependency copy of `org.verapdf.apps:greenfield-apps:1.28.2` with main class `org.verapdf.apps.GreenfieldCliWrapper`, or the official installer) and prints the version."
2. **Port the research code:** "Copy these files from the Anything repo branch claude/polyalpha-research-lab-qq7cve, folder startup-research/experiments: [list from Section 19]. Refactor them into the pipeline modules in Section 6 with identical behavior, replacing `claude -p` subprocess calls with the Anthropic Python SDK in `pipeline/ai.py` (image as base64 PNG, JSON-only responses, pydantic validation, retries, cost logging). Keep the prompts in Section 8.6 and 8.8 word for word."
3. **Tests:** "Build the regression suite in Section 14 (fixtures, injected defects, finish.py unit tests, fix.py safety tests including pixel-diff and cycle checks). Add `scripts/fetch_bench.sh` and a bench test that reproduces at least 13 of 32 fully passing pages. Make `pytest` the gate."
4. **CLI:** "Implement `python -m pipeline.run` with the commands in Section 7, producing results, JSON/HTML reports and summary.csv."
5. **Hardening:** "Implement Milestone 2 (multi-page document checks, link annotations, encrypted/broken files)."
6. **Scans and forms:** "Implement Milestone 3 with ocrmypdf and forms.py, and a report of OCR and form-label quality on the test set."
7. **Audit:** "Implement crawl.py, triage.py and audit_report.py per Sections 8.3, 8.4 and 8.12, with polite crawling rules from Section 3."
8. **Backend:** "Create the Supabase migration in Section 10 with RLS policies, storage buckets and the worker in Section 12."
9. **Web app:** "Build the Next.js app in Section 11 (customer portal, admin queue with timer, check-before-post page), with Playwright + axe accessibility tests, deployed on Vercel."
10. **Throughput:** "Analyze the human queue logs and automate the most frequent hand fix, starting with cycle-safe table and list regrouping, with tests."
