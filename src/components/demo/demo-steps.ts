import type { PortfolioInsights } from "@/lib/types";
import type { RevenueIntelligenceSummary } from "@/lib/types";
import type { RiskRadarSummary } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

export interface DemoStep {
  step: number;
  headline: string;
  stat: { label: string; value: string }[];
  body: string;
  presenterNote: string;
  href: string;
  linkLabel: string;
}

/** Builds the guided demo script from live portfolio data. Numbers are computed
 * at render time, not hardcoded, so the story stays accurate after a demo reset
 * or a data change. */
export function buildDemoSteps(
  insights: PortfolioInsights,
  revenue: RevenueIntelligenceSummary,
  radar: RiskRadarSummary
): DemoStep[] {
  const topLeakage = revenue.topOpportunities.slice(0, 3);
  const worstContracts = radar.worstContracts.slice(0, 3);
  const highRisk = insights.highRiskContracts.slice(0, 3);

  return [
    {
      step: 1,
      headline: `This portfolio is leaving ${formatMoney(revenue.totalOpenLeakage, revenue.currency)} on the table this quarter`,
      stat: [
        { label: "Open revenue leakage", value: formatMoney(revenue.totalOpenLeakage, revenue.currency) },
        { label: "Open opportunities", value: String(revenue.openOpportunityCount) },
      ],
      body: `Across ${insights.totalContracts} contracts worth ${formatMoney(insights.totalValue, insights.currency)}, ${revenue.openOpportunityCount} revenue leakage opportunities are sitting open right now: missed escalators, uncaptured renewal uplifts, discount creep, and unrecovered SLA penalties. Nobody would know this number without opening this dashboard.`,
      presenterNote: "Open on the dashboard. Say the leakage number out loud before saying anything else.",
      href: "/dashboard",
      linkLabel: "Open the dashboard",
    },
    {
      step: 2,
      headline: topLeakage[0]
        ? `${topLeakage[0].contractTitle} alone accounts for ${formatMoney(topLeakage[0].opportunity.estimatedValue, topLeakage[0].opportunity.currency)}`
        : "The top leakage opportunities, traced to specific clauses",
      stat: topLeakage.map((t) => ({
        label: t.contractTitle,
        value: formatMoney(t.opportunity.estimatedValue, t.opportunity.currency),
      })),
      body: "Every dollar figure here traces to a specific clause and a specific date: an escalator that should have triggered, a discount that ran past its expiration, an SLA breach with no penalty credit applied. This is real math over real contract text, not a vibe.",
      presenterNote: "Click into the top leakage figure and show the clause and date behind the math.",
      href: "/revenue-leakage",
      linkLabel: "Open Revenue Leakage",
    },
    {
      step: 3,
      headline: `Risk concentrates in ${worstContracts.length} contracts, and it is not a coincidence`,
      stat: [
        { label: "Avg. clause drift", value: `${radar.avgDriftScore}/100` },
        { label: "Contracts above alert threshold", value: String(radar.contractsAboveThreshold) },
      ],
      body: worstContracts[0]
        ? `${worstContracts[0].title} shows up here and in the leakage view. Same underlying data model, surfaced two ways: what we are losing, and what is exposed to be lost next.`
        : "The Risk Radar plots every contract by clause-risk severity and drift from the playbook, so exposure is visible before it becomes a loss.",
      presenterNote: "Point out the same contract appearing in both the leakage list and the highest-risk zone.",
      href: "/risk-radar",
      linkLabel: "Open Risk Radar",
    },
    {
      step: 4,
      headline: "Clause drift shows how the problem got worse over time",
      stat: [
        { label: "Categories tracked", value: String(radar.byCategory.length) },
        {
          label: "Worst category",
          value: radar.byCategory[0] ? `${radar.byCategory[0].category.replace(/_/g, " ")}` : "None",
        },
      ],
      body: "This is where the story shifts from 'here is a problem' to 'here is how the problem got worse over time.' A liability or indemnification clause that drifted further from the house playbook with each amendment would have been caught at amendment two instead of amendment five.",
      presenterNote: "Open a contract with multiple versions and show the drift trend, not just a single flag.",
      href: "/clause-drift",
      linkLabel: "Open Clause Drift",
    },
    {
      step: 5,
      headline: "The AI Copilot answers the follow-up question in one screen",
      stat: [
        { label: "Approvals pending", value: String(insights.approvalsPending) },
        { label: "High-risk contracts", value: String(highRisk.length) },
      ],
      body: 'Ask "which deals are blocked by legal approval" or "what is our total exposure from non-standard indemnity clauses" and get a cited, traceable answer, not a black box. This is retrieval over the same structured data every other page reads, so the answer always matches what is on screen elsewhere.',
      presenterNote: 'Ask the copilot a real question live. Suggested: "Which contracts create the most revenue leakage?"',
      href: "/copilot",
      linkLabel: "Open the Copilot",
    },
    {
      step: 6,
      headline: "One data model, five roles, no separate tools stitched together",
      stat: [
        { label: "Total portfolio value", value: formatMoney(insights.totalValue, insights.currency) },
        { label: "Departments represented", value: String(insights.valueByDepartment.length) },
      ],
      body: "Switch the role selector to Finance, Legal, or Procurement and the same underlying numbers reorganize around that role's first question. That is the actual point of the product: proof of one coherent architecture, not four features bolted together.",
      presenterNote: "Switch roles in the topbar live. Keep this beat short, it is proof of architecture, not a second tour.",
      href: "/dashboard",
      linkLabel: "Switch roles on the dashboard",
    },
    {
      step: 7,
      headline: "Export the board pack, live, from the same data just shown",
      stat: [
        { label: "Top leakage opportunities", value: String(revenue.topOpportunities.length) },
        { label: "Highest-risk contracts", value: String(highRisk.length) },
      ],
      body: "The executive report pulls the exact numbers just walked through onto one clean, board-ready page. Detection is being solved industry-wide. The delivery problem, getting an executive from zero to a specific, trustworthy number in one screen, is what this demo exists to prove, in miniature.",
      presenterNote: "Generate the report live and let it land as the closing beat, not an afterthought.",
      href: "/report",
      linkLabel: "Open Executive Report",
    },
  ];
}
