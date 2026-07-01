import { allApprovalsWithContract, getClauses, getLeakageOpportunities, getObligations, getRisks, listContracts } from "../db/repo";
import { computeRevenueIntelligence } from "../revenue/summary";
import { computeRiskRadar } from "../risk/radar-summary";
import { formatMoney, titleCase } from "../utils";
import { scoreRelevance } from "../text-search";

export interface PortfolioChatAnswer {
  content: string;
  citedContractIds: string[];
}

/**
 * Deterministic, offline portfolio-wide question answering. Reads the same
 * SQLite-backed data every page on this site reads, so answers are always
 * consistent with what's on screen. This is the engine behind /copilot.
 */
export function answerPortfolioQuestion(question: string): PortfolioChatAnswer {
  const q = question.toLowerCase();
  const contracts = listContracts();

  if (/leak|revenue at risk|missed (value|revenue)|recover/.test(q)) {
    return answerLeakage();
  }
  if (/renew/.test(q) && /(quarter|attention|soon|upcoming|window|expir)/.test(q)) {
    return answerRenewals(contracts);
  }
  if (/(most|often).{0,20}(negotiat|flag|risk|non.?standard|deviat)/.test(q) || /clause.{0,20}(most|common)/.test(q)) {
    return answerMostFlaggedClauses();
  }
  if (/block|stuck|bottleneck|approval/.test(q)) {
    return answerBottlenecks();
  }
  if (/indemnif|indemnity/.test(q)) {
    return answerIndemnityExposure(contracts);
  }
  if (/drift|playbook|standard/.test(q)) {
    return answerDrift();
  }
  if (/risk/.test(q) && /(portfolio|overall|total|highest|worst)/.test(q)) {
    return answerHighestRiskContracts(contracts);
  }
  if (/summary|overview|tl;?dr|what.{0,10}(is|going on)/.test(q)) {
    return answerPortfolioSummary(contracts);
  }

  return answerGenericSearch(question, contracts);
}

function answerLeakage(): PortfolioChatAnswer {
  const summary = computeRevenueIntelligence();
  if (summary.topOpportunities.length === 0) {
    return { content: "No open revenue leakage opportunities are currently flagged across the portfolio.", citedContractIds: [] };
  }
  const lines = summary.topOpportunities
    .slice(0, 5)
    .map(
      (t, i) =>
        `${i + 1}. **${t.contractTitle}**, ${formatMoney(t.opportunity.estimatedValue, t.opportunity.currency)} (${titleCase(
          t.opportunity.category
        )}, ${t.opportunity.confidence} confidence): ${t.opportunity.title}`
    );
  return {
    content: `Total open leakage across the portfolio is ${formatMoney(summary.totalOpenLeakage, summary.currency)} across ${summary.openOpportunityCount} opportunities. The largest:\n\n${lines.join("\n")}`,
    citedContractIds: summary.topOpportunities.slice(0, 5).map((t) => t.contractId),
  };
}

function answerRenewals(contracts: ReturnType<typeof listContracts>): PortfolioChatAnswer {
  const allObligations = getObligations();
  const renewalObligations = allObligations.filter(
    (o) => o.type === "renewal_notice" && (o.status === "overdue" || o.status === "due_soon")
  );
  if (renewalObligations.length === 0) {
    return { content: "No renewal notice deadlines are currently overdue or due soon.", citedContractIds: [] };
  }
  const lines = renewalObligations.map((o) => {
    const c = contracts.find((c) => c.id === o.contractId);
    return `- **${c?.title ?? "Unknown"}** (${c?.counterparty ?? ""}): ${o.status === "overdue" ? "notice deadline already passed" : "notice window closing soon"}, due ${o.dueDate}. ${formatMoney(c?.value ?? 0, c?.currency ?? "USD")} at stake.`;
  });
  return {
    content: `${renewalObligations.length} renewal(s) need attention:\n\n${lines.join("\n")}`,
    citedContractIds: renewalObligations.map((o) => o.contractId),
  };
}

function answerMostFlaggedClauses(): PortfolioChatAnswer {
  const risks = getRisks();
  const counts = new Map<string, number>();
  for (const r of risks) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
  const ranked = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (ranked.length === 0) {
    return { content: "No risk findings are on file across the portfolio.", citedContractIds: [] };
  }
  const lines = ranked.map(([category, count], i) => `${i + 1}. ${titleCase(category)}: flagged in ${count} clause(s)`);
  return {
    content: `The clause categories most often flagged for risk across the portfolio:\n\n${lines.join("\n")}\n\nThese are the categories worth prioritizing for playbook updates or template changes.`,
    citedContractIds: [],
  };
}

