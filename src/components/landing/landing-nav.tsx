import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand/logo";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100/70 bg-white/70 backdrop-blur-xl dark:border-ink-800/70 dark:bg-ink-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark size={28} />
          <span className="text-sm font-semibold text-ink-900 dark:text-white">
            Malbek <span className="font-normal text-ink-500 dark:text-ink-400">Revenue Intelligence</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/contracts">Contracts</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/demo">Guided demo</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
