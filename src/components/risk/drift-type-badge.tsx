import { Badge } from "@/components/ui/badge";
import type { DriftType } from "@/lib/types";

const DRIFT_TYPE_TONE: Record<DriftType, "success" | "warning" | "danger" | "neutral"> = {
  at_standard: "success",
  more_favorable: "success",
  non_standard_structure: "warning",
  less_favorable: "danger",
};

const DRIFT_TYPE_TEXT: Record<DriftType, string> = {
  at_standard: "At standard",
  more_favorable: "More favorable",
  non_standard_structure: "Non-standard structure",
  less_favorable: "Less favorable",
};

export function DriftTypeBadge({ type }: { type: DriftType }) {
  return <Badge tone={DRIFT_TYPE_TONE[type]}>{DRIFT_TYPE_TEXT[type]}</Badge>;
}

export const DRIFT_TYPE_LABELS = DRIFT_TYPE_TEXT;
