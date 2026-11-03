# Check: "ZoningProof" (Gemini, BUILD, 88/100)

**Idea:** upload a residential site plan PDF and an address. The tool parses the municipal zoning code and GIS parcel data and returns a pre-submittal compliance audit (setbacks, FAR, height, parking) for small contractors and architects. Launch city: San Jose or Oakland. Price: $150-500/month.

**Verdict: KILL**

## Why it dies

1. **The launch city is building this for free.** San Jose PBCE is piloting CivCheck (now owned by Clariti) to pre-check ADU applications before submission. The city plans to offer it to ADU applicants and may extend it to single-family homes. San Jose's stated problem is that more than 90% of ADU applications are sent back, mostly for missing information. Contractors will not pay $150-500/month for a check the city gives them at no cost. HUD's May 2026 guidance lets cities use HUD funds for up to three years of licenses for tools like CivCheck. [StateScoop], [GovTech], [CDT]
2. **California already has a statewide contract for a competing tool.** After the LA fires, the Governor's office put Archistar's AI e-check on a statewide contract that any local government can use. Archistar says more than 30 municipalities run AI PreCheck in production, including LA City and County, Austin and Harris County. [CalOES], [Archistar], [LA County]
3. **The exact product already exists, cheaply.** Conflation Labs: upload a site plan, get a cited checklist on setbacks, height and parking. PlanCheckerPro: pre-submittal PDF review in all 50 states, about $41-104/month. InspectMind: $50 minimum per check. Buildability: address report with setbacks, FAR and height for $29, or $299/month. Symbium Build: free ADU zoning feasibility for every California address. Gemini's $150-500/month sits above all of these.
4. **The pain is in completeness and building code, not zoning.** No dataset found separates zoning corrections from building-code corrections. One consultant's analysis of 712 California plan-check comments found 53% cited no specific code, meaning they were missing-information or clarity issues. For ADUs, state law sets most of the zoning (setbacks, height, minimum size), so the zoning check is the easiest and most commoditized part. (The state ADU preemption point is general background knowledge, not re-verified in this search.)
5. **Well-funded players are moving toward applicants.** GreenLite has raised about $86M total, including a $49.5M Series B in September 2025. Govstream.ai raised a $3.6M seed. CodeComply raised about $2M. Clariti/CivCheck, Archistar and Symbium sell to cities, and each one's applicant-facing pre-check is free to the applicant.

## Competitor table

| Product | What it does | Market / coverage | Pricing | Funding / traction |
|---|---|---|---|---|
| CivCheck (Clariti) | AI pre-screening of permit submittals across zoning, building, fire and other disciplines | San Jose ADU pilot; Seattle, Toronto, Honolulu, Denver | City-paid (free to applicants) | Acquired by Clariti; Seattle pilot measured ~91.7-92% accuracy |
| Archistar AI PreCheck / eCheck | Automated zoning and building plan check | 30+ municipalities (vendor claim); CA statewide contract; ICC partnership | City-paid; firm "Pro" tier listed at $895/mo | ICC collaboration; Austin full contract |
| Symbium (Build, Express Permits) | Free CA ADU zoning map for any address; instant solar permits for cities | All of California | Build free; city subscriptions | ~$4M (CB Insights) to $7M+ (GovTech/Crunchbase) |
| Conflation Labs | Upload site plan, get a cited zoning checklist (setbacks, height, parking) | Expanding toward 30k jurisdictions (claim) | Not found | Not found |
| PlanCheckerPro | Pre-submittal PDF plan review, 11 disciplines, local amendments | All 50 states (claim) | ~$41.30/mo (10 runs) and $104.30/mo (40 runs), billed annually | Not found |
| InspectMind | AI plan check | US | $1/sheet, $50 minimum, no subscription | Not found |
| Buildability.us | Address report: zoning, setbacks, FAR, height, ADU eligibility | US | $29/report; $299/mo (alt. listing: $99 report, $289/mo Pro) | Not found |
| Zoneomics | Zoning data and search, API | 22k+ jurisdictions | $92-279/mo search; API Builder ~$284/mo | Not found |
| UpCodes | Building code search plus Copilot AI | US building codes (zoning not confirmed) | $39-68/user/mo | YC |
| GreenLite | Privatized AI plan review and inspections | FL and others | Per project | $86M total; $49.5M Series B (Sep 2025) |
| PermitFlow | Permit expediting software and service | US | Not found | Not verified in this search |
| Govstream.ai | AI-native permitting for cities | Bellevue and others | City-paid | $3.6M seed (Dec 2025) |
| CodeComply.ai | Automated building code compliance | US | Not found | ~$2M seed |
| TestFit | Site feasibility and massing | US | $195/mo (Parking Solver) to $15-20k/yr | Not found |
| Regrid | Parcel data / API | Nationwide | Self-serve per record; 2023: $0.10/record | Not found |
| Permavia | Not found in any result | n/a | n/a | UNVERIFIED that it exists |

