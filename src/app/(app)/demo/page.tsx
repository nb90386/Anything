import { PlayCircle } from "lucide-react";
import { FadeIn } from "@/components/landing/fade-in";
import { DemoWalkthrough } from "@/components/demo/demo-walkthrough";
import { buildDemoSteps } from "@/components/demo/demo-steps";
import { computeInsights } from "@/lib/insights";
import { computeRevenueIntelligence } from "@/lib/revenue/summary";
import { computeRiskRadar } from "@/lib/risk/radar-summary";

export const dynamic = "force-dynamic";

export default function DemoPage() {
  const insights = computeInsights();
  const revenue = computeRevenueIntelligence();
  const radar = computeRiskRadar();
  const steps = buildDemoSteps(insights, revenue, radar);

  return (
    <div className="mx-auto max-w-5xl space-y-10 py-4">
      <FadeIn className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
          <PlayCircle className="h-3.5 w-3.5" />
          Guided demo mode
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink-950 dark:text-white sm:text-4xl">
          The seven-minute walkthrough
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-ink-500 dark:text-ink-400">
          A live-data narrative for presenting this command center to an executive, from the first dollar figure to
          the board-ready export. Every number below is computed from the current portfolio, not scripted.
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <DemoWalkthrough steps={steps} />
      </FadeIn>
    </div>
  );
}
