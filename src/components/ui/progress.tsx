import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800", className)}>
      <div
        className={cn("h-full rounded-full bg-brand-500 transition-all duration-500", barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function RiskGauge({ score }: { score: number }) {
  const color = score >= 70 ? "bg-red-500" : score >= 40 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2">
      <Progress value={score} className="w-24" barClassName={color} />
      <span className="text-xs font-semibold tabular-nums text-ink-600 dark:text-ink-300">{score}/100</span>
    </div>
  );
}
