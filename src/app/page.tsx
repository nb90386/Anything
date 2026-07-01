import Link from "next/link";
import {
  ArrowRight,
  GitCompareArrows,
  MessagesSquare,
  PlayCircle,
  Radar,
  ShieldCheck,
  TrendingDown,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/landing/landing-nav";
import { HeroPreviewCard } from "@/components/landing/hero-preview-card";
import { FadeIn } from "@/components/landing/fade-in";
import { RiskConstellation } from "@/components/three/risk-constellation";

export const dynamic = "force-dynamic";

const CAPABILITIES = [
  {
    icon: TrendingDown,
    title: "Revenue Leakage Detector",
    description:
      "Finds missed price escalators, discount creep, and unrecovered SLA penalties, computed from rule-based logic against seeded contract data, not fabricated numbers.",
  },
  {
    icon: Radar,
    title: "Contract Risk Radar",
    description:
      "Plots the whole portfolio by financial exposure and clause risk, so the highest-priority contracts are visible at a glance, not buried in a table.",
  },
  {
    icon: GitCompareArrows,
    title: "Clause Drift Analyzer",
    description:
      "Tracks how far a contract's language has moved from the house playbook, and whether that drift is getting worse with each amendment.",
  },
  {
    icon: MessagesSquare,
    title: "AI Portfolio Copilot",
    description:
      "Ask cross-contract questions in plain language and get answers that cite the specific contracts and clauses behind them.",
  },
  {
    icon: UserCheck,
    title: "Role-based command centers",
    description:
      "Legal, Sales, Finance, Procurement, and CEO each land on a view built around the one question they actually ask first.",
  },
  {
    icon: PlayCircle,
    title: "Guided demo mode",
    description:
      "A manually-advanced walkthrough of the same live data and screens, built for a board-level audience with limited time.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-ink-950">
      <LandingNav />

      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(600px circle at 15% 10%, rgb(124 58 237 / 0.12), transparent 60%), radial-gradient(500px circle at 85% 20%, rgb(124 58 237 / 0.08), transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Private demo, independent portfolio project
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-ink-950 dark:text-white sm:text-6xl">
              Contract data,
              <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent"> read as a board decision.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-500 dark:text-ink-400">
              An intelligence layer on top of a CLM, not a replacement for one. Revenue at risk, contracts needing
              executive review, and clause drift by business unit, in one connected view instead of four reports.
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-14 flex flex-col items-center">
            <RiskConstellation className="h-[380px] w-[380px] sm:h-[440px] sm:w-[440px]" />
            <p className="-mt-6 max-w-sm text-center text-xs text-ink-400 dark:text-ink-500">
              Each point is a contract in the portfolio; color shows risk severity, orbiting one shared intelligence
              layer.
            </p>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href="/dashboard">
                Open the dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/demo">Take the guided demo</Link>
            </Button>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-16">
            <HeroPreviewCard />
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-ink-25 py-16 dark:border-ink-800 dark:bg-ink-900/40">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <h2 className="text-xl font-semibold tracking-tight text-ink-950 dark:text-white">What this is</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
              This is an independent, non-affiliated portfolio project inspired by Malbek&apos;s public CLM product
              category. It is built with informal permission to reference Malbek&apos;s name and brand colors inside
              this private demo only. It is not for public release, and it is not official Malbek software, endorsed
              by or built in partnership with Malbek Inc.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-ink-950 dark:text-white">What this shows</h2>
            <p className="mt-3 text-ink-500 dark:text-ink-400">
              Six capabilities, each grounded in a real engine running against seeded contract data, not a mockup.
            </p>
          </FadeIn>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((f, i) => (
              <FadeIn key={f.title} delay={0.05 * i}>
                <div className="h-full rounded-xl2 border border-ink-100 bg-white p-6 shadow-card transition-shadow hover:shadow-elevated dark:border-ink-800 dark:bg-ink-900">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-ink-900 dark:text-white">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500 dark:text-ink-400">{f.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink-100 py-20 dark:border-ink-800">
        <FadeIn className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink-950 dark:text-white">
            See the whole portfolio in one screen
          </h2>
          <p className="mt-3 text-ink-500 dark:text-ink-400">
            Twenty-five seeded contracts, live leakage and drift findings, and a dashboard already populated. No
            setup, no external accounts.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Open the dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/demo">Take the guided demo</Link>
            </Button>
          </div>
        </FadeIn>
      </section>

      <footer className="border-t border-ink-100 py-8 dark:border-ink-800">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-ink-400">
          Built as an independent internship-portfolio project inspired by the public Contract Lifecycle Management
          (CLM) product category. Not affiliated with, endorsed by, or built in partnership with Malbek Inc. or any
          other CLM vendor. Malbek&apos;s name and brand colors are used here with informal permission for this
          private demo only.
        </div>
      </footer>
    </div>
  );
}
