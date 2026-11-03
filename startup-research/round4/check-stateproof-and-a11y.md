# Check: StateProof (agent final-state verification) + PDF a11y service re-stress-test

Date: 2026-11-03. About 21 web searches. Facts come only from the cited results. Lines marked [GK] are from my general knowledge and were not verified in this round.

---

## PART A: StateProof

**What was proposed:** developers declare the final state an agent must reach and invariants it must not break across Stripe, the database and the CRM. The system reads the real state back with authenticated calls and flags or escalates any task that didn't finish.

### Competitor / adjacent table

| Product | What it actually does | Overlap with StateProof | Money / traction |
|---|---|---|---|
| Temporal / Inngest / Restate | Durable execution: step results are journaled and replayed. Restate `ctx.run()` serves the journaled result after a crash and does not re-call the tool | Low. They don't verify outcomes, and postconditions have to be hand-written in workflow code | Large incumbents [GK] |
| ACEL (`acel-core`, PyPI) | Runtime check of tool calls against Hoare-style pre/postconditions and temporal ordering rules | **High at the concept level.** An open-source library already exists | Hobby/early |
| Action State (EvidenceBook, Terms Packs, Countersign) | Tamper-evident signed records of agent actions and an independent verification service. Launched about Oct 22, 2026. IETF draft "Agent Action Capsules" | Medium. It proves events happened but, in its own words, "can't verify that an agreement was satisfied." Countersign is free for now | Pre-revenue |
| Montana Labs Sentinel | "Independent action-gate" placed before consequential production actions. Fail-closed SDK, signed provenance, optional execution-bound receipts | Medium. It gates before the action, while StateProof checks after; receipts sit next to read-back | Early (Show HN, PyPI) |
| Microsoft Agent Governance Toolkit | MIT-licensed. Intercepts every tool call before execution against YAML/Rego/Cedar policy. Python/TS/Rust/Go/.NET | Medium. It covers invariants before execution, for free, from Microsoft | Free; Agent 365 is the paid tier |
| Arcade.dev | "Secure action layer": delegated auth and 8,000+ MCP tools/connectors | **High as a threat.** It already holds the authenticated connectors StateProof would need for read-back | $60M Series A, Jun 2026 (~$72M total) |
| Nava | Holds funds in escrow, then checks whether the agent's proposed financial transaction matches user intent | High in finance | $8.3M seed, Apr 2026 |
| Proof x401 | Open HTTP protocol proving who an agent represents and what it is authorized to do. Visa/Circle/Okta contributors | Low. Identity and authorization, not state | Proof is an established company |
| Invariant Labs (now Snyk) | Guardrails and trace analyzer with assertions | Medium, on traces rather than live state | Acquired Jun 2025 |
| LangSmith / Braintrust / Arize / Galileo / Patronus / AgentOps | Evals and observability. Custom code scorers can query a DB after a run [GK] | Medium, offline or eval-time. Anthropic's eval guide and tau-bench/WebArena already define "outcome = final environment state" | Well funded [GK] |
| "Intended" | **Not found** in two searches | Unknown | UNVERIFIED that it exists |

Also funded: AIR ($50M, Sep 2026, action interception), Asymptote Labs ($5.5M, Oct 2026, runtime control), Pramaana Labs ($27M, output "verification layer").

### Claims checked

| Claim | Status | Evidence |
|---|---|---|
| Agents claim success when the real state is wrong | TRUE | Anthropic's eval guide uses the example of a booking agent that claims success while the DB shows no reservation. tau-bench and WebArena check backend state |
| Durable-execution tools don't verify outcomes | TRUE | They guarantee recording and replay, not that the external write happened correctly |
| No one does cross-SaaS state assertions | PARTLY FALSE | No exact product found, but ACEL (postconditions), Nava (finance outcome check), Sentinel (receipts), Microsoft AGT (invariants) and Arcade (connectors) each cover part of it |
| Developers pay for this | UNVERIFIED | Money is going to the security and authorization layers (Arcade, AIR, NeuralTrust, Mintive). I found no standalone revenue for post-hoc state verification. Action State gives verification away free |
| Agent incidents are rising | TRUE but off-target | PocketOS: a Cursor agent deleted a production DB and its backups in 9 s (Apr 2026). Replit (Jul 2025). An 88% "incident" survey stat is second-hand. These are destructive coding-agent failures, which call for prevention before the action, not read-back afterward. No documented duplicate-refund case was found |

### Why it dies for this founder
1. **It's a feature.** A postcondition is a few lines in a Temporal activity or eval scorer. Arcade holds the connectors and can ship "verify after write" as a checkbox. Microsoft gives invariants away under MIT.
2. **Integration treadmill.** Read-back needs a maintained, authenticated connector for every SaaS. That is Arcade's, Composio's and Nango's whole business.
3. **Buyer mismatch.** The buyers are platform and security teams at companies running production agents. They buy on trust, SOC 2 and vendor longevity. A 17-year-old behind a parent's LLC is a hard sell for something on the payment path.
4. **No 60-90 day money.** Even the funded peers are pre-revenue or free (Action State).

