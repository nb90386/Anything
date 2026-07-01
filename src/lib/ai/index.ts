import type { AnalysisEngine } from "./provider";
import { MockAnalysisEngine } from "./mock/engine";
import { AnthropicAnalysisEngine } from "./providers/anthropic";
import { OpenAIAnalysisEngine } from "./providers/openai";

export { buildSummary } from "./summary";
export type { AnalysisEngine, ChatAnswer, IngestionResult } from "./provider";

let cached: AnalysisEngine | null = null;

/**
 * Returns the configured analysis engine. Defaults to the deterministic
 * mock engine (no API key, works fully offline). Set AI_PROVIDER=anthropic
 * or AI_PROVIDER=openai (+ the matching API key) in .env.local to switch to
 * a real LLM-backed engine. See .env.example for details.
 */
export function getAnalysisEngine(): AnalysisEngine {
  if (cached) return cached;
  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();

  if (provider === "anthropic") {
    cached = new AnthropicAnalysisEngine();
  } else if (provider === "openai") {
    cached = new OpenAIAnalysisEngine();
  } else {
    cached = new MockAnalysisEngine();
  }
  return cached;
}
