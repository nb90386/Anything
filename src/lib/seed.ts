import fs from "node:fs";
import path from "node:path";
import { SEED_CONTRACTS } from "@/data/manifest";
import { addAmendmentVersion, ingestContract } from "./ingest";
import { insertApproval, insertLeakageOpportunity, insertStandardClause, listContracts, wipeAllData, wipeStandardClauses } from "./db/repo";
import { isSeeded } from "./db";
import { STANDARD_CLAUSE_LIBRARY } from "./risk/standard-clauses-data";
import { detectCrossContractLeakage } from "./revenue/leakage";

const SAMPLE_DIR = path.join(process.cwd(), "src", "data", "sample-contracts");

export async function seedDatabase(): Promise<{ count: number }> {
  wipeAllData();
  wipeStandardClauses();

  for (const clause of STANDARD_CLAUSE_LIBRARY) {
    insertStandardClause(clause);
  }

  for (const def of SEED_CONTRACTS) {
    const rawText = fs.readFileSync(path.join(SAMPLE_DIR, def.fileName), "utf-8");

    const contract = await ingestContract({
      title: def.title,
      counterparty: def.counterparty,
      type: def.type,
      department: def.department,
      ownerName: def.ownerName,
      value: def.value,
      currency: def.currency,
      effectiveDate: def.effectiveDate,
      expirationDate: def.expirationDate,
      autoRenew: def.autoRenew,
      renewalNoticeDays: def.renewalNoticeDays,
      fileName: def.fileName,
      source: "sample",
      status: def.status,
      rawText,
      actor: def.ownerName,
    });

    if (def.amendmentFile) {
      const amendmentText = fs.readFileSync(path.join(SAMPLE_DIR, def.amendmentFile), "utf-8");
      addAmendmentVersion(
        contract.id,
        amendmentText,
        def.amendmentLabel ?? "Amendment",
        def.amendmentSummary ?? "Contract amended.",
        def.ownerName,
        def.amendmentDate ? new Date(`${def.amendmentDate}T00:00:00.000Z`).toISOString() : undefined
      );
    }

    if (def.approvals) {
      def.approvals.forEach((a, idx) => {
        insertApproval({
          contractId: contract.id,
          stepOrder: idx + 1,
          approverRole: a.role,
          approverName: a.approver,
          status: a.status,
          decidedAt: a.status === "pending" ? null : new Date().toISOString(),
          comment: a.status === "approved" ? "Looks good, approved." : null,
        });
      });
    }
  }

  // Cross-contract leakage patterns (e.g. a renewal that did not grow in value
  // versus the prior agreement with the same counterparty) can only be detected
  // once every contract in the portfolio is on file.
  const crossContractFindings = detectCrossContractLeakage(listContracts());
  for (const { contractId, draft } of crossContractFindings) {
    insertLeakageOpportunity({
      contractId,
      category: draft.category,
      title: draft.title,
      description: draft.description,
      estimatedValue: draft.estimatedValue,
      currency: "USD",
      confidence: draft.confidence,
      recommendedAction: draft.recommendedAction,
      status: "open",
    });
  }

  return { count: SEED_CONTRACTS.length };
}

// On serverless platforms /tmp starts empty on every cold start, so the demo
// data has to be seeded on first request in that instance's lifetime rather
// than once via a CLI script. isSeeded() is a cheap COUNT query, so this is a
// no-op on every request after the first within a warm instance.
export async function ensureSeeded(): Promise<void> {
  if (!isSeeded()) {
    await seedDatabase();
  }
}
