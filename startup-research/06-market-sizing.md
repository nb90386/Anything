# 06 — Market Sizing and Unit Economics (three finalists)

Date: 2026-11-03. Model code: `tools/market_model.py`. Raw output: `data/market-model-output.txt`. Labels: **V** verified in this research (source cited), **I** inferred, **A** assumed (unvalidated). The industry-spend shortcut ("accessibility is a $X billion market") is not used. Economic value created is not counted as revenue.

## F1 — Verified accessibility layer

### Buyer population (US public sector, wedge first)

| Segment | Entities | Basis | Mandated deadline |
|---|---|---|---|
| Cities ≥50k population | ~800 | I: search results gave 752–817 | Apr 26, 2027 (V: DOJ interim final rule, Apr 20, 2026) |
| Counties ≥50k population | ~1,000 | A: about a third of 3,143 counties (V: Census Vintage 2025 county count) | Apr 26, 2027 |
| Public colleges, documents outside the LMS | ~1,600 | A: public share of ~3,900 Title IV institutions | Apr 26, 2027 or 2028 by size |
| State agencies | ~5,000 | A: ~100 per state | Apr 26, 2027 |
| Smaller local governments | ~88,000 | I: ~90.8k local governments in the 2022 Census of Governments (from prior knowledge; verify) | Apr 26, 2028 |
| K-12 districts | ~12,500 | I: same census (verify) | 2027/2028 by size |

What is mandated (V, from DOJ rule summaries in `data/competition-C01.md`): web content and "conventional electronic documents" posted after the compliance date, plus earlier documents still needed to apply for or access a program. Archived and preexisting documents are exempt but must be made accessible on request.

### Volume and price inputs

| Input | Bear | Base | Bull | Label |
|---|---|---|---|---|
| New mandated pages/yr, city ≥50k | 8,000 | 20,000 | 40,000 | A (agenda packets alone can be hundreds of pages per meeting; unmeasured) |
| New mandated pages/yr, county ≥50k | 10,000 | 30,000 | 60,000 | A |
| Price per verified page (incl. remediation) | $0.40 | $0.75 | $1.25 | A; anchors V: manual $3–15/page, AI-assisted bureaus $0.06–0.50/page, Allyant services $5–8/page |
| Verification-only price | $0.05 | $0.10 | $0.15 | A; COGS V: $0.004 (Haiku) to $0.06 (Sonnet) per page measured in 09 |

### Results

| | Bear | Base | Bull |
|---|---|---|---|
| US public-sector TAM (new-document flow) | $24.5M/yr | $193M/yr | $776M/yr |
| SAM (cities and counties ≥50k + public colleges outside LMS) | $8.5M/yr | $46.5M/yr | $165M/yr |
| SOM by month 24 | 8 entities × $6K = $48K ARR | 25 × $12K = $300K ARR | 60 × $20K = $1.2M ARR |

The red team's independent estimate of the mandated flow was lower ($10–25M gross), because it assumed 5–20k pages per entity and $0.50/page. The truth is unknown; the single most valuable sizing measurement is **actual new PDF pages per year posted by five real cities**, which can be measured from their public websites in a day (12, test T3).

### Unit economics per verified page (remediation + verification)

COGS = extraction + verification (with re-verification of flagged pages) + human review of flagged pages + infrastructure.

| Scenario | COGS/page | Margin at $0.40 | Margin at $0.75 | Margin at $1.25 |
|---|---|---|---|---|
| Sonnet verify, 25% flagged, 4 min review at $30/h | $0.577 | −44% | 23% | 54% |
| Haiku verify, 15% flagged | $0.314 | 21% | 58% | 75% |
| 50% flagged, 8 min review | $2.08 | −421% | −178% | −67% |
| 70% flagged, 10 min review | $3.59 | −798% | −379% | −187% |

Measured flag rate after the automated loop on 31 real single-page documents: 13% structural, 29% including missing alt text (V, 09). Multi-page documents, scanned forms and complex tables will likely be worse (I). **The business is only viable if the flag rate on real customer documents stays near or below ~15% with short review times.** Verification-only (no human queue) is profitable at almost any flag rate: price $0.05–0.15/page against COGS $0.005–0.065/page.

### Sensitivity

- Price is the second-largest lever. At $0.40/page, remediation is unprofitable in every scenario except near-zero flags.
- Flag rate and review minutes dominate. Each extra 10 points of flag rate at 4 minutes costs $0.20/page.
- Volume per entity scales revenue linearly and is completely unmeasured.
- Post-deadline decay: demand spikes before April 2027/2028 and then settles to the ongoing flow, which upstream fixes (accessible Word/InDesign exports) will shrink (I).

### What a billion-dollar outcome would require

$1B at ~10x ARR means ~$100M ARR. The US public-sector wedge base TAM ($193M) cannot support that without implausible share. It requires, in order of plausibility:
1. HHS Section 504 recipients (hospitals, clinics) whose web/document deadline was not extended (V: competition-C01).
2. Private-sector documents under the EU Accessibility Act (in force June 28, 2025) and ADA Title III litigation exposure: banks, insurers and utilities publish statements, notices and forms at very high volume (I).
3. Semantic verification of web pages and apps, where 95.9% of home pages fail automated checks (V: WebAIM Million 2026, problem HCI-02).
4. Becoming the reference verifier that vendors, buyers and regulators use, which requires the blind-user-labeled corpus and a public benchmark.

**Possible, not probable.** The base case is a $1–10M ARR company or an acquisition by a remediation or web-governance vendor.

## F2 — Intake-flood defense (killed in red team; sized for completeness)

| | Bear | Base | Bull |
|---|---|---|---|
| Agencies with material volume (A) × add-on ACV (A; anchored to $9.5–40K/yr portals, V) | 2,000 × $3K = $6M | 5,000 × $6K = $30M | 9,000 × $10K = $90M |
| California SAM (482 cities + 58 counties, I) × $5K | | $2.7M | |

## F3 — Pharmacy floor-law evidence engine (lean kill; sized for completeness)

| | Bear | Base | Bull |
|---|---|---|---|
| Stores in floor-law states (A) × monthly price (A; anchors RxDelta $199–799, nadaclookup $29, V) | 2,000 × $79 = $1.9M | 4,000 × $149 = $7.2M | 8,000 × $249 = $23.9M |
| Whole US independent channel (~18.5k stores, V: NCPA) × $149/mo | | $33.1M | |

Coverage is narrower still: Part D and Medicaid are ~52% of independent prescriptions and largely outside state floors (V, red team).

## Conclusion

None of the three finalists has a demonstrated path to venture scale. F1 has the largest and most durable mandate and is the only one where a cheap test can change the picture. Its sizing inputs (pages per entity, willingness to pay for verification, flag rate on real documents) are all unmeasured and are the targets of the first week (11, 12).
