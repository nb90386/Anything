# C01 — Verified-accessible document engine: competitive analysis

Date: 2026-11-02. Method: 18 web searches plus GitHub fetches. Figures are vendor claims or third-party estimates unless a primary source is named; nothing was inferred, and gaps are stated.

## 1. Bottom line

Verdict: **MAYBE, leaning NO for the pitch as written.** The core technique (VLM structure inference + veraPDF validation + human queue) is no longer differentiated: it is free inside Anthology Ally since July 2026, built into Acrobat since 2023, and available as Apache-2.0 open source (OpenDataLoader PDF, co-developed with the veraPDF team). Regulation cuts both ways: DOJ extended deadlines by a year in April 2026 and may re-open the rule's substance, and the rule's "preexisting conventional electronic documents" exception removes most of the untagged archive from the mandate. What survives is a narrower wedge: verified PDF/UA conformance with evidence trails for the ongoing flow of new/served PDFs in cities and public colleges outside the LMS, at well under $0.50/page.

## 2. Regulatory facts (confirmed from results)

| Item | Finding | Source |
|---|---|---|
| DOJ Title II interim final rule | Published/effective April 20, 2026; extends WCAG 2.1 AA compliance to **April 26, 2027** (entities ≥50k pop.) and **April 26, 2028** (smaller entities, special districts). Comments to June 22, 2026 (one source says June 19). | Duane Morris, Reed Smith, ADA Title III blog, UPCEA |
| DOJ rationale | DOJ "overestimated the capabilities (whether staffing or technology) of covered entities"; cites staffing, litigation risk and "limits of generative artificial intelligence for remediation". DOJ "may issue a new proposed rulemaking on the substance of the 2024 rule" during the extension. | Siteimprove, Reed Smith |
| Still-live obligations | Existing Title II effective-communication duties continue; only the WCAG dates moved. HHS Section 504 web rule (May 11, 2026 first deadline) was **not** extended. | Consumer Financial Services Law Monitor, Arizona |
| PDF scope | Rule covers "conventional electronic documents" (PDF, Word, PPT, XLS). **Exception:** documents posted before the compliance date stay as-is unless needed to apply for/access a program; entity must provide an accessible copy on request. Separate archived-content exception requires four cumulative criteria (pre-date, reference only, unchanged, clearly labelled archive). Third-party uncontracted content exempt. | Maryland, Vermont, Georgia Tech, Wisconsin, Texas State |
| Number of Title II entities | Not found in any result. Unverified. | — |
| EAA | In force June 28, 2025 for covered products/services sold to EU consumers; technical standard EN 301 549 (document clauses, PDF/UA commonly used). Public-sector bodies fall under the separate Web Accessibility Directive — not covered by these searches, unverified here. | Acquia, Quadient, EqualWeb |

Investor read: the mandated backlog is far smaller than "every PDF on a .edu". Only new documents and documents needed to access a service must be fixed by 2027/28; everything else can be remediated on demand, which is exactly the use case a per-page service bureau already serves.

## 3. Direct competitors

