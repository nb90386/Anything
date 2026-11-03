# C02 — Below-cost claim detection and MAC-appeal engine for independent pharmacies: competitive analysis

Retrieval date: 2026-11-02. Method: ~16 web searches; vendor sites only where surfaced in results. Items marked [unverified] were not confirmed by a retrieved source. No prices or funding figures are stated unless they appeared in a result.

## 1. Verdict (short)

**Maybe, leaning no.** The core workflow (claims x wholesaler invoices x benchmark -> flag -> appeal) is already shipped by the three wholesaler-owned PSAOs, by Inmar (self-described largest third-party reconciliation provider), and by at least one $199/mo startup (RxDelta). The regulatory tailwind (state NADAC floors, the FTC/Express Scripts cost-plus settlement) is real and growing, but the historical payoff of MAC appeals is poor (OptumRx NY: ~10% granted; Mississippi audit: >98% denied), and the PSAOs that already hold the pharmacy's contract and claim feed are the natural owners of a "floor-law violation" module. A wedge exists only as a vendor-neutral, state-law-aware compliance/evidence layer, and only if appeals under 2026 floor laws actually pay.

## 2. Direct competitors

| Vendor | What it demonstrably does | Target / distribution | Pricing (public) | Maturity | Notes |
|---|---|---|---|---|---|
| **Inmar Intelligence / Net-Rx** (inmar.com, net-rx.com) | Automated claims reconciliation; separate "MAC appeals" product listed in a 2024 Inmar webinar deck for the Value Added Network; claims 50% write-off reduction. Net-Rx "RecRx" reconciliation; CMS-certified TPSE in the Medicare Transaction Facilitator Data Module. Inmar calls itself the largest third-party pharmacy reconciliation provider in the US; Sept 2025 Premier GPO agreement. | Chains, independents via PSAO/GPO/PBA Health partnerships | Not public | Mature, large | Strength: scale, 835/claim feeds, PBM relationships. Weakness: chain-oriented; no evidence of state-floor-law tracking. G2 listing exists; no complaint detail surfaced. |
| **Health Mart Atlas (McKesson PSAO)** | "MAC Success Manager" analyzes claims and average acquisition costs to identify and appeal below-cost claims; central pay, reconciliation. | Health Mart / McKesson independents | Bundled in PSAO | Mature (2018 JV) | Owns contract + claim feed; free to member. |
| **Cardinal Health PSAO** | "Automated MAC Advantage" automatically submits underpaid MAC claims to PBMs. | Cardinal independents | Bundled | Mature | Same structural advantage. |
| **EPIC Pharmacy Network (PSAO)** | Proprietary "RxRegulator" reconciliation tool, escrow reconciliation accounts. | EPIC members | Bundled | Mature | |
| **AAP (Cencora-affiliated PSAO)** | No current product detail surfaced [unverified]. | | | | |
| **RxDelta** (rx-delta.com) | Matches billing exports vs wholesaler invoices line-by-line by NDC/package; flags NDC swaps, shortages, PBM underpayments; integrations listed for PioneerRx, Liberty, Rx30, Computer-Rx, BestRx, QS/1, PrimeRx, Pharmaserv, CSV. Self-reports 50+ pharmacies, $2.4M recovered. | Independents, direct web sales | $199/mo (Data Access), $399/mo, $799/mo (Managed Reporting); annual $2,028 | Early-stage startup | Closest analogue; not NADAC- or state-law-focused per site. Savings claims unverified. |
| **NADAC Lookup** (nadaclookup.com) | Free NDC/NADAC lookup; paid tier flags below-cost payment before submission. | Independents | $29/mo | Micro-tool | Shows the benchmark-check piece is near-free. |
| **Outcomes** (outcomes.com/reconciliation) | Flat-monthly-fee reconciliation service with account manager, tracks unpaid claims; no software install. | Independents | Flat fee, amount not public | Mature | Ownership relationship to Cardinal [unverified]. |
| **PMS vendors** | PioneerRx: native 835 third-party reconciliation (overnight pull, accounting specialists). Rx30/Computer-Rx (TDS): "Electronic Reconciliation" module / TDS Reconciliation service. Liberty: third-party reconciliation, DIR fee management, AWP reclaim (aggregator-stated). BestRx: no module found [unverified]. Datascan: DIR estimator. | Installed base of every independent | Bundled/add-on | Mature | Already hold claims data; invoice ingestion via EDI 810 is common. |
| **EnlivenHealth/Omnicell, Amplicare, PrescribeWellness, PharmaComplete, RxReconcile** | Not surfaced in any result for MAC appeals or reconciliation [unverified]; treat as adjacent (clinical/engagement) or defunct. | | | | |

