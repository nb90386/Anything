# 04 — Opportunity Longlist (24 candidates derived from the problem database)

Date: 2026-11-02. Each candidate is derived from specific problem IDs in `02-problem-database.csv`. Fields follow the brief (16 per candidate). Evidence labels: VERIFIED / INFERRED / ASSUMED / UNVALIDATED. Nothing here is validated with real users yet.

Legend for "Strongest reason to reject": the single objection most likely to kill the idea.

---

## C01 — Verified-accessible document engine (PDF/UA remediation at 100x lower cost)
Derived from: HCI-01, HCI-02, HCI-06.
1. **Concept:** Software that converts untagged or scanned PDFs (and web pages) into machine-validated, screen-reader-correct documents automatically, with an audit trail, at a per-page cost two orders of magnitude below manual remediation.
2. **Initial user:** Accessibility/disability-services coordinator at a public college or city that must make its PDF archive compliant with the DOJ ADA Title II web rule (deadline April 26, 2027 for entities over 50k population; April 2028 for smaller ones).
3. **Painful task:** Remediating thousands to millions of legacy PDFs (forms, syllabi, agendas, benefits letters). Today: manual tagging in Acrobat or outsourcing at roughly $3–$25 per page (vendor pricing, INFERRED; to verify), or Acrobat auto-tag whose output fails real screen-reader use.
4. **First product:** Upload PDFs → get PDF/UA-tagged output validated by veraPDF plus a plain-language report of what was inferred (reading order, headings, tables, form-field labels, alt text) and what needs a human decision. Batch mode for archives.
5. **Non-obvious insight:** Accessibility remediation is a verification problem, not a generation problem. Structure can be checked deterministically (veraPDF/PDF-UA rules) and semantics (reading order, alt text) can now be inferred by vision-language models and spot-checked cheaply, so "verified-accessible" becomes a software output rather than a professional service.
6. **Why previous solutions failed:** Auto-tag tools lacked page understanding (wrong reading order, unlabeled fields); overlays do not fix documents; manual services are too expensive to apply to archives, so entities remediate on request only.
7. **Why now:** DOJ Title II rule with fixed 2027/2028 deadlines (extended once in April 2026, not removed); EU Accessibility Act enforcement since June 2025; VLMs can now infer document structure (OmniDocBench-class models, 2025–2026); open PDF libraries can write tag trees.
8. **Why the founder can build it:** Pure software; Python PDF stack (pikepdf, pdfplumber, docling) plus VLM calls; validator is open source; the founder's own community college is a Title II entity with the 2027 deadline, giving a first design partner without institutional gatekeeping.
9. **Value beyond an LLM:** Deterministic validation loop, tag-tree writing, a growing corpus of real documents with human-verified corrections, screen-reader-in-the-loop testing (NVDA is scriptable), and CMS/LMS integrations.
10. **Business model:** Per-page or per-archive pricing for institutions; later seat/API pricing for CMS vendors and enterprises; freemium for individual documents.
11. **First distribution channel:** California Community Colleges (116 colleges, one system with shared procurement and an accessibility center), public-university accessibility listservs, city clerks' associations.
12. **Major technical unknown:** Whether automated output reaches "acceptable to a screen-reader user" on messy real documents (scanned forms, complex tables) at a rate high enough that human review stays small. UNVALIDATED.
13. **Main competitor/substitute:** Adobe Acrobat auto-tag, CommonLook/Allyant, Equidox, axes4, PDFix, Crawford Technologies, remediation service bureaus; overlay vendors (not equivalent).
14. **Potential defensibility:** Verified-correction dataset, validator-plus-screen-reader eval harness, integrations into government/education CMSs, compliance evidence trail institutions must keep.
15. **Expansion path:** Web pages and apps (HCI-06), authoring-time prevention inside CMS/LMS, private-sector Title III and EAA, "accessibility system of record" for every regulated entity.
16. **Strongest reason to reject:** Adobe ships a good-enough AI auto-tag in Acrobat and the per-document market collapses to zero; public-sector buying cycles outlast a solo founder's runway.

## C02 — Below-cost claim detection and appeal engine for independent pharmacies
Derived from: OVL-01.
1. **Concept:** Reconciliation software that matches every pharmacy claim against the public NADAC benchmark and the pharmacy's own wholesaler invoices to flag below-cost reimbursement and generate MAC appeals and state-floor violation evidence automatically.
2. **Initial user:** Owner/pharmacist-in-charge of an independent pharmacy (18–19k US stores per NCPA).
3. **Painful task:** Finding which of thousands of monthly claims paid below acquisition cost and appealing each one; today a spreadsheet exercise after reconciliation, usually abandoned.
4. **First product:** Upload claims export (PMS/835) + wholesaler invoices → ranked list of below-cost claims with dollar exposure, auto-drafted appeals per PBM, and a state-law violation log (Colorado floor effective January 2026 and similar).
5. **Non-obvious insight:** 2026 state acquisition-cost floors and "cost-plus" PBM contracts turn below-cost reimbursement from a lobbying statistic into a per-claim legal claim, and the data to prove it (NADAC, invoices, claims) now sits in the pharmacy's hands.
6. **Why previous solutions failed:** PSAO/reconciliation vendors focus on payment matching, not cost-floor enforcement; appeals were pointless before enforceable floors.
7. **Why now:** NCPA 2025–2026 surveys (96.5% say reimbursement threatens viability); Colorado floor Jan 2026; cost-plus contracts in 2026; invoice OCR now cheap.
8. **Founder feasibility:** Structured data joins plus OCR; NADAC is a weekly public CMS dataset; no institutional access needed to prototype with a single willing pharmacy's exports.
9. **Value beyond an LLM:** Deterministic matching, state-rule engine, appeal outcome data across pharmacies (a dataset no single pharmacy has).
10. **Business model:** Monthly subscription per store (pharmacies already pay for reconciliation) or a share of recovered dollars.
11. **First distribution:** Independent pharmacy owner communities (NCPA, state associations, owner Facebook groups), buying groups/PSAOs as channel partners.
12. **Technical unknown:** Claim-to-invoice NDC matching accuracy and whether appeals actually get paid at a rate that justifies the subscription. UNVALIDATED.
13. **Competitors:** Net-Rx/Inmar, PSAO reconciliation tools, RxReconcile-style vendors, Pharmacy management system add-ons.
14. **Defensibility:** Cross-pharmacy reimbursement dataset useful to regulators and legislatures; workflow lock-in; state-rule coverage.
15. **Expansion:** Pharmacy financial system of record → PBM contract compliance for all pharmacy types → data for policy and litigation.
16. **Reject reason:** PHI handling and HIPAA obligations for a solo minor founder; market size per store is small (~$100–300/month) and PSAOs may bundle the feature.