| Competitor | What it demonstrably does | Target / distribution | Pricing (public?) | Funding / maturity | Technical approach | Customer evidence | Would C01 beat it? |
|---|---|---|---|---|---|---|---|
| **Adobe Acrobat Pro** (cloud auto-tag, Auto-Tag API, Accessibility Checker) | Cloud auto-tagging of headings, borderless tables, lists, multi-column reading order; API handles native and scanned PDFs (Adobe, 2023). Adobe's help page admits "improperly combined elements or out-of-sequence tags". | Everyone; already licensed by nearly every campus/city | Subscription; not retrieved | Public; mature | ML tagging in Adobe cloud | AbilityNet (≈2 yrs old): better than the local tagger but "very important to manually review". Equidox: misclassified list, missed a table. Adobe Community (April 2026): spurious table tags; "extremely inaccurate". No 2025-26 benchmark found. | On quality, plausibly yes. On distribution, no. C01 must prove a pass-rate gap with a public benchmark; none exists. |
| **Anthology/Blackboard Ally** | Scores every course file; auto-generates alt formats (HTML, ePub, audio, tagged PDF, Braille, BeeLine) from PDF/Word/PPT (<100 pages for untagged sources). Quick Fixes: title, language, OCR of scanned PDFs, AI alt text (Claude Sonnet 5), and since **Ally 2.19 (July 13, 2026) auto-tagging of untagged PDFs for all institutions** at no extra cost. Roadmap: AI alt text inside PDFs, decorative-image bulk handling, OCR scoring, PDF/UA and PDF 2.0 research. Blackboard announced "AI-assisted PDF remediation" in Sept 2026 (news roundup, unverified detail). | Higher-ed via LMS (Canvas, Blackboard, D2L, Moodle, Schoology) | Quote-based; not public; all features in core licence | Part of Anthology (private); very mature | OCR + auto-tag + LLM alt text; instructor-in-the-loop | Competitor Aelira: deeper issues (reading order, untagged tables, tag tree) "may need specialist repair"; Anthology: "isn't aiming to provide full out-of-the-box remediation". Alt formats don't raise score for untagged PDFs. | Partly. Ally only sees LMS course files, not the public website/city documents, and does not claim PDF/UA. But for the initial "public college" buyer, Ally already owns the relationship and now ships tagging for free. Kill risk for the edu wedge. |
| **Allyant (CommonLook)** | CommonLook PDF added AI auto-tagging + web UI (July 8, 2025, BusinessWire); also services bureau. | Enterprise, gov, edu; direct sales | Software ≈$900/seat/yr (RemeDocs competitor estimate, unverified); services $5–8/page standard | Private; mature; merger/rebrand with CommonLook noted in listings | AI tagging inside Acrobat-adjacent editor; human remediation | 2017 WebAIM thread: "very expensive"; otherwise thin | Maybe on price/automation; Allyant has the service fallback C01 would need to build. |
| **Equidox (Onix)** | Equidox AI: fully automated tagging for high-volume **templated** docs (statements, reports), SaaS or managed service; manual editor for the rest. | Gov, finance, edu | Quote; by page count and complexity | Private (Onix); mature | ML/computer-vision models on templates | Stanford **replaced Equidox with PREP** as preferred tool (Stanford UIT). | Yes on non-templated long-tail documents, which Equidox AI explicitly does not target. |
| **Continual Engine PREP** | AI/automated remediation platform + human review service; adopted by Stanford as preferred PDF tool. | Higher-ed, services | Not public | Services firm, not VC-backed (per listing) | AI tagging + human QA | "Make your PDFs accessible in minutes" marketing | Closest analogue to C01's model; already in the market with reference customers. |
| **PDFix** | SDK/desktop for auto-tagging, validation, batch; case study: Jefferson County TX, 30,000 pages/month. | Gov, developers | Not public; "free tier" not confirmed | Private; mature | Rule-based + ML layout engine | None found | Maybe; PDFix is an engine, not a verified workflow. |
| **Apryse SDK; EqualWeb** | Apryse: OCR, auto-tag, PDF/UA validation SDK. EqualWeb: AI batch remediation (1,000 PDFs/job), self-reported score 84.9→96.8 on 20 docs. | Developers; SMB/gov | Not public | Private | SDK / AI batch | Vendor-only figures | Apryse is a potential supplier; EqualWeb's score is its own checker, not PDF/UA. |
| **Siteimprove** (Oct 2026) | Fall '26 release: PDF Remediation Agent fixing image issues in PDFs and publishing back to source, with human review; CMS agents for Drupal/WordPress. | Gov & edu web teams (already licensed for site audits, PDF inventory) | Enterprise | Private, large | Agentic + human review | Not yet | Siteimprove owns the PDF inventory step for many cities and universities (e.g., FIU). High risk it extends from images to structure. |
| **Crawford Technologies, axes4, Grackle** | Listed as active in 2026 roundups; no new facts retrieved. Unverified, not assessed. | — | — | — | — | — | — |
| **Aelira (Crampton IT)** | Open-core (AGPL) higher-ed scanner/remediator; BYO model (Gemini/OpenAI/Anthropic/Ollama); PDF fixes via pikepdf/PyMuPDF/OCRmyPDF; human approval; beta 0.9.13; 1 GitHub star. | Higher-ed | $299–$7,999/mo (site) | No funding found | Deterministic severity + LLM | None | Yes, it is immature; but it shows the idea is being tried at near-zero capital. |
| **Equalify Reflow** (UIC) | AGPL pipeline: Docling + OCR + Claude Haiku on Bedrock → semantic Markdown (not tagged PDF); PII scan; ~5 min/doc. CNI report cites ≈$0.061/page AI vs $4–5 manual. | Higher-ed (UIC) | Free | Equalify Inc, New Orleans; no funding listed | VLM/LLM | 8 stars | Different output (HTML/Markdown substitute), confirms the sub-$0.10/page cost floor. |
| **Open source engines** | **OpenDataLoader PDF** (≈30k stars, Apache-2.0): auto-tags untagged PDFs to Well-Tagged PDF, checked with veraPDF, built with PDF Association and Dual Lab (veraPDF devs); PDF/UA-1/2 export and visual studio are enterprise-only (Hancom). **ASU CIC PDF_Accessibility** (135 stars, MIT): AWS pipeline using Adobe Auto-Tag API + Bedrock alt text; "not suitable for production". **tfscharff/rebind**: PDF→PDF/UA-2 validating at zero veraPDF failures (0 stars). **vvatter/llm-pdf-remediation**: LLM + deterministic PDF/UA tooling. | Developers, institutions | Free | — | Exactly C01's architecture | — | **This is the strongest technical kill-evidence**: the proposed stack exists in open source, with the veraPDF maintainers themselves commercialising the PDF/UA export layer. |

