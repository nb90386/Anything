"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Search,
  Sparkles,
  UploadCloud,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contracts", label: "Contracts", icon: FileText },
  { href: "/search", label: "Search", icon: Search },
  { href: "/insights", label: "BusinessIQ", icon: BarChart3 },
  { href: "/approvals", label: "Approvals", icon: UserCheck },
  { href: "/upload", label: "Upload", icon: UploadCloud },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-ink-100 bg-white/80 px-3 py-4 backdrop-blur-xl dark:border-ink-800 dark:bg-ink-950/70 lg:flex">
      <Link href="/" className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-card">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink-900 dark:text-white">Contract Copilot</p>
          <p className="text-[11px] text-ink-400">Independent demo</p>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                  : "text-ink-600 hover:bg-ink-50 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800/60 dark:hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-brand-600 dark:text-brand-300" : "text-ink-400 group-hover:text-ink-600 dark:group-hover:text-ink-200")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-lg border border-dashed border-ink-200 p-3 text-[11px] leading-relaxed text-ink-400 dark:border-ink-700">
        Portfolio demo inspired by the CLM product space. Not affiliated with or endorsed by Malbek Inc.
      </div>
    </aside>
  );
}
