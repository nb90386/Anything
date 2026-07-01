"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileBarChart,
  FileText,
  GitCompareArrows,
  LayoutDashboard,
  Menu,
  MessagesSquare,
  PlayCircle,
  Radar,
  Search,
  Settings,
  TrendingDown,
  UploadCloud,
  UserCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/copilot", label: "AI Copilot", icon: MessagesSquare },
  { href: "/risk-radar", label: "Risk Radar", icon: Radar },
  { href: "/revenue-leakage", label: "Revenue Leakage", icon: TrendingDown },
  { href: "/clause-drift", label: "Clause Drift", icon: GitCompareArrows },
  { href: "/contracts", label: "Contracts", icon: FileText },
  { href: "/search", label: "Search", icon: Search },
  { href: "/upload", label: "Upload", icon: UploadCloud },
  { href: "/approvals", label: "Approvals", icon: UserCheck },
  { href: "/demo", label: "Guided Demo", icon: PlayCircle },
  { href: "/report", label: "Executive Report", icon: FileBarChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <Button variant="ghost" size="icon" aria-label="Open navigation" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink-950/50" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex h-full w-64 flex-col overflow-y-auto bg-white p-4 dark:bg-ink-950">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink-900 dark:text-white">Menu</span>
              <Button variant="ghost" size="icon" aria-label="Close navigation" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium",
                      active
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                        : "text-ink-600 dark:text-ink-300"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
