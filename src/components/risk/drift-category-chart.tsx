"use client";

import { BarChart } from "@tremor/react";
import { titleCase } from "@/lib/utils";
import type { ClauseCategory } from "@/lib/types";

export function DriftCategoryChart({
  data,
}: {
  data: { category: ClauseCategory; avgDrift: number; count: number }[];
}) {
  const chartData = data.map((d) => ({
    category: titleCase(d.category),
    "Average drift score": d.avgDrift,
    findings: d.count,
  }));

  return (
    <BarChart
      data={chartData}
      index="category"
      categories={["Average drift score"]}
      colors={["violet"]}
      valueFormatter={(v: number) => `${v}`}
      yAxisWidth={140}
      layout="vertical"
      showLegend={false}
      className="h-80"
    />
  );
}
