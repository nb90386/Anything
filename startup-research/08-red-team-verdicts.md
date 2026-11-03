# 08 — Red-Team Verdicts

Date: 2026-11-03. The attack was written by an independent agent that was told to kill the finalists and was not shown my preferred answer. It ran its own new searches. Its full text with sources is `data/red-team-raw.md`. Below, each objection is condensed and followed by my documented response. Where I have no good answer, I say so. Roast Room and founder-skill could not be installed (no network for cloning into the sandbox at the time, and both are persona simulations), so their structure was replicated with the eight required perspectives. No simulated approval is presented as validation.

Finalists (refined after competitive analysis):
- **F1** Verified accessibility layer: independent semantic verification of document accessibility plus outcome-guaranteed remediation.
- **F2** Intake-flood defense for public-records offices.
- **F3** Neutral reimbursement-floor evidence engine for independent pharmacies.

---

## F1 — Verified accessibility layer

| Perspective | Strongest objection | Response | Status |
|---|---|---|---|
| Customer | "I can't check your checker." Plaintiffs and DOJ use PAC, manual review and screen readers. Allyant already guarantees "100% conformance" and AbleDocs claims a $10M liability guarantee. Most of my archive is exempt (Exeter CA and League City TX RFPs exclude the existing library). CCC memo: colleges "may not delegate or contract away" obligations. | Accepted in part. A guarantee is not novel, so it cannot be the product's identity. The verifier's job is evidence the buyer can show, not risk transfer. That only matters if the verifier agrees with screen-reader users, which is the first test (12). Exempt archives remove the backlog market; the plan targets the non-exempt flow (new documents and forms needed to access services). | Open until blind-user test |
| Competitor | OpenDataLoader adds an LLM check to the free engine (the PDF Association published the idea in August 2026). PAC reportedly has "AI-assisted semantic analysis". Siteimprove extends its PDF agent to structure. Allyant/AbleDocs use LLM QA internally and undercut. | Accepted as the main risk. The defensible assets are the ones a feature cannot copy quickly: a ground-truth corpus labeled by blind users' task outcomes, a public benchmark vendors are measured against, and neutrality toward vendors. If an incumbent ships a trusted semantic checker before those exist, F1 becomes a feature. The PDF Association article argues that the idea is mainstream and that the race is about measurement quality and trust. | Real risk, partly mitigable |
| Investor | Mandated flow is maybe a $10–25M gross market after Ally and AI bureaus. Demand spikes before April 2027/2028 then decays. Likely $1–5M ARR or an acqui-hire. | Largely accepted for the US public-sector wedge (06 base SAM ~$46M at $0.75/page; red-team estimate lower). Venture scale requires expansion beyond the wedge: HHS Section 504 recipients (not extended), EU Accessibility Act private-sector documents, ADA Title III, and web/app semantic QA. That is possible, not probable, and is stated in 10 and 14. | Unresolved; main reason the verdict is not BUILD |
| Technical architect | Small samples (0/5 false flags allows up to 52%); defect taxonomy leaks into the verifier prompt; proxy ground truth; single-page only; forms untested; same-family judge; the real cost is false positives and guarantee payouts. | Accepted; these limitations are written into 09 section 7. The next experiment is designed around them: 30 real multi-page public PDFs including forms, defects judged by blind users doing tasks, a held-out label set built by someone other than the prompt author, and a cross-family judge. | Accepted; test designed |
| Security / regulatory | "Verified" plus a guarantee is an express warranty. A minor cannot easily buy E&O insurance; minors' contracts are voidable. FTC's accessiBe order bars "full compliance" claims. City documents can carry police, benefits, HR and FERPA data; LLM API use needs zero-retention terms and DPAs. No DOJ safe harbor for automated tools. | Accepted. Changes: drop the guarantee from the first product; sell "verification evidence" with precise, non-absolute claims; start with documents that are already public (posted on public websites); operate through a parent-held or adult-officered LLC; use zero-data-retention API terms before touching non-public documents. | Mitigated by design changes |
| Distribution | Cooperative contracts (Washington DES 02024; Sourcewell/SHI) are held by incumbents. RFPs need insurance, references, a legal entity. Unsolicited reports from a teenager read like overlay spam or a demand letter. | Partly accepted. The cheap wedge is real: city and college PDFs are public, so a free, accurate report on a buyer's own documents can be produced without permission. Framing it as research (a public benchmark of how well city documents and remediation tools work, published with methodology) is better than cold sales. A subcontracting route through an established remediation vendor that wants a QA layer avoids RFP barriers. | Testable in 2 weeks |
| Financial | "Pay per verified page" means hard pages eat cost and earn nothing. At 20% of pages needing $5 review, blended cost ~$1/page against a market at $0.50 or less. Sales cycles 3–9 months. | Accepted as the central unit-economics risk. The closed-loop measurement (09) found 13–29% of real pages flagged after automated fixing. In 06 the margin is negative at 25% flagged with 4 minutes of review at $0.40/page, and about 58% at 15% flagged at $0.75/page. Response: sell verification first (high margin, $0.05–0.15/page, no human queue) and add remediation only after the flag rate is measured on real customer documents. | Accepted; product order changed |
| Founder reality | The guarantee is insurance; the human queue is a service bureau requiring trained remediators; the eval set requires paid blind testers; RFPs and support fall on the founder. | Accepted. The first product is verification only, so there is no review queue. The founder's unscalable work is building the labeled corpus with paid blind testers, which is also the moat. | Accepted |

