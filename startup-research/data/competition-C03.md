# C03 — Maintained PDF-form engine + hosted fill/flatten/validate API: competitive analysis

Retrieval date: 2026-11-02. All figures are as reported by the cited pages on that date; items marked (unverified) come from third-party aggregators or single sources.

## 1. Verdict in one line

**Maybe, leaning no.** The "abandoned pdf-lib" premise is stale: two maintained TypeScript successors exist (@cantoo/pdf-lib, releasing every few days; Documenso's LibPDF, 1.8k stars, fill + flatten). The remaining wedge is the *government-form conformance suite + cross-viewer verification*, which nobody sells as a product, but it is a thin moat and hosted fill is priced at $0.002–$0.10 per fill by at least eight vendors.

## 2. Open-source landscape (the core premise)

| Library | Status (2026-11-02) | Form filling | Notes |
|---|---|---|---|
| **pdf-lib** (Hopding) | 8.7k stars, 930 forks, **279 open issues, 39 open PRs**; last release v1.17.1 (Nov 2021). No archive/deprecation notice. | Yes, buggy | #1549 "Flatten is removing RadioGroups and Checkboxes" (open since Nov 2023, 13 comments, no maintainer reply, last comment Oct 13 2026, now attracting malware-package spam); #1387 flattened forms unprintable in Acrobat; #354 NeedAppearances toggles text vs radio rendering. 9 open "checkbox" issues. |
| **@cantoo/pdf-lib** | 358 stars, 80 forks, 20 open issues, 761 commits; tags v2.8.2 (Aug 12 2026) → **v2.11.0 (Sep 11 2026)**, i.e. a release every few days. MIT, drop-in API. Weekly downloads: 37.7k (Snyk) vs 278k (DepScope) — conflicting (unverified). | Yes | Adds XFA helpers, orphaned-widget flattening, signature-safe incremental updates, AES-256, PDF/A, SVG. Many OSS projects have migrated (pdf-merger-js, OpenReturn). Reported caveat: standard-font encoder no longer throws on unencodable glyphs. |
| **LibPDF / @libpdf/core** (Documenso) | Launched Jan 23 2026; **1.8k stars**, 70 forks, 32 open issues, 275 commits; MIT (fontbox Apache-2.0). Beta, "used in production at Documenso". | Text, checkbox, radio, dropdown, signature; flatten "bakes fields into page content". | PAdES B-B→B-LTA signing, incremental saves, TTF/OTF subsetting (no .ttc). Appearance-stream correctness and XFA not documented. Backed by a funded OSS e-signature company with a direct need for correct forms. |
| **@pdfme/pdf-lib** | pdfme's internal fork; 145k weekly downloads (DepScope, unverified). Changes limited to SVG, rounded rects, CJK font subsetting. | inherits pdf-lib | pdfme itself (5.0k stars, 36 open issues, MIT) is a template/designer generator, not an AcroForm filler. |
| **pdf.js / pdfjs-dist** | 54.1k stars, 13.1M weekly downloads (Snyk). | Viewer-side fill; not a server fill library | Not a competitor for server-side fill/flatten. |
| **pdfform.js** | 226 stars, 27 open issues, 82 commits; effectively dormant. | Fill only | |
| **MuhammaraJS** (hummus successor) | 309 stars, 23 open issues. No AcroForm API in README. | No | |
| **pdfcpu** (Go) | 8.9k stars, 108 open issues, Apache-2.0; `form fill` and JSON/CSV `form multifill` commands. | Yes (CLI/Go) | Flatten not documented on README. |
| **pdf_oxide** (Rust) | 1.2k stars, 241 open issues, MIT/Apache; bindings to 19 languages incl. JS/TS; `forms --fill`. Single maintainer. | Yes | Own open issue #2775: fields created have no /AP stream — same class of bug as pdf-lib. |
| **pypdf** (Python) | 10.3k stars, 90 open issues; docs recommend `auto_regenerate=False`, warn that NeedAppearances depends on viewer cooperation and suggest flattening. | Yes | Long-standing "fields blank in Adobe Reader" class of bugs (PyPDF2 #506, SO threads). |
| **PyMuPDF** | Widget API; a 2026 Claude Code issue report documents comb/digit boxes, font sizing, rect alignment and duplicate-name field failures. | Yes | |

**Takeaway:** The pain (appearance streams, checkbox/radio flattening, viewer inconsistency, XFA) is real in every ecosystem, but "a maintained TS pdf-lib" already exists twice over; the startup's library would be the third successor, chasing migration PRs that @cantoo/pdf-lib is currently winning.

## 3. Commercial landscape

| Vendor | What | Pricing (as reported) | Maturity / notes |
|---|---|---|---|
| **Apryse (PDFTron, owns iText)** | Full SDK incl. forms, XFA, viewer | Entry packages from $1,500/yr (vendor-published per reviews); Vendr: **median $25,140/yr, range $6.9k–$92.6k, n=39**; SSA renewal $93k/yr; UK award £81.9k/3 yrs. Third-party estimates $10k–$40k/yr (unverified). | Acquired iText (2022), Scanbot & Accusoft (Jul 2025, unverified); Thoma Bravo reportedly exploring $3B+ sale (single source, unverified). Weakness: enterprise sales cycle, no self-serve. |
| **Nutrient (PSPDFKit)** | Web SDK + Document Engine (server fill/flatten) | Quote-only; Capterra "starting EUR 5,000"; SimplePDF claims $10–15k/yr web-only (competitor source, unverified). 30-day trial. | Acquired Muhimbi, Aquaforest, ORPALIS (2022), Integrify (2024). Component-based licensing. |
| **Foxit PDF SDK** | SDK | "Starts at $3,000 per platform per year" (Foxit developer site). | Quote-based beyond entry. |
| **Adobe PDF Services API** | Hosted API | 500 free transactions/mo; $0.05/transaction (AWS Marketplace mirror, unverified); forum reports of $3,000 surprise bills and a 500k/yr enterprise minimum (unverified). | Reference renderer; no form-fill guarantee. |
| **Anvil** | Hosted fill/generate + e-sign + workflows | **$0.10 per fill**; 500 free/mo or 2,500 starter credits; paid plans from $425/mo — sources conflict. 50k+ tier "55% off" (page shows "$0.45", likely a typo). | Closest incumbent. Publishes W-4/IRS templates, no-signup PDF-to-API converter. Weakness: pricing opacity, suite bundling. |
| **Emboss (getemboss.ai)** | Fill API | 2¢ standard fill, 3¢ context fill, 5¢ extraction; no subscription. | New, small (unverified maturity). |
| **PDFops (pdfops.dev)** | Hosted inspect/fill/flatten/merge + MCP server | Keyless 100 req/IP/mo; free key 250/mo; paid not shown. | GitHub repo 0 stars; hobby-scale. Explicitly targets agents. |
| **JustFill (justfill.app) / justfill-mcp** | MCP server, hosted; saved templates make fills deterministic; handles scans | Not found. | PyPI releases 0.4.3–0.4.7 (active). |
| **iTextMaster Form Filler API** | Fill API | 1 credit/call, 1,000 credits = $1 ($0.001/fill). | |
| **forhosting.com** | Fill endpoint | $0.002/request. | |
| **Apify actors** (hipersoft, ely_source) | Fill & flatten W-9 etc. | $0.005–$0.03 per fill. | |
| **DocuSeal** | OSS (AGPL) PDF form builder + e-sign, 19.0k stars, cloud + Pro | Pro pricing not on GitHub page. | Overlaps on "fill and sign online", not JSON-to-AcroForm API. |
| **pdf.co, pdfRest, Documint, Formstack, airSlate** | General doc APIs | pdf.co: credits per call/page, no XFA fill. Others: pricing not retrieved. | airSlate markets "I-130 pre-fill from CSV" bots. |
| **Vertical form-fillers**: Instafill.ai, Lido, Fillvisa (OSS XFA→AcroForm converter), simplepdf.com, formize | End-user USCIS/IRS filling | n/a | Shows demand, but they are *consumers* of a form engine, not sellers of one — potential customers. |

Commodity "fill AcroForm from JSON" costs **$0.001–$0.03/fill**; Anvil's $0.10 is the ceiling. A hosted API alone cannot carry a company; the verification layer must justify a premium.

## 4. Demand evidence

- pdf-lib's form bugs, unanswered since 2021–2023 with threads still active in Oct 2026, show a durable, under-served pain.
- Agent builders: at least four PDF-form MCP servers shipped in 2025–26 (pdf-form-filler-mcp, FreeBSD ports Apr 2026; pdfops-mcp; justfill-mcp; pdfnative-mcp with signature-preserving incremental fill). Claude Code issue 34911 documents agent failures on comb boxes, font sizing and duplicate field names — exactly the conformance thesis.
- USCIS: I-539 is "PDF 1.7, encrypted, hybrid AcroForm+XFA, 176 fields" (browse.sh); Fillvisa's author says USCIS XFA forms "silently break in every modern browser except Acrobat". XFA is the hard part and the candidate's pitch does not mention it. pdfops-mcp states hybrid fills drop the XFA layer; pdf.co does not fill XFA at all.
- "Filled fields blank in Adobe Reader" threads persist across pypdf, PyPDF2, PdfSharpCore, mPDF and pdfrw — cross-language, not TS-specific.

## 5. Would the market pay?

Yes, at the enterprise end: Vendr median $25k/yr for Apryse (n=39), $93k/yr SSA renewal, Foxit $3k/platform entry — but that buys full SDKs (viewer, OCR, redaction, signing), not forms alone. At the API end, buyers pay cents per fill. The candidate sits between: a free library plus a hosted API that must undercut Anvil while out-trusting $0.002 endpoints. No evidence surfaced that developers pay specifically for *form correctness verification*.

## 6. Can incumbents or a fork cover it in a quarter?

- **@cantoo/pdf-lib** already ships XFA helpers, orphaned-widget flattening and signature-safe incremental saves and releases weekly; adding a government-forms regression suite is a modest CI task for them.
- **LibPDF/Documenso** has 1.8k stars in 9 months, a venture-backed team, and production pressure to get forms right. It is the most likely "OSS maintainer covers it in a quarter".
- **Apryse/Nutrient** already have correct appearance generation and XFA; they could publish a conformance benchmark overnight.
- **Could a fork satisfy the market without a company?** Largely yes — the wave of migration PRs to @cantoo/pdf-lib shows the market treats this as a solved packaging problem. The unsolved parts (cross-viewer verification, XFA conversion) are services, and small hosted players (JustFill, PDFops) are already nibbling.

## 7. Exits and shutdowns

No PDF SDK shutdowns surfaced; consolidation is the pattern. Apryse acquired iText (2022), PDF Tools, Scanbot and Accusoft (2025, unverified); Nutrient acquired Muhimbi, Aquaforest, ORPALIS (2022) and Integrify (2024); Hummus was abandoned and continued as MuhammaraJS. The plausible exit for C03 is a small acqui-hire by Apryse/Nutrient/Documenso/Anvil.

## 8. Strengths, weaknesses, and how C03 could still win

Strengths available to C03: a conformance suite of real IRS/USCIS/court forms with pixel checks across Acrobat/Preview/Chrome (nobody sells this); agent-native (MCP) fill+validate with deterministic templates; XFA→AcroForm handling if they take it on.
Weaknesses: third TS successor; hosted fill commoditized at cents; the suite is copyable by LibPDF/cantoo in weeks; enterprise buyers already hold Apryse/Nutrient contracts; USCIS XFA is hard and the pitch glosses over it.
To win, C03 should drop "pdf-lib successor" as the headline, sell "government-form conformance + XFA + verification" to legal/immigration SaaS at a premium over Anvil for guaranteed renders, and contribute the engine upstream to LibPDF or cantoo rather than fork a fourth time.

## Sources (retrieved 2026-11-02)

- https://github.com/Hopding/pdf-lib
- https://github.com/Hopding/pdf-lib/releases
- https://github.com/Hopding/pdf-lib/issues/1549
- https://github.com/Hopding/pdf-lib/issues/354
- https://github.com/Hopding/pdf-lib/issues?q=is%3Aissue+is%3Aopen+appearance+form
- https://github.com/Hopding/pdf-lib/issues?q=is%3Aissue+is%3Aopen+checkbox
- https://github.com/cantoo-scribe/pdf-lib
- https://github.com/cantoo-scribe/pdf-lib/tags
- https://www.npmjs.com/package/@cantoo/pdf-lib
- https://snyk.io/advisor/npm-package/@cantoo/pdf-lib
- https://depscope.dev/pkg/npm/@cantoo/pdf-lib
- https://depscope.dev/pkg/npm/@pdfme/pdf-lib
- https://security.snyk.io/package/npm/pdfjs-dist
- https://github.com/PhilippMundhenk/stampfill/issues/39
- https://github.com/nbesli/pdf-merger-js/issues/153
- https://github.com/captaincole/OpenReturn/pull/51
- https://github.com/pdfme/pdfme
- https://github.com/pdfme/pdfme/blob/main/packages/pdf-lib/README.md
- https://github.com/LibPDF-js/core
- https://documenso.com/blog/introducing-libpdf-the-pdf-library-typescript-deserves
- https://libpdf.documenso.com/docs/guides/forms
- https://github.com/mozilla/pdf.js
- https://github.com/phihag/pdfform.js
- https://github.com/julianhille/MuhammaraJS
- https://github.com/pdfcpu/pdfcpu
- https://github.com/yfedoseev/pdf_oxide
- https://github.com/yfedoseev/pdf_oxide/issues/2775
- https://github.com/py-pdf/pypdf
- https://pypdf.readthedocs.io/en/latest/user/forms.html
- https://github.com/mstamy2/PyPDF2/issues/506
- https://github.com/pmaupin/pdfrw/issues/84
- https://github.com/mpdf/mpdf/issues/1273
- https://spin.atomicobject.com/pdfsharpcore-fields-chrome/
- https://claudeissues.com/issue/34911-claude-code-struggles-with-pdf-form-filling-comb-digit-boxes-font-sizing-rect-al
- https://www.useanvil.com/ask-anvil/pdfs/filled-pdf-fields-blank-in-adobe-reader/
- https://github.com/docusealco/docuseal
- https://www.useanvil.com/pricing.md
- https://www.useanvil.com/products/pricing/
- https://www.useanvil.com/pdf-filling-api
- https://www.useanvil.com/blog/digital-transformation/best-pdf-filling-api-document-automation/
- https://getemboss.ai/
- https://itextmaster.com/api/form-filler-api/
- https://forhosting.com/kit/fill-pdf-form
- https://apify.com/hipersoft/pdf-fill-form/api
- https://apify.com/ely_source/pdf-form-filler
- https://github.com/pdfops/pdfops-mcp
- https://pdfops.dev/mcp
- https://pypi.org/project/justfill-mcp
- https://www.freshports.org/textproc/pdf-form-filler-mcp/
- https://glama.ai/mcp/servers/Nizoka/pdfnative-mcp/tools/fill_form
- https://apidocs.pdf.co/kb/Fill%20PDF%20and%20Add%20Text%20or%20Images%20(pdf-edit-add)/how-to-fill-out-xfa-forms
- https://www.vendr.com/marketplace/apryse
- https://simplepdf.com/alternatives/apryse
- https://pricingnow.com/question/apryse-pdf-sdk-pricing/
- https://saasrat.com/products/pdfnet-sdk
- https://www.contractsfinder.service.gov.uk/Notice/58b749ad-b1c1-4950-aeca-e600b7c98c50
- https://www.govconinabox.com/explore/contractors/profile/EDJLL51JQM95
- https://www.nutrient.io/sdk/pricing/
- https://www.nutrient.io/blog/pdf-sdk-pricing-and-licensing-explained/
- https://www.capterra.com/p/171174/PSPDFKit-SDK/pricing/
- https://simplepdf.com/alternatives/pspdfkit
- https://developers.foxit.com/?p=1210
- https://www.trustradius.com/products/foxit-pdf-sdk/pricing
- https://developer.adobe.com/document-services/pricing/
- https://developer.adobe.com/document-services/docs/overview/limits
- https://chrishaff.github.io/developers-stage.adobe.com/apis/documentcloud/dcsdk/pdf-pricing.html
- https://community.adobe.com/questions-21/aws-charged-for-3-000-in-adobe-pdf-services-api-u-s-out-of-nowhere-1560209
- https://community.adobe.com/t5/acrobat-services-api-discussions/looking-for-api-pricing-over-500-transactions-per-month/td-p/15546188
- https://mergr.com/apryse-software-acquires-itext-group-nv
- https://yespress.io/apryse
- https://www.theatdb.com/news/apryse-acquires-pdf-tools-to-expand-global-customer-reach-and-advance-high-performance-document-processing
- https://www.pdfa.org/pspdfkit-acquires-leading-document-software-provider-muhimbi/
- https://mergr.com/transaction/pspdfkit-acquires-aquaforest
- https://pspdfkit.com/company/about/acquisitions/orpalis/
- https://mergr.com/transaction/pspdfkit-acquires-integrify
- https://www.nutrient.io/about/pspdfkit/
- https://www.upwork.com/services/product/development-it-a-custom-uscis-web-form-tool-that-generates-a-filled-submission-ready-pdf-2070201672171135049
- https://peerlist.io/junaid_97/project/fillvisa-open-source
- https://browse.sh/skills/uscis.gov/fill-i539-application-form-b6dv4f
- https://wildandfreetools.com/blog/fill-government-pdf-forms-online
- https://www.airslate.com/workflow/document/1127454-system-form-i-130-pre-fill-from-csv-file-bot
- https://instafill.ai/forms/form-i-130-petition-for-alien-relative-1
- https://www.lido.app/fb-landing/immigration-form-automation
