# Check: inbox-level RFQ reading layer for 5-25 person machine shops

Idea (DeepSeek): read incoming RFQ emails, PDF drawings and STEP files; extract dimensions, materials, tolerances, quantities and missing fields into a review table; export to the shop's existing estimating tool or spreadsheet. Claimed moat: per-shop correction history.

Researched 2026-11-03 with about 20 web searches. Most sources are vendor pages or funding press. Anything I could not confirm is marked UNVERIFIED.

## Bottom line

**Verdict: KILL.** This exact wedge (the inbox, extraction and missing-field flags) is already being built by at least three funded teams that sell to the same small high-mix shops:

- **Uptool**: $6M seed from Khosla, Eclipse, Bessemer and Kleiner. It connects to the shop's quoting inbox and lists from US$195.
- **Forgepoint**: $9.8M seed in October 2026 from Primary and a16z speedrun. Its agent reads the RFQ email, flags missing requirements and contacts the buyer itself. The company claims seven-figure ARR within six months.
- **Paperless Parts**: the incumbent. Its AI email-forwarding intake comes free with every subscription.

ERP vendors (JobBOSS2/ECI) and CAM vendors (CloudNC Quote Agent at $2.50 per part) are adding the same features. Anyone can buy the extraction engine itself as an API (Werk24). The "per-shop correction history" moat is the same data flywheel every one of these competitors already collects, and they have years and thousands of quotes of head start. On top of that, defense-related shops face ITAR/CMMC rules that make a teenager-run cloud tool that sends drawings to commercial LLM APIs very hard to sell.

## Competitor table

| Product | What it does relevant to this idea | Price (as found) | Funding / traction |
|---|---|---|---|
| **Paperless Parts** (incl. Wingman AI) | Forward an RFQ email and a quote is created. AI pulls part numbers, revisions, descriptions and quantities from the email, assigns files to line items, picks a material from the print and highlights where it found it. GD&T extraction is "in development". The company states its platform is FedRAMP Moderate Equivalent and CMMC L2 assessment-ready. Says AI cut quote setup time by 90%. | Not public. Directories give conflicting figures: ~$31/user/mo (Capterra) and ~$300/mo (SpotSaaS). Setup tools including email forwarding are "no additional cost". | $30M Series B (2021, OpenView). CB Insights lists ~$45.5M over 8 rounds (UNVERIFIED). Customer count not published. |
| **Uptool** | Connects to the quoting inbox, extracts and organizes emails, CAD, drawings and BOMs. The estimator sets a few key details and the AI applies the shop's rates. Built for small high-mix machine and fab shops. | Capterra: from US$195, usage-based, free trial. Launch PR: "no upfront cost", 1-hour setup. | $6M seed (Khosla, Eclipse, Bessemer, Kleiner). Came out of stealth Feb 2026. Testimonial: a 2-hour quote now takes 10 minutes. |
| **Forgepoint ("Frank")** | AI inside-sales rep. Reads the RFQ email and attachments, flags missing requirements, contacts the buyer for clarification, prices with the shop's cost model, routes drafts for approval, then sends and follows up. | Not found | $9.8M seed (Oct 2026; Primary, a16z speedrun). Claims seven-figure ARR within 6 months (company claim). Founded 2025. |
| **CloudNC Quote Agent** | Builds quotes from uploaded CAD and drawings, with manufacturability and risk review. Its CAM Assist product is used by 1,000+ shops. | 3 quotes/mo free, then $2.50/part | Raised $20M in Sept 2026 |
| **Werk24** | API that reads 2D technical drawings (dimensions, tolerances, materials, title block). Used by Laserhub for instant quoting. | Tier fee plus per-page charge, pay-as-you-go. 100-drawing trial. A directory lists €990/mo "Essential" (UNVERIFIED). | Private; not checked |
| **Morsa** | Reads RFQs and drawings, pulls past jobs and outside-process prices, drafts quotes for the estimator to approve | Not found | Not found |
| **Toolpath** | AI CAM plus quote/no-quote and cost estimation | Not found | $10M seed (2024); ~$20M total incl. Kennametal |
| **CADDi Drawer** | AI drawing database: reads and searches prints by shape and spec. Aimed at high-mix manufacturers, mostly OEMs. | Enterprise | Sept 2026 round reported as $114M at $1.2B to push into North America (figure conflicts across sources) |
| **JobBOSS2 / E2 (ECI)** | "AI BOM builder" pulls BOM data from PDFs, Excel and images into quotes. Already inside the ERP these shops use. | Bundled/ERP | ECI (large incumbent) |
| **ProShop ERP** | A GetApp listing says an AI tool extracts details from quote packages (UNVERIFIED; may be confused with Paperless Parts Wingman) | ERP | Not checked |
| **Vendra (YC S24), Poka Labs (YC, listed by Extruct)** | Vendra reads CAD/RFQs and matches them to shop capacity. Poka Labs: "AI agents for industrial quoting". | Not found | YC |
| **Xometry / Protolabs / Hubs / Fathom / AMFG** | Instant quoting marketplaces and quoting software (AMFG markets ITAR/CMMC secure quoting). They compete for the buyer's RFQ, not the shop's inbox. | Not checked | Public or large private |