## 4. Substitutes

| Substitute | Evidence | Threat |
|---|---|---|
| Manual service bureaus | $3–$15/page typical; Allyant $5–8 standard; Accessible.org $7.50–11.50; City of Cambridge ON quoted $7.50 simple / $12.50 moderate; scanned/OCR $3–8; complex $8–15+. AI-assisted bureaus $3–6 (TabNav); RemeDocs "<$0.50"; CNI/Equalify $0.06. | Price umbrella is real (50–100x), but AI-assisted bureaus are already compressing it. |
| Remediate-on-request | Explicitly sanctioned by the rule's preexisting-document exception (Maryland guidance). | Largest demand-killer for archive conversion. |
| PDF→HTML | ASU PDF-to-HTML, Equalify Reflow, Ally alt formats; regulators accept HTML. | Removes PDF/UA as the necessary target. |
| Overlays | FTC v. accessiBe: $1M settlement (Jan 3, 2025), final 20-year order April 2025 (C-4817), barred from claiming full WCAG compliance. No DOJ statement on overlays found. | Overlays don't fix PDFs; the FTC action helps C01's "verified" message. |
| Microsoft/Google checkers | Not retrieved in results; unverified. | Source-file fixing upstream reduces new untagged output. |
| Siteimprove/Ally inventories | Both count and score PDFs; Siteimprove now remediates. | Incumbent owns the funnel. |

## 5. Market size signals