## C03 — Maintained PDF-form engine and hosted fill/flatten/validate API
Derived from: WLD-07.
1. **Concept:** An open-source TypeScript PDF forms library (the successor to abandoned pdf-lib) plus a hosted API that fills, flattens, and validates official forms (IRS, USCIS, court, insurance) against a conformance suite of real Acrobat-authored forms.
2. **Initial user:** Developer at a legal-tech, immigration, HR, or insurance SaaS who fills government PDF forms programmatically and is currently hacking around pdf-lib's checkbox/radio flattening bug (open since Nov 2023).
3. **Painful task:** Reliable filling and flattening of official forms; today pdf-lib hacks or $10k+/yr Apryse/Foxit licenses.
4. **First product:** npm library with correct AcroForm appearance-stream generation and flattening, plus a hosted "fill this USCIS/IRS form from JSON and verify it renders in Acrobat/Preview/Chrome" API.
5. **Insight:** Official forms are a contract surface between citizens and institutions; agent-driven form filling multiplied demand exactly as the dominant open-source engine was abandoned, and correctness can be proven with a rendering conformance suite nobody has built.
6. **Why previous solutions failed:** pdf-lib maintainer went silent; forks lack a test corpus; commercial SDKs are priced for enterprises.
7. **Why now:** AI agents fill forms at scale; malicious lookalike forks appeared; pdf-lib issue thread shows demand through Oct 2026.
8. **Founder feasibility:** Pure TypeScript; corpus of public forms; Playwright for cross-viewer rendering checks.
9. **Value beyond an LLM:** None of it is an LLM; deterministic PDF engineering plus a conformance suite.
10. **Business model:** Open core; hosted API per form fill; enterprise support.
11. **Distribution:** npm, GitHub issue thread migration, dev communities.
12. **Technical unknown:** Appearance-stream generation fidelity across viewers for the long tail of form constructs. Moderate risk, testable.
13. **Competitors:** Apryse/PDFTron, Foxit, iText, pypdf/PyMuPDF (Python), Anvil, Documint, cantoo fork.
14. **Defensibility:** Conformance corpus, community adoption, becoming the default in agent toolchains.
15. **Expansion:** Form semantics layer for agents (field meaning, validation rules, submission), government-form registry.
16. **Reject reason:** Developer tools with free OSS alternatives in Python monetize slowly; a single strong maintainer fork could satisfy the market without a company.

## C04 — IEEPA tariff refund recovery and customs compliance for small importers
Derived from: MFG-04, MFG-03.
1. **Concept:** Self-serve software that tells a small importer exactly which 2025–2026 entries qualify for IEEPA refunds, assembles the ACH/4811 and CAPE submissions, and then becomes their ongoing classification and entry-compliance tool after the end of de minimis.
2. **Initial user:** Owner/ops lead at an e-commerce brand or small manufacturer that paid IEEPA tariffs and has no customs lawyer.
3. **Painful task:** Recovering refunds (20,362 refunds worth ~$1.1B on hold for missing ACH details as of Oct 2, 2026) and classifying every SKU with 10-digit HTS codes now that sub-$800 shipments need entries.
4. **First product:** Upload ACE entry-summary export → eligibility by phase/liquidation status, dollar estimate, and a generated submission package; follow-up checklist for finally liquidated entries.
5. **Insight:** The refund window is a forcing function that gets thousands of small importers to hand over their entry data once; the durable business is the compliance layer that data enables.
6. **Why previous solutions failed:** Brokers and law firms take contingency fees and prioritize large clients; software vendors (Avalara, Zonos) target checkout duty calculation, not post-entry compliance.
7. **Why now:** Supreme Court ruling Feb 20, 2026; CAPE phases through Oct 2026; de minimis suspended indefinitely June 24, 2026, statutory repeal July 1, 2027.
8. **Founder feasibility:** Rules engine plus document generation; ACE exports are CSV; public CBP guidance.
9. **Value beyond an LLM:** Deterministic eligibility rules, HTS retrieval over CROSS rulings, tariff-stacking engine.
10. **Business model:** Flat fee or small % per refund package; subscription for classification/compliance.
11. **Distribution:** Shopify/e-commerce brand communities, importer forums, accountants.
12. **Technical unknown:** Whether self-filing without a licensed customs broker is permitted for every refund path (customs-business rules, 19 CFR 111). Legal risk, VERIFY FIRST.
13. **Competitors:** Flexport, UPS/FedEx brokerage, trade law firms, Avalara Cross-Border, Zonos, CLA.
14. **Defensibility:** Weak early (rules are public); grows with classification history per SKU and importer data.
15. **Expansion:** Customs compliance OS for the millions of new small filers created by the de minimis repeal.
16. **Reject reason:** Refund window is one-time; classification is crowded; customs-broker licensing may make the product legally fragile for a minor founder.

