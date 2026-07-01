import type { Clause, Contract, LeakageCategory, LeakageConfidence, Obligation, RiskFinding } from "../types";

export interface LeakageDraft {
  category: LeakageCategory;
  title: string;
  description: string;
  estimatedValue: number;
  confidence: LeakageConfidence;
  recommendedAction: string;
}

const ESCALATOR_PATTERN = /increase|escalat|adjust.{0,25}(annually|each year|per year)/i;

function ageInDays(effectiveDate: string): number {
  const eff = new Date(effectiveDate).getTime();
  return Math.round((Date.now() - eff) / (1000 * 60 * 60 * 24));
}

/**
 * Deterministic, rule-based revenue leakage detection for a single contract.
 * Every rule is derived from data this app already computes (clause category,
 * risk findings, obligation status, contract metadata), not fabricated
 * numbers. Estimated values are conservative percentages of contract value,
 * clearly labeled as estimates in the UI, not claimed as exact figures.
 */
export function detectLeakage(
  contract: Contract,
  clauses: Clause[],
  risks: RiskFinding[],
  obligations: Obligation[]
): LeakageDraft[] {
  const findings: LeakageDraft[] = [];
  const paymentClause = clauses.find((c) => c.category === "payment");
  const slaClause = clauses.find((c) => c.category === "service_level");

  // 1. Missed price escalator on a long-running auto-renewing contract.
  if (
    contract.autoRenew &&
    paymentClause &&
    !ESCALATOR_PATTERN.test(paymentClause.text) &&
    ageInDays(contract.effectiveDate) >= 300
  ) {
    findings.push({
      category: "missed_escalator",
      title: "No annual price escalator on an auto-renewing contract",
      description: `${contract.title} has been active for over ${Math.floor(
        ageInDays(contract.effectiveDate) / 30
      )} months and renews automatically, but the payment terms contain no annual increase clause. Pricing has likely stayed flat while costs have not.`,
      estimatedValue: Math.round(contract.value * 0.04),
      confidence: "medium",
      recommendedAction: "Add a 3 to 5 percent annual escalator at the next renewal window, or renegotiate pricing before the next auto-renewal date.",
    });
  }

  // 2. Renewal notice window creating exposure to an unwanted lock-in or a missed renegotiation window.
  const renewalObligation = obligations.find((o) => o.type === "renewal_notice");
  if (contract.autoRenew && renewalObligation && (renewalObligation.status === "overdue" || renewalObligation.status === "due_soon")) {
    const overdue = renewalObligation.status === "overdue";
    findings.push({
      category: "auto_renewal_exposure",
      title: overdue ? "Renewal notice window has already passed" : "Renewal notice window closing soon",
      description: overdue
        ? `The deadline to send a non-renewal or renegotiation notice for ${contract.title} has passed. This contract will auto-renew on its existing terms unless action is taken immediately.`
        : `${contract.title} renews automatically and the notice deadline is approaching. This is the last window to renegotiate pricing or terms before the current terms lock in for another cycle.`,
      estimatedValue: Math.round(contract.value * 0.08),
      confidence: overdue ? "high" : "medium",
      recommendedAction: overdue
        ? "Escalate immediately: confirm whether the auto-renewal already triggered and assess options to renegotiate post-renewal."
        : "Assign an owner this week to decide renew, renegotiate, or exit before the notice deadline.",
    });
  }

  // 3. Payment term risk already flagged by the risk engine (e.g. high late fee, long net terms).
  const paymentRisk = risks.find((r) => r.category === "payment");
  if (paymentRisk) {
    findings.push({
      category: "payment_term_mismatch",
      title: "Payment terms working against cash flow",
      description: `${paymentRisk.title} on ${contract.title}: ${paymentRisk.description}`,
      estimatedValue: Math.round(contract.value * 0.015),
      confidence: "medium",
      recommendedAction: paymentRisk.recommendation,
    });
  }

  // 4. SLA credit language present, but no evidence it has ever been claimed.
  if (slaClause && /credit/i.test(slaClause.text)) {
    findings.push({
      category: "sla_penalty_recoverable",
      title: "Service credit clause with no claim history",
      description: `${contract.title} includes a service level credit remedy. Without a tracked history of uptime claims, any shortfalls to date have likely gone unclaimed.`,
      estimatedValue: Math.round(contract.value * 0.02),
      confidence: "low",
      recommendedAction: "Pull vendor uptime reports for the trailing 12 months and file a credit claim for any shortfall months.",
    });
  }

  // 5. Contract lapsed with no renewal or replacement on file.
  if (contract.status === "expired" && !contract.autoRenew) {
    findings.push({
      category: "renewal_uplift_risk",
      title: "Contract expired with no renewal on file",
      description: `${contract.title} with ${contract.counterparty} expired and was not set to auto-renew. If the relationship is still active operationally, it is currently running with no enforceable commercial terms.`,
      estimatedValue: Math.round(contract.value * 0.15),
      confidence: "medium",
      recommendedAction: "Confirm whether the relationship is still active. If so, execute a renewal immediately to restore enforceable terms and pricing protection.",
    });
  }

  // 6. Audit rights never exercised.
  const auditObligation = obligations.find((o) => o.type === "audit" && o.status === "overdue");
  if (auditObligation) {
    findings.push({
      category: "unclaimed_credit",
      title: "Audit right never exercised",
      description: `${contract.title} grants audit rights that have not been exercised on schedule. Compliance-driven billing corrections or credits may be going uncaptured.`,
      estimatedValue: Math.round(contract.value * 0.01),
      confidence: "low",
      recommendedAction: "Schedule the contractual audit before the right lapses or becomes harder to enforce.",
    });
  }

  return findings.filter((f) => f.estimatedValue > 0);
}

/**
 * Portfolio-level rule: a counterparty with two or more contracts of the same
 * type where a later contract's value has not grown versus an earlier one is
 * a strong signal of a renewal that missed a price increase. Run once across
 * the full seeded portfolio (not per-contract) since it needs to compare
 * contracts to each other.
 */
export function detectCrossContractLeakage(contracts: Contract[]): { contractId: string; draft: LeakageDraft }[] {
  const results: { contractId: string; draft: LeakageDraft }[] = [];
  const byCounterparty = new Map<string, Contract[]>();
  for (const c of contracts) {
    const list = byCounterparty.get(c.counterparty) ?? [];
    list.push(c);
    byCounterparty.set(c.counterparty, list);
  }

  for (const [counterparty, group] of byCounterparty) {
    if (group.length < 2) continue;
    const sameType = group.filter((c) => c.type === group[0].type);
    if (sameType.length < 2) continue;
    const sorted = [...sameType].sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      if (curr.value <= prev.value && prev.value > 0) {
        results.push({
          contractId: curr.id,
          draft: {
            category: "discount_creep",
            title: `Renewal with ${counterparty} did not increase in value`,
            description: `${curr.title} (effective ${curr.effectiveDate}) renewed the relationship with ${counterparty} at ${curr.value >= prev.value ? "the same" : "a lower"} value than the prior agreement (${prev.title}, ${prev.effectiveDate}). Absent a documented reason, this looks like a missed pricing conversation at renewal.`,
            estimatedValue: Math.round(Math.max(prev.value - curr.value, prev.value * 0.03)),
            confidence: "medium",
            recommendedAction: "Confirm scope is unchanged. If so, bring pricing up to current rates at the next renewal cycle.",
          },
        });
      }
    }
  }
  return results;
}
