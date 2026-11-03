# Diligence: Competitors, Pricing and Remediator Throughput (Round 3)

Retrieved 2026-11-03. Method: about 20 web searches. Only github.com and raw.githubusercontent.com could be fetched, and the Equalify GitHub file returned 404, so nearly every fact below comes from search-result snippets and summaries. I did not read the full source pages. Items marked **[unverified]** come from a single vendor source, a secondhand account, or an undated page.

## 0. Context that changes the timing

- In April 2026 DOJ issued an interim final rule that pushes Title II deadlines back one year. Entities with 50k+ population now have until **April 26, 2027**. Entities under 50k and special districts have until **April 26, 2028**. WCAG 2.1 AA is unchanged. DOJ also said it may start a separate rulemaking that could revise K-12 scope (Campus Technology; LMC; AASA). NFB has sued over the delays (NFB Braille Monitor, July 2026).
- What this means: most small Bay Area cities (under 50k) and many districts now face a 2028 deadline. The "deadline panic" sales window has moved out. Large cities and counties (2027) are the near-term buyers.

## 1. Low-cost and AI-first vendors: price and packaging

| Vendor | Pricing evidence | Model / output | Notes |
|---|---|---|---|
| **CivAll** | No published price. Oct 2026 launch PR says "no staff uploads or per-page fees" and "single line of code" | Sitewide automated, script-based (DocAccess-style) | Output format not stated in snippet **[unverified]**. Launch was timed to Title II deadlines |
| **RemeDocs** | Inconsistent. G2: Starter $29.99 for 10 PDFs/mo, Growth $99.99 for 100 PDFs/mo. Own FAQ: custom quote "starting at $100/month". Comparison page: "from $1,200/yr". Elsewhere: "typically under $0.50 per page" | Flat monthly subscription sized to backlog. Accepts POs, offers gov volume pricing | Prices are per document, not per page, which weakens per-page comparisons |
| **TabNav** | No public per-page PDF price found. Its own marketing says AI-powered remediation "typically $3–$6 per page" against ">$15" for manual. GetApp: flat-rate, free tier | Subscription and AI widget | The $3–6 figure describes the market, not TabNav's own rate **[unverified]** |
| **Accessiblü** | $5/page standard, manual, WCAG 2.1 AA / PDF/UA (via a UIC Equalify comparison) | Human-performed tagged PDF | Date of price capture unknown **[unverified]** |
| **Optimal Solutions Group** | Won **Washington State cooperative contract 02024** (May 2026). Cooperative use is open to local governments and school districts **in any state** | Tagged PDF to PDF/UA (ISO 14289-1/-2) or WCAG 2.2 AA | Ceiling prices below |
| **WA 02024 ceilings (all awardees)** | e.g. simple **$3.34/page**, complex **$4.60/page** (1–2 page jobs, 2–3 business day turnaround). Legal docs $4.51 / $6.21. Rates vary by volume and turnaround | Maximums. Buyers may negotiate lower | Other awardees include Prisma and Chax Training & Consulting (file names). BarrierBreak announced a separate WA selection |
| **CasoComply** | "From $0.30/page" automated | Automated | Marketing claim |
| **Laydox / accessibility.build / others** | $3 standard, $7 structured, $12 complex, $150 minimum (one US provider in a search summary). EU provider: €3/€5/€8 | Human or hybrid | Shows how vendors tier by complexity |
| **Revise** | Nothing found | — | Gap |

**Benchmarks from institutional contracts:**
- **Ohio State DAS awarded suppliers.** Allyant base rate $5.00/page with an individual fixed-price quote per document and no minimum spend. OCR adds $3/scanned page. Deque charges $15/page flat (forms included) with 5-business-day turnaround to WCAG 2.1 AA + PDF/UA. Mobikasa uses tiered pricing.
- **Harvard HUIT vendor list.** One vendor charges simple $4/page and complex $8/page with no minimum. The vendor is not named in the snippet.
- An AWS Public Sector blog, as cited secondhand by Equalify, puts OSU's estimate for manual library remediation at $3–4/page **[unverified]**.

**Takeaway:** The founder's $3–5/page sits right at the ceilings of public contract vehicles that any US district can piggyback on (WA 02024). It does not undercut the market. Allyant, the "premium" incumbent, charges $5/page at OSU. Price alone will not win.