## C05 — Public-records request triage and redaction for city clerks
Derived from: GOV-06.
1. **Concept:** An AI-assisted workstation for city clerks that finds responsive records across email and document stores, redacts PII, detects bulk/commercial requesters, and tracks statutory deadlines.
2. **Initial user:** City clerk or records coordinator in a 20k–200k-population city (e.g., Manteca, CA: 42 requests in 2016 → 510+ in 2026).
3. **Painful task:** Answering CPRA/FOIA requests within 10 days while one of three clerk employees is consumed by them.
4. **First product:** Connect to the city's email export/Laserfiche folder → responsiveness search, redaction suggestions, request-log analytics, deadline calendar; exports to the existing portal.
5. **Insight:** Request volume is now driven by automated/commercial requesters, which makes requester clustering and reuse of prior responses the highest-leverage step, something portal vendors (built for intake) do not do.
6. **Why previous solutions failed:** Portals solved intake and publishing, not finding and redacting; redaction vendors focus on video; small cities cannot afford Veritone-class tools.
7. **Why now:** Volume up ~10x in some cities in a decade with a 2024–2026 spike; cheap LLM search/redaction; YC's "AI for City Hall" interest signals investor appetite.
8. **Founder feasibility:** Retrieval + classification + PII redaction over email/PDF; Bay Area has hundreds of cities within driving distance.
9. **Value beyond an LLM:** Workflow, audit trail, requester clustering, state-specific exemption rules, portal integrations.
10. **Business model:** Annual subscription per city sized to staff cost saved (small cities buy under procurement thresholds).
11. **Distribution:** City clerk associations (IIMC, CCAC), direct outreach to cities with public budget complaints.
12. **Technical unknown:** Redaction precision/recall on messy email threads sufficient for legal defensibility. UNVALIDATED.
13. **Competitors:** NextRequest (CivicPlus), GovQA (Granicus), JustFOIA, ClerkBase, Veritone Redact, Axon.
14. **Defensibility:** Exemption-rule corpus per state, request-response history per city, integrations.
15. **Expansion:** Clerk's office system of record (agendas, minutes, contracts), then all city back-office workflows.
16. **Reject reason:** Government sales cycles; incumbent portals add AI features; legal liability for a missed redaction.

## C06 — Patient-authorized records retrieval for law firms (FHIR-based)
Derived from: ID-05, HC-06.
1. **Concept:** A service that lets a personal-injury, disability, or elder-law firm obtain a client's complete medical records in hours by having the client authorize patient-access FHIR APIs, with automatic deadline tracking and complaint generation when providers stall.
2. **Initial user:** Paralegal/case manager at a small PI or SSDI firm that currently pays retrieval vendors and waits weeks to months.
3. **Painful task:** Collecting complete records from 5–20 providers per case; today: faxed authorizations, chasing, $30–$100+ per request (INFERRED), 30–90 day waits, OCR settlements show years in extreme cases.
4. **First product:** Client-facing consent flow that links patient portals (SMART on FHIR patient apps), pulls records into a normalized case file, and generates right-of-access demand letters and OCR/ONC complaints at day 30.
5. **Insight:** The law gives patients an API right that the retrieval industry does not use; routing retrieval through the patient converts a 30-day provider obligation into an API call.
6. **Why previous solutions failed:** Retrieval vendors are provider-side (release-of-information outsourcing) with incentives to bill per request; patient apps (Fasten Health) target consumers, not law-firm workflows.
7. **Why now:** FHIR patient-access APIs are mandatory for certified EHRs; ONC info-blocking enforcement escalated in 2026 (2,500+ complaints, notices issued); 55 OCR right-of-access settlements; proposed 15-day access deadline.
8. **Founder feasibility:** Register as a patient-facing SMART app with major EHR vendors (free developer programs); Next.js + Supabase; the founder's earlier medical-billing concept gives partial domain familiarity.
9. **Value beyond an LLM:** Connector coverage, normalization of FHIR resources into case-ready documents, deadline/complaint engine, firm workflow.
10. **Business model:** Per-case or per-provider-pull fee priced below incumbent retrieval vendors; subscription for firms.
11. **Distribution:** Local PI/SSDI firms (founder can walk into Bay Area offices), legal-tech communities, bar association listservs.
12. **Technical unknown:** Coverage: what share of a typical client's providers expose working patient FHIR APIs, and whether EHR vendor app terms allow use in legal retrieval. VERIFY FIRST.
13. **Competitors:** Datavant/Ciox, MRO, Verisma, ChartSwap, Fasten Health (consumer + Connect API), Health Gorilla, 1upHealth, Particle Health.
14. **Defensibility:** Connector coverage and reliability data per provider, firm workflow lock-in, complaint/enforcement outcome data.
15. **Expansion:** Any patient-directed records use case (second opinions, insurance appeals, clinical trials), then a patient-controlled health data network.
16. **Reject reason:** Well-funded health-data API companies already offer this plumbing; EHR app-program terms may prohibit third-party legal use; HIPAA/business-associate exposure for a solo minor.

