import { describe, expect, it } from "vitest";
import { assessClauseRisk, classifyCategory, computeRiskScore, findRisks } from "@/lib/ai/mock/classify";

describe("classifyCategory", () => {
  it("classifies a liability clause correctly", () => {
    const heading = "Limitation Of Liability";
    const text = "Each party's aggregate liability shall not exceed the fees paid in the preceding twelve (12) months.";
    expect(classifyCategory(heading, text)).toBe("liability");
  });

  it("classifies a termination clause correctly", () => {
    const heading = "Term And Termination";
    const text = "Either party may terminate this Agreement for material breach following thirty (30) days notice.";
    expect(classifyCategory(heading, text)).toBe("termination");
  });

  it("classifies a confidentiality clause correctly", () => {
    const heading = "Confidentiality";
    const text = "Each party shall protect the other's confidential information and shall not disclose it to third parties.";
    expect(classifyCategory(heading, text)).toBe("confidentiality");
  });

  it("falls back to other when nothing matches", () => {
    const heading = "Random Heading";
    const text = "This text intentionally contains none of the tracked legal category keywords at all.";
    expect(classifyCategory(heading, text)).toBe("other");
  });
});

describe("assessClauseRisk", () => {
  it("flags uncapped liability as critical", () => {
    const { level } = assessClauseRisk("liability", "Vendor's liability shall not be limited in any respect.");
    expect(level).toBe("critical");
  });

  it("treats a standard liability cap as low risk", () => {
    const { level } = assessClauseRisk(
      "liability",
      "Each party's liability shall not exceed the total fees paid in the preceding twelve (12) months."
    );
    expect(level).toBe("low");
  });

  it("flags sole-discretion termination without cause as high risk", () => {
    const { level } = assessClauseRisk(
      "termination",
      "Vendor may terminate this Agreement in its sole discretion and without cause at any time."
    );
    expect(level).toBe("high");
  });

  it("flags an overly broad non-compete as high risk", () => {
    const { level } = assessClauseRisk(
      "non_compete",
      "For five (5) years, Reseller shall not engage in any business anywhere in the world that competes with Company."
    );
    expect(level).toBe("high");
  });

  it("returns low with no note when no rule matches", () => {
    const { level, note } = assessClauseRisk("force_majeure", "Neither party is liable for delays beyond its reasonable control.");
    expect(level).toBe("low");
    expect(note).toBeNull();
  });
});

describe("findRisks / computeRiskScore", () => {
  it("aggregates risk findings across clauses and scores higher for more severe findings", () => {
    const clauses = [
      {
        category: "liability" as const,
        heading: "Liability",
        text: "Vendor's liability shall not be limited in any respect.",
        riskLevel: "critical" as const,
        riskNote: null,
        order: 1,
      },
      {
        category: "payment" as const,
        heading: "Payment",
        text: "Overdue invoices accrue interest at 1.5% per month.",
        riskLevel: "medium" as const,
        riskNote: null,
        order: 2,
      },
    ];
    const risks = findRisks(clauses);
    expect(risks.length).toBeGreaterThanOrEqual(2);
    const score = computeRiskScore(risks);
    expect(score).toBeGreaterThan(30);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("returns a low floor score when there are no risks", () => {
    expect(computeRiskScore([])).toBeGreaterThanOrEqual(4);
  });
});
