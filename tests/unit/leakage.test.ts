import { describe, expect, it } from "vitest";
import { detectCrossContractLeakage, detectLeakage } from "@/lib/revenue/leakage";
import type { Clause, Contract, Obligation, RiskFinding } from "@/lib/types";

function makeContract(overrides: Partial<Contract> = {}): Contract {
  return {
    id: "c1",
    title: "Test Contract",
    counterparty: "Acme Corp",
    type: "SaaS Subscription",
    status: "executed",
    department: "IT",
    ownerName: "Jamie Doe",
    value: 100000,
    currency: "USD",
    effectiveDate: "2025-01-01",
    expirationDate: "2026-01-01",
    autoRenew: true,
    renewalNoticeDays: 90,
    riskScore: 20,
    fileName: null,
    source: "sample",
    createdAt: "2024-12-01T00:00:00.000Z",
    updatedAt: "2024-12-01T00:00:00.000Z",
    ...overrides,
  };
}

function makeClause(overrides: Partial<Clause> = {}): Clause {
  return {
    id: "cl1",
    contractId: "c1",
    versionId: "v1",
    category: "payment",
    heading: "Payment",
    text: "Standard payment terms.",
    riskLevel: "low",
    riskNote: null,
    order: 1,
    ...overrides,
  };
}

describe("detectLeakage: missed_escalator", () => {
  it("flags an auto-renewing contract with no escalator clause and enough age", () => {
    const contract = makeContract({ autoRenew: true, effectiveDate: "2024-01-01" });
    const clauses = [makeClause({ category: "payment", text: "Invoices are due net 30 with no adjustment." })];
    const findings = detectLeakage(contract, clauses, [], []);
    expect(findings.some((f) => f.category === "missed_escalator")).toBe(true);
  });

  it("does not flag when the payment clause contains an escalator", () => {
    const contract = makeContract({ autoRenew: true, effectiveDate: "2024-01-01" });
    const clauses = [makeClause({ category: "payment", text: "Fees increase annually by 3 percent." })];
    const findings = detectLeakage(contract, clauses, [], []);
    expect(findings.some((f) => f.category === "missed_escalator")).toBe(false);
  });

  it("does not flag a contract that is not auto-renewing", () => {
    const contract = makeContract({ autoRenew: false, effectiveDate: "2024-01-01" });
    const clauses = [makeClause({ category: "payment", text: "Invoices are due net 30 with no adjustment." })];
    const findings = detectLeakage(contract, clauses, [], []);
    expect(findings.some((f) => f.category === "missed_escalator")).toBe(false);
  });

  it("does not flag a contract younger than the age threshold", () => {
    const contract = makeContract({ autoRenew: true, effectiveDate: new Date().toISOString().slice(0, 10) });
    const clauses = [makeClause({ category: "payment", text: "Invoices are due net 30 with no adjustment." })];
    const findings = detectLeakage(contract, clauses, [], []);
    expect(findings.some((f) => f.category === "missed_escalator")).toBe(false);
  });
});

describe("detectLeakage: auto_renewal_exposure", () => {
  it("flags an overdue renewal notice obligation as high confidence", () => {
    const contract = makeContract({ autoRenew: true });
    const obligations: Obligation[] = [
      { id: "o1", contractId: "c1", description: "Notice", party: "us", type: "renewal_notice", dueDate: "2025-01-01", status: "overdue" },
    ];
    const findings = detectLeakage(contract, [], [], obligations);
    const f = findings.find((f) => f.category === "auto_renewal_exposure");
    expect(f).toBeDefined();
    expect(f?.confidence).toBe("high");
  });

  it("flags a due-soon renewal notice as medium confidence", () => {
    const contract = makeContract({ autoRenew: true });
    const obligations: Obligation[] = [
      { id: "o1", contractId: "c1", description: "Notice", party: "us", type: "renewal_notice", dueDate: "2025-01-01", status: "due_soon" },
    ];
    const findings = detectLeakage(contract, [], [], obligations);
    const f = findings.find((f) => f.category === "auto_renewal_exposure");
    expect(f?.confidence).toBe("medium");
  });

  it("does not flag an upcoming (not due-soon) renewal notice", () => {
    const contract = makeContract({ autoRenew: true });
    const obligations: Obligation[] = [
      { id: "o1", contractId: "c1", description: "Notice", party: "us", type: "renewal_notice", dueDate: "2027-01-01", status: "upcoming" },
    ];
    const findings = detectLeakage(contract, [], [], obligations);
    expect(findings.some((f) => f.category === "auto_renewal_exposure")).toBe(false);
  });
});