Nothing resembling a 2025-26 venture-backed "below-cost + appeal + state-law" startup surfaced; RxDelta is the only startup-shaped entrant.

## 3. Substitutes

- **PSAO services** (filing appeals, reconciliation, audit help) are explicitly listed as standard PSAO functions in state testimony; most independents already belong to one.
- **Manual appeals** via PBM portals with templates (OptumRx MAC Appeal Submission Template, column K acquisition cost; ProCare Rx MAC Price Review tool). TrueScripts and other PBMs publish appeal processes.
- **PMS reconciliation modules**, **CPAs** (e.g., Sykes CPA third-party reconciliation), outsourced billing staff (~$1,650/mo per resource per Staffingly).
- **Law firms** (Frier Levitt) sell state-law enforcement/complaint services; state regulators (WV OIC, MS Board of Pharmacy, TN DCI) are increasingly doing audits themselves.

## 4. Pricing benchmarks

- RxDelta $199-$799/store/mo; NADAC Lookup $29/mo; general independent software guides cite $100-$500/mo or $399-$899/mo per store. Inmar/Net-Rx/PSAO pricing not public (often bundled or % of recoveries [unverified]). Implies a ceiling around $200-400/store/mo for a standalone tool; at 18-19k stores and realistic 3-5% penetration, that is a ~$2-4M ARR niche unless pricing is success-based.

## 5. Legal / structural facts (2026)

- **Colorado HB25-1222**: commercial floor for independents (NADAC + Medicaid dispensing fee, cited $14.14, +1%/yr); NCPA says effective Jan 1, 2026; AMCP inventory lists a Jan 1, 2027 minimum-reimbursement date (conflict, possibly a separate provision) [unverified which].
- **West Virginia**: NADAC floor + $10.49 dispensing fee; structured MAC appeal process; aggressive OIC enforcement.
- **Kansas SB 360**: NADAC + >= $10.50 dispensing fee.
- **Arkansas Act 900** (2015, upheld in Rutledge v. PCMA 2020): reimburse at/above acquisition cost, appeal process, right to refuse to dispense; actively enforced.
- **Mississippi § 73-21-156**: appeal right for MAC below acquisition cost; PBM must name a wholesaler with stock below MAC on denial.
- **Pending/uncertain**: New Jersey A1502 (NADAC + $10.92, passed Assembly), Louisiana HB 1236, Arizona bills, South Carolina (floor stripped), Oklahoma SB 2074 (veto not overridden), New York S5939. A 2020-era source says 36 states have Act-900-style MAC laws [dated]. Tennessee, Alabama, Kentucky specifics not retrieved [unverified].
- **Cost-plus contracts**: FTC/Express Scripts settlement finalized Feb 4, 2026 requires ESI to pay independents (<=3 stores) actual acquisition cost + professional dispensing fee in commercial plans by 2027 or sooner; contracts arrived by fax as opt-out in spring 2026 (NCPA). Key friction: PBM demands for confidential wholesaler invoices to verify dead-net cost; if not provided, fallback to lowest of NADAC/PAC/WAC (Frier Levitt). CVS CostVantage: cost + markup + dispensing fee, varies by payer; commercial contracting began 2025. ESI ClearNetwork uses lowest of PAC/NADAC/WAC + <=15% markup. So the 2026 regime creates a **document-submission burden** (invoices) that a tool could manage, but also hands the PBM the pharmacy's invoice data, which NCPA/Drug Topics flag as a risk.
- **Data access**: Claims and 835s contain PHI; a third-party tool ingesting them is a HIPAA business associate and needs a BAA with each pharmacy (general regulatory knowledge, not retrieved). Wholesaler invoices are contractually confidential; PSAO/wholesaler-owned tools get them natively, a standalone vendor needs pharmacy-side export/EDI 810 feeds.

## 6. Do MAC appeals pay?

