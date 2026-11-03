# Check: AI claim-denial recovery and appeals (Grok's idea)

**Idea:** Ingest EOBs, denial letters and clinical notes. Map them to payer rules and codes, generate evidence-backed appeal packages, and track deadlines. Sell to independent practices and to patients, priced per use or as a share of money recovered.

**Verdict: KILL as proposed, for this founder.** The pain is real and well documented. But the patient side is already served for free by funded, grant-backed players and open source, so patient willingness to pay is weak. The practice side is crowded: Waystar includes the feature at no added cost, Amperos is VC-funded, and small vendors already sell appeals at about $5-$20 each. The practice product also requires a BAA and clinical PHI, which is the hardest legal shape for a 17-year-old with a parent-run LLC. The only openings left are thin wedges (see the end).

## 1. Competitors

| Product | Segment | What it does | Price | Funding / traction |
|---|---|---|---|---|
| Counterforce Health (Durham/RTP NC) | Patients, plus clinics | AI appeal letters; voice agent "Maxwell" | Free for patients; CareYaya impact fund pays per-letter costs | Grants: $280K (CBS17), $2.47M PennAITech grant (CNET via AOL). Plans a monthly subscription for clinics (Grepbeat). Has a Wikipedia page and national press |
| Claimable | Patients | "TurboTax for insurance claims," all payers including Medicare/Medicaid | About $39.95 per appeal plus shipping | Seed round led by Walkabout Ventures, amount not disclosed. Claims 80-85% success (company-reported) |
| Fight Health Insurance (Holden Karau) | Patients; a provider product is planned | Open-source LLM appeal drafting | Free; $5 optional fax | Went viral in 2024 (SF Standard, BI, BGR) |
| ApproveIt | Patients | Appeal in about 90 seconds | 15% of the amount won, only on a win | Product Hunt launch |
| Sheer Health | Patients and providers | App connects to the insurer account; bills, claims, Q&A | Free with a share of savings, or a small monthly fee | Funding not found |
| Goodbill / Resolve / CareRoute | Patients (bill negotiation, next door to appeals) | Negotiate medical bills | Goodbill 20% of savings (cap of $1,000 per third parties); Resolve 10-25% tiered | Goodbill raised $2M and is moving toward TPAs and plans |
| Doximity GPT | Physicians | Free drafting of appeal letters | Free for verified clinicians | Large physician network (HIPAA status unverified) |
| Muni Health (Muni Appeals) | Independent practices | Appeal automation plus AI calling | $20 per appeal, 3 free credits; offers a BAA | Small vendor |
| EZAppeal | Practices | Appeal generator | $5 per letter or $20 per credit (sources conflict) | Small vendor |
| Ember Copilot, Aegis (YC), Authsnap, CombineHealth | Practices and billing teams | AI denial appeals; EHR integrations (athena, ModMed) | Not published / pilot | Aegis is a YC launch; Authsnap runs a pilot with Henry Ford/MSU |
| Amperos Health | Providers | End-to-end denials: portal follow-up, calls, corrected claims, appeals | Enterprise | $16M Series A (Bessemer), April 2026 |
| Waystar AltitudeAI (AltitudeCreate) | Health systems and practices on Waystar | Generative-AI appeal packages in bulk | No added cost for existing denial-management customers | Public company; claims 40% more denials overturned (company-reported) |
| athenahealth / eClinicalWorks | Independent practices (their core base) | Automated appeal workflow / AI agent workbench (eCW, HIMSS 2026) | Bundled | athena feature reported by a third-party site, unverified |

I did not check Infinx, Thoughtful AI / Smarter Technologies, MDaudit, Rivet, Candid or Adonis pricing (UNVERIFIED; enterprise RCM vendors).

**What this means:** "AI drafts the appeal letter" is now a commodity. It is free for patients (Counterforce, FHI, Doximity) and about $5-$20 per appeal for practices. Waystar gives it away. Raw LLM drafting carries no defensibility.

## 2. Claims checked

