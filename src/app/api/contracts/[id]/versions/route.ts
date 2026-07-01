import { NextRequest, NextResponse } from "next/server";
import { getContract, getVersions } from "@/lib/db/repo";
import { addAmendmentVersion } from "@/lib/ingest";
import { newVersionSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ versions: getVersions(params.id) });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const contract = getContract(params.id);
  if (!contract) return NextResponse.json({ error: "Contract not found" }, { status: 404 });

  const body = await req.json();
  const parsed = newVersionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join("; ") }, { status: 400 });
  }

  addAmendmentVersion(params.id, parsed.data.content, parsed.data.label, parsed.data.changeSummary, contract.ownerName);

  return NextResponse.json({ ok: true, versions: getVersions(params.id) });
}
