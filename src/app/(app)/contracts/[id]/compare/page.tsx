import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, GitCompareArrows } from "lucide-react";
import { getContract, getVersions } from "@/lib/db/repo";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { VersionDiffView } from "@/components/compare/version-diff-view";

export const dynamic = "force-dynamic";

export default function ComparePage({ params }: { params: { id: string } }) {
  const contract = getContract(params.id);
  if (!contract) notFound();

  const versions = getVersions(params.id);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <div>
        <Link
          href={`/contracts/${contract.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {contract.title}
        </Link>
        <div className="mt-3 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <GitCompareArrows className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink-950 dark:text-white">
              Compare versions
            </h1>
            <p className="text-sm text-ink-500 dark:text-ink-400">{contract.title} &middot; {contract.counterparty}</p>
          </div>
        </div>
      </div>

      {versions.length < 2 ? (
        <EmptyState
          icon={<GitCompareArrows className="h-6 w-6" />}
          title="No amendments to compare yet"
          description="Amendments will appear here once this contract has more than one version. Redlines and version diffs show up automatically as soon as a second version is added."
          action={
            <Button asChild variant="outline" size="sm">
              <Link href={`/contracts/${contract.id}`}>
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to contract
              </Link>
            </Button>
          }
        />
      ) : (
        <VersionDiffView versions={versions} />
      )}
    </div>
  );
}
