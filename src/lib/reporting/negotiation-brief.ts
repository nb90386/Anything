import type { Clause, NegotiationBrief, RiskFinding } from "../types";
import { findStandardClause } from "../risk/standard-clauses-data";
import type { StandardClause } from "../types";

const FALLBACK_BY_CATEGORY: Record<string, { fallback: string; walkAway: string }> = {
  liability: {
    fallback: "Accept an 18-month cap if 12 months is rejected, with carve-outs preserved.",
    walkAway: "No cap at all, or a cap that excludes gross negligence and IP infringement carve-outs.",
  },
  indemnification: {
    fallback: "Accept one-directional indemnification only if liability is capped and fault-based.",
    walkAway: "Uncapped, no-fault indemnification with no liability ceiling.",
  },
  termination: {
    fallback: "Accept a 15-day cure period if 30 days is rejected.",
    walkAway: "Immediate termination rights with no cure period at all.",
  },
  payment: {
    fallback: "Accept a modest late fee increase if paired with a longer grace period.",
    walkAway: "Interest rates above 2 percent per month or no grace period.",
  },
  renewal: {
    fallback: "Accept a 60-day notice window if 30 days is rejected.",
    walkAway: "A notice window longer than 90 days, which functions as a lock-in trap.",
  },
  non_compete: {
    fallback: "Accept 24 months if 12 is rejected, provided scope stays limited to the specific business line.",
    walkAway: "Worldwide scope or a term longer than 3 years.",
  },
  data_privacy: {
    fallback: "Accept a 5-business-day notification window if 72 hours is rejected.",
    walkAway: "No breach notification commitment at all.",
  },
  intellectual_property: {
    fallback: "Accept full assignment if a license-back for general tooling and methods is preserved.",
    walkAway: "Assignment of pre-existing IP with no license-back.",
  },
  assignment: {
    fallback: "Accept broader assignment rights limited to affiliates, excluding direct competitors.",
    walkAway: "Free assignment to any party, including competitors, with no consent or notice.",
  },
  warranty: {
    fallback: "Accept a shorter warranty period if a defined remedy path is preserved.",
    walkAway: "A full as-is disclaimer with zero remedy for non-conformance.",
  },
};

export function buildNegotiationBrief(
  contractId: string,
  contractTitle: string,
  counterparty: string,
  clause: Clause,
  risk: RiskFinding | null,
  standardClauses: StandardClause[]
): NegotiationBrief {
  const standard = findStandardClause(clause.category, standardClauses);
  const fallback = FALLBACK_BY_CATEGORY[clause.category] ?? {
    fallback: "Negotiate toward the standard playbook position before accepting current language.",
    walkAway: "Language materially worse than the current draft with no offsetting concession.",
  };

  const issueSummary = risk
    ? `${risk.title} in ${contractTitle} with ${counterparty}: ${risk.description}`
    : `${clause.heading} in ${contractTitle} with ${counterparty} diverges from the standard playbook position.`;

  const talkingPoints = [
    standard ? `Playbook position: ${standard.playbookPosition}` : "No playbook entry exists for this clause category; treat case by case.",
    risk ? `Business risk if unresolved: ${risk.description}` : "Confirm this deviation was an intentional business decision, not an oversight.",
    risk ? `Recommended ask: ${risk.recommendation}` : "Propose standard playbook language and document any agreed deviation.",
  ];

  return {
    contractId,
    category: clause.category,
    issueSummary,
    currentPosition: clause.text.length > 400 ? clause.text.slice(0, 400) + "..." : clause.text,
    recommendedPosition: standard?.standardText ?? "Align to the general playbook position for this clause category.",
    fallbackPosition: fallback.fallback,
    walkAwayPosition: fallback.walkAway,
    talkingPoints,
  };
}

/** Builds one negotiation brief per non-low-risk clause on a contract, highest severity first. */
export function buildContractNegotiationBriefs(
  contractId: string,
  contractTitle: string,
  counterparty: string,
  clauses: Clause[],
  risks: RiskFinding[],
  standardClauses: StandardClause[]
): NegotiationBrief[] {
  const severityRank: Record<string, number> = { critical: 3, high: 2, medium: 1, low: 0 };
  const flaggedClauses = clauses
    .filter((c) => c.riskLevel !== "low")
    .sort((a, b) => severityRank[b.riskLevel] - severityRank[a.riskLevel]);

  return flaggedClauses.map((clause) => {
    const risk = risks.find((r) => r.clauseId === clause.id) ?? risks.find((r) => r.category === clause.category) ?? null;
    return buildNegotiationBrief(contractId, contractTitle, counterparty, clause, risk, standardClauses);
  });
}
