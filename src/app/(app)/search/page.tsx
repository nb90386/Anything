import Link from "next/link";
import { FileSearch, LayoutList, SearchX } from "lucide-react";
import { searchContracts } from "@/lib/search";
import { SearchBar } from "@/components/search/search-bar";
import { StatusBadge } from "@/components/contracts/badges";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams.q === "string" ? searchParams.q : "";
  const results = query ? searchContracts(query) : [];

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <FileSearch className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink-950 dark:text-white">
              Search your portfolio
            </h1>
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Search across titles, counterparties, and clause text.
            </p>
          </div>
        </div>
      </div>

      <SearchBar defaultValue={query} />

      {!query ? (
        <EmptyState
          icon={<FileSearch className="h-6 w-6" />}
          title="Search across your contract portfolio"
          description={`Search by keyword: try "liability", "auto-renew", or a counterparty name.`}
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={<SearchX className="h-6 w-6" />}
          title={`No results for "${query}"`}
          description="Try a different keyword, a counterparty name, or a clause category like termination or indemnification."
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
            <LayoutList className="h-3.5 w-3.5" />
            {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
          </div>
          <div className="space-y-3">
            {results.map((r) => (
              <Link key={r.contractId} href={`/contracts/${r.contractId}`} className="block">
                <Card className="transition-shadow hover:shadow-elevated">
                  <CardContent className="space-y-2 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-[15px] font-semibold text-ink-900 dark:text-white">{r.title}</p>
                        <p className="text-sm text-ink-500 dark:text-ink-400">
                          {r.counterparty} &middot; {r.type}
                        </p>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="line-clamp-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                      &hellip;{r.snippet}&hellip;
                    </p>
                    {r.matchedClauseIds.length > 0 ? (
                      <Badge tone="brand">
                        {r.matchedClauseIds.length} {r.matchedClauseIds.length === 1 ? "clause" : "clauses"} matched
                      </Badge>
                    ) : null}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