Not found in my searches: Partful, Quotemachine, Bild. Absence from my results does not mean they don't exist.

## Claims checked

| DeepSeek claim | Status | Evidence |
|---|---|---|
| "Estimators spend 20-45 minutes per request chasing missing data" | **UNVERIFIED** | No machine-shop source found. The closest is a CloudNC blog: "25-45 minutes per line", but that is for the whole estimate, not for chasing data. A 2026 WHMA survey (wire harness, an adjacent industry) found 70% say incomplete customer info limits quoting. The pain is real, but the number looks invented or repurposed. |
| "Quotes inside 48 hours win roughly a quarter more often" | **UNVERIFIED** | Only vendor-blog figures exist: one case study says ~40% win rate within 48 hours vs 22% before, and broadn says first responders win "up to 50%" more. No primary study found. |
| "OCR pre-population pre-fills ~90% of the quote envelope" | **UNVERIFIED (likely garbled)** | No source gives a 90% field pre-fill rate. The closest is Paperless Parts' claim that AI "cuts quote setup time by 90%", which measures time, not field coverage. A 2026 article notes that AI extraction still needs human judgment on poor scans and unusual geometry. |
| "Funded competitors leave the 'just read my inbox' segment underserved" | **FALSE** | Uptool connects to the inbox and targets small high-mix shops at ~$195. Forgepoint reads email, flags missing info and chases the buyer. Paperless Parts includes email-forwarding AI intake at no extra cost. |
| Target market is large (implied) | **PARTLY TRUE** | ~17,156 machine shop establishments with paid employees (CBP 2023, via third-party sites) and ~223k employees, an average of ~13 per establishment. So many shops fall in the 5-25 band, but I found no size-class breakdown (UNVERIFIED share). |

## Market notes

- **Size:** ~17,000-17,500 US machine shop establishments (NAICS 332710, 2022-2023), down 277 year over year. At an Uptool-like price of ~$200-$500/month, even 10% of shops is roughly $40M-$100M ARR. That is a decent niche, but not a path to a very large company unless the product expands into a shop operating system, which Uptool and Forgepoint both already plan.
- **Software spend and buying behaviour:** No credible survey found (UNVERIFIED). Directory prices suggest shops pay $30-$300+/user/month for quoting. They buy through demos, trade press (MMS, IMTS) and ERP bundles, and competitors offer "no upfront cost" and free tiers. Free or bundled options set the price ceiling for a point tool.
- **Demand in 2026:** Mixed. The 2026 Reshoring Survey says 36% of OEMs reshored in 2026 (up from 29%), and the biggest problem was uncertainty more than the tariffs themselves. IBISWorld cites contracting machine-shop demand. A vendor blog relaying AMT data says job-shop order value rose more than 25% in early 2026 while mid-tier job shops are "quiet". Reshoring helps, but it is not a clear surge in RFQs for small shops.

## Barriers

- **ITAR/CUI:** Drawings, CAM programs and travelers on DoD programs are commonly treated as both ITAR technical data and CUI. Even a small shop several tiers below the prime contractor is covered. Risk starts at the RFQ stage. The CMMC DFARS rule took effect Nov 10, 2025, so Level 2 contracts need third-party (C3PAO) assessment, and any cloud service touching CUI falls inside the assessment scope. Foreign-person access to cloud storage or admin functions, and backups replicated outside the US, are typical ITAR failures.
- **What that means for this product:** sending drawings to a commercial LLM API is a problem for any defense-tier shop. The incumbents already advertise compliance: Paperless Parts (FedRAMP Moderate Equivalent, CMMC L2-ready), AMFG and Prototek (ITAR/CMMC). A solo 17-year-old cannot realistically get a FedRAMP-equivalent posture. US-person-only infrastructure (for example GovCloud-hosted models) may be possible, but that is my inference and was not researched. The founder would have to exclude defense work, which is a large share of precision machining.
- **Trust:** Shops would be handing customer IP (prints, pricing) to an unknown vendor, under contracts signed through a parent-managed LLC. Competitors offer VC backing, SOC2/CMMC claims and trade-show presence. No data found on how shops vet vendors (UNVERIFIED), but this is a known drag on SMB manufacturing sales.

