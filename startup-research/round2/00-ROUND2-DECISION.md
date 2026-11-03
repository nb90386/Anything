# Round 2 Decision: the idea to put daily hours into

Date: November 3, 2026. Criteria: `CRITERIA.md` (speed to money and proven spending weighted highest). Evidence: `scan-title2-demand.md`, `scan-accessibility-money.md`, `scan-ai-services.md`, `round2-scores.csv`, and the new experiment in `../experiments/c02-remediation-service/`. No customer has been contacted. Revenue figures are projections until someone pays.

## The answer

**A done-for-you accessibility service for local governments, school districts and colleges.** It makes their PDFs and documents work for blind residents before the federal deadline. AI does the first pass and a verifier checks every page. The founder fixes what the machine can't, and sells at a fixed price per page below what these buyers already pay.

This is the round-1 idea turned into the business that money already flows to. Round 1 tried to sell verification on its own, and the red team's top objection was that nobody pays for that separately. Buyers do pay for finished, accessible documents, today, at $3–12 a page. The verifier stops being the product and becomes the edge: it is why one person can deliver faster and cheaper with checked quality.

## Why it beat every other fast-money option

| Option | Score /100 | Why it won or lost |
|---|---|---|
| **Done-for-you Title II remediation** | **73.0** | Verified 2026 spending by at least 17 local bodies ($7.5k–$60k per contract); hard deadline April 26, 2027 (5.5 months); California city managers can sign $10k–$50k without a formal bid; pipeline tested on real pages |
| Solar permit + utility interconnection desk | 59.0 | Small installers decide fast, but prices are vendor-page only; needs a licensed engineer partner and installer portal logins; residential solar is contracting after the tax credit ended |
| Catch-up bookkeeping | 58.5 | Seasonal, crowded; owners hesitate to give a minor bank access |
| Trucking back office | 55.0 | Hard to collect; trust barrier |
| Grant writing | 55.0 | Slow award cycles; outcome uncertain |
| Therapy-practice credentialing | 54.5 | Payers take months; handles SSNs |
| Verification-only software (round-1 winner) | 53.5 | Slowest money; nobody shown paying for it alone |
| ADU permit expediting | 48.0 | Needs licensed designers for revisions |

The winner took first place under all 300 random reweightings tested. That reflects my scores, so read it as judgment, not measurement.

## The evidence that money is moving now

- **Real 2026 purchases:** Tuscaloosa, AL $37,720 over 24 months; Clark County, OH $29,800 + $12,873; Umatilla County, OR $59,340; Klamath County, OR ~$56,000; Story County, IA $7,500 unbudgeted; Elko County, NV $15,000 for 250 hours of meeting captions; St. Joseph SD, MO $10,200 proposed. Most came via citizenportal.ai summaries of meeting transcripts, not original agenda packets.
- **Price umbrella:** vendors list $3–12 per page; offshore freelancers ask $0.50–5.
- **Fast purchasing:** many California cities let the city manager buy $10k–$50k without formal bids (Berkeley, Aliso Viejo, South El Monte examples).
- **Pain behavior:** counties are removing documents rather than fixing them (Des Moines County IA, Clear Creek County CO, Bismarck), and Nye County funded only immediate work.
- **Who wins today:** CivicPlus sells DocAccess + AudioEye as add-ons to its website contracts. Smaller specialists also win, which shows a newcomer can.
- **More mandates:** HHS Section 504 for health providers was reportedly extended to May 2027 and May 2028 (correction to round 1). Colorado's state law (HB21-1110) carries $3,500 per violation. Private-sector website lawsuits are projected at ~6,176 in 2026.

## What was tested

On 32 real pages from a public benchmark, the pipeline ran: free auto-tagger, then the semantic verifier, then automatic AI fixes, then re-verification.

| Result | Value |
|---|---|
| Pages that pass with no human touch | 15/32 = 47% (95% CI 29–65%) |
| Pages flagged and fixed automatically | 6 of 23 flagged |
| Pages still needing a person | 17/32; remaining issues: table headers 8, reading order 6, missing content 6, lists 5, alt text 4, headings 2 |
| Model cost | $0.15 per page |
| Machine time | 26 seconds per page |

Round 1 already showed the verifier catches what standard checkers miss (`../09-technical-feasibility.md`). Not tested: blind users' agreement, multi-page packets, forms, the founder's real fix time per page.

## How the money works

Assumptions: price $3/page; 53% of pages need about 8 minutes of hand fixing in Acrobat; 6 hours a day of fixing (the rest goes to selling); 20 working days a month. Fix time and demand are assumed, not measured.

| | Value |
|---|---|
| Average human minutes per page | ~4.2 |
| Pages per day | ~85 |
| Pages per month | ~1,700 |
| Revenue at $3/page | ~$5,100/month |
| Model cost | ~$255/month |
| Revenue at $5/page, same hours | ~$8,500/month |

Each hour of engineering that teaches the pipeline to fix tables and lists raises pages per day. That is how the service becomes a software company rather than a job.

What $5k a month requires: about two or three mid-size city or district packages, or one county, under the no-bid limit. Example: 4,000 pages at $3–4 is $12k–16k, delivered over 2–3 months.

## The fastest path to the first $1,000

1. **Week 1:** form an LLC with a parent as officer and set up invoicing; minors' contracts can be voidable, and governments need a vendor entity. Pick 15 Bay Area cities, districts and colleges. Count their posted PDFs and run the verifier on 10 of each one's documents.
2. **Week 1–2:** remediate 20 pages of one target's real public documents for free, then send the before/after report to the ADA coordinator or clerk. Offer a fixed-price package, such as "your next 6 months of agenda packets and forms, $X, delivered in 5 business days per batch," with free re-fixes if anyone reports a problem.
3. **In parallel:** offer white-label remediation to 5 local web-design agencies that build city and school sites, which reaches buyers without government sales. Optionally list on Upwork for cash flow at $2–3/page.
4. **Week 2–4:** first paid package. Stop and rethink if 15 targets and 5 agencies produce zero paid work by week 6.

## Risks, plainly

- **"Easily" is not true.** This is a sales-and-labor business at first: hours of fixing tables plus persistent outreach to busy public staff.
- **Incumbents:** CivicPlus, Granicus and AudioEye bundle remediation into contracts cities already hold, so sell to bodies not locked in and to the gaps their tools leave: scanned packets, forms, complex tables.
- **The rule could soften.** DOJ said it may re-propose the rule's substance, and the NFB lawsuit could move dates either way. A softer rule cuts urgency, though lawsuits and state laws remain.
- **Price pressure:** offshore $0.50–5/page; compete on speed, verified quality and being local.
- **Liability:** never promise "compliant" or "certified" (FTC accessiBe order). Promise documents checked page by page with a free re-fix.
- **Data:** start with public documents only.

## Why it can grow beyond a service

Every page fixed by hand teaches the pipeline, and every report adds to a labeled corpus of real failures. Over time the human share falls and margins rise. The same engine sells to health providers (2027–28 deadlines), private companies (lawsuits, the EU Accessibility Act) and other remediation vendors. Round 1's verifier thesis becomes the long-term software business, funded by service revenue instead of hope.
