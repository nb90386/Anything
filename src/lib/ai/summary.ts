import type { Clause, Contract, ContractSummary, Obligation, RiskFinding } from "../types";

export function buildSummary(
  contract: Contract,
  clauses: Clause[],
  risks: RiskFinding[],
  obligations: Obligation[],
  _latestContent: string
): ContractSummary {
  const critHigh = risks.filter((r) => r.severity === "critical" || r.severity === "high").length;
  const overdue = obligations.filter((o) => o.status === "overdue").length;
  const dueSoon = obligations.filter((o) => o.status === "due_soon").length;

  const riskPhrase =
    critHigh > 0
      ? `${critHigh} high-severity risk finding${critHigh > 1 ? "s" : ""} require legal attention`
      : risks.length > 0
        ? `${risks.length} minor risk finding${risks.length > 1 ? "s" : ""} noted, none severe`
        : "no material risks were identified";

  const overduePhrase =
    overdue > 0
      ? ` ${overdue} obligation${overdue > 1 ? "s are" : " is"} currently overdue.`
      : dueSoon > 0
        ? ` ${dueSoon} obligation${dueSoon > 1 ? "s are" : " is"} due within 30 days.`
        : "";

  const overview = `${contract.title} is a ${contract.type} between ${contract.department} and ${contract.counterparty}, valued at ${formatMoney(contract.value, contract.currency)}. Currently ${contract.status.replace("_", " ")}, ${riskPhrase}.${overduePhrase}`;

  const keyTerms = [
    { label: "Contract type", value: contract.type },
    { label: "Counterparty", value: contract.counterparty },
    { label: "Effective date", value: contract.effectiveDate },
    { label: "Expiration date", value: contract.expirationDate ?? "No fixed expiration" },
    { label: "Auto-renewal", value: contract.autoRenew ? `Yes, ${contract.renewalNoticeDays ?? "?"} days notice required` : "No" },
    { label: "Contract value", value: formatMoney(contract.value, contract.currency) },
    { label: "Clauses analyzed", value: String(clauses.length) },
  ];

  const highlights: string[] = [];
  const liability = clauses.find((c) => c.category === "liability");
  if (liability) highlights.push(`Liability: ${liability.riskLevel === "low" ? "capped and market-standard" : `flagged ${liability.riskLevel} risk: ${liability.riskNote ?? ""}`}`);
  const termination = clauses.find((c) => c.category === "termination");
  if (termination) highlights.push(`Termination: ${termination.riskLevel === "low" ? "standard notice/cure terms" : `flagged ${termination.riskLevel} risk: ${termination.riskNote ?? ""}`}`);
  const renewal = clauses.find((c) => c.category === "renewal");
  if (renewal) highlights.push(`Renewal: ${renewal.riskLevel === "low" ? "standard auto-renewal" : `flagged ${renewal.riskLevel} risk: ${renewal.riskNote ?? ""}`}`);
  if (overdue > 0) highlights.push(`${overdue} overdue obligation(s) need immediate follow-up.`);
  if (highlights.length === 0) highlights.push("No standout terms flagged; this contract follows standard market language throughout.");

  return { overview, keyTerms, highlights };
}

function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
}
