"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileBarChart,
  FileText,
  GitCompareArrows,
  LayoutDashboard,
  MessagesSquare,
  PlayCircle,
  Radar,
  RefreshCcw,
  Search,
  Settings,
  TrendingDown,
  UploadCloud,
  UserCheck,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";

const DESTINATIONS = [
  { group: "Command Center", href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { group: "Command Center", href: "/copilot", label: "AI Copilot", icon: MessagesSquare },
  { group: "Intelligence", href: "/risk-radar", label: "Risk Radar", icon: Radar },
  { group: "Intelligence", href: "/revenue-leakage", label: "Revenue Leakage", icon: TrendingDown },
  { group: "Intelligence", href: "/clause-drift", label: "Clause Drift", icon: GitCompareArrows },
  { group: "Contracts", href: "/contracts", label: "Contracts", icon: FileText },
  { group: "Contracts", href: "/search", label: "Search", icon: Search },
  { group: "Contracts", href: "/upload", label: "Upload a contract", icon: UploadCloud },
  { group: "Contracts", href: "/approvals", label: "Approvals", icon: UserCheck },
  { group: "Present", href: "/demo", label: "Guided demo", icon: PlayCircle },
  { group: "Present", href: "/report", label: "Executive report", icon: FileBarChart },
  { group: "Other", href: "/settings", label: "Settings", icon: Settings },
];

export function CommandPaletteTrigger() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const groups = Array.from(new Set(DESTINATIONS.map((d) => d.group)));

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2.5 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-400 transition-colors hover:border-ink-300 hover:text-ink-600 dark:border-ink-700 dark:bg-ink-900 dark:hover:border-ink-600 dark:hover:text-ink-200"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Jump to...</span>
        <kbd className="rounded border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[10px] font-medium text-ink-400 dark:border-ink-700 dark:bg-ink-800">
          &#8984;K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to a page, or ask what you're looking for..." />
        <CommandList>
          <CommandEmpty>No matching page. Try Dashboard, Risk Radar, or Revenue Leakage.</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group} heading={group}>
              {DESTINATIONS.filter((d) => d.group === group).map((d) => (
                <CommandItem key={d.href} value={d.label} onSelect={() => go(d.href)}>
                  <d.icon className="h-4 w-4 text-ink-400" />
                  {d.label}
                  <CommandShortcut>{d.href}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandGroup heading="Actions">
            <CommandItem
              value="Reset demo data"
              onSelect={() => {
                setOpen(false);
                fetch("/api/demo/reset", { method: "POST" }).then(() => router.refresh());
              }}
            >
              <RefreshCcw className="h-4 w-4 text-ink-400" />
              Reset demo data
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
