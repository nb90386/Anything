import { AlertTriangle, ArrowUpRight, FileText, TrendingUp } from "lucide-react";

const STATS = [
  { label: "Contracts under management", value: "10", icon: FileText, tone: "text-brand-600 dark:text-brand-300" },
  { label: "Portfolio value tracked", value: "$3.7M", icon: TrendingUp, tone: "text-emerald-600 dark:text-emerald-400" },
  { label: "High-risk findings flagged", value: "5", icon: AlertTriangle, tone: "text-amber-600 dark:text-amber-400" },
];

export function HeroPreviewCard() {
  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-ink-100 bg-white p-2 shadow-popover dark:border-ink-800 dark:bg-ink-900">
      <div className="rounded-xl border border-ink-100 bg-ink-25 p-6 dark:border-ink-800 dark:bg-ink-950/60">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">Portfolio snapshot</p>
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Live from seeded demo data <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-lg border border-ink-100 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
              <s.icon className={`mb-3 h-5 w-5 ${s.tone}`} />
              <p className="text-2xl font-semibold tabular-nums text-ink-900 dark:text-white">{s.value}</p>
              <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
