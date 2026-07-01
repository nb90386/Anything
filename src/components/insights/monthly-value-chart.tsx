"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactMoney } from "@/lib/utils";

export function MonthlyValueChart({ data }: { data: { month: string; value: number; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dfe4ec" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#707d94" }} axisLine={{ stroke: "#dfe4ec" }} tickLine={false} />
        <YAxis
          tick={{ fontSize: 12, fill: "#707d94" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatCompactMoney(v)}
          width={64}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            name === "value" ? formatCompactMoney(value) : value,
            name === "value" ? "Value" : "Contracts",
          ]}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #dfe4ec",
            fontSize: 12,
            boxShadow: "0 4px 12px -2px rgb(15 23 42 / 0.08)",
          }}
        />
        <Line type="monotone" dataKey="value" stroke="#2745e4" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
