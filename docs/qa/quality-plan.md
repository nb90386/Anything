# Quality Plan: v2 Upgrade

> Independent portfolio demo, not affiliated with Malbek Inc. This plan extends the existing testing approach documented in `docs/testing/test-summary.md` (v0.1) to cover the new modules in `docs/product/upgrade-prd.md`.

## 1. What "done" means

A module is not considered complete until all of the following hold:

1. **Typecheck clean.** `npm run typecheck` (`tsc --noEmit`, strict mode) passes with zero errors across the whole repo, not just new files.
2. **Lint clean.** `npm run lint` passes with zero errors (warnings triaged, not silently ignored).
3. **Build succeeds.** `npm run build` completes without errors, including all new routes.
4. **All new routes load with zero console errors.** `/risk-radar`, `/revenue-leakage`, `/clause-drift`, `/copilot`, `/demo`, `/report`, `/settings`, plus the existing routes that changed (`/dashboard`, `/insights` redirect), verified with the browser console open, no uncaught errors or React warnings.
5. **Unit tests exist and pass** for the new calculation-heavy logic: revenue leakage calculation, risk radar positioning/scoring, clause drift scoring, and search/filter logic used across the new modules.
6. **Playwright e2e coverage** for the new demo path, including the `/demo` guided mode end to end.
7. **Accessibility basics verified**: visible focus states on all interactive elements, label associations on all form inputs (Settings/playbook config, search, Copilot input), sufficient color contrast on risk/severity badges (WCAG AA minimum), and full keyboard navigation through the command palette (open, search, arrow through results, select, close with Escape).

## 2. Test cases to write

Mapped to the module each covers. This list is a minimum; additional edge cases should be added as implementation surfaces them.

### Revenue Leakage Detector

1. **Missed price escalator detection**: given a contract with an escalation clause whose trigger date has passed and no corresponding price increase in the synthetic billing data, the calculation flags the expected vs. actual delta correctly.
2. **Uncaptured auto-renewal uplift detection**: given a contract that auto-renewed without an expected price step-up being applied, the calculation flags the correct uplift amount.
3. **Discount creep detection**: given a contract with a discount that has exceeded its approved expiration terms, the calculation flags the excess discount correctly, and does not false-positive on a discount still within its approved window.
4. **Unrecovered SLA penalty detection**: given a contract with a recorded SLA breach and no corresponding penalty credit/charge, the calculation flags the expected penalty amount.
5. **Aggregate "revenue at risk" total**: the top-level dashboard figure equals the sum of all four leakage categories across the portfolio, and updates correctly when filtered by department, contract type, or counterparty.
6. **Zero-leakage contract**: a contract with no leakage conditions present produces no false-positive findings.

### Contract Risk Radar

7. **Risk positioning calculation**: a contract's radar position is computed correctly from its combined clause-risk severity, active leakage findings, and drift score, using a known fixture with an expected output.
8. **Highest-priority clustering**: a contract with high risk across all three inputs (clause risk, leakage, drift) visibly clusters in the highest-priority zone in the underlying positioning data, distinct from a contract high on only one input.
9. **Filter/group-by correctness**: grouping the radar by department, counterparty, and contract type each produce correct, non-overlapping aggregate groupings that sum back to the full portfolio.

### Clause Drift Analyzer

10. **Point-in-time playbook deviation**: a clause outside the configured house-playbook range (e.g., a liability cap below the acceptable minimum) is flagged as deviating; a clause inside the range is not.
11. **Cumulative drift across amendments**: using the seeded multi-amendment fixture contract, drift score increases monotonically (or is correctly flagged as non-monotonic/stabilizing) across each amendment in the expected direction, matching a known fixture.
12. **Drift trend vs. single-point flag distinction**: a clause that deviated once and then stabilized is distinguishable in the computed output from a clause that has worsened with every amendment, even if both currently show the same point-in-time deviation flag.
13. **Playbook configuration change propagation**: changing a house-playbook range in Settings correctly changes which clauses are flagged as deviating on next computation, without requiring a full data reseed.

### Negotiation Intelligence

14. **Round-count and clause-change derivation**: the negotiation brief's reported round count and "clauses that changed most" list are derived correctly from a known version-history fixture.
15. **Portfolio comparison correctness**: a contract's negotiation pattern is correctly flagged as "unusual" (e.g., high round count) relative to a known portfolio baseline, and a typical contract is not flagged.

### Search / filter logic (shared across modules)

16. **Cross-module filter consistency**: filtering by department or contract type on the Executive Dashboard produces the same underlying contract set as applying the identical filter directly on Revenue Leakage, Risk Radar, and Clause Drift individually.
17. **Command palette search correctness**: searching for a known contract name, clause category, or module name in the command palette returns the expected result within the top results, and keyboard selection navigates to the correct route.

### AI Portfolio Copilot

18. **Cross-contract query correctness**: a query like "contracts with both high clause risk and active leakage" returns exactly the contracts matching both conditions in a known fixture, with citations pointing to the correct contracts/clauses.
19. **Citation traceability**: every Copilot answer in a scripted test set includes at least one citation, and each citation resolves to a real, existing contract/clause in the data.

### Demo Story Mode and report export

20. **Guided tour step sequence**: `/demo` advances through the full expected sequence of steps on manual navigation (click/keyboard), reaching the final step without a dead end or skipped step.
21. **Unified report export completeness**: the exported report includes current data for revenue leakage, risk radar summary, drift findings, and negotiation highlights, matching what's shown live in the app at export time (no stale/cached figures).

## 3. E2E coverage (Playwright)

Extend the existing e2e smoke suite with a new flow: **land on `/dashboard` → open Revenue Leakage from a summary card → drill into a specific leakage finding → navigate to Risk Radar → select a clustered contract → view its Clause Drift trend → open its Negotiation Intelligence brief → switch role to CEO command center → export the unified report → run `/demo` guided mode start to finish.** This flow should run against the seeded demo dataset only (no live LLM calls) and assert zero console errors at each step, consistent with item 4 in Section 1.

## 4. Accessibility checklist (applies to every new screen)

- Every interactive element (button, link, card acting as a link, radar node) has a visible focus outline distinct from the default browser outline removal.
- Every form input (Settings/playbook fields, Copilot input, search) has a properly associated `<label>` (via `htmlFor`/`id` or `aria-label`), verified with an accessibility-tree check, not just visual proximity.
- Risk/severity badges (low/medium/high/critical, leakage category tags) meet WCAG AA contrast (4.5:1 for text) against their background in both the badge's text and border/background combination.
- The command palette is fully keyboard operable: opens via keyboard shortcut, arrow keys move selection, Enter selects, Escape closes, and focus returns to a sensible location on close.
- The 3D contract-risk constellation moment (see `docs/design/design-direction.md`) has a working `prefers-reduced-motion` fallback that is itself keyboard/screen-reader accessible (the static fallback state must not be an inaccessible canvas with no text alternative).

## 5. Regression protection for preserved v0.1 features

Because `/insights` folds into `/dashboard` (see `docs/architecture/upgrade-plan.md` Section 5), the existing v0.1 unit tests covering `src/lib/insights.ts` aggregation logic must continue to pass unmodified, proving the underlying calculation logic was reused, not rewritten, during the fold-in. The existing Playwright upload-to-export smoke test from v0.1 must also continue to pass, confirming the preserved features (upload/parsing, version diff, approvals) were not broken by the v2 UI refresh.
