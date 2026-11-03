# C06 — Patient-authorized (FHIR) medical records retrieval for law firms: competitive analysis

Retrieval date: 2026-11-02. Skeptical-investor framing. All facts from the cited sources; items marked [unverified] come only from vendor/aggregator pages or were not found.

## 1. Bottom line

**Verdict: Maybe, leaning No.** The core thesis ("the retrieval industry never uses the patient's own right") is half wrong. The *HIPAA right-of-access* half is already the business model of ChartSquad and Arctrieval, and Codes Health already pulls from patient portals. The *FHIR-API* half is already productized as infrastructure by Fasten Connect and Flexpa (both support TEFCA Individual Access Services), so a legal-tech vendor can bolt it on in a quarter. What remains is a go-to-market wedge (hours instead of weeks, near-zero provider fees), not a defensible moat. The biggest unresolved question is whether patient-API output is complete and certifiable enough for demand packages, litigation, and SSA, where custodian certification and "complete chart" expectations still rule.

## 2. Direct and adjacent competitors

### Patient-directed retrieval for law firms (closest to the thesis)

**ChartSquad** (chartsquad.com). Patient-directed personal health record used by PI firms: the client requests their own records under HIPAA, firm receives them. Claims a national average provider fee of $6.00–$6.50 per request and a 15-day national average turnaround; law-firm pricing is quote-only (third-party page cites a $45 service charge example [unverified]). Strength: proves the patient-rights model works commercially and cuts provider fees dramatically. Weakness: still paper/fax/portal workflows, 15-day turnaround, no FHIR API automation documented. Would the startup win? Only on speed; ChartSquad could add FHIR connectors.

**Arctrieval** (arctrieval.com). Right-of-access-based request software for firms; $155/month subscription per a comparison list [unverified]; publishes cost guidance arguing records should cost $30–40 total. Same model as above, software-only. Weakness: no API automation found.

**Codes Health** (getcodeshealth.com). AI retrieval + chronology with human review, flat fee per case; claims it pulls from "claims clearinghouses, custodian integrations, proprietary provider networks, fax, and patient portals," 1–2 week turnaround, Filevine partnership (July 2026) putting retrieval inside case management. "Missing Record Review" flags gaps (e.g., imaging referenced without report). This is the most dangerous adjacent player: it already combines patient-portal access with the legal workflow and distribution via Filevine.

**Tavrn** (tavrn.ai). Retrieval at $299.99/month for 20 requests, $20 per additional request; SOC 2 Type II; reportedly $15M Series A [unverified]; competitor roundups say 2–4 week turnaround.

### Provider-side incumbents (release-of-information)

**Datavant / Ciox** (datavant.com). Merged 2021 in a deal valued at $7B; CEO says on track for >$1B revenue in 2025; network of 70,000+ hospitals and clinics, 75% of the 100 largest health systems; acquired Record Retrieval Solutions in 2025 ($45 flat fee, 15-day average). No published per-request legal pricing; complaints center on variable fees and turnaround. ChartSwap (now Datavant) self-reports 7.5-day provider turnaround; one list cites a $37 download fee plus provider fees and ~10 days. Datavant sits on the custodian side of most hospital ROI departments, so it controls the certified-copy channel the startup cannot replace.

**MRO, Verisma, American Retrieval, Compex, Ontellus, US Legal Support, Lexitas, YoCierge, Record Reform**: managed retrieval on authorization/subpoena, per-request pricing typically $20–50 plus provider fees, 1–4 week turnaround (vendor comparison pages). American Retrieval reportedly routes some requests through Datavant. None documented as using patient APIs.

### Patient-access data infrastructure (the "pick-and-shovel" layer the startup would depend on)

**Fasten Connect** (fastenhealth.com). Commercial REST + FHIR API with embeddable "Stitch" consent component, HMAC webhooks, bulk EHI export, identity proofing and **TEFCA IAS** (bring-your-own-identity option); claims 50,000+ (elsewhere 60,000+/80,000+) healthcare systems incl. Epic, Cerner, Kaiser, HCA, Humana, Medicare. Pricing not published (free sandbox, "usage-based/freemium" per third-party profile); stated use cases: clinical research, concierge care, underwriting, digital health. No law-firm mention. Funding not found [unverified]. Open-source OnPrem app is GPL-3.0 and does not connect to EHRs itself.

**Flexpa** (flexpa.com). Published annual tiers: Startup $20,000, Growth $50,000, Scale $130,000, Omni $900,000+; FHIR API in every tier; PDF export ($pdf) and hosted MCP server as paid add-ons. Retrieves from TEFCA (CommonWell/Kno2), 350+ health plans via Patient Access APIs, and 40–45k providers. Total funding ~$11M, latest round Seed (aggregators) [unverified]. Partnerships: ŌURA, CMS pledge. The $pdf add-on is notable: a document-shaped output aimed at exactly the kind of downstream consumer a law firm is.

