import Link from "next/link";
import { Plus } from "lucide-react";
import { listContracts } from "@/lib/db/repo";
import { Button } from "@/components/ui/button";
import { ContractsFilterBar } from "@/components/contracts/contracts-filter-bar";
import { FadeIn } from "@/components/landing/fade-in";

export const dynamic = "force-dynamic";

export default function ContractsPage() {
  const contracts = listContracts();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <FadeIn className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">
            Contracts
            <span className="ml-2 align-middle text-sm font-medium text-ink-400 dark:text-ink-500">
              {contracts.length}
            </span>
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Browse, search, and drill into every contract in the portfolio.
          </p>
        </div>
        <Button asChild>
          <Link href="/upload">
            <Plus className="h-4 w-4" />
            New contract
          </Link>
        </Button>
      </FadeIn>

      <FadeIn delay={0.05}>
        <ContractsFilterBar contracts={contracts} />
      </FadeIn>
    </div>
  );
}
