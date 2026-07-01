// Core domain types for the Contract Intelligence Copilot.
// These mirror the SQLite schema in src/lib/db/schema.ts.

export type Role = "legal" | "sales" | "finance" | "procurement" | "executive";

export type ContractType =
  | "MSA"
  | "NDA"
  | "SaaS Subscription"
  | "Procurement"
  | "Data Processing Agreement"
  | "Reseller Agreement"
  | "Statement of Work"
  | "Employment"
  | "Amendment";

export type ContractStatus =
  | "draft"
  | "in_review"
  | "negotiation"
  | "pending_approval"
  | "executed"
  | "expired"
  | "terminated";

export type Department = "Legal" | "Sales" | "Finance" | "Procurement" | "IT" | "HR";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type ClauseCategory =
  | "liability"
  | "indemnification"
  | "termination"
  | "payment"
  | "confidentiality"
  | "intellectual_property"
  | "governing_law"
  | "service_level"
  | "renewal"
  | "data_privacy"
  | "non_compete"
  | "force_majeure"
  | "warranty"
  | "assignment"
  | "other";

export type ObligationType = "payment" | "deliverable" | "renewal_notice" | "reporting" | "audit" | "insurance";
export type ObligationStatus = "upcoming" | "due_soon" | "overdue" | "complete";
export type ObligationParty = "us" | "counterparty";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "skipped";

export interface Contract {
  id: string;
  title: string;
  counterparty: string;
  type: ContractType;
  status: ContractStatus;
  department: Department;
  ownerName: string;
  value: number;
  currency: string;
  effectiveDate: string; // ISO date
  expirationDate: string | null;
  autoRenew: boolean;
  renewalNoticeDays: number | null;
  riskScore: number; // 0-100, higher = riskier
  fileName: string | null;
  source: "sample" | "upload";
  createdAt: string;
  updatedAt: string;
}

export interface ContractVersion {
  id: string;
  contractId: string;
  versionNumber: number;
  label: string; // e.g. "Original", "Amendment 1"
  content: string;
  changeSummary: string | null;
  createdAt: string;
  createdBy: string;
}

export interface Clause {
  id: string;
  contractId: string;
  versionId: string;
  category: ClauseCategory;
  heading: string;
  text: string;
  riskLevel: RiskLevel;
  riskNote: string | null;
  order: number;
}

export interface RiskFinding {
  id: string;
  contractId: string;
  clauseId: string | null;
  title: string;
  description: string;
  severity: RiskLevel;
  category: ClauseCategory;
  recommendation: string;
}

export interface Obligation {
  id: string;
  contractId: string;
  description: string;
  party: ObligationParty;
  type: ObligationType;
  dueDate: string | null;
  status: ObligationStatus;
}

export interface ApprovalStep {
  id: string;
  contractId: string;
  stepOrder: number;
  approverRole: Role;
  approverName: string;
  status: ApprovalStatus;
  decidedAt: string | null;
  comment: string | null;
}

export interface ActivityEntry {
  id: string;
  contractId: string;
  actor: string;
  action: string;
  detail: string | null;
  createdAt: string;
}

export interface ContractSummary {
  overview: string;
  keyTerms: { label: string; value: string }[];
  highlights: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  citedClauseIds?: string[];
}

export interface ContractWithDetails extends Contract {
  versions: ContractVersion[];
  clauses: Clause[];
  risks: RiskFinding[];
  obligations: Obligation[];
  approvals: ApprovalStep[];
  activity: ActivityEntry[];
  summary: ContractSummary;
}

export interface PortfolioInsights {
  totalContracts: number;
  totalValue: number;
  currency: string;
  avgCycleTimeDays: number;
  riskDistribution: Record<RiskLevel, number>;
  statusDistribution: Record<ContractStatus, number>;
  valueByDepartment: { department: Department; value: number }[];
  valueByType: { type: ContractType; value: number }[];
  upcomingRenewals: { contractId: string; title: string; expirationDate: string; value: number; autoRenew: boolean }[];
  overdueObligations: { contractId: string; contractTitle: string; obligation: Obligation }[];
  approvalsPending: number;
  highRiskContracts: { contractId: string; title: string; riskScore: number }[];
  monthlyExecutedValue: { month: string; value: number; count: number }[];
  topCounterpartiesByValue: { counterparty: string; value: number; count: number }[];
}

export interface SearchResult {
  contractId: string;
  title: string;
  counterparty: string;
  type: ContractType;
  status: ContractStatus;
  score: number;
  snippet: string;
  matchedClauseIds: string[];
}
