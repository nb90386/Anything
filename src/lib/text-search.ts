// Lightweight local "vector-ish" search: term-frequency vectors + cosine
// similarity, no external embeddings service required. Good enough to power
// relevant, useful search and RAG-style chat retrieval over a contract
// portfolio without any network dependency. A production build would swap
// this for pgvector/OpenAI embeddings behind the same interface.

const STOPWORDS = new Set([
  "the", "a", "an", "of", "to", "in", "and", "or", "is", "are", "was", "were",
  "be", "been", "for", "on", "with", "as", "by", "at", "this", "that", "it",
  "shall", "any", "such", "will", "may", "not", "if", "than", "then", "which",
  "who", "what", "when", "where", "how", "does", "do", "did", "can", "could",
  "would", "should", "i", "we", "you", "our", "your", "its",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

export function termVector(text: string): Map<string, number> {
  const vec = new Map<string, number>();
  for (const t of tokenize(text)) {
    vec.set(t, (vec.get(t) ?? 0) + 1);
  }
  return vec;
}

export function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const [term, freqA] of a) {
    normA += freqA * freqA;
    const freqB = b.get(term);
    if (freqB) dot += freqA * freqB;
  }
  for (const freqB of b.values()) normB += freqB * freqB;
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function scoreRelevance(query: string, document: string): number {
  return cosineSimilarity(termVector(query), termVector(document));
}

export function buildSnippet(query: string, document: string, radius = 90): string {
  const qTerms = new Set(tokenize(query));
  const lower = document.toLowerCase();
  let bestIdx = -1;
  for (const term of qTerms) {
    const idx = lower.indexOf(term);
    if (idx !== -1 && (bestIdx === -1 || idx < bestIdx)) bestIdx = idx;
  }
  if (bestIdx === -1) return document.slice(0, radius * 2).trim() + "…";
  const start = Math.max(0, bestIdx - radius);
  const end = Math.min(document.length, bestIdx + radius);
  return (start > 0 ? "…" : "") + document.slice(start, end).trim() + (end < document.length ? "…" : "");
}
