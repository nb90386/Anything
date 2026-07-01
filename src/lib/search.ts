import { listContracts, getClauses } from "./db/repo";
import type { SearchResult } from "./types";
import { buildSnippet, scoreRelevance } from "./text-search";

export function searchContracts(query: string): SearchResult[] {
  const q = query.trim();
  if (!q) return [];

  const contracts = listContracts();
  const results: SearchResult[] = [];

  for (const contract of contracts) {
    const clauses = getClauses(contract.id);
    const metaText = `${contract.title} ${contract.counterparty} ${contract.type} ${contract.department}`;
    let bestScore = scoreRelevance(q, metaText) * 1.2;
    let bestSnippet = buildSnippet(q, metaText);
    const matchedClauseIds: string[] = [];

    for (const clause of clauses) {
      const clauseText = `${clause.heading} ${clause.text}`;
      const score = scoreRelevance(q, clauseText);
      if (score > 0.05) matchedClauseIds.push(clause.id);
      if (score > bestScore) {
        bestScore = score;
        bestSnippet = buildSnippet(q, clauseText);
      }
    }

    const lowerQ = q.toLowerCase();
    const substringBoost =
      contract.title.toLowerCase().includes(lowerQ) || contract.counterparty.toLowerCase().includes(lowerQ)
        ? 0.3
        : 0;
    const finalScore = bestScore + substringBoost;

    if (finalScore > 0.03) {
      results.push({
        contractId: contract.id,
        title: contract.title,
        counterparty: contract.counterparty,
        type: contract.type,
        status: contract.status,
        score: finalScore,
        snippet: bestSnippet,
        matchedClauseIds,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
