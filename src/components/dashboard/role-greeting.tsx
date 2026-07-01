"use client";

import { ROLE_LABELS, useRole } from "@/components/providers";

const ROLE_FOCUS: Record<string, string> = {
  legal: "risk exposure, obligations, and clauses that need attention",
  sales: "renewals, deal value, and counterparty relationships",
  finance: "portfolio value, cycle time, and spend concentration",
  procurement: "vendor contracts, renewal timing, and obligations",
  executive: "portfolio health, risk, and commercial performance",
};

export function RoleGreeting() {
  const { role } = useRole();
  return (
    <p className="text-sm text-ink-500 dark:text-ink-400">
      Welcome back — here&apos;s what&apos;s relevant to{" "}
      <span className="font-medium text-ink-700 dark:text-ink-200">{ROLE_LABELS[role]}</span> today:{" "}
      {ROLE_FOCUS[role]}.
    </p>
  );
}
