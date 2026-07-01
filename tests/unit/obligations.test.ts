import { describe, expect, it } from "vitest";
import { extractObligations, obligationStatus } from "@/lib/ai/mock/obligations";

describe("extractObligations", () => {
  it("extracts a payment obligation with an absolute date", () => {
    const text = "Company shall pay the Annual Fee invoice no later than August 1, 2026.";
    const result = extractObligations(text, "2025-01-01", "Northwind Analytics", "Acme Corp");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("payment");
    expect(result[0].dueDate).toBe("2026-08-01");
  });

  it("extracts an obligation with a relative 'within N days of the Effective Date' pattern", () => {
    const text = "Consultant shall submit an onboarding report within thirty (30) days of the Effective Date.";
    const result = extractObligations(text, "2026-06-15", "Northwind Analytics", "Acme Corp");
    expect(result).toHaveLength(1);
    expect(result[0].dueDate).toBe("2026-07-15");
  });

  it("does not extract an obligation from a sentence with no trigger keyword", () => {
    const text = "This Agreement is governed by the laws of the State of Delaware.";
    const result = extractObligations(text, "2025-01-01", "Northwind Analytics", "Acme Corp");
    expect(result).toHaveLength(0);
  });

  it("assigns party based on which alias appears first in the sentence", () => {
    const text = "Acme Corp shall deliver the milestone report no later than March 1, 2026.";
    const result = extractObligations(text, "2025-01-01", "Northwind Analytics", "Acme Corp");
    expect(result[0].party).toBe("counterparty");
  });
});

describe("obligationStatus", () => {
  const today = new Date("2026-07-01T00:00:00Z");

  it("marks a null due date as upcoming", () => {
    expect(obligationStatus(null, today)).toBe("upcoming");
  });

  it("marks a past due date as overdue", () => {
    expect(obligationStatus("2026-05-01", today)).toBe("overdue");
  });

  it("marks a date within 30 days as due_soon", () => {
    expect(obligationStatus("2026-07-15", today)).toBe("due_soon");
  });

  it("marks a date more than 30 days out as upcoming", () => {
    expect(obligationStatus("2026-12-01", today)).toBe("upcoming");
  });
});
