import { randomUUID } from "node:crypto";
import { db } from "./index";
import type {
  ActivityEntry,
  ApprovalStep,
  Clause,
  ClauseDriftFinding,
  Contract,
  ContractVersion,
  ContractWithDetails,
  LeakageOpportunity,
  Obligation,
  RiskFinding,
  StandardClause,
} from "../types";
import { buildSummary } from "../ai";

// ── row <-> domain mappers ──────────────────────────────────────────────

function rowToContract(r: any): Contract {
  return {
    id: r.id,
    title: r.title,
    counterparty: r.counterparty,
    type: r.type,
    status: r.status,
    department: r.department,
    ownerName: r.owner_name,
    value: r.value,
    currency: r.currency,
    effectiveDate: r.effective_date,
    expirationDate: r.expiration_date,
    autoRenew: !!r.auto_renew,
    renewalNoticeDays: r.renewal_notice_days,
    riskScore: r.risk_score,
    fileName: r.file_name,
    source: r.source,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToVersion(r: any): ContractVersion {
  return {
    id: r.id,
    contractId: r.contract_id,
    versionNumber: r.version_number,
    label: r.label,
    content: r.content,
    changeSummary: r.change_summary,
    createdAt: r.created_at,
    createdBy: r.created_by,
  };
}

function rowToClause(r: any): Clause {
  return {
    id: r.id,
    contractId: r.contract_id,
    versionId: r.version_id,
    category: r.category,
    heading: r.heading,
    text: r.text,
    riskLevel: r.risk_level,
    riskNote: r.risk_note,
    order: r.sort_order,
  };
}

function rowToRisk(r: any): RiskFinding {
  return {
    id: r.id,
    contractId: r.contract_id,
    clauseId: r.clause_id,
    title: r.title,
    description: r.description,
    severity: r.severity,
    category: r.category,
    recommendation: r.recommendation,
  };
}

function rowToObligation(r: any): Obligation {
  return {
    id: r.id,
    contractId: r.contract_id,
    description: r.description,
    party: r.party,
    type: r.type,
    dueDate: r.due_date,
    status: r.status,
  };
}

function rowToApproval(r: any): ApprovalStep {
  return {
    id: r.id,
    contractId: r.contract_id,
    stepOrder: r.step_order,
    approverRole: r.approver_role,
    approverName: r.approver_name,
    status: r.status,
    decidedAt: r.decided_at,
    comment: r.comment,
  };
}

function rowToStandardClause(r: any): StandardClause {
  return {
    id: r.id,
    category: r.category,
    title: r.title,
    standardText: r.standard_text,
    playbookPosition: r.playbook_position,
  };
}

function rowToClauseDrift(r: any): ClauseDriftFinding {
  return {
    id: r.id,
    contractId: r.contract_id,
    clauseId: r.clause_id,
    category: r.category,
    driftScore: r.drift_score,
    driftType: r.drift_type,
    summary: r.summary,
    standardClauseId: r.standard_clause_id,
    standardClauseTitle: r.standard_clause_title ?? null,
  };
}

function rowToLeakage(r: any): LeakageOpportunity {
  return {
    id: r.id,
    contractId: r.contract_id,
    category: r.category,
    title: r.title,
    description: r.description,
    estimatedValue: r.estimated_value,
    currency: r.currency,
    confidence: r.confidence,
    recommendedAction: r.recommended_action,
    status: r.status,
  };
}

function rowToActivity(r: any): ActivityEntry {
  return {
    id: r.id,
    contractId: r.contract_id,
    actor: r.actor,
    action: r.action,
    detail: r.detail,
    createdAt: r.created_at,
  };
}

// ── reads ────────────────────────────────────────────────────────────────

export function listContracts(): Contract[] {
  const rows = db.prepare("SELECT * FROM contracts ORDER BY updated_at DESC").all();
  return rows.map(rowToContract);
}

export function getContract(id: string): Contract | null {
  const row = db.prepare("SELECT * FROM contracts WHERE id = ?").get(id);
  return row ? rowToContract(row) : null;
}

export function getVersions(contractId: string): ContractVersion[] {
  const rows = db
    .prepare("SELECT * FROM contract_versions WHERE contract_id = ? ORDER BY version_number ASC")
    .all(contractId);
  return rows.map(rowToVersion);
}

export function getLatestVersion(contractId: string): ContractVersion | null {
  const row = db
    .prepare("SELECT * FROM contract_versions WHERE contract_id = ? ORDER BY version_number DESC LIMIT 1")
    .get(contractId);
  return row ? rowToVersion(row) : null;
}

export function getClauses(contractId: string, versionId?: string): Clause[] {
  const rows = versionId
    ? db
        .prepare("SELECT * FROM clauses WHERE contract_id = ? AND version_id = ? ORDER BY sort_order ASC")
        .all(contractId, versionId)
    : db.prepare("SELECT * FROM clauses WHERE contract_id = ? ORDER BY sort_order ASC").all(contractId);
  return rows.map(rowToClause);
}

export function getRisks(contractId?: string): RiskFinding[] {
  const rows = contractId
    ? db.prepare("SELECT * FROM risks WHERE contract_id = ?").all(contractId)
    : db.prepare("SELECT * FROM risks").all();
  return rows.map(rowToRisk);
}

export function getObligations(contractId?: string): Obligation[] {
  const rows = contractId
    ? db.prepare("SELECT * FROM obligations WHERE contract_id = ? ORDER BY due_date ASC").all(contractId)
    : db.prepare("SELECT * FROM obligations ORDER BY due_date ASC").all();
  return rows.map(rowToObligation);
}

export function getApprovals(contractId: string): ApprovalStep[] {
  const rows = db
    .prepare("SELECT * FROM approvals WHERE contract_id = ? ORDER BY step_order ASC")
    .all(contractId);
  return rows.map(rowToApproval);
}

export function getApproval(approvalId: string): ApprovalStep | null {
  const row = db.prepare("SELECT * FROM approvals WHERE id = ?").get(approvalId);
  return row ? rowToApproval(row) : null;
}

export function getActivity(contractId: string): ActivityEntry[] {
  const rows = db
    .prepare("SELECT * FROM activity WHERE contract_id = ? ORDER BY created_at DESC")
    .all(contractId);
  return rows.map(rowToActivity);
}

export function getStandardClauses(): StandardClause[] {
  const rows = db.prepare("SELECT * FROM standard_clauses ORDER BY category ASC").all();
  return rows.map(rowToStandardClause);
}

export function getClauseDrift(contractId?: string): ClauseDriftFinding[] {
  const rows = contractId
    ? db
        .prepare(
          `SELECT d.*, s.title as standard_clause_title FROM clause_drift d
           LEFT JOIN standard_clauses s ON s.id = d.standard_clause_id
           WHERE d.contract_id = ? ORDER BY d.drift_score DESC`
        )
        .all(contractId)
    : db
        .prepare(
          `SELECT d.*, s.title as standard_clause_title FROM clause_drift d
           LEFT JOIN standard_clauses s ON s.id = d.standard_clause_id
           ORDER BY d.drift_score DESC`
        )
        .all();
  return rows.map(rowToClauseDrift);
}

export function getLeakageOpportunities(contractId?: string): LeakageOpportunity[] {
  const rows = contractId
    ? db.prepare("SELECT * FROM leakage_opportunities WHERE contract_id = ? ORDER BY estimated_value DESC").all(contractId)
    : db.prepare("SELECT * FROM leakage_opportunities ORDER BY estimated_value DESC").all();
  return rows.map(rowToLeakage);
}

export function insertStandardClause(input: Omit<StandardClause, "id">): StandardClause {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO standard_clauses (id, category, title, standard_text, playbook_position)
     VALUES (@id, @category, @title, @standardText, @playbookPosition)`
  ).run({ id, ...input });
  return { ...input, id };
}

export function insertClauseDrift(input: Omit<ClauseDriftFinding, "id" | "standardClauseTitle">): ClauseDriftFinding {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO clause_drift (id, contract_id, clause_id, standard_clause_id, category, drift_score, drift_type, summary)
     VALUES (@id, @contractId, @clauseId, @standardClauseId, @category, @driftScore, @driftType, @summary)`
  ).run({ id, ...input });
  return { ...input, id, standardClauseTitle: null };
}

export function insertLeakageOpportunity(input: Omit<LeakageOpportunity, "id">): LeakageOpportunity {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO leakage_opportunities (id, contract_id, category, title, description, estimated_value, currency, confidence, recommended_action, status)
     VALUES (@id, @contractId, @category, @title, @description, @estimatedValue, @currency, @confidence, @recommendedAction, @status)`
  ).run({ id, ...input });
  return { ...input, id };
}

export function updateLeakageStatus(id: string, status: LeakageOpportunity["status"]): void {
  db.prepare("UPDATE leakage_opportunities SET status = ? WHERE id = ?").run(status, id);
}

export function deleteLeakageForContract(contractId: string): void {
  db.prepare("DELETE FROM leakage_opportunities WHERE contract_id = ?").run(contractId);
}

export function deleteClauseDriftForContract(contractId: string): void {
  db.prepare("DELETE FROM clause_drift WHERE contract_id = ?").run(contractId);
}

export function getContractWithDetails(id: string): ContractWithDetails | null {
  const contract = getContract(id);
  if (!contract) return null;
  const versions = getVersions(id);
  const clauses = getClauses(id);
  const risks = getRisks(id);
  const obligations = getObligations(id);
  const approvals = getApprovals(id);
  const activity = getActivity(id);
  const leakage = getLeakageOpportunities(id);
  const drift = getClauseDrift(id);
  const latest = versions[versions.length - 1];
  const summary = buildSummary(contract, clauses, risks, obligations, latest?.content ?? "");
  return { ...contract, versions, clauses, risks, obligations, approvals, activity, summary, leakage, drift };
}

export function allObligationsWithContract(): { contract: Contract; obligation: Obligation }[] {
  const rows = db
    .prepare(
      `SELECT o.*, c.title as c_title FROM obligations o
       JOIN contracts c ON c.id = o.contract_id
       ORDER BY o.due_date ASC`
    )
    .all() as any[];
  return rows.map((r) => ({
    contract: getContract(r.contract_id)!,
    obligation: rowToObligation(r),
  }));
}

export function allApprovalsWithContract(): { contract: Contract; approval: ApprovalStep }[] {
  const rows = db
    .prepare(
      `SELECT a.* FROM approvals a
       JOIN contracts c ON c.id = a.contract_id
       ORDER BY a.step_order ASC`
    )
    .all() as any[];
  return rows.map((r) => ({
    contract: getContract(r.contract_id)!,
    approval: rowToApproval(r),
  }));
}

// ── writes ───────────────────────────────────────────────────────────────

export function insertContract(
  input: Omit<Contract, "id" | "createdAt" | "updatedAt">,
  createdAt?: string
): Contract {
  const id = randomUUID();
  const created = createdAt ?? new Date().toISOString();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO contracts
     (id, title, counterparty, type, status, department, owner_name, value, currency,
      effective_date, expiration_date, auto_renew, renewal_notice_days, risk_score,
      file_name, source, created_at, updated_at)
     VALUES (@id, @title, @counterparty, @type, @status, @department, @ownerName, @value, @currency,
      @effectiveDate, @expirationDate, @autoRenew, @renewalNoticeDays, @riskScore,
      @fileName, @source, @createdAt, @updatedAt)`
  ).run({
    id,
    ...input,
    autoRenew: input.autoRenew ? 1 : 0,
    createdAt: created,
    updatedAt: now,
  });
  return { ...input, id, createdAt: created, updatedAt: now };
}

