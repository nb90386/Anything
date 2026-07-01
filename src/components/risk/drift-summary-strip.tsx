import { Card } from "@/components/ui/card";
import { titleCase } from "@/lib/utils";
import { DRIFT_TYPE_LABELS } from "@/components/risk/drift-type-badge";
import type { ClauseDriftFinding, DriftType } from "@/lib/types";

const STRIP_ORDER: DriftType[] = ["less_favorable", "non_standard_structure", "more_favorable", "at_standard"];

const STRIP_TONE: Record<DriftType, string> = {
  less_favorable: "text-red-600 dark:text-red-400",
  non_standard_structure: "text-amber-600 dark:text-amber-400",
  more_favorable: "text-emerald-600 dark:text-emerald-400",
  at_standard: "text-ink-500 dark:text-ink-400",
};

export function DriftSummaryStrip({ findings }: { findings: ClauseDriftFinding[] }) {
  const counts = new Map<DriftType, number>();
  const categoryCounts = new Map<string, number>();
  for (const f of findings) {
    counts.set(f.driftType, (counts.get(f.driftType) ?? 0) + 1);
    categoryCounts.set(f.category, (categoryCounts.get(f.category) ?? 0) + 1);
  }
  const topCategory = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  return (
    <Card className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-5">
      {STRIP_ORDER.map((type) => (
        <div key={type}>
          <p className={`text-2xl font-semibold tabular-nums ${STRIP_TONE[type]}`}>{counts.get(type) ?? 0}</p>
          <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">{DRIFT_TYPE_LABELS[type]}</p>
        </div>
      ))}
      <div>
        <p className="truncate text-2xl font-semibold text-ink-900 dark:text-white">
          {topCategory ? titleCase(topCategory[0]) : "None"}
        </p>
        <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
          Most common category{topCategory ? ` (${topCategory[1]})` : ""}
        </p>
      </div>
    </Card>
  );
}
