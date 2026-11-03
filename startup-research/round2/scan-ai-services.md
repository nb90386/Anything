# Scan: AI-native outcome services for a 17-year-old solo founder

Retrieved 2026-11-03. 22 web searches. Most prices come from vendor or marketing pages and are labeled that way. "Unverified" means I did not find a primary source for it. Scores use the weights in `CRITERIA.md`.

## Comparison table

| # | Outcome service | (a) Who pays today, and how much | (b) Buyer volume | (c) Fastest path to 1st customer | (d) Limits for a minor | (e) AI can do / human still needed | (f) AI competitors | (g) Impact | Score /100 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Solar, battery and EV-charger permit packages plus utility interconnection/PTO filing for small installers | Plan sets cost $130–210 (older third-party figure) and $150–400 for PE-stamped residential (vendor estimate). ShopSolar sells a plan set plus interconnection package for $749 and a higher tier for $1,990. PG&E's own application fee is $145. | Thousands of CA installers (no count verified). Battery attachment on new PG&E/SCE systems is about 66% in 2026 per CPUC-based data. The top 5 installers' share rose from 40% to 51%, so small installers are under pressure. | Upwork postings ("Solar System Design for Permit Application"), plus cold outreach to small C-10/C-46 contractors and EV-charger electricians | No license is needed to prepare paperwork. A PE stamp is needed where the city requires one, so partner with a stamping engineer. Minor contracting and payment issues apply (see Blockers). | AI: utility portal forms (Playwright), document checks, single-line diagram drafting from templates, correction tracking. Human: site data, stamping, the occasional utility call. | GreenLancer, Wattmonk ("Permitting Agent"), Solargraf, Scooper. Offshore Fiverr drafters are cheap. SolarAPP+ gives instant permits in compliant cities. | Real. Installers report that permitting delays drive customer cancellations (11–33%, vendor-cited). | **74** |
| 2 | ADU plan-check correction responses and expediting in CA | Expediters charge $1,500 (simple LA ADU), $2,500–5,000, or $4,000–9,000 (LA, depending on complexity). All from vendor sites. | Large in LA and the Bay Area, but each buyer is a one-off homeowner or builder | Partner with ADU designers and builders. Selling directly to homeowners is slow. | Drawing revisions often need the designer of record. I believe CA's B&P 5537 exempts wood-frame ADU drafters, but that is unverified. Liability is real. | AI: parsing correction letters, code lookup, drafting response letters. Human: revising drawings and talking to plan checkers. | PermitFlow (raised $54M Series B), Archistar (LA pre-check), CivCheck (San José pilot), Symbium | High (housing) | 58 |
| 3 | Trucking owner-operator back office (detention and accessorial billing, broker vetting, invoicing for factoring) | Dispatch runs 5–10% of gross, $250–500 per truck per week, or $50–150 per load (dispatcher blogs) | Very large (hundreds of thousands of small carriers; I did not verify a count) | Facebook trucker groups and load-board communities. Offer detention recovery as a percentage of what you recover. | No license is needed for paperwork. Dispatching that edges into brokering is a regulatory gray area. | AI: matching rate confirmation, BOL and POD to settlements, finding unbilled detention, factoring packets. Human: broker phone calls. | Numeo (AI dispatch), Datatruck, Denim/Truckstop (bundled with factoring), Monk | Medium-high (driver income) | 60 |
| 4 | GovCon help (SAM.gov, bid finding, proposals) | SAM.gov registration is free. Consultants charge $300, $399 for a renewal, $2,999 for 3 months, or $300–3,000. | Large | Fiverr | No license needed, but the reputation risk is serious: NBC News and APTAC warn about paid "registration" services. | AI: bid matching, compliance matrices, drafts. Human: pricing and past-performance claims. | GovDash (raised $30M, Jan 2026), Civic IQ, many others | Low-medium | 45 |
| 5 | Grant writing and reporting for small nonprofits | $50–125/hr. Small foundation proposals run $500–2,000, mid-size $1,500–4,000, federal $5,000–15,000. Retainers are $2,000–6,000/mo (Grantable and BizToolKit figures). | Very large | Local Bay Area nonprofits, Upwork | No license needed. Commission-based fees are widely considered unethical (I believe the AFP code says so; unverified). | AI: research, first drafts, reports. Human: relationships, budgets, the program narrative. | Grantable (free tier, $50–150/mo), Instrumentl (price not found), many freelancers | High | 62 |
| 6a | Homeowner insurance claim documentation | Public adjusters take a percentage (not verified) | Large | n/a | **Blocked.** A CA public adjuster license requires age 18 (Ins. Code §15011). | n/a | n/a | High | Reject |
| 6b | Consumer medical-bill disputes | 10–35% of savings is typical. CareRoute charges 25% capped at $1,000. FairBilling charges a $20 retainer plus 5–20%. | Very large | Consumer ads (expensive) | The work handles PHI. This conflicts with the "regulated data" hard reject. | AI: line-item audit, dispute letters | mediloop ($129 flat), CareRoute, Goodbill, Resolve | High | 48 |
| 7 | HTS classification for small sellers after de minimis ended | Already commoditized: $0.02/SKU (Apify), $47 for 100 SKUs or $97 for 1,000 (RevAddress), $99 for one SKU (FSVP Services), up to $125/item (Tarifflo) | Large | Shopify groups | Transaction-specific classification counts as "customs business" under 19 U.S.C. 1641, and CBP rulings support that reading. Only general advice is allowed without a license. | AI does nearly all of it, and so does everyone else | GingerControl, TariffLens, Zonos, Avalara | Medium | 35 |
| 8 | CA Statement of Information and similar filings | The state fee is $20–25. Third-party mailers charging $125–250 are flagged as misleading by the CA Secretary of State. | Large | n/a | Legal, but the reputation risk is serious | Trivial to automate | Many | Negative | 20 |
| + | **Provider credentialing and payer enrollment for small therapy and medical practices** (added) | $100–300 per provider per payer. $1,500–3,500 per provider for an initial package. Maintenance is $75–150/mo or $150–400/mo per provider. All vendor guides. | Very large. Every new provider who bills insurance needs it (no count verified). | New CA LMFT/LCSW/psychologist private practices via practice-building groups, small group practices, and billing companies that subcontract | No license needed. The work involves provider data (SSN, license numbers), not patient PHI, so I believe no BAA is needed (unverified). | AI and Playwright: CAQH profiles, payer portal applications, status checks, re-attestation reminders. Human: payer phone follow-ups. | Medallion, Assured ($19M Series A), and CertifyOS all target enterprises with custom pricing. Small practices are served by human billing shops. | High (patient access to in-network care) | **70** |
| + | **Catch-up bookkeeping before tax season** (added) | $150–500 per month of backlog, cleanup from $750, or $500–5,000+ total. Ongoing books run $300–900/mo. | Very large | Local small businesses, CPA and tax-preparer referrals in Jan–Mar | No license is needed for bookkeeping. Tax preparation is out of scope (CA CTEC rules). | AI: transaction categorization, bank reconciliation drafts. Human: judgment calls and the CPA handoff. | Pilot, Digits, many AI bookkeeping firms. Bench collapsed in late 2024 (from memory; unverified). | Medium | 63 |

