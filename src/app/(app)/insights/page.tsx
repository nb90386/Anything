import { redirect } from "next/navigation";

// The v0.1 "BusinessIQ" insights view is now folded into the single
// executive command center at /dashboard (see docs/architecture/upgrade-plan.md,
// "Decision: what happens to /insights"). This keeps the app to one landing
// surface for portfolio intelligence rather than several overlapping reports.
// The v0.1 aggregation logic (src/lib/insights.ts) and its chart components
// (src/components/insights/*) are preserved and reused by /dashboard, not
// deleted.
export default function InsightsRedirect() {
  redirect("/dashboard");
}
