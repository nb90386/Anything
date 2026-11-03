# 12 — Customer Validation Plan

Status: **PENDING.** No interviews, sign-ups, pilots or purchases have occurred. Nothing below may be reported as traction until it happens with real people. No messages have been sent; every outreach step needs the founder's own action and consent.

## 1. The questions that decide the company

| # | Question | Why it is decisive | Test |
|---|---|---|---|
| Q1 | Do the verifier's findings match what blind screen-reader users actually experience on real public documents? | If not, there is no product. | T1 |
| Q2 | Will anyone pay for verification without remediation? | The red team's most likely cause of death. | T2, T4 |
| Q3 | How many new mandated PDF pages does a real city or college publish per year? | Drives every revenue estimate in 06. | T3 |
| Q4 | What share of real documents can be cleared automatically? | Drives remediation margins. | T5 (after Q1) |

## 2. First ten potential customers and where to reach them

All are organizations named in this session's sources. Contact through the public channels listed; no personal contact details were collected.

| # | Organization | Type | Why it is a target | Public channel |
|---|---|---|---|---|
| 1 | The founder's own community college (Disabled Students Programs & Services / accessibility office) | Title II entity, 2027 or 2028 | Same deadline; the founder is a student there; non-LMS documents (catalogs, forms, board packets) | In person; DSPS office |
| 2 | California Community Colleges Accessibility Center | System-level resource for 116 colleges | Chancellor's memos ESS 26-17/26-38 on Title II; can route to many colleges | Accessibility@CCCTechCenter.org (listed in the CCC source) |
| 3 | City of Manteca, CA (City Clerk) | City over 50k | Public records overload on the record; publishes agenda packets | City website / council public comment |
| 4 | Kane County, IL (County Board office) | County weighing posting fewer materials online to meet the rule | Shows acute pain and an expensive workaround | County website |
| 5 | Des Moines County, IA | County that moved to posting agendas only | Same | County website |
| 6 | City of Exeter, CA | Issued a 2026 document-remediation RFP | Active buyer; scope excludes the archive | RFP contact on city site |
| 7 | League City, TX | Issued a 2026 as-needed remediation RFP from multiple vendors | Active buyer | RFP contact on city site |
| 8 | Equalify (Reflow, with University of Illinois Chicago) | AI remediation, open source | Needs QA at ~$0.06/page cost; possible API customer or partner | GitHub / website |
| 9 | CivAll | New automated PDF accessibility vendor for Title II | Its output is what cities need verified; possible API customer | Website / press contact |
| 10 | Aelira (Crampton IT) | Open-core higher-ed remediator | Possible API customer | GitHub / website |

Alternates: Palm Coast, FL (claims fully compliant packets, a good verification target); TabNav and RemeDocs (AI bureaus); Continual Engine (PREP); Bay Area cities such as Fremont, Hayward, San Mateo and Santa Clara (not yet checked for document volume).

Blind and low-vision testers (for T1): LightHouse for the Blind and Visually Impaired (San Francisco), NFB of California chapters, ACB of California. Testers must be paid at a fair hourly rate. They are experts in screen-reader use, not subjects.

## 3. Interview script (past behavior only)

For ADA coordinators, web managers, clerks and accessibility staff. 30 minutes. Do not pitch until the last five minutes, and only if asked.

1. Walk me through the last document you published that had to be accessible. What was it, and what did you do to it?
2. How did you know it was accessible? Who checked, with what tool, and how long did it take?
3. Tell me about the last time someone told you a document did not work for them. What happened next? How long did it take, and what did it cost?
4. What have you bought or tried for document accessibility in the last two years? What did it cost, and what did you think of the result?
5. When a vendor or tool says a document is fixed, how do you check? Have you ever found that it was not?
6. How many documents or pages do you post in a typical month? Where could I see them?
7. What happens if you miss the April 2027 date? Who in your organization worries about that most?
8. Who approves spending on this, and what is the largest amount you can spend without a formal bid?
9. What would have to be true for you to stop posting a type of document altogether? Have you done that?

