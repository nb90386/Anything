import { NextResponse } from "next/server";
import { allApprovalsWithContract, getClauseDrift, listContracts } from "@/lib/db/repo";
import { computeRevenueIntelligence } from "@/lib/revenue/summary";
import { computeRiskRadar } from "@/lib/risk/radar-summary";
import { computeInsights } from "@/lib/insights";
import { formatDate, formatMoney, titleCase } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET() {
  const md = renderPortfolioReport();
  const fileName = `portfolio-executive-report-${new Date().toISOString().slice(0, 10)}.md`;

  return new NextResponse(md, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-disposition": `attachment; filename="${fileName}"`,
    },
  });
}

function renderPortfolioReport(): string {
  const contracts = listContracts();
  const insights = computeInsights();
  const revenue = computeRevenueIntelligence();
  const radar = computeRiskRadar();
  const pendingApprovals = allApprovalsWithContract().filter((a) => a.approval.status === "pending");
  const allDrift = getClauseDrift();

  const lines: string[] = [];
  lines.push("# Portfolio Executive Report");
  lines.push("");
  lines.push(
    `_Generated ${formatDate(new Date().toISOString())} by the Malbek Revenue Intelligence and Contract Risk Command Center (independent portfolio demo)._`
  );
  lines.push("");
  lines.push("## Portfolio at a glance");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|---|---|");
  lines.push(`| Total contracts | ${insights.totalContracts} |`);
  lines.push(`| Total contract value | ${formatMoney(insights.totalValue, insights.currency)} |`);
  lines.push(`| Open revenue leakage | ${formatMoney(revenue.totalOpenLeakage, revenue.currency)} across ${revenue.openOpportunityCount} opportunities |`);
  lines.push(`| Average clause drift | ${radar.avgDriftScore}/100 across ${allDrift.length} findings |`);
  lines.push(`| Contracts above drift alert threshold | ${radar.contractsAboveThreshold} |`);
  lines.push(`| Approvals pending | ${pendingApprovals.length} |`);
  lines.push(`| High-risk contracts (score >= 40) | ${insights.highRiskContracts.length} |`);
  lines.push("");

  lines.push("## Top revenue leakage opportunities");
  lines.push("");
  if (revenue.topOpportunities.length === 0) {
    lines.push("_No open revenue leakage opportunities are currently flagged._");
  } else {
    lines.push("| Contract | Category | Confidence | Estimated value | Finding |");
    lines.push("|---|---|---|---|---|");
    for (const t of revenue.topOpportunities.slice(0, 3)) {
      lines.push(
        `| ${t.contractTitle} | ${titleCase(t.opportunity.category)} | ${titleCase(t.opportunity.confidence)} | ${formatMoney(t.opportunity.estimatedValue, t.opportunity.currency)} | ${t.opportunity.title} |`
      );
    }
  }
  lines.push("");

  lines.push("## Highest-risk contracts");
  lines.push("");
  if (insights.highRiskContracts.length === 0) {
    lines.push("_No contracts currently score in the high or critical risk band._");
  } else {
    lines.push("| Contract | Risk score |");
    lines.push("|---|---|");
    for (const c of insights.highRiskContracts.slice(0, 3)) {
      lines.push(`| ${c.title} | ${c.riskScore}/100 |`);
    }
  }
  lines.push("");

  lines.push("## Clause drift, furthest from the playbook");
  lines.push("");
  if (radar.worstContracts.length === 0) {
    lines.push("_No clause drift findings are on file._");
  } else {
    lines.push("| Contract | Avg. drift score | Findings |");
    lines.push("|---|---|---|");
    for (const c of radar.worstContracts.slice(0, 3)) {
      lines.push(`| ${c.title} | ${c.avgDrift}/100 | ${c.findingCount} |`);
    }
  }
  lines.push("");

  lines.push("## Approvals pending");
  lines.push("");
  if (pendingApprovals.length === 0) {
    lines.push("_No deals are currently blocked on approval._");
  } else {
    lines.push("| Contract | Waiting on | Approver |");
    lines.push("|---|---|---|");
    for (const a of pendingApprovals.slice(0, 8)) {
      lines.push(`| ${a.contract.title} | ${titleCase(a.approval.approverRole)} | ${a.approval.approverName} |`);
    }
  }
  lines.push("");

  lines.push("## Upcoming renewals");
  lines.push("");
  if (insights.upcomingRenewals.length === 0) {
    lines.push("_No renewals are due within the next 180 days._");
  } else {
    lines.push("| Contract | Expiration | Value | Auto-renew |");
    lines.push("|---|---|---|---|");
    for (const r of insights.upcomingRenewals.slice(0, 8)) {
      lines.push(`| ${r.title} | ${formatDate(r.expirationDate)} | ${formatMoney(r.value, insights.currency)} | ${r.autoRenew ? "Yes" : "No"} |`);
    }
  }
  lines.push("");

  lines.push("## Value by department");
  lines.push("");
  lines.push("| Department | Value |");
  lines.push("|---|---|");
  for (const d of insights.valueByDepartment) {
    lines.push(`| ${d.department} | ${formatMoney(d.value, insights.currency)} |`);
  }
  lines.push("");

  lines.push("---");
  lines.push(
    `_This report reflects ${contracts.length} contracts and live portfolio data at export time. All leakage and drift figures are illustrative, based on seeded demo data. This is an independent portfolio demo project inspired by the Contract Lifecycle Management (CLM) product category. Not affiliated with Malbek Inc._`
  );

  return lines.join("\n");
}
