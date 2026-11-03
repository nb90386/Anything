# Diligence: Legal, Procurement, Acceptance Criteria, DOJ Rule
Retrieved 2026-11-03. **[V]** = from a cited search result; **[U]** = unverified (background knowledge or a thin source). Primary documents were read only through search snippets, because WebFetch could not open non-GitHub pages.

## 0. Headline correction: the deadlines moved and may move again
- DOJ issued an **Interim Final Rule effective April 20, 2026**. It moved the compliance dates to **April 26, 2027** (population of 50k or more) and **April 26, 2028** (smaller entities and special districts). The technical standard stays WCAG 2.1 AA. Comments closed June 22, 2026. **DOJ said it may issue an NPRM on substantive changes to the 2024 rule** [V: Reed Smith, Duane Morris, UPCEA, Arizona]. The brief's dates are therefore correct, but there is regulatory risk: a later NPRM could narrow the scope or widen the exceptions. Whether an NPRM has been issued since then is [U].
- HHS's separate Section 504 web rule kept its **May 11, 2026** date, which matters for county health departments that receive HHS funding [V: Jackson Lewis].

## 1. A minor as business owner in California
**Contract voidability.** Under Family Code §6710, "except as otherwise provided by statute, a contract of a minor may be disaffirmed by the minor before majority or within a reasonable time afterwards" [V: Justia/public.law]. *Coughenour v. Del Taco* (2020) deals with what counts as a "reasonable time" after the minor turns 18 [V]. Family Code §6711 bars disaffirming an obligation made under express statutory authority [V]. Family Code §6701 makes some minor contracts void outright, including delegations of power and contracts about real property [U]. Commentary warns that a minor's LLC operating agreement and business contracts are voidable by the minor [V: eminutes; Justia Answers forum].

**What this means in practice.** Government buyers and insurers have good reason to want an adult signatory, because a 17-year-old can disaffirm the contract. The common workaround is a **manager-managed LLC with a parent as manager and authorized signatory**. The minor is a member, possibly holding his interest through a custodian (CUTMA) [V: terms.law, a commercial guide]. No source said outright that a minor may not be an LLC *manager*. Recommendation: the parent signs every contract, the certificate of insurance (COI) and the W-9 as manager. Get a 1-hour consult with a California attorney before filing [U].

**Insurance.** A minor's insurance contract is generally voidable, and insurers often want a parent's signature [V: general sources; no California-specific rule found]. The parent or the parent-managed LLC should be the policyholder.

**Setup steps and costs**
| Item | Cost / note | Status |
|---|---|---|
| Articles of Organization (Form LLC-1), bizfile | **$70** | [V: secondary sources] |
| Statement of Information, due within 90 days | **$20** | [V: secondary] |
| Annual LLC tax | **$800 in the first year.** The AB 85 first-year exemption covered only LLCs formed 2021 to 2023 and has expired. The first payment is due on the 15th day of the 4th month after formation. | [V: multiple secondary; one site claims a 2024+ exemption, apparently in error] |
| LLC fee based on gross receipts | Applies only at $250k or more of California income | [V] |
| EIN (free, irs.gov) | The responsible party must be an individual with an SSN or ITIN. Nominees are not allowed. | [V: IRS]. Whether the IRS online tool accepts a minor as responsible party is [U]. Listing the parent as manager is the simpler route. |
| Seller's permit | **Not needed for services only.** CDTFA says sales tax does not apply when a business "provide[s] only services" | [V: CDTFA home-based business guide] |
| City business license or business tax | Required by most Bay Area cities for home businesses. Typically about $50 to $200 per year plus a home-occupation permit. | [U: amounts not searched] |
| W-9 | Single-member LLC is disregarded; a parent co-member makes it a partnership that files Form 1065 | [U] |
| Insurance (see §2) | About $80 to $160 per month for GL plus E&O, more if cyber is added | [V ranges] |

**Cheaper alternative:** a sole proprietorship in the parent's name (DBA). It avoids the $800 tax but gives no liability shield [U].

## 2. Selling under small-purchase limits
**Thresholds and bidding.**
- City of Pittsburg, CA: up to $10,000 needs only comparable quotes; $10,001 to $50,000 needs at least 3 quotes [V].
- City of Los Alamitos: the City Manager can approve professional services up to $100,000, and amounts above that go to Council [V].
- Santa Monica publishes separate informal thresholds for professional and contractual services. Its professional services "usually require" E&O insurance, and contractual services require CGL plus workers' comp [V].
- Fresno Unified: professional services are excluded from small-purchase bidding under **Gov. Code 53060** [V]. Many California agencies can therefore sole-source small professional-services contracts.

