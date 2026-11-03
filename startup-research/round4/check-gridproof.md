# Check: GridProof (California Rule 21 interconnection preflight for small/midsize solar+storage installers)

Proposed by ChatGPT. Researched 2026-11-03. Brief: try to kill it.

## Bottom line

**Verdict: KILL.** The pain is real, but most of it sits on the utility side and is out of installer control. The preventable-error portion has no published size. The sellable market is three California utilities and a residential segment that shrank sharply and is still contracting. Done-for-you competitors already charge about the same per application as ChatGPT's proposed preflight-only price, and the utility portal vendor (PowerClerk) is building AI pre-submission checks into the portal itself.

## 1. Existing products

| Product | What it does | Price / traction | Threat to GridProof |
|---|---|---|---|
| **PowerClerk** (Clean Power Research) | Utility-side interconnection portal. Rule-based field validation blocks incomplete submissions. Has an API so installers can submit directly from CRM/quoting tools. "PowerClerk Intelligence" advertises AI attachment review that catches inconsistencies and missing info before submission. SCE's forms page links a "PowerClerk Paired Storage Job Aid", so SCE appears to use it (current status not confirmed). | Sold to utilities. Said to have processed 25,000+ applications for 5 utilities including SCE back in 2015. | **High.** The utility's own portal is adding the preflight check, for free to installers. |
| **PG&E "YourProjects" / Interconnection Portal** | PG&E's own portal, with a published Standard NEM checklist. Incomplete applications get a written deficiency list. | Free; utility fee applies | Medium. It sets the checklist, which makes the gap a static checklist can fill smaller. |
| **SDG&E DIIS** | SDG&E's online portal for NEM <30 kW and storage, with external contractor login. | Free | Medium |
| **GreenLancer** | Marketplace that prepares and submits interconnection applications in all 50 states, with a 1-2 business day turnaround and "affordable flat fees". Publishes PG&E/SCE/SDG&E Rule 21 rejection guides. | Structured data on the PV interconnection page shows **$99**; a reseller lists a residential interconnection service at $500 (marked down from $929). Neither is a confirmed fee schedule. | **High.** Done-for-you service at roughly the proposed per-app price |
| **Solar Permit Solutions** | Plan sets plus add-ons for AHJ submission and utility interconnection | Interconnection add-on **$1,000** (from its own blog) | Medium (higher-end service) |
| **SolarNexus** | Installer CRM with PDF form auto-fill from project data, plus DocuSign | SaaS subscription (price not checked) | Medium. Already does the "structured project record to form" step |
| **Enerflo** | Installer operating system that tracks projects through utility interconnection and PTO; REST/GraphQL APIs and webhooks | SaaS | Medium. Owns the project record that GridProof would need |
| **Aurora, OpenSolar, Solargraf (Enphase), Scanifly, Sunbase, Arka** | Design/proposal/CRM. I found no documented native Rule 21 validation. Solargraf advertises "automated permitting". | various | Low today; they can add it as a feature |
| **AI agent shops: Sentie, Scooper AI, FieldProxy, TechQuarter** | Custom agents that fill and submit utility applications and watch for stalled reviews. Scooper has per-utility templates and Aurora/OpenSolar integrations. TechQuarter claims it automated 400+ utility applications for a large installer. | Custom/services; claims are self-reported | Medium. The space is crowded with generic agents |
| **"Arcus AI"** (named in one article as generating and validating interconnection responses) | Could not verify it as a funded company; funding searches only returned Arrcus, an unrelated networking firm. | UNVERIFIED | — |
| **SolarAPP+ / Symbium** | Automated permitting for the AHJ/building permit, not utility interconnection. Symbium works with 22 CA cities. | — | Adjacent; shows that automation goes to the government/utility side |

Large installers (Sunrun, Tesla, and formerly Freedom Forever) run in-house interconnection teams and integrations. They are not buyers.

## 2. Evidence on the problem

