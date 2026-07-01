import { Clock3, ShieldAlert, UserCheck, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeIn } from "@/components/landing/fade-in";
import { ValueByDepartmentChart } from "@/components/insights/value-by-department-chart";
import { ValueByTypeChart } from "@/components/insights/value-by-type-chart";
import { MonthlyValueChart } from "@/components/insights/monthly-value-chart";
import { StatusDistributionBars } from "@/components/insights/status-distribution-bars";
import { computeInsights } from "@/lib/insights";
import { listContracts } from "@/lib/db/repo";
import { formatCompactMoney, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function InsightsPage() {
  const insights = computeInsights();
  const contracts = listContracts();

  const atRiskValue = contracts.filter((c) => c.riskScore >= 40).reduce((sum, c) => sum + c.value, 0);

  const healthCards = [
    {
      label: "Avg. Cycle Time",
      value: `${insights.avgCycleTimeDays}d`,
      sub: "Effective date minus created date",
      icon: Clock3,
    },
    {
      label: "Total Portfolio Value",
      value: formatCompactMoney(insights.totalValue, insights.currency),
      sub: `${insights.totalContracts} contracts`,
      icon: Wallet,
    },
    {
      label: "Risk-Weighted Exposure",
      value: formatCompactMoney(atRiskValue, insights.currency),
      sub: "Value held in contracts scoring 40+",
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
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">BusinessIQ</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Portfolio-wide commercial intelligence — spend concentration, renewal pipeline, and risk-weighted
            exposure across every contract you manage.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {healthCards.map((kpi) => (
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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <FadeIn delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>Value by Department</CardTitle>
            </CardHeader>
            <CardContent>
              {insights.valueByDepartment.length === 0 ? (
                <EmptyState title="No data yet" description="No contracts to summarize." />
              ) : (
                <ValueByDepartmentChart data={insights.valueByDepartment} />
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.15}>
          <Card>
            <CardHeader>
              <CardTitle>Value by Contract Type</CardTitle>
            </CardHeader>
            <CardContent>
              {insights.valueByType.length === 0 ? (
                <EmptyState title="No data yet" description="No contracts to summarize." />
              ) : (
                <ValueByTypeChart data={insights.valueByType} />
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <FadeIn delay={0.2} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Executed Value Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {insights.monthlyExecutedValue.length === 0 ? (
                <EmptyState title="No timeline data" description="No contracts have an effective date yet." />
              ) : (
                <MonthlyValueChart data={insights.monthlyExecutedValue} />
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.25} className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusDistributionBars distribution={insights.statusDistribution} />
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle>Top Counterparties by Value</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {insights.topCounterpartiesByValue.length === 0 ? (
              <EmptyState title="No counterparties yet" description="No contracts to summarize." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Counterparty</TableHead>
                    <TableHead>Contracts</TableHead>
                    <TableHead>Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {insights.topCounterpartiesByValue.map((c) => (
                    <TableRow key={c.counterparty}>
                      <TableCell className="font-medium text-ink-900 dark:text-white">{c.counterparty}</TableCell>
                      <TableCell>{c.count}</TableCell>
                      <TableCell className="font-medium tabular-nums">{formatMoney(c.value, insights.currency)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
