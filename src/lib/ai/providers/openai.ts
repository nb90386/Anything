import type { AnalysisEngine, ChatAnswer, IngestionResult } from "../provider";
import type { Clause, RiskFinding } from "../../types";

const MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT = `You are a contract analysis engine for a CLM (Contract Lifecycle Management) platform.
Given raw contract text, extract clauses, risks, and obligations as strict JSON matching this TypeScript shape:
{ "clauses": [{ "category": string, "heading": string, "text": string, "riskLevel": "low"|"medium"|"high"|"critical", "riskNote": string|null, "order": number }],
  "risks": [{ "clauseIndex": number|null, "title": string, "description": string, "severity": "low"|"medium"|"high"|"critical", "category": string, "recommendation": string }],
  "obligations": [{ "description": string, "party": "us"|"counterparty", "type": "payment"|"deliverable"|"renewal_notice"|"reporting"|"audit"|"insurance", "dueDate": string|null }],
  "riskScore": number, "suggestedType": string }
Valid categories: liability, indemnification, termination, payment, confidentiality, intellectual_property, governing_law, service_level, renewal, data_privacy, non_compete, force_majeure, warranty, assignment, other.
Respond with ONLY the JSON object.`;

/**
 * Real OpenAI-backed analysis engine (also works with any OpenAI-compatible
 * gateway, e.g. OpenRouter, via OPENAI_BASE_URL). Activated when
 * AI_PROVIDER=openai and OPENAI_API_KEY is set. See .env.example.
 */
export class OpenAIAnalysisEngine implements AnalysisEngine {
  readonly id = "openai" as const;
  readonly label = `OpenAI (${MODEL})`;

  private get apiKey(): string {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY is not set. Set AI_PROVIDER=mock or provide a key in .env.local.");
    return key;
  }

  private get baseUrl(): string {
    return process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  }

  async ingest(rawText: string, effectiveDate: string): Promise<IngestionResult> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Effective date: ${effectiveDate}\n\nContract text:\n\n${rawText.slice(0, 40_000)}` },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI API error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? "{}";
    return JSON.parse(text) as IngestionResult;
  }

  async chat(
    question: string,
    contract: { title: string; counterparty: string },
    clauses: Clause[],
    _risks: RiskFinding[],
    history: { role: string; content: string }[]
  ): Promise<ChatAnswer> {
    const context = clauses.map((c) => `[${c.id}] ${c.heading} (${c.category}, ${c.riskLevel} risk):\n${c.text}`).join("\n\n");
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `You are a contract assistant answering questions about "${contract.title}" with ${contract.counterparty}. Use only the provided clauses. Cite clause IDs in square brackets. Contract clauses:\n\n${context}`,
          },
          ...history.slice(-6).map((h) => ({ role: h.role === "assistant" ? "assistant" : "user", content: h.content })),
          { role: "user", content: question },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI API error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";
    const citedClauseIds = clauses.filter((c) => content.includes(c.id)).map((c) => c.id);
    return { content, citedClauseIds };
  }
}