## C07 — Medicaid coverage-retention engine for safety-net providers
Derived from: HC-05, GOV-01, GOV-02.
1. **Concept:** Software for FQHCs, hospitals, and Medicaid plans that tracks each patient's renewal date and work-requirement reporting obligations, nudges patients multilingually, and assembles their verification documents so eligible people do not lose coverage procedurally.
2. **Initial user:** Enrollment/outreach manager at a Federally Qualified Health Center.
3. **Painful task:** Preventing procedural disenrollment (80–96% of disenrollments during unwinding were procedural) once six-month renewals start Dec 31, 2026 and work requirements Jan 1, 2027.
4. **First product:** Import patient roster → per-patient renewal/reporting calendar from state rules, SMS/voice nudges, document checklist and upload, staff dashboard of at-risk patients.
5. **Insight:** Every procedural disenrollment is lost revenue for the provider and the plan, so the entity with the money to pay is not the recipient but the provider; coverage retention is a revenue-cycle product disguised as a social service.
6. **Why previous solutions failed:** State systems are vendor-locked; recipient apps lack a payer; outreach vendors sold one-time unwinding campaigns.
7. **Why now:** H.R.1 deadlines; CMS June 2026 interim rule; county capacity shortfalls documented on the record; $800M in federal/vendor implementation money.
8. **Founder feasibility:** Rules per state are public; Twilio-class messaging; no state system integration needed for v1.
9. **Value beyond an LLM:** State rule engine, outcome tracking (did coverage survive), document assembly.
10. **Business model:** Per-patient-per-month or per-retained-member fee; later MCO contracts.
11. **Distribution:** Primary care associations (state PCAs), NACHC, Bay Area FQHCs.
12. **Technical unknown:** Whether nudges plus document assembly measurably reduce procedural loss without eligibility-system integration. UNVALIDATED, testable in a pilot.
13. **Competitors:** Propel, mRelief, Benefits Data Trust, Code for America, state vendors, patient-engagement platforms adding redetermination modules.
14. **Defensibility:** Outcome data per state/program, provider workflow, MCO contracts.
15. **Expansion:** "Plaid for government benefits" (YC RFS) once consented verification data flows through the product.
16. **Reject reason:** Sales to FQHCs/MCOs are slow and compliance-heavy for a solo founder; Code for America and state-funded assisters may give this away.

## C08 — Independent outcome verification for browser/computer agents
Derived from: WLD-04, MKT-02, MKT-03, DEV-02.
1. **Concept:** A verification layer that checks what an agent actually did (network calls, DOM state, receipts, side effects) independently of the model's own claim and emits signed evidence, blocking false "done" reports and duplicate actions.
2. **Initial user:** Engineer at a team running browser agents for consequential workflows (orders, filings, records fetching).
3. **Painful task:** Agents report success on blocked pages 3/3 runs, place orders by bypassing disabled buttons, and double-charge on retries.
4. **First product:** SDK/proxy that records the action trace, asserts outcome predicates (order exists, record fetched, no bypass), and produces a tamper-evident run report.
5. **Insight:** Agent reliability is being attacked as a model problem when it is an evidence problem; a trusted third-party record of what happened is what merchants, insurers, and users will require.
6. **Why previous solutions failed:** Frameworks self-grade; evals are offline; no shared evidence format.
7. **Why now:** Browser agents mainstream in 2025–26; first insurance exclusions for AI (ISO, Jan 2026); payment protocols (AP2/ACP) need evidence.
8. **Founder feasibility:** Playwright-level instrumentation, TypeScript SDK.
9. **Value beyond an LLM:** Deterministic predicates, signed traces, integrations.
10. **Business model:** Usage-based per verified run; enterprise.
11. **Distribution:** browser-use/Stagehand communities, GitHub issues already describing the failure.
12. **Technical unknown:** Whether generic predicates generalize beyond a few site types without per-site engineering.
13. **Competitors:** Framework vendors themselves (browser-use, Browserbase), eval tools (Braintrust, LangSmith), insurers' telemetry (AIUC).
14. **Defensibility:** Weak unless it becomes a standard evidence format adopted by payments/insurance.
15. **Expansion:** Evidence standard for all agent actions; insurance underwriting data.
16. **Reject reason:** Platforms absorb verification; demand partly synthetic (agents filing issues about agents); few customers will pay before incidents hurt them.

## C09 — "Orphaned solar" servicing marketplace
Derived from: NRG-02.
1. **Concept:** A registry and matching service connecting homeowners whose installer went bankrupt (~190k systems claimed, INFERRED) with vetted local servicers, using manufacturer monitoring data to detect underperformance.
2. **Initial user:** Homeowner with a dead Freedom Forever/SunPower/Sunnova-installed system.
3. **Painful task:** Finding who will fix the system and whether warranties survive.
4. **First product:** Bankruptcy-docket + CSLB-license lookup, monitoring reconnection guide, quote requests to vetted servicers.
5. **Insight:** Installer failure severed the only link between asset and servicer; the monitoring platforms (Enphase/SolarEdge) hold the data to rebuild it.
6. **Why previous failed:** Lead-gen sites optimize for new installs; manufacturers only cover hardware.
7. **Why now:** Largest installer failures ever in 2024–2026; 25D credit ended, shrinking new-install revenue.
8. **Feasibility:** Marketplace web app; PACER and CSLB data public.
9. **Beyond LLM:** Data matching, trust/vetting.
10. **Model:** Lead fees from servicers; service plans.
11. **Distribution:** r/solar, bankruptcy notices, EnergySage-style SEO.
12. **Unknown:** Whether servicers pay enough per lead; local supply.
13. **Competitors:** EnergySage, Solar Insure, regional "orphan" installers' own marketing.
14. **Defensibility:** Low; two-sided network effects are local.
15. **Expansion:** Home energy asset servicing (batteries, chargers, heat pumps).
16. **Reject:** Lead-gen economics and a shrinking cohort; limited path to a category-defining company.

