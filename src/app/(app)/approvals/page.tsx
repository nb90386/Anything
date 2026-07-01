import { ClipboardCheck } from "lucide-react";
import { allApprovalsWithContract } from "@/lib/db/repo";
import { ApprovalsBoard } from "@/components/approvals/approvals-board";

export const dynamic = "force-dynamic";

export default function ApprovalsPage() {
  const all = allApprovalsWithContract();

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
          <ClipboardCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink-950 dark:text-white">Approvals</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Multi-step approval workflow across the portfolio.
          </p>
        </div>
      </div>

      <ApprovalsBoard items={all} />
    </div>
  );
}
