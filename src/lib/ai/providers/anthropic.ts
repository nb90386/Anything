import type { AnalysisEngine, ChatAnswer, IngestionResult } from "../provider";
import type { Clause, RiskFinding } from "../../types";

const MODEL = "claude-sonnet-5";
const API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are a contract analysis engine for a CLM (Contract Lifecycle Management) platform.
Given raw contract text, extract clauses, risks, and obligations as strict JSON matching this TypeScript shape:
{ "clauses": [{ "category": string, "heading": string, "text": string, "riskLevel": "low"|"medium"|"high"|"critical", "riskNote": string|null, "order": number }],
  "risks": [{ "clauseIndex": number|null, "title": string, "description": string, "severity": "low"|"medium"|"high"|"critical", "category": string, "recommendation": string }],
  "obligations": [{ "description": string, "party": "us"|"counterparty", "type": "payment"|"deliverable"|"renewal_notice"|"reporting"|"audit"|"insurance", "dueDate": string|null }],
  "riskScore": number, "suggestedType": string }
Valid categories: liability, indemnification, termination, payment, confidentiality, intellectual_property, governing_law, service_level, renewal, data_privacy, non_compete, force_majeure, warranty, assignment, other.
Respond with ONLY the JSON object, no prose, no markdown fences.`;

/**
 * Real Claude-backed analysis engine. Activated when AI_PROVIDER=anthropic
 * and ANTHROPIC_API_KEY is set (see .env.example). Falls back to the mock
 * engine's chat/ingest behavior is NOT automatic: if the API call fails,
 * callers should catch and surface the error; the mock engine is only used
 * automatically as the default provider (see ../index.ts).
 */
export class AnthropicAnalysisEngine implements AnalysisEngine {
  readonly id = "anthropic" as const;
  readonly label = `Anthropic Claude (${MODEL})`;

  private get apiKey(): string {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("ANTHROPIC_API_KEY is not set. Set AI_PROVIDER=mock or provide a key in .env.local.");
    return key;
  }

  async ingest(rawText: string, effectiveDate: string): Promise<IngestionResult> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: `Effective date: ${effectiveDate}\n\nContract text:\n\n${rawText.slice(0, 40_000)}` },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const text = data.content?.[0]?.text ?? "{}";
    return JSON.parse(text) as IngestionResult;
  }

  async chat(
    question: string,
    contract: { title: string; counterparty: string },
    clauses: Clause[],
    risks: RiskFinding[],
    history: { role: string; content: string }[]
  ): Promise<ChatAnswer> {
    const context = clauses.map((c) => `[${c.id}] ${c.heading} (${c.category}, ${c.riskLevel} risk):\n${c.text}`).join("\n\n");
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: `You are a contract assistant answering questions about "${contract.title}" with ${contract.counterparty}. Use only the provided clauses. Cite clause IDs in square brackets. Contract clauses:\n\n${context}`,
        messages: [
          ...history.slice(-6).map((h) => ({ role: h.role === "assistant" ? "assistant" : "user", content: h.content })),
          { role: "user", content: question },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const content: string = data.content?.[0]?.text ?? "";
    const citedClauseIds = clauses.filter((c) => content.includes(c.id)).map((c) => c.id);
    return { content, citedClauseIds };
  }
}
