import type { ContractStatus, ContractType, Department } from "../lib/types";

export interface SeedContractDef {
  fileName: string;
  title: string;
  counterparty: string;
  type: ContractType;
  status: ContractStatus;
  department: Department;
  ownerName: string;
  value: number;
  currency: string;
  effectiveDate: string;
  expirationDate: string | null;
  autoRenew: boolean;
  renewalNoticeDays: number | null;
  /** If set, a second version (amendment) is loaded from this file after the base file. */
  amendmentFile?: string;
  amendmentLabel?: string;
  amendmentDate?: string;
  amendmentSummary?: string;
  /** Ordered approval chain to seed for this contract. */
  approvals?: { role: import("../lib/types").Role; approver: string; status: "pending" | "approved" | "rejected" }[];
}

export const SEED_CONTRACTS: SeedContractDef[] = [
  {
    fileName: "msa-meridian-logistics-v1.txt",
    title: "Master Services Agreement",
    counterparty: "Meridian Logistics Corp.",
    type: "MSA",
    status: "executed",
    department: "Legal",
    ownerName: "Priya Shah",
    value: 850000,
    currency: "USD",
    effectiveDate: "2025-01-15",
    expirationDate: "2028-01-15",
    autoRenew: true,
    renewalNoticeDays: 90,
    amendmentFile: "msa-meridian-logistics-v2-amendment1.txt",
    amendmentLabel: "Amendment 1",
    amendmentDate: "2026-04-01",
    amendmentSummary:
      "Raised the liability cap from 12 to 18 months of fees, tightened the uptime SLA from 99.5% to 99.9% with new service credits, capped annual fee increases at 3%, and added a dedicated Customer Success Manager.",
    approvals: [
      { role: "legal", approver: "Priya Shah", status: "approved" },
      { role: "finance", approver: "Sam Okafor", status: "approved" },
      { role: "executive", approver: "Dana Reyes (CEO)", status: "approved" },
    ],
  },
  {
    fileName: "nda-solace-robotics.txt",
    title: "Mutual Non-Disclosure Agreement",
    counterparty: "Solace Robotics Inc.",
    type: "NDA",
    status: "executed",
    department: "Legal",
    ownerName: "Priya Shah",
    value: 0,
    currency: "USD",
    effectiveDate: "2025-11-01",
    expirationDate: "2027-11-01",
    autoRenew: false,
    renewalNoticeDays: null,
    approvals: [{ role: "legal", approver: "Priya Shah", status: "approved" }],
  },
  {
    fileName: "saas-cloudforge-systems.txt",
    title: "SaaS Subscription Agreement",
    counterparty: "CloudForge Systems",
    type: "SaaS Subscription",
    status: "executed",
    department: "IT",
    ownerName: "Marcus Lee",
    value: 240000,
    currency: "USD",
    effectiveDate: "2025-08-01",
    expirationDate: "2026-08-01",
    autoRenew: true,
    renewalNoticeDays: 90,
    approvals: [
      { role: "legal", approver: "Priya Shah", status: "approved" },
      { role: "finance", approver: "Sam Okafor", status: "approved" },
    ],
  },
  {
    fileName: "procurement-atlas-components.txt",
    title: "Supply and Procurement Agreement",
    counterparty: "Atlas Components Ltd.",
    type: "Procurement",
    status: "executed",
    department: "Procurement",
    ownerName: "Jordan Kim",
    value: 1200000,
    currency: "USD",
    effectiveDate: "2025-03-01",
    expirationDate: "2027-03-01",
    autoRenew: false,
    renewalNoticeDays: null,
    approvals: [
      { role: "procurement", approver: "Jordan Kim", status: "approved" },
      { role: "finance", approver: "Sam Okafor", status: "approved" },
      { role: "executive", approver: "Dana Reyes (CEO)", status: "approved" },
    ],
  },
  {
    fileName: "dpa-vertex-cloud-storage.txt",
    title: "Data Processing Agreement",
    counterparty: "Vertex Cloud Storage",
    type: "Data Processing Agreement",
    status: "expired",
    department: "IT",
    ownerName: "Marcus Lee",
    value: 18000,
    currency: "USD",
    effectiveDate: "2025-06-01",
    expirationDate: "2026-06-01",
    autoRenew: true,
    renewalNoticeDays: 60,
    approvals: [{ role: "legal", approver: "Priya Shah", status: "approved" }],
  },
  {
    fileName: "reseller-bright-path-distribution.txt",
    title: "Reseller Agreement",
    counterparty: "Bright Path Distribution",
    type: "Reseller Agreement",
    status: "expired",
    department: "Finance",
    ownerName: "Sam Okafor",
    value: 420000,
    currency: "USD",
    effectiveDate: "2025-02-01",
    expirationDate: "2026-02-01",
    autoRenew: false,
    renewalNoticeDays: null,
    approvals: [
      { role: "legal", approver: "Priya Shah", status: "approved" },
      { role: "finance", approver: "Sam Okafor", status: "approved" },
    ],
  },
  {
    fileName: "sow-meridian-data-migration.txt",
    title: "Statement of Work — Data Migration",
    counterparty: "Meridian Logistics Corp.",
    type: "Statement of Work",
    status: "pending_approval",
    department: "Legal",
    ownerName: "Priya Shah",
    value: 180000,
    currency: "USD",
    effectiveDate: "2026-01-10",
    expirationDate: "2026-10-10",
    autoRenew: false,
    renewalNoticeDays: null,
    approvals: [
      { role: "legal", approver: "Priya Shah", status: "approved" },
      { role: "finance", approver: "Sam Okafor", status: "pending" },
      { role: "executive", approver: "Dana Reyes (CEO)", status: "pending" },
    ],
  },
  {
    fileName: "consulting-dana-whitfield.txt",
    title: "Independent Consulting Agreement",
    counterparty: "Dana Whitfield Consulting LLC",
    type: "Employment",
    status: "executed",
    department: "HR",
    ownerName: "Sam Okafor",
    value: 96000,
    currency: "USD",
    effectiveDate: "2026-06-15",
    expirationDate: "2027-06-15",
    autoRenew: false,
    renewalNoticeDays: null,
    approvals: [{ role: "legal", approver: "Priya Shah", status: "approved" }],
  },
  {
    fileName: "saas-beacon-creative-group.txt",
    title: "SaaS Subscription Agreement",
    counterparty: "Beacon Creative Group",
    type: "SaaS Subscription",
    status: "executed",
    department: "Sales",
    ownerName: "Elena Cruz",
    value: 150000,
    currency: "USD",
    effectiveDate: "2026-02-01",
    expirationDate: "2027-02-01",
    autoRenew: true,
    renewalNoticeDays: 30,
    approvals: [{ role: "sales", approver: "Elena Cruz", status: "approved" }],
  },
  {
    fileName: "sow-redwood-systems.txt",
    title: "Statement of Work — Systems Integration",
    counterparty: "Redwood Systems Integrators",
    type: "Statement of Work",
    status: "negotiation",
    department: "Procurement",
    ownerName: "Jordan Kim",
    value: 310000,
    currency: "USD",
    effectiveDate: "2026-07-01",
    expirationDate: "2026-12-01",
    autoRenew: false,
    renewalNoticeDays: null,
    approvals: [
      { role: "procurement", approver: "Jordan Kim", status: "pending" },
      { role: "legal", approver: "Priya Shah", status: "pending" },
    ],
  },
];
