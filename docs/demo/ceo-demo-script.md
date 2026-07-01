# CEO demo script

> Independent, non-affiliated portfolio demo. Not official Malbek software, not endorsed by Malbek Inc. Used with
> informal permission to reference Malbek's name and colors inside this private demo only. Target run time: 3 to 5
> minutes, presented live from the presenter's laptop.

**Before the call:** run `npm run db:seed` so the numbers below match exactly what's on screen, open the app to
`/dashboard`, and close unrelated tabs. Everything in this script runs offline against the local mock engine; no API
key is required and none is called.

---

## 0:00 to 0:30: Open with the business problem

Land on `/dashboard` before you start talking.

> "Before I show you anything, here's the claim I want to prove in the next few minutes: most CLM tools tell you
> that a contract exists. Very few tell you, in one screen, which contracts are costing you money right now and
> which ones are exposed to risk you haven't priced in. That's the gap this fills. Everything you're about to see
> is computed live from twenty-five seeded contracts, not staged, and it runs entirely offline."

---

## 0:30 to 1:15: The dashboard, in one glance

> "This is the Executive Command Center. Ten million dollars of portfolio value, six hundred sixty-nine thousand
> four hundred twenty dollars flagged as revenue at risk this quarter, an average clause-drift score of thirty-nine
> out of a hundred against our house playbook, and ten approvals sitting in queue. Every one of those numbers is a
> link, not a static tile."

Click into "Top revenue leakage opportunities" on the dashboard.

---

## 1:15 to 2:15: Revenue Leakage Detector

Navigate to `/revenue-leakage`.

> "This is where the six hundred sixty-nine thousand comes from, broken into eighteen open findings across six
> categories: missed price escalators, renewals that passed their notice window, payment terms working against us,
> service credits we never claimed, and one I'd call out specifically."

Point at the largest line item.

> "Horizon Retail Group renewed a Statement of Work and the value didn't move; two hundred sixty thousand dollars
> of what should have been a routine uplift. That's not a guess, it's a comparison against the prior contract on
> file for the same counterparty and contract type. Every row here traces back to a clause and a contract, and I
> can mark it recovered or dismiss it right from this table once someone actually chases it down."

---

## 2:15 to 3:00: Contract Risk Radar

Navigate to `/risk-radar`.

> "Leakage is money we're already losing. This is money that could be lost next. Every clause in the portfolio is
> measured against the playbook Legal actually wants, not a generic score: data privacy and non-compete clauses
> drift the furthest from standard, and fifteen contracts sit above the alert threshold. This is the same
> underlying data model as the leakage view, just answering a different question."

---

## 3:00 to 3:45: AI Portfolio Copilot answers a specific question

Navigate to `/copilot` and click the quick prompt "What is our total exposure from non-standard indemnity clauses?"

> "This isn't a chatbot wrapped around a search box. It reads the actual clause library and answers with numbers
> and citations: three contracts carry non-standard indemnification language, two point nine eight million dollars
> in contract value, and each one links straight to the source contract. Ask it anything about this portfolio and
> it'll ground the answer in the clauses, not make one up."

---

## 3:45 to 4:20: Clause Drift Analyzer, the "how did we get here"

Navigate to `/clause-drift`, expand one of the "Severe drift" findings.

> "This is the mechanism behind the risk score. Here's the executed liability clause next to the exact playbook
> language it should match, side by side. Thirty-eight findings across the portfolio are flagged less favorable
> than our standard position, and this view is where Legal would actually go fix it, one clause at a time."

---

## 4:20 to 5:00: Close, why it matters, and why I built it

> "I want to be direct about two things. First, Malbek's own BusinessIQ, and competitors like Icertis and Sirion,
> already do leakage detection and clause analysis; I'm not claiming to have invented the category. What I focused
> on is the delivery problem: getting an executive from zero to a specific, traceable dollar figure in one screen,
> with the receipts underneath it, instead of a dashboard that just tells you a contract exists.

> Second, why I built it: I wanted to prove I understand CLM as a real data-modeling and product problem, not just
> a UI to skin. This is an independent portfolio project inspired by Malbek's product space; it's not affiliated
> with or endorsed by Malbek, and I'm not presenting it as a replacement for anything Malbek has built. I built it
> because I want to work on exactly this kind of product, and this was the most honest way I could think of to show
> that."

---

## If something goes sideways

- If a page loads slowly on first click, that's Next.js compiling the route on demand in dev mode; refresh once and
  it'll be instant afterward. In a production build (`npm run build && npm start`) this doesn't happen.
- If the numbers on screen don't match this script, someone touched the demo data; run `npm run db:seed` before the
  call to restore the original twenty-five contracts, or click **Reset demo data** in the top bar mid-call.
- If asked "is this connected to a real LLM," the honest answer: by default no, it's a deterministic rule-based
  engine documented in `src/lib/ai/mock/`, with a working provider interface to swap in Claude or GPT with one
  environment variable. That's a deliberate choice so the demo works offline, instantly, for free.