- Level Access: >$100M ARR (company release, Dec 2024); third-party estimates $26–59M revenue conflict; ~$40M total funding (databases). No 2025–26 round found.
- AudioEye: TTM revenue ≈$41M (PitchBook, Mar 2026); 40th consecutive record quarter (FY2025); acquisitions ADA Site Compliance (2024), Accessibility Now (2022). Note: largely web overlay/platform, not documents.
- No credible document-remediation market figure retrieved; one "$15B" claim appeared unsourced and is rejected.
- Scale anecdotes (vendor): "hundreds of thousands of PDFs" per university; Ohio State "thousands" of docs (PDFix); 59/60 county PDFs failed (vendor sample).
- California Community Colleges: no systemwide remediation RFP found. Chancellor's Office memos ESS 26-17 (Feb 2026: standards adopted; colleges "may not delegate or contract away" obligations) and ESS 26-38 (May 2026: extension). LACCD RFP 22-05 (2022) sought multiple document-remediation vendors — district-level precedent. Contact listed: Accessibility@CCCTechCenter.org.

## 6. Could Adobe or Anthology ship good-enough in a quarter?

**Anthology already did.** Ally 2.19 (July 2026) tags untagged PDFs for every licensed institution inside the core licence; AI alt text for PDF images is next. It stops short of PDF/UA and deep structure repair, but meets the "good enough for the instructor" bar for LMS content, and the roadmap lists PDF/UA research. For public colleges, C01's wedge collapses to website/administrative documents outside the LMS.

**Adobe** already has cloud auto-tag and an API; it lacks a verified pass rate and a review queue. Evidence that accessibility offices accept Acrobat auto-tag output as final: **none found.** Every university guide retrieved (Clemson, MSU Denver, UNR, UMaryland, Texas A&M) treats it as a first pass needing manual checking, and the April 2026 Adobe forum thread shows quality complaints. Acrobat is also the editor used after auto-tag, so Adobe keeps the seat either way. A "verified" mode with veraPDF-style reporting is a one-quarter project for Adobe, though it has shown little urgency.

Effect on the startup: "free, mostly right" from incumbents pushes willingness-to-pay toward zero for in-LMS content; the defensible residual is guaranteed PDF/UA conformance with audit evidence, batch volume across city and campus websites, and a service fallback for failures.

## 7. Shutdowns and churn

No PDF-remediation company found shut down or acquired in 2024–26 (the Baker & Taylor hit is a book distributor). Churn observed: Stanford dropped Equidox for PREP; Allyant/CommonLook consolidated; AudioEye absorbed three web-overlay firms. The accessiBe FTC order is the only enforcement casualty, and it concerns web overlays, not documents.

## 8. Kill-evidence ranking

1. Rule exception: preexisting PDFs need only on-request remediation; the backlog is optional.
2. Ally ships PDF auto-tagging free in-licence (July 2026) to the initial buyer.
3. OpenDataLoader PDF (Apache-2.0, veraPDF co-developed) replicates the engine; Hancom/Dual Lab sell the PDF/UA layer.
4. DOJ's one-year extension and threat to re-propose the rule's substance.
5. Price floor already ~$0.06–$0.50/page from AI bureaus, so "far below manual" is table stakes.

**Most important unknown:** actual veraPDF/PDF-UA pass rates and screen-reader correctness of Acrobat, Ally 2.19 and OpenDataLoader on real scanned/complex documents. No independent 2025–26 benchmark exists; publishing one is the cheapest way to prove or kill C01.

## Sources (all retrieved 2026-11-02)

