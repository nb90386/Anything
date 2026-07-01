"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCompactMoney } from "@/lib/utils";
import type { ContractType } from "@/lib/types";

const COLORS = ["#3a63f0", "#5e89f7", "#91b1fb", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0ea5e9", "#525f77"];

export function ValueByTypeChart({ data }: { data: { type: ContractType; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="type" innerRadius={0} outerRadius={95} stroke="none">
          {data.map((d, i) => (
            <Cell key={d.type} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [formatCompactMoney(value), name]}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #dfe4ec",
            fontSize: 12,
            boxShadow: "0 4px 12px -2px rgb(15 23 42 / 0.08)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
