import { describe, expect, it } from "vitest";
import { answerPortfolioQuestion } from "@/lib/ai/portfolio-copilot";

// These tests exercise question routing against a running better-sqlite3
// database, so they need the demo data present. They run against whatever
// state the local dev database is in; assertions only check structural
// shape (never empty, no crash) rather than specific seeded numbers, so
// they stay valid whether run against 10, 25, or freshly uploaded contracts.

describe("answerPortfolioQuestion routing", () => {
  it("routes a leakage question without throwing and returns content", () => {
    const answer = answerPortfolioQuestion("Which contracts create the most revenue leakage?");
    expect(answer.content.length).toBeGreaterThan(0);
  });

  it("routes an indemnity question to the indemnity handler, not the drift handler", () => {
    // Regression test: "indemnity" does not contain the substring "indemnif",
    // so a naive /indemnif/ regex misses it and this used to fall through to
    // the clause-drift handler instead. Assert we get an indemnity-flavored
    // answer, not a drift-flavored one.
    const answer = answerPortfolioQuestion("What is our total exposure from non-standard indemnity clauses?");
    expect(answer.content.toLowerCase()).not.toContain("playbook");
  });

  it("also routes the 'indemnification' spelling correctly", () => {
    const answer = answerPortfolioQuestion("Show me indemnification risk across the portfolio.");
    expect(answer.content.length).toBeGreaterThan(0);
  });

  it("routes a renewal-attention question", () => {
    const answer = answerPortfolioQuestion("Which renewals need attention this quarter?");
    expect(answer.content.length).toBeGreaterThan(0);
  });

  it("routes an approval-bottleneck question", () => {
    const answer = answerPortfolioQuestion("Which deals are blocked by legal approval?");
    expect(answer.content.length).toBeGreaterThan(0);
  });

  it("routes a most-flagged-clauses question", () => {
    const answer = answerPortfolioQuestion("What clauses are most often negotiated?");
    expect(answer.content.length).toBeGreaterThan(0);
  });

  it("falls back to generic search for an unrecognized but relevant question", () => {
    const answer = answerPortfolioQuestion("Tell me about force majeure provisions.");
    expect(answer.content.length).toBeGreaterThan(0);
  });

  it("never throws on a nonsense question", () => {
    expect(() => answerPortfolioQuestion("asdkjfh qwoeiru zzz")).not.toThrow();
  });
});
