import { FileBarChart } from "lucide-react";
import { FadeIn } from "@/components/landing/fade-in";
import { ReportPicker } from "@/components/reporting/report-picker";
import { PortfolioReportPreview } from "@/components/reporting/portfolio-report-preview";
import { allApprovalsWithContract, listContracts } from "@/lib/db/repo";
import { computeInsights } from "@/lib/insights";
import { computeRevenueIntelligence } from "@/lib/revenue/summary";
import { computeRiskRadar } from "@/lib/risk/radar-summary";

export const dynamic = "force-dynamic";

export default function ReportPage() {
  const contracts = listContracts();
  const insights = computeInsights();
  const revenue = computeRevenueIntelligence();
  const radar = computeRiskRadar();
  const pendingApprovalsCount = allApprovalsWithContract().filter((a) => a.approval.status === "pending").length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <FadeIn>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">
          <FileBarChart className="h-6 w-6 text-brand-600 dark:text-brand-400" />
          Executive Report
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-500 dark:text-ink-400">
          A board-ready summary of the portfolio, or a deep-dive export for a single contract. Both pull live data
          at generation time.
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <ReportPicker contracts={contracts} />
      </FadeIn>

      <FadeIn delay={0.1}>
        <PortfolioReportPreview
          insights={insights}
          revenue={revenue}
          radar={radar}
          pendingApprovalsCount={pendingApprovalsCount}
        />
      </FadeIn>
    </div>
  );
}
