import type { ObligationDraft } from "../provider";
import type { Obligation } from "../../types";

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

const ABS_DATE_RE = new RegExp(
  `(${MONTHS.join("|")})\\s+(\\d{1,2}),?\\s+(\\d{4})`,
  "gi"
);

const RELATIVE_DAYS_RE = /within\s+(?:\w+\s+)?\(?(\d{1,3})\)?\s*days?\s+of\s+the\s+Effective\s+Date/gi;

interface Trigger {
  type: ObligationDraft["type"];
  pattern: RegExp;
}

const TRIGGERS: Trigger[] = [
  { type: "payment", pattern: /\b(pay|payment|invoice|fee)s?\b/i },
  { type: "renewal_notice", pattern: /notice of (?:non-)?renewal|written notice.{0,30}(?:renew|terminate)/i },
  { type: "reporting", pattern: /shall (?:provide|deliver|submit).{0,30}report/i },
  { type: "audit", pattern: /audit rights?|right to audit/i },
  { type: "insurance", pattern: /certificate of insurance|maintain insurance/i },
  { type: "deliverable", pattern: /deliverable|milestone|shall deliver/i },
];

function parseAbsoluteDate(sentence: string): string | null {
  ABS_DATE_RE.lastIndex = 0;
  const m = ABS_DATE_RE.exec(sentence);
  if (!m) return null;
  const month = MONTHS.indexOf(m[1].toLowerCase());
  const day = parseInt(m[2], 10);
  const year = parseInt(m[3], 10);
  const d = new Date(Date.UTC(year, month, day));
  return d.toISOString().slice(0, 10);
}

function parseRelativeDate(sentence: string, effectiveDate: string): string | null {
  RELATIVE_DAYS_RE.lastIndex = 0;
  const m = RELATIVE_DAYS_RE.exec(sentence);
  if (!m) return null;
  const days = parseInt(m[1], 10);
  const base = new Date(effectiveDate);
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().slice(0, 10);
}

function splitSentences(text: string): string[] {
  return text.replace(/\n/g, " ").split(/(?<=[.;])\s+(?=[A-Z(])/).filter((s) => s.trim().length > 8);
}

export function extractObligations(
  rawText: string,
  effectiveDate: string,
  ourAlias: string,
  counterpartyAlias: string
): ObligationDraft[] {
  const sentences = splitSentences(rawText);
  const found: ObligationDraft[] = [];
  const seen = new Set<string>();

  for (const sentence of sentences) {
    for (const trigger of TRIGGERS) {
      if (!trigger.pattern.test(sentence)) continue;
      const dueDate = parseAbsoluteDate(sentence) ?? parseRelativeDate(sentence, effectiveDate);
      if (!dueDate) continue;

      const key = `${trigger.type}:${dueDate}:${sentence.slice(0, 40)}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const ourIdx = sentence.toLowerCase().indexOf(ourAlias.toLowerCase());
      const cpIdx = sentence.toLowerCase().indexOf(counterpartyAlias.toLowerCase());
      let party: ObligationDraft["party"] = "us";
      if (cpIdx !== -1 && (ourIdx === -1 || cpIdx < ourIdx)) party = "counterparty";

      found.push({
        description: cleanSentence(sentence),
        party,
        type: trigger.type,
        dueDate,
      });
      break; // one obligation per sentence
    }
  }
  return found;
}

function cleanSentence(s: string): string {
  const trimmed = s.trim().replace(/\s+/g, " ");
  return trimmed.length > 200 ? trimmed.slice(0, 197) + "…" : trimmed;
}

export function obligationStatus(dueDate: string | null, today: Date = new Date()): Obligation["status"] {
  if (!dueDate) return "upcoming";
  const due = new Date(dueDate);
  const diffDays = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return "overdue";
  if (diffDays <= 30) return "due_soon";
  return "upcoming";
}
