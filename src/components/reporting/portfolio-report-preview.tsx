import { AlertTriangle, TrendingDown, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatMoney, titleCase } from "@/lib/utils";
import type { PortfolioInsights, RevenueIntelligenceSummary, RiskRadarSummary } from "@/lib/types";

export function PortfolioReportPreview({
  insights,
  revenue,
  radar,
  pendingApprovalsCount,
}: {
  insights: PortfolioInsights;
  revenue: RevenueIntelligenceSummary;
  radar: RiskRadarSummary;
  pendingApprovalsCount: number;
}) {
  return (
    <Card className="mx-auto max-w-3xl p-8 sm:p-10">
      <div className="border-b border-ink-100 pb-6 dark:border-ink-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          Portfolio executive report
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">
          Malbek Revenue Intelligence and Contract Risk Command Center
        </h2>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Generated {formatDate(new Date().toISOString())}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 py-6 sm:grid-cols-4">
        <Metric label="Total value" value={formatMoney(insights.totalValue, insights.currency)} />
        <Metric label="Open leakage" value={formatMoney(revenue.totalOpenLeakage, revenue.currency)} tone="danger" />
        <Metric label="Avg. drift" value={`${radar.avgDriftScore}/100`} />
        <Metric label="Approvals pending" value={String(pendingApprovalsCount)} />
      </div>

      <Separator />

      <Section icon={<TrendingDown className="h-4 w-4" />} title="Top leakage opportunities">
        {revenue.topOpportunities.length === 0 ? (
          <EmptyLine text="No open revenue leakage opportunities are currently flagged." />
        ) : (
          <ol className="space-y-2.5">
            {revenue.topOpportunities.slice(0, 3).map((t) => (
              <li key={t.opportunity.id} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium text-ink-900 dark:text-white">{t.contractTitle}</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400">
                    {titleCase(t.opportunity.category)} &middot; {titleCase(t.opportunity.confidence)} confidence
                  </p>
                </div>
                <p className="shrink-0 font-semibold tabular-nums text-ink-900 dark:text-white">
                  {formatMoney(t.opportunity.estimatedValue, t.opportunity.currency)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Separator />

      <Section icon={<AlertTriangle className="h-4 w-4" />} title="Highest-risk contracts">
        {insights.highRiskContracts.length === 0 ? (
          <EmptyLine text="No contracts currently score in the high or critical risk band." />
        ) : (
          <ol className="space-y-2.5">
            {insights.highRiskContracts.slice(0, 3).map((c) => (
              <li key={c.contractId} className="flex items-center justify-between gap-3 text-sm">
                <p className="font-medium text-ink-900 dark:text-white">{c.title}</p>
                <p className="shrink-0 font-semibold tabular-nums text-ink-900 dark:text-white">{c.riskScore}/100</p>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Separator />

      <Section icon={<UserCheck className="h-4 w-4" />} title="Approvals pending">
        <p className="text-sm text-ink-600 dark:text-ink-300">
          {pendingApprovalsCount === 0
            ? "No deals are currently blocked on approval."
            : `${pendingApprovalsCount} approval step(s) are waiting on a decision across the portfolio.`}
        </p>
      </Section>

      <p className="mt-8 border-t border-ink-100 pt-4 text-xs leading-relaxed text-ink-400 dark:border-ink-800 dark:text-ink-500">
        All leakage and drift figures are illustrative, based on seeded demo data. This is an independent portfolio
        demo project inspired by the Contract Lifecycle Management (CLM) product category. Not affiliated with
        Malbek Inc.
      </p>
    </Card>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "danger" }) {
  return (
    <div>
      <p
        className={`text-xl font-semibold tabular-nums ${
          tone === "danger" ? "text-red-600 dark:text-red-400" : "text-ink-900 dark:text-white"
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">{label}</p>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="py-6">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-800 dark:text-ink-100">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <p className="text-sm italic text-ink-400 dark:text-ink-500">{text}</p>;
}