## C10 — Broker-spoofing and double-brokering shield for owner-operators
Derived from: OVL-03, OVL-02.
1. **Concept:** Rate-confirmation checker that cross-checks broker identity (FMCSA L&I, domain age, phone registry), flags spoofing, and builds detention-pay evidence packets automatically.
2. **Initial user:** Owner-operator booking spot loads.
3. **Painful task:** Avoiding fraudulent brokers (majority hit by fraud per Overdrive) and proving detention.
4. **First product:** Forward a rate con → instant risk score; geofence timestamps → detention invoice.
5. **Insight:** Spoofers impersonate real brokers, so MC-number checks fail; identity must be verified at the channel level (email domain, phone) not the registry level.
6. **Why previous failed:** Vetting tools serve brokers vetting carriers, not carriers vetting brokers.
7. **Why now:** 2026 FMCSA transparency rules; fraud at record highs.
8. **Feasibility:** APIs and parsing; simple app.
9. **Beyond LLM:** Data fusion and fraud signal network.
10. **Model:** Low monthly subscription; factoring-company channel.
11. **Distribution:** TruckersReport, OOIDA, YouTube trucking channels.
12. **Unknown:** Will owner-operators pay; signal quality without network scale.
13. **Competitors:** CheckMyBroker.ai, Highway, Carrier Assure, factoring companies' credit checks.
14. **Defensibility:** Fraud-report network effects if adopted widely.
15. **Expansion:** Carrier back office.
16. **Reject:** Weak payer, existing point tools, and factoring companies already bundle vetting.

## C11 — Prediction-market execution-quality and resolution-risk monitor
Derived from: MKT-06.
1. **Concept:** Independent data service measuring settlement reverts, fill quality, and oracle/resolution risk across Polymarket and Kalshi for traders and researchers.
2. **Initial user:** Algorithmic trader (the founder's existing paper-trading tool's audience).
3. **Painful task:** ~35% of matched buys reverting after the April 2026 V2 cutover with no recourse; opaque resolution.
4. **First product:** Public dashboards + API on revert rates, UMA voter concentration per dispute, rule-ambiguity scoring.
5. **Insight:** Market-structure quality, not strategy, is the unpriced risk in prediction markets.
6. **Why previous failed:** Dashboards focus on volume/odds, not execution.
7. **Why now:** 2026 volume boom, exploits, investigations, V2 migration.
8. **Feasibility:** On-chain data, founder already has ingestion code.
9. **Beyond LLM:** Pure data engineering.
10. **Model:** API subscriptions; data licensing.
11. **Distribution:** Trader Discords, X.
12. **Unknown:** Paying user count; platform API terms.
13. **Competitors:** Dune dashboards, Alphascope-style blogs, platforms' own tooling.
14. **Defensibility:** Historical dataset.
15. **Expansion:** Market-integrity data for regulators and institutions.
16. **Reject:** Small paying base; platforms can publish the same data; regulatory volatility.

## C12 — AS9102 first-article inspection automation via drawing ballooning
Derived from: MFG-05.
1. **Concept:** Vision-model ballooning of PDF/DXF drawings to auto-populate AS9102 Forms 1–3 and flag missing sub-tier certs against each prime's checklist.
2. **Initial user:** Quality manager at a 10–100-person aerospace machining supplier.
3. **Painful task:** 8–24+ hours per complex FAIR; weeks lost to missing paperwork.
4. **First product:** Upload drawing + certs → ballooned drawing, prefilled forms, missing-document list per prime (Lockheed SQAG 001 Issue 6, etc.).
5. **Insight:** The FAIR is a document-understanding problem gated by prime-specific checklists that are public but unencoded.
6. **Why previous failed:** Incumbents (InspectionXpert) balloon with OCR rules, not drawing understanding; checklists live in PDFs.
7. **Why now:** VLMs read GD&T reliably enough (2025–26); defense ramp increases new-part FAIRs.
8. **Feasibility:** VLM + PDF tooling; sample drawings public.
9. **Beyond LLM:** Prime-checklist rule engine, form generation.
10. **Model:** Per-seat subscription.
11. **Distribution:** NTMA, Practical Machinist, local shops.
12. **Unknown:** Ballooning accuracy on dense drawings; shop willingness to trust.
13. **Competitors:** InspectionXpert (Ideagen), High QA, DISCUS, Net-Inspect.
14. **Defensibility:** Prime-rule corpus, drawing dataset.
15. **Expansion:** Quality documentation OS for small suppliers (PPAP, CMMC evidence).
16. **Reject:** Niche TAM; incumbents adding AI; ITAR data-handling constraints on a solo founder's infrastructure.

## C13 — CRA vulnerability-reporting autopilot for small software vendors
Derived from: DEV-06.
1. **Concept:** Lightweight vulnerability intake, SBOM matching, and automated 24h/72h EU CRA notification drafting for micro/small vendors.
2. **Initial user:** Founder/CTO of a small SaaS or device firm selling into the EU.
3. **Painful task:** Meeting reporting duties live since Sept 11, 2026 without a security team.
4. **First product:** Product registry + SBOM upload + CVE/KEV watch + report generator.
5. **Insight:** The reporting duty is a workflow, not a security program; most vendors need an autopilot, not a consultant.
6. **Why previous failed:** Readiness vendors sell checklists; SBOM tools stop at generation.
7. **Why now:** Reporting live Sept 2026; full obligations Dec 2027.
8. **Feasibility:** GitHub integration, public vuln feeds.
9. **Beyond LLM:** Deterministic matching, deadline engine.
10. **Model:** Subscription.
11. **Distribution:** Indie hacker and OSS maintainer communities.
12. **Unknown:** Whether small vendors act before enforcement.
13. **Competitors:** cybercertlabs, continueops, themio; Vanta/Drata adding CRA.
14. **Defensibility:** Low.
15. **Expansion:** Compliance suite.
16. **Reject:** Compliance SaaS is crowded and enforcement-driven; small vendors ignore until fined.