export function insertVersion(
  input: Omit<ContractVersion, "id" | "createdAt">,
  createdAt?: string
): ContractVersion {
  const id = randomUUID();
  const timestamp = createdAt ?? new Date().toISOString();
  db.prepare(
    `INSERT INTO contract_versions (id, contract_id, version_number, label, content, change_summary, created_at, created_by)
     VALUES (@id, @contractId, @versionNumber, @label, @content, @changeSummary, @createdAt, @createdBy)`
  ).run({ id, ...input, createdAt: timestamp });
  return { ...input, id, createdAt: timestamp };
}

export function insertClause(input: Omit<Clause, "id">): Clause {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO clauses (id, contract_id, version_id, category, heading, text, risk_level, risk_note, sort_order)
     VALUES (@id, @contractId, @versionId, @category, @heading, @text, @riskLevel, @riskNote, @order)`
  ).run({ id, ...input });
  return { ...input, id };
}

export function insertRisk(input: Omit<RiskFinding, "id">): RiskFinding {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO risks (id, contract_id, clause_id, title, description, severity, category, recommendation)
     VALUES (@id, @contractId, @clauseId, @title, @description, @severity, @category, @recommendation)`
  ).run({ id, ...input });
  return { ...input, id };
}

export function insertObligation(input: Omit<Obligation, "id">): Obligation {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO obligations (id, contract_id, description, party, type, due_date, status)
     VALUES (@id, @contractId, @description, @party, @type, @dueDate, @status)`
  ).run({ id, ...input });
  return { ...input, id };
}

export function insertApproval(input: Omit<ApprovalStep, "id">): ApprovalStep {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO approvals (id, contract_id, step_order, approver_role, approver_name, status, decided_at, comment)
     VALUES (@id, @contractId, @stepOrder, @approverRole, @approverName, @status, @decidedAt, @comment)`
  ).run({ id, ...input });
  return { ...input, id };
}