- **Utility-side delay is the dominant, well-documented problem.** CPUC quarterly data cited by CALSSA and 18 legislators (Nov 25, 2025) shows PG&E and SCE meet three Rule 21 review steps only 27-45% of the time, and three others 53-81% of the time. The standard is 95% on-time (D.20-09-035). CALSSA filed complaint C.25-08-021 (Aug 2025) seeking a $10M fine. The utilities blame a surge of NEM 2.0 applications. CPUC opened R.25-08-004 to revise timelines; the Q2 2026 stakeholder meeting was skipped and the next was set for Sept 22, 2026. None of this is fixed by better installer paperwork.
- **Preventable defects do occur, but no rate is published.** PG&E deems applications incomplete and issues deficiency lists. GreenLancer guides say incomplete applications drive most deficiency notices and that the single-line diagram drives more of them than any other item. A 2021 CPUC Rule 21 evaluation found that deficiencies added time beyond the 10-business-day tariff window at PG&E and SCE. I found **no published deficiency or rejection percentage** for residential or small-commercial applications.
- **PTO timing (secondary sources):** PG&E issues PTO 5-10 business days after final clearance, and 30+ in peak season. One SoCal installer reports 4-6 weeks for solar-only and 8-12 weeks (up to 16) with batteries. Contract to PTO runs about 3-6 months. Batteries add complexity (operating mode, paired storage), which is the one real tailwind for a checker.
- **Fees are small:** the NEM-class application fee is about $145 (cited for PG&E). That caps how much a "pass the first time" promise is worth in direct cost. The real cost of a rejection is installer cash tied up while waiting for PTO.

## 3. Market health 2026

