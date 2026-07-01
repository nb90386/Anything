import { describe, expect, it } from "vitest";
import { buildSnippet, cosineSimilarity, scoreRelevance, termVector, tokenize } from "@/lib/text-search";

describe("tokenize", () => {
  it("lowercases, strips punctuation, and removes stopwords", () => {
    const tokens = tokenize("The Vendor's Liability shall NOT be limited.");
    expect(tokens).toContain("vendor");
    expect(tokens).toContain("liability");
    expect(tokens).toContain("limited");
    expect(tokens).not.toContain("the");
    expect(tokens).not.toContain("shall");
  });
});

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    const v = termVector("liability cap indemnification");
    expect(cosineSimilarity(v, v)).toBeCloseTo(1, 5);
  });

  it("returns 0 for completely disjoint vectors", () => {
    const a = termVector("liability cap indemnification");
    const b = termVector("renewal notice window");
    expect(cosineSimilarity(a, b)).toBe(0);
  });
});

describe("scoreRelevance", () => {
  it("scores a relevant document higher than an irrelevant one", () => {
    const query = "uncapped liability risk";
    const relevant = "Vendor's liability shall not be limited, exposing the company to uncapped risk.";
    const irrelevant = "This Agreement is governed by the laws of the State of Delaware.";
    expect(scoreRelevance(query, relevant)).toBeGreaterThan(scoreRelevance(query, irrelevant));
  });
});

describe("buildSnippet", () => {
  it("returns a window of text centered near the first query term match", () => {
    const doc = "A".repeat(200) + " liability cap details here " + "B".repeat(200);
    const snippet = buildSnippet("liability", doc, 20);
    expect(snippet).toContain("liability");
    expect(snippet.length).toBeLessThan(doc.length);
  });
});