## 2. CivicPlus DocAccess and AudioEye/Granicus

**What DocAccess outputs.** Per CivicPlus, it converts public PDFs into "ADA-aligned **HTML transcripts**" using OCR, image processing and AI models. "Complex pages undergo additional human review at no extra cost." It rebuilds structure from scratch, and the original PDF stays up for print and archive. **The source PDF is not modified**, so any PDF that is downloaded, emailed or forwarded keeps its original barriers.

**2026 pricing evidence.**
- **City of Clovis, CA, DocAccess service agreement (April 2026).** **$27,025/year**, presented against a one-time "traditional remediation" estimate of **$75,943**. Unlimited views and 250-language translation are included, and an initial period was complimentary. This is a flat annual fee sized to page volume, not a per-page price.
- Reviews describe the pricing as usage-based by page volume, with a free scan followed by a proposal.
- **St. Joseph (MO) School District.** Staff proposed a one-year, **enrollment-based $10,200** contract for websites and PDFs, including converting PDFs to HTML. The vendor is not named in the snippet, but the model matches DocAccess **[unverified vendor]**. The same article quoted manual remediation at $0.32–$20/page.
- **AudioEye.** Miami County, KS (April 2025) added AudioEye to its CivicPlus contract at $4,000/yr for website monitoring and automated remediation, not PDFs. I found no 2026 AudioEye or Granicus per-page PDF contract pricing (gap).

**Criticism of HTML transcripts.**
- Accessible.org ("Does DocAccess Make PDFs ADA Compliant?") argues that the rule's two permissions for conforming alternate versions do not provide "a gateway for the general use of only DocAccess HTML transcript versions of PDFs."
- The DOJ rule allows alternate versions only where direct accessibility is impossible because of technical or legal limitations. Lack of skill or training does not count. In its rationale DOJ rejects "a segregated approach and a worse experience" (Brown Goldstein Levy; Illinois DoIT).
- The counter-argument is "equivalent facilitation" under 28 CFR 35.203 (Revolution Data Systems; GovTech). **No court ruling or DOJ guidance settles the question** (as of the results seen). Several of these commentators are vendors.
- I found no NFB/ACB statement specifically on DocAccess or AI PDF remediation (gap). NFB's long-standing opposition to overlays (accessiBe "harmful", 2021) is the closest analogue.

## 3. Quality complaints about automated, AI and cheap remediation

- **Academic.** A 2025 arXiv study of Adobe auto-tagging found that users fix checker-reported issues "but often overlook checking the accuracy of the tags." Checkers "can provide a false impression of accessibility."
- **Siteimprove (2025–26).** It regularly finds "remediated" PDFs that passed automated checks but were "completely unusable with a screen reader." Auto-tagging breaks header-to-cell relationships in complex and merged-cell tables.
- **axes4 blog (2026), "AI & PDF Accessibility: Hype, Help, or Hindrance?".** AI mis-tags visual bold/large text as headings and mistranslates complex tables. Alt text is literal rather than purposeful.
- **Braille Works (National ADA Symposium).** AI "is not consistently accurate enough to complete the process without qualified human review."
- **Adobe's own docs** (quoted by Equidox) say auto-tag output "is not guaranteed to comply" with WCAG/PDF-UA.
- Even AI vendors (EqualWeb) say expert review "remained necessary."
- **Offshore/cheap vendors.** The evidence is thin and dated. A Tech4Planet post says low-price vendors rely on Acrobat's checker and clients end up paying to have whole documents reworked. Documenta11y lists "repeated rework, hidden revision fees" as red flags. I found no independent data on offshore rework rates (gap).
- **Buyer behavior.** Coalinga, CA (Feb 2026) added up to **$9,172.88** for PDF remediation specifically to cover complex documents (construction drawings, plans, maps, legacy PDFs) "that automated tools can't handle." This is direct evidence that a small city buys human work on top of automation. I could not confirm the vendor.

## 4. Who a small Bay Area city or district would compare the founder to

