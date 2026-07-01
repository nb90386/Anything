import { z } from "zod";

export const CONTRACT_TYPES = [
  "MSA",
  "NDA",
  "SaaS Subscription",
  "Procurement",
  "Data Processing Agreement",
  "Reseller Agreement",
  "Statement of Work",
  "Employment",
  "Amendment",
] as const;

export const DEPARTMENTS = ["Legal", "Sales", "Finance", "Procurement", "IT", "HR"] as const;

export const newContractSchema = z.object({
  title: z.string().min(2).max(200),
  counterparty: z.string().min(1).max(200),
  type: z.enum(CONTRACT_TYPES),
  department: z.enum(DEPARTMENTS),
  ownerName: z.string().min(1).max(120),
  value: z.coerce.number().min(0).max(1_000_000_000),
  currency: z.string().length(3).default("USD"),
  effectiveDate: z.string().min(8).max(10),
  expirationDate: z.string().min(8).max(10).nullable().optional(),
  autoRenew: z.coerce.boolean().default(false),
  renewalNoticeDays: z.coerce.number().min(0).max(730).nullable().optional(),
  text: z.string().min(50, "Contract text must be at least 50 characters.").max(200_000),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
});

export const approvalDecisionSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  comment: z.string().max(1000).optional(),
});

export const newVersionSchema = z.object({
  label: z.string().min(1).max(80),
  content: z.string().min(50).max(200_000),
  changeSummary: z.string().min(1).max(1000),
});