function answerBottlenecks(): PortfolioChatAnswer {
  const all = allApprovalsWithContract().filter((a) => a.approval.status === "pending");
  if (all.length === 0) {
    return { content: "No deals are currently blocked on approval. The queue is clear.", citedContractIds: [] };
  }
  const lines = all
    .slice(0, 6)
    .map((a) => `- **${a.contract.title}** (${a.contract.counterparty}): waiting on ${titleCase(a.approval.approverRole)} approval from ${a.approval.approverName}, ${formatMoney(a.contract.value, a.contract.currency)} at stake.`);
  return {
    content: `${all.length} deal(s) are currently blocked on approval:\n\n${lines.join("\n")}`,
    citedContractIds: all.slice(0, 6).map((a) => a.contract.id),
  };
}

function answerIndemnityExposure(contracts: ReturnType<typeof listContracts>): PortfolioChatAnswer {
  const risks = getRisks().filter((r) => r.category === "indemnification");
  if (risks.length === 0) {
    return { content: "No non-standard indemnification language is currently flagged across the portfolio.", citedContractIds: [] };
  }
  const contractIds = Array.from(new Set(risks.map((r) => r.contractId)));
  const totalExposure = contractIds.reduce((sum, id) => sum + (contracts.find((c) => c.id === id)?.value ?? 0), 0);
  const lines = contractIds.map((id) => {
    const c = contracts.find((c) => c.id === id);
    const finding = risks.find((r) => r.contractId === id);
    return `- **${c?.title ?? "Unknown"}** (${c?.counterparty ?? ""}), ${formatMoney(c?.value ?? 0, c?.currency ?? "USD")}: ${finding?.title}`;
  });
  return {
    content: `${contractIds.length} contract(s) carry non-standard indemnification language, representing ${formatMoney(totalExposure)} in contract value:\n\n${lines.join("\n")}`,
    citedContractIds: contractIds,
  };
}

function answerDrift(): PortfolioChatAnswer {
  const radar = computeRiskRadar();
  if (radar.worstContracts.length === 0) {
    return { content: "No clause drift findings are on file.", citedContractIds: [] };
  }
  const lines = radar.worstContracts
    .slice(0, 5)
    .map((c, i) => `${i + 1}. **${c.title}**: average drift score ${c.avgDrift}/100 across ${c.findingCount} clause(s)`);
  const categoryLines = radar.byCategory
    .slice(0, 3)
    .map((c) => `- ${titleCase(c.category)}: average drift ${c.avgDrift}/100`);
  return {
    content: `Portfolio-wide average clause drift is ${radar.avgDriftScore}/100, with ${radar.contractsAboveThreshold} contract(s) above the alert threshold.\n\nFurthest from the playbook:\n\n${lines.join("\n")}\n\nCategories drifting most:\n\n${categoryLines.join("\n")}`,
    citedContractIds: radar.worstContracts.slice(0, 5).map((c) => c.contractId),
  };
}

function answerHighestRiskContracts(contracts: ReturnType<typeof listContracts>): PortfolioChatAnswer {
  const ranked = [...contracts].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
  const lines = ranked.map((c, i) => `${i + 1}. **${c.title}** (${c.counterparty}): risk score ${c.riskScore}/100`);
  return {
    content: `Highest-risk contracts in the portfolio:\n\n${lines.join("\n")}`,
    citedContractIds: ranked.map((c) => c.id),
  };
}

function answerPortfolioSummary(contracts: ReturnType<typeof listContracts>): PortfolioChatAnswer {
  const leakage = getLeakageOpportunities().filter((o) => o.status === "open");
  const totalLeakage = leakage.reduce((sum, o) => sum + o.estimatedValue, 0);
  const pendingApprovals = allApprovalsWithContract().filter((a) => a.approval.status === "pending").length;
  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);
  const highRisk = contracts.filter((c) => c.riskScore >= 40).length;
  return {
    content: `The portfolio holds ${contracts.length} contracts worth ${formatMoney(totalValue)}. ${highRisk} are flagged high risk. ${leakage.length} open revenue leakage opportunities total ${formatMoney(totalLeakage)}. ${pendingApprovals} approval step(s) are pending. Ask about leakage, renewals, approval bottlenecks, indemnity exposure, or clause drift for specifics.`,
    citedContractIds: [],
  };
}

function answerGenericSearch(question: string, contracts: ReturnType<typeof listContracts>): PortfolioChatAnswer {
  const scored: { contractId: string; title: string; score: number; snippet: string }[] = [];
  for (const c of contracts) {
    const clauses = getClauses(c.id);
    for (const clause of clauses) {
      const score = scoreRelevance(question, `${clause.heading} ${clause.text}`);
      if (score > 0.08) scored.push({ contractId: c.id, title: c.title, score, snippet: clause.heading });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 4);
  if (top.length === 0) {
    return {
      content:
        "I couldn't find a specific match for that across the portfolio. Try asking about revenue leakage, renewals, approval bottlenecks, indemnity exposure, or clause drift.",
      citedContractIds: [],
    };
  }
  const lines = top.map((t) => `- **${t.title}**: ${t.snippet}`);
  return {
    content: `Here's what I found across the portfolio relevant to your question:\n\n${lines.join("\n")}`,
    citedContractIds: Array.from(new Set(top.map((t) => t.contractId))),
  };
}
