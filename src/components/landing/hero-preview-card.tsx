import { ArrowUpRight, ShieldAlert, TrendingDown, Wallet } from "lucide-react";
import { computeInsights } from "@/lib/insights";
import { computeRevenueIntelligence } from "@/lib/revenue/summary";
import { computeRiskRadar } from "@/lib/risk/radar-summary";
import { formatCompactMoney } from "@/lib/utils";

/**
 * Server-rendered snapshot of live portfolio numbers, used as the landing
 * page's proof point. Every figure here comes from the same computeInsights /
 * computeRevenueIntelligence / computeRiskRadar functions the dashboard uses,
 * nothing is hardcoded.
 */
export function HeroPreviewCard() {
  const insights = computeInsights();
  const revenue = computeRevenueIntelligence();
  const radar = computeRiskRadar();

  const stats = [
    {
      label: "Revenue at risk this quarter",
      value: formatCompactMoney(revenue.totalOpenLeakage, revenue.currency),
      icon: TrendingDown,
      tone: "text-red-600 dark:text-red-400",
    },
    {
      label: "Portfolio value tracked",
      value: formatCompactMoney(insights.totalValue, insights.currency),
      icon: Wallet,
      tone: "text-brand-600 dark:text-brand-300",
    },
    {
      label: "Avg. clause drift score",
      value: `${radar.avgDriftScore}/100`,
      icon: ShieldAlert,
      tone: "text-amber-600 dark:text-amber-400",
    },
  ];

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
          {stats.map((s) => (
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
