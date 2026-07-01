import { Badge } from "@/components/ui/badge";
import { titleCase } from "@/lib/utils";
import type { ContractStatus, ObligationStatus, RiskLevel } from "@/lib/types";
import { AlertTriangle, CheckCircle2, Clock, FileEdit, Gavel, ShieldAlert, XCircle } from "lucide-react";

const RISK_TONE: Record<RiskLevel, "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
  critical: "danger",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <Badge tone={RISK_TONE[level]} className={level === "critical" ? "ring-1 ring-red-400/60" : undefined}>
      {level === "critical" || level === "high" ? <ShieldAlert className="h-3 w-3" /> : null}
      {titleCase(level)}
    </Badge>
  );
}

const STATUS_TONE: Record<ContractStatus, "neutral" | "brand" | "success" | "warning" | "danger" | "info"> = {
  draft: "neutral",
  in_review: "info",
  negotiation: "warning",
  pending_approval: "warning",
  executed: "success",
  expired: "neutral",
  terminated: "danger",
};

const STATUS_ICON: Record<ContractStatus, typeof FileEdit> = {
  draft: FileEdit,
  in_review: Clock,
  negotiation: Gavel,
  pending_approval: Clock,
  executed: CheckCircle2,
  expired: XCircle,
  terminated: XCircle,
};

export function StatusBadge({ status }: { status: ContractStatus }) {
  const Icon = STATUS_ICON[status];
  return (
    <Badge tone={STATUS_TONE[status]}>
      <Icon className="h-3 w-3" />
      {titleCase(status)}
    </Badge>
  );
}

const OBLIGATION_TONE: Record<ObligationStatus, "success" | "warning" | "danger" | "neutral"> = {
  upcoming: "neutral",
  due_soon: "warning",
  overdue: "danger",
  complete: "success",
};

export function ObligationStatusBadge({ status }: { status: ObligationStatus }) {
  return (
    <Badge tone={OBLIGATION_TONE[status]}>
      {status === "overdue" ? <AlertTriangle className="h-3 w-3" /> : null}
      {titleCase(status)}
    </Badge>
  );
}
