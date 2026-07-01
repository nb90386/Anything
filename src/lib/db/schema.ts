export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  counterparty TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  department TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  value REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  effective_date TEXT NOT NULL,
  expiration_date TEXT,
  auto_renew INTEGER NOT NULL DEFAULT 0,
  renewal_notice_days INTEGER,
  risk_score INTEGER NOT NULL DEFAULT 0,
  file_name TEXT,
  source TEXT NOT NULL DEFAULT 'sample',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contract_versions (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  label TEXT NOT NULL,
  content TEXT NOT NULL,
  change_summary TEXT,
  created_at TEXT NOT NULL,
  created_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clauses (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  version_id TEXT NOT NULL REFERENCES contract_versions(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  heading TEXT NOT NULL,
  text TEXT NOT NULL,
  risk_level TEXT NOT NULL DEFAULT 'low',
  risk_note TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS risks (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  clause_id TEXT REFERENCES clauses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL,
  category TEXT NOT NULL,
  recommendation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS obligations (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  party TEXT NOT NULL,
  type TEXT NOT NULL,
  due_date TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming'
);

CREATE TABLE IF NOT EXISTS approvals (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  approver_role TEXT NOT NULL,
  approver_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  decided_at TEXT,
  comment TEXT
);

CREATE TABLE IF NOT EXISTS activity (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  cited_clause_ids TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS standard_clauses (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  standard_text TEXT NOT NULL,
  playbook_position TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clause_drift (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  clause_id TEXT NOT NULL REFERENCES clauses(id) ON DELETE CASCADE,
  standard_clause_id TEXT REFERENCES standard_clauses(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  drift_score INTEGER NOT NULL,
  drift_type TEXT NOT NULL,
  summary TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leakage_opportunities (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  estimated_value REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  confidence TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
);

CREATE INDEX IF NOT EXISTS idx_versions_contract ON contract_versions(contract_id);
CREATE INDEX IF NOT EXISTS idx_clauses_contract ON clauses(contract_id);
CREATE INDEX IF NOT EXISTS idx_clauses_version ON clauses(version_id);
CREATE INDEX IF NOT EXISTS idx_risks_contract ON risks(contract_id);
CREATE INDEX IF NOT EXISTS idx_obligations_contract ON obligations(contract_id);
CREATE INDEX IF NOT EXISTS idx_approvals_contract ON approvals(contract_id);
CREATE INDEX IF NOT EXISTS idx_activity_contract ON activity(contract_id);
CREATE INDEX IF NOT EXISTS idx_chat_contract ON chat_messages(contract_id);
CREATE INDEX IF NOT EXISTS idx_drift_contract ON clause_drift(contract_id);
CREATE INDEX IF NOT EXISTS idx_leakage_contract ON leakage_opportunities(contract_id);
`;
