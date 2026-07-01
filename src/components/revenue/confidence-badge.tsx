import { Badge } from "@/components/ui/badge";
import { titleCase } from "@/lib/utils";
import type { LeakageConfidence } from "@/lib/types";

// High confidence means the finding is strongly evidenced and more likely to
// be real, recoverable value, so it gets the strongest visual treatment.
const CONFIDENCE_TONE: Record<LeakageConfidence, "success" | "warning" | "neutral"> = {
  high: "success",
  medium: "warning",
  low: "neutral",
};

export function ConfidenceBadge({ confidence }: { confidence: LeakageConfidence }) {
  return <Badge tone={CONFIDENCE_TONE[confidence]}>{titleCase(confidence)} confidence</Badge>;
}