describe("detectLeakage: payment_term_mismatch", () => {
  it("flags when a payment-category risk finding exists", () => {
    const contract = makeContract();
    const risks: RiskFinding[] = [
      { id: "r1", contractId: "c1", clauseId: null, title: "High late fee", description: "desc", severity: "medium", category: "payment", recommendation: "negotiate" },
    ];
    const findings = detectLeakage(contract, [], risks, []);
    expect(findings.some((f) => f.category === "payment_term_mismatch")).toBe(true);
  });
});

describe("detectLeakage: sla_penalty_recoverable", () => {
  it("flags a service_level clause mentioning credit", () => {
    const contract = makeContract();
    const clauses = [makeClause({ category: "service_level", text: "Vendor owes a service credit for downtime." })];
    const findings = detectLeakage(contract, clauses, [], []);
    expect(findings.some((f) => f.category === "sla_penalty_recoverable")).toBe(true);
  });

  it("does not flag a service_level clause with no credit language", () => {
    const contract = makeContract();
    const clauses = [makeClause({ category: "service_level", text: "Vendor will use commercially reasonable efforts." })];
    const findings = detectLeakage(contract, clauses, [], []);
    expect(findings.some((f) => f.category === "sla_penalty_recoverable")).toBe(false);
  });
});

describe("detectLeakage: renewal_uplift_risk", () => {
  it("flags an expired, non-auto-renewing contract", () => {
    const contract = makeContract({ status: "expired", autoRenew: false });
    const findings = detectLeakage(contract, [], [], []);
    expect(findings.some((f) => f.category === "renewal_uplift_risk")).toBe(true);
  });

  it("does not flag an expired contract that was set to auto-renew", () => {
    const contract = makeContract({ status: "expired", autoRenew: true });
    const findings = detectLeakage(contract, [], [], []);
    expect(findings.some((f) => f.category === "renewal_uplift_risk")).toBe(false);
  });
});

describe("detectLeakage: unclaimed_credit", () => {
  it("flags an overdue audit obligation", () => {
    const contract = makeContract();
    const obligations: Obligation[] = [
      { id: "o1", contractId: "c1", description: "Audit", party: "us", type: "audit", dueDate: "2025-01-01", status: "overdue" },
    ];
    const findings = detectLeakage(contract, [], [], obligations);
    expect(findings.some((f) => f.category === "unclaimed_credit")).toBe(true);
  });
});

describe("detectCrossContractLeakage", () => {
  it("flags a same-type renewal with the same counterparty that did not grow in value", () => {
    const contracts = [
      makeContract({ id: "c1", counterparty: "Acme Corp", type: "Procurement", value: 500000, effectiveDate: "2023-01-01" }),
      makeContract({ id: "c2", counterparty: "Acme Corp", type: "Procurement", value: 480000, effectiveDate: "2025-01-01" }),
    ];
    const results = detectCrossContractLeakage(contracts);
    expect(results.length).toBe(1);
    expect(results[0].contractId).toBe("c2");
    expect(results[0].draft.category).toBe("discount_creep");
  });

  it("does not flag when the later contract grew in value", () => {
    const contracts = [
      makeContract({ id: "c1", counterparty: "Acme Corp", type: "Procurement", value: 500000, effectiveDate: "2023-01-01" }),
      makeContract({ id: "c2", counterparty: "Acme Corp", type: "Procurement", value: 600000, effectiveDate: "2025-01-01" }),
    ];
    const results = detectCrossContractLeakage(contracts);
    expect(results.length).toBe(0);
  });

  it("ignores counterparties with only one contract", () => {
    const contracts = [makeContract({ id: "c1", counterparty: "Solo Corp", value: 100000 })];
    expect(detectCrossContractLeakage(contracts)).toHaveLength(0);
  });

  it("ignores same-counterparty contracts of different types", () => {
    const contracts = [
      makeContract({ id: "c1", counterparty: "Acme Corp", type: "MSA", value: 500000, effectiveDate: "2023-01-01" }),
      makeContract({ id: "c2", counterparty: "Acme Corp", type: "NDA", value: 0, effectiveDate: "2025-01-01" }),
    ];
    expect(detectCrossContractLeakage(contracts)).toHaveLength(0);
  });
});
