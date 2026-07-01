# Feature Prioritization: v2 Upgrade

> Independent portfolio demo, not affiliated with Malbek Inc. Impact, Feasibility, and Demo Strength are each scored 1-5. Build order reflects both score and dependency ordering (a module that other modules read data from should ship before the modules that depend on it).

## Prioritization table

| Module | Impact | Feasibility | Demo strength | Build order | Notes |
|---|---|---|---|---|---|
| **Data model extensions (pricing/billing/escalation fields, playbook schema)** | 5 | 4 | 2 | 1 | Not a user-facing module, but every other new module depends on this being solid first; scored low on demo strength deliberately since it's invisible infrastructure |
| **Contract detail, version diff, approvals, upload/parsing (preserved v0.1)** | 5 | 5 | 4 | 0 (already built) | Kept as-is functionally; visual refresh only, tracked under design work, not re-architected |
| **Revenue Leakage Detector** | 5 | 4 | 5 | 2 | Highest business-story impact; directly extends existing risk/clause data; the opening beat of the CEO demo |
| **Contract Risk Radar** | 5 | 3 | 5 | 3 | Highest visual-impact module; feasibility slightly lower due to needing a genuinely good interactive visualization, not just a chart; pairs tightly with Leakage Detector as the second demo beat |
| **Executive BusinessIQ Dashboard (integration layer, folds in /insights)** | 5 | 4 | 5 | 4 | Not a standalone build, it is the connective tissue; should follow Leakage and Radar since it links out to both; this is where the "intelligence layer" thesis is proven or disproven |
| **Clause Drift Analyzer** | 4 | 4 | 4 | 5 | Directly extends the existing, already-working version-diff engine; strong differentiation per research (no vendor found visualizing cumulative drift over time); lower urgency than Leakage/Radar only because it's a deeper cut into fewer contracts |
| **Role-Based Command Centers (Legal/Sales/Finance/Procurement/CEO)** | 4 | 3 | 4 | 6 | Requires Leakage, Radar, Drift, and the Dashboard to exist first since each command center is a role-specific lens over that same data; building this earlier would mean building placeholder views twice |
| **AI Portfolio Copilot** | 3 | 3 | 4 | 7 | Valuable but not load-bearing for the core narrative; needs the structured data from the modules above to have something worth querying across contracts |
| **Negotiation Intelligence Briefs** | 3 | 3 | 3 | 8 | Weakest market validation of the four new modules per research (most fragmented, least-defended category); scoped light (briefing generator over existing data, not live benchmarking); fine to build after the Copilot |
| **Demo Story Mode (`/demo`)** | 4 | 3 | 5 | 9 | High demo strength but explicitly depends on every other module existing and being stable first, since it's a guided tour layer over them |
| **Unified report export (`/report`)** | 3 | 4 | 3 | 10 | Extends v0.1's existing export; needs the new modules' data to be final before the report format is finalized |
| **Settings (house playbook configuration)** | 3 | 4 | 2 | 11 | Needed to make Clause Drift configurable rather than hardcoded, but low demo-strength on its own; can trail the modules it configures |

## Build-in-this-order recommendation

1. **Data model extensions**: pricing/escalation/billing fields, playbook schema, extended seed data. Invisible but blocking; nothing else works without it.
2. **Revenue Leakage Detector**: highest combined impact and demo strength; the module every other document in this upgrade treats as the opening beat.
3. **Contract Risk Radar**: the second pillar of the "two numbers in the first two minutes" demo open; pairs directly with Leakage.
4. **Executive BusinessIQ Dashboard integration**: connects Leakage and Radar (and later Drift, Negotiation Intelligence) into one landing surface; this is the point at which the "command center" claim either holds together or doesn't, so it should be validated early rather than left until the end.
5. **Clause Drift Analyzer**: extends existing, proven diff infrastructure; strong differentiation per research; naturally follows once the Dashboard has a place to link it from.
6. **Role-Based Command Centers**: now that Leakage, Radar, Drift, and the Dashboard exist, build the five role-specific lenses over them.
7. **AI Portfolio Copilot**: upgrade chat to portfolio-wide reasoning once there's a rich enough structured dataset across modules to make cross-contract queries interesting.
8. **Negotiation Intelligence Briefs**: lower market validation and lower urgency; sequence after the Copilot since briefs benefit from the same version-history querying patterns the Copilot build will establish.
9. **Demo Story Mode**: guided tour layer; must come after the modules it walks through are stable, or the tour breaks the moment a module's UI shifts.
10. **Unified report export**: finalize once all module data shapes are locked, so the export format doesn't need rework.
11. **Settings (playbook configuration)**: closes the loop on Clause Drift's configurability; acceptable to ship last since a sensible default playbook can ship earlier and Settings just makes it editable.

**Why this order, in one sentence:** ship the two modules that make the opening two minutes of the CEO demo undeniable (Leakage, Radar), prove they cohere into one command center (Dashboard integration), then extend the existing diff engine into drift analytics before spending time on the more exploratory, lower-validation modules (Copilot, Negotiation Intelligence), and treat the guided demo mode and report export as finishing work that depends on everything above being stable.
