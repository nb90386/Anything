import type { ClauseCategory, RiskLevel } from "../../types";
import type { ClauseDraft, RiskDraft } from "../provider";

// ── clause category classification ─────────────────────────────────────

const CATEGORY_KEYWORDS: Record<ClauseCategory, string[]> = {
  liability: ["limitation of liability", "liability", "consequential damages", "aggregate liability", "cap on damages", "indirect damages", "punitive damages"],
  indemnification: ["indemnify", "indemnification", "hold harmless", "defend", "third-party claim"],
  termination: ["terminate", "termination", "cure period", "notice of termination", "for cause", "for convenience"],
  payment: ["payment", "invoice", "fees", "net 30", "net thirty", "late payment", "interest", "compensation", "pricing"],
  confidentiality: ["confidential", "non-disclosure", "proprietary information", "nda"],
  intellectual_property: ["intellectual property", "ip rights", "license", "work product", "patent", "trademark", "copyright", "ownership"],
  governing_law: ["governing law", "jurisdiction", "venue", "arbitration", "dispute resolution"],
  service_level: ["service level", "sla", "uptime", "availability", "response time", "resolution time", "support level"],
  renewal: ["renew", "renewal", "automatically renew", "evergreen", "extension of term"],
  data_privacy: ["personal data", "gdpr", "ccpa", "data protection", "data processing", "security incident", "breach notification"],
  non_compete: ["non-compete", "non-solicit", "restrictive covenant", "competing business"],
  force_majeure: ["force majeure", "act of god", "beyond reasonable control"],
  warranty: ["warrant", "warranty", "as-is", "as is", "disclaimer of warranties", "merchantability", "fitness for a particular purpose"],
  assignment: ["assign", "assignment", "successors", "delegate its duties"],
  other: [],
};

export function classifyCategory(heading: string, text: string): ClauseCategory {
  const haystack = `${heading} ${text}`.toLowerCase();
  let best: ClauseCategory = "other";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [ClauseCategory, string[]][]) {
    let score = 0;
    for (const kw of keywords) {
      if (heading.toLowerCase().includes(kw)) score += 3;
      const bodyMatches = haystack.split(kw).length - 1;
      score += Math.min(bodyMatches, 4);
    }
    if (score > bestScore) {
      bestScore = score;
      best = category;
    }
  }
  return best;
}

// ── clause-level risk heuristics ─────────────────────────────────────────

interface RiskRule {
  category: ClauseCategory;
  pattern: RegExp;
  severity: RiskLevel;
  title: string;
  describe: (match: RegExpMatchArray) => string;
  recommendation: string;
}