export function insertActivity(input: Omit<ActivityEntry, "id" | "createdAt">): ActivityEntry {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO activity (id, contract_id, actor, action, detail, created_at)
     VALUES (@id, @contractId, @actor, @action, @detail, @createdAt)`
  ).run({ id, ...input, createdAt: now });
  return { ...input, id, createdAt: now };
}

export function updateApprovalDecision(
  approvalId: string,
  status: "approved" | "rejected",
  comment: string | null
): void {
  db.prepare(
    `UPDATE approvals SET status = ?, decided_at = ?, comment = ? WHERE id = ?`
  ).run(status, new Date().toISOString(), comment, approvalId);
}

export function updateContractStatus(contractId: string, status: Contract["status"]): void {
  db.prepare(`UPDATE contracts SET status = ?, updated_at = ? WHERE id = ?`).run(
    status,
    new Date().toISOString(),
    contractId
  );
}

export function updateContractRisk(contractId: string, riskScore: number): void {
  db.prepare(`UPDATE contracts SET risk_score = ?, updated_at = ? WHERE id = ?`).run(
    riskScore,
    new Date().toISOString(),
    contractId
  );
}

export function saveChatMessage(
  contractId: string,
  role: "user" | "assistant",
  content: string,
  citedClauseIds: string[] = []
) {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO chat_messages (id, contract_id, role, content, cited_clause_ids, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, contractId, role, content, JSON.stringify(citedClauseIds), now);
  return { id, contractId, role, content, citedClauseIds, createdAt: now };
}

export function getChatHistory(contractId: string) {
  const rows = db
    .prepare("SELECT * FROM chat_messages WHERE contract_id = ? ORDER BY created_at ASC")
    .all(contractId) as any[];
  return rows.map((r) => ({
    id: r.id,
    role: r.role as "user" | "assistant",
    content: r.content,
    createdAt: r.created_at,
    citedClauseIds: JSON.parse(r.cited_clause_ids || "[]") as string[],
  }));
}

/** Wipes portfolio data (contracts and everything derived from them). The
 * standard_clauses playbook reference table is left intact since it is
 * reference data, not portfolio data, and is reseeded separately. */
export function wipeAllData(): void {
  db.exec(
    `DELETE FROM chat_messages; DELETE FROM activity; DELETE FROM approvals;
     DELETE FROM leakage_opportunities; DELETE FROM clause_drift;
     DELETE FROM obligations; DELETE FROM risks; DELETE FROM clauses;
     DELETE FROM contract_versions; DELETE FROM contracts;`
  );
}

export function wipeStandardClauses(): void {
  db.exec(`DELETE FROM standard_clauses;`);
}
