# Architecture Upgrade Plan: v2

> Independent portfolio demo, not affiliated with Malbek Inc. This plan covers the technical changes needed to support the v2 product scope in `docs/product/upgrade-prd.md`. It extends `docs/architecture/system-design.md` and `docs/architecture/data-model.md` rather than replacing them.

## 1. Current state (verified from the repo)

As of this upgrade, `package.json` already lists `@tremor/react`, `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `framer-motion`, and several `@radix-ui/*` primitives (accordion, avatar, dialog, dropdown-menu, label, select, separator, slot, tabs, tooltip) as dependencies, along with `cmdk` for command-palette UI. There is no `components.json`, meaning the shadcn/ui CLI has not yet been run in this repo; the existing `src/components/ui/` folder is a hand-built component library (Button, Card, Dialog, Badge, Table, Tabs, Input, Progress, Skeleton, Avatar, EmptyState), not shadcn-generated output. This plan assumes shadcn/ui gets layered in for the primitives the hand-built library doesn't yet cover, rather than a wholesale replacement of working components.

## 2. New dependencies and why

| Dependency | Type | Why |
|---|---|---|
| **shadcn/ui** | CLI tool, not a runtime npm package | Run via `npx shadcn@latest add <component>`, which copies component source directly into `src/components/ui/`. Used to add primitives the current hand-built library lacks and will need for v2: Sheet, Dropdown (menu variant beyond what Radix alone provides), Command (palette shell, pairs with the already-installed `cmdk`), Form (react-hook-form + zod wiring, matches the existing `zod`-based validation approach), Select, Accordion (already have the Radix primitive; shadcn adds the styled wrapper). Because it copies source rather than installing a package, each added component becomes ordinary, editable code in this repo, consistent with the project's "hand-built design system" philosophy already documented in the README |
| **Tremor (`@tremor/react`)** | Runtime npm dependency (already installed) | Apache-2.0 licensed analytics component library, used for the Revenue Leakage Detector's category breakdown charts, the Executive Dashboard's metric cards and trend lines, and the Clause Drift Analyzer's trend visualization. Chosen over building every chart from scratch in Recharts (already used in v0.1) because Tremor's chart+card compositions are purpose-built for exactly this kind of financial/analytics dashboard; Recharts remains in place for the v0.1 portfolio/insights charts it already powers, so both coexist rather than one replacing the other |
| **react-three-fiber + @react-three/drei + @react-three/postprocessing + three** | Runtime npm dependencies (already installed) | Powers exactly one to two tasteful 3D visual moments: the contract-risk network/constellation visual described in `docs/design/design-direction.md`. Must be lazy-loaded via `next/dynamic` with `ssr: false`, and must ship with a static/reduced-motion fallback (see Section 4) |
| **Motion (currently installed as `framer-motion`)** | Runtime npm dependency (already installed, no name change) | The Motion project publishes its React bindings under the existing `framer-motion` package name; this is the same library, not a new dependency. We are documenting it under its current installed name rather than churning the package (no `motion` package swap), since the API surface is identical and a rename would be pure busywork with no functional benefit |

### Magic UI and React Bits: explicitly not npm dependencies

Both Magic UI and React Bits are copy-paste component galleries, not installable packages, and both sites are unreliable to fetch reliably from this sandboxed environment. Rather than attempting live fetches, v2 will build tasteful, purpose-fit equivalents of the specific patterns worth having directly in this codebase, informed by their publicly known patterns, and credit the inspiration in code comments where used:

- **Animated border beam**: a subtle animated gradient border, used sparingly (e.g., to highlight the single most important card on the Executive Dashboard, not applied broadly).
- **Marquee**: a slow, pausable horizontal scroll, considered only for a landing-page social-proof-style strip if one is added; not used inside the authenticated app.
- **Particle/gradient hero accents**: a restrained gradient accent behind the landing page hero and/or the 3D constellation moment, consistent with the "one gradient moment per screen" rule in `docs/design/design-direction.md`.

These will be built as small, local components (likely under `src/components/three` or a new `src/components/effects` grouping) rather than fetched from Magic UI/React Bits at build or runtime.

## 3. New folder structure additions

Extending the existing `src/components/` and `src/lib/` structure:

```
src/components/
  dashboard/     Executive BusinessIQ Dashboard cards, layout, summary-card components
  risk/          Contract Risk Radar visualization + supporting panels/filters
  revenue/       Revenue Leakage Detector cards, category breakdown, drill-down views
  copilot/       AI Portfolio Copilot chat UI, citation rendering, command-palette integration
  demo/          Demo Story Mode guided-tour UI (step overlays, progress indicator, callouts)
  three/         The one/two 3D visual moments (contract risk constellation), lazy-loaded wrappers, static fallbacks

src/lib/
  revenue/       Revenue leakage calculation logic (escalator/renewal-uplift/discount-creep/SLA-penalty detection)
  analytics/     Risk radar positioning logic, clause drift scoring, negotiation-brief generation
  reporting/     Unified report export (extends v0.1's existing export, now spanning leakage/drift/negotiation data)
```

These sit alongside the existing `src/lib/ai/` (mock engine + provider abstraction, extended with new extraction outputs needed for pricing/escalation fields) and `src/lib/db/` (schema extended, not replaced).

## 4. New routes

| Route | Purpose |
|---|---|
| `/risk-radar` | Contract Risk Radar, standalone full view (also embedded as a preview on the dashboard) |
| `/revenue-leakage` | Revenue Leakage Detector, standalone full view |
| `/clause-drift` | Clause Drift Analyzer |
| `/copilot` | AI Portfolio Copilot (portfolio-wide chat, distinct from the existing per-contract chat on `/contracts/[id]`) |
| `/demo` | Demo Story Mode guided walkthrough |
| `/report` | Unified report preview/export (supersedes the v0.1 per-contract-only export entry point) |
| `/settings` | House playbook configuration (drives Clause Drift Analyzer thresholds) |

Existing routes preserved unchanged: `/`, `/dashboard`, `/contracts`, `/contracts/[id]`, `/insights`, `/approvals`, `/upload`, `/search`.

## 5. Decision: what happens to `/insights`

**Decision: `/insights` is folded into the new `/dashboard`, not kept as a permanent standalone page and not simply redirected with no further action.**

Rationale: `/insights` currently implements the v0.1 "BusinessIQ-style" commercial-intelligence view (spend by department/type, risk distribution, renewal pipeline, approval cycle time). The v2 Executive BusinessIQ Dashboard (`/dashboard`) is explicitly designed to be the single landing surface that integrates Revenue Leakage, Risk Radar, Clause Drift, and Negotiation Intelligence summary cards alongside these same v0.1 portfolio aggregates (per PRD FR-13). Keeping `/insights` as a second, separate page would directly contradict the core "one command center, not four disconnected reports" thesis this entire upgrade is built to prove.

Concretely:
1. The v0.1 aggregation logic currently in `src/lib/insights.ts` is preserved and reused, not thrown away, it becomes one section of the new `/dashboard` page rather than its own route.
2. `/insights` becomes a redirect to `/dashboard` (a simple Next.js redirect, not a 404), so any existing links, bookmarks, or documentation referencing it continue to resolve correctly.
3. Sidebar/nav references to "Insights" are replaced with "Dashboard" as the single entry point; no nav item points at `/insights` directly post-upgrade.

## 6. Sequencing note

This plan should be read alongside `docs/product/feature-prioritization.md`'s build order: data model extensions first, then Revenue Leakage and Risk Radar (the modules that most need the new dependencies above, particularly Tremor for Leakage and a strong interactive visualization approach for the Radar), then the Dashboard integration (Section 5's fold-in happens at this point, not before), then Clause Drift, then the remaining modules. The 3D constellation moment (Section 2/4) is intentionally sequenced late in the visual design work, it is a hero polish moment, not load-bearing product functionality, and should not block any functional module's completion.
