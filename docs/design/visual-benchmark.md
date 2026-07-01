# Visual Benchmark: Pattern-to-Screen Mapping

> Independent portfolio demo, not affiliated with Malbek Inc. Companion to `docs/design/design-direction.md`. For each benchmark product, one specific UI pattern worth borrowing, and the exact screen in this app it maps to.

| Benchmark | Specific pattern worth borrowing | Maps to this screen |
|---|---|---|
| **Linear** | Dense data tables with subtle row hover states, keyboard-first navigation, and a command-palette-first way to reach any object in the product rather than relying purely on sidebar nav | The contracts table (`/contracts`) for row density and hover treatment; the AI Portfolio Copilot's command palette entry point (`Cmd+K` reaching contracts, modules, and the Copilot itself), following Linear's pattern of the palette as a first-class navigation surface, not a search afterthought |
| **Stripe** | Numbers-first summary cards where the figure is visually dominant over its label, paired with clean, restrained line/bar charts that never sacrifice legibility for style | The Executive BusinessIQ Dashboard's top-row summary cards (revenue at risk, contracts needing review, drift alerts, approval bottlenecks): each card leads with the number, label second, consistent with Stripe's balance/summary card convention |
| **Vercel** | Confident dark-mode-capable neutral palette with a single, precisely placed accent/gradient used for one hero moment per page, never as ambient decoration | The landing page hero and the one 3D contract-risk-constellation moment (see design-direction.md); the accent gradient should appear once, behind the hero headline or the constellation visual, and nowhere else on that page |
| **Dub** | Polished, specific empty states (not generic "no data" placeholders) and clean, well-organized settings page patterns with grouped, scannable sections | The Settings page (house playbook configuration) for section grouping and form layout; empty states across the app (e.g., a contract with no drift history yet, a portfolio with no leakage findings) should explain what will appear and why, not just say "nothing here" |
| **Raycast** | Fast, keyboard-driven command interfaces with clear icon-plus-label list rows and instant, low-latency perceived response | The command palette implementation underlying quick navigation and the Copilot's query input, borrowing Raycast's list-row pattern (icon, primary label, secondary metadata right-aligned) for search results and Copilot citations |
| **Ramp** | Confident use of a single accent color against near-white neutrals, and numbers-first card design where financial figures are the largest, heaviest element on the card | The Revenue Leakage Detector's summary cards and category breakdown (missed escalators, uncaptured renewal uplifts, discount creep, unrecovered SLA penalties): each figure should read like a Ramp spend-card number, immediately legible before any supporting label |
| **Retool** | Information-dense enterprise dashboards that stay legible despite showing far more data per screen than typical consumer-influenced SaaS dashboards, through disciplined grid layout and consistent component sizing | The Contract Risk Radar's supporting data panel and the Finance/Procurement/Legal command centers, where multiple metrics, filters, and a primary visualization need to coexist on one screen without feeling cramped or requiring excessive scrolling |

## Additional single-pattern notes (not full benchmark treatment)

- **Framer:** subtle scroll-triggered reveal on the landing page's section transitions, used once per section, not on every element within a section.
- **Notion:** the pattern of a document-like, calm reading surface for the Negotiation Intelligence brief and the unified report preview (`/report`), in contrast to the denser dashboard screens elsewhere in the app.
- **Apple:** restraint in copy length and confident use of large type for the single most important statement on a screen (the CEO command center's top-line synthesis statement should follow this instinct rather than a bulleted summary).

## How to use this document

When building a new screen, first identify which benchmark pattern above is closest to what that screen needs to do, then implement that specific pattern rather than a generic dashboard layout. If a screen doesn't map cleanly to any row in this table, that's a signal to return to `docs/design/design-direction.md`'s core principle (does this make a number, a risk, or a decision clearer, faster) before adding new visual language.
