"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ClipboardCheck, Filter, XCircle } from "lucide-react";
import type { ApprovalStep, Contract } from "@/lib/types";
import { useRole, ROLE_LABELS } from "@/components/providers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, titleCase } from "@/lib/utils";
import { ApprovalQueueActions } from "@/components/approvals/approval-queue-actions";

type Item = { contract: Contract; approval: ApprovalStep };

export function ApprovalsBoard({ items }: { items: Item[] }) {
  const { role } = useRole();
  const [scope, setScope] = useState<"mine" | "all">("mine");

  const scoped = useMemo(
    () => (scope === "mine" ? items.filter((i) => i.approval.approverRole === role) : items),
    [items, scope, role]
  );

  const pending = scoped.filter((i) => i.approval.status === "pending");
  const resolved = scoped
    .filter((i) => i.approval.status !== "pending")
    .sort((a, b) => (b.approval.decidedAt ?? "").localeCompare(a.approval.decidedAt ?? ""));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 rounded-lg bg-ink-100/70 p-1 dark:bg-ink-800/60">
          <button
            type="button"
            onClick={() => setScope("mine")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              scope === "mine"
                ? "bg-white text-ink-900 shadow-card dark:bg-ink-950 dark:text-white"
                : "text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
            }`}
          >
            My approvals ({ROLE_LABELS[role]})
          </button>
          <button
            type="button"
            onClick={() => setScope("all")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              scope === "all"
                ? "bg-white text-ink-900 shadow-card dark:bg-ink-950 dark:text-white"
                : "text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
            }`}
          >
            All approvals
          </button>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-ink-400">
          <Filter className="h-3.5 w-3.5" />
          {scope === "mine" ? `Filtered to steps assigned to ${ROLE_LABELS[role]}` : "Showing every approval step"}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
          Pending your review ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <EmptyState
            icon={<ClipboardCheck className="h-6 w-6" />}
            title="Nothing pending"
            description={
              scope === "mine"
                ? `There are no approval steps waiting on ${ROLE_LABELS[role]} right now.`
                : "There are no pending approval steps across the portfolio right now."
            }
          />
        ) : (
          <div className="space-y-3">
            {pending.map(({ contract, approval }) => (
              <Card key={approval.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={approval.approverName} />
                    <div>
                      <Link
                        href={`/contracts/${contract.id}`}
                        className="text-[15px] font-semibold text-ink-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-300"
                      >
                        {contract.title}
                      </Link>
                      <p className="text-sm text-ink-500 dark:text-ink-400">{contract.counterparty}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Badge tone="neutral">Step {approval.stepOrder}</Badge>
                        <Badge tone="brand">{titleCase(approval.approverRole)}</Badge>
                        <span className="text-xs text-ink-400">{approval.approverName}</span>
                      </div>
                    </div>
                  </div>
                  <ApprovalQueueActions approvalId={approval.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
          Resolved ({resolved.length})
        </h2>
        {resolved.length === 0 ? (
          <p className="text-sm text-ink-400">No resolved approval steps yet.</p>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract</TableHead>
                  <TableHead>Step</TableHead>
                  <TableHead>Approver</TableHead>
                  <TableHead>Decision</TableHead>
                  <TableHead>Decided</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resolved.map(({ contract, approval }) => (
                  <TableRow key={approval.id}>
                    <TableCell>
                      <Link href={`/contracts/${contract.id}`} className="font-medium text-ink-800 hover:text-brand-600 dark:text-ink-100 dark:hover:text-brand-300">
                        {contract.title}
                      </Link>
                      <p className="text-xs text-ink-400">{contract.counterparty}</p>
                    </TableCell>
                    <TableCell>{approval.stepOrder}</TableCell>
                    <TableCell>
                      {approval.approverName}
                      <span className="ml-1 text-xs text-ink-400">({titleCase(approval.approverRole)})</span>
                    </TableCell>
                    <TableCell>
                      {approval.status === "approved" ? (
                        <Badge tone="success">
                          <CheckCircle2 className="h-3 w-3" />
                          Approved
                        </Badge>
                      ) : approval.status === "rejected" ? (
                        <Badge tone="danger">
                          <XCircle className="h-3 w-3" />
                          Rejected
                        </Badge>
                      ) : (
                        <Badge tone="neutral">{titleCase(approval.status)}</Badge>
                      )}
                      {approval.comment ? <p className="mt-0.5 text-xs text-ink-400">&ldquo;{approval.comment}&rdquo;</p> : null}
                    </TableCell>
                    <TableCell>{formatDate(approval.decidedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </section>
    </div>
  );
}