**Verdict A: KILL** as a business. It might be worth a weekend open-source library for credibility, but nothing more.

---

## PART B: PDF a11y remediation for local governments: new evidence (Oct to early Nov 2026)

### Regulatory status

| Item | Finding |
|---|---|
| DOJ interim final rule (Apr 20, 2026) | Deadlines remain **Apr 26, 2027** (≥50k population) and **Apr 26, 2028** (<50k and special districts). WCAG 2.1 AA and scope unchanged. Comments closed about Jun 22, 2026 |
| New DOJ NPRM / rescission | **None found** for Oct-Nov 2026. April commentary said DOJ *may* issue a separate NPRM on substantive changes. That remains a live, unquantified risk |
| NFB v. DOJ (1:26-cv-02007, D. Md.) | NFB moved for summary judgment on Sep 28, 2026. **No ruling as of about Oct 28.** If NFB wins, the extensions are vacated and the original 2026 dates return, which would *accelerate* demand |
| Exceptions | Archived content and preexisting conventional documents are exempt *unless* currently used to apply for, access or participate in a service. Accessible copies must still be provided on request. This shrinks the backlog that has to be fixed |

### Price collapse and new entrants

| Entrant | Offer | Threat to $3/$5 per page |
|---|---|---|
| Accessibility on Demand (AoD) | $0.30/page Standard; $1.80/page Enhanced (AI alt text, "95%+ compliance scores", forms included); Expert from $12/page | **Severe** on simple pages |
| CASO Comply | "From $0.30/page" | Severe |
| ASU AI CIC + AWS open source (MIT) | Adobe Auto-Tag API + Bedrock alt text. "Cents per page," "fraction of a penny" (Ohio State) | Severe. Any IT shop or competitor can self-host it |
| Granicus | "Accelerate PDF accessibility compliance" (preview, 2026 mid-year update): automatically evaluates, remediates and validates PDFs **before publication**. West Palm Beach is remediating 3,000+ PDFs | **High for new documents.** It is bundled into the CMS cities already pay for |
| CivicPlus DocAccess | AI converts PDFs to accessible HTML. Integrated with Diligent Community (agenda software), Sep 2026. Cities approving contracts (Jurupa Valley, Harvard IL, Okeechobee County) | High. Bundled. But CivicPlus told Harvard "the liability still does fall onto Harvard" |
| Adobe Acrobat | Cloud auto-tagging plus Auto-Tag API. Adobe's own help still recommends manual touch-up | Medium (the baseline everyone builds on) |
| Accessible.org | $4.00-$11.50/page | Shows the human-heavy end still holds |
| Microsoft / Google native | None found; only third-party Docs add-ons (e.g., Kayabyte) | Low-medium |

No specific late-Oct 2026 launch found. The AoD and CASO page dates are unclear, so their $0.30 is current but not new.

### Deletion instead of paying
TRUE and documented. Axios (Jan 22, 2026) reported that Ankeny, Urbandale (about 3,000 docs, "a significant number" to be removed) and Johnston, Iowa are purging old files and offering them on request. I found no later wave of reporting. Expect it to recur as the 2027 date nears.

### Claims checked

| Claim | Status |
|---|---|
| Deadline Apr 26, 2027 (≥50k) / 2028 (smaller) | TRUE (still current per the Oct 24, 2026 tracker) |
| No new DOJ delay or rescission in Oct-Nov 2026 | TRUE as far as searchable (no item found) |
| NFB case decided | FALSE: pending, summary judgment motion filed |
| $3/page simple is market-competitive | **FALSE for AI-only.** $0.30/page AI tiers exist. Plausible only if human-verified with a guarantee |
| $5/page complex is competitive | TRUE-ish: AoD Enhanced is $1.80, Expert from $12, Accessible.org $4-11.50 |
| Big platforms adding automatic remediation | TRUE: Granicus (preview), CivicPlus DocAccess, Adobe. Not Microsoft or Google natively |
| Cities delete instead of pay | TRUE (Iowa examples) |

### Does anything kill it?
**No single kill shot, but the pricing thesis is broken.**
- AI-only remediation is now a $0.30/page commodity, and an MIT open-source pipeline exists. A $3/page "simple" tier would lose any procurement comparison.
- Granicus and CivicPlus will capture *new* documents at the point of publishing, inside contracts cities already hold.
- What's left is the **backlog of in-use documents** (forms, budgets, agendas, scanned documents, complex tables) and cities not on those platforms. Buyers there want **a human-verified result and someone to blame**. The CivicPlus quote shows liability stays with the city, so "verified" is the product.
- Deletion and the exceptions shrink page counts. That turns **triage (fix / archive / delete / convert-to-HTML) into a sellable first step**.

