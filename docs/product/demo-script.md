# Live Demo Script - Malbek Contract Intelligence Copilot (v0.1, superseded)

> This is the v0.1 script, kept for history. The current script for the Revenue Intelligence and Contract Risk
> Command Center is [`docs/demo/ceo-demo-script.md`](../demo/ceo-demo-script.md); use that one.

> Independent portfolio demo, not affiliated with Malbek Inc. Target run time: **5-7 minutes**, presented live from the presenter's laptop to Malbek's CEO/leadership. Written for a student/early-career candidate - confident but not over-rehearsed, and explicit about what's real vs. mocked.

**Pre-demo checklist (do this before the call starts):**
- Run the app locally, confirm `AI_PROVIDER=mock` (or whatever you intend to show), and run **Reset Demo Data** so the seeded contracts are in a clean state.
- Have the portfolio dashboard open and loaded in the browser tab before you start talking.
- Close unrelated tabs/notifications. Full-screen the browser if presenting via screen share.

---

## 0:00-0:30 - Opening Hook

> "Thanks for the time - I want to show you something I built after spending a few days researching Malbek's product and the CLM market. Quick context: this is an independent portfolio project, not affiliated with Malbek in any way - I'm not claiming to have rebuilt your product. What I wanted to prove is that I understand *why* CLM is a hard data-modeling problem, not just a UI to skin. So this is called the Contract Intelligence Copilot, and everything you're about to see runs entirely offline, locally, on my laptop - no API keys, no cloud calls, nothing hidden."

*(Land on the portfolio dashboard.)*

---

## 0:30-1:30 - Upload and Instant Extraction

**Click:** "Upload Contract" → drag in a sample vendor MSA (or click a seeded contract if live upload risks a hiccup).

> "I'll upload a vendor MSA. Behind the scenes, this is getting parsed server-side - real PDF/DOCX parsing, not a stub - and then run through an extraction pipeline that classifies clauses into fourteen categories, flags risks, and pulls out obligations with due dates. All of that happens in about two seconds because it's a deterministic rules-and-heuristics engine by default - I'll explain why that was a deliberate choice in a second."

*(Land on contract detail page - Summary tab visible.)*

> "Here's the plain-language summary, and a headline risk score."

---

## 1:30-2:30 - Explainability (the core differentiator)

**Click:** Risks tab → click "View source clause" on a flagged risk.

> "This is the part I actually care most about. Every risk the system flags links back to the exact sentence in the contract that produced it - you can click through and verify it yourself. I did some research into review complaints across this whole market - LinkSquares, SpotDraft, others - and 'the AI said something but I can't tell why' is a recurring trust problem. So I built explainability in as a first-class requirement, not an afterthought."

**Click:** Clauses tab.

> "And this is the 14-category clause breakdown - you can see immediately not just what's here, but what's *missing*. This contract has no data privacy clause, for example, which is itself a risk signal."

---

## 2:30-3:30 - Amendment Diffing

**Click:** Navigate to the seeded MSA + Amendment pair → Versions tab → Compare v1 → v2.

> "Contracts change over time, and most demos in this space treat that as an afterthought - just a raw text diff. I modeled it at the clause level instead. Here you can see the payment terms clause changed from Net 30 to Net 45, and a new SLA clause was added - tracked as structured changes, not just highlighted text."

---

## 3:30-4:15 - Approval Workflow

**Click:** Approvals tab → approve the pending Legal step.

> "Contracts also move through an approval chain - Legal, Finance, Executive, configurable per contract type. You can see exactly where a contract is stuck and for how long, which maps to one of the most common complaints in this market: opaque, email-driven approval cycles."

---

## 4:15-5:15 - Portfolio Dashboard & BusinessIQ-Style Insights

**Click:** Navigate to Insights.

> "This is the piece I'd point to as the real differentiator, and it's directly inspired by what I learned about BusinessIQ. Most 'AI contract' demos stop at one document - a single-PDF chatbot. The actual hard, valuable problem is synthesizing across an entire portfolio. So this view aggregates risk distribution, renewal exposure over the next 30/60/90 days, spend by department and contract type, and average approval cycle time - computed live from the same structured data every other screen uses, not a separate hardcoded chart."

**Click:** Role switcher (Finance → Legal → Sales).

> "And because everything sits on one clean data model, I can reshape the same underlying data for different roles - Legal, Sales, Finance, Procurement - which mirrors the four personas Malbek itself targets."

---

## 5:15-6:00 - Chat, Search, and Export

**Click:** Open contract chat, ask a question ("What's the termination notice period?").

> "There's also a chat interface scoped to a single contract, retrieval-based - it cites the clause it pulled the answer from, same explainability principle as the risk flags."

**Click:** Global search, type a cross-portfolio query.

> "And this searches across the *entire* repository using local TF-IDF relevance scoring - no external vector database, so it's fast, free, and fully offline, but it's a real ranking algorithm, not a hardcoded filter."

**Click:** Export Executive Report.

> "Last thing - one click produces a board-ready report from the live portfolio state, because executives want an artifact, not just a dashboard."

---

## 6:00-6:45 - Closing Pitch

> "To be transparent about what's real versus what's a placeholder: the extraction, risk scoring, and search are running on a deterministic mock engine right now - genuinely functional, not fake, every output is structured and source-traced - but it's built behind a clean provider abstraction, so flipping one environment variable swaps in a live Claude or GPT call without touching any feature code. Same story with the database - it's a local SQLite file today so anyone can run this in five minutes with zero setup, but the data layer is written so a move to Postgres is a config change, not a rewrite.

> I didn't build this to clone Malbek. I built it to show you how I think about this problem: contracts aren't a place to bolt on a chatbot, they're a structured domain - clauses, risks, obligations, versions, approvals - and once you model that properly, everything from a single risk flag to a board report falls out of the same clean data model. That's the kind of engineering judgment I want to bring to your team."

*(Stop talking. Let the last screen sit. Answer questions.)*