- OptumRx, New York Senate report: of ~673,688 appeals since March 2016, ~10.2% got a rate change (4.4% in 2017, 14.8% in 2018).
- Mississippi Board of Pharmacy audit of Optum 2022 claims: 3,144 appeals, >98% denied, mostly for missing acquisition-cost documentation; 401 denied on "MAC accurate" grounds alleged to violate state law. Outcome of the Dec 2024 hearing not retrieved.
- Tennessee DCI audit of Caremark (as of 12/31/2024): 27.9% of denied appeal files had compliance problems; 15.4% of approved appeals were never reversed-and-rebilled by the pharmacy.
- Drug Topics/NCPA 2026: underpayment persists even as cost-plus arrives.
- Implication: historical appeal yield is ~10%; the dominant denial reason (missing invoice documentation) is exactly what the product automates, and state audits show PBM process errors a tool could evidence. Whether 2026 floor laws raise the yield is unproven.

## 7. Could a PSAO or PMS vendor ship this in a quarter?

Yes. PSAOs (Health Mart Atlas, Cardinal, EPIC) already auto-identify and file below-cost appeals and hold claims + central-pay data; adding a NADAC/state-floor rule set is a configuration change. PioneerRx/Rx30/Liberty already ingest 835s and invoices. Inmar already sells "MAC appeals" as a SKU. If they ship, the standalone's remaining value is neutrality (not wholesaler-owned), multi-PBM/state law coverage, and evidence packaging for regulators and law firms, a consulting-sized market.

## 8. Shutdowns / consolidation

No confirmed shutdowns of MAC-appeal tools surfaced. Inmar divested returns businesses (not reconciliation). PSAO consolidation (McKesson/APNS -> Health Mart Atlas, 2018) concentrates the channel. Amplicare/EnlivenHealth/PharmaComplete/RxReconcile status unverified.

## 9. Kill-evidence summary

1. Appeal yield ~10% historically; >98% denied in MS audit.
2. Wholesaler PSAOs already run automated below-cost appeal programs for free to members.
3. RxDelta already sells the invoice-matching layer at $199/mo; NADAC flagging at $29/mo.
4. Cost-plus contracts route invoice verification to the PBM, bypassing third-party appeal logic.
5. Market cap ~18-19k stores x sub-$400/mo.

Most important unknown: realized payout rate of appeals/complaints under 2026 floor laws (CO, WV, KS) and ESI cost-plus — if state enforcement makes appeals pay, a neutral evidence engine becomes valuable; if not, this is a feature.

## Sources (retrieved 2026-11-02)