**Health Gorilla, 1upHealth, Particle Health, Zus, Metriport, b.well, Ribbon**: not researched in depth within budget; none surfaced in legal-retrieval searches. Treat as potential suppliers, not competitors [unverified].

**Human API**: acquired by LexisNexis Risk Solutions in 2023 (terms undisclosed) and folded into life-insurance consumer-consent data. **Ciitizen**: acquired by Invitae for $325M (2021), divested Dec 2023 ahead of Invitae's Chapter 11, relaunched as Citizen Health with a $14.5M seed focused on rare disease. Lesson: standalone patient-mediated record companies have ended up as features of larger data buyers or refocused on narrow verticals; neither found a durable standalone market.

### Legal-tech platforms

**EvenUp**: sources conflict; some say its PLAAS pre-litigation service extends into record and bill retrieval [unverified]. **Supio**: no retrieval. **Filevine**: retrieval via Codes Health partnership. **CaseFleet**: not found. EvenUp and Filevine have the distribution to absorb a FHIR-retrieval feature quickly.

## 3. Platform and legal constraints

- **Epic**: third-party apps register on fhir.epic.com; the open.epic API Subscription Agreement includes a clause that the app may not "provide third parties or third-party products direct or indirect access to or use of the Epic Materials"; patient-facing apps complete a funding/data-use questionnaire. MyChart lets patients link apps to their own account or a proxy's. A law-firm-directed app is plausibly allowed as a patient-authorized app, but Epic reviews attestations and could reject an app whose data flows to a litigation party [unverified: no explicit Epic policy found]. TEFCA IAS via Epic Nexus is a documented alternative path.
- **TEFCA IAS**: an IAS Provider is any QHIN/Participant/Subparticipant offering IAS; must contract with a credential service provider and verify identity (IAL2) and authenticate at AAL2; a Feb 2026 Sequoia proposal would tighten demographic verification. The startup would need to become a Subparticipant (or ride Fasten/Flexpa). Export in computable format and express consent were proposed in the 2024 rule [finalization unverified].
- **HIPAA fees**: after *Ciox v. Azar* (2020), the cost-based fee cap applies to copies delivered to the individual and to third-party directives only for electronic copies from an EHR; state law may cap further. A patient app that receives records directly is the cheapest path, which is the real economic insight here.
- **Information blocking**: OIG can impose up to $1M per violation on developers/HIEs; provider "disincentives" effective July 2024/Jan 2025; ~1,600 complaints filed by Feb 2026; ASTP began issuing letters of nonconformity to EHR developers Feb 2026; but as of Dec 2025 **no public enforcement actions against providers** had been announced. The "automatic complaint" lever has reputational but little demonstrated enforcement bite.
- **42 CFR Part 2 and BAA status**: not researched within budget; a firm receiving SUD records via a patient app sidesteps Part 2 consent forms only if the patient downloads directly [unverified].
- **API coverage**: ONC data: 70% of hospitals enabled FHIR app access in 2024 (81% any API), lagging among smaller, independent, and non-top-3-EHR hospitals; 95% let patients view clinical notes in the portal. Legal-aid attorneys report many behavioral-health, specialty, and rural providers still have no EHR. No data found on imaging report or billing completeness via patient APIs — a key unknown.

## 4. Is patient-API data sufficient for legal/SSDI use?

- Evidence rules: records enter under FRE 803(6) with FRE 902(11) custodian certification or equivalent (e.g., Cal. Evid. Code 1561–1562). A practitioner source states a patient generally cannot authenticate their own records and that portal records are "usually better obtained as a certified copy." Demand-package use (pre-suit) is less formal, but insurers and defense counsel can demand certified copies at litigation.
- SSDI: SSA requests ~15M records/year for ~3M claims and spends >$500M/year collecting them; it already receives records electronically via eHealth Exchange and, since Feb 2026, TEFCA, with >65% of Epic customers sharing with SSA. SSA is solving its own retrieval problem on the provider side; representatives' value-add is shrinking.
- Codes Health's "Missing Record Review" exists because incompleteness is a known problem; patient APIs return USCDI-scoped data, not the full designated record set, unless the provider supports EHI export (Fasten advertises bulk EHI export, scope unverified).

## 5. Economics of the incumbent model

