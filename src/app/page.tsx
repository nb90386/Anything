import { commandCenter, EXPERIMENT_DAYS } from "@/lib/queries";
import { Card, Stat, Badge, SectionTitle, ProgressBar, Empty } from "@/components/ui";
import { EquityChart } from "@/components/charts";
import { ExperimentControls } from "@/components/controls";
import { STRATEGY_META, type StrategyId } from "@/lib/types";
import { usd, pct, tone, timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CommandCenter() {
  const { exp, pf, equity, strategies, baselines, health } = await commandCenter();
  const bankroll = exp?.starting_bankroll ?? 10000;
  const beat = pf && baselines ? baselines.filter((b) => pf.total_return_pct > b.ret).length : 0;
  const dayProgress = exp ? Math.min(1, (Date.now() - new Date(exp.start_at).getTime()) / (EXPERIMENT_DAYS * 86400000)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Command Center</h1>
          <p className="mt-1 text-sm text-white/45">
            {exp ? (
              <>
                Experiment <span className="font-mono text-white/70">{exp.id.slice(0, 12)}</span> ·{" "}
                <Badge color={exp.status === "RUNNING" ? "green" : exp.status === "PAUSED" ? "amber" : "slate"}>{exp.status}</Badge> · Day{" "}
                {exp.current_day}/{EXPERIMENT_DAYS}
              </>
            ) : (
              "No experiment yet — start a 7-day autonomous paper-trading run."
            )}
          </p>
        </div>
        <ExperimentControls status={exp?.status ?? null} />
      </div>

      {!exp ? (
        <Empty>
          Press <span className="text-neon-green">Start 7-Day Experiment</span>, then <span className="text-white/70">Run Tick Now</span> (or wire the
          cron) to begin generating signals and paper trades.
        </Empty>
      ) : (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <Stat label="Portfolio Value" value={usd(pf?.total_value ?? bankroll)} sub={`from ${usd(bankroll)}`} />
            <Stat label="Total Return" value={pct(pf?.total_return_pct ?? 0)} sub={pf ? (pf.total_return_pct >= 0 ? "in the green" : "in the red") : "—"} subTone={pf?.total_return_pct ?? 0} />
            <Stat label="Realized P/L" value={usd(pf?.realized_pl ?? 0)} subTone={pf?.realized_pl ?? 0} sub="closed trades" />
            <Stat label="Unrealized P/L" value={usd(pf?.unrealized_pl ?? 0)} subTone={pf?.unrealized_pl ?? 0} sub={`${pf?.open_positions ?? 0} open`} />
            <Stat label="Win Rate" value={pct(pf?.win_rate ?? 0, 1)} sub="of closed trades" />
            <Stat label="Max Drawdown" value={pct(pf?.max_drawdown_pct ?? 0)} subTone={-1} sub={`Sharpe-like ${pf?.sharpe_like ?? 0}`} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Equity curve */}
            <Card className="lg:col-span-2">
              <SectionTitle title="Equity Curve" desc="Mark-to-market portfolio value (conservative exit pricing)" right={<Badge color="cyan">Exposure {pct(pf?.exposure_pct ?? 0, 1)}</Badge>} />
              {equity.length > 1 ? <EquityChart data={equity} baseline={bankroll} /> : <Empty>Collecting snapshots… run a few ticks.</Empty>}
            </Card>

            {/* Experiment progress + health */}
            <div className="space-y-4">
              <Card>
                <SectionTitle title="Experiment Progress" />
                <div className="mb-2 flex justify-between text-xs text-white/50">
                  <span>Day {exp.current_day} of {EXPERIMENT_DAYS}</span>
                  <span>{pct(dayProgress, 0)}</span>
                </div>
                <ProgressBar value={dayProgress} color="violet" />
                <div className="mt-3 text-xs text-white/40">
                  Started {timeAgo(exp.start_at)} · ends {new Date(exp.planned_end_at).toLocaleDateString()}
                </div>
              </Card>
              <Card>
                <SectionTitle title="System Health" />
                <div className="space-y-2 text-sm">
                  <Row label="Last tick" value={health.lastTick ? <Badge color={health.lastTick.ok ? "green" : "red"}>{timeAgo(health.lastTick.created_at)}</Badge> : <Badge color="slate">none</Badge>} />
                  <Row label="Total ticks" value={<span className="text-white/70">{health.tickCount}</span>} />
                  <Row label="Data freshness" value={health.staleMin == null ? <Badge color="slate">—</Badge> : <Badge color={health.staleMin > 20 ? "amber" : "green"}>{health.staleMin.toFixed(0)}m old</Badge>} />
                  <Row label="Recent warnings" value={<span className={tone(-(health.errors.length))}>{health.errors.length}</span>} />
                </div>
              </Card>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Strategy leaderboard */}
            <Card>
              <SectionTitle title="Strategy Leaderboard" desc="By realized P/L · live weights from self-learning" />
              <div className="space-y-2">
                {strategies.map((s) => (
                  <div key={s.strategy} className="flex items-center gap-3">
                    <div className="w-40 shrink-0 truncate text-sm text-white/80">{STRATEGY_META[s.strategy as StrategyId]?.label ?? s.strategy}</div>
                    <div className="flex-1"><ProgressBar value={s.weight} color={s.enabled ? "cyan" : "amber"} /></div>
                    <div className="w-12 text-right text-xs text-white/40">{pct(s.weight, 0)}</div>
                    <div className={`w-20 text-right text-sm ${tone(s.realized_pl)}`}>{usd(s.realized_pl)}</div>
                    <div className="w-14 text-right text-xs text-white/40">{s.wins}/{s.trades}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Baselines */}
            <Card>
              <SectionTitle title="Beating the Baselines?" desc={`PolyAlpha return ${pct(pf?.total_return_pct ?? 0)} · beating ${beat}/${baselines.length}`} right={<Badge color={beat >= 6 ? "green" : beat >= 4 ? "amber" : "red"}>{beat}/{baselines.length}</Badge>} />
              <div className="space-y-1.5">
                <BaselineRow label="◆ PolyAlpha (ensemble)" ret={pf?.total_return_pct ?? 0} highlight />
                {baselines.map((b) => (
                  <BaselineRow key={b.id} label={b.label} ret={b.ret} beaten={(pf?.total_return_pct ?? 0) > b.ret} />
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/45">{label}</span>
      {value}
    </div>
  );
}

function BaselineRow({ label, ret, highlight, beaten }: { label: string; ret: number; highlight?: boolean; beaten?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-lg px-2 py-1.5 ${highlight ? "bg-neon-cyan/10" : ""}`}>
      <span className={`text-sm ${highlight ? "font-semibold text-neon-cyan" : "text-white/70"}`}>{label}</span>
      <div className="flex items-center gap-2">
        {!highlight && <span className={`text-[10px] ${beaten ? "text-neon-green" : "text-neon-red"}`}>{beaten ? "beaten" : "ahead"}</span>}
        <span className={`w-16 text-right text-sm ${tone(ret)}`}>{pct(ret)}</span>
      </div>
    </div>
  );
}
