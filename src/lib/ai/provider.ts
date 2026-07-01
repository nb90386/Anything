import type { Clause, ClauseCategory, Obligation, RiskFinding, RiskLevel } from "../types";

export interface ClauseDraft {
  category: ClauseCategory;
  heading: string;
  text: string;
  riskLevel: RiskLevel;
  riskNote: string | null;
  order: number;
}

export interface RiskDraft {
  clauseIndex: number | null;
  title: string;
  description: string;
  severity: RiskLevel;
  category: ClauseCategory;
  recommendation: string;
}

export interface ObligationDraft {
  description: string;
  party: "us" | "counterparty";
  type: Obligation["type"];
  dueDate: string | null;
}

export interface IngestionResult {
  clauses: ClauseDraft[];
  risks: RiskDraft[];
  obligations: ObligationDraft[];
  riskScore: number; // 0-100
  suggestedType: string;
}

export interface ChatAnswer {
  content: string;
  citedClauseIds: string[];
}

/**
 * A CLM analysis engine turns raw contract text into structured clauses,
 * risks, and obligations, and can answer natural-language questions about
 * a specific contract. Swap AI_PROVIDER in .env.local to change engines:
 * see src/lib/ai/index.ts for the factory.
 */
export interface AnalysisEngine {
  readonly id: "mock" | "anthropic" | "openai";
  readonly label: string;
  ingest(rawText: string, effectiveDate: string): Promise<IngestionResult>;
  chat(question: string, contract: { title: string; counterparty: string }, clauses: Clause[], risks: RiskFinding[], history: { role: string; content: string }[]): Promise<ChatAnswer>;
}
