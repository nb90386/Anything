"use client";

import { BarChart, DonutChart } from "@tremor/react";
import { formatCompactMoney } from "@/lib/utils";
import type { ContractType, Department } from "@/lib/types";

const DONUT_COLORS = ["violet", "indigo", "fuchsia", "cyan", "amber", "rose", "emerald", "slate"];

/**
 * Tremor-powered "where is exposure concentrated" charts, replacing the
 * Recharts versions from the old /insights page for visual cohesion with the
 * rest of the dashboard's Tremor-powered numbers. Isolated as a client
 * wrapper, same pattern as risk-donut-chart.tsx.
 */
export function ValueByDepartmentBar({ data }: { data: { department: Department; value: number }[] }) {
  return (
    <BarChart
      data={data}
      index="department"
      categories={["value"]}
      colors={["violet"]}
      valueFormatter={(v: number) => formatCompactMoney(v)}
      showLegend={false}
      className="h-72"
      yAxisWidth={56}
    />
  );
}

export function ValueByTypeDonut({ data }: { data: { type: ContractType; value: number }[] }) {
  return (
    <DonutChart
      data={data}
      index="type"
      category="value"
      colors={DONUT_COLORS}
      valueFormatter={(v: number) => formatCompactMoney(v)}
      className="h-72"
    />
  );
}
