import { Card } from "@/components/ui/card";
import { AlertOctagon, Gauge, ListChecks, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

function KpiCard({
  icon: Icon,
  label,
  value,
  tone,
  hint,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  tone: "brand" | "danger" | "warning" | "neutral";
  hint: string;
}) {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
    danger: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300",
    warning: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
    neutral: "bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300",
  }[tone];

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", toneClasses)}>
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-ink-950 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{hint}</p>
    </Card>
  );
}

export function RiskKpiRow({
  avgDriftScore,
  contractsAboveThreshold,
  totalFindings,
  severeFindings,
}: {
  avgDriftScore: number;
  contractsAboveThreshold: number;
  totalFindings: number;
  severeFindings: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={Gauge}
        label="Portfolio avg. drift"
        value={`${avgDriftScore}/100`}
        tone={avgDriftScore >= 40 ? "danger" : avgDriftScore >= 18 ? "warning" : "brand"}
        hint="Average distance from the house playbook across every measured clause."
      />
      <KpiCard
        icon={AlertOctagon}
        label="Above alert threshold"
        value={String(contractsAboveThreshold)}
        tone={contractsAboveThreshold > 0 ? "danger" : "neutral"}
        hint="Contracts averaging 40+ drift, Legal's review trigger."
      />
      <KpiCard
        icon={ListChecks}
        label="Total drift findings"
        value={String(totalFindings)}
        tone="neutral"
        hint="Clauses compared against the standard clause library."
      />
      <KpiCard
        icon={ShieldAlert}
        label="Severe findings"
        value={String(severeFindings)}
        tone={severeFindings > 0 ? "danger" : "neutral"}
        hint="Findings scored 65+, furthest from playbook language."
      />
    </div>
  );
}
