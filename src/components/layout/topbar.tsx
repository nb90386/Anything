"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Moon, RefreshCcw, Sun } from "lucide-react";
import { ROLE_LABELS, useRole, useTheme } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import type { Role } from "@/lib/types";
import { MobileNav } from "./mobile-nav";

const ROLE_OWNER: Record<Role, string> = {
  legal: "Priya Shah",
  sales: "Elena Cruz",
  finance: "Sam Okafor",
  procurement: "Jordan Kim",
  executive: "Dana Reyes",
};

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/copilot": "AI Copilot",
  "/risk-radar": "Risk Radar",
  "/revenue-leakage": "Revenue Leakage",
  "/clause-drift": "Clause Drift",
  "/contracts": "Contracts",
  "/search": "Search",
  "/upload": "Upload",
  "/approvals": "Approvals",
  "/demo": "Guided Demo",
  "/report": "Executive Report",
  "/settings": "Settings",
};

function currentPageTitle(pathname: string): string | null {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const base = "/" + pathname.split("/").filter(Boolean)[0];
  return PAGE_TITLES[base] ?? null;
}

export function Topbar() {
  const { theme, toggle } = useTheme();
  const { role, setRole } = useRole();
  const router = useRouter();
  const pathname = usePathname();
  const [resetting, setResetting] = useState(false);

  const resetDemo = async () => {
    setResetting(true);
    try {
      await fetch("/api/demo/reset", { method: "POST" });
      router.refresh();
    } finally {
      setResetting(false);
    }
  };

  const title = currentPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-100 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-ink-800 dark:bg-ink-950/70 sm:px-6">
      <MobileNav />

      <div className="flex flex-1 items-center gap-3 min-w-0">
        {title ? <h1 className="truncate text-sm font-semibold text-ink-800 dark:text-ink-100">{title}</h1> : null}
        <Badge tone="brand" className="hidden shrink-0 sm:inline-flex">
          Private demo
        </Badge>
      </div>

      <label className="hidden items-center gap-2 sm:flex">
        <span className="text-xs font-medium text-ink-400">Viewing as</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          aria-label="Switch role view"
          className="h-8 rounded-lg border border-ink-200 bg-white px-2 text-xs font-medium text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200"
        >
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <Button variant="ghost" size="icon" onClick={resetDemo} title="Reset demo data" aria-label="Reset demo data" disabled={resetting}>
        <RefreshCcw className={`h-4 w-4 ${resetting ? "animate-spin" : ""}`} />
      </Button>

      <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle dark mode" title="Toggle dark mode">
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <Avatar name={ROLE_OWNER[role]} size="sm" />
    </header>
  );
}
