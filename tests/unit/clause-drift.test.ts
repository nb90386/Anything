import { describe, expect, it } from "vitest";
import { analyzeClauseDrift, analyzeContractDrift, avgDrift, driftSeverityLabel } from "@/lib/risk/clause-drift";
import { STANDARD_CLAUSE_LIBRARY } from "@/lib/risk/standard-clauses-data";
import type { Clause, StandardClause } from "@/lib/types";

const standardClauses: StandardClause[] = STANDARD_CLAUSE_LIBRARY.map((s, i) => ({ ...s, id: `std-${i}` }));

function makeClause(overrides: Partial<Clause> = {}): Clause {
  return {
    id: "cl1",
    contractId: "c1",
    versionId: "v1",
    category: "liability",
    heading: "Limitation of Liability",
    text: "Each party's aggregate liability shall not exceed the total fees paid in the preceding twelve months.",
    riskLevel: "low",
    riskNote: null,
    order: 1,
    ...overrides,
  };
}

describe("analyzeClauseDrift", () => {
  it("returns at_standard drift for a clause matching the playbook text exactly", () => {
    const standard = standardClauses.find((s) => s.category === "liability")!;
    const clause = makeClause({ text: standard.standardText });
    const result = analyzeClauseDrift(clause, standardClauses);
    expect(result).not.toBeNull();
    expect(result!.driftScore).toBeLessThan(18);
    expect(result!.driftType).toBe("at_standard");
  });

  it("returns low but non-zero drift for a clause that is similar but not identical to the playbook", () => {
    const clause = makeClause();
    const result = analyzeClauseDrift(clause, standardClauses);
    expect(result).not.toBeNull();
    expect(result!.driftScore).toBeLessThan(35);
  });

  it("returns high drift for a high-risk clause even if wording is similar", () => {
    const clause = makeClause({
      riskLevel: "critical",
      riskNote: "Uncapped liability exposure",
      text: "Vendor's liability shall not be limited in any respect.",
    });
    const result = analyzeClauseDrift(clause, standardClauses);
    expect(result).not.toBeNull();
    expect(result!.driftScore).toBeGreaterThan(50);
    expect(result!.driftType).toBe("less_favorable");
  });

  it("skips unmeasured categories like governing_law", () => {
    const clause = makeClause({ category: "governing_law", text: "Governed by the laws of Delaware." });
    expect(analyzeClauseDrift(clause, standardClauses)).toBeNull();
  });

  it("skips categories with no playbook entry", () => {
    const clause = makeClause({ category: "other" });
    expect(analyzeClauseDrift(clause, standardClauses)).toBeNull();
  });

  it("marks a low-risk but differently-worded clause as non_standard_structure", () => {
    const clause = makeClause({
      riskLevel: "low",
      text: "Neither party shall be responsible for amounts beyond what was invoiced this calendar quarter under a completely different formulation.",
    });
    const result = analyzeClauseDrift(clause, standardClauses);
    expect(result).not.toBeNull();
    if (result!.driftScore >= 18) {
      expect(result!.driftType).toBe("non_standard_structure");
    }
  });
});

describe("analyzeContractDrift", () => {
  it("filters out null results and returns one entry per measurable clause", () => {
    const clauses = [
      makeClause({ id: "a", category: "liability" }),
      makeClause({ id: "b", category: "governing_law" }),
      makeClause({ id: "c", category: "payment", text: "Net 30 payment terms with standard interest." }),
    ];
    const results = analyzeContractDrift(clauses, standardClauses);
    expect(results.length).toBe(2);
    expect(results.map((r) => r.clauseId)).toEqual(["a", "c"]);
  });
});

describe("driftSeverityLabel", () => {
  it("buckets scores correctly", () => {
    expect(driftSeverityLabel(5)).toBe("on-playbook");
    expect(driftSeverityLabel(25)).toBe("minor");
    expect(driftSeverityLabel(50)).toBe("moderate");
    expect(driftSeverityLabel(80)).toBe("severe");
  });
});

describe("avgDrift", () => {
  it("averages a list of findings", () => {
    expect(avgDrift([{ driftScore: 10 }, { driftScore: 20 }, { driftScore: 30 }])).toBe(20);
  });

  it("returns 0 for an empty list", () => {
    expect(avgDrift([])).toBe(0);
  });
});
