# C07 — Medicaid coverage-retention engine for safety-net providers: competitive analysis

Retrieval date: 2026-11-02. Method: 16 web searches; no vendor sites fetched directly (WebFetch limited to GitHub). Items marked [unverified] come from a single secondary or vendor source.

## 1. Bottom line

Verdict: **No, as scoped.** The pain is real and the calendar is real (six-month renewals for expansion adults from Dec 31, 2026; 80-hour work/community-engagement rule enforced Jan 1, 2027; Nebraska already live since May 1, 2026). But the startup's three layers are each already occupied: (a) the enrollee-facing attestation/verification layer is being built by CMS and the states themselves (open-source "Emmy", state portals, Nava's OSCER, Gainwell/Salesforce modules); (b) the nudge layer is owned by incumbents with deep Medicaid MCO and FQHC distribution (mPulse, Cotiviti Eliza, CareMessage, Luma, Artera); (c) the navigation layer has a venture-funded leader (Fortuna Health, $22M raised) already selling to MCOs and health systems. On top of that, the only randomized evidence from the unwinding period (GSA OES, Norfolk VA, 7,468 cases) found that extra texts and calls did not significantly change renewals. A provider-side "at-risk dashboard" that merely re-sends what the state already sent is a feature, not a company.

## 2. Direct competitors (by layer)

### 2a. Unwinding-era outreach vendors and what they do now

| Vendor | What it does | Target | Pricing | Distribution/maturity | Notes |
|---|---|---|---|---|---|
| **mPulse** (mpulse.com) | Conversational-AI/text outreach for redetermination; behavioral-science messaging | Medicaid MCOs | Not public | Served 30+ Medicaid MCOs during unwinding (Feb 2023 release); mature, PE-backed [funding amount unverified] | Still the default MCO nudge vendor; already has consent, TCPA posture, multilingual |
| **Cotiviti Eliza** | Multichannel outreach; reported 4.4M members reached by Aug 2023 across all 50 states | MCOs of all sizes | Not public | Mature, inside a large analytics vendor | Bundled with Cotiviti risk/quality products |
| **Firstsource** | Provider-side Medicaid redetermination program: text/email first wave, 30-day follow-up cadence | Hospitals/health systems | Not public | BPO, mature | Shows providers already bought this as a service in 2023 |
| **Personify Health (ex-Virgin Pulse) VP Activate** | AI outreach plus free redetermination toolkit | Health plans | Not public | Mature | Pivoted toward broader engagement |
| **Centauri Health Solutions, Agilian** | Retention/re-enrollment services and consulting; publish PMPM loss math | MCOs | Service fees | Mature | Compete on "we find and re-enroll your lost members" |
| **Novoflow, OhMD** | AI voice/SMS redetermination outreach (Novoflow page dated Apr 2026); OhMD markets FQHC texting | Providers/FQHCs | Not public | Small | Evidence of low barriers: new entrants keep appearing |

### 2b. Patient-engagement platforms already inside FQHCs

- **CareMessage** (caremessage.org): nonprofit texting platform; says it is trusted by "1 in 6 FQHCs nationwide" and has worked with health centers for more than a decade. Pricing not public [unverified: historically low-cost/subsidized]. Strength: FQHC trust and mission alignment, multilingual templates. Weakness: not an eligibility engine. Would it beat the startup? On FQHC distribution, yes; a renewal-date campaign is a template away.
- **Luma Health**: has a dedicated FQHC page and two-way integrations with Epic and eClinicalWorks; March 2026 release describes "Operational AI" spanning access, engagement, prior auth and financial clearance. No Medicaid renewal feature found [gap], but financial clearance is adjacent.
- **Artera (ex-WELL)**, **Relatient**: multichannel outreach for health systems; no renewal-specific feature found [gap].

### 2c. Navigation/enrollment startups