## C14 — ADU/housing permit pre-check and shot-clock tracker (California)
Derived from: GOV-04.
1. **Concept:** Pre-submission code-compliance check of ADU plan sets and a shot-clock tracker that documents deemed-complete/deemed-approved timelines under SB 543/AB 253.
2. **Initial user:** ADU designer or homeowner-applicant; secondarily city plan checkers.
3. **Painful task:** 3–12 month real timelines vs 60-day statutory windows; correction cycles.
4. **First product:** Upload plans → checklist findings per city standard; timeline evidence log.
5. **Insight:** The 2026 laws convert city delay into applicant rights, but only if the applicant can prove the clock; the proof is the product.
6. **Why previous failed:** Permit software serves cities; applicants had no leverage before shot clocks.
7. **Why now:** Laws effective Jan 1, 2026; housing package 2025–26.
8. **Feasibility:** VLM on plan sets; public checklists.
9. **Beyond LLM:** City-rule corpus, timeline engine.
10. **Model:** Per-project fee from designers.
11. **Distribution:** ADU designers/builders in the Bay Area.
12. **Unknown:** Plan-check accuracy; legal weight of the timeline log.
13. **Competitors:** Symbium, PermitFlow, outsourced plan-check firms, Accela/Tyler.
14. **Defensibility:** City-rule corpus.
15. **Expansion:** All residential permits; city-side product.
16. **Reject:** Symbium already does code-compliance for ADUs in CA; per-project revenue is small.

## C15 — Inbound triage and reproduction sandbox for open-source maintainers
Derived from: DEV-01, SCI-06.
1. **Concept:** A bot that classifies inbound PRs/issues/vulnerability reports, attempts to reproduce claims in a sandbox, and surfaces only verified items to maintainers.
2. **Initial user:** Maintainer of a popular project drowning in AI-generated reports (curl: 13 reports in one Saturday).
3. **Painful task:** Separating real bugs from slop (~25% of PRs).
4. **First product:** GitHub App: reproduction attempt + evidence summary + triage label.
5. **Insight:** Slop is cheap to generate but expensive to disprove; automated reproduction inverts the cost.
6. **Why previous failed:** Review bots add text; HackerOne triage is paid and human.
7. **Why now:** LF/OpenSSF quantified it Oct 30, 2026; curl changed policy twice in 2026.
8. **Feasibility:** GitHub Apps, sandboxes.
9. **Beyond LLM:** Reproduction harness.
10. **Model:** Sponsors/foundations; enterprise OSPOs.
11. **Distribution:** Maintainer communities.
12. **Unknown:** Reproduction success rate across ecosystems.
13. **Competitors:** GitHub itself, CodeRabbit, HackerOne, Socket.
14. **Defensibility:** Low; GitHub can ship it.
15. **Expansion:** Enterprise inbound security triage.
16. **Reject:** Payer is weak (unpaid maintainers) and GitHub is the natural owner.

## C16 — Credit-report dispute evidence engine
Derived from: FIN-01, ID-04.
1. **Concept:** Consumer tool that builds evidence-attached FCRA disputes with certified-mail tracking and escalation packaging to CFPB/state AG/attorneys.
2. **Initial user:** Consumer with a mixed file or identity-theft tradeline.
3. **Painful task:** Disputes closed as "verified" without investigation; 5.8M complaints in 2025.
4. **First product:** Guided dispute builder + timeline + escalation.
5. **Insight:** The bureaus' process is adversarial by design; an evidence trail is the only lever that changes outcomes.
6. **Why previous failed:** Credit repair orgs are regulated (CROA) and often abusive; templates lack tracking.
7. **Why now:** Complaint channel degraded; FCRA litigation at 10-year high.
8. **Feasibility:** Document generation, mail APIs.
9. **Beyond LLM:** Timeline and legal-rule engine.
10. **Model:** Per-dispute fee or attorney referral.
11. **Distribution:** Reddit personal finance, SEO.
12. **Unknown:** CROA applicability to a software tool.
13. **Competitors:** Lexington Law-style CROs, DIY templates, FCRA plaintiff firms.
14. **Defensibility:** Outcome dataset.
15. **Expansion:** Consumer rights enforcement platform.
16. **Reject:** CROA/legal exposure; consumer willingness to pay; crowded with low-trust vendors.

## C17 — Medical bill error detection and dispute (founder's "Second Opinion" lineage)
Derived from: FIN-03, HC-03.
1. **Concept:** Parse itemized bills and EOBs, cross-check against price-transparency and Medicare files, flag errors, generate disputes and collector cease letters.
2. **Initial user:** Patient with a disputed hospital bill.
3. **Painful task:** Year-long disputes; bills sold to collections mid-dispute; CFPB credit-reporting shield vacated July 2025.
4. **First product:** Upload bill + EOB → error report + dispute letters.
5. **Insight:** Hospital machine-readable price files make bill auditing a data problem for the first time.
6. **Why previous failed:** Advocates are manual and expensive; negotiation services take a cut.
7. **Why now:** Price-transparency enforcement; CFPB retreat.
8. **Feasibility:** OCR + code lookup; founder has prior work.
9. **Beyond LLM:** Pricing datasets, dispute engine.
10. **Model:** % of savings or flat fee.
11. **Distribution:** Reddit, SEO, employers.
12. **Unknown:** Error detection precision; willingness to pay.
13. **Competitors:** Goodbill, Resolve, patient advocates, ChatGPT.
14. **Defensibility:** Outcome dataset.
15. **Expansion:** Consumer healthcare financial advocate.
16. **Reject:** Consumer acquisition cost; many free substitutes; ChatGPT handles the easy cases.