**Insurance commonly required for IT and document services (California examples).**
- **Pasadena (IT):** CGL $1M per occurrence; Tech E&O; **cyber $2M per claim / $2M aggregate** [V].
- **Town of Windsor (IT):** CGL $2M per occurrence; E&O $2M per claim; cyber $2M/$2M [V].
- **San Joaquin County:** cyber starts at $1M per claim / $2M aggregate and can be higher [V].
- **City of Ventura standard form:** CGL $1M/$2M; E&O $1M; cyber listed as N/A for general contracts but flagged for IT [V].
- Endorsements: additional insured, primary/non-contributory, waiver of subrogation [V].
- **Do small purchases under $10k still need insurance?** No source said insurance is waived below a dollar amount. Irvine confirms insurance compliance *before* issuing a PO [V], and National City's PO terms require insurance "if applicable to the service" [V]. Waivers for low-risk work and for P-card buys happen [U]. Assume a COI showing GL plus E&O will be requested, and probably cyber too, since the work involves agency files.

**Payment terms and channels.** National City, Costa Mesa and Victorville list **net 30**, paid after delivery, acceptance and an original invoice [V]. National City says nothing is authorized without a PO number [V]. Livermore prefers its City MasterCard for purchases **under $10,000** and otherwise pays net 30 by invoice [V]. LACCD and others use CAL-Card for low-dollar buys [V]. **Accepting cards (about 3% fee) speeds up payment and cuts paperwork.**

