# Design Direction: Malbek Revenue Intelligence and Contract Risk Command Center

> Independent portfolio demo, not affiliated with Malbek Inc. Malbek's brand colors are used inside this private, non-public demo with informal permission from Malbek's CEO; this is not a public release and the branding usage should not be treated as verified/endorsed by Malbek.

## Benchmarks

The target visual bar is set by: **Linear, Stripe, Vercel, Dub, Raycast, Framer, Notion, Apple, Ramp, Retool.** These products share a specific quality regardless of category (dev tool, fintech, design tool, productivity): they feel expensive without being decorative, dense with information without being cluttered, and confident enough to use restraint as a design choice rather than filling every space.

## Target visual feel

- **Premium enterprise AI, not consumer SaaS.** The product handles contracts, dollars, and risk. Every screen should read as something a CFO would trust, not something a growth-stage startup shipped to hit a launch date.
- **Clean but not boring.** Restraint does not mean flat or generic. Depth comes from typography scale, spacing rhythm, subtle shadow/elevation, and one well-used accent color, not from decoration.
- **Deep visual hierarchy.** Every screen should have an obvious single most-important element (the headline number, the primary chart, the one action) before any secondary content. If a viewer can't tell what matters most within one second, the hierarchy has failed.
- **Sharp typography.** A clear, disciplined type scale carries most of the "premium" feeling in interfaces like this. Numbers (dollar figures, risk scores, percentages) get slightly heavier weight and tighter tracking than body text; they are the product's real content, not decoration around a chart.
- **Beautiful, purposeful cards.** Cards are the primary content unit across dashboards (Linear's issue cards, Ramp's metric cards, Stripe's summary tiles). Card design should be consistent enough that a user learns the pattern once and reads every card in the app faster.
- **Smooth, restrained motion.** Motion should confirm state changes and guide attention, not perform for its own sake. See the Motion section below for specifics.
- **Tasteful gradients, used as accents, not backgrounds.** A gradient can mark a hero moment or a single focal element (see Vercel, Framer). It should never be the default background of a data-dense screen, where it competes with the actual content.
- **Strong data visualization.** This product's entire value proposition is "make numbers and risk legible at a glance." Charts, the Risk Radar, and metric cards carry more weight here than in a typical SaaS dashboard; they deserve first-class design attention, not default chart-library styling.
- **Confident spacing.** Generous whitespace around primary content, tighter spacing within related groups (Stripe and Linear's shared instinct: group tightly, separate generously).

## What to explicitly avoid

- **Generic AI SaaS template look.** No default shadcn-purple-gradient hero, no floating orbs behind every headline, no "AI-powered" badge on every card. If a screen could be mistaken for a Dribbble AI-startup template, it has failed.
- **Overdecoration.** No decorative icons next to every label, no unnecessary borders or dividers, no card-within-a-card nesting past two levels.
- **Gratuitous animation.** No animating elements just because Framer Motion is installed. Every animation should have a specific job: confirm a state change, orient attention after navigation, or make a data transition legible (a number counting up on load is fine; a card that bounces on every hover is not).
- **Gradient soup.** No more than one gradient treatment visible on a screen at a time, and never a gradient behind body text or data tables (contrast and legibility come first).
- **Emoji-heavy copy.** No emoji in UI copy, card labels, empty states, or button text anywhere in the product. This is enterprise software handling contracts and revenue figures; emoji undercut that register immediately.

## Concrete guidance

### Type scale

Use a disciplined, limited scale rather than ad hoc sizes: a display size for the single headline number on a dashboard (e.g., the "revenue at risk" figure), a heading scale for section titles (3-4 steps), a body size for content, and a small/caption size for metadata and labels. Numbers that are the point of a card (dollar figures, percentages, counts) should sit one step larger and heavier than the label describing them, following the Ramp/Stripe convention of the number dominating its card, not the label.

### Spacing philosophy

Base spacing on a consistent unit (4px or 8px grid). Group related elements with the tightest spacing step; separate unrelated sections with the largest. Dashboards should never feel cramped, but they also should not waste vertical space that pushes the next important thing below the fold. When in doubt, benchmark against Linear's list density and Retool's dashboard density: both stay legible despite showing far more information per screen than a typical marketing-site-derived SaaS dashboard.

### Color usage discipline

One accent color (Malbek's brand accent, used with informal permission inside this private demo) carries all primary actions, active states, and the one "this is the important number" moment per screen. Everything else lives in a near-neutral gray scale (per the Ramp/Vercel pattern: confident use of a single accent against near-white/near-black neutrals). Risk and status colors (red/amber/green for severity, status badges) are a separate, small, fixed semantic palette, not an extension of the brand accent, and must meet WCAg AA contrast on their backgrounds. Never introduce a second "brand-adjacent" color for variety; if a screen needs more visual differentiation, use weight, size, or spacing before reaching for a new color.

### When motion is, and is not, appropriate

**Appropriate:** page-transition fades/slides that orient the user after navigation (100-200ms, not longer), a number animating from 0 to its value on first load of a dashboard card, a subtle hover elevation change on interactive cards, a smooth expand/collapse for accordions and drawers, a loading skeleton that matches the final layout.

**Not appropriate:** looping/idle animations on static content, animated icons that play on every render, bouncy/elastic easing on enterprise data surfaces (use ease-out/ease-in-out, never spring-bounce, for anything touching numbers or tables), animating chart data on every filter change in a way that delays reading the new value, any animation that runs longer than ~400ms for a UI (not narrative/story-mode) interaction.

### The one tasteful 3D moment

Exactly one, maybe two, 3D visual moments belong in this product: a **contract risk network / constellation visual**, most likely as a hero element on the landing page and/or an alternate exploration mode within the Risk Radar. Requirements:

- **Lazy-loaded.** The 3D scene (react-three-fiber) must be loaded via `next/dynamic` with `ssr: false` and must never block first paint or the readability of the surrounding page.
- **Must not hurt readability.** If used behind or alongside real data (e.g., as an alternate Risk Radar view), the 3D visual must never reduce legibility of the underlying numbers; it is a mode a user opts into, not the default way risk data is read.
- **Reduced-motion fallback required.** Respect `prefers-reduced-motion`; when set, replace the 3D scene with a static image or the standard 2D radar view rather than a motion-reduced version of the same animation.
- **Restraint on where else 3D appears.** No 3D decoration on dashboards, cards, or data tables. This is a single hero-moment technique, not a recurring visual language.

## Summary principle

If a design decision on this project can't be justified by "does this make a number, a risk, or a decision clearer, faster," it's decoration, and decoration loses to legibility every time in this product.