## C18 — Transfer-credit pre-check for community college students
Derived from: EDU-01.
1. **Concept:** A planner that tells a community college student exactly which courses will count toward a target major at target universities, using scraped ASSIST/articulation tables and syllabus matching.
2. **Initial user:** The founder's own peers at Bay Area community colleges.
3. **Painful task:** Losing ~43% of credits on transfer (GAO); agreement-year mismatches.
4. **First product:** Degree-path checker with year-specific agreements and warnings.
5. **Insight:** Articulation data is public but fragmented by year and department, which is why students and counselors both get it wrong.
6. **Why previous failed:** Transferology/ASSIST are lookup tools, not planners; counselors are overloaded.
7. **Why now:** State transfer mandates; AI parsing of syllabi.
8. **Feasibility:** Scraping + rules; founder is the user.
9. **Beyond LLM:** Articulation graph.
10. **Model:** Colleges pay per seat; students freemium.
11. **Distribution:** Founder's campus; CCC system.
12. **Unknown:** Will colleges pay; data licensing.
13. **Competitors:** ASSIST, Transferology, Edvisorly, Transfermatic.
14. **Defensibility:** Low.
15. **Expansion:** Student success platform.
16. **Reject:** Weak payer; incumbents; state systems may build it.

## C19 — IEP drafting and compliance assistant from assessment reports
Derived from: EDU-03.
1. **Concept:** Structured extraction from assessment reports into present levels, goals, and progress reports with timeline tracking.
2. **Initial user:** Special-education case manager.
3. **Painful task:** 10–20 unpaid hours/week on paperwork.
4. **First product:** Report → draft IEP sections + compliance calendar.
5. **Insight:** The data already exists in reports; drafting is re-keying.
6. **Why previous failed:** IEP systems are forms, not understanding.
7. **Why now:** Teachers already use LLMs ad hoc; vacancies near 70% of schools.
8. **Feasibility:** Document extraction.
9. **Beyond LLM:** Compliance rules per state.
10. **Model:** District subscription.
11. **Distribution:** Teacher communities; districts.
12. **Unknown:** FERPA/data handling; quality liability.
13. **Competitors:** Magic School, Brisk, Frontline IEP, PowerSchool.
14. **Defensibility:** Low.
15. **Expansion:** Special-ed OS.
16. **Reject:** Crowded; district procurement; FERPA liability for a minor founder.

## C20 — Green Button conformance scoreboard and connector layer
Derived from: NRG-04, NRG-08, NRG-07.
1. **Concept:** Continuously tested utility data connectors plus a public conformance scoreboard.
2. **Initial user:** Developer of a home-energy or rate-optimization app.
3. **Painful task:** Per-utility scrapers; broken OAuth; silent data stops.
4. **First product:** Scoreboard + open connectors + hosted normalized API.
5. **Insight:** Standardization failed in practice; a tested compatibility layer is the standard.
6. **Why previous failed:** Aggregators are expensive and opaque.
7. **Why now:** VPP/rate tools proliferating.
8. **Feasibility:** Scrapers and OAuth; Playwright.
9. **Beyond LLM:** Connector maintenance.
10. **Model:** API usage fees.
11. **Distribution:** Home Assistant and energy dev communities.
12. **Unknown:** Utility terms-of-service risk.
13. **Competitors:** UtilityAPI, Arcadia, Bayou Energy (YC).
14. **Defensibility:** Connector coverage.
15. **Expansion:** Energy data network.
16. **Reject:** Bayou/UtilityAPI already do this with funding; ToS risk.

## C21 — Local-first domain speech recognition (medical/legal) with lexicon correction
Derived from: WLD-03.
1. **Concept:** On-device transcription with constrained decoding against RxNorm/CPT/court lexicons for practices that cannot send audio to the cloud.
2. **Initial user:** Small clinic or law office with privacy constraints.
3. **Painful task:** 63% WER on medical sets for Whisper-small; Dragon too expensive.
4. **First product:** Mac app with lexicon-aware correction.
5. **Insight:** Errors concentrate in names/terms, which are enumerable.
6. **Why previous failed:** Prompt biasing only affects the first 30s.
7. **Why now:** Open-weight ASR improved; privacy pressure.
8. **Feasibility:** Python/ML on a Mac.
9. **Beyond LLM:** Lexicons, decoding constraints.
10. **Model:** Per-seat.
11. **Distribution:** Local practices.
12. **Unknown:** Accuracy gains achievable.
13. **Competitors:** Nuance Dragon, Abridge, Deepgram custom vocab, whisper forks.
14. **Defensibility:** Low.
15. **Expansion:** Local scribe.
16. **Reject:** AI scribes are a heavily funded category; local-only is a niche.

## C22 — Child-care subsidy attendance and claims accuracy tool
Derived from: OVL-05.
1. **Concept:** Attendance capture with parent signatures that generates error-free state subsidy invoices and tracks payment status.
2. **Initial user:** Family child care provider accepting CCDF children.
3. **Painful task:** Weeks of payment delay; clawbacks for missing signatures.
4. **First product:** Sign-in app + invoice generator + payment tracker.
5. **Insight:** Clawbacks are documentation failures, not fraud.
6. **Why previous failed:** Center software ignores subsidy rules per state.
7. **Why now:** 2026 state system migrations; audits.
8. **Feasibility:** Mobile web app.
9. **Beyond LLM:** State rules.
10. **Model:** Low monthly fee.
11. **Distribution:** Provider networks.
12. **Unknown:** Willingness to pay at tiny margins.
13. **Competitors:** Brightwheel, Procare, Playground, Wonderschool.
14. **Defensibility:** Low.
15. **Expansion:** Provider back office.
16. **Reject:** Incumbents cover it; tiny budgets.