**Re-position:** stop pricing per simple page. Sell a fixed-fee backlog audit and triage, about $1.50-2/page for verified simple pages (to beat "AI + no guarantee" on trust, not price), $5-12 for forms, tables and scans, and a written conformance report. Build on the open-source ASU/AWS pipeline instead of reinventing auto-tagging.

**Verdict B: VALIDATE (weakened).** It is not killed. Demand is legally anchored, and an NFB win would pull deadlines forward. But margins on simple pages are gone, and the platform vendors own the forward flow. Moving to a deadline-driven service business with a verified-quality positioning is mandatory.

---

## Sources
- https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- https://siliconangle.com/2026/10/22/startup-action-state-launches-tools-for-verifying-interactions-between-ai-agents/
- https://www.ietf.org/archive/id/draft-mih-scitt-agent-action-capsule-05.html
- https://montanalabs.ai/news/sentinel-is-live-the-independent-action-gate-for-ai-agents/
- https://news.ycombinator.com/item?id=46758338
- https://www.proof.com/blog/proof-launches-x401-giving-ai-agents-a-way-to-prove-who-they-represent---and-what-theyre-authorized-to-do
- https://agentic-ai.readthedocs.io/en/latest/SecurityFrameworks/agent-governance-toolkit/
- https://www.i-programmer.info/news/105-artificial-intelligence/18796-microsoft-releases-open-source-agent-governance-toolkit-.html
- https://pypi.org/project/acel-core/
- https://particula.tech/blog/durable-execution-ai-agents-temporal-inngest-restate
- https://www.reactify-solutions.com/articles/durable-ai-agents-2026
- https://snyk.io/news/snyk-acquires-invariant-labs-to-accelerate-agentic-ai-security-innovation
- https://thenextweb.com/news/arcade-dev-60-million-series-a-ai-agent-authorization
- https://fortune.com/2026/04/14/nava-seed-funding-ai-financial-agents/
- https://techcrunch.com/2026/09/01/air-raises-50m-to-help-companies-vet-the-skills-and-add-ons-ai-agents-use/
- https://www.securityweek.com/asymptote-labs-lands-5-5-million-seed-for-ai-agent-runtime-security/
- https://fundraiseinsider.com/blog/pramaana-labs-raises-27m-seed-for-ai-verification/
- https://adversa.ai/blog/ai-coding-agent-incidents/
- https://www.livescience.com/technology/artificial-intelligence/i-violated-every-principle-i-was-given-ai-agent-deletes-companys-entire-database-in-9-seconds-then-confesses
- https://www.duanemorris.com/alerts/doj_extends_ada_title_ii_digital_accessibility_deadlines_one_year_0426.html
- https://www.adatitleiii.com/2026/04/doj-extends-ada-title-ii-website-accessibility-deadlines-for-governmental-entities-but-litigation-and-compliance-risks-remain/
- https://clearinghouse.net/case/48281/
- https://www.deque.com/blog/nfb-sues-doj-and-hhs-over-deadline-extensions-ada-title-ii-and-section-504/
- https://titleii.org/title-ii-updates
- https://www.adatitleiii.com/2026/06/national-federation-of-the-blind-challenges-last-minute-deadline-extensions-for-website-and-mobile-app-accessibility/
- https://www.levelaccess.com/blog/ada-title-ii-updates/
- https://afixt.com/ada-title-ii-and-pdfs-fix-archive-or-delete/
- https://www.axios.com/local/des-moines/2026/01/22/ada-online-document-purge-disabilities-harkin
- https://accessibilityondemand.ai/
- https://www.revolutiondatasystems.com/blog/pdf-remediation-tool-public-agencies
- https://casocomply.com/services/pdf-remediation
- https://accessible.org/services/pdf-remediation/
- https://aws.amazon.com/blogs/publicsector/from-inaccessible-to-inclusive-how-the-new-pdf-accessibility-remediation-solution-helps-institutions-compliantly-address-accessibility-requirements/
- https://smartchallenges.asu.edu/challenges/pdf-accessibility-ohio-state-university
- https://granicus.com/innovation/
- https://www.civicplus.help/docaccess/docs/docaccess-faqs
- https://finance.yahoo.com/technology/ai/articles/diligent-announces-integration-civicplus-docaccess-130000995.html
- https://citizenportal.ai/articles/9870503/Illinois/McHenry-County/Harvard/Council-approves-CivicPlus-upgrade-to-improve-ADA-document-access-and-translation
- https://helpx.adobe.com/acrobat/using/cloud-auto-tagging-accessibility-pdfs.html
- https://workspace.google.com/marketplace/app/kayabyte_accessibility_checker/1087977694142
