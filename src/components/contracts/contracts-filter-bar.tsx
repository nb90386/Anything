"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Search, X } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { RiskBadge, StatusBadge } from "@/components/contracts/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { CONTRACT_TYPES, DEPARTMENTS } from "@/lib/validation";
import { daysUntil, formatDate, formatMoney } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Contract, ContractStatus, RiskLevel } from "@/lib/types";

const STATUSES: ContractStatus[] = [
  "draft",
  "in_review",
  "negotiation",
  "pending_approval",
  "executed",
  "expired",
  "terminated",
];

const RISK_LEVELS: RiskLevel[] = ["low", "medium", "high", "critical"];

function riskLevel(score: number): RiskLevel {
  if (score >= 70) return "critical";
  if (score >= 40) return "high";
  if (score >= 15) return "medium";
  return "low";
}

function titleCaseWord(s: string) {
  return s
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function ContractsFilterBar({ contracts }: { contracts: Contract[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [department, setDepartment] = useState<string>("all");
  const [risk, setRisk] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contracts.filter((c) => {
      if (q && !`${c.title} ${c.counterparty}`.toLowerCase().includes(q)) return false;
      if (status !== "all" && c.status !== status) return false;
      if (type !== "all" && c.type !== type) return false;
      if (department !== "all" && c.department !== department) return false;
      if (risk !== "all" && riskLevel(c.riskScore) !== risk) return false;
      return true;
    });
  }, [contracts, query, status, type, department, risk]);

  const hasFilters = query || status !== "all" || type !== "all" || department !== "all" || risk !== "all";

  function clearFilters() {
    setQuery("");
    setStatus("all");
    setType("all");
    setDepartment("all");
    setRisk("all");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 sm:min-w-[220px] sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or counterparty..."
            className="pl-9"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-44">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {titleCaseWord(s)}
            </option>
          ))}
        </Select>
        <Select value={type} onChange={(e) => setType(e.target.value)} className="sm:w-48">
          <option value="all">All types</option>
          {CONTRACT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Select value={department} onChange={(e) => setDepartment(e.target.value)} className="sm:w-40">
          <option value="all">All departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
        <Select value={risk} onChange={(e) => setRisk(e.target.value)} className="sm:w-36">
          <option value="all">All risk</option>
          {RISK_LEVELS.map((r) => (
            <option key={r} value={r}>
              {titleCaseWord(r)}
            </option>
          ))}
        </Select>
        {hasFilters ? (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-xs font-medium text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        ) : null}
        <span className="text-xs text-ink-400 sm:ml-auto">
          {filtered.length} of {contracts.length} contracts
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-5 w-5" />}
          title="No contracts match your filters"
          description="Try adjusting or clearing your search and filter criteria."
        />
      ) : (
        <div className="overflow-hidden rounded-xl2 border border-ink-100 bg-white shadow-card dark:border-ink-800 dark:bg-ink-900">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Contract</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const days = daysUntil(c.expirationDate);
                const soon = days !== null && days >= 0 && days < 60;
                const overdue = days !== null && days < 0 && c.status !== "expired" && c.status !== "terminated";
                return (
                  <TableRow key={c.id} className="group cursor-pointer">
                    <TableCell className="p-0">
                      <Link href={`/contracts/${c.id}`} className="flex items-center gap-3 px-4 py-3">
                        <Avatar name={c.counterparty} size="md" />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-ink-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                            {c.title}
                          </p>
                          <p className="truncate text-xs text-ink-500 dark:text-ink-400">{c.counterparty}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/contracts/${c.id}`} className="text-[13px] text-ink-600 dark:text-ink-300">
                        {c.type}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/contracts/${c.id}`} className="text-[13px] text-ink-600 dark:text-ink-300">
                        {c.department}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/contracts/${c.id}`}>
                        <StatusBadge status={c.status} />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/contracts/${c.id}`}>
                        <RiskBadge level={riskLevel(c.riskScore)} />
                      </Link>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      <Link href={`/contracts/${c.id}`} className="font-medium text-ink-900 dark:text-white">
                        {formatMoney(c.value, c.currency)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/contracts/${c.id}`} className="flex items-center gap-1.5 tabular-nums text-[13px] text-ink-600 dark:text-ink-300">
                        {formatDate(c.expirationDate)}
                        {soon || overdue ? (
                          <span
                            className={cn(
                              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                              overdue
                                ? "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                            )}
                          >
                            <AlertTriangle className="h-2.5 w-2.5" />
                            {overdue ? "Overdue" : `${days}d`}
                          </span>
                        ) : null}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/contracts/${c.id}`} className="text-[13px] text-ink-600 dark:text-ink-300">
                        {c.ownerName}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
