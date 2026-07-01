# User Personas — Malbek Contract Intelligence Copilot

> Independent portfolio demo, not affiliated with Malbek Inc. These personas mirror the buyer/user functions Malbek itself names as its target market (Legal, Sales, Finance, Procurement), plus an executive evaluator persona representing who is actually likely to watch this demo.

---

## 1. Legal Counsel — "Priya," In-House Counsel / Legal Ops Lead

**Role context:** Sole or lead in-house counsel at a mid-market company (500-3,000 employees). Reviews every vendor and customer contract before signature, manages a small template library, and is the de facto owner of contract risk.

**Goals**
- Get through contract review faster without missing a non-standard clause.
- Have a defensible, consistent answer for "what's our exposure" when asked by the CEO or board.
- Reduce the number of contracts she has to re-read from scratch because "something changed."

**Pains**
- Manual redlining and version chaos — tracking which Word doc is actually current.
- Risky clauses (uncapped liability, one-sided indemnification, unfavorable termination) going unnoticed until they cause a problem.
- No fast way to answer "which of our contracts have this clause" without opening every file.

**What impresses her in this demo**
- Risk flags that link directly to the exact sentence that triggered them — she doesn't have to take the AI's word for it.
- The 14-category clause classification actually matching how she mentally organizes a contract.
- The amendment diff view showing clause-level, not just line-level, changes — this is the feature she'd show her own team first.

---

## 2. Sales / RevOps — "Marcus," Revenue Operations Manager

**Role context:** Owns the quote-to-contract handoff at a B2B SaaS company. Not a lawyer; cares about deal velocity and not letting legal review become a bottleneck to closing.

**Goals**
- Know exactly where a deal's contract is stuck in approval, and why.
- Get a fast, plain-English read on whether a customer's requested changes are a big deal or a non-issue.
- Avoid surprises — auto-renewal terms, SLA commitments — that come back to bite the sales team later.

**Pains**
- Approvals routed by email/Slack ad hoc, with no visibility into where a contract is stuck.
- Legal treating every deal the same regardless of size/risk, slowing down easy ones.
- No single place to see deal-cycle time trends to know if the process is actually improving.

**What impresses him in this demo**
- The approval workflow view showing exactly which role/step a contract is stuck at, and for how long.
- The commercial-insights dashboard's approval-cycle-time metric — something he'd genuinely want in his own weekly report.
- A plain-language AI summary he can read in 30 seconds without legal jargon.

---

## 3. Finance / Procurement Analyst — "Elena," Commercial Finance Analyst

**Role context:** Sits in FP&A or procurement, responsible for understanding the company's total contractual spend and financial exposure — renewal costs, payment terms, auto-renewal risk, vendor concentration.

**Goals**
- Answer "what's our renewal exposure next quarter" without manually opening every contract.
- Spot auto-renewals early enough to renegotiate or cancel before the notice window closes.
- Understand spend and risk distribution across departments and vendors at a glance.

**Pains**
- Contract data trapped in files that don't talk to any spend or planning system.
- Missed renewal windows causing unplanned spend or lost negotiating leverage.
- Dashboards (where they exist) are static and can't be filtered the way she actually needs.

**What impresses her in this demo**
- The renewal pipeline view (30/60/90-day windows) built from real obligation/expiration data, not a hardcoded chart.
- Spend-by-department and spend-by-contract-type breakdowns that update as contracts are added.
- The obligation tracker's due-date/status model (upcoming/due soon/overdue/complete) — this is exactly the operational view she wishes she had today.

---

## 4. CEO / Executive Evaluator — "David," Malbek Leadership (or Equivalent)

**Role context:** This is the persona actually watching the live demo — a CEO, VP Product, or Head of Engineering at a CLM company (modeled on Malbek's own leadership), evaluating whether the candidate who built this understands the product domain and can execute.

**Goals**
- In under 10 minutes, form a confident opinion on whether this candidate understands CLM as a domain, not just as a UI to clone.
- See evidence of real engineering judgment: data modeling, explainability, and architectural honesty about what's mocked vs. real.
- Come away with a specific, memorable reason to advance the candidate.

**Pains**
- Most portfolio projects in this space are shallow — a PDF-upload chatbot wearing a CLM skin.
- Candidates who oversell what's "AI-powered" without being able to explain how it actually works or what happens without an API key.
- Demos that don't map to anything the evaluator's own company or market actually cares about.

**What impresses him in this demo**
- Recognizing the shape of his own product's roadmap (Bek → chat, Malbek AI → risk/clause extraction, Amendment Studio → diffing, BusinessIQ → portfolio insights) reflected thoughtfully, not copied.
- The explicit, honest framing that this is an independent, non-affiliated portfolio piece — signals integrity, not just enthusiasm.
- A working, offline, zero-API-key demo that still produces structured, source-traceable output — proof the candidate can ship something real under constraints, and has a credible story for upgrading it to production (real LLM, real Postgres, real auth) rather than pretending it's already there.
