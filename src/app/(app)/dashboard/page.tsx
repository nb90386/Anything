import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  GitCompareArrows,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { RiskGauge } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RiskBadge, ObligationStatusBadge } from "@/components/contracts/badges";
import { FadeIn } from "@/components/landing/fade-in";
import { RoleGreeting } from "@/components/dashboard/role-greeting";
import { RiskDonutChart } from "@/components/dashboard/risk-donut-chart";
import { KpiRow, type KpiItem } from "@/components/dashboard/kpi-row";
import { LeakageOpportunitiesPanel } from "@/components/dashboard/leakage-opportunities-panel";
import { ValueByDepartmentBar, ValueByTypeDonut } from "@/components/dashboard/value-breakdown-charts";
import { computeInsights } from "@/lib/insights";
import { computeRevenueIntelligence } from "@/lib/revenue/summary";
import { computeRiskRadar } from "@/lib/risk/radar-summary";
import { listContracts, getObligations } from "@/lib/db/repo";
import { formatCompactMoney, formatDate, daysUntil, cn, titleCase } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const insights = computeInsights();
  const revenue = computeRevenueIntelligence();
  const radar = computeRiskRadar();
  const contracts = listContracts();
  const allObligations = getObligations();

  const dueSoonObligations = allObligations
    .filter((o) => o.status === "due_soon")
    .map((o) => ({
      contractId: o.contractId,
      contractTitle: contracts.find((c) => c.id === o.contractId)?.title ?? "Unknown",
      obligation: o,
    }));

  const urgentObligations = [...insights.overdueObligations, ...dueSoonObligations].slice(0, 6);

  const kpis: KpiItem[] = [
    {
      label: "Portfolio Value",
      value: formatCompactMoney(insights.totalValue, insights.currency),
      sub: `${insights.totalContracts} contracts under management`,
      icon: "contracts",
      tone: "brand",
    },
    {
      label: "Revenue at Risk This Quarter",
      value: formatCompactMoney(revenue.totalOpenLeakage, revenue.currency),
      sub: `${revenue.openOpportunityCount} open leakage findings`,
      icon: "leakage",
      tone: "danger",
      href: "/revenue-leakage",
    },
    {
      label: "Avg. Clause Drift Score",
      value: `${radar.avgDriftScore}/100`,
      sub: `${radar.contractsAboveThreshold} contracts above alert threshold`,
      icon: "drift",
      tone: "warning",
      href: "/clause-drift",
    },
    {
      label: "Approvals Pending",
      value: insights.approvalsPending.toLocaleString(),
      sub: "Across active workflows",
      icon: "approvals",
      tone: "neutral",
      href: "/approvals",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">
            Executive Command Center
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Revenue at risk, contract risk concentration, and approval bottlenecks, in one screen.
          </p>
          <div className="mt-2">
            <RoleGreeting />
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <KpiRow items={kpis} />
      </FadeIn>

      {/* Revenue leakage: the single most important panel on this page. */}
      <FadeIn delay={0.08}>
        <Card className="border-red-100 dark:border-red-500/20">
          <CardHeader>
            <div>
              <CardTitle>Top revenue leakage opportunities</CardTitle>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                Illustrative, computed from seeded demo data. Every figure traces to a specific contract and clause.
              </p>
            </div>
            <Link
              href="/revenue-leakage"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            <LeakageOpportunitiesPanel summary={revenue} />
          </CardContent>
        </Card>
      </FadeIn>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <FadeIn delay={0.1} className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <RiskDonutChart distribution={insights.riskDistribution} />
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.15} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upcoming Renewals</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {insights.upcomingRenewals.length === 0 ? (
                <EmptyState
                  icon={<Clock3 className="h-5 w-5" />}
                  title="No upcoming renewals"
                  description="Nothing is expiring in the next 180 days."
                />
              ) : (
                <ul className="divide-y divide-ink-100 dark:divide-ink-800">
                  {insights.upcomingRenewals.slice(0, 6).map((r) => {
                    const days = daysUntil(r.expirationDate);
                    const urgency =
                      days !== null && days < 14
                        ? "text-red-600 dark:text-red-400"
                        : days !== null && days < 45
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-ink-500 dark:text-ink-400";
                    return (
                      <li key={r.contractId}>
                        <Link
                          href={`/contracts/${r.contractId}`}
                          className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-ink-25 dark:hover:bg-ink-800/40"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink-800 dark:text-ink-100">{r.title}</p>
                            <p className="text-xs text-ink-400 dark:text-ink-500">
                              Expires {formatDate(r.expirationDate)}
                              {r.autoRenew ? " · Auto-renews" : ""}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-4">
                            <span className={cn("text-xs font-semibold tabular-nums", urgency)}>
                              {days !== null ? `${days}d` : "—"}
                            </span>
                            <span className="hidden text-sm font-medium tabular-nums text-ink-700 dark:text-ink-200 sm:inline">
                              {formatCompactMoney(r.value)}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-ink-300 dark:text-ink-600" />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <FadeIn delay={0.2}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Overdue &amp; Due-Soon Obligations</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {urgentObligations.length === 0 ? (
                <EmptyState
                  icon={<AlertTriangle className="h-5 w-5" />}
                  title="Nothing overdue"
                  description="All obligations are on track."
                />
              ) : (
                <ul className="space-y-2">
                  {urgentObligations.map(({ contractId, contractTitle, obligation }) => (
                    <li key={obligation.id}>
                      <Link
                        href={`/contracts/${contractId}`}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                          obligation.status === "overdue"
                            ? "border-red-200 bg-red-50/60 hover:bg-red-50 dark:border-red-500/30 dark:bg-red-500/10 dark:hover:bg-red-500/15"
                            : "border-ink-100 bg-white hover:bg-ink-25 dark:border-ink-800 dark:bg-ink-900 dark:hover:bg-ink-800/40"
                        )}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink-800 dark:text-ink-100">
                            {obligation.description}
                          </p>
                          <p className="truncate text-xs text-ink-400 dark:text-ink-500">
                            {contractTitle} · Due {formatDate(obligation.dueDate)}
                          </p>
                        </div>
                        <ObligationStatusBadge status={obligation.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.25}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>High-Risk Contracts</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {insights.highRiskContracts.length === 0 ? (
                <EmptyState
                  icon={<ShieldAlert className="h-5 w-5" />}
                  title="No high-risk contracts"
                  description="Everything is scoring under the risk threshold."
                />
              ) : (
                <ul className="space-y-1">
                  {insights.highRiskContracts.slice(0, 6).map((c) => (
                    <li key={c.contractId}>
                      <Link
                        href={`/contracts/${c.contractId}`}
                        className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-ink-25 dark:hover:bg-ink-800/40"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink-800 dark:text-ink-100">{c.title}</p>
                          <div className="mt-1">
                            <RiskGauge score={c.riskScore} />
                          </div>
                        </div>
                        <RiskBadge level={c.riskScore >= 70 ? "critical" : "high"} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <FadeIn delay={0.28}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Value by Department</CardTitle>
              <p className="text-sm text-ink-500 dark:text-ink-400">Where portfolio exposure is concentrated.</p>
            </CardHeader>
            <CardContent className="pt-4">
              {insights.valueByDepartment.length === 0 ? (
                <EmptyState title="No contracts yet" description="Value breakdown will appear once contracts exist." />
              ) : (
                <ValueByDepartmentBar data={insights.valueByDepartment} />
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.32}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Value by Contract Type</CardTitle>
              <p className="text-sm text-ink-500 dark:text-ink-400">Portfolio mix across contract categories.</p>
            </CardHeader>
            <CardContent className="pt-4">
              {insights.valueByType.length === 0 ? (
                <EmptyState title="No contracts yet" description="Value breakdown will appear once contracts exist." />
              ) : (
                <ValueByTypeDonut data={insights.valueByType} />
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <FadeIn delay={0.36}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Clause Drift by Category</CardTitle>
              <p className="text-sm text-ink-500 dark:text-ink-400">
                Average deviation from the house playbook, by clause category.
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              {radar.byCategory.length === 0 ? (
                <EmptyState
                  icon={<GitCompareArrows className="h-5 w-5" />}
                  title="No drift findings yet"
                  description="Clause drift will appear once contracts are scored against the playbook."
                />
              ) : (
                <ul className="space-y-3">
                  {radar.byCategory.slice(0, 6).map((c) => (
                    <li key={c.category}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-ink-600 dark:text-ink-300">{titleCase(c.category)}</span>
                        <span className="tabular-nums text-ink-400 dark:text-ink-500">
                          {c.avgDrift}/100 · {c.count} finding{c.count === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            c.avgDrift >= 65 ? "bg-red-500" : c.avgDrift >= 40 ? "bg-amber-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min(100, c.avgDrift)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/clause-drift"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
              >
                Open Clause Drift Analyzer
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Card className="h-full">
            <CardHeader>
              <div>
                <CardTitle>Approval Bottlenecks</CardTitle>
                <p className="text-sm text-ink-500 dark:text-ink-400">Deal value sitting behind pending approvals.</p>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {insights.approvalsPending === 0 ? (
                <EmptyState
                  icon={<UserCheck className="h-5 w-5" />}
                  title="No approvals pending"
                  description="Every workflow is fully approved."
                />
              ) : (
                <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                  <div>
                    <p className="text-3xl font-semibold tabular-nums text-ink-950 dark:text-white">
                      {insights.approvalsPending}
                    </p>
                    <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">
                      pending approval{insights.approvalsPending === 1 ? "" : "s"} across active workflows
                    </p>
                  </div>
                  <Badge tone="warning">Slowing deal velocity</Badge>
                </div>
              )}
              <Link
                href="/approvals"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
              >
                View approval queue
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
