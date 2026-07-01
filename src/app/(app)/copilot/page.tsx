import { MessagesSquare } from "lucide-react";
import { FadeIn } from "@/components/landing/fade-in";
import { PortfolioChat } from "@/components/copilot/portfolio-chat";

export default function CopilotPage() {
  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col space-y-6">
      <FadeIn>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">
          <MessagesSquare className="h-6 w-6 text-brand-600 dark:text-brand-400" />
          AI Portfolio Copilot
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-500 dark:text-ink-400">
          A deterministic, offline engine that reasons across every contract in the portfolio at once: leakage,
          renewals, approvals, indemnity exposure, clause drift, and more. Every answer cites the contracts it
          used, so nothing here is a black box.
        </p>
      </FadeIn>

      <FadeIn delay={0.05} className="flex-1">
        <PortfolioChat />
      </FadeIn>
    </div>
  );
}