Not researched for lack of search budget: Section 8 inspection prep and rent registries, language-access translation, and Medicaid EVV billing. EVV involves PHI, so it fails the hard reject anyway.

## Top 3 ranked: fastest credible path to $3–5k/month

### 1. Permit and PTO desk for small California solar, battery and EV-charger installers

**Why first:** Installers already pay per project ($150–400 for plan sets, $749 for a plan set plus interconnection package). The pace of work is set by utility portals and correction loops, and that is browser automation, where this founder is strongest. The market is local to the Bay Area (PG&E). Battery attachment around 66% means more complex interconnection filings. Installer failures (Sunnova in June 2025, Freedom Forever filing on 2026-04-15) push customers toward small installers who have no back office.

**Offer:** "Interconnection and PTO handled for $149 per project. Permit plan set plus interconnection for $299, with a 48-hour turnaround." Stamps are passed through from a partner PE. The ShopSolar $749 bundle is the price anchor.

**Math:** 15–25 projects a month at about $200 average comes to $3–5k/mo. That is 2–4 small installers.

**First customers:**
- Bay Area installers with 1–10 crews, found through CSLB license lookups and CPUC DG Stats installer names
- Electricians doing EV chargers and battery retrofits for NEM 2 customers
- Upwork posters of solar permit and interconnection jobs
- Installers taking on service of orphaned systems from failed national installers

