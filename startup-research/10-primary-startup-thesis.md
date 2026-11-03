# 10 — Primary Startup Thesis: an independent verifier for document accessibility

Status: **VALIDATE FIRST.** The problem is real and measured. The verification gap is real and was measured in this session. Demand for verification as a separate product, the moat, and the venture-scale path are all unvalidated. Nothing here has been tested with a real user or customer.

## The problem
Public bodies must publish documents that blind and low-vision people can use. The DOJ ADA Title II rule requires WCAG 2.1 AA for web content and documents: from April 26, 2027 for entities over 50,000 people and April 26, 2028 for smaller ones. The FY2025 Section 508 assessment found only 37% of agencies' top-viewed public documents fully conformant, and 27% of agencies did not test documents at all (problem HCI-01). Some governments are responding by publishing less. Kane County, Illinois weighed posting only compliant materials, and Des Moines County, Iowa moved to posting agendas only, with packets on request.

The remediation side is filling up fast: Acrobat auto-tag, Anthology Ally (free in-licence since July 2026), OpenDataLoader (free, open source), CivicPlus DocAccess for agenda packets, Siteimprove's PDF agent, and AI-assisted bureaus at $0.06–$0.50 a page. **What is broken is that nobody can tell whether any of that output works for a blind reader.** The checkers buyers use verify syntax: tags exist, alt attributes exist, languages are set. They do not verify meaning: whether headings are headings, tables have headers, lists are lists, and the reading order makes sense. The buyer stays legally liable for vendor output (CivicPlus's own statement; the CCC Chancellor's memo says obligations cannot be contracted away). Yet the buyer has no independent way to check it.

## The insight
Generation of accessibility fixes has become cheap and automatic, while verification of whether they work has not, and the party that produces the fix cannot credibly grade it. A semantic verifier can now compare what a sighted reader sees with what a screen reader will announce, at well under a dollar per page. That makes it possible for the first time to audit every document a government publishes, not a sample.

## The invention
A verification engine and evidence record for document accessibility:
1. Renders each page and reads its tag tree in screen-reader order.
2. Runs deterministic PDF/UA checks plus a semantic judge that finds mismatches: missing or mislevelled headings, untagged tables or header cells, flattened lists, wrong reading order, dropped content, meaningless alt text.
3. Explains each finding in plain language ("a screen-reader user hears these three items as one paragraph"), with page evidence.
4. Calibrates its verdicts against a corpus labeled by blind screen-reader users completing real tasks. This corpus is the asset that takes the longest to copy.
5. Keeps a tamper-evident log of what was published, when, and its verified state, which is what a liable entity needs.

The extraction engine is not the invention. The experiment showed it is a commodity (09, Experiment A).

## The initial user
Two candidate first buyers. The first week tests both:
- **Remediation vendors and AI remediation startups** (Equalify, Aelira, TabNav, RemeDocs, CivAll, smaller bureaus) who need automated QA to cut human review. This is an API sale with no RFP.
- **ADA coordinators, web managers and clerks at California cities and counties over 50,000 people, and at California community colleges** for documents outside the LMS. They face the April 2027 date and must account for vendor output.

## The outcome
The buyer learns, for every document they publish, whether a blind resident can use it. They see exactly what to fix and get a dated record. A vendor can ship only documents that pass, and reserve human review for the pages that are flagged.

## The wedge
Verification of newly published public documents, starting with public websites in California, where the documents are already public and no data-access permission is needed. The first deliverable is a public, methodology-first benchmark of how well real city documents and the major remediation tools perform for screen-reader users. That builds credibility and inbound demand without paid acquisition.

## The moat (to be earned, not assumed)
- A blind-user-labeled failure corpus (unscalable to build, hard to copy).
- Benchmark position: tools and vendors measured against an independent standard.
- Neutrality: not selling the remediation it grades, at least at first.
- Per-entity evidence history and integration into publishing workflows (switching costs).
None exists today. If an incumbent with distribution (Siteimprove, Adobe, PAC) ships a trusted semantic checker first, the thesis shrinks to a feature.

## The expansion
1. Verification API for vendors → monitoring for public entities → remediation with measured quality, priced below service bureaus, once real flag rates are known.
2. Adjacent mandates: HHS Section 504 recipients (deadline not extended), EU Accessibility Act private-sector documents, ADA Title III exposure (banks, insurers, utilities publishing statements and forms at very high volume).
3. Web pages and apps: semantic QA of real screen-reader behavior, building on the same corpus.
4. Long term, possibly: the verification layer for machine-made content that must work for people who cannot see it, used by vendors, buyers and regulators.

## The timing
- Mandate: Title II dates fixed at 2027/2028 (extended once, not removed); HHS 504 not extended; EAA in force since June 2025.
- Supply shock: in 2025–2026 auto-tagging became free and ubiquitous, so the volume of unverified accessibility output is exploding.
- Capability: vision-language models can now judge page semantics cheaply. Measured cost was $0.004–$0.06 per page in this session.
- Public signal: the PDF Association published in August 2026 that language models can judge reading order, so the standards community now accepts the method. That is also a warning that others will build it.

## The founder advantage
- Pure software, buildable with the founder's existing stack and subscriptions; the prototype verifier was built and tested in one day here.
- Bay Area proximity to blind-user communities, such as LightHouse for the Blind and Visually Impaired in San Francisco and NFB and ACB chapters, for paid testing (contact not yet made).
- The founder's own college is a Title II entity under the April 2027 deadline. It is a natural first design partner, if it agrees.
- Public documents mean the product can be demonstrated on a buyer's own materials without permission.

## The existential risks
1. **Verifier does not match blind users' experience** on real multi-page documents and forms → no product.
2. **Nobody pays for verification separately** → it is a feature of remediation tools.
3. **An incumbent ships a trusted semantic checker** inside existing licenses before the corpus and benchmark exist.
4. **Human review costs** make remediation unprofitable if real flag rates exceed ~15–20% (06).
5. **Regulatory softening:** DOJ may re-propose the rule's substance (it said so in April 2026); the NFB lawsuit could also move dates either way.
6. **Founder constraints:** contracting as a minor, insurance, data agreements, and time split with full-time classes.
