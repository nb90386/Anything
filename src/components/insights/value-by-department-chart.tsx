"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactMoney } from "@/lib/utils";
import type { Department } from "@/lib/types";

export function ValueByDepartmentChart({
  data,
}: {
  data: { department: Department; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dfe4ec" />
        <XAxis
          dataKey="department"
          tick={{ fontSize: 12, fill: "#707d94" }}
          axisLine={{ stroke: "#dfe4ec" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#707d94" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatCompactMoney(v)}
          width={64}
        />
        <Tooltip
          formatter={(value: number) => formatCompactMoney(value)}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #dfe4ec",
            fontSize: 12,
            boxShadow: "0 4px 12px -2px rgb(15 23 42 / 0.08)",
          }}
        />
        <Bar dataKey="value" fill="#3a63f0" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