**Insurance cost for a one-person tech service.**
- Hiscox example: professional liability for a California IT consultant, $500k limit, $5k deductible, **$42.92/mo**; "as little as $23/mo" [V: hiscox.com].
- GL averages about **$30/mo** and E&O about **$65/mo** for IT consultants (Insureon/TechInsurance figures via aggregators) [V, secondary].
- NEXT (now ERGO NEXT after Munich Re's 2025 acquisition): about half of customers pay $45 or less per month for PL [V, secondary].
- Bundled core coverage is about $80 to $120/mo. Raising limits to $2M and adding cyber probably brings the total to about $1,500 to $3,000 per year [U].

## 3. Acceptance criteria in real solicitations
| Buyer | Key terms | Status |
|---|---|---|
| **Washington DES Cooperative Contract 02024** (effective 05-01-2026, terms to 2032) | Docs must meet **WCAG 2.2 AA**; PDFs must meet **PDF/UA (ISO 14289-1 or -2)**. Per-page pricing by category, page-count tier, simple/complex, standard/rush. Listed rates are **ceilings and negotiable**. Sample ceilings, Category 1 generic, 1–2 pp: **~$3.34 simple / $4.60 complex; rush ~$4.01 / $5.52**. Category 3 legal: ~$4.51 / $6.21. About a dozen awardees, including BarrierBreak and iAccessDigital. | [V; price figures came from a poorly extracted PDF and need a check] |
| **League City TX RFP #26-008** (opened 12/2/2025, closed 1/14/2026) | **WCAG 2.1 A/AA**; files must **pass Adobe Acrobat Accessibility Checker "or equivalent."** Covers PDFs, PowerPoint and Excel. Multiple vendors, as-needed. Est. **$100k to $500k per year**. The snippet mentions documents "exceeding a minimum of 20 pages." | [V: aggregator listings] |
| **LACCD RFP 22-05** (2023) | Per-page rates for regular, moderately complex and complex documents; Word-to-PDF conversion; hourly rate for reformatting | [V] |
| **Utah State Board of Education** | Manual evaluation and remediation of tagged PDFs to **Section 508 + WCAG 2.1 AA**; dates conflict (Nov 12, 2026 vs. June 30, 2027) | [V: aggregator] |
| **City of Exeter, CA RFP 2026-05** | Website redesign, hosting and accessibility. PDF scope not confirmed. Exeter has about 10,321 residents, which puts it under the 2028 deadline. | [V] |
| Others found | Tahoe Conservancy PDF remediation RFP (2019); **Caltrans remediation vendor list dated 8-27-26** (competitors); **CA DGS Office of State Publishing offers ADA Document Remediation**, a state in-house competitor; whether local agencies can use it is [U] | [V] |
| Massachusetts, Sourcewell/SHI | Not found within the search budget | [U] |

**Tools and testing.** RFPs reviewed explicitly named only Acrobat's checker. Vendor and buyer guidance recommends validating in **both Acrobat Pro Full Check and PAC** [V: 508blueprint]. Vendors market human screen-reader testing as standard QA [V]. I did not confirm NVDA/JAWS clauses in RFP text [U]. **Plan to deliver PAC 2024 + Acrobat reports per file, plus a short NVDA spot-check log.**

**Turnaround (vendor claims).** 3–5 business days for initial delivery; 1–3 weeks for large jobs; rush tiers carry about a 20% premium, as the WA ceilings show [V].

**Price pressure.** Market rates run from **$0.30–$0.50/page for automated/AI tools** to $3, $7 and $12 per page for tiered managed services, and $4–$18 for human work [V: vendor pages]. **The proposed $3–5/page is at or just above the WA ceiling for simple documents**, so there is no room to price high.

## 4. DOJ rule details (28 CFR 35.200–35.205)
- **§35.200:** web content and mobile apps must meet WCAG 2.1 AA by the compliance date [V].
- **§35.202, conforming alternate versions:** a public entity "may use conforming alternate versions … **only where it is not possible to make web content directly accessible due to technical or legal limitations**" [V: regulation mirrors; Cornell LII Subpart H; accessible.org]. Offering HTML *instead of* fixing a PDF is therefore not a general compliance path. Converting a PDF to an accessible HTML page that *replaces* the PDF is direct accessibility and remains allowed [U: interpretation].
- **§35.201 exceptions** [V: Cornell LII, ALA, UVA, Wisconsin, TXST summaries]:
  1. Archived web content, which must meet all four parts of the §35.104 definition.
  2. **Preexisting conventional electronic documents** (PDF, word-processor, presentation, spreadsheet) posted before the compliance date, **unless currently used to apply for, gain access to, or participate in** the entity's services. Forms, applications and permit packets remain in scope.
  3. Content posted by third parties, unless posted under a contract or other arrangement with the entity.
  4. **Individualized, password-protected or otherwise secured documents** about a specific person, property or account.
  5. Preexisting social media posts.
  - Excepted content must still be provided accessibly on request under general Title II duties [U: from rule structure].
- §35.204 covers fundamental-alteration and undue-burden defenses; §35.205 covers nonconformance with minimal impact [U].
- **Selling implication:** most legacy PDFs are *excepted*. Demand centers on **new documents posted after the deadline** (agendas, packets, budgets) and **active forms and applications**, which points to a recurring retainer rather than one-time backlog cleanup.

## Sources (retrieved 2026-11-03)
- Reed Smith: https://www.reedsmith.com/articles/doj-extends-digital-accessibility-compliance-dates-under-title-ii-of-the-ada/
- Duane Morris: https://www.duanemorris.com/alerts/doj_extends_ada_title_ii_digital_accessibility_deadlines_one_year_0426.html
- UPCEA: https://upcea.edu/doj-extends-accessibility-deadline-to-april-2027-policy-matters-april-2026/
- Univ. of Arizona: https://accessibility.arizona.edu/news/doj-issues-interim-final-rule-title-ii-digital-accessibility-compliance-dates
- Jackson Lewis: https://www.jacksonlewis.com/insights/doj-extends-public-entities-compliance-deadline-ada-related-website-accessibility-hhss-may-2026-deadline-still-looms
- Cornell LII Subpart H: https://www.law.cornell.edu/cfr/text/28/part-35/subpart-H ; §35.201: https://www.law.cornell.edu/cfr/text/28/35.201
- accessible.org CAV: https://accessible.org/conforming-alternate-versions/
- ALA exceptions: https://www.ala.org/accessibility/ada-rule-exceptions ; UVA: https://digitalaccessibility.virginia.edu/doj-exceptions ; Wisconsin: https://www.wisconsin.edu/digital-accessibility/exceptions-to-title-ii/
- Fam. Code 6710: https://california.public.law/codes/ca_fam_code_section_6710 ; https://law.justia.com/codes/california/code-fam/division-11/part-3/chapter-2/section-6710/
- Coughenour v. Del Taco: https://law.justia.com/cases/california/court-of-appeal/2020/e072772.html
- eminutes: https://eminutes.com/can-a-minor-be-an-owner-officer-director-or-manager-of-a-business-entity
- terms.law: https://terms.law/LLC-Minors/minors-as-llc-members-guide.html
- LLC fees: https://www.llcuniversity.com/california-llc/annual-llc-tax-exemption-ab-85/ ; https://businessanywhere.io/california-llc-cost/
- IRS responsible parties: https://www.irs.gov/Businesses/Small-Businesses-&-Self-Employed/Responsible-Parties-and-Nominees
- CDTFA: https://cdtfa.ca.gov/industry/home-based-businesses/getting-started.htm ; https://cdtfa.ca.gov/taxes-and-fees/faqseller.htm
- Pittsburg: https://pittsburgca.gov/home/showpublisheddocument/10832/637479142624630000
- Los Alamitos: https://cityoflosalamitos.org/DocumentCenter/View/5354/502---Purchasing-Authority-Thresholds-PDF
- Santa Monica: https://santamonica.gov/competitive-bidding-thresholds
- Fresno Unified: https://purchasing.fresnounified.org/bid-limits/
- GCCCD: https://www.gcccd.edu/purchasing-contracts/gcccd-employee-information/Purchasing%20Matrix%202026.pdf
- Pasadena IT insurance: https://www.cityofpasadena.net/finance/wp-content/uploads/sites/27/Information-Technology.pdf
- Windsor IT: https://townofwindsor.ca.gov/DocumentCenter/View/28820/Information-Technology
- San Joaquin County: https://www.sjgov.org/department/pss/home/insurance
- Ventura: https://www.cityofventura.ca.gov/DocumentCenter/View/47185/Insurance-Requirements-for-Standard-Form-Contracts
- National City: https://nationalcityca.gov/government/finance/purchasing/vendor-guide
- Livermore: https://www.livermoreca.gov/departments/administrative-services/finance/purchasing/doing-business-with-the-city-of-livermore
- Victorville: https://www.victorvilleca.gov/government/city-departments/administrative-services/finance/purchasing/doing-business-with-the-city
- Irvine: https://cityofirvine.gov/node/76541
- Hiscox: https://www.hiscox.com/small-business-insurance/professional-liability-insurance/cost
- NEXT calculator: https://www.next-insurance.com/professional-liability-insurance/calculator/
- QuoteSweep IT consultants: https://www.quotesweep.com/blog/cost/it-consultants
- WA DES 02024: https://apps.des.wa.gov/DESContracts/Home/ContractSummary/02024 ; FAQ: https://apps.des.wa.gov/contracting/02024ContractSummaryPageFAQ.pdf ; https://apps.des.wa.gov/contracting/02024OptimalSolutions.pdf ; updates: https://apps.des.wa.gov/DESContracts/Home/ContractUpdates/02024
- BarrierBreak: https://www.barrierbreak.com/barrierbreak-selected-by-washington-state-to-deliver-accessible-document-remediation-services/
- League City 26-008: https://bidbanana.thebidlab.com/bid/6wsFvddwnJGDooeIecYD ; https://samsearch.co/gov-explore/sled/rfp-26-008-electronic-document-remediation-services/207199
- LACCD RFP 22-05: https://www.laccd.edu/sites/laccd.edu/files/2023-06/22_05__Digital%20Product%20and%20Services%20Accessibility%20Remediation%20Services.pdf
- Exeter RFP 26-05: https://cityofexeter.ca.gov/wp-content/uploads/2026/08/rfp-26-05.pdf
- Tahoe Conservancy: https://tahoe.ca.gov/request-for-proposal-pdf-remediation/
- Caltrans vendor list: https://dot.ca.gov/-/media/dot-media/programs/transportation-planning/documents/strategic-investment-planning/remediation-resources-center/remediation-vendor-list-8-27-26-a11y.pdf
- CA DGS OSP: https://www.dgs.ca.gov/OSP/Services/Page-Content/Office-of-State-Publishing-Services-List-Folder/Request-ADA-Document-Remediation
- WA DES RFP listing: https://starbridge.ai/rfp/document-accessibility-pdf-remediation
- Pricing: https://casocomply.com/pricing ; https://harboraccessibility.com/blog/pdf-remediation-cost-per-page/ ; https://508blueprint.com/pdf-remediation-pricing-2026/