**Most likely cause of death:** nobody buys verification as a separate line item. Buyers remediate on request through bureaus that already guarantee output, or accept free incumbent tagging, while PAC, Siteimprove or OpenDataLoader add a semantic check.

**Fatal objection?** None proven. Two cheap tests decide it: (1) does the verifier agree with blind users on real documents; (2) will a buyer or a remediation vendor pay for verification without remediation.

**Verdict: VALIDATE FIRST.**

---

## F2 — Intake-flood defense for public-records offices

| Perspective | Strongest objection | Response |
|---|---|---|
| Customer | I cannot deny a request because a model says it is AI; residents who use ChatGPT are still persons; wrongful denial invites CPRA suits with fee-shifting. Volumes in target cities are small (Manteca ~510/yr). | No good answer. The tool can only flag for a human, which saves little. |
| Competitor | CivicPlus/Granicus add a "suspected bot" badge inside the bundle and own the data and API; GovGuard (YC Spring 2026), CivicRecordsOnline ($99–$499/mo), Dekree and others are already here. | No good answer. The incumbent owns the data plane. |
| Investor | California-only legal hook; add-on priced at $1–6k/yr; ~$430k ARR at 20% CA share; ~$8M nationally, captured as a feature. | Accepted (06 shows CA SAM ~$2.7M). |
| Technical | Bot detection is adversarial; AI-text detection is unreliable; SB 1159's "disclosure verification tool" appears tied to the free provenance tools required of GenAI providers under California's AI Transparency Act (interpretation, unverified). | Accepted; if that reading holds, the statute points at free tools. |
| Security / regulatory | Press will frame it as anti-transparency; profiling requesters conflicts with CPRA's bar on asking purpose; bill status conflict between sources. | Accepted. |
| Distribution | Bolting a second vendor onto a bundled incumbent needs council or manager sign-off. | Accepted. |
| Financial | Price capped by $1.2–6k/yr full portals; churn to 100% when an incumbent ships a badge. | Accepted. |
| Founder reality | Exemption and denial decisions are legal judgments; every flag still needs a human. | Accepted. |

**Fatal objection:** yes, structural (incumbent owns the data; acting on flags is legally risky; the statutory tool may be free). **Verdict: KILL** unless a one-week, $0 test of public request logs in five California cities shows more than 25% duplicate, bulk or commercial requests and at least two clerks or city attorneys say they would act on a flag.

---

## F3 — Neutral reimbursement-floor evidence engine

| Perspective | Strongest objection | Response |
|---|---|---|
| Customer | My PSAO already files MAC appeals free; why give PHI and confidential invoices to a 17-year-old? Regulators already do the analysis (West Virginia's exam found ~19,500 below-floor ESI claims in 2023 and ~10,000 in H1 2024; ordered restitution plus a $1.5M penalty). | No good answer to the trust problem; regulators with subpoena power do not need pharmacy-side evidence. |
| Competitor | RxDelta adds a per-state floor table in a sprint; NADAC Lookup already flags below-NADAC claims for $29/mo; PSAOs add a free report; plaintiff firms hire credentialed experts. | Accepted. |
| Investor | Floors bind only state-regulated commercial claims; Medicare Part D (preemption, Tenth Circuit in Mulready) and Medicaid are 52% of independent prescriptions; ERISA plans contested; ceiling ~$2.4M ARR. | Accepted (06 base ~$7M TAM in floor states). |
| Technical | Claim data generally does not say whether a claim is fully insured, ERISA self-funded, Part D or Medicaid MCO, which decides whether a floor applies; misclassification destroys credibility under cross-examination. | Accepted; this is a hard data problem, not a software one. |
| Security / regulatory | HIPAA business associate of every pharmacy; BAAs signed by a minor are voidable; invoices are confidential; drafting complaints edges toward unauthorized practice of law. | Accepted; this alone makes it irresponsible for this founder now. |
| Distribution | Associations and NCPA partner with established vendors and law firms and buy on credentials. | Accepted. |
| Financial | Subscription tops out at a few hundred dollars per store; success fees depend on multi-year litigation; restitution ordered by regulators bypasses the tool. | Accepted. |
| Founder reality | Requires NCPDP billing expertise, statute interpretation and expert-witness credibility: a litigation consultancy disguised as software. | Accepted. |

**Fatal objection:** probably, for this founder (HIPAA business-associate duties as a minor; credentialed evidence needs). **Verdict: VALIDATE FIRST, leaning KILL.** A two-week, $0 test: three state associations and two plaintiff firms asked whether they would pay $5–20k for a standardized evidence pack and how they determine plan type today. Kill if none commits.

---

## Ranking after red team

1. **F1** — only finalist with technical evidence and a cheap test that resolves both the technical and the commercial question. Weak moat and uncertain scale.
2. **F3** — real money per violation, but data, standing and legal capacity sit with others.
3. **F2** — killed.

No consensus is claimed. F1 keeps its lead only if blind-user testing confirms the verifier and a buyer pays.
