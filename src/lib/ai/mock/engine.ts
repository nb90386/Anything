import type { AnalysisEngine, ChatAnswer, ClauseDraft, IngestionResult } from "../provider";
import type { Clause, RiskFinding } from "../../types";
import { segmentContract } from "./segment";
import { assessClauseRisk, classifyCategory, computeRiskScore, findRisks } from "./classify";
import { extractObligations } from "./obligations";
import { scoreRelevance } from "../../text-search";

const OUR_ALIAS = "Northwind Analytics";

export class MockAnalysisEngine implements AnalysisEngine {
  readonly id = "mock" as const;
  readonly label = "Deterministic Mock Engine (offline, no API key)";

  async ingest(rawText: string, effectiveDate: string): Promise<IngestionResult> {
    const segments = segmentContract(rawText);
    const counterpartyAlias = guessCounterparty(rawText);

    const clauses: ClauseDraft[] = segments.map((seg) => {
      const category = classifyCategory(seg.heading, seg.text);
      const { level, note } = assessClauseRisk(category, seg.text);
      return {
        category,
        heading: seg.heading,
        text: seg.text,
        riskLevel: level,
        riskNote: note,
        order: seg.order,
      };
    });

    const risks = findRisks(clauses);
    const obligations = extractObligations(rawText, effectiveDate, OUR_ALIAS, counterpartyAlias);
    const riskScore = computeRiskScore(risks);

    return { clauses, risks, obligations, riskScore, suggestedType: guessType(rawText) };
  }

  async chat(
    question: string,
    contract: { title: string; counterparty: string },
    clauses: Clause[],
    risks: RiskFinding[],
    _history: { role: string; content: string }[]
  ): Promise<ChatAnswer> {
    const q = question.toLowerCase();

    if (/\brisk|risky|dangerous|exposure|red flag/.test(q)) {
      if (risks.length === 0) {
        return {
          content: `I didn't flag any material risks in **${contract.title}**. All reviewed clauses fall within standard, low-risk market terms.`,
          citedClauseIds: [],
        };
      }
      const top = [...risks].sort((a, b) => sevRank(b.severity) - sevRank(a.severity)).slice(0, 3);
      const lines = top.map(
        (r) => `- **${r.title}** (${r.severity.toUpperCase()}) — ${r.description} _Recommendation: ${r.recommendation}_`
      );
      const citedClauseIds = top.map((r) => r.clauseId).filter((id): id is string => !!id);
      return {
        content: `Here are the top risk findings in **${contract.title}** with **${contract.counterparty}**:\n\n${lines.join("\n")}`,
        citedClauseIds,
      };
    }

    if (/terminat/.test(q)) {
      return respondFromCategory("termination", "termination and notice terms", contract, clauses, question);
    }
    if (/pay|invoice|fee|cost|price/.test(q)) {
      return respondFromCategory("payment", "payment terms", contract, clauses, question);
    }
    if (/renew/.test(q)) {
      return respondFromCategory("renewal", "renewal terms", contract, clauses, question);
    }
    if (/liab/.test(q)) {
      return respondFromCategory("liability", "liability terms", contract, clauses, question);
    }
    if (/indemn/.test(q)) {
      return respondFromCategory("indemnification", "indemnification terms", contract, clauses, question);
    }
    if (/confidential|nda|non-disclosure/.test(q)) {
      return respondFromCategory("confidentiality", "confidentiality terms", contract, clauses, question);
    }
    if (/\bip\b|intellectual property|ownership/.test(q)) {
      return respondFromCategory("intellectual_property", "intellectual property terms", contract, clauses, question);
    }
    if (/summary|overview|what is this|tl;?dr/.test(q)) {
      return {
        content: `**${contract.title}** is an agreement with **${contract.counterparty}**. It contains ${clauses.length} classified clauses and ${risks.length} flagged risk finding(s). Ask me about liability, termination, payment, renewal, IP, or confidentiality terms for specifics, or ask "what are the risks?" for a full risk briefing.`,
        citedClauseIds: [],
      };
    }

    // Generic retrieval fallback: find the most relevant clause(s) by term overlap.
    const scored = clauses
      .map((c) => ({ clause: c, score: scoreRelevance(question, `${c.heading} ${c.text}`) }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    if (scored.length === 0) {
      return {
        content: `I couldn't find a clause in **${contract.title}** directly addressing that. Try asking about liability, termination, payment, renewal, IP, confidentiality, or risk.`,
        citedClauseIds: [],
      };
    }

    const body = scored
      .map((s) => `**${s.clause.heading}**\n${truncate(s.clause.text, 420)}`)
      .join("\n\n");
    return {
      content: `Here's what **${contract.title}** says relevant to your question:\n\n${body}`,
      citedClauseIds: scored.map((s) => s.clause.id),
    };
  }
}

function respondFromCategory(
  category: Clause["category"],
  label: string,
  contract: { title: string; counterparty: string },
  clauses: Clause[],
  _question: string
): ChatAnswer {
  const matches = clauses.filter((c) => c.category === category);
  if (matches.length === 0) {
    return {
      content: `**${contract.title}** doesn't appear to contain a distinct clause covering ${label}.`,
      citedClauseIds: [],
    };
  }
  const body = matches
    .map((c) => {
      const risk = c.riskLevel !== "low" ? `\n⚠️ _${c.riskLevel.toUpperCase()} risk: ${c.riskNote}_` : "";
      return `**${c.heading}**\n${truncate(c.text, 500)}${risk}`;
    })
    .join("\n\n");
  return {
    content: `Here are the ${label} in **${contract.title}** with **${contract.counterparty}**:\n\n${body}`,
    citedClauseIds: matches.map((c) => c.id),
  };
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n).trim() + "…" : s;
}

function sevRank(level: string): number {
  return { low: 0, medium: 1, high: 2, critical: 3 }[level] ?? 0;
}

function guessCounterparty(rawText: string): string {
  const match = rawText.match(/between\s+Northwind Analytics,?\s*Inc\.?\s*(?:\(.*?\))?\s*and\s+([A-Z][A-Za-z0-9 ,.&'\-]{2,60})/i);
  if (match) return match[1].split(",")[0].split("(")[0].trim();
  return "the Counterparty";
}

function guessType(rawText: string): string {
  const lower = rawText.toLowerCase();
  if (lower.includes("master services agreement")) return "MSA";
  if (lower.includes("non-disclosure") || lower.includes("nondisclosure")) return "NDA";
  if (lower.includes("data processing agreement")) return "Data Processing Agreement";
  if (lower.includes("statement of work")) return "Statement of Work";
  if (lower.includes("reseller")) return "Reseller Agreement";
  if (lower.includes("subscription") || lower.includes("saas")) return "SaaS Subscription";
  if (lower.includes("amendment")) return "Amendment";
  if (lower.includes("employment") || lower.includes("consulting")) return "Employment";
  return "Procurement";
}