| Claim (Grok) | Status | Evidence |
|---|---|---|
| Experian Health 2026 State of Claims: 75% say denials are rising | TRUE | Experian press release, Oct 28, 2026: "Three-quarters (75%)… report that claim denials are increasing." Sample was 204 respondents |
| 40% have denial rates of 10% or more | TRUE (wording varies) | Release says "exceed 10%"; Experian blog says "at least 10%." Flat versus last year |
| "90% of denied claims require human review" | UNVERIFIED / likely garbled | No primary source. "90%" circulates as (a) an unsourced "90% undergo manual review" and (b) the alleged 90% error rate of UnitedHealth's nH Predict, which is a lawsuit allegation |
| Independent practices are underserved | PARTLY TRUE, but weakening | Enterprise RCM targets health systems. But athena/eCW (the EHRs independents use), Waystar, Muni, EZAppeal, Ember and Counterforce's clinic plan all now target small practices |
| YC W27 "$15-an-hour expert" RFS | LIKELY TRUE (via aggregator) | One aggregator says the W27 RFS (Oct 27, 2026, Brad Flora) includes "AI that turns an ordinary worker into an expert," naming insurance claims and medical billing. A second search did not confirm it, and I could not open ycombinator.com/rfs. It points to an AI-plus-human-workforce services model, not a self-serve letter tool |
| Fewer than 1% of denials are appealed (KFF) | TRUE | KFF: under 1% (376,527) of denied in-network HealthCare.gov claims in 2023 were appealed internally; 19% of claims denied |
| About 40-60% of appeals succeed | TRUE (context-dependent) | KFF 2023: insurers upheld 56%, so about 44% were overturned. Other sources: about 51.6% overturned at the first Medicare level, about 83% for MA prior-auth appeals (secondary sources). A 2026 JAMA IM / NY study headline says "nearly half overturned" |

## 3. Legal

