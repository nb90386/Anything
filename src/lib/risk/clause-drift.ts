import type { Clause, DriftType, StandardClause } from "../types";
import { scoreRelevance } from "../text-search";
import { findStandardClause } from "./standard-clauses-data";

export interface ClauseDriftDraft {
  clauseId: string;
  category: Clause["category"];
  driftScore: number;
  driftType: DriftType;
  summary: string;
  standardClauseId: string | null;
}

const RISK_PENALTY: Record<Clause["riskLevel"], number> = {
  low: 0,
  medium: 28,
  high: 48,
  critical: 68,
};

/** Categories the playbook does not take a position on; skipped, not measured. */
const UNMEASURED_CATEGORIES = new Set(["governing_law", "force_majeure", "other"]);

export function analyzeClauseDrift(clause: Clause, standardClauses: StandardClause[]): ClauseDriftDraft | null {
  if (UNMEASURED_CATEGORIES.has(clause.category)) return null;

  const standard = findStandardClause(clause.category, standardClauses);
  if (!standard) return null;

  const similarity = scoreRelevance(clause.text, standard.standardText);
  const similarityGap = Math.round((1 - Math.min(1, similarity)) * 55);
  const driftScore = Math.max(0, Math.min(100, similarityGap + RISK_PENALTY[clause.riskLevel]));

  let driftType: DriftType;
  let summary: string;

  if (driftScore < 18) {
    driftType = "at_standard";
    summary = `Matches the ${standard.title.toLowerCase()} playbook position closely. No drift action needed.`;
  } else if (clause.riskLevel === "low") {
    driftType = "non_standard_structure";
    summary = `Worded differently from the standard "${standard.title}" clause, but not flagged as risky. Legal should confirm intent still matches the playbook.`;
  } else {
    driftType = "less_favorable";
    summary = clause.riskNote
      ? `Diverges from the "${standard.title}" playbook position: ${clause.riskNote}`
      : `Diverges from the "${standard.title}" playbook position in ${clause.category.replace("_", " ")}.`;
  }

  return { clauseId: clause.id, category: clause.category, driftScore, driftType, summary, standardClauseId: standard.id };
}

export function analyzeContractDrift(clauses: Clause[], standardClauses: StandardClause[]): ClauseDriftDraft[] {
  return clauses
    .map((c) => analyzeClauseDrift(c, standardClauses))
    .filter((d): d is ClauseDriftDraft => d !== null);
}

export function driftSeverityLabel(score: number): "on-playbook" | "minor" | "moderate" | "severe" {
  if (score < 18) return "on-playbook";
  if (score < 40) return "minor";
  if (score < 65) return "moderate";
  return "severe";
}

export function avgDrift(findings: { driftScore: number }[]): number {
  if (findings.length === 0) return 0;
  return Math.round(findings.reduce((sum, f) => sum + f.driftScore, 0) / findings.length);
}
