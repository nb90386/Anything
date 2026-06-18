"use client";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

const axis = { stroke: "rgba(255,255,255,0.25)", fontSize: 10 };
const tooltipStyle = {
  contentStyle: {
    background: "rgba(10,12,22,0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    fontSize: 12,
  },
  labelStyle: { color: "rgba(255,255,255,0.5)" },
};

export function EquityChart({ data, baseline }: { data: { t: string; v: number }[]; baseline?: number }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34e7e4" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#34e7e4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="t" {...axis} tickLine={false} axisLine={false} minTickGap={40} />
        <YAxis {...axis} tickLine={false} axisLine={false} domain={["auto", "auto"]} width={56} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Value"]} />
        {baseline != null && <ReferenceLine y={baseline} stroke="rgba(255,255,255,0.25)" strokeDasharray="4 4" />}
        <Area type="monotone" dataKey="v" stroke="#34e7e4" strokeWidth={2} fill="url(#eq)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MultiLine({ data, keys }: { data: any[]; keys: { key: string; color: string; label: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <XAxis dataKey="t" {...axis} tickLine={false} axisLine={false} minTickGap={40} />
        <YAxis {...axis} tickLine={false} axisLine={false} width={48} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
        <Tooltip {...tooltipStyle} formatter={(v: number, n) => [`${(v * 100).toFixed(2)}%`, n as string]} />
        {keys.map((k) => (
          <Line key={k.key} type="monotone" dataKey={k.key} name={k.label} stroke={k.color} strokeWidth={1.8} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Sparkline({ data, color = "#34e7e4" }: { data: number[]; color?: string }) {
  const d = data.map((p, i) => ({ i, p }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={d}>
        <Line type="monotone" dataKey="p" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
