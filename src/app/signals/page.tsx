import { liveSignals } from "@/lib/queries";
import { Card, Badge, SectionTitle, Empty, Table } from "@/components/ui";
import { STRATEGY_META, type StrategyId } from "@/lib/types";
import { pct, usd } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SignalsPage() {
  const { exp, signals } = await liveSignals();
  if (!exp) return <Empty>No experiment running. Start one from the Command Center.</Empty>;
  const eligible = signals.filter((s) => s.eligible);

  return (
    <div className="space-y-6">
      <SectionTitle title="Live Signals" desc="Latest ensemble signals with accept/reject reasoning and strategy contributions" right={<Badge color="green">{eligible.length} eligible</Badge>} />
      {signals.length === 0 ? (
        <Empty>No signals yet — run a tick to generate them.</Empty>
      ) : (
        <div className="grid gap-3">
          {signals.map((s) => (
            <Card key={s.id} className="!p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge color={s.side === "YES" ? "green" : "red"}>{s.side}</Badge>
                    <Badge color="cyan">{STRATEGY_META[s.top_strategy as StrategyId]?.short ?? s.top_strategy}</Badge>
                    <Badge color="slate">{s.category}</Badge>
                    {s.eligible ? <Badge color="green">ELIGIBLE</Badge> : <Badge color="amber">REJECTED</Badge>}
                  </div>
                  <div className="mt-2 truncate text-sm font-medium text-white/90">{s.question}</div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/45">
                    {s.reasons.map((r: string, i: number) => (
                      <span key={i} className={r.startsWith("accepted") ? "text-neon-green" : ""}>• {r}</span>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.contributions.map((c: any) => (
                      <span key={c.strategy} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/55">
                        {STRATEGY_META[c.strategy as StrategyId]?.short ?? c.strategy} · {c.score.toFixed(2)} × w{(c.weight * 100).toFixed(0)}%
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-widest text-white/40">Ensemble</div>
                  <div className={`text-2xl font-semibold ${s.ensemble_score >= 0.55 ? "text-neon-green" : "text-white/70"}`}>{(s.ensemble_score * 100).toFixed(0)}</div>
                  <div className="text-[11px] text-white/35">liquidity {usd(s.liquidity, 0)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