1. **The incumbent website vendor's add-on** (CivicPlus DocAccess, or whatever comes with Granicus/Finalsite/AudioEye). The buyer already has the contract, procurement is easy, and the fee is a flat annual one (Clovis: about $27k/yr; St. Joseph: $10.2k/yr). This is the default "do nothing new" choice.
2. **A cooperative contract vehicle** such as WA 02024 (Optimal, Prisma, Chax, etc.), with ceilings of $3.34–4.60/page and 2–3 day turnaround. A purchasing officer can use it without running an RFP.
3. **National service firms** on university lists: Allyant at $5/page, Deque at $15/page with 5-day turnaround.
4. **Cheap subscriptions** (RemeDocs at $100/mo) and offshore freelancers.
5. **Local digital agencies.** Evidence: Shockwave Digital Advertising built an unofficial "Coalinga demo" site showing council documents remediated to PDF/UA-1 and checked with veraPDF. This is a pitch, not a confirmed win. Contra Costa County (Bay Area) put out an RFP for about **400,000 PDF pages** across 10 websites (Aug 2025) and reserved the right to award multiple bidders. No award was found. The solicitation was surfaced via a search summary, and I could not match it to a specific listing URL **[unverified]**.

**Where the founder can win:** Price parity with the cooperative ceilings ($3–4.50/page simple, more for complex), plus things the incumbents don't offer:
- (a) a real **tagged PDF** that stays accessible when downloaded, which addresses the DocAccess transcript gap
- (b) **per-page verification evidence**: PAC/veraPDF reports plus a screen-reader check log
- (c) **turnaround of 2–3 business days or less** on agenda packets and board documents, to match or beat WA 02024 and Deque's 5 days
- (d) small minimums and fixed per-document quotes under micro-purchase/informal-bid thresholds, so no RFP is needed

I found **no documented case of a small entity choosing a small local vendor** (gap). Coalinga and the Shockwave demo are the nearest signals.

## 5. Remediator throughput (unit economics)

| Source | Figure | Reliability |
|---|---|---|
| RemeDocs enterprise backlog guide | Simple (single-column, few images): **15–25 pages per labor-hour**. Moderate: **6–12**. Complex (multi-column, complex tables, forms, charts): **2–5**. Enterprise average about **4–12 pages/labor-hour** | Vendor blog **[unverified]** |
| WebAIM list practitioner (older thread) | About **3–12 minutes per page** for standard documents (5–20 pages/hr) | Practitioner anecdote |
| Equidox blog | Simple text-based PDF: **15–30 min per document** manually. Complex report: hours to days | Vendor |
| Univ. of North Dakota web team, citing Equidox | Plan on **about 30 min per page** as a starting assumption (about 2 pages/hr) | Secondhand, conservative |
| AccessibilityOnDemand comparison | Complex page: **15–30+ min** (2–4 pages/hr). One complex table can take **30 min per page** | Vendor |
| Equidox testimonial | A report went from 1.5 hrs to under 10 min with the tool | Anecdote |

I found no solo remediator who publishes a pages-per-day capacity (gap).

**Implied economics at $3–5/page.** These figures assume AI pre-tagging lifts simple documents to the top of the human range.
- Simple pages at 15–25/hr gross **$45–125/hr**.
- Moderate pages at 6–12/hr gross $18–60/hr.
- Complex pages at 2–5/hr gross **$6–25/hr**, which loses money at a flat rate.
- A 6-productive-hour day yields about 90–150 simple pages, or about 12–30 complex pages.

The market prices complexity in tiers: WA 02024 at $3.34/$4.60, Harvard's vendor at $4/$8, a US provider at $3/$7/$12, and Allyant quoting per document. The founder must do the same, or exclude scanned, form and table-heavy documents from the flat rate.

## Gaps and caveats
- I found nothing on Revise. CivAll's price and output format are unconfirmed. I found no 2026 AudioEye/Granicus PDF pricing, no NFB/ACB position on AI PDF remediation, and no offshore rework data.
- Most throughput figures come from vendors. A timed pilot on 50–100 real city and district pages is the only reliable way to set the unit-economics inputs.