- **Practice customers mean a HIPAA business associate.** A vendor that receives clinical notes and EOBs to perform billing or appeal work for a covered entity is a business associate. It must sign a BAA and comply with the Security Rule (risk analysis, policies, encryption, breach notice to the practice) (FTC/HHS guidance). Every LLM, hosting and fax subprocessor also needs a BAA. Supabase and Vercel's HIPAA tiers and LLM vendors' BAAs cost money and require enterprise plans (UNVERIFIED pricing).
- **Can a minor's LLC sign?** The LLC (a separate legal entity) can sign BAAs through an adult manager or officer. That is the parent-managed workaround in the brief. In practice, though, practices and billing companies ask for security questionnaires, SOC 2 or HITRUST, and cyber insurance. A brand-new LLC run by a 17-year-old and holding clinical notes is a hard sale, and the founder stays personally exposed if he is the one handling the data. This is legal analysis, not from a cited source; get a lawyer's review.
- **Patient-direct means HIPAA usually does NOT apply.** An app that patients use for themselves, not acting for a covered entity, is not a covered entity or business associate. It instead falls under the FTC Health Breach Notification Rule (expanded in 2024), where sharing data without authorization counts as a "breach." California's CMIA (Civ. Code 56.06, which covers consumer medical-information software) and Washington's My Health My Data Act probably apply too (UNVERIFIED in this search). This path is legally much easier.
- **Appeals assistance:** Patients can appoint a representative. Medicare uses an appointment-of-representative form (CMS-1696; UNVERIFIED here). I found no state licensing requirement for helping a patient write their own appeal. Contingency-fee advocacy may raise unauthorized-practice-of-law or debt-adjuster questions in some states (UNVERIFIED).
- **2025-2026 regulation is a tailwind on the payer side.** Arizona HB 2175, Indiana HB 1271, Maryland HB 1563, Georgia SB 444, Alabama SB 63 and others (Becker's Payer, "7 AI health insurance state laws passed in 2026") require clinician review of AI-driven denials. None of them restrict appeal tools. CMS-0057-F (specific denial reasons and prior-auth API timelines) was not checked in this search (UNVERIFIED).

## 4. Willingness to pay

- **Patients:** The market anchor price is zero. Counterforce (grant-funded), Fight Health Insurance (open source) and the free chatbots set it. Claimable at about $40 and ApproveIt at 15% of the win show that some people will pay, but no revenue or volume figures are public. Fewer than 1% of patients appeal, so the funnel is very thin: demand has to be created, not captured. Contingency fees are awkward because most denied amounts are owed by the insurer to the provider, and the patient's own savings are often small or indirect.
- **Practices:** Willingness to pay is real (Experian: 89% say reducing denials is a priority; most plan AI investment). But spending goes to the EHR or clearinghouse they already use (athena, Waystar) or to their billing company. Standalone appeal tools sell at about $5-$20 per appeal, which is low per-customer revenue and requires many small-practice sales cycles. Amperos's $16M round shows that the venture-scale version is end-to-end denial work (calls, portals, corrected claims) for larger providers.
- **Recovery-based pricing:** Plausible for practices, at roughly the percent-of-collections model billing companies use. But it requires integration with the PM/EHR system, posting reconciliation, and a BAA, the same blockers as above.

## 5. Where a gap might remain (low confidence)

1. **Patient-side, non-HIPAA, high-dollar niche:** for example, out-of-network or No Surprises Act disputes, external review (IRO) filings, or ERISA plan appeals with deadline tracking, at a flat fee. This still competes with free tools.
2. **The YC "$15-an-hour expert" angle:** tooling for non-certified billers at billing companies. The billing company signs the BAA and hosts the data, so the founder sells software to the BAA holder. Even so, a BAA with the vendor will likely still be required.

Both have slow, trust-heavy sales that do not fit "money in 60-90 days."

## Sources
- https://www.experianplc.com/newsroom/press-releases/2026/experian-health-s-annual-state-of-claims-survey-finds-denials-re
- https://www.experian.com/blogs/healthcare/healthcare-claim-denials-statistics-state-of-claims-report/
- https://beckershospitalreview.com/finance/revenue-cycle-management/the-tactics-providers-are-using-to-reduce-claim-denials
- https://www.medicaleconomics.com/view/why-are-claims-being-denied-in-2026-services-not-covered-now-tops-the-list
- https://www.kff.org/private-insurance/claims-denials-and-appeals-in-aca-marketplace-plans-in-2023/
- https://www.healthcaredive.com/news/aca-plans-denied-one-fifth-of-in-network-claims-2023-kff/738389/
- https://www.healthcaredive.com/news/insurance-denials-overturned-appeal-new-york-study-JAMA/817490/
- https://www.axios.com/local/raleigh/2025/08/20/using-ai-to-fight-back-against-insurance-denials-counteforce
- https://www.cbs17.com/news/local-news/wake-county-news/raleigh-organization-helps-thousands-of-americans-appeal-health-insurance-denials-using-ai/amp/
- https://www.aol.com/articles/unexpected-way-ai-helping-appeal-094502348.html
- https://grepbeat.com/2025/05/20/durham-based-counterforce-health-uses-ai-to-appeal-insurance-claim-denials
- https://www.cityviewnc.com/stories/counterforce-health-an-nc-based-company-uses-ai-to-fight-health-insurance-denials/
- https://en.wikipedia.org/wiki/Counterforce_Health
- https://www.globenewswire.com/news-release/2024/10/02/2956879/0/en/Claimable-Launches-First-Ever-AI-Powered-Appeals-Platform-to-Fight-Unjust-Healthcare-Denials.html
- https://www.ibtimes.co.uk/claimable-uk-ceo-uses-ai-help-americans-overturn-health-claim-denials-85-success-rate-1729525
- https://innovationia.com/2025/08/14/startup-stories-claimable-fights-denied-medical-claims/
- https://www.sfstandard.com/2024/08/23/holden-karau-fight-health-insurance-appeal-claims-denials/
- https://bgr.com/tech/this-free-site-uses-ai-to-help-you-fight-health-insurance-claim-denials/
- https://www.producthunt.com/p/approveit/approveit-1f8efeb7-05ed-4868-a72a-0f8cfd9bcb53
- https://chlpi.org/news-and-events/news-and-commentary/health-law-and-policy/ai-vs-ai-patients-deploy-bots-to-battle-health-insurers-that-deny-care/
- https://theclevelandmoms.com/sheer-health-a-new-app-that-saves-moms-time-money/
- https://help.goodbill.com/en/articles/254209
- https://www.careroute.ai/bill-defense/compare-medical-bill-negotiation-services
- https://www.goodbill.com/blog/news-goodbill-raise-2m-funding-expands-cost-containment-plans-tpas
- https://muni.health/blog/appeal-automation-software-small-practices-2026
- https://www.ezappeal.com/blog/ai-denial-appeal-generator
- https://intuitionlabs.ai/articles/ai-claim-denial-appeal-letter-generator
- https://www.embercopilot.ai/knowledge/best-ai-denial-appeal-tool-for-athenahealth-users-in-2026
- https://www.ycombinator.com/launches/NZg-aegis-ai-revenue-recovery-engine-for-healthcare-providers
- https://henryfordmsu.org/innovation/case-studies/authsnap
- https://www.toolkitly.com/doximity-gpt
- https://www.fiercehealthcare.com/ai-and-machine-learning/amperos-health-secures-16m-series-funding-announces-industrys-new-first-ai
- https://medcitynews.com/2026/04/startup-helping-providers-manage-denied-claims-raises-16m/
- https://hitconsultant.net/2025/01/15/waystar-launches-altitudeai-to-combat-claim-denials-with-ai-powered-automation
- https://www.medicaleconomics.com/view/new-ai-can-autonomously-help-physicians-generate-appeal-letters-for-denied-claims
- https://www.revelemd.com/blog/why-himss-2026-mattered-for-medical-practices
- https://rcmexperts.us/blog/athena/how-athenahealth-manages-payer-specific-billing-rules/
- https://postdigitalist.xyz/yc-request-for-startups/
- https://www.ycombinator.com/rfs
- https://ftc.gov/business-guidance/resources/collecting-using-or-sharing-consumer-health-information-look-hipaa-ftc-act-health-breach
- https://www.beckerspayer.com/policy-updates/7-ai-health-insurance-state-laws-passed-in-2026/
- https://smartinsuranceai.blogspot.com/2026/05/nine-out-of-ten-ai-denials-were-wrong.html