const RISK_RULES: RiskRule[] = [
  {
    category: "liability",
    pattern: /unlimited liability|no limitation on (?:liability|damages)|liability.{0,20}shall not be limited/i,
    severity: "critical",
    title: "Uncapped liability exposure",
    describe: () => "This clause imposes liability with no cap, exposing the company to unbounded financial risk from a single dispute.",
    recommendation: "Negotiate a liability cap tied to fees paid (typically 12 months of fees) with carve-outs only for gross negligence, IP infringement, or confidentiality breaches.",
  },
  {
    category: "liability",
    pattern: /shall not exceed.{0,40}(fees|amounts) paid.{0,40}(twelve|12).{0,10}month/i,
    severity: "low",
    title: "Standard liability cap in place",
    describe: () => "Liability is capped at fees paid in the trailing 12 months, a market-standard, favorable position.",
    recommendation: "No action needed; monitor for carve-outs that could erode the cap.",
  },
  {
    category: "indemnification",
    pattern: /indemnify.{0,80}regardless of fault|unlimited indemnification|indemnify.{0,60}any and all claims/i,
    severity: "high",
    title: "Broad, one-sided indemnification obligation",
    describe: () => "The indemnification obligation is broad and one-directional, with no fault qualifier or dollar cap.",
    recommendation: "Push for mutual indemnification limited to third-party IP, confidentiality, and gross-negligence claims, capped at the liability limit.",
  },
  {
    category: "termination",
    pattern: /terminate.{0,60}sole discretion.{0,60}without cause/i,
    severity: "high",
    title: "Unilateral termination for convenience",
    describe: () => "The counterparty may terminate at its sole discretion without cause, creating revenue and continuity risk for us.",
    recommendation: "Request a minimum notice period (60-90 days) and a wind-down/transition assistance clause if terminated for convenience.",
  },
  {
    category: "termination",
    pattern: /terminate.{0,40}immediately.{0,40}(written )?notice/i,
    severity: "medium",
    title: "Short or immediate termination notice",
    describe: () => "Termination can occur on very short or immediate notice, leaving limited time to transition operations.",
    recommendation: "Negotiate a cure period (typically 30 days) before termination for non-payment or minor breach.",
  },
  {
    category: "renewal",
    pattern: /automatically renew.{0,140}(ninety|90|sixty|60|one hundred and twenty|120)\s*\(?\d{0,3}\)?\s*days?/i,
    severity: "medium",
    title: "Auto-renewal with long advance-notice requirement",
    describe: (m) => `The agreement auto-renews unless written notice is given far in advance (${m[1]} days), creating a lock-in trap if the notice window is missed.`,
    recommendation: "Calendar the renewal-notice deadline immediately and consider negotiating a shorter, more standard 30-day notice window.",
  },
  {
    category: "renewal",
    pattern: /automatically renew/i,
    severity: "low",
    title: "Automatic renewal clause",
    describe: () => "The agreement renews automatically for successive terms unless notice is given.",
    recommendation: "Track the renewal date in the obligations calendar to avoid unintended extensions.",
  },
  {
    category: "confidentiality",
    pattern: /confidentiality obligations.{0,60}(survive|continue).{0,40}(perpetuity|indefinitely|perpetual)/i,
    severity: "medium",
    title: "Perpetual confidentiality obligation",
    describe: () => "Confidentiality obligations survive indefinitely with no defined end date, which may be difficult to operationally guarantee.",
    recommendation: "Propose a defined survival period (typically 3-5 years post-termination), except for trade secrets.",
  },
  {
    category: "intellectual_property",
    pattern: /work product.{0,60}(shall be|is)\s+(?:the )?(?:sole and )?exclusive property of/i,
    severity: "high",
    title: "One-sided IP assignment",
    describe: () => "All work product is assigned exclusively to the counterparty, with no license-back for reusable components or pre-existing IP.",
    recommendation: "Carve out pre-existing IP and general know-how; request a license-back for any reusable tooling or methodologies.",
  },
  {
    category: "non_compete",
    pattern: /any business.{0,30}anywhere in the world|worldwide.{0,30}non-compete|(five|5)\s*\(?5?\)?\s*year/i,
    severity: "high",
    title: "Overly broad non-compete scope",
    describe: () => "The non-compete/non-solicit clause is unusually broad in geographic scope or duration.",
    recommendation: "Narrow the restriction to a defined territory, customer set, and a duration of 12-24 months.",
  },
  {
    category: "data_privacy",
    pattern: /(personal data|data privacy|data protection)(?:(?!notify).){0,600}$/i,
    severity: "medium",
    title: "No breach-notification timeline specified",
    describe: () => "The data privacy clause does not specify a breach-notification timeline, which may conflict with GDPR's 72-hour requirement.",
    recommendation: "Add an explicit breach-notification SLA (e.g., 'without undue delay and in any case within 72 hours').",
  },
  {
    category: "warranty",
    pattern: /disclaims? all warranties|as-is|as is.{0,30}without warranty|no warranty of any kind/i,
    severity: "medium",
    title: "Broad warranty disclaimer",
    describe: () => "The counterparty disclaims essentially all warranties, including merchantability and fitness for purpose.",
    recommendation: "Request a minimum performance warranty and a defined remedy period for defects.",
  },
  {
    category: "assignment",
    pattern: /assign.{0,60}without (?:the )?(?:prior )?(?:written )?consent.{0,40}(affiliate|successor|competitor)/i,
    severity: "medium",
    title: "Free assignment to affiliates/successors",
    describe: () => "The counterparty may assign the agreement to an affiliate, successor, or in an acquisition without our consent.",
    recommendation: "Require consent (not to be unreasonably withheld) for assignment outside of a change-of-control event.",
  },
  {
    category: "payment",
    pattern: /interest.{0,20}(1\.5|one and one-half|1\.5%|18%|eighteen percent).{0,20}per month/i,
    severity: "medium",
    title: "High late-payment interest rate",
    describe: () => "Late payments accrue interest at a high monthly rate, compounding quickly on overdue invoices.",
    recommendation: "Negotiate the late-fee rate down to a statutory or market-standard rate (~1% per month) with a grace period.",
  },
  {
    category: "payment",
    pattern: /non-refundable.{0,60}(prior to|before) (completion|delivery)/i,
    severity: "medium",
    title: "Non-refundable prepayment",
    describe: () => "Fees are paid up front and are non-refundable even if deliverables are not completed.",
    recommendation: "Tie a portion of payment to milestone acceptance rather than 100% upfront.",
  },
];

export function assessClauseRisk(category: ClauseCategory, text: string): { level: RiskLevel; note: string | null } {
  let best: { level: RiskLevel; note: string } | null = null;
  const order: RiskLevel[] = ["low", "medium", "high", "critical"];

  for (const rule of RISK_RULES) {
    if (rule.category !== category) continue;
    const match = text.match(rule.pattern);
    if (match) {
      const candidate = { level: rule.severity, note: rule.describe(match) };
      if (!best || order.indexOf(candidate.level) > order.indexOf(best.level)) {
        best = candidate;
      }
    }
  }
  return best ?? { level: "low", note: null };
}

export function findRisks(clauses: ClauseDraft[]): RiskDraft[] {
  const risks: RiskDraft[] = [];
  clauses.forEach((clause, idx) => {
    for (const rule of RISK_RULES) {
      if (rule.category !== clause.category) continue;
      if (rule.severity === "low") continue; // only surface actionable findings as portfolio risks
      const match = clause.text.match(rule.pattern);
      if (match) {
        risks.push({
          clauseIndex: idx,
          title: rule.title,
          description: rule.describe(match),
          severity: rule.severity,
          category: clause.category,
          recommendation: rule.recommendation,
        });
      }
    }
  });
  return risks;
}

export function computeRiskScore(risks: RiskDraft[]): number {
  const weight: Record<RiskLevel, number> = { low: 2, medium: 10, high: 20, critical: 32 };
  const raw = risks.reduce((sum, r) => sum + weight[r.severity], 0);
  return Math.max(4, Math.min(100, raw));
}