Gridics, Deepblocks and LandInsight/Land.id were not reached in searches. They serve zoning and land feasibility for developers, mostly commercial.

## Claims checked

| Gemini claim | Finding | Status |
|---|---|---|
| "30-50% initial rejection rate due to zoning errors" | First-cycle correction rates are far higher than 30-50%: San Jose ADUs >90% sent back; Portland >80% (secondary source). The main cause is missing information. No source attributes 30-50% to zoning. | FALSE as stated (zoning share UNVERIFIED) |
| "$2,000-5,000 per project expediter" | Vendor guides put residential expediting at $500-2,500 on average, with $500-7,500 or $15k+ for complex jobs. No Bay Area ADU-specific data found. | Mostly FALSE for typical residential; UNVERIFIED for Bay Area |
| "TAM $12B" | No source found. | UNVERIFIED |
| "Higher accuracy than municipal intake clerks" | The best independent test (Seattle, June 2026) scored CivCheck at ~92% against human reviewers' decisions, so humans were the benchmark. Seattle was "not ready to adopt it fully" and recommended a narrower completeness pilot. | FALSE / unsupported |
| "VERIFIED through practitioner accounts" | No practitioner accounts found. No Reddit or forum evidence of contractors paying for zoning pre-checks. | FALSE |
| Implicit: no one does this for Bay Area residential | San Jose plus CivCheck targets ADUs directly. Symbium Build covers all CA ADUs for free. | FALSE |

## Technical and legal

- **Code access.** Municode's terms limit content to "personal use only and not for commercial exploitation" and forbid copying or redistributing it. eCode360 (General Code, now ICC Code Solutions with American Legal) treats any use not expressly permitted as a breach. The law itself is generally not copyrightable (edicts-of-government doctrine; general background, not re-verified here). Building the product would still mean either violating the host platforms' terms or hand-encoding each city's code. Hand-encoding is feasible for one city but slow to scale, and it is the moat that Archistar, Symbium and Zoneomics have already built. I believe San Jose and Oakland codes are hosted on Municode (not verified here).
- **Reliability.** The hard part is reading site plan PDFs (dimensions, scans, inconsistent drafting), not the zoning rules. Overlays, nonconforming lots and discretionary standards break automated checks. Seattle found that coverage (how many checks the tool runs) affected applicants about as much as accuracy did. Buildability's own pages warn that overlays are sometimes missed.
- **Liability.** A false "pass" that leads to a redesign is the main risk. Every competitor disclaims ("decision support," "not legal advice"). A minor founder working through a parent-managed LLC, without E&O insurance, would carry this risk badly.
- **Licensure.** California generally exempts one- and two-story wood-frame single-family homes from the architect-stamp requirement (B&P 5537; general knowledge, not re-verified). A non-licensed tool can legally give advisory output. That same low barrier means there is no regulatory moat.

## Willingness to pay