- https://www.duanemorris.com/alerts/doj_extends_ada_title_ii_digital_accessibility_deadlines_one_year_0426.html
- https://www.reedsmith.com/articles/doj-extends-digital-accessibility-compliance-dates-under-title-ii-of-the-ada/
- https://www.adatitleiii.com/2026/04/doj-extends-ada-title-ii-website-accessibility-deadlines-for-governmental-entities-but-litigation-and-compliance-risks-remain/
- https://www.siteimprove.com/blog/ada-title-ii-interim-final-rule/
- https://www.consumerfinancialserviceslawmonitor.com/2026/04/doj-extends-title-ii-ada-web-accessibility-rule-compliance-deadlines-for-state-and-local-governments/
- https://accessibility.arizona.edu/news/doj-issues-interim-final-rule-title-ii-digital-accessibility-compliance-dates
- https://upcea.edu/doj-extends-accessibility-deadline-to-april-2027-policy-matters-april-2026/
- https://www.audioeye.com/post/2027-accessibility-compliance-deadlines/
- https://digital.maryland.gov/accessibility/accessible-documents-and-webpages/content-exempt-ada-title-ii
- https://digital.maryland.gov/accessibility/accessible-documents-and-webpages/how-archive-electronic-documents
- https://cmo.vermont.gov/node/646
- https://erp.gatech.edu/title-ii/exceptions
- https://www.wisconsin.edu/digital-accessibility/exceptions-to-title-ii/
- https://doit.txst.edu/accessibility/laws-policies-and-standards/standards/standards-title-2-exceptions.html
- https://www.acquia.com/blog/european-accessibility-act-and-en-301-549-your-complete-compliance-guide.md
- https://www.quadient.com/en/blog/european-accessibility-laws-standards
- https://www.equalweb.com/platform/standards/eaa.html
- https://business.adobe.com/blog/pdf-accessibility-mandates-for-businesses-gain-urgency
- https://helpx.adobe.com/acrobat/using/creating-accessible-pdfs.html
- https://blog.adobe.com/en/publish/2023/05/17/making-pdfs-accessible-to-all
- https://abilitynet.org.uk/news-blogs/evaluating-adobes-new-cloud-based-auto-tagging-feature-pdf-accessibility
- https://equidox.co/blog/the-truth-about-auto-tagging-pdfs/
- https://community.adobe.com/questions-9/auto-tagging-fails-accessibility-1556749
- https://www.clemson.edu/accessibility/digital/guides/pdf/remediation/untagged-documents.html
- https://www.msudenver.edu/teaching-learning-design/instructional-accessibility/guides-resources/word/remediate-pdf/
- https://unr.edu/digital-learning/accessibility/pdfs/streamlined-remediation
- https://idea.ssw.umaryland.edu/accessibility/document-remediation/remediate-pdfs-with-adobe-acrobat
- https://marcomm.tamu.edu/accessibility/how-to-remediate-an-existing-pdf-using-adobe-acrobat-pro/
- https://support.anthology.com/s/article/Ally-2-19-Release-to-production-July-13-2026?language=en_US
- https://help.anthology.com/ally-lms/en/administrators/whats-new/2026-release-notes.html
- https://www.blackboard.com/blog/the-blackboard-ally-roadmap-2026-accessibility-that-complements-teaching-workflows
- https://community.blackboard.com/public/blogs/looking-ahead-highlights-from-the-ally-roadmap-session-at-building-blackboard-together-2026-08-05
- https://community.anthology.com/public/blogs/highlights-from-the-western-region-ally-user-group-meeting-2026-06-22
- https://community.anthology.com/public/blogs/pdf-assisted-remediation-quick-fixes-is-almost-here-answers-to-the-faqs-youve-been-wondering-about-2025-08-22
- https://help.anthology.com/ally-lms/en/administrators/ai-alt-text-assistant.html
- https://help.anthology.com/ally-lms/en/instructors/alternative-formats/alternative-formats-faqs.html
- https://help.anthology.com/ally-lms/en/instructors/improve-content-accessibility/tag-a-pdf.html
- https://aelira.ai/au/reviews/blackboard-ally
- https://aiagentstore.ai/ai-agent-news/topic/accessibility-inclusion/2026-09-15
- https://www.siteimprove.com/press/siteimprove-advances-its-agentic-content-intelligence-platform/
- https://core.fiu.edu/blog/2026/audit-the-pdfs-on-your-website-with-siteimprove.html
- https://www.businesswire.com/news/home/20250708014451/en
- https://remedocs-website.pages.dev/competitors/
- https://remedocs-website.pages.dev/competitors/remedocs-vs-allyant/
- https://webaim.org/discussion/mail_message?id=50543
- https://equidox.co/pdf-solutions/high-volume-solutions/
- https://equidox.co/blog/pdf-remediation-pricing-am-i-getting-a-good-deal/
- https://equidox.co/blog/pdf-remediation-software-buyers-guide/
- https://www.whoisaccessible.com/reviews/equidox/
- https://uit.stanford.edu/news/prep-ai-powered-pdf-remediation-service
- https://www.continualengine.com/blog/top-10-pdf-remediation-service-providers-for-2026/
- https://pdfix.net/
- https://pdfix.net/pdf-compliance-software/ada-title-ii-university-pdf-accessibility-deadline/
- https://apryse.com/blog/pdf-remediation-ada-2026
- https://www.equalweb.com/11856/11528/pdf_ai_remediation
- https://digitalgovernmenthub.org/examples/pdf-accessibility-remediation/
- https://github.com/ASUCICREPO/PDF_Accessibility
- https://github.com/opendataloader-project/opendataloader-pdf
- https://github.com/EqualifyEverything/equalify-reflow
- https://github.com/Aelira-AI/aelira-core
- https://github.com/Vamsi-2581/aelira-core
- https://github.com/tfscharff/rebind
- https://github.com/vvatter/llm-pdf-remediation
- https://aelira.ai/us/about
- https://www.crunchbase.com/organization/equalify
- https://accessinghigherground.org/ow-an-open-source-pdf-remediation-tool-can-accelerate-document-accessibility/
- https://www.cni.org/wp-content/uploads/2025/12/CNI_Project_Tressler.pdf
- https://venngage.com/blog/pdf-accessibility-cost/
- https://www.digitala11y.com/?p=24025
- https://accessible.org/?p=1011030
- https://calendar.cambridge.ca/Council/Detail/2025-10-27-1300-Cambridge-Accessibility-Advisory-Committee/4d00e30f-2c9d-45a0-bea2-b37f013fbdbe
- https://tabnav.com/pdf-remediation
- https://remedocs-website.pages.dev/government/
- https://www.skynettechnologies.com/blog/pdf-accessibility-cost-factors
- https://yomotherboard.com/?p=449958
- https://www.silicon.co.uk/press-release/level-access-first-digital-accessibility-only-company-to-surpass-100-million-annual-recurring-revenue-arr
- https://getlatka.com/companies/level-access
- https://prospeo.io/c/level-access
- https://pitchbook.com/profiles/company/56776-06
- https://stockanalysis.com/stocks/AEYE
- https://www.barchart.com/story/news/592487/audioeye-reports-record-fourth-quarter-and-full-year-2025-results
- https://getlatka.com/companies/audioeye.com
- https://jdsupra.com/legalnews/ftc-targets-accessibility-overlays-5593127
- https://technologylaw.fkks.com/post/102jsmj/ftc-finds-website-overlay-tool-failed-to-deliver-accessibility-promises
- https://adrianroselli.com/2025/01/ftc-catches-up-to-accessibe.html
- https://testparty.ai/blog/are-accessibility-overlays-legal
- https://www.cccco.edu/wp-content/uploads/2026/03/ess-26-17-accessibility-standards-and-revised-ada-title-ll-regulations-a11y.pdf
- https://laspositascollege.edu/onlinelearning/faculty/accessibility/images/ess-26-38-revised-ada-title-ii-regulations-timeline.pdf
- https://www.cccco.edu/-/media/CCCCO-Website/docs/rfa/oer-rfa-aug-2025-a11y.pdf
- https://www.laccd.edu/sites/laccd.edu/files/2023-06/22_05__Digital%20Product%20and%20Services%20Accessibility%20Remediation%20Services.pdf
- https://www.csustan.edu/access-for-all/guidelines-resources/document-accessibility
- https://bmiimaging.com/blog/document-management/pdf-accessibility-compliance/
- https://www.siteimprove.com/blog/ada-title-ii-public-universities/
- https://www.audioeye.com/post/title-ii-requirements-higher-education/
- https://en.wikipedia.org/wiki/Baker_%26_Taylor
