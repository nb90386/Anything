# Exact Build Plan — done-for-you document accessibility service

Built on the founder's current stack. Everything marked "reuse" already exists in `startup-research/experiments/` from this research and was run on real documents.

## 0. What you are building (two parts)

1. **The pipeline (your edge):** a Python program that takes a PDF and returns an accessible PDF plus a report. Steps: auto-tag → check against PDF/UA with veraPDF → semantic check with Claude → automatic fixes → deterministic finishing → re-check → route the page to "done" or "needs you".
2. **The business layer:** a small web app where customers upload documents (or you crawl their public site), see status and download finished files and reports. You see a queue of pages that need hand work.

Do not build the web app first. The pipeline plus a folder of files is enough for the first two customers.

## 1. Tools you already have, and what each does here

| Tool | Role in this business | Notes |
|---|---|---|
| **Claude Code (Claude Max)** | Writes and refactors the pipeline and app. Runs the semantic checker and fixer during development via `claude -p` headless mode (what this research used). | Subscription usage limits interrupted this research once; do not rely on it for customer batches. |
| **Anthropic API** (new, pay-as-you-go) | Production calls for the checker and fixer. | Measured about $0.15/page with Sonnet for check + fix + re-check; use Haiku for the first check (~$0.004/page measured) and Sonnet only on flagged pages. Needs a card on a parent's account. |
| **ChatGPT Plus** | Second opinion when you are unsure a fix is right; drafting outreach and proposals. | Not in the automated pipeline. |
| **Python** | The pipeline: pikepdf, pdfplumber, pypdfium2, opendataloader-pdf. | Reuse `experiments/c01-accessible-pdf/verify/verifiers.py`, `experiments/c02-remediation-service/fixloop.py`, `fixloop2.py`, `experiments/c03-pdfua/finish.py`, `vera_batch.py`. |
| **Java** | Runs OpenDataLoader (free auto-tagger) and veraPDF (free PDF/UA validator). | `brew install openjdk@21`. veraPDF 1.28.2 ran here from Maven Central. |
| **Adobe Acrobat Pro** (new, ~$20–30/mo) | Hand-fixing tables, lists and reading order; buyers check files with Acrobat's checker. | The one paid tool you need. PAC 2024, the other checker buyers name, is Windows-only; borrow a PC or run a Windows VM. |
| **Playwright** | Crawls a city's public website to list every posted PDF and download them for a free sample audit. | Respect robots.txt; crawl slowly. |
| **Next.js + Vercel** | Customer portal and your internal queue. | Phase 2. |
| **Supabase** | Postgres (customers, batches, documents, pages, findings), Auth, Storage for files. | Phase 2. Row-level security per customer. |
| **DigitalOcean VPS (4 GB)** | Runs the pipeline worker 24/7 (Java + Python). | One worker processes pages one at a time; 4 GB is enough for OpenDataLoader + veraPDF sequentially. |
| **n8n or Trigger.dev** | Email notifications when a batch is done; scheduled re-crawls of customer sites. | Use only when you have repeat customers. |
| **GitHub** | Code, issues, CI running the regression tests. | |
| **Ollama / Groq** | Not needed now. | Local models were not tested on this task; do not swap them in for the checker without testing on the regression set. |

## 2. Repository layout

```
accessible-docs/
  pipeline/
    ingest.py        # hash, page split, inspect (tagged? forms? scanned?)
    autotag.py       # OpenDataLoader tagged-pdf output; OCR path for scanned pages
    rules.py         # veraPDF PDF/UA-1 wrapper + extra checks   (reuse vera_batch.py, verifiers.rule_check)
    semantic.py      # page image + tag tree -> findings          (reuse verifiers.semantic_check)
    fix.py           # Claude proposes edits by element id; apply with pikepdf (reuse fixloop.py / fixloop2.py)
    finish.py        # XMP/pdfuaid, DisplayDocTitle, Lang, Tabs, artifacts, heading levels, CIDSet (reuse c03-pdfua/finish.py)
    forms.py         # field tooltips (TU) from page image with numbered boxes (reuse c04-forms/label_fields.py)
    report.py        # per-document report: veraPDF result, semantic result, what was fixed, what a human fixed
    run.py           # CLI: python -m pipeline.run in/ out/ --customer X
  tests/
    regression/      # the injected-defect cases + 32 benchmark pages + their expected verdicts
  app/               # Next.js portal (phase 2)
  worker/            # polls Supabase jobs table, calls pipeline (phase 2)
  CLAUDE.md          # tell Claude Code the rules: never claim "compliant", keep public-docs-only, run tests before commits
```

