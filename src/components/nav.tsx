"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const LINKS = [
  { href: "/", label: "Command Center", icon: "◆" },
  { href: "/signals", label: "Live Signals", icon: "⚡" },
  { href: "/positions", label: "Open Positions", icon: "▣" },
  { href: "/closed", label: "Closed Trades", icon: "✓" },
  { href: "/strategies", label: "Strategy Lab", icon: "⚗" },
  { href: "/wallets", label: "Smart Wallets", icon: "◈" },
  { href: "/markets", label: "Market Intel", icon: "▤" },
  { href: "/risk", label: "Risk Center", icon: "⚠" },
  { href: "/reports", label: "Reports", icon: "▦" },
  { href: "/health", label: "System Health", icon: "♥" },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav className="flex flex-col gap-1 p-3">
      {LINKS.map((l) => {
        const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} className={clsx("navlink", active && "navlink-active")}>
            <span className="w-4 text-center text-white/40">{l.icon}</span>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
