import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  FileStack,
  ShieldAlert,
  UserCheck,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { RiskGauge } from "@/components/ui/progress";
import { RiskBadge, StatusBadge, ObligationStatusBadge } from "@/components/contracts/badges";
import { FadeIn } from "@/components/landing/fade-in";
import { RoleGreeting } from "@/components/dashboard/role-greeting";
import { RiskDonutChart } from "@/components/dashboard/risk-donut-chart";
import { computeInsights } from "@/lib/insights";
import { listContracts, getObligations } from "@/lib/db/repo";
import { formatCompactMoney, formatDate, daysUntil, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const insights = computeInsights();
  const contracts = listContracts();
  const allObligations = getObligations();

  const highRiskCount = insights.riskDistribution.high + insights.riskDistribution.critical;

  const dueSoonObligations = allObligations
    .filter((o) => o.status === "due_soon")
    .map((o) => ({
      contractId: o.contractId,
      contractTitle: contracts.find((c) => c.id === o.contractId)?.title ?? "Unknown",
      obligation: o,
    }));

  const urgentObligations = [...insights.overdueObligations, ...dueSoonObligations].slice(0, 6);

  const recentContracts = contracts.slice(0, 6);

  const kpis = [
    {
      label: "Total Contracts",
      value: insights.totalContracts.toLocaleString(),
      sub: `${insights.approvalsPending} awaiting approval`,
      icon: FileStack,
    },
    {
      label: "Portfolio Value",
      value: formatCompactMoney(insights.totalValue, insights.currency),
      sub: `Across ${insights.totalContracts} contracts`,
      icon: Wallet,
    },
    {
      label: "High-Risk Contracts",
      value: highRiskCount.toLocaleString(),
      sub: `${insights.riskDistribution.critical} critical severity`,
      icon: ShieldAlert,
    },
    {
      label: "Approvals Pending",
      value: insights.approvalsPending.toLocaleString(),
      sub: "Across active workflows",
      icon: UserCheck,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Your portfolio command center — risk, renewals, obligations, and approvals in one view.
          </p>
          <div className="mt-2">
            <RoleGreeting />
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="transition-shadow hover:shadow-elevated">
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">
                    {kpi.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums text-ink-950 dark:text-white">
                    {kpi.value}
                  </p>
                  <p className="mt-1 text-xs text-ink-400 dark:text-ink-500">{kpi.sub}</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                  <kpi.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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

      <FadeIn delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {recentContracts.length === 0 ? (
              <EmptyState title="No contracts yet" description="Upload a contract to get started." />
            ) : (
              <ul className="divide-y divide-ink-100 dark:divide-ink-800">
                {recentContracts.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/contracts/${c.id}`}
                      className="flex flex-wrap items-center justify-between gap-2 py-3 transition-colors hover:bg-ink-25 dark:hover:bg-ink-800/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink-800 dark:text-ink-100">{c.title}</p>
                        <p className="text-xs text-ink-400 dark:text-ink-500">
                          {c.counterparty} · Updated {formatDate(c.updatedAt)}
                        </p>
                      </div>
                      <StatusBadge status={c.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
