import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100/70 bg-white/70 backdrop-blur-xl dark:border-ink-800/70 dark:bg-ink-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-card">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-ink-900 dark:text-white">Contract Intelligence Copilot</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/contracts">Contracts</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/insights">BusinessIQ</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard">Open demo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