## 3. Build steps, in order

### Day 1–2: make the pipeline run on your Mac
1. Create the repo, copy the experiment scripts in, and ask Claude Code to refactor them into the `pipeline/` modules above with a single CLI. Prompt: "Refactor these experiment scripts into a package with a CLI that takes a folder of PDFs and writes accessible PDFs plus a JSON and HTML report per file. Keep behavior identical. Add pytest tests using the regression cases."
2. Install: `brew install openjdk@21 python@3.13`, `pip install pikepdf pdfplumber pypdfium2 opendataloader-pdf anthropic`, veraPDF (installer from verapdf.org, or Maven as done here).
3. Run on the 32 benchmark pages. Done when it reproduces: about 41% of pages pass both veraPDF and the semantic check with no human work.

### Day 3–5: handle real city documents
4. Multi-page support: run per page, then document-level checks (heading order across pages, bookmarks, title, language, link annotations with `/Link` structure and `/Tabs /S`).
5. Scanned pages: OCR path (OpenDataLoader hybrid mode, or ocrmypdf), then tag.
6. Forms: field tooltips from `forms.py`; tab order; check every field has a name. On a real IRS 1040, 19 of 20 sampled AI tooltips were clearly correct (spot check).
7. Report template that a clerk understands: pass/fail per page, what changed, and the veraPDF and Acrobat checker results.

### Week 2: the free sample that sells
8. Playwright crawler: given a city URL, list posted PDFs with dates and page counts. Output: "You have N PDFs, M pages posted in the last 12 months."
9. Run the pipeline on 20 pages of their real documents and hand-fix the rest. Package before/after files plus the report. This is your sales asset; it also measures your real minutes per page.

### Week 3–4: the minimum business layer
10. Supabase schema: `customers, batches, documents, pages(status: auto_pass|needs_human|human_done|delivered), findings, events`.
11. Worker on the VPS: polls `jobs`, runs the pipeline, uploads results to Storage, marks pages.
12. Next.js portal on Vercel: customer login (magic link), upload, batch status, downloads; your internal queue of `needs_human` pages with the page image, findings and a "mark fixed" button after you fix it in Acrobat.
13. Invoices: Stripe Invoicing or plain PDF invoices; government pays by purchase order, ACH or check, net 30.

### Month 2+: increase pages per hour
14. Every hand fix you make is a training example. Log the page, the findings and what you did. Each week, pick the most common hand fix and teach the fixer to do it (tables and lists first).
15. Regression tests must pass before any change ships, so automation never breaks a page type that used to work.

## 4. Costs

| Item | Cost |
|---|---|
| California LLC (parent as manager) | $70 filing + $20 Statement of Information + $800/yr franchise tax |
| General + professional liability insurance | about $80–120/month for basic limits (higher limits plus cyber possibly $1.5–3k/yr; unverified) |
| Adobe Acrobat Pro | about $20–30/month |
| Anthropic API | about $0.01–0.15/page depending on model routing (measured) |
| Domain, email | about $20/month |
| VPS, Vercel, Supabase | already owned / free tiers |
| **Fixed cost per year** | roughly $3,000–4,500 |

## 5. Rules to build in from day 1
- Never write "compliant", "certified" or "guaranteed" in reports or marketing. Report what was checked and the results (FTC accessiBe order).
- Public documents only until you have a data-processing agreement and zero-retention API terms.
- Always deliver the veraPDF and Acrobat checker results with each file, because buyers check with those tools (League City, Washington State contract).
- Deliver agenda packets within 24–48 hours, because California's Brown Act requires posting agendas 72 hours before regular meetings.
