import { NextRequest, NextResponse } from "next/server";
import { getChatHistory, getClauses, getContract, getRisks, saveChatMessage } from "@/lib/db/repo";
import { getAnalysisEngine } from "@/lib/ai";
import { chatMessageSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const history = getChatHistory(params.id);
  return NextResponse.json({ messages: history });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const contract = getContract(params.id);
  if (!contract) return NextResponse.json({ error: "Contract not found" }, { status: 404 });

  const body = await req.json();
  const parsed = chatMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join("; ") }, { status: 400 });
  }

  const clauses = getClauses(params.id);
  const risks = getRisks(params.id);
  const history = getChatHistory(params.id);

  saveChatMessage(params.id, "user", parsed.data.message);

  try {
    const engine = getAnalysisEngine();
    const answer = await engine.chat(
      parsed.data.message,
      { title: contract.title, counterparty: contract.counterparty },
      clauses,
      risks,
      history.map((h) => ({ role: h.role, content: h.content }))
    );
    const saved = saveChatMessage(params.id, "assistant", answer.content, answer.citedClauseIds);
    return NextResponse.json({ message: saved });
  } catch (err) {
    const errorMessage = `I couldn't reach the configured AI provider (${(err as Error).message}). Switch AI_PROVIDER back to "mock" in .env.local, or check your API key.`;
    const saved = saveChatMessage(params.id, "assistant", errorMessage);
    return NextResponse.json({ message: saved }, { status: 200 });
  }
}
