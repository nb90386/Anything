"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RiskBadge, ObligationStatusBadge } from "@/components/contracts/badges";
import { ApprovalActions } from "@/components/contracts/approval-actions";
import { cn, formatDate, titleCase } from "@/lib/utils";
import { ROLE_LABELS } from "@/components/providers";
import type { ContractWithDetails, Obligation, ObligationStatus } from "@/lib/types";

const OBLIGATION_ORDER: Record<ObligationStatus, number> = {
  overdue: 0,
  due_soon: 1,
  upcoming: 2,
  complete: 3,
};

function sortObligations(obligations: Obligation[]) {
  return [...obligations].sort((a, b) => OBLIGATION_ORDER[a.status] - OBLIGATION_ORDER[b.status]);
}

function ClauseCard({ clause }: { clause: ContractWithDetails["clauses"][number] }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-semibold text-ink-900 dark:text-white">{clause.heading}</span>
            <Badge tone="neutral">{titleCase(clause.category)}</Badge>
            <RiskBadge level={clause.riskLevel} />
          </div>
        </div>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-ink-400 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="border-t border-ink-100 px-5 py-4 dark:border-ink-800">
          <div className="prose-contract text-[13px] text-ink-700 dark:text-ink-300">{clause.text}</div>
          {clause.riskNote ? (
            <div
              className={cn(
                "mt-3 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs",
                clause.riskLevel === "critical" || clause.riskLevel === "high"
                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                  : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
              )}
            >
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{clause.riskNote}</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}

const APPROVAL_ICON: Record<string, typeof Circle> = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
  skipped: Circle,
};

const APPROVAL_TONE: Record<string, string> = {
  pending: "text-amber-500 bg-amber-50 dark:bg-amber-500/15",
  approved: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/15",
  rejected: "text-red-500 bg-red-50 dark:bg-red-500/15",
  skipped: "text-ink-400 bg-ink-100 dark:bg-ink-800",
};

export function ContractTabs({ contract }: { contract: ContractWithDetails }) {
  const sortedClauses = [...contract.clauses].sort((a, b) => a.order - b.order);
  const sortedObligations = sortObligations(contract.obligations);

  return (
    <Tabs defaultValue="overview">
      <TabsList className="flex-wrap">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="clauses">Clauses ({contract.clauses.length})</TabsTrigger>
        <TabsTrigger value="risks">Risks ({contract.risks.length})</TabsTrigger>
        <TabsTrigger value="obligations">Obligations ({contract.obligations.length})</TabsTrigger>
        <TabsTrigger value="approvals">Approvals ({contract.approvals.length})</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-5 space-y-5">
        <Card>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-ink-900 dark:text-white">Overview</h3>
              <p className="prose-contract mt-2 text-[13px] text-ink-600 dark:text-ink-300">
                {contract.summary.overview}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-sm font-semibold text-ink-900 dark:text-white">Key terms</h3>
            <div className="mt-3 overflow-hidden rounded-lg border border-ink-100 dark:border-ink-800">
              <Table>
                <TableBody>
                  {contract.summary.keyTerms.map((t) => (
                    <TableRow key={t.label}>
                      <TableCell className="w-1/3 font-medium text-ink-500 dark:text-ink-400">{t.label}</TableCell>
                      <TableCell className="text-ink-900 dark:text-white">{t.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-sm font-semibold text-ink-900 dark:text-white">Highlights</h3>
            <ul className="mt-3 space-y-2">
              {contract.summary.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-ink-700 dark:text-ink-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {h}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="clauses" className="mt-5 space-y-3">
        {sortedClauses.length === 0 ? (
          <EmptyState title="No clauses parsed" description="This contract has no extracted clauses yet." />
        ) : (
          sortedClauses.map((clause) => <ClauseCard key={clause.id} clause={clause} />)
        )}
      </TabsContent>

      <TabsContent value="risks" className="mt-5 space-y-3">
        {contract.risks.length === 0 ? (
          <EmptyState
            icon={<ShieldAlert className="h-5 w-5" />}
            title="No material risks identified"
            description="Our analysis engine did not flag any material risk findings for this contract."
          />
        ) : (
          contract.risks.map((risk) => (
            <Card key={risk.id}>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-[13px] font-semibold text-ink-900 dark:text-white">{risk.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge tone="neutral">{titleCase(risk.category)}</Badge>
                    <RiskBadge level={risk.severity} />
                  </div>
                </div>
                <p className="text-[13px] text-ink-600 dark:text-ink-300">{risk.description}</p>
                <div className="flex items-start gap-2 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2.5 text-xs text-brand-800 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
                  <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    <span className="font-semibold">Recommendation: </span>
                    {risk.recommendation}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value="obligations" className="mt-5">
        {sortedObligations.length === 0 ? (
          <EmptyState title="No tracked obligations" description="No obligations have been extracted for this contract." />
        ) : (
          <div className="overflow-hidden rounded-xl2 border border-ink-100 bg-white shadow-card dark:border-ink-800 dark:bg-ink-900">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Due date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedObligations.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="tabular-nums">{formatDate(o.dueDate)}</TableCell>
                    <TableCell>
                      <ObligationStatusBadge status={o.status} />
                    </TableCell>
                    <TableCell>{titleCase(o.party)}</TableCell>
                    <TableCell>{titleCase(o.type)}</TableCell>
                    <TableCell className="text-ink-600 dark:text-ink-300">{o.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      <TabsContent value="approvals" className="mt-5">
        {contract.approvals.length === 0 ? (
          <EmptyState title="No approval workflow" description="This contract has no configured approval steps." />
        ) : (
          <ol className="space-y-0">
            {contract.approvals.map((a, i) => {
              const Icon = APPROVAL_ICON[a.status] ?? Circle;
              const isLast = i === contract.approvals.length - 1;
              return (
                <li key={a.id} className="relative flex gap-4 pb-8 last:pb-0">
                  {!isLast ? (
                    <span className="absolute left-4 top-9 h-[calc(100%-2.25rem)] w-px -translate-x-1/2 bg-ink-100 dark:bg-ink-800" />
                  ) : null}
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      APPROVAL_TONE[a.status]
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold text-ink-900 dark:text-white">
                        Step {a.stepOrder}: {a.approverName}
                      </span>
                      <Badge tone="neutral">{ROLE_LABELS[a.approverRole]}</Badge>
                      <Badge
                        tone={
                          a.status === "approved"
                            ? "success"
                            : a.status === "rejected"
                              ? "danger"
                              : a.status === "pending"
                                ? "warning"
                                : "neutral"
                        }
                      >
                        {titleCase(a.status)}
                      </Badge>
                    </div>
                    {a.decidedAt ? (
                      <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">Decided {formatDate(a.decidedAt)}</p>
                    ) : null}
                    {a.comment ? (
                      <p className="mt-1.5 text-[13px] text-ink-600 dark:text-ink-300">&ldquo;{a.comment}&rdquo;</p>
                    ) : null}
                    {a.status === "pending" ? <ApprovalActions approvalId={a.id} /> : null}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </TabsContent>

      <TabsContent value="activity" className="mt-5">
        {contract.activity.length === 0 ? (
          <EmptyState title="No activity yet" description="Actions taken on this contract will appear here." />
        ) : (
          <ol className="space-y-0">
            {contract.activity.map((entry, i) => {
              const isLast = i === contract.activity.length - 1;
              return (
                <li key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {!isLast ? (
                    <span className="absolute left-4 top-9 h-[calc(100%-2.25rem)] w-px -translate-x-1/2 bg-ink-100 dark:bg-ink-800" />
                  ) : null}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                    <AlertTriangle className="hidden h-4 w-4" />
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[13px] text-ink-800 dark:text-ink-100">
                      <span className="font-semibold">{entry.actor}</span> {entry.action}
                    </p>
                    {entry.detail ? (
                      <p className="mt-0.5 text-[13px] text-ink-500 dark:text-ink-400">{entry.detail}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-ink-400 dark:text-ink-500">{formatDate(entry.createdAt)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </TabsContent>
    </Tabs>
  );
}
