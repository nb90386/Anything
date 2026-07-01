import { NextRequest, NextResponse } from "next/server";
import { listContracts } from "@/lib/db/repo";
import { ingestContract } from "@/lib/ingest";
import { extractTextFromFile } from "@/lib/parsing/extract-text";
import { newContractSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ contracts: listContracts() });
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let text: string;
    let fileName: string | null = null;
    let fields: Record<string, string> = {};

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      for (const [key, value] of form.entries()) {
        if (key !== "file" && typeof value === "string") fields[key] = value;
      }
      if (file instanceof File) {
        fileName = file.name;
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await extractTextFromFile(buffer, file.name);
        if (!result.text) {
          return NextResponse.json({ ok: false, error: result.warning ?? "Could not extract text from file." }, { status: 422 });
        }
        text = result.text;
      } else {
        text = fields.text ?? "";
      }
    } else {
      const body = await req.json();
      fields = body;
      text = body.text ?? "";
    }

    const parsed = newContractSchema.safeParse({ ...fields, text });
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.issues.map((i) => i.message).join("; ") }, { status: 400 });
    }

    const data = parsed.data;
    const contract = await ingestContract({
      title: data.title,
      counterparty: data.counterparty,
      type: data.type,
      department: data.department,
      ownerName: data.ownerName,
      value: data.value,
      currency: data.currency,
      effectiveDate: data.effectiveDate,
      expirationDate: data.expirationDate ?? null,
      autoRenew: data.autoRenew,
      renewalNoticeDays: data.renewalNoticeDays ?? null,
      fileName,
      source: "upload",
      status: "in_review",
      rawText: data.text,
      actor: data.ownerName,
    });

    return NextResponse.json({ ok: true, contract });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
