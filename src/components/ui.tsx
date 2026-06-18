import { ReactNode } from "react";
import { tone } from "@/lib/format";
import clsx from "clsx";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("glass p-5", className)}>{children}</div>;
}

export function Stat({ label, value, sub, subTone }: { label: string; value: ReactNode; sub?: ReactNode; subTone?: number }) {
  return (
    <div className="glass glass-hover p-4">
      <div className="stat-label">{label}</div>
      <div className="stat-value mt-1">{value}</div>
      {sub != null && <div className={clsx("mt-1 text-xs", subTone !== undefined ? tone(subTone) : "text-white/45")}>{sub}</div>}
    </div>
  );
}

export function Badge({ children, color = "slate" }: { children: ReactNode; color?: "green" | "red" | "cyan" | "violet" | "amber" | "slate" }) {
  const map: Record<string, string> = {
    green: "border-neon-green/30 text-neon-green bg-neon-green/10",
    red: "border-neon-red/30 text-neon-red bg-neon-red/10",
    cyan: "border-neon-cyan/30 text-neon-cyan bg-neon-cyan/10",
    violet: "border-neon-violet/30 text-neon-violet bg-neon-violet/10",
    amber: "border-neon-amber/30 text-neon-amber bg-neon-amber/10",
    slate: "border-white/15 text-white/60 bg-white/5",
  };
  return <span className={clsx("chip", map[color])}>{children}</span>;
}

export function SectionTitle({ title, desc, right }: { title: string; desc?: string; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
        {desc && <p className="mt-0.5 text-sm text-white/45">{desc}</p>}
      </div>
      {right}
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="glass overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>{head.map((h) => <th key={h} className="th">{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="glass p-10 text-center text-sm text-white/40">{children}</div>;
}

export function ProgressBar({ value, color = "cyan" }: { value: number; color?: "cyan" | "green" | "violet" | "amber" }) {
  const c: Record<string, string> = {
    cyan: "bg-neon-cyan",
    green: "bg-neon-green",
    violet: "bg-neon-violet",
    amber: "bg-neon-amber",
  };
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div className={clsx("h-full rounded-full", c[color])} style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }} />
    </div>
  );
}
