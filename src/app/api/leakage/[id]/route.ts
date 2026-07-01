import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getLeakageOpportunities, updateLeakageStatus } from "@/lib/db/repo";

export const runtime = "nodejs";

const leakageStatusSchema = z.object({
  status: z.enum(["open", "recovered", "dismissed"]),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const all = getLeakageOpportunities();
  const existing = all.find((o) => o.id === params.id);
  if (!existing) return NextResponse.json({ error: "Leakage opportunity not found" }, { status: 404 });

  const body = await req.json();
  const parsed = leakageStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join("; ") }, { status: 400 });
  }

  updateLeakageStatus(params.id, parsed.data.status);

  return NextResponse.json({ ok: true });
}
