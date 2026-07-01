import { NextRequest, NextResponse } from "next/server";
import { getApproval, getApprovals, insertActivity, updateApprovalDecision, updateContractStatus } from "@/lib/db/repo";
import { approvalDecisionSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const approval = getApproval(params.id);
  if (!approval) return NextResponse.json({ error: "Approval step not found" }, { status: 404 });

  const body = await req.json();
  const parsed = approvalDecisionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join("; ") }, { status: 400 });
  }

  updateApprovalDecision(params.id, parsed.data.decision, parsed.data.comment ?? null);

  insertActivity({
    contractId: approval.contractId,
    actor: approval.approverName,
    action: `${approval.approverRole} approval ${parsed.data.decision}`,
    detail: parsed.data.comment ?? null,
  });

  const refreshedSteps = getApprovals(approval.contractId);
  if (parsed.data.decision === "rejected") {
    updateContractStatus(approval.contractId, "negotiation");
  } else if (refreshedSteps.every((s) => s.status === "approved")) {
    updateContractStatus(approval.contractId, "executed");
  }

  return NextResponse.json({ ok: true, approvals: refreshedSteps });
}