## C23 — Agent-safe workspace: snapshot-and-scoped-credential runtime for coding agents
Derived from: DEV-02, DEV-07, DEV-03.
1. **Concept:** A local runtime that snapshots the filesystem before each agent run, issues short-lived scoped credentials, and enforces call/cost budgets across Claude Code, Cursor, and Codex.
2. **Initial user:** Solo developer running agents in auto mode.
3. **Painful task:** Agents deleting home directories; 19,099 Read calls burning a week's quota.
4. **First product:** CLI wrapper with snapshots, credential proxy, budget kill switch.
5. **Insight:** Safety belongs at the OS/credential layer, not in per-call permission prompts.
6. **Why previous failed:** Vendors ship prompts, not containment.
7. **Why now:** Unattended agent modes shipped in 2026.
8. **Feasibility:** Systems programming on Mac/Linux.
9. **Beyond LLM:** Containment engineering.
10. **Model:** Prosumer subscription; team plans.
11. **Distribution:** GitHub issues where victims gather.
12. **Unknown:** Cross-platform snapshotting complexity.
13. **Competitors:** Anthropic/Cursor sandboxes, Docker, E2B, Daytona, 1Password.
14. **Defensibility:** Low; vendors will absorb.
15. **Expansion:** Agent security platform.
16. **Reject:** The vendors own the surface and are shipping fixes monthly.

## C24 — Citation-integrity gate for journals and preprint servers
Derived from: SCI-01.
1. **Concept:** Editorial-workflow plugin that verifies every reference's existence and claim support before peer review.
2. **Initial user:** Managing editor at a mid-size journal.
3. **Painful task:** 1 in 277 PubMed papers now carry fabricated references.
4. **First product:** Manuscript upload → reference audit report.
5. **Insight:** The check is commoditized (235 repos); the product is workflow integration and liability cover.
6. **Why previous failed:** DIY tools do not plug into Editorial Manager/ScholarOne.
7. **Why now:** 2026 audits; publisher integrity hubs.
8. **Feasibility:** Crossref/OpenAlex APIs.
9. **Beyond LLM:** Workflow integration.
10. **Model:** Per-manuscript fee.
11. **Distribution:** Editors' societies.
12. **Unknown:** Publisher procurement.
13. **Competitors:** STM Integrity Hub tools, Clear Skies, citegate/bibverify OSS.
14. **Defensibility:** Low.
15. **Expansion:** Research integrity platform.
16. **Reject:** Commoditized check; publishers build in-house.

---

## Candidates considered and not listed (dedup/weak)
GLP-1 coverage checker (HC-08, vendor-covered), drug-shortage watch (HC-07, Vizient/Premier), credentialing checker (HC-04, Medallion/Verifiable), WISeR tracker (HC-02, six states only), SAM.gov pre-check (GOV-08, weak evidence), UI claimant tools (GOV-07, weak payer), OPT tracker (EDU-04, weak payer), ESL waitlists (EDU-05, not software-shaped), substitute matching (EDU-06, incumbents), absenteeism outreach (EDU-07, weak), apprenticeship RAPIDS (EDU-08, no API), IRS identity-theft tracker (FIN-04, weak payer), estate executor workflow (FIN-06, EstateExec/Atticus), home-insurance appeals (FIN-07, weak evidence), subscription cancellation (FIN-02, Rocket Money), age-verification for small sites (ID-01, standards unsettled), KYC injection defense (ID-02, needs device attestation partnerships), data-broker deletion verification (ID-03, DeleteMe/Optery), deepfake payment approvals (ID-06, Trustmi/Nudge), synthetic identity (ID-07, needs consortium data), agent-mandate verification for merchants (ID-08, no demand yet), MCP server scanning (DEV-05, Invariant/Snyk), npm worm defenses (DEV-04, Socket/StepSecurity), flaky CI (DEV-08, Trunk), job-shop RFQ quoting (MFG-01, Paperless Parts + many AI entrants), CMMC (MFG-02, policy limbo and enclave costs), ITAR (MFG-07), QMSR (MFG-08), pay-app pre-check (MFG-06, Siteline), agent-merchant attribution (MKT-01, Cloudflare/Visa), x402 escrow (MKT-04, speculative), AI-crawler billing (MKT-05, Cloudflare), AI liability telemetry (MKT-07, insurers), gig deactivation appeals (MKT-08, weak payer), PTO tracker (NRG-01, narrow), rebate churn tracker (NRG-03, Rewiring America), data-center queue map (NRG-05, informational only), EV charger success monitor (NRG-06, ChargerHelp/Paren), LL97 path alerts (NRG-07, LLDesk), EVV pre-check (OVL-04, weak evidence), H-2A tracker (OVL-06), SGMA for small farms (OVL-07, nonprofit-funded), death-certificate signing (OVL-08, procurement-gated), grant-velocity tracker (SCI-02, Grant Witness), freezer inventory (SCI-03, many), ELN bench capture (SCI-04, incumbents), SR screening (SCI-05, Covidence/ASReview), trial recruitment (SCI-07, institutional), DMS compliance (SCI-08, wrapper), bank-sync layer (WLD-01, low margin), fax-to-PA (WLD-02, crowded), handwriting/table extraction (WLD-05/06, crowded), agent context handoff (WLD-08, vendors absorb), local tool-calling (HCI-03, vendors absorb), personal browser automation (HCI-04, anti-bot arms race), digital legacy (HCI-05, platforms), caregiver delegation (HCI-07, weak evidence).
