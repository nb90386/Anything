"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { RiskLevel } from "@/lib/types";
import { titleCase } from "@/lib/utils";

const RISK_COLORS: Record<RiskLevel, string> = {
  low: "#16a34a",
  medium: "#d97706",
  high: "#dc2626",
  critical: "#991b1b",
};

const ORDER: RiskLevel[] = ["low", "medium", "high", "critical"];

export function RiskDonutChart({ distribution }: { distribution: Record<RiskLevel, number> }) {
  const data = ORDER.map((level) => ({ level, value: distribution[level] })).filter((d) => d.value > 0);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-ink-400 dark:text-ink-500">
        No contracts yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-48 w-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="level"
              innerRadius={56}
              outerRadius={80}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.level} fill={RISK_COLORS[d.level]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value} contracts`, titleCase(name)]}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #dfe4ec",
                fontSize: 12,
                boxShadow: "0 4px 12px -2px rgb(15 23 42 / 0.08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums text-ink-900 dark:text-white">{total}</span>
          <span className="text-[11px] text-ink-400">contracts</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {ORDER.map((level) => (
          <div key={level} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: RISK_COLORS[level] }} />
              <span className="text-ink-600 dark:text-ink-300">{titleCase(level)}</span>
            </div>
            <span className="font-medium tabular-nums text-ink-800 dark:text-ink-100">{distribution[level]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
