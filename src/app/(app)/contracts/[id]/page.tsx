import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Download, GitCompareArrows, MessagesSquare } from "lucide-react";
import { getContractWithDetails } from "@/lib/db/repo";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { RiskGauge } from "@/components/ui/progress";
import { StatusBadge } from "@/components/contracts/badges";
import { ContractTabs } from "@/components/contracts/contract-tabs";
import { ChatPanel } from "@/components/contracts/chat-panel";
import { FadeIn } from "@/components/landing/fade-in";
import { formatDate, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function ContractDetailPage({ params }: { params: { id: string } }) {
  const contract = getContractWithDetails(params.id);
  if (!contract) notFound();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <FadeIn>
        <div className="rounded-xl2 border border-ink-100 bg-white p-6 shadow-card dark:border-ink-800 dark:bg-ink-900">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <Avatar name={contract.counterparty} size="lg" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold tracking-tight text-ink-950 dark:text-white">
                    {contract.title}
                  </h1>
                  <StatusBadge status={contract.status} />
                </div>
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                  {contract.counterparty} &middot; {contract.type} &middot; {contract.department}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-ink-500 dark:text-ink-400">
                  <span className="font-medium tabular-nums text-ink-800 dark:text-ink-100">
                    {formatMoney(contract.value, contract.currency)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(contract.effectiveDate)} &rarr; {formatDate(contract.expirationDate)}
                  </span>
                  <span>Owner: {contract.ownerName}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <RiskGauge score={contract.riskScore} />
              <div className="flex flex-wrap items-center justify-end gap-2">
                {contract.versions.length > 1 ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/contracts/${contract.id}/compare`}>
                      <GitCompareArrows className="h-3.5 w-3.5" />
                      Compare versions
                    </Link>
                  </Button>
                ) : null}
                <Button asChild variant="outline" size="sm">
                  <a href={`/api/export/${contract.id}`} download>
                    <Download className="h-3.5 w-3.5" />
                    Export report
                  </a>
                </Button>
                <Button asChild size="sm" className="lg:hidden">
                  <a href="#ask-ai">
                    <MessagesSquare className="h-3.5 w-3.5" />
                    Ask AI
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <FadeIn delay={0.05} className="lg:col-span-2">
          <ContractTabs contract={contract} />
        </FadeIn>
        <FadeIn delay={0.1} className="lg:col-span-1">
          <div id="ask-ai">
            <ChatPanel contractId={contract.id} contractTitle={contract.title} />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
