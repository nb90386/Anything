import { describe, expect, it } from "vitest";
import { MockAnalysisEngine } from "@/lib/ai/mock/engine";

const SAMPLE = `SAAS SUBSCRIPTION AGREEMENT

This Agreement is entered into by and between Northwind Analytics, Inc. ("Company") and Test Vendor Inc. ("Counterparty") as of January 1, 2026 (the "Effective Date").

1. LIMITATION OF LIABILITY

Counterparty's liability shall not be limited in any respect arising from Company's use of the Platform.

2. FEES AND PAYMENT

Company shall pay the Annual Subscription Fee invoice no later than March 1, 2026.

3. AUTO-RENEWAL

This Agreement shall automatically renew unless Company provides notice at least ninety (90) days before the renewal date. Company must deliver written notice of non-renewal no later than October 1, 2026.`;

describe("MockAnalysisEngine.ingest", () => {
  it("segments, classifies, flags risk, and extracts obligations end-to-end", async () => {
    const engine = new MockAnalysisEngine();
    const result = await engine.ingest(SAMPLE, "2026-01-01");

    expect(result.clauses.length).toBe(3);
    expect(result.clauses.some((c) => c.category === "liability")).toBe(true);
    expect(result.clauses.some((c) => c.category === "payment")).toBe(true);
    expect(result.clauses.some((c) => c.category === "renewal")).toBe(true);

    const liabilityClause = result.clauses.find((c) => c.category === "liability")!;
    expect(liabilityClause.riskLevel).toBe("critical");

    expect(result.risks.length).toBeGreaterThan(0);
    expect(result.riskScore).toBeGreaterThan(20);

    expect(result.obligations.length).toBeGreaterThanOrEqual(2);
    const renewalObligation = result.obligations.find((o) => o.type === "renewal_notice");
    expect(renewalObligation?.dueDate).toBe("2026-10-01");
  });

  it("is deterministic across repeated runs", async () => {
    const engine = new MockAnalysisEngine();
    const a = await engine.ingest(SAMPLE, "2026-01-01");
    const b = await engine.ingest(SAMPLE, "2026-01-01");
    expect(a.riskScore).toBe(b.riskScore);
    expect(a.clauses.length).toBe(b.clauses.length);
    expect(a.risks.length).toBe(b.risks.length);
  });
});

describe("MockAnalysisEngine.chat", () => {
  it("answers a risk question by summarizing the top findings", async () => {
    const engine = new MockAnalysisEngine();
    const result = await engine.ingest(SAMPLE, "2026-01-01");
    const clauses = result.clauses.map((c, i) => ({ ...c, id: `clause-${i}`, contractId: "c1", versionId: "v1" }));
    const risks = result.risks.map((r, i) => ({
      ...r,
      id: `risk-${i}`,
      contractId: "c1",
      clauseId: r.clauseIndex !== null ? `clause-${r.clauseIndex}` : null,
    }));

    const answer = await engine.chat(
      "What are the risks?",
      { title: "Test Contract", counterparty: "Test Vendor Inc." },
      clauses,
      risks,
      []
    );

    expect(answer.content.toLowerCase()).toContain("risk");
    expect(answer.citedClauseIds.length).toBeGreaterThan(0);
  });

  it("returns a graceful message when no clause matches the question", async () => {
    const engine = new MockAnalysisEngine();
    const answer = await engine.chat(
      "What color is the sky?",
      { title: "Test Contract", counterparty: "Test Vendor Inc." },
      [],
      [],
      []
    );
    expect(answer.content.length).toBeGreaterThan(0);
    expect(answer.citedClauseIds).toEqual([]);
  });
});