## What would have to be true to revive it

There would need to be a clear underserved slice that Uptool, Forgepoint and Paperless Parts ignore: for example, non-US shops, a specific process such as Swiss turning or sheet metal in a region they skip, or a white-label extraction API sold to ERP vendors. None of those showed up in this research.

## Sources

- https://www.paperlessparts.com/blog/paperless-parts-wingman-your-new-ai-powered-partner-in-quoting/
- https://www.paperlessparts.com/paperless-parts-wingman/
- https://www.modernmetals.com/paperless-parts-cuts-quote-setup-time-by-90-with-new-ai-supported-workflow.html
- https://www.colabsoftware.com/post/ai-tools-for-better-rfqs-a-practical-guide-for-supplier-engineering-teams
- https://www.paperlessparts.com/pricing
- https://www.g2.com/products/paperless-parts/pricing
- https://www.spotsaas.com/compare/partium-vs-paperless-parts
- https://www.paperlessparts.com/press/paperless-parts-announces-30m-series-b-funding
- https://www.cbinsights.com/company/paperless-parts/financials
- https://pulse2.com/uptool-6-million-seed-funding-closed-for-helping-u-s-shops-quote-10x-faster
- https://www.capterra.co.uk/software/1109532/Uptool
- https://www.imts.com/read/article-details/Quote-Us-AI-for-Faster-Better-Quotes/2253/type/Read/1
- https://fabricatingandmetalworking.com/ai-quoting-software-uptool/
- https://thenextweb.com/news/forgepoint-9-8m-seed-ai-quoting-manufacturers-frank
- https://www.unite.ai/forgepoint-9-8m-seed-ai-manufacturing-quotes/
- https://www.arr.club/signal/forgepoint-hit-seven-figure-arr-in-6-months-raised-9-8m-seed
- https://valueaddvc.com/pulse/forgepoint-9-8m-seed-ai-manufacturing-sales-2026
- https://www.cloudnc.com/quote-agent
- https://develop3d.com/manufacture/cloudnc-launches-quote-agent/
- https://thenextweb.com/news/cloudnc-20m-cam-assist-quote-agent
- https://werk24.io/
- https://it.werk24.io/pricing
- https://werk24.io/case-studies/laserhub
- https://ai-tools-web-app.pages.dev/tools/werk24
- https://morsa.ai/guides/manufacturing-quoting-software
- https://hypepotamus.com/news/toolpath-secures-strategic-investment-cam-ai/
- https://hypepotamus.com/startup-news/with-10-million-seed-round-ai-startup-with-atl-roots-is-ready-to-update-the-machining-industry/
- https://siliconangle.com/2026/09/16/caddi-raises-114m-at-1-2b-valuation-to-bring-manufacturing-ai-to-north-america/
- https://multiples.vc/private-comps/caddi
- https://www.gardnerweb.com/events/details/how-artificial-intelligence-can-improve-efficiency-and-accuracy-in-machine-shops
- https://supergood.ai/docs/e2-shop-system-api
- https://www.getapp.com/industries-software/job-shop/f/estimating/
- https://yespress.io/vendra-yc-s24
- https://www.extruct.ai/data-room/ycombinator-companies-manufacturing-industrials/
- https://www.amfg.ai/aerospace-and-defence
- https://www.cloudnc.com/blog/how-to-quote-cnc-machining-jobs
- https://www.electronics.org/news-release/missing-information-slows-wire-harness-quotes-whma-survey-finds
- https://www.adai.news/p/ai-rfq-response-agent-manufacturing-case-study
- https://www.broadn.io/blogs/fast-quoting-increases-manufacturing-win-rates
- https://domesticsuppliers.com/blog/how-many-machine-shops-in-the-us
- https://plainbizbench.com/industry/33271/
- https://vantainsights.com/industry/332710-machine-shops
- https://reshorenow.org/content/pdf/2026_Reshoring_Survey_Report.pdf
- https://www.mfgrobots.com/Article/equipment/cnc/53092.html
- https://img1.ibisworld.com/united-states/industry/metalworking-machinery-manufacturing/704
- https://www.fictiv.com/articles/us-machine-shops-supply-demand
- https://stackcyber.com/posts/cmmc-itar-cui
- https://govsignals.ai/blog/itar-data-in-proposals-using-cloud-tools-fedramp/
- https://www.startproto.com/blog/the-role-of-quoting-and-erp-software-in-cmmc-compliance
