import { NextRequest, NextResponse } from "next/server";
import { answerPortfolioQuestion } from "@/lib/ai/portfolio-copilot";
import { chatMessageSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = chatMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join("; ") }, { status: 400 });
  }

  const answer = answerPortfolioQuestion(parsed.data.message);
  return NextResponse.json(answer);
}
