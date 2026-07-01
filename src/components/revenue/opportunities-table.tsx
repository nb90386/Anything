"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ConfidenceBadge } from "@/components/revenue/confidence-badge";
import { OpportunityStatusMenu } from "@/components/revenue/opportunity-status-menu";
import { LEAKAGE_CATEGORY_COPY } from "@/components/revenue/leakage-category-copy";
import { formatMoney, titleCase } from "@/lib/utils";
import type { LeakageOpportunity } from "@/lib/types";

export interface OpportunityRow {
  contractId: string;
  contractTitle: string;
  opportunity: LeakageOpportunity;
}

export function OpportunitiesTable({ rows }: { rows: OpportunityRow[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="h-5 w-5" />}
        title="No open leakage opportunities"
        description="Every flagged opportunity has been recovered or dismissed. Reset the demo data to see the detector run again."
      />
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="overflow-hidden rounded-xl2 border border-ink-100 bg-white shadow-card dark:border-ink-800 dark:bg-ink-900">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Contract</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Estimated value</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Recommended action</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ contractId, contractTitle, opportunity }) => (
              <TableRow key={opportunity.id}>
                <TableCell className="max-w-[220px]">
                  <Link
                    href={`/contracts/${contractId}`}
                    className="line-clamp-2 text-[13px] font-semibold text-ink-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
                  >
                    {contractTitle}
                  </Link>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex">
                        <Badge tone="brand" className="cursor-help">
                          {titleCase(opportunity.category)}
                        </Badge>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">{LEAKAGE_CATEGORY_COPY[opportunity.category]}</TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-ink-900 dark:text-white">
                  {formatMoney(opportunity.estimatedValue, opportunity.currency)}
                </TableCell>
                <TableCell>
                  <ConfidenceBadge confidence={opportunity.confidence} />
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-[13px] text-ink-600 dark:text-ink-300">{opportunity.recommendedAction}</p>
                </TableCell>
                <TableCell className="text-right">
                  <OpportunityStatusMenu id={opportunity.id} status={opportunity.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
