"use client";

import { Briefcase, DollarSign, Gavel, ShoppingCart, Sparkles } from "lucide-react";
import { ROLE_LABELS, useRole } from "@/components/providers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

const ROLE_ICON: Record<Role, typeof Gavel> = {
  legal: Gavel,
  sales: Briefcase,
  finance: DollarSign,
  procurement: ShoppingCart,
  executive: Sparkles,
};

const ROLE_DESCRIPTION: Record<Role, string> = {
  legal: "Emphasizes clause risk, playbook compliance, and clause drift findings.",
  sales: "Emphasizes deal velocity, approval bottlenecks, and renewal timing.",
  finance: "Emphasizes revenue at risk, renewal cost exposure, and leakage by category.",
  procurement: "Emphasizes vendor and counterparty concentration and SLA recovery.",
  executive: "A single-page synthesis of all four: risk, revenue, drift, and approvals.",
};

export function RoleSwitcherCard() {
  const { role, setRole } = useRole();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Role view</CardTitle>
          <CardDescription>
            Changes which command center loads and what each page emphasizes first. This is a UX lens, not a
            permissions boundary: every role can see every contract.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(Object.keys(ROLE_LABELS) as Role[]).map((r) => {
            const Icon = ROLE_ICON[r];
            const active = role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                aria-pressed={active}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                  active
                    ? "border-brand-300 bg-brand-50 dark:border-brand-500/40 dark:bg-brand-500/10"
                    : "border-ink-200 hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800/50"
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    active
                      ? "bg-brand-600 text-white"
                      : "bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      active ? "text-brand-800 dark:text-brand-200" : "text-ink-900 dark:text-white"
                    )}
                  >
                    {ROLE_LABELS[r]}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">{ROLE_DESCRIPTION[r]}</p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