- **Fortuna Health**: consumer Medicaid navigation platform; $4M seed (a16z, Cityblock founder, John Legend) then **$18M Series A, July 2025, led by a16z**; operating in eight states; partnerships with MCOs, health systems and service providers; round explicitly earmarked for work-requirement features. In 2025 the CEO said it was "too early to build specifically for the federal work requirements." Strengths: capital, MCO relationships, consumer UX. Weakness: consumer-first, not a provider dashboard. Would the startup win? Not on the MCO channel.
- **MedicaidKeeper**: enrollee reporting portal for exemptions and activities via SMS, email or web; CBPP lists price at **$1 per enrollee per year**. This is the price anchor for any attestation feature.
- **Vimo "Medicaid Express"**: configurable end-to-end eligibility SaaS or standalone community-engagement module.
- **SteadyIQ Income Passport**: consent-based income/gig verification; used by states and cities; part of Missouri's stack with Equifax, ID.me, ServiceNow, RedMane, IRG.
- **Nava OSCER**: open-source applicant portal for reporting work, school and volunteer hours.
- Civilla (Michigan), Code for America (Louisiana LA'MESSAGE): nonprofit/government design partners, not sellers; their results are the field's main evidence base (see §4).

### 2d. Eligibility-system incumbents

Ten companies pledged "more than $600 million" in no-cost and discounted services to states (CMS, medicaid.gov): **Accenture, Acentra Health, Conduent, GDIT, Deloitte, Gainwell, Maximus, Curam by Merative, Optum, RedMane**. Healthcare Dive frames the figure as savings through 2028. Bloomberg Law separately reported 15+ tech/financial firms including Google, TransUnion, Experian, Equifax. Gainwell markets a configurable SaaS work-requirement verification tool; Salesforce an applicant-facing reporting portal (Digital Government Hub). New Hampshire paid Geographic Solutions ~$118,000 to extend its job-matching system to track hours and report to Medicaid. These vendors own the system of record; the startup will always be downstream of their data.

## 3. What states and CMS are funding; will states ship their own apps?

- **$200M Government Efficiency Grants** for state system modernization. States and Georgetown CCF say this "will come nowhere close" to covering costs; CBPP warns of coverage losses.
- **CMS "Emmy" (formerly IVAAS)**: open-source, consent-based payroll/employment verification plus an API that can run without enrollee interaction; CMS plans to add volunteer-hour verification. As of March 2026 it still awaited policy guidance on gig hours, and community-service hours rely on self-attestation.
- **Nebraska** (live May 1, 2026): DHHS first uses data it already holds; existing members must show one compliant month since last renewal, checked at renewal; phased through June 2027. Reporting channels surfaced in results were the state system, fax and in-person. Bluestem Health's CEO expects 10–15% of its 8,400 Medicaid patients to be disenrolled.
- **Georgia Pathways**: ~$58M first-year spend, about **$13,360 per enrollee**, mostly admin and consulting; monthly re-attestation; extended through Dec 2026 and must align with H.R.1 on Jan 1, 2027. Lesson: the burden sits in state process design, which a third party cannot fix.
- Answer to the redundancy question: **yes, largely.** Attestation and verification will be state-run (Emmy, state portals, vendor modules). What states will not do is track a given clinic's panel or a given plan's roster, which is the residual opening.

## 4. Does nudging work?

- **Negative:** GSA Office of Evaluation Sciences RCT, Norfolk VA, June–Nov 2024, 7,468 cases: additional "credibility" texts and mid-window phone calls "did not significantly affect" renewals (baseline renewal already high).
- **Positive but program-reported:** Louisiana LA'MESSAGE (Code for America): renewal approval rose from 15% to 25% (+67%) among ~9,900 Medicaid clients; Michigan two-way texting pilot (Civilla): approval 53%→67%, but only 69 clients. Covering Wisconsin found texts and prerecorded calls cost-effective for routing people to assistance.
- **Scale context:** KFF: ~70% of unwinding disenrollments were procedural; MCO re-enrollment 20–30%; states made retrospective rate adjustments for acuity. One national plan sent 3.9M outreaches (3.5M texts) in 2023 (Oliver Wyman). RSM: Medicaid/CHIP enrollment fell 5M (6%) Apr 2025–Apr 2026.
- Read: nudges help where the baseline is bad and the state does not text; they add little on top of a state that already texts. Every state will text by 2027.

## 5. Economics

- **MCO side:** Centauri illustration: losing 26,000 of 200,000 members at ~$200 PMPM is >$60M/yr. This is the only real budget in the market, and MCOs already buy mPulse/Eliza/Centauri. Note KFF's finding that states retrospectively adjust rates for acuity, which blunts the pure PMPM-loss argument.
- **FQHC side:** Vermont data: Medicaid paid ~$177/visit vs ~$250 cost (2021), so a lost Medicaid patient converts to an uninsured sliding-fee visit, not zero. Patient revenue ~62% of operating costs; Section 330 grants ~17–18%. One source claims 40% of FQHCs have <90 days cash [unverified, weak source]. FQHCs are being squeezed by H.R.1 and the funding cliff (Milbank, chcimpact.org), so new software spend is the first thing cut. No public data found on what FQHCs pay for engagement tools [gap]; CareMessage's nonprofit model sets the expectation near zero.
- **Procurement reality:** FQHC budgets follow HRSA grant cycles and state PPS rates; MCO procurement is 12–18-month RFP cycles with incumbent vendors [unverified, analyst judgment].

## 6. Could Epic/athena/eCW or an engagement incumbent ship this in a quarter?

Yes. The feature set (store renewal date and CE status on the patient record, trigger multilingual outreach, worklist of at-risk patients, document upload) maps onto existing registry, campaign and MyChart/portal primitives. No evidence surfaced of Epic, athena or eCW announcing a renewal-tracking module [gap], but Luma already integrates with Epic and eCW and sells to FQHCs, and CareMessage sits in one in six FQHCs. Once CMS/state data feeds exist, the EHRs will consume them. If that happens the startup must retreat to a data-feed or MCO-services niche.

## 7. Shutdowns and failures

- **Benefits Data Trust** closed August 2024 after an abrupt June announcement citing a financial review; 250+ jobs lost; planned work in seven states left in limbo. A grant-funded navigator-at-scale model did not survive even with strong results.
- No unwinding-era commercial vendor shutdowns found; Virgin Pulse rebranded as Personify Health. The field consolidated into the large MCO vendors rather than failing.

## 8. Where the startup could still win (narrow)

1. **Provider-to-plan data product:** a panel-level registry that fuses EHR demographics with state renewal dates and CE status, sold to MCOs as a supplemental-benefit/retention service delivered through their contracted FQHCs. Requires a state data feed that does not yet exist [key unknown].
2. **Document assembly and exemption evidence** (medical frailty, caregiver status) generated from the clinical record, which only a provider can produce and which Emmy does not cover. CMS's rule barring diagnosis-code-based frailty findings complicates this.
3. **Nebraska/Georgia/Montana/Iowa early-adopter pilots** to generate the RCT-grade evidence the market lacks.

## Sources (retrieved 2026-11-02)

- https://www.cbpp.org/research/health/assessing-the-medicaid-work-requirement-vendor-landscape
- https://www.cbpp.org/research/health/a-guide-to-reducing-coverage-losses-through-effective-implementation-of-medicaids
- https://www.cbpp.org/blog/understanding-cmss-emmy-medicaid-work-requirement-tools
- https://digitalgovernmenthub.org/wp-content/uploads/2026/05/2-9-26health.pdf
- https://newhampshirebulletin.com/2026/10/22/new-hampshire-sets-up-digital-system-to-accommodate-new-medicaid-work-requirements/
- https://www.nextgov.com/digital-government/2026/07/cms-quietly-moved-medicaid-technology-project-federal-data-hub-new-eligibility-requirements-approach/415106/
- https://insidehealthpolicy.com/daily-news/cms-emmy-medicaid-work-req-app-awaits-additional-policy-guidance
- https://www.medicaid.gov/resources-for-states/working-families-tax-cut-legislation/community-engagement/pledges-from-medicaid-tech-companies
- https://www.cms.gov/newsroom/press-releases/cms-launches-nationwide-framework-implement-medicaid-work-requirements
- https://www.fiercehealthcare.com/regulatory/10-medicaid-vendors-pledge-600m-discounted-free-services-support-work-requirements-cms
- https://www.healthcaredive.com/news/medicaid-vendors-trump-deals-cms-work-requirements/810839/
- https://www.healthcarefinancenews.com/news/tech-companies-pledge-600-million-support-states-medicaid-work-requirements
- https://news.bloomberglaw.com/health-law-and-business/tech-financial-firms-sign-on-to-build-medicaid-work-requirement
- https://www.beckerspayer.com/payer/medicaid/cms-secures-600m-in-tech-support-for-medicaid-work-rules/
- https://ccf.georgetown.edu/2026/02/11/implementing-costly-medicaid-work-reporting-requirements-who-will-foot-the-bill/
- https://ccf.georgetown.edu/2026/02/06/self-help-tools-and-tutorials-are-critical-to-implementing-medicaid-work-reporting-requirements/
- https://shvs.org/wp-content/uploads/2025/11/SHVS_Work-Requirements-Compliance-and-Exemptions-Verification_November-2025.pdf
- https://www.businesswire.com/news/home/20230223005352/en/mPulse-Supports-Over-30-Medicaid-Managed-Care-Organization-Customers-During-the-Unwinding-of-Continuous-Enrollment
- https://resources.cotiviti.com/case-study/medicaid-plans-leverage-eliza-to-reach-members-during-redetermination
- https://www.firstsource.com/wp-content/uploads/2023/11/Firstsource-Provider-Medicaid-Redermination_Solution-Overview.pdf
- https://prnewswire.com/news-releases/virgin-pulse-helps-health-plans-reach-vulnerable-populations-facing-medicaid-redetermination-301745517.html
- https://www.oliverwyman.com/our-expertise/perspectives/health/2024/jan/overcoming-medicaid-redetermination-hurdles-in-2024.html
- https://ai.novoflow.io/solution-automates-medicaid-redetermination-outreach-calls
- https://www.ohmd.com/care-setting/fqhc
- https://www.caremessage.org/partners/fqhcs/
- https://www.lumahealth.io/who-we-serve/fqhc/
- https://www.lumahealth.io/platform/integrations/epic
- https://www.prnewswire.com/news-releases/luma-health-accelerates-the-shift-to-operational-ai-across-health-system-workflows-302691540.html
- https://www.mobihealthnews.com/news/fortuna-health-raises-18m-enhance-ai-medicaid-enrollment
- https://www.hcinnovationgroup.com/policy-value-based-care/medicare-medicaid/news/55304442/fortuna-gets-funding-to-expand-medicaid-enrollment-solution
- https://fiercehealthcare.com/health-tech/medicaid-navigation-startup-fortuna-health-picks-4m-investment-backed-a16z-cityblock
- https://oes.gsa.gov/projects/2406-increasing-medicaid-renewals-with-texts/
- https://oes.gsa.gov/assets/abstracts/2406-abstract.pdf
- https://codeforamerica.org/explore/louisiana-demo/
- https://codeforamerica.org/news/leveraging-text-messaging-to-improve-communications-in-safety-net-programs/
- https://kffhealthnews.org/news/article/state-medicaid-programs-texting-capability-reenrollment-communication/amp
- https://www.kff.org/medicaid/experience-of-the-five-largest-publicly-traded-companies-operating-medicaid-managed-care-plans-during-unwinding/
- https://www.kff.org/medicaid/unwinding-of-medicaid-continuous-enrollment-key-themes-from-the-field/
- https://realeconomy.rsmus.com/healthcare-industry-trend-watch-week-of-aug-17-2026/
- https://centaurihs.com/?p=5793
- https://agilian.com/resources/blog/the-real-cost-of-losing-5-percent-medicaid-members
- https://www.nachc.org/wp-content/uploads/2023/08/Preparing-for-Medicaid-Unwinding-Financial-Impact-FAQ.pdf
- https://legislature.vermont.gov/Documents/2024/WorkGroups/House%20Health%20Care/FY2024%20Budget/W~Mary%20Kate%20Mohlman~Bi-State%20Primary%20Care%20Association%20Testimony%20-%20Federally%20Qualified%20Health%20Centers%20Medicaid%20Rates~2-23-2023.pdf
- https://www.milbank.org/quarterly/articles/estimating-the-impact-of-medicaid-expansion-and-federal-funding-cuts-on-fqhc-staffing-and-patient-capacity/
- https://chcimpact.org/hr1-medicaid-heatmap/
- https://grantedai.com/blog/community-health-centers-medicaid-work-requirements-funding-crisis-strategy-2026
- https://gbpi.org/georgias-pathways-to-coverage-program-the-first-year-in-review-fact-sheet/
- https://www.commonwealthfund.org/blog/2024/few-georgians-are-enrolled-states-medicaid-work-requirement-program
- https://floridaphoenix.com/2025/09/26/repub/georgias-limited-medicaid-expansion-program-is-extended-through-2026-despite-concerns-about-cost/
- https://dhhs.ne.gov/WorkRequirements
- https://dhhs.ne.gov/Pages/New-Medicaid-Work-Requirements-Take-Effect-for-Expansion-Members-Friday.aspx
- https://www.ktiv.com/2025/12/31/nebraska-implement-medicaid-work-requirements-starting-may-2026/
- https://www.nebraskahospitals.org/nebraska-hospitals-warn-medicaid-work-rules-could-disrupt-care
- https://www.inquirer.com/health/benefits-data-trust-closing-august-23-20240823.html
- https://route-fifty.com/management/2024/07/nonprofits-abrupt-closure-puts-access-public-benefits-risk/397968
- https://www.statnews.com/2026/08/10/medicaid-work-requirement-changes-states-contact/
- https://www.openmedicaid.org/insights/work-requirements-2026