Do 3 projects free and show the turnaround time.

**What would block it:**
- Offshore drafters on Fiverr undercut the plan-set price. Compete on interconnection follow-through and correction cycles instead.
- SolarAPP+ removes city permit friction in compliant jurisdictions. That shifts the value toward the utility side.
- PE stamp availability.
- Portal credentials belong to the installer, so a trust and access agreement is needed.
- Liability for filing errors.
- Low installer margins and failures mean a risk of not getting paid. Charge upfront.

### 2. Credentialing and payer enrollment for small therapy practices

**Why:** This has the highest price per unit of work found: $100–300 per payer, and one provider with 5 payers is $500–1,500. It also has real recurring revenue ($75–150 per provider per month maintenance). Funded AI competitors (Medallion, CertifyOS) say they target enterprises, which leaves solo and small practices to human billing shops.

**Math:** 4–6 new providers a month at about $750 each, plus maintenance, comes to $3–5k/mo.

**First customers:**
- Newly licensed CA therapists going into private practice
- Group practices of 3–15 clinicians that are adding staff
- Billing companies that would white-label the work as a subcontractor (the fastest channel)

**What would block it:**
- Payers take 60–120 days to approve (unverified), so testimonials arrive slowly.
- Phone follow-ups are unavoidable.
- Handling SSNs and DEA numbers demands security and makes clients hesitant to trust a teenager.
- Payer portal terms of service may forbid automation.
- Medi-Cal enrollment is a separate, slower process.
- Confirm with a lawyer that no BAA is needed before launch.

### 3. Catch-up bookkeeping before tax season

**Why:** The timing works. From November 2026 to April 2027, owners who are behind on their books must clean them up before filing, and the work is priced per month of backlog ($150–500). Two cleanups of 6–12 months each reach $3–5k. AI categorization gives strong gross margin.

**First customers:**
- Overflow work from local tax preparers and CPAs
- Bay Area sole proprietors and LLCs found through local business groups
- "Behind on books" Upwork jobs

**What would block it:**
- Owners are reluctant to give bank and QuickBooks access to a minor.
- Commoditized competition.
- Revenue is seasonal, falling off after April.
- Errors that feed into tax returns.
- This idea has the weakest "big company" story of the three.

*Honorable mention:* grant writing. One $2–6k/mo retainer gets there, but sales cycles are slow and freelancers plentiful.

## Cross-cutting blockers for a 17-year-old (verify these)

- Contracts signed by a minor may be voidable in CA, so clients may want a parent co-signer or a parent-owned entity (unverified).
- Payment processors may require an adult account holder (unverified).
- Use a written scope and an errors clause, and get liability coverage once revenue allows.

## Sources (all retrieved 2026-11-03)