Per-request fees $20–50 plus provider/custodian fees (state-capped), turnaround 7.5–30 days, several providers per PI case; Datavant >$1B revenue 2025 across all lines (legal share unknown). ChartSquad's $6.50 average provider fee shows the patient-rights route removes most of the provider fee. The startup's unit economics would be attractive (API calls cost near zero) but Flexpa's $20k–$900k platform tiers show what the infrastructure costs if not built in-house.

## 6. Could Fasten / Flexpa / Datavant ship this in a quarter?

- **Fasten or Flexpa**: yes. Both already have consent UI, TEFCA IAS, webhooks, and PDF export (Flexpa). They lack law-firm sales, demand-letter workflow, and certification. More likely they sell to Codes Health/Tavrn/EvenUp than enter directly.
- **Codes Health / Tavrn / EvenUp**: yes, by buying Fasten/Flexpa access; they already own the firm relationship and the chronology product.
- **Datavant**: has no incentive to cannibalize custodian fees but could add a patient-app channel to ChartSwap as a loss leader; it also controls certified copies, making it the natural "last mile" partner the startup would still need.

## 7. What would have to be true to win

1. Courts/insurers/SSA accept API-derived records (or the startup pairs each API pull with an automated certified-copy request for the subset needed at trial).
2. Epic and other EHR vendors do not treat litigation-directed apps as outside patient-app terms.
3. Completeness gap (imaging reports, billing, pre-2016 records, non-EHR providers) is small enough that firms stop ordering traditional retrieval.
4. Codes/Tavrn/EvenUp do not add Fasten/Flexpa connectors first.

None of these is currently evidenced.

## Sources (retrieved 2026-11-02)

