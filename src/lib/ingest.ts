import { getAnalysisEngine } from "./ai";
import { assessClauseRisk, classifyCategory, computeRiskScore, findRisks } from "./ai/mock/classify";
import { segmentContract } from "./ai/mock/segment";
import { obligationStatus } from "./ai/mock/obligations";
import { analyzeContractDrift } from "./risk/clause-drift";
import { detectLeakage } from "./revenue/leakage";
import {
  deleteClauseDriftForContract,
  deleteLeakageForContract,
  getContract,
  getObligations,
  getRisks,
  getStandardClauses,
  getVersions,
  insertActivity,
  insertClause,
  insertClauseDrift,
  insertContract,
  insertLeakageOpportunity,
  insertObligation,
  insertRisk,
  insertVersion,
  updateContractRisk,
} from "./db/repo";
import type { Clause, Contract, ContractStatus, ContractType, Department, Obligation, RiskFinding } from "./types";

export interface NewContractInput {
  title: string;
  counterparty: string;
  type: ContractType;
  department: Department;
  ownerName: string;
  value: number;
  currency: string;
  effectiveDate: string;
  expirationDate: string | null;
  autoRenew: boolean;
  renewalNoticeDays: number | null;
  fileName: string | null;
  source: "sample" | "upload";
  status?: ContractStatus;
  rawText: string;
  actor?: string;
}

// Approximate negotiation-cycle length by contract type, used only to backdate
// seeded sample-contract `createdAt` so portfolio-wide cycle-time analytics
// (BusinessIQ) have realistic, non-zero values. Real uploads use "now".
const TYPICAL_CYCLE_DAYS: Record<ContractType, number> = {
  NDA: 6,
  "SaaS Subscription": 18,
  "Statement of Work": 14,
  Procurement: 22,
  "Data Processing Agreement": 12,
  "Reseller Agreement": 26,
  MSA: 34,
  Employment: 10,
  Amendment: 9,
};

