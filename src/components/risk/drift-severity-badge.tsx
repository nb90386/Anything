import { Badge } from "@/components/ui/badge";
import { driftSeverityLabel } from "@/lib/risk/clause-drift";

const SEVERITY_TONE = {
  "on-playbook": "success",
  minor: "info",
  moderate: "warning",
  severe: "danger",
} as const;

const SEVERITY_TEXT: Record<ReturnType<typeof driftSeverityLabel>, string> = {
  "on-playbook": "On playbook",
  minor: "Minor drift",
  moderate: "Moderate drift",
  severe: "Severe drift",
};

export function DriftSeverityBadge({ score }: { score: number }) {
  const label = driftSeverityLabel(score);
  return <Badge tone={SEVERITY_TONE[label]}>{SEVERITY_TEXT[label]}</Badge>;
}

export function driftSeverityColorClass(score: number): string {
  const label = driftSeverityLabel(score);
  if (label === "severe") return "bg-risk-critical";
  if (label === "moderate") return "bg-risk-high";
  if (label === "minor") return "bg-risk-medium";
  return "bg-risk-low";
}