- https://www.fastenhealth.com/
- https://github.com/api-evangelist/fasten-health
- https://github.com/fastenhealth/fasten-onprem
- https://apis.io/providers/fasten-health/
- https://apps.smarthealthit.org/app/fasten-health
- https://www.crunchbase.com/organization/fasten-health
- https://pitchbook.com/profiles/company/711616-60
- https://www.flexpa.com/pricing
- https://www.flexpa.com/docs/records
- https://www.flexpa.com/docs/consent/patient-access
- https://www.flexpa.com/product-overview
- https://www.flexpa.com/blog/oura-and-flexpa-partner-to-ground-wearable-health-insights-in-clinical-records
- https://www.cms.gov/initiatives/health-technology-ecosystem/overview/pledge-demo-showcase/flexpa
- https://startupintros.com/orgs/flexpa
- https://elion.health/products/flexpa
- https://chartsquad.com/
- https://chartsquad.com/about-us/faq/
- https://chartsquad.com/about-us/
- https://chartsquad.com/about-us/medical-records-news-and-information/records-request-operational-costs/
- https://evolvelaw.ai/chartsquad.html
- https://blog.cvn.com/the-hipaa-application-that-slashes-law-firms-medical-records-costs
- https://www.lighthouselegal.ai/learn/chartsquad-vs-record-grabber-medical-records
- https://www.tavrn.ai/blog/tavrn-vs-chart-squad
- https://www.tavrn.ai/blog/medical-record-retrieval-companies-for-lawyers
- https://www.tavrn.ai/blog/personal-injury-medical-records-request
- https://arctrieval.com/wp-content/uploads/2025/05/Arctrieval-Record-Cost-Guidance-2025_03_04.pdf
- https://www.getcodeshealth.com/blogs/evenup-vs-supio-vs-codes-health
- https://www.getcodeshealth.com/blogs/tavrn-vs-evenup-vs-codes-health
- https://www.getcodeshealth.com/blogs/tavrn-reviews
- https://www.getcodeshealth.com/blogs/ciox-health-reviews
- https://www.getcodeshealth.com/blogs/national-record-retrieval-alternatives
- https://www.hellocounsel.ai/blog/codes-health-alternatives
- https://www.hellocounsel.ai/blog/medical-records-retrieval-companies
- https://www.inquery.ai/post/best-medical-record-retrieval-companies-law-firms/
- https://medrecords.ai/reports/chartswap-review/
- https://medrecords.ai/best/medical-record-retrieval-services/
- https://www.recordsontime.com/top-medical-record-retrieval-companies-2026/
- https://attorneyatlawmagazine.com/legal-vendors/top-7-medical-record-retrieval-services-for-law-firms
- https://www.vaquill.ai/blog/best-ai-software-plaintiff-law-firms
- https://www.aivortex.io/legal/compare/evenup-vs-filevine/
- https://www.uslegalsupport.com/record-retrieval/medical/
- https://www.lexitaslegal.com/solutions/record-retrieval
- https://www.chartrequest.com/articles/personal-injury-record-retrieval-process
- https://www.fiercehealthcare.com/health-tech/datavant-acquires-real-world-evidence-company-aetion-boost-its-life-sciences-business
- https://dealroom.co/companies/datavant/
- https://ecf.ca8.uscourts.gov/opndir/20/03/183467P.pdf
- https://www.marketscreener.com/quote/stock/RELX-PLC-9590187/news/LexisNexis-Risk-Solutions-Acquires-Human-API-43635179/
- https://hitconsultant.net/2023/04/25/lexisnexis-risk-solutions-acquires-human-api/
- https://www.prnewswire.com/news-releases/invitae-divests-ciitizen-health-data-platform-and-implements-further-cost-cuts-302014675.html
- https://medcitynews.com/2024/11/invitae-healthcare-data/
- https://www.fiercebiotech.com/medtech/labcorp-picks-invitae-portfolio-239m-bankruptcy-sale
- https://fhir.epic.com/Documentation
- https://open.epic.com/Tutorial/PatientAuthentication?whereFrom=MyChart
- https://mychart.nyulmc.org/mychart/en-us/docs/PatientAuthenticationInstructions.pdf
- https://mychart.bsahs.org/en-us/docs/InteroperabilityGuide_en.pdf
- https://rce.sequoiaproject.org/wp-content/uploads/2026/01/SOP-IAS-Provider-Requirements_v2.1_508.pdf
- https://rce.sequoiaproject.org/wp-content/uploads/2025/04/SOP-IAS-Exchange-Purpose-Implementation-v2.1-April-2025_508.pdf
- https://rce.sequoiaproject.org/wp-content/uploads/2026/02/TEFCA-IAS-Proposal-2-pager-DRAFT-5081.pdf
- https://healthit.gov/wp-content/uploads/2025/09/2026AnnualMeeting_TEFCA-from-A-to-Z.pdf
- https://www.federalregister.gov/documents/2024/12/16/2024-29163/health-data-technology-and-interoperability-trusted-exchange-framework-and-common-agreement-tefca
- https://natlawreview.com/article/federal-court-strikes-down-hipaa-fee-limitations-third-party-medical-records
- https://www.nixonpeabody.com/insights/alerts/2020/02/04/ocr-issues-notice-regarding-medical-record-fees
- https://www.federalregister.gov/documents/2021/01/21/2020-27157/proposed-modifications-to-the-hipaa-privacy-rule-to-support-and-remove-barriers-to-coordinated-care
- https://healthit.gov/data/data-briefs/growth-health-it-enabled-patient-engagement-capabilities-among-us-hospitals-2021/
- https://healthit.gov/wp-content/uploads/2025/07/DB68-Hospital-Use-of-APIs-to-Enable-Data-Sharing_508.pdf
- https://healthit.gov/blog/interoperability/checking-in-on-hospital-ehr-apis-can-providers-and-patients-access-and-share-health-data-via-apps/
- https://www.techtarget.com/patientengagement/news/366584778/Digital-Patient-Data-Access-Grows-in-Large-Hospitals-Lags-in-Small-Orgs
- https://healthit.gov/information-blocking/enforcement-alert/
- https://www.hklaw.com/en/insights/publications/2026/02/the-wait-is-over-information-blocking-enforcement-is-officially-here
- https://www.healthcarelawinsights.com/2026/03/hhs-crackdown-on-information-blocking-new-era-of-enforcement-fines-and-compliance-risks-for-healthcare-entities/
- https://www.mcdermottlaw.com/insights/hhs-issues-provider-information-blocking-disincentives-final-rule/
- https://www.expertinstitute.com/resources/insights/medical-evidence-issues-in-personal-injury-trials-admitting-evidence-in-medical-records-to-prove-or-challenge-causation-and-damages/
- https://www.llamalab.ai/blog/medical-records-evidence-authentication-admissibility
- https://www.mlpime.com/medical-record-authentication/
- http://www.nfsesq.com/resources/california-law-admitting-medical-records-at-trial/
- https://www.ssa.gov/blog/en/posts/2026-02-11.html
- https://www.nextgov.com/digital-government/2026/08/social-security-expands-electronic-health-record-sharing-speed-disability-claims-adjudication/415496/
- https://www.govexec.com/technology/2026/08/social-security-expands-electronic-health-record-sharing-speed-disability-claims-adjudication/415501/
- https://www.techtarget.com/searchhealthit/feature/How-EHR-sharing-speeds-up-disability-applications-for-patients
- https://www.fingerlakes1.com/2025/03/28/social-security-disability-health-it-2025
- https://www.healthcareitnews.com/news/some-epic-health-systems-now-connect-ssa-through-tefca
