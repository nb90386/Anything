import type { ContractStatus } from "@/lib/types";
import { titleCase } from "@/lib/utils";

const STATUS_ORDER: ContractStatus[] = [
  "executed",
  "pending_approval",
  "negotiation",
  "in_review",
  "draft",
  "expired",
  "terminated",
];

const STATUS_COLOR: Record<ContractStatus, string> = {
  executed: "bg-emerald-500",
  pending_approval: "bg-amber-500",
  negotiation: "bg-amber-500",
  in_review: "bg-sky-500",
  draft: "bg-ink-400",
  expired: "bg-ink-300",
  terminated: "bg-red-500",
};

export function StatusDistributionBars({ distribution }: { distribution: Record<ContractStatus, number> }) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-3">
      {STATUS_ORDER.filter((s) => distribution[s] > 0).map((status) => {
        const count = distribution[status];
        const pct = Math.round((count / total) * 100);
        return (
          <div key={status}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-ink-600 dark:text-ink-300">{titleCase(status)}</span>
              <span className="tabular-nums text-ink-400 dark:text-ink-500">
                {count} · {pct}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
              <div
                className={`h-full rounded-full ${STATUS_COLOR[status]} transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
