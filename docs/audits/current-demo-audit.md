# Audit: Contract Intelligence Copilot v0.1

Honest internal audit of the first version of this demo, written before starting the v2 rebuild into the Malbek
Revenue Intelligence and Contract Risk Command Center. The goal here is to be harsh where harshness is warranted.
Nothing in this document is a complaint about the people who built v0.1: it is a clear-eyed list of what would not
survive contact with a sharp product leader or a CEO who has seen a hundred enterprise SaaS demos.

## Summary judgment

v0.1 is a real, working CLM demo with a genuine rule-based extraction engine underneath it. That part is not weak.
What is weak is that it reads as "a well-built clone of the category," not as a product idea with its own point of
view. A CEO who runs a CLM company will recognize every screen in v0.1 as something their own product already does:
a contract list, a risk tab, an obligations tab, a chat panel, a BusinessIQ-style dashboard. Nothing in v0.1 answers
the question "why would Malbek want to build this feature if they don't already have it." That is the core problem
the v2 rebuild has to fix, and it is a product problem before it is a design problem.

## Product weaknesses

- **No point of view.** Every module in v0.1 mirrors an existing CLM capability (contract repository, clause
  classification, risk tagging, approvals, chat). There is no module that only makes sense once you already have a
  CLM in place and are asking "now what." Revenue leakage, clause drift against a playbook, and a dedicated
  cross-portfolio risk radar do not exist yet.
- **The BusinessIQ page is a generic analytics dashboard**, not a decision-support tool. It shows value by
  department and by type, a status breakdown, and a counterparty table. None of it tells an executive what to do
  next. There is no "revenue at risk," no "recommended action," no ranked list of what needs attention this week.
- **The dashboard and BusinessIQ page overlap** almost entirely (both show risk distribution, both show portfolio
  value). Having two pages that answer the same question is confusing, not additive.
- **Role-based views are cosmetic.** The role switcher changes a greeting sentence on the dashboard and filters the
  approvals queue. Legal, Sales, Finance, and Procurement do not actually see meaningfully different information or
  different priorities anywhere else in the app. This was called out as a requirement in the original brief and was
  under-delivered.
- **No negotiation intelligence at all.** Risk findings include a one-line recommendation, but there is no
  negotiation brief, no fallback position, no "clauses most often flagged across the portfolio" pattern-level
  insight.
- **No guided demo mode.** A CEO demo currently depends entirely on the presenter clicking through pages in the
  right order from memory. There is no in-product narrative path.

## UI and UX weaknesses

- **Visually correct but generic.** The design system (hand-built Tailwind components) is clean and consistent, but
  it looks like "a well-executed AI SaaS template," not like a product with a specific personality. There is no
  signature visual moment anywhere in the app: no hero visualization, no distinctive data-visualization treatment,
  nothing a viewer would remember five minutes after the demo ends.
- **Charts are functional, not persuasive.** Recharts bar/pie/line charts with default styling communicate the
  numbers but do not communicate confidence or polish at the level of Linear, Stripe, or Ramp. Tooltips, legends,
  and empty states are default library behavior rather than designed.
- **No command palette.** For a "premium enterprise AI" positioning, the absence of a keyboard-first navigation
  pattern (press a key, jump anywhere) is a missed opportunity that every benchmark product in this space has.
- **No 3D or signature visual treatment anywhere.** The instruction to build one tasteful three-dimensional moment
  did not exist in v0.1's scope, and the app is visually flatter for it.
- **Sidebar and topbar are functional but plain.** No breadcrumbs, no command bar, no notification affordance, no
  sense of a "control center."
- **Empty states and loading states exist but are minimal.** They work, but nothing about them signals craft.

## Engineering weaknesses

- **UI primitives are hand-rolled instead of using a maintained component system.** This was a reasonable call
  under time pressure (avoids a network dependency on shadcn's registry) but it means every component (Dialog,
  Tabs, Select) is missing accessibility behavior a mature library provides for free: focus trapping, proper ARIA
  wiring beyond the basics, keyboard interaction patterns.
- **`src/lib/db/repo.ts` and `src/lib/insights.ts` lean on `any`-typed row mappers.** Pragmatic, but it is real
  technical debt: a schema change would not be caught by the type checker at the point where it actually breaks.
- **Version diffing only compares two stored full-text versions.** There is no clause-level "this changed" summary,
  no drift score, no comparison against a playbook or a standard clause library. It is a real feature but a shallow
  one relative to what "clause drift analysis" should mean.
- **The AI chat is scoped to a single contract.** There is no way to ask a portfolio-wide question ("which
  contracts have uncapped liability") without opening every contract one at a time. This is a meaningful capability
  gap, not just a nice-to-have.

## Data weaknesses

- **Ten contracts is thin for a portfolio story.** It is enough to demonstrate the mechanics but not enough to make
  a dashboard or a risk radar feel like it is summarizing something real. A chart with ten data points looks like a
  demo. A chart with twenty-five looks like a company.
- **No explicit "playbook" or "standard clause" reference data**, so there is nothing to measure drift against.
- **No revenue leakage data at all**: no missed price escalators, no discount creep, no SLA penalty recovery
  opportunities, no payment-term mismatches. This entire category of value is currently unrepresented in the data
  model.
- **Departments and counterparties are somewhat arbitrary** rather than telling a specific, memorable story (a named
  enterprise account with a stuck approval, a named vendor renewal with a missed escalator). A CEO remembers stories,
  not aggregate statistics.

## Broken flows and placeholder content

None found. To v0.1's credit, everything that is visible works: search, filters, role switcher, approve/reject
actions, upload and ingestion (real parsing, real classification), version diff, export. There are no dead buttons
and no fake "coming soon" states. This is the strongest part of v0.1 and the bar the v2 rebuild has to clear again
at a larger scope.

## What would fail to impress a CEO

- Recognizing every screen as "a feature my own product already has" within the first ninety seconds.
- A dashboard that shows numbers without a clear "so what do I do about it."
- No moment in the demo that feels visually distinctive or worth remembering.
- No answer to "why does Malbek specifically want this," beyond general competence.

## What must be rebuilt

- The product framing itself: from "a CLM demo" to "an intelligence layer that sits on top of a CLM."
- The dashboard and BusinessIQ page, replaced by a single sharper executive command center plus dedicated Risk
  Radar and Revenue Leakage pages that do not currently exist.
- Role-based views, so each role actually sees a different, relevant slice of the portfolio.
- The AI chat, expanded from single-contract to portfolio-wide.
- Visual design: sidebar, topbar, landing page, and one signature 3D or network visualization moment.
- Version diffing, expanded with a drift score and a playbook comparison.
- Sample data, expanded from ten contracts to a twenty-five-contract portfolio with a specific, memorable story
  attached to several of them.

## What must be preserved

- The deterministic, offline, zero-API-key analysis engine (`src/lib/ai/mock/`) and its test coverage. It is
  genuinely functional, not decorative, and that is a real differentiator versus a demo that fakes its AI.
- The SQLite data layer and typed repository pattern in `src/lib/db/`.
- Real PDF/DOCX/TXT parsing on upload (`src/lib/parsing/`).
- The provider abstraction that allows swapping in Claude or OpenAI with one environment variable and no code
  changes at call sites.
- The existing Playwright and Vitest test suites, extended rather than thrown away.
- The clear, repeated labeling of this project as an independent portfolio demo, not affiliated with or endorsed
  by Malbek Inc.
