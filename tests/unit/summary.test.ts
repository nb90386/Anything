import { describe, expect, it } from "vitest";
import { buildSummary } from "@/lib/ai/summary";
import type { Clause, Contract, Obligation, RiskFinding } from "@/lib/types";

const contract: Contract = {
  id: "c1",
  title: "Test SaaS Agreement",
  counterparty: "Test Vendor Inc.",
  type: "SaaS Subscription",
  status: "executed",
  department: "IT",
  ownerName: "Jamie Doe",
  value: 100000,
  currency: "USD",
  effectiveDate: "2026-01-01",
  expirationDate: "2027-01-01",
  autoRenew: true,
  renewalNoticeDays: 90,
  riskScore: 80,
  fileName: null,
  source: "sample",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("buildSummary", () => {
  it("mentions high-severity risk findings when present", () => {
    const risks: RiskFinding[] = [
      {
        id: "r1",
        contractId: "c1",
        clauseId: null,
        title: "Uncapped liability",
        description: "desc",
        severity: "critical",
        category: "liability",
        recommendation: "rec",
      },
    ];
    const summary = buildSummary(contract, [], risks, [], "");
    expect(summary.overview).toContain("1 high-severity risk finding");
  });

  it("mentions overdue obligations when present", () => {
    const obligations: Obligation[] = [
      { id: "o1", contractId: "c1", description: "d", party: "us", type: "payment", dueDate: "2026-01-01", status: "overdue" },
    ];
    const summary = buildSummary(contract, [], [], obligations, "");
    expect(summary.overview).toContain("overdue");
  });

  it("reports no material risks when the risk list is empty", () => {
    const summary = buildSummary(contract, [], [], [], "");
    expect(summary.overview).toContain("no material risks");
  });

  it("includes key terms derived from the contract", () => {
    const summary = buildSummary(contract, [], [], [], "");
    const labels = summary.keyTerms.map((t) => t.label);
    expect(labels).toContain("Contract type");
    expect(labels).toContain("Auto-renewal");
  });

  it("surfaces a liability highlight when a liability clause exists", () => {
    const clauses: Clause[] = [
      {
        id: "cl1",
        contractId: "c1",
        versionId: "v1",
        category: "liability",
        heading: "Limitation of Liability",
        text: "text",
        riskLevel: "critical",
        riskNote: "Uncapped liability exposure",
        order: 1,
      },
    ];
    const summary = buildSummary(contract, clauses, [], [], "");
    expect(summary.highlights.some((h) => h.startsWith("Liability:"))).toBe(true);
  });
});