## Sources (retrieved 2026-11-03)
- https://www.einpresswire.com/article/952975695/civall-launches-automated-pdf-accessibility-ahead-of-ada-title-ii-deadlines
- https://www.g2.com/products/remedocs/pricing
- https://remedocs-website.pages.dev/help/faq/
- https://remedocs-website.pages.dev/government/
- https://remedocs-website.pages.dev/competitors/remedocs-vs-docaccess/
- https://remedocs.com/blog/enterprise-pdf-remediation-backlog-guide/
- https://remedocs.com/pricing/
- https://tabnav.com/pdf-remediation
- https://www.getapp.com/all-software/a/tabnav
- https://www.accessiblu.com/pdf-remediation/
- https://equalify.uic.edu/EqualifyEverything/equalify-docs/blob/main/reflow/sources.md
- https://optimalsolutionsgroup.com/2026/05/26/optimal-awarded-washington-state-document-accessibility-pdf-remediation-contract/
- https://apps.des.wa.gov/contracting/02024OptimalSolutions.pdf
- https://apps.des.wa.gov/contracting/02024ContractSummaryPageFAQ.pdf
- https://apps.des.wa.gov/DESContracts/Home/ContractSummary/02024
- https://www.barrierbreak.com/barrierbreak-selected-by-washington-state-to-deliver-accessible-document-remediation-services/
- https://das.osu.edu/resources/pdf-remediation-suppliers
- https://accessibility.huit.harvard.edu/doc-vendors
- https://casocomply.com/services/pdf-remediation
- https://laydox.com/insights/accessible-pdf-remediation-cost.html
- https://www.civicplus.com/web-accessibility-software/docaccess/
- https://www.civicplus.help/docaccess/docs/docaccess-faqs
- https://docaccess.com/agreement/2d66012c-4b70-496d-9363-bd1f5289aeae
- https://citizenportal.ai/articles/7738302/missouri/school-districts/st-joseph/district-staff-proposes-10200-vendor-contract-to-bring-websites-and-pdfs-into-doj-accessibility-compliance
- https://citizenportal.ai/articles/6265181/kansas/miami-county/commission-approves-audioeye-contract-to-monitor-county-website-accessibility
- https://accessible.org/does-doc-access-make-pdfs-ada-compliant/
- https://doit.illinois.gov/initiatives/accessibility/iitaa/iitaa-updates/conforming-alternate-versions.html
- https://browngold.com/blog/eight-key-takeaways-from-the-dojs-new-web-and-mobile-accessibility-rule-for-public-entities/
- https://www.revolutiondatasystems.com/blog/fix-the-pdf-or-publish-an-html-version
- https://www.govtech.com/voices/the-great-pdf-reckoning-a-wake-up-call-for-ada-compliance
- https://campustechnology.com/articles/2026/04/27/doj-extends-deadline-for-ada-title-ii-compliance.aspx?p=1
- https://www.lmc.org/news-publications/news/all/doj-extends-web-accessibility-compliance-deadlines-for-local-governments/
- https://www.aasa.org/resources/blog/doj-delays-website-accessibility-compliance-for-1-year
- https://nfb.org/images/nfb/publications/bm/bm26/bm2607/bm2607.htm
- https://nfb.org/images/nfb/publications/bm/bm24/bm2401/bm240112.htm
- https://arxiv.org/pdf/2503.22216
- https://www.siteimprove.com/blog/guided-vs-automated-pdf-remediation/
- https://www.axes4.com/en/blog/post/2026-1/ai-pdf-accessibility-hype-help-or-hindrance
- https://brailleworks.com/national-ada-symposium-ai-can-assist-with-document-remediation/
- https://equidox.co/blog/the-truth-about-pdf-accessibility-automation-ai-accuracy-and-compliance/
- https://www.equalweb.com/11856/11528/pdf_ai_remediation
- https://www.tech4planet.com/low-quality-pdf-remediation-can-cost-you-big-quality-matters/
- https://documenta11y.com/blog/how-to-identify-failing-pdf-remediation-vendors
- https://coalinga.novusagenda.com/AgendaPublic/CoverSheet.aspx?ItemID=6216&MeetingID=702
- https://coalinga-demo.pages.dev/ada
- https://govtribe.com/opportunity/state-local-contract-opportunity/41-2026-02lb-accessibility-improvement-sw-and-services-doc1972279218
- https://equidox.co/blog/how-long-does-it-take-to-remediate-a-pdf/
- https://blogs.und.edu/web-redesign/2025/03/extreme-makeover-pdf-edition/
- https://webaim.org/discussion/mail_message?id=36333
- https://webaim.org/discussion/mail_message?id=26701
- https://accessibilityondemand.ai/post/pdf-remediation-cost-per-page-for-nonprofits-7-options-compared