For remediation vendors:
1. Of the pages you remediate, what share needs human review today, and how long does review take?
2. How do you QA your own output before delivery? What tool, and what does it miss?
3. Tell me about the last time a customer rejected delivered work. Why?
4. What do you pay per page today for QA labor?

Signals of urgency: they have already spent money, removed documents, issued an RFP, had a complaint, or can name the person accountable. Signals that kill: "Ally/Acrobat handles it," "we remediate on request and it is rare," "we have never had a complaint," no budget owner.

## 4. Field tests and pass/fail thresholds

| Test | What | Effort / cost | Pass | Fail → action |
|---|---|---|---|---|
| **T1 Blind-user agreement** | 30 real public PDFs from three California public bodies: agendas, application forms, tables, multi-page reports. Pay 4–5 experienced screen-reader users to do scripted tasks on each, such as "find the fee in the table" or "fill field Y". Record failures. Run the verifier blind to the results. A different person writes the task set. | ~3 weeks; $1,000–$1,500 for tester time (needs founder approval) | Verifier agrees with user-reported blocking failures ≥85% of the time, with false flags ≤10% of documents | <70% agreement → stop; 70–85% → one iteration, then retest |
| **T2 Willingness to pay (buyers)** | Generate a free report on 10–20 of a coordinator's own posted PDFs; send it to 20 ADA coordinators or web managers with a $500 paid-pilot offer for continuous verification. Message reviewed for tone so it does not read like a demand letter. | 2 weeks; $0 | ≥2 paid pilots or written purchase intent with a named budget owner | 0 pilots from 20 → verification as a standalone product is rejected for buyers |
| **T3 Volume** | Count new PDF pages posted by five real cities and two colleges over the last 12 months, using their public sites. | 1 day; $0 | Base case of 06 (≥20k pages per city) holds for at least 3 of 5 | <5k pages typical → buyer market too small; vendor/API route only |
| **T4 Willingness to pay (vendors)** | Offer 3–5 remediation vendors a free API trial on their own output, then $0.05–0.15 per verified page. | 2–3 weeks; $0 | ≥1 vendor pays or signs a usage commitment | 0 → vendor route rejected |
| **T5 Automated clearance** | On T1 documents, run the extract→tag→verify loop and measure the share still flagged. | 1 week, after T1 | ≤15% of pages flagged after automation | >30% → do not offer remediation; stay verification-only |

Landing page: optional and secondary. A page with a "check my documents" form helps only as a place to send people from the benchmark. Sign-ups are not evidence of willingness to pay.

## 5. Decision rule

- **BUILD** if T1 passes and either T2 or T4 passes.
- **PIVOT within accessibility** (vendor API only) if T1 passes, T4 passes, and T2 fails.
- **STOP** if T1 fails, or if T2 and T4 both fail. Then return to the problem database (16, section 3).

## 6. Drafts (not sent)

Draft to an ADA coordinator (only after T1 shows the verifier is credible):
> Subject: How 15 of [City]'s posted PDFs read to a screen-reader user
> Hi [Name], I'm a computer science student at [College] researching how well public documents work for blind residents ahead of the April 2027 Title II date. I checked 15 PDFs posted on [City]'s site last month and wrote up what a screen-reader user would hear on each, with the specific fix. It's attached, free, and no reply is needed. If it's useful, I'd value 20 minutes to learn how your office checks documents today.

Draft to a remediation vendor:
> Subject: Independent QA on your remediated PDFs
> Hi [Name], I'm building an automated checker that tests whether tagged PDFs actually work for screen-reader users, beyond PDF/UA syntax. On a public benchmark it caught heading, table and reading-order errors that syntax checks passed. Could I run it on 50 of your delivered files, free, and show you what it finds? I'm trying to learn whether it would cut your human review time.

The founder must review, personalize and send these, and should say plainly that the work is a student project or early company.
