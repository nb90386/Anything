import { riskCenter } from "@/lib/queries";
import { Card, Badge, SectionTitle, Empty, Stat, ProgressBar, Table } from "@/components/ui";
import { RISK } from "@/lib/config";
import { usd, pct, tone, timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RiskPage() {
  const { exp, positions, byCategory, latestRisk, pf, decisions } = await riskCenter();
  if (!exp) return <Empty>No experiment running.</Empty>;
  const bankroll = exp.starting_bankroll;
  const exposure = pf?.exposure_pct ?? 0;
  const worstCase = positions.reduce((s, p) => s + p.cost * Math.abs(RISK.stopLossPct), 0);

  return (
    <div className="space-y-6">
      <SectionTitle title="Risk Center" desc="Exposure caps, concentration, and per-trade sizing decisions" right={<Badge color={exposure < RISK.maxOpenExposurePct ? "green" : "red"}>Exposure {pct(exposure, 1)}</Badge>} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Open Exposure" value={pct(exposure, 1)} sub={`cap ${pct(RISK.maxOpenExposurePct, 0)}`} />
        <Stat label="Worst-Case Loss" value={usd(-worstCase)} subTone={-1} sub="if all stops hit" />
        <Stat label="Max Drawdown" value={pct(pf?.max_drawdown_pct ?? 0)} subTone={-1} />
        <Stat label="Open Positions" value={positions.length} sub={`of ${25} max`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Exposure by Category" desc={`Per-category cap ${pct(RISK.maxCategoryExposurePct, 0)} · correlated cap ${pct(RISK.maxCorrelatedExposurePct, 0)}`} />
          {byCategory.length === 0 ? <Empty>No exposure.</Empty> : (
            <div className="space-y-3">
              {byCategory.map((c) => (
                <div key={c.category}>
                  <div className="mb-1 flex justify-between text-xs"><span className="text-white/70">{c.category}</span><span className={c.pct > RISK.maxCategoryExposurePct ? "text-neon-red" : "text-white/50"}>{usd(c.cost)} · {pct(c.pct, 1)}</span></div>
                  <ProgressBar value={c.pct / RISK.maxCategoryExposurePct} color={c.pct > RISK.maxCategoryExposurePct ? "amber" : "cyan"} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle title="Risk Limit Status" />
          <div className="space-y-2 text-sm">
            <LimitRow label="Single position" cap={pct(RISK.maxSinglePct, 1)} ok />
            <LimitRow label="Open exposure" cap={pct(RISK.maxOpenExposurePct, 0)} ok={exposure <= RISK.maxOpenExposurePct} />
            <LimitRow label="Category exposure" cap={pct(RISK.maxCategoryExposurePct, 0)} ok={byCategory.every((c) => c.pct <= RISK.maxCategoryExposurePct)} />
            <LimitRow label="Fractional Kelly" cap={`${RISK.kellyFraction}× (capped)`} ok />
            <LimitRow label="Leverage" cap="disabled" ok />
            <div className="mt-3 text-[11px] text-white/35">Latest gate decision: {latestRisk ? <span className={latestRisk.limits_ok ? "text-neon-green" : "text-neon-red"}>{latestRisk.limits_ok ? "PASS" : "BLOCKED"}</span> : "—"} {latestRisk ? `· ${timeAgo(latestRisk.ts)}` : ""}</div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Recent Sizing Decisions" desc="Position-sizing and limit checks per candidate trade" />
        {!decisions?.length ? <Empty>No decisions logged.</Empty> : (
          <Table head={["Time", "Status", "Exposure", "Worst-case", "Detail"]}>
            {decisions.map((d: any) => {
              const det = safe(d.detail);
              return (
                <tr key={d.id}>
                  <td className="td text-[11px] text-white/40">{timeAgo(d.ts)}</td>
                  <td className="td">{d.limits_ok ? <Badge color="green">PASS</Badge> : <Badge color="red">BLOCK</Badge>}</td>
                  <td className="td text-white/60">{pct(d.exposure_pct, 1)}</td>
                  <td className={`td ${tone(d.worst_case_loss)}`}>{usd(d.worst_case_loss)}</td>
                  <td className="td max-w-[360px] text-[11px] text-white/40">{det?.reasons?.join("; ") ?? "—"}</td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>
    </div>
  );
}

function LimitRow({ label, cap, ok }: { label: string; cap: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
      <span className="text-white/55">{label}</span>
      <div className="flex items-center gap-2"><span className="text-xs text-white/40">{cap}</span><Badge color={ok ? "green" : "red"}>{ok ? "OK" : "BREACH"}</Badge></div>
    </div>
  );
}
function safe(s: any) { try { return JSON.parse(s); } catch { return null; } }
