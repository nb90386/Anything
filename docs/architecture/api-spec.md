# API Specification - Malbek Contract Intelligence Copilot

> Independent portfolio demo, not affiliated with Malbek Inc. All routes are Next.js 14 App Router API routes under `src/app/api/`. Request bodies are validated with zod before any processing; invalid input returns `400` with a structured error body: `{ error: string, issues?: ZodIssue[] }`. There is no authentication layer in this demo (see `docs/architecture/security-model.md`) - every route is unauthenticated and unscoped to a tenant.

## Conventions

- All request/response bodies are JSON unless noted (file upload uses `multipart/form-data`).
- All list endpoints return arrays directly wrapped in a named key (e.g., `{ contracts: [...] }`), not bare arrays, to leave room for future pagination metadata.
- Dates are ISO 8601 strings throughout.
- `id` fields are UUID strings.

---

## `GET /api/contracts`

List all contracts, optionally filtered.

**Query params**

| Param | Type | Notes |
|---|---|---|
| `status` | string, optional | Filter by `contracts.status` |
| `type` | string, optional | Filter by `contracts.type` |
| `department` | string, optional | Filter by `contracts.department` |

**Response `200`**
```ts
{
  contracts: Array<{
    id: string;
    title: string;
    counterparty: string;
    type: string;
    status: string;
    department: string | null;
    value: number | null;
    currency: string;
    expirationDate: string | null;
    riskScore: number;
    updatedAt: string;
  }>
}
```

---

## `POST /api/contracts`

Ingest a new contract - either a file upload or a seeded demo contract reference - and run the full extraction pipeline synchronously.

**Request** - `multipart/form-data`

| Field | Type | Notes |
|---|---|---|
| `file` | File, required unless `demoContractKey` set | PDF, DOCX, or plain text; max 10 MB |
| `demoContractKey` | string, optional | e.g., `"msa-acme"` - loads a seeded fixture instead of parsing a file |
| `title` | string, required | |
| `counterparty` | string, required | |
| `type` | string, required | One of the contract type enum values |
| `department` | string, optional | |
| `ownerName` | string, optional | |
| `value` | number, optional | |
| `currency` | string, optional, default `USD` | |
| `effectiveDate` | string (ISO date), optional | |
| `expirationDate` | string (ISO date), optional | |
| `autoRenew` | boolean, optional | |
| `renewalNoticeDays` | number, optional | |

**Response `201`**
```ts
{
  contract: ContractDetail; // see GET /api/contracts/[id]
}
```

**Errors**
- `400` - validation failure, unsupported file type, or file exceeds size limit
- `422` - file parsed but no extractable text found (e.g., scanned image PDF with no text layer)
- `500` - unexpected parsing/extraction failure

---

## `GET /api/contracts/[id]`

Full detail for one contract, including all derived data.

**Response `200`**
```ts
{
  contract: {
    id: string;
    title: string;
    counterparty: string;
    type: string;
    status: string;
    department: string | null;
    ownerName: string | null;
    value: number | null;
    currency: string;
    effectiveDate: string | null;
    expirationDate: string | null;
    autoRenew: boolean;
    renewalNoticeDays: number | null;
    riskScore: number;
    fileName: string | null;
    source: 'upload' | 'demo_seed';
    createdAt: string;
    updatedAt: string;
  };
  summary: string;
  clauses: Array<{
    id: string;
    category: string;
    heading: string | null;
    text: string;
    riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
    riskNote: string | null;
    sortOrder: number;
  }>;
  risks: Array<{
    id: string;
    clauseId: string | null;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string | null;
    recommendation: string | null;
  }>;
  obligations: Array<{
    id: string;
    description: string;
    party: 'us' | 'counterparty' | 'both';
    type: string;
    dueDate: string | null;
    status: 'upcoming' | 'due_soon' | 'overdue' | 'complete';
  }>;
  currentVersionNumber: number;
}
```

**Errors**
- `404` - no contract with that `id`

---

## `POST /api/contracts/[id]/chat`

Ask a retrieval-based question scoped to this contract only.

**Request**
```ts
{ question: string } // 1-1000 chars
```

**Response `200`**
```ts
{
  answer: string;
  citedClauseIds: string[]; // may be empty if no relevant clause found
  messageId: string;
}
```

Side effect: persists two `chat_messages` rows (`role: 'user'` then `role: 'assistant'`).

**Errors**
- `400` - empty/oversized question
- `404` - contract not found

---

## `GET /api/contracts/[id]/versions`

List all versions of a contract.