- https://mbp.ms.gov/sites/default/files/inline-images/Optum.Release.pdf
- https://ncpa.org/newsroom/qam/2024/10/17/optum-flouted-mississippi-law-says-states-board-pharmacy
- https://mississippitoday.org/2024/11/07/optum-audit-shows-possible-law-violation/
- https://professionals.optumrx.com/resources/manuals-guides/appeals-submission-guide.html
- https://www.nysenate.gov/sites/default/files/article/attachment/final_investigatory_report_pharmacy_benefit_managers_in_new_york.pdf
- https://www.tn.gov/content/dam/tn/commerce/documents/insurance/pbm/pbm-audit-actions/CaremarkReportAuditPackage_20260212.pdf
- https://ipcrx.com/wp-content/uploads/2024/09/08.24.24-VAN-Inmar-Webinar-Slides.pdf
- https://www.g2.com/products/inmar-intelligence-pharmacy-solutions/reviews
- https://www.inmar.com/blog/press/inmar-intelligence-awarded-pharmacy-claims-reconciliation-and-dscsa-compliance
- https://net-rx.com/products/recrx/
- https://www.inmar.com/redirects/returns
- https://www.pbahealth.com/resources/inmar/
- https://rx-delta.com/pricing
- https://rx-delta.com/integrations
- https://rx-delta.com/compare/automated-vs-manual-pharmacy-reconciliation
- https://nadaclookup.com/
- https://www.outcomes.com/reconciliation
- https://www.sykes-cpa.com/third-party-reconciliation-for-independent-pharmacies/
- https://staffingly.com/enterprises/services/specialty-ltc-pharmacy-outsourcing/pharmacy-billing/
- https://www.medsoftwares.com/news/pharmacy-software-cost-pricing-guide-2026
- https://tridentinfo.com/best-pharmacy-management-software-in-2026-complete-comparison-pricing-guide/
- https://www.computertalk.com/health-mart-atlas/
- https://www.cardinalhealth.com/en/services/retail-pharmacy/business-solutions/psao-services.html
- https://www.epicrx.com/differentiating-between-psaos-and-pbms-2/
- https://mgaleg.maryland.gov/cmte_testimony/2020/hgo/3203_02272020_92455-887.pdf
- https://www.drugchannels.net/2018/04/mckesson-leads-another-round-of-psao.html
- https://www.pioneerrx.com/blog/featured-feature-third-party-reconciliation
- https://www.rx30.com/interfaces-modules/electronic-reconciliation/
- https://rxinsider.com/market-buzz/transaction-data-systems-(tds)-delivers-smarter-approach-to-claim-reconciliation/655
- https://www.rfp.wiki/specialty-industries/healthcare-life-sciences/healthcare/pharmacy-management-software/pioneerrx/liberty-software
- https://datascanpharmacy.com/what-are-dir-fees-why-do-they-exist-and-what-can-we-do-about-them/
- https://www.truescripts.com/pharmacy-reimbursement-appeal-process
- https://apps.procarerx.com/MCRxDocuments/MAC%20Price%20Review%20Application%20Tool%20-%20Users%20Guide.pdf
- https://www.frierlevitt.com/?p=10540
- https://www.ncpa.org/newsroom/qam/2025/06/02/colorado-targets-support-independents
- https://inthestates.nacds.org/colorado-50-05162025
- https://www.amcp.org/sites/default/files/2026-05/2026-COLORADO-PBM-Reform-Inventory.pdf
- https://open.pluralpolicy.com/co/bills/2025A/HB25-1094
- https://www.frierlevitt.com/articles/2026-state-pbm-reform-nadac-reimbursement-spread-pricing-bans/
- https://www.frierlevitt.com/articles/pbm-enforcement-west-virginia-michigan-independent-pharmacies/
- https://www.frierlevitt.com/articles/kansas-sb-360-pbm-reform-law-and-what-it-means-for-independent-pharmacies/
- https://www.frierlevitt.com/articles/new-jersey-patient-provider-protection-act-a1502-pbm-reform-independent-pharmacies/
- https://www.frierlevitt.com/articles/arizona-pbm-reform-bills-community-pharmacies/
- https://www.frierlevitt.com/articles/legal-protections-pharmacies-pbm-practices-50-state-overview/
- https://ncpa.org/newsroom/qam/2026/05/26/reimbursement-roundup
- https://ncpa.org/newsroom/qam/2026/03/23/reimbursement-round
- https://www.amcp.org/sites/default/files/2026-05/2026-MISSISSIPPI-PBM-Reform-Inventory.pdf
- https://coapharmacy.com/?p=42309
- https://www.supremecourt.gov/opinions/20pdf/18-540_m64o.pdf
- https://www.quarles.com/newsroom/publications/arkansas-pbm-law-upheld-by-supreme-court
- https://ncpa.org/newsroom/executive-update/2026/05/15/cost-plus-wild-ncpa-executive-update-may-15-2026
- https://ncpa.org/newsroom/news-releases/2026/02/04/boom-ftc-squeezes-concessions-cignas-express-scripts
- https://www.drugtopics.com/view/pbm-underpayment-persists-as-cost-plus-brings-new-strain-ncpa-2026
- https://www.frierlevitt.com/articles/express-scripts-cost-plus-reimbursement-340b-risks/
- https://www.frierlevitt.com/articles/cost-plus-pharmacy-pricing-pbm-reforms-strategies/
- https://www.drugchannels.net/2026/04/the-ftc-blows-up-express-scripts-pbm.html
- https://www.fiercehealthcare.com/payers/express-scripts-embraces-cost-plus-pricing-new-clearnetwork-model
- https://www.healthcaredive.com/news/cvs-costvantage-cost-plus-pharmacy-launch/736659/
- https://primetherapeutics.com/w/cvs-costvantage-overview-and-what-it-means-to-prime-clients
- https://digitaledition.chaindrugreview.com/articles/prescription-reimbursement-is-now-through-innovative-and-transparent-cvs-costvantage
- https://www.cga.ct.gov/2026/hsdata/TMY/2026HB-05354-R000303-Schreiner%20Jr.,%20Ed,%20VP%20of%20Network%20Development-Northeast%20Pharmacy%20Service%20Corp-Supports-TMY.PDF
- https://www.intrinsiq.com/insights/impacts-for-medically-integrated-dispensing-in-2026-and-beyond