Small firms do pay for zoning and plan-check tools, but at lower prices than Gemini assumed. Comparable prices are $29/report (Buildability), $41-104/month (PlanCheckerPro), $50/check (InspectMind), $39-68/month (UpCodes), $92-279/month (Zoneomics) and $195/month (TestFit Parking Solver). No evidence was found that small Bay Area contractors pay $150-500/month for residential zoning pre-checks. A small contractor files only a few residential permits a month in one city, which fits per-check pricing better than a subscription. Pricing is capped further by free city tools (CivCheck, Archistar under the state contract) and free Symbium Build.

## Bottom line

This is a crowded, city-subsidized category that San Jose is addressing directly. The pain Gemini cited is mostly incomplete submittals, not zoning. The price is above cheaper existing tools, and the code data has terms-of-use friction. No claim marked VERIFIED held up. **KILL.**

## Sources

- https://statescoop.com/san-jose-ai-permitting/
- https://www.govtech.com/artificial-intelligence/san-jose-will-leverage-ai-to-address-the-housing-crisis
- https://www.axios.com/local/san-francisco/2025/09/30/san-jose-ai-permitting-potholes-sf-lessons
- https://cdt.org/insights/faster-permits-fewer-eyes-the-case-for-and-against-ai-review/
- https://www.seattle.gov/documents/Departments/Performance/Publications/2026CivCheckEvaluationReport.pdf
- https://buildingconnections.seattle.gov/2026/06/17/can-ai-speed-construction-permitting-in-seattle-what-we-learned-from-testing-automated-application-screening/
- https://www.union-bulletin.com/news/national/cities-turn-to-ai-to-speed-housing-permitting/article_9d623e56-be42-53fe-83ef-b78c322a27ef.html
- https://www.claritisoftware.com/products/civcheck-ai-plan-review-software
- https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/building-application-pre-check/
- https://www.news.caloes.ca.gov/governor-newsom-announces-launch-of-new-ai-tool-to-supercharge-the-approval-of-building-permits-and-speed-recovery-from-los-angeles-fires/
- https://www.archistar.ai/aiprecheck/ai-plan-review/
- https://lacounty.gov/2025/07/15/la-county-launches-echeck-ai-pilot-as-part-of-express-lane-for-faster-rebuilding/
- https://www.iccsafe.org/about/periodicals-and-newsroom/international-code-council-collaborates-with-archistar-to-modernize-permitting-and-accelerate-housing-development/
- https://www.govtech.com/biz/Symbium-Tool-to-Plan-ADUs-Now-Available-Anywhere-in-California.html
- https://www.cbinsights.com/company/symbium/financials
- https://symbium.com/expresspermits/california/pilot
- https://conflationlabs.com/
- https://www.plancheckerpro.com/
- https://www.inspectmind.ai/checkers/plan-check
- https://buildability.us/
- https://datadrivenaec.com/tools/buildability
- https://www.zoneomics.com/pricing/zoning-due-diligence
- https://www.zoneomics.com/pricing/zoning-data-apis
- https://cms-v2.up.codes/pricing
- https://www.insightpartners.com/ideas/greenlite-raises-49-5m-series-b/
- https://geekwire.com/2025/seattle-area-startup-govstream-ai-raises-3-6m-to-improve-city-permitting-processes-using-ai
- https://www.trysignalbase.com/news/funding/codecomply.ai-secures-2-million-in-seed-funding-to-revolutionize-permitting-processes-with-ai
- https://www.g2.com/products/testfit/pricing
- https://regrid.com/blog/2023-parcel-data-price-change
- https://www.permittable.ai/insights/building-permits-stuck-in-past
- https://enchantmentdesign.com/resources/why-plans-get-rejected/
- https://permitplace.com/permit-expediter-cost-guide/
- https://permitplace.com/permit-expediter-cost-california/
- https://www.municode.com/code/page/terms-use
- https://ecode360.com/docs/TOS.html
- https://www.icccodesolutions.org/blog/general-code-and-american-legal-publishing-unite-as-icc-code-solutions/
- https://www.mysiteplan.com/blogs/news/ai-site-plan-generators
