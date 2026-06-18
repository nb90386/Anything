import { systemHealth } from "@/lib/queries";
import { Card, Badge, SectionTitle, Empty, Stat, Table } from "@/components/ui";
import { timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

const LEVEL_COLOR: Record<string, "red" | "amber" | "slate" | "cyan"> = { ERROR: "red", WARN: "amber", INFO: "slate", DEBUG: "slate" };

export default async function HealthPage() {
  const { hosts, lastTick, tickCount, errors, staleMin, heartbeats, logs, apiChecks } = await systemHealth();

  return (
    <div className="space-y-6">
      <SectionTitle title="System Health" desc="API status, cron heartbeats, data freshness, and recovery logs" />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total Ticks" value={tickCount} />
        <Stat label="Last Tick" value={lastTick ? timeAgo(lastTick.created_at) : "—"} sub={lastTick ? (lastTick.ok ? "ok" : "failed") : ""} subTone={lastTick?.ok ? 1 : -1} />
        <Stat label="Data Freshness" value={staleMin == null ? "—" : `${staleMin.toFixed(0)}m`} subTone={staleMin != null && staleMin > 20 ? -1 : 1} sub={staleMin != null && staleMin > 20 ? "STALE" : "fresh"} />
        <Stat label="Warnings/Errors" value={errors.length} subTone={errors.length ? -1 : 1} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle title="API Hosts" desc="Read-only Polymarket endpoints" />
          {hosts.length === 0 ? <Empty>No API calls recorded yet.</Empty> : (
            <div className="space-y-2">
              {hosts.map((h: any) => {
                const rate = h.total ? h.oks / h.total : 0;
                return (
                  <div key={h.host} className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2 text-sm">
                    <span className="font-mono text-xs text-white/70">{h.host}</span>
                    <div className="flex items-center gap-2"><span className="text-[11px] text-white/35">{timeAgo(h.last)}</span><Badge color={rate > 0.8 ? "green" : rate > 0.3 ? "amber" : "red"}>{(rate * 100).toFixed(0)}% ok</Badge></div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle title="Cron Heartbeats" desc="Autonomous tick health" />
          {heartbeats.length === 0 ? <Empty>No heartbeats yet.</Empty> : (
            <div className="max-h-[280px] space-y-1 overflow-y-auto">
              {heartbeats.map((h: any) => (
                <div key={h.id} className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-1.5 text-xs">
                  <div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${h.ok ? "bg-neon-green" : "bg-neon-red"}`} /><span className="text-white/60">{h.job}</span></div>
                  <span className="text-white/30">{h.duration_ms}ms · {timeAgo(h.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <SectionTitle title="Recent Logs" desc="System events, warnings, and recovery messages" />
        {logs.length === 0 ? <Empty>No logs.</Empty> : (
          <div className="max-h-[420px] space-y-1 overflow-y-auto font-mono text-[11px]">
            {logs.map((l: any) => (
              <div key={l.id} className="flex items-start gap-2 border-b border-white/5 py-1">
                <Badge color={LEVEL_COLOR[l.level] ?? "slate"}>{l.level}</Badge>
                <span className="text-white/40">{l.scope}</span>
                <span className="flex-1 text-white/70">{l.message}</span>
                <span className="text-white/25">{timeAgo(l.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
