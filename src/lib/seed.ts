import fs from "node:fs";
import path from "node:path";
import { SEED_CONTRACTS } from "@/data/manifest";
import { addAmendmentVersion, ingestContract } from "./ingest";
import { insertApproval, wipeAllData } from "./db/repo";

const SAMPLE_DIR = path.join(process.cwd(), "src", "data", "sample-contracts");

export async function seedDatabase(): Promise<{ count: number }> {
  wipeAllData();

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
        def.ownerName
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

  return { count: SEED_CONTRACTS.length };
}