- **National:** Wood Mackenzie/SEIA expect residential installs to fall about 19-21% in 2026 after 25D expired at the end of 2025. Q2/Q3 2026 came in at 995 MWdc, down 12% YoY and the lowest quarter in about five years.
- **California:** Wood Mackenzie expects contraction in 2026 driven by the tariff transition, though CA still leads the residential market thanks to TPO. A blog analysis of CPUC interconnection records (secondary) reports home solar connections went from 271k (2023) to 145k (2024), with Jan-Aug 2026 running 4% below 2025. CALSSA reportedly saw sales fall 60-80% after NEM 3.0 and roughly 17k jobs lost (secondary). The NEM 2.0 PTO deadline was April 15, 2026, so every new system is on the Net Billing Tariff.
- **Storage:** Battery share of new PG&E+SCE home systems was reported at 7% (2022), 61% (2025) and 66% (2026 YTD). Storage makes applications more complex but does not add volume.
- **Bankruptcies:** Freedom Forever (#1 installer by kW in 2025) filed Chapter 11 on 4/15/2026 with over $500M in debt. Sunnova, SunPower, Titan, ADT Solar, Lumio (Ch. 7) and PosiGen failed earlier; CalCom Solar filed in Sept 2026. The small-installer customer base is shrinking and cash-strapped, and buys mostly through TPO/financier channels that impose their own workflows.
- **TAM sanity check:** about 150k CA residential systems a year × $30 comes to about **$4.5M a year if GridProof captured 100%**, including the large installers who will never buy. Realistic capture among small/midsize installers is a small fraction of that. Expanding to other states means new tariffs and portals, which undercuts the "CA wedge" logic.

## 4. Claims checked

| ChatGPT claim | Status | Evidence |
|---|---|---|
| Preventable application defects are common | **UNVERIFIED (partly true)** | Deficiency notices exist and vendor guides say incomplete apps drive most of them, but no published rate. The documented delay is mostly utility-side (27-45% on-time on some steps). |
| Installers would pay $25-40 per application for preflight | **UNVERIFIED / doubtful** | No evidence of anyone buying preflight-only. GreenLancer's done-for-you service appears to be around $99, and SolarNexus/PowerClerk include validation at no per-app charge. Installers in a contracting market are cutting soft costs. |
| Requirements are fragmented across utilities | **PARTLY TRUE** | Three separate portals (YourProjects, SCE/PowerClerk, DIIS) with different forms. But the IOUs' Rule 21 tariffs are "largely equal in content" (SCE), and each publishes checklists. In California it is 3 utilities, not hundreds. |
| California is a large, healthy market for this wedge | **FALSE** | Residential connections roughly halved after NEM 3.0; 2026 is flat to down; major installer bankruptcies. |
| No one does this yet | **FALSE** | PowerClerk Intelligence (utility-side AI pre-checks), GreenLancer, SolarNexus auto-fill, Enerflo tracking, and several AI agent shops. |
| Later: authenticated submission workflow across utilities | **RISKY** | Requires the customer authorization (A&A form) and portal credentials, and utility terms of service may restrict automated or bot submission (not verified). PowerClerk already offers an official API, so the "later" moat belongs to the incumbent. |

## Founder-fit notes

The founder is a minor, so contracts must go through a parent-managed LLC. Installers would have to trust a 17-year-old with customer PII, utility credentials and A&A forms. Selling to small installers means phone and field sales in a distressed trade. Revenue within 60-90 days is possible only as a tiny services gig (doing applications by hand for a few installers, competing with GreenLancer's ~$99), not as a scalable company.

## Verdict: KILL

1. The core delay is utility non-compliance, which is out of installer and product control. Advocacy groups and regulators are already working on it (C.25-08-021, R.25-08-004).
2. The preflight-only value is small and unquantified, and it is being absorbed by the utility portal itself (PowerClerk Intelligence) and by installer CRMs (SolarNexus auto-fill).
3. The market is tiny and shrinking: one state, three utilities, roughly halved volumes, installer bankruptcies, and big players in-house. TAM tops out in the low single-digit millions.
4. Done-for-you services already sit at or near the proposed price.

What survives: battery/NBT paired-storage applications are getting more complex, and a solar back-office services shop could earn some cash. That is a services job, not the "single best idea".

## Sources

- https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/infrastructure/rule-21-interconnection
- https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/rule21/rule-21-interconnection-program-eval_2021.pdf
- https://www.sce.com/es/business/smart-energy-solar/solar-for-business/grid-interconnections/interconnecting-generation-under-rule-21
- https://www.sce.com/node/213829
- https://www.solardaily.com/reports/PowerClerk_Speeding_Time_to_Solar_Interconnection_across_Five_U_S__Utilities_999.html
- https://www.cleanpower.com/powerclerk/powerclerk-intelligence/
- https://cleanpower.com/2016/3-tools-error-free-energy-program-application-submissions
- https://cleanpower.com/2014/five-things-need-know-powerclerk-interconnect
- https://www.pge.com/assets/pge/docs/about/doing-business-with-pge/electric-generator-interconnect.pdf
- https://PGE.com/assets/pge/docs/about/doing-business-with-pge/interconnection-checklist.pdf
- https://sdge.com/node/26616
- https://www.greenlancer.com/interconnection
- https://www.greenlancer.com/pv-interconnection
- https://www.portable-sun.com/products/greenlancer-residential-utility-interconnection-service
- https://www.greenlancer.com/post/pg-e-rule-21-interconnection
- https://www.greenlancer.com/post/sdge-rule-21-interconnection
- https://www.greenlancer.com/post/sce-pto-delays
- https://www.solarpermitsolutions.com/blog/outsource-solar-permit-design-vs-in-house-engineering
- https://help.gosolo.io/solarnexus/auto-fill-pdf-forms
- https://enerflo.com/
- https://sentie.io/industries/solar-installers
- https://www.scooperai.com/ai-automation-for-solar-installers
- https://techquarter.io/case-study-solar-installer-runs-smarter-with-ai/
- https://climatetech.industryexaminer.com/ai-permitting-software-speeds-renewable-energy-projects/
- https://www.canarymedia.com/articles/solar/ai-powered-permitting-is-speeding-up-solar-deployments-in-california
- https://calssa.org/press-releases/2025/11/25/legislators-urge-cpuc-to-hold-utilities-accountable-for-delays
- https://www.utilitydive.com/news/california-cpuc-pge-sce-solar-storage-interconnection-delays/806809/
- https://www.solarpowerworldonline.com/2025/08/calssa-seeks-10-million-fine-against-ca-utilities-for-thwarting-solar-interconnection/
- https://www.stoel.com/insights/reports/energy-regulatory-updates/august-5-2026
- https://uspowersolar.com/blog/california-utilities-delay-solar-hookups-faster-with-us-power
- https://sunlightelectricalsolutions.com/permission-to-operate-pto-with-pge-a-homeowners-guide-for-solar-projects/
- https://seia.org/research-resources/solar-market-insight-report-q3-2026/
- https://seia.org/research-resources/solar-market-insight-report-2025-year-in-review/
- https://seia.org/wp-content/uploads/2026/09/USSMI-Q2-2026-ES.pdf
- https://cali-energy.com/blog/nem-3-solar-market-data-california
- https://www.surgepv.com/blog/us-residential-solar-market-trends-2026
- https://law360.com/articles/2465664
- https://nrgcleanpower.com/learning-center/freedom-forever-files-for-bankruptcy/
- https://www.solarinsure.com/the-complete-list-of-solar-bankruptcies-and-business-closures
- https://thebusinessjournal.com/central-valley-bankruptcies-calcom-solar/
