import type { ClauseCategory, StandardClause } from "../types";

// The approved negotiation playbook. Each entry is the position Legal wants
// contracts to land on. Clause Drift measures how far an executed clause is
// from the matching entry here, by category, using text similarity plus the
// clause's own risk rating (see src/lib/risk/clause-drift.ts).
export const STANDARD_CLAUSE_LIBRARY: Omit<StandardClause, "id">[] = [
  {
    category: "liability",
    title: "Liability cap at 12 months of fees",
    standardText:
      "Each party's aggregate liability arising out of or related to this Agreement shall not exceed the total fees paid in the preceding twelve months, except for breaches of confidentiality, infringement of intellectual property rights, or a party's gross negligence or willful misconduct.",
    playbookPosition: "Cap liability at 12 months of trailing fees. Carve out confidentiality, IP, and gross negligence.",
  },
  {
    category: "indemnification",
    title: "Mutual indemnification, capped",
    standardText:
      "Each party shall indemnify, defend, and hold harmless the other party from third party claims arising from the indemnifying party's breach, negligence, or violation of applicable law, subject to the liability cap.",
    playbookPosition: "Indemnification must be mutual, fault-based, and subject to the liability cap.",
  },
  {
    category: "termination",
    title: "Termination for cause with 30-day cure",
    standardText:
      "Either party may terminate this Agreement for material breach if the breaching party fails to cure such breach within thirty days after written notice describing the breach in reasonable detail.",
    playbookPosition: "Require a 30-day cure period before termination for cause. Avoid unilateral termination for convenience without notice.",
  },
  {
    category: "payment",
    title: "Net 30, standard late fee",
    standardText:
      "Undisputed invoices are due within thirty days of receipt. Late payments accrue interest at one percent per month, which the parties agree is a reasonable and customary rate.",
    playbookPosition: "Net 30 payment terms. Late fee capped at 1 percent per month.",
  },
  {
    category: "confidentiality",
    title: "5-year confidentiality survival",
    standardText:
      "Confidentiality obligations survive for five years following termination of this Agreement, except that trade secrets remain protected for as long as they qualify as trade secrets under applicable law.",
    playbookPosition: "Confidentiality survives 5 years post-termination, not in perpetuity, except for trade secrets.",
  },
  {
    category: "intellectual_property",
    title: "Each party retains pre-existing IP",
    standardText:
      "Each party retains all right, title, and interest in its pre-existing intellectual property. Work product created specifically for the counterparty, and paid for in full, shall be owned by the counterparty upon final payment, subject to a retained license to reuse general methodologies and tools.",
    playbookPosition: "Retain a license to reuse general methodology and tooling. Do not assign pre-existing IP.",
  },
  {
    category: "renewal",
    title: "Auto-renewal with 30 to 60 day notice",
    standardText:
      "This Agreement shall automatically renew for successive one year terms unless either party provides written notice of non-renewal at least thirty days prior to the end of the then-current term.",
    playbookPosition: "Auto-renewal notice windows should be 30 to 60 days, not 90-plus. Longer windows create renewal traps.",
  },
  {
    category: "non_compete",
    title: "Narrow non-compete, 12 months",
    standardText:
      "During the term and for twelve months thereafter, the restricted party shall not solicit the other party's employees or clients with whom it had material contact, limited to the specific business line at issue.",
    playbookPosition: "Non-compete and non-solicit terms should be scoped to 12 months and a specific business line, not worldwide.",
  },
  {
    category: "data_privacy",
    title: "72-hour breach notification",
    standardText:
      "The processing party shall maintain reasonable safeguards to protect personal data and shall notify the other party without undue delay, and in any case within seventy two hours, in the event of a security incident affecting personal data.",
    playbookPosition: "Data processing clauses must include an explicit breach notification timeline, target 72 hours.",
  },
  {
    category: "warranty",
    title: "Minimum performance warranty",
    standardText:
      "The provider warrants that the deliverable will perform substantially in accordance with its documentation for a defined warranty period, and will use commercially reasonable efforts to correct material non-conformities.",
    playbookPosition: "Require a minimum performance warranty. Avoid broad as-is disclaimers with no remedy period.",
  },
  {
    category: "assignment",
    title: "Assignment requires consent",
    standardText:
      "Neither party may assign this Agreement without the prior written consent of the other party, not to be unreasonably withheld, except in connection with a merger, acquisition, or sale of substantially all assets.",
    playbookPosition: "Assignment requires consent, not to be unreasonably withheld, with a standard change-of-control carve-out.",
  },
  {
    category: "service_level",
    title: "99.5 percent uptime with service credits",
    standardText:
      "The provider will use commercially reasonable efforts to maintain 99.5 percent platform availability, measured monthly, with service credits owed for shortfalls below the committed threshold.",
    playbookPosition: "SLA commitments should include a numeric uptime target and a service credit remedy, not a bare best-efforts promise.",
  },
];

export function findStandardClause(category: ClauseCategory, all: StandardClause[]): StandardClause | null {
  return all.find((s) => s.category === category) ?? null;
}