- https://solaracademy.com/how-to-deliver-thousands-of-engineering-permits-sets-with-ease/
- https://www.surgepv.com/best-solar-software/permit-design
- https://greenlancer.com/permitting
- https://shopsolarkits.com/collections/services
- https://energyscaperenewables.com/post/solar-permitting-outsourcing-vs-in-house-cost/
- https://www.greenlancer.com/post/pg-e-rule-21-interconnection
- https://help.pge.com/s/article/How-does-the-interconnection-process-work-when-Im-installing-solar?language=en_US
- https://www.wattmonk.com/blog/ai-permitting-tool-solves-approval-delays
- https://orchstack.ai/playbooks/ai-native-solar-installer
- https://www.pv-magazine.com/2026/08/17/from-lead-gen-to-pto-how-one-ai-platform-is-streamlining-solar-sales-and-operations/
- https://www.energy.ca.gov/programs-and-topics/programs/residential-solar-permit-reporting-program-sb-379/residential-solar
- https://nrgcleanpower.com/learning-center/solar-permit-california/
- https://cali-energy.com/blog/nem-3-solar-market-data-california
- https://www.utilitydive.com/news/residential-solar-storage-california-after-nem-30-lbnl/716589/
- https://www.upwork.com/freelance-jobs/apply/Solar-System-Design-for-Permit-Application_~022050907107407477445/
- https://www.upwork.com/freelance-jobs/solar-design/
- https://www.oceanpermits.com/blog/permit-expediter-cost-los-angeles
- https://jdj-consulting.com/how-much-does-a-permit-expediter-cost-in-california/
- https://www.laconstructioncompliance.com/adu/adu-permit/
- https://www.constructiondive.com/news/austin-honolulu-los-angeles-permit-ai/751085/
- https://propmodo.com/can-ai-really-help-speed-up-the-construction-permitting-process/
- https://www.claritisoftware.com/products/civcheck-ai-plan-review-software
- https://fleetcollect.net/blog/truck-dispatcher-cost-percentage-vs-flat-fee
- https://factoringexpress.com/truck-dispatching-rates/
- https://numeo.ai/blog/top-30-outsourced-dispatch-companies-for-trucking-owner-operators
- https://monk.com/blog/best-ar-automation-for-trucking
- https://www.freightwaves.com/news/ai-moving-from-back-office-to-drivers-seat-in-trucking-operations
- https://siliconangle.com/2026/01/15/govdash-secures-30m-expand-ai-driven-government-contracting-software/
- https://www.cleat.ai/blog/sam-registration-services-cost-vs-free-2026
- https://www.fed.net/services/sam-registration
- https://www.nbcnews.com/business/corporations/google-ads-entice-small-companies-to-pay-for-help-feds-provide-free-rcna65122
- https://www.aptac-us.org/sam-registration-is-still-free/
- https://grantable.co/how-much-does-a-grant-writer-cost
- https://www.biztoolkit.co/post/freelance-grant-writer-rates-in-2026-per-project-fees
- https://www.grantwatch.com/grantnews/how-much-do-grant-writers-charge/
- https://law.justia.com/codes/california/code-ins/division-5/chapter-2/article-3/section-15011/
- https://www.careroute.ai/bill-defense/medical-bill-negotiation-cost
- https://www.fairbilling.org/pricing-policy
- https://mediloop.ai/blog/best-medical-bill-negotiation-services
- https://revaddress.com/customs/catalog/
- https://apify.com/callmefaka/hs-code-classifier
- https://www.fsvpservices.com/hts-code-classification-service/
- https://gingercontrol.com/blog/duty-tax-api-pricing-comparison
- https://www.tarifflens.ai/rulings/113715
- https://gingercontrol.com/blog/customs-business-definition-importers-guide
- https://www.sos.ca.gov/business-programs/bizfile/misleading-solicitations-and-fraudulent-filings
- https://www.sos.ca.gov/business-programs/customer-alerts/misleading-statement-information-solicitations
- https://comparepracticetools.com/credentialing/pricing-cost-guide
- https://medwave.io/2026/03/how-much-does-medical-credentialing-cost/
- https://docscare.org/blog/how-much-does-provider-credentialing-cost/
- https://www.fiercehealthcare.com/finance/startup-assured-banks-19m-series-ai-native-credientialing-provider-enrollment
- https://certifyos.com/compare/certifyos-vs-medallion
- https://www.kaizenautomation.com/blog/medallion-credentialing-reviews
- https://taxstra.com/tools/bookkeeping-cleanup-estimator/
- https://www.monacocpa.cpa/post/bookkeeping-cleanup-cost-small-business-2026
- https://www.remotebooksonline.com/blog/how-much-do-bookkeeping-services-cost-2025-pricing-guide
