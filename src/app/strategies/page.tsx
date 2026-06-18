import { strategyLab } from "@/lib/queries";
import { Card, Badge, SectionTitle, Empty, Table, ProgressBar } from "@/components/ui";
import { STRATEGY_META, type StrategyId } from "@/lib/types";
import { usd, pct, tone, timeAgo } from "@/lib/format";
import { betaPosterior } from "@/lib/engine/indicators";

export const dynamic = "force-dynamic";

export default async function StrategyLabPage() {
  const { exp, states, updates } = await strategyLab();
  if (!exp) return <Empty>No experiment running.</Empty>;

  return (
    <div className="space-y-6">
      <SectionTitle title="Strategy Lab" desc="Per-strategy performance, live weights, and Bayesian win-rate confidence intervals" />
      <Table head={["Strategy", "Weight", "Trades", "W/L", "Win-rate (95% CI)", "Realized P/L", "Threshold", "Status"]}>
        {states.map((s) => {
          const post = betaPosterior(s.wins, s.losses);
          return (
            <tr key={s.strategy} className="hover:bg-white/[0.02]">
              <td className="td text-white/90">{STRATEGY_META[s.strategy as StrategyId]?.label ?? s.strategy}</td>
              <td className="td w-40">
                <div className="flex items-center gap-2"><div className="flex-1"><ProgressBar value={s.weight} color={s.enabled ? "cyan" : "amber"} /></div><span className="w-10 text-right text-xs text-white/50">{pct(s.weight, 0)}</span></div>
              </td>
              <td className="td text-white/60">{s.trades}</td>
              <td className="td text-white/60">{s.wins}/{s.losses}</td>
              <td className="td text-[12px] text-white/60">{pct(post.lower, 0)}–{pct(post.upper, 0)}<span className="ml-1 text-white/35">μ{pct(post.mean, 0)}</span></td>
              <td className={`td ${tone(s.realized_pl)}`}>{usd(s.realized_pl)}</td>
              <td className="td text-white/50">{s.threshold.toFixed(2)}</td>
              <td className="td">{s.enabled ? <Badge color="green">active</Badge> : <Badge color="amber">throttled</Badge>}</td>
            </tr>
          );
        })}
      </Table>

      <Card>
        <SectionTitle title="Self-Learning Updates" desc="Slow Bayesian weight/threshold adjustments with sample sizes (anti-overfitting)" />
        {updates.length === 0 ? (
          <Empty>No learning updates yet.</Empty>
        ) : (
          <div className="max-h-[420px] space-y-1.5 overflow-y-auto">
            {updates.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <Badge color="violet">{STRATEGY_META[u.strategy as StrategyId]?.short ?? u.strategy}</Badge>
                  <span className="text-white/50">{u.field}</span>
                  <span className="font-mono text-white/70">{Number(u.old_value).toFixed(3)} → {Number(u.new_value).toFixed(3)}</span>
                  <span className="text-white/35">({u.reason})</span>
                </div>
                <div className="text-white/30">n={u.sample_size} · {timeAgo(u.ts)}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
