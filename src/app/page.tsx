import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileSearch,
  GitCompareArrows,
  MessagesSquare,
  ShieldAlert,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/landing/landing-nav";
import { HeroPreviewCard } from "@/components/landing/hero-preview-card";
import { FadeIn } from "@/components/landing/fade-in";

const FEATURES = [
  {
    icon: FileSearch,
    title: "Contract ingestion & parsing",
    description: "Upload PDF, DOCX, or plain text. Clauses are segmented and classified into 14 legal categories automatically.",
  },
  {
    icon: ShieldAlert,
    title: "Risk extraction",
    description: "A rule-based analysis engine flags uncapped liability, one-sided indemnification, auto-renewal traps, and more — with a recommendation for each.",
  },
  {
    icon: GitCompareArrows,
    title: "Amendment diffing",
    description: "Compare any two versions of a contract side by side, with clause-level change tracking.",
  },
  {
    icon: BarChart3,
    title: "BusinessIQ-style insights",
    description: "Turn a contract portfolio into commercial intelligence: spend by department, renewal exposure, risk concentration, cycle time.",
  },
  {
    icon: MessagesSquare,
    title: "AI chat over your contracts",
    description: "Ask natural-language questions about any contract and get answers grounded in — and citing — the actual clauses.",
  },
  {
    icon: UserCheck,
    title: "Role-based views & approvals",
    description: "Switch between Legal, Sales, Finance, and Procurement perspectives, and simulate multi-step approval workflows.",
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
              "radial-gradient(600px circle at 15% 10%, rgb(58 99 240 / 0.12), transparent 60%), radial-gradient(500px circle at 85% 20%, rgb(58 99 240 / 0.08), transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28">
          <FadeIn className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
              <Sparkles className="h-3.5 w-3.5" />
              Independent portfolio demo — inspired by the CLM product space
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-ink-950 dark:text-white sm:text-6xl">
              Turn a pile of contracts into
              <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent"> commercial intelligence.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-500 dark:text-ink-400">
              A working AI-powered Contract Lifecycle Management copilot — upload a contract, get a risk briefing in
              seconds, track every obligation, diff every amendment, and see your whole portfolio the way legal, sales,
              finance, and procurement each need to.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="group">
                <Link href="/dashboard">
                  Enter the demo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/upload">Try it on your own contract</Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-16">
            <HeroPreviewCard />
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-ink-25 py-20 dark:border-ink-800 dark:bg-ink-900/40">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-ink-950 dark:text-white">
              Everything a modern CLM needs to prove out
            </h2>
            <p className="mt-3 text-ink-500 dark:text-ink-400">
              Every feature below is fully wired — real parsing, a real (offline, deterministic) analysis engine, a
              real SQLite-backed data model, and a documented path to swap in Claude or GPT.
            </p>
          </FadeIn>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
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

      <section className="py-20">
        <FadeIn className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink-950 dark:text-white">See it live in under a minute</h2>
          <p className="mt-3 text-ink-500 dark:text-ink-400">
            Ten pre-loaded contracts, a flagged high-risk SaaS agreement, an amendment ready to diff, and a portfolio
            dashboard already populated — no setup required.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/dashboard">
              Open the dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </FadeIn>
      </section>

      <footer className="border-t border-ink-100 py-8 dark:border-ink-800">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-ink-400">
          Built as an independent internship-portfolio project inspired by the public Contract Lifecycle Management
          (CLM) product category. Not affiliated with, endorsed by, or built in partnership with Malbek Inc. or any
          other CLM vendor.
        </div>
      </footer>
    </div>
  );
}