**Response `200`**
```ts
{
  versions: Array<{
    id: string;
    versionNumber: number;
    label: string | null;
    changeSummary: string | null;
    createdAt: string;
    createdBy: string | null;
  }>
}
```

## `POST /api/contracts/[id]/versions`

Add a new version (amendment) to an existing contract, and compute a clause-level diff against the immediately prior version.

**Request** - `multipart/form-data`

| Field | Type | Notes |
|---|---|---|
| `file` | File, required | New version's document |
| `label` | string, optional | e.g., "Amendment 1 - Payment Terms Update" |
| `createdBy` | string, optional | |

**Response `201`**
```ts
{
  version: { id: string; versionNumber: number; label: string | null; createdAt: string };
  diff: {
    fromVersion: number;
    toVersion: number;
    clauseChanges: Array<{
      category: string;
      changeType: 'added' | 'removed' | 'modified' | 'unchanged';
      before: string | null;
      after: string | null;
    }>;
  };
}
```

**Errors**
- `400` - validation/parsing failure
- `404` - contract not found

---

## `POST /api/contracts/[id]/approve`

Advance the approval workflow by deciding the currently active step.

**Request**
```ts
{
  decision: 'approved' | 'rejected';
  approverName?: string;
  comment?: string;
}
```

**Response `200`**
```ts
{
  approvals: Array<{
    id: string;
    stepOrder: number;
    approverRole: string;
    approverName: string | null;
    status: 'pending' | 'active' | 'approved' | 'rejected';
    decidedAt: string | null;
    comment: string | null;
  }>;
  contractStatus: string; // updated contracts.status if workflow completed/rejected
}
```

**Errors**
- `400` - no active step to decide (workflow already complete, or contract has no approval chain)
- `404` - contract not found

---

## `GET /api/search`

Cross-repository search using local TF-IDF/cosine-similarity ranking.

**Query params**

| Param | Type | Notes |
|---|---|---|
| `q` | string, required | 1-200 chars |
| `limit` | number, optional, default 20 | Max results |

**Response `200`**
```ts
{
  query: string;
  results: Array<{
    contractId: string;
    contractTitle: string;
    clauseId: string;
    category: string;
    snippet: string; // matched text, truncated with surrounding context
    score: number; // cosine similarity, 0-1
  }>;
}
```

**Errors**
- `400` - missing/empty query

---

## `GET /api/insights`

Portfolio-wide aggregates powering the BusinessIQ-style dashboard.

**Response `200`**
```ts
{
  spendByDepartment: Array<{ department: string; totalValue: number; contractCount: number }>;
  spendByType: Array<{ type: string; totalValue: number; contractCount: number }>;
  riskDistribution: Array<{ severity: 'low' | 'medium' | 'high' | 'critical'; count: number }>;
  renewalPipeline: {
    next30Days: Array<{ contractId: string; title: string; expirationDate: string; value: number | null; autoRenew: boolean }>;
    next60Days: Array<{ contractId: string; title: string; expirationDate: string; value: number | null; autoRenew: boolean }>;
    next90Days: Array<{ contractId: string; title: string; expirationDate: string; value: number | null; autoRenew: boolean }>;
  };
  avgApprovalCycleTimeDays: number;
  avgApprovalCycleTimeByType: Array<{ type: string; avgDays: number }>;
  totalPortfolioValue: number;
  totalActiveContracts: number;
}
```

---

## `GET /api/export/[id]`

Generate an exportable report. Use `id = "portfolio"` for the portfolio-wide executive report, or a specific contract `id` for a single-contract report.

**Query params**

| Param | Type | Notes |
|---|---|---|
| `format` | string, optional, default `pdf` | `pdf` \| `json` |

**Response `200`**
- `format=pdf`: binary response, `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="..."`.
- `format=json`:
```ts
{
  generatedAt: string;
  scope: 'portfolio' | string; // contract id
  summary: string;
  riskHighlights: Array<{ title: string; severity: string; contractTitle?: string }>;
  renewalExposure: { next30Days: number; next60Days: number; next90Days: number };
  cycleTimeDays: number;
}
```

**Errors**
- `404` - contract id not found (when not `"portfolio"`)

---

## `POST /api/demo/reset`

Wipe all current data and reseed the standard demo contract set (MSA, NDA, SaaS Subscription, Procurement, DPA, Reseller, SOW, Employment, plus the Amendment pair).

**Request** - no body required.

**Response `200`**
```ts
{
  reset: true;
  contractsSeeded: number;
  seededAt: string;
}
```

**Errors**
- `500` - reseed failure (e.g., migration mismatch); response includes `{ error: string }` and prior data is left untouched (operation is transactional).
