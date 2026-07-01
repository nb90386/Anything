"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileBarChart,
  FileText,
  GitCompareArrows,
  LayoutDashboard,
  MessagesSquare,
  PlayCircle,
  Radar,
  Search,
  Settings,
  TrendingDown,
  UploadCloud,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/brand/logo";
import { CommandPaletteTrigger } from "./command-palette";

const NAV_GROUPS = [
  {
    label: "Command Center",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/copilot", label: "AI Copilot", icon: MessagesSquare },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/risk-radar", label: "Risk Radar", icon: Radar },
      { href: "/revenue-leakage", label: "Revenue Leakage", icon: TrendingDown },
      { href: "/clause-drift", label: "Clause Drift", icon: GitCompareArrows },
    ],
  },
  {
    label: "Contracts",
    items: [
      { href: "/contracts", label: "Contracts", icon: FileText },
      { href: "/search", label: "Search", icon: Search },
      { href: "/upload", label: "Upload", icon: UploadCloud },
      { href: "/approvals", label: "Approvals", icon: UserCheck },
    ],
  },
  {
    label: "Present",
    items: [
      { href: "/demo", label: "Guided Demo", icon: PlayCircle },
      { href: "/report", label: "Executive Report", icon: FileBarChart },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-100 bg-white/80 px-3 py-4 backdrop-blur-xl dark:border-ink-800 dark:bg-ink-950/70 lg:flex">
      <Link href="/" className="mb-5 flex items-center gap-2 px-2">
        <BrandMark size={32} className="shrink-0 rounded-lg shadow-card" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">Malbek Revenue Intelligence</p>
          <p className="text-[11px] text-ink-400">Private demo, not official Malbek software</p>
        </div>
      </Link>

      <div className="mb-4 px-1">
        <CommandPaletteTrigger />
      </div>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-500">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
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
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        active ? "text-brand-600 dark:text-brand-300" : "text-ink-400 group-hover:text-ink-600 dark:group-hover:text-ink-200"
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-3 pt-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
              : "text-ink-600 hover:bg-ink-50 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800/60 dark:hover:text-white"
          )}
        >
          <Settings className="h-4 w-4 text-ink-400" />
          Settings
        </Link>
        <div className="rounded-lg border border-dashed border-ink-200 p-3 text-[11px] leading-relaxed text-ink-400 dark:border-ink-700">
          Private internship portfolio demo inspired by Malbek&apos;s public CLM product. Not official Malbek
          software and not for public release.
        </div>
      </div>
    </aside>
  );
}
