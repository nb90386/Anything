# Is it truly viable? Round-3 verdict

Date: November 3, 2026. Sources: `diligence-legal-procurement.md`, `diligence-competitors-pricing.md`, `diligence-demand-volume.md`, plus new experiments in `../experiments/c02-remediation-service`, `c03-pdfua`, `c04-forms`. No customer has been contacted; revenue figures are projections.

## Verdict

**Viable as a service business, with the money capped by your hours at first.** Demand and spending are real and large. The technology does about 41% of pages end to end and helps on the rest. A solo founder at capacity can plausibly net about $2,300–7,000 a month once one or two customers sign. It is not easy money: you need an adult-run LLC, insurance, a first government buyer, and many hours of hand-fixing tables.

## What the new research found

| Question | Finding | Effect |
|---|---|---|
| Is there enough work? | Contra Costa County issued an RFP for about 400,000 PDF pages across 10 websites (snippet-level, unverified). Exeter, CA (about 10k people) cited about 30,000 PDF pages. A mid-size city likely produces 10–30k new agenda pages a year (estimate). League City, TX plans $100k–500k a year across several vendors. | Demand is not the constraint. One mid-size city can fill a solo operator. |
| What is the price ceiling? | Washington State cooperative contract 02024: about $3.34/page simple, $4.60 complex, negotiable, usable by any US city or district. Vendor lists: Allyant $5, Deque $15, Harvard list $4/$8. Automated tools: $0.30–0.50/page. | Price at $3 simple and $5 complex, with 24–48 hour packet turnaround as the reason to choose you. |
| How long does hand work take? | Practitioners report 3–12 minutes per standard page; complex tables 15–30+ minutes; simple pages 15–25 per hour. | Tiered pricing is necessary; complex pages lose money at a flat rate. |
| What do buyers check? | Adobe Acrobat's checker or equivalent (League City); WCAG 2.2 AA plus PDF/UA (Washington). | Deliver veraPDF and Acrobat results with every file. |
| What must exist legally? | Contracts signed by a minor can be cancelled (Family Code 6710), so use a parent-managed LLC with the parent signing. Cities ask for $1–2M liability insurance, about $80–120/month for basic cover. No source showed insurance waived for small purchases. | About $3,000–4,500 a year in fixed costs before revenue. |
| How do buyers purchase? | Comparable quotes up to $10k in some cities (Pittsburg); professional services exempt from bidding under Gov. Code 53060; net 30 with a PO; Livermore prefers card payment under $10k. | First deals should be priced under $10k. |
| Is an HTML transcript enough? | 28 CFR 35.202 allows conforming alternate versions only where direct accessibility is not possible for technical or legal reasons. CivicPlus DocAccess produces HTML transcripts and leaves PDFs unchanged; whether that satisfies the rule is unsettled. | Fixing the actual PDF is a defensible difference; state it carefully, not as legal advice. |
| When is the deadline really? | April 26, 2027 for entities of 50k+; 2028 for smaller entities and special districts; school and college districts may fall in 2028 (EdSource; needs legal confirmation). The NFB lawsuit and possible DOJ rewrite could move or narrow it. | Sell to cities and counties of 50k+ first. |

## What the new experiments found

| Test | Result |
|---|---|
| Official PDF/UA-1 validator (veraPDF 1.28.2) on raw outputs | 0 of 32 real pages passed, including the free engine's tagged output; even Chromium's correct tags failed one metadata rule |
| After a deterministic finishing step (metadata, title display, language, artifact and heading fixes, font CIDSet cleanup) | 20 of 32 pages passed PDF/UA-1 |
| Pages passing both PDF/UA-1 and the semantic check with no human work | 13 of 32 = 41% |
| Remaining failures | Tables, lists, reading order, missing content; plus unembedded fonts and link annotations from the source files |
| Automatic table and list rebuilding (first attempt) | Cleared 0 of 11 pages and hit a code bug; tables and lists stay human work for now |
| Form fields on a real IRS 1040 (120 fields, $0.11) | 19 of 20 randomly sampled AI tooltips clearly correct on visual check; caveat: the model may already know this form |

## The money, recalculated

Assumptions: 41% of pages done automatically; 6 hours a day of hand-fixing; 20 working days a month; about $0.15/page API cost; about $300/month fixed costs. Minutes per remaining page come from practitioner ranges, not your own measurement.

| Scenario | Minutes per hand-fixed page | Blended price | Pages/month | Revenue/month | Net/month |
|---|---|---|---|---|---|
| Bear | 15 | $3.25 | ~800 | ~$2,600 | ~$2,200 |
| Base | 10 | $3.50 | ~1,200 | ~$4,300 | ~$3,800 |
| Bull (automation reaches 60%) | 8 | $3.75 | ~2,300 | ~$8,400 | ~$7,800 |

About 1,200 pages a month is one mid-size city's new agenda flow, or a slice of one county's backlog of active documents.

## What would make it not viable

1. **No buyer in 6 weeks** of contacting 15 Bay Area cities and counties of 50k+ and 5 web agencies. Then demand from small buyers is not reachable for you.
2. **Hand-fixing averages more than about 15 minutes per remaining page** on real customer documents. Then the business pays less than a normal job.
3. **Buyers reject files** that pass veraPDF, the Acrobat checker and the semantic check.
4. **DOJ weakens the rule** or the court changes dates in a way that removes urgency before you have customers.

## Next 14 days

1. **Day 1–2:** build the pipeline as a CLI on your Mac (`BUILD-PLAN.md` steps 1–3). Get Acrobat Pro.
2. **Day 3:** start the LLC with a parent and get insurance quotes. You can't sign anything yourself.
3. **Day 3–5:** pick 15 Bay Area cities and counties of 50k+ from `diligence-demand-volume.md`. Crawl their posted PDFs and count pages from the last 12 months.
4. **Day 5–9:** do one free sample of 20 real pages for the best target. Time every hand fix: this is your real minutes-per-page number.
5. **Day 10–14:** send the sample and a fixed-price quote under $10k to that target's ADA coordinator or clerk, with 48-hour packet turnaround. Also offer white-label work to five local web agencies.
