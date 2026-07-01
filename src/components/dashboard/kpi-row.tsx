"use client";

import Link from "next/link";
import { Card, Flex, Metric, Text } from "@tremor/react";
import type { LucideIcon } from "lucide-react";
import { FileStack, ShieldAlert, TrendingDown, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiItem {
  label: string;
  value: string;
  sub: string;
  icon: "contracts" | "leakage" | "drift" | "approvals";
  tone: "brand" | "danger" | "warning" | "neutral";
  href?: string;
}

const ICONS: Record<KpiItem["icon"], LucideIcon> = {
  contracts: FileStack,
  leakage: TrendingDown,
  drift: ShieldAlert,
  approvals: UserCheck,
};

const TONE_CLASSES: Record<KpiItem["tone"], string> = {
  brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
  danger: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300",
  warning: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  neutral: "bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300",
};

/**
 * Tremor-powered KPI row. Isolated as a "use client" wrapper (Tremor's chart
 * and layout primitives need the client runtime), mirroring the pattern
 * already used by risk-donut-chart.tsx for Recharts.
 */
export function KpiRow({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        const content = (
          <Card
            className="transition-shadow hover:shadow-elevated"
            decoration="top"
            decorationColor={item.tone === "danger" ? "red" : item.tone === "warning" ? "amber" : "violet"}
          >
            <Flex alignItems="start" justifyContent="between">
              <div className="min-w-0">
                <Text className="truncate text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">
                  {item.label}
                </Text>
                <Metric className="mt-2 tabular-nums text-ink-950 dark:text-white">{item.value}</Metric>
                <Text className="mt-1 truncate text-xs text-ink-400 dark:text-ink-500">{item.sub}</Text>
              </div>
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", TONE_CLASSES[item.tone])}>
                <Icon className="h-5 w-5" />
              </div>
            </Flex>
          </Card>
        );
        return item.href ? (
          <Link key={item.label} href={item.href} className="block">
            {content}
          </Link>
        ) : (
          <div key={item.label}>{content}</div>
        );
      })}
    </div>
  );
}