function backdatedCreatedAt(effectiveDate: string, type: ContractType): string {
  const cycleDays = TYPICAL_CYCLE_DAYS[type] ?? 14;
  const d = new Date(`${effectiveDate}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - cycleDays);
  return d.toISOString();
}

function persistLeakageAndDrift(contract: Contract, clauses: Clause[], risks: RiskFinding[], obligations: Obligation[]) {
  const standardClauses = getStandardClauses();

  const driftDrafts = analyzeContractDrift(clauses, standardClauses);
  for (const d of driftDrafts) {
    insertClauseDrift({
      contractId: contract.id,
      clauseId: d.clauseId,
      category: d.category,
      driftScore: d.driftScore,
      driftType: d.driftType,
      summary: d.summary,
      standardClauseId: d.standardClauseId,
    });
  }

  const leakageDrafts = detectLeakage(contract, clauses, risks, obligations);
  for (const l of leakageDrafts) {
    insertLeakageOpportunity({
      contractId: contract.id,
      category: l.category,
      title: l.title,
      description: l.description,
      estimatedValue: l.estimatedValue,
      currency: contract.currency,
      confidence: l.confidence,
      recommendedAction: l.recommendedAction,
      status: "open",
    });
  }
}

export async function ingestContract(input: NewContractInput): Promise<Contract> {
  const engine = getAnalysisEngine();
  const result = await engine.ingest(input.rawText, input.effectiveDate);

  const contract = insertContract(
    {
      title: input.title,
      counterparty: input.counterparty,
      type: input.type,
      status: input.status ?? "in_review",
      department: input.department,
      ownerName: input.ownerName,
      value: input.value,
      currency: input.currency,
      effectiveDate: input.effectiveDate,
      expirationDate: input.expirationDate,
      autoRenew: input.autoRenew,
      renewalNoticeDays: input.renewalNoticeDays,
      riskScore: result.riskScore,
      fileName: input.fileName,
      source: input.source,
    },
    input.source === "sample" ? backdatedCreatedAt(input.effectiveDate, input.type) : undefined
  );

  const version = insertVersion(
    {
      contractId: contract.id,
      versionNumber: 1,
      label: "Original",
      content: input.rawText,
      changeSummary: null,
      createdBy: input.actor ?? input.ownerName,
    },
    input.source === "sample" ? new Date(`${input.effectiveDate}T00:00:00.000Z`).toISOString() : undefined
  );

  const clauses: Clause[] = result.clauses.map((c) =>
    insertClause({
      contractId: contract.id,
      versionId: version.id,
      category: c.category,
      heading: c.heading,
      text: c.text,
      riskLevel: c.riskLevel,
      riskNote: c.riskNote,
      order: c.order,
    })
  );

  const risks: RiskFinding[] = result.risks.map((r) => {
    const clauseId = r.clauseIndex !== null ? (clauses[r.clauseIndex]?.id ?? null) : null;
    return insertRisk({
      contractId: contract.id,
      clauseId,
      title: r.title,
      description: r.description,
      severity: r.severity,
      category: r.category,
      recommendation: r.recommendation,
    });
  });

  const obligations: Obligation[] = result.obligations.map((o) =>
    insertObligation({
      contractId: contract.id,
      description: o.description,
      party: o.party,
      type: o.type,
      dueDate: o.dueDate,
      status: obligationStatus(o.dueDate),
    })
  );

  persistLeakageAndDrift(contract, clauses, risks, obligations);

  insertActivity({
    contractId: contract.id,
    actor: input.actor ?? input.ownerName,
    action: "Contract ingested",
    detail: `${result.clauses.length} clauses classified, ${result.risks.length} risk finding(s), risk score ${result.riskScore}/100 (${engine.label}).`,
  });

  return contract;
}

/** Adds a new version (amendment) to an existing contract and re-classifies its clauses/risks/leakage/drift. */
export function addAmendmentVersion(
  contractId: string,
  rawText: string,
  label: string,
  changeSummary: string,
  createdBy: string,
  createdAt?: string
): void {
  const segments = segmentContract(rawText);
  const clauseDrafts = segments.map((seg) => {
    const category = classifyCategory(seg.heading, seg.text);
    const { level, note } = assessClauseRisk(category, seg.text);
    return { category, heading: seg.heading, text: seg.text, riskLevel: level, riskNote: note, order: seg.order };
  });

  const nextVersionNumber = getVersions(contractId).length + 1;

  const version = insertVersion(
    {
      contractId,
      versionNumber: nextVersionNumber,
      label,
      content: rawText,
      changeSummary,
      createdBy,
    },
    createdAt
  );

  const clauses: Clause[] = clauseDrafts.map((c) =>
    insertClause({
      contractId,
      versionId: version.id,
      category: c.category,
      heading: c.heading,
      text: c.text,
      riskLevel: c.riskLevel,
      riskNote: c.riskNote,
      order: c.order,
    })
  );

  const riskDrafts = findRisks(clauseDrafts);
  const risks: RiskFinding[] = riskDrafts.map((r) => {
    const clauseId = r.clauseIndex !== null ? (clauses[r.clauseIndex]?.id ?? null) : null;
    return insertRisk({
      contractId,
      clauseId,
      title: r.title,
      description: r.description,
      severity: r.severity,
      category: r.category,
      recommendation: r.recommendation,
    });
  });

  updateContractRisk(contractId, computeRiskScore(riskDrafts));

  // Recompute leakage and drift against the latest state (this version's clauses,
  // the full accumulated risk/obligation picture), rather than accumulating stale
  // findings from earlier versions.
  deleteLeakageForContract(contractId);
  deleteClauseDriftForContract(contractId);
  const contract = getContract(contractId);
  if (contract) {
    const allObligations = getObligations(contractId);
    const allRisks = getRisks(contractId);
    persistLeakageAndDrift(contract, clauses, allRisks.length ? allRisks : risks, allObligations);
  }

  insertActivity({
    contractId,
    actor: createdBy,
    action: `${label} added`,
    detail: changeSummary,
  });
}
