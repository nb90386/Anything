import { openPositions } from "@/lib/queries";
import { Badge, SectionTitle, Empty, Table } from "@/components/ui";
import { STRATEGY_META, type StrategyId } from "@/lib/types";
import { usd, pct, cents, tone, timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PositionsPage() {
  const { exp, positions } = await openPositions();
  if (!exp) return <Empty>No experiment running.</Empty>;
  const totalUnreal = positions.reduce((s, p) => s + (p.unrealized_pl ?? 0), 0);

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Open Positions"
        desc="Marked to conservative exit price (bid-out / midpoint − slippage)"
        right={<Badge color={totalUnreal >= 0 ? "green" : "red"}>Unrealized {usd(totalUnreal)}</Badge>}
      />
      {positions.length === 0 ? (
        <Empty>No open positions.</Empty>
      ) : (
        <Table head={["Market", "Side", "Strategy", "Entry", "Now", "P/L", "Stop / TP", "Decay", "Opened"]}>
          {positions.map((p) => {
            const plPct = p.cost > 0 ? (p.unrealized_pl ?? 0) / p.cost : 0;
            const decay = p.peak_value > 0 ? (p.peak_value - (p.current_value ?? p.cost)) / p.peak_value : 0;
            return (
              <tr key={p.id} className="hover:bg-white/[0.02]">
                <td className="td max-w-[280px]">
                  <div className="truncate text-white/90">{p.question}</div>
                  <div className="text-[11px] text-white/35">{p.category} · {usd(p.cost)} deployed · risk {(p.risk_score ?? 0).toFixed(2)}</div>
                </td>
                <td className="td"><Badge color={p.side === "YES" ? "green" : "red"}>{p.side}</Badge></td>
                <td className="td text-white/60">{STRATEGY_META[p.strategy as StrategyId]?.short ?? p.strategy}</td>
                <td className="td">{cents(p.entry_price)}</td>
                <td className="td">{cents(p.current_price)}</td>
                <td className={`td ${tone(p.unrealized_pl)}`}>{usd(p.unrealized_pl)}<span className="ml-1 text-[11px] text-white/35">{pct(plPct, 1)}</span></td>
                <td className="td text-[11px] text-white/45">{cents(p.stop_price)} / {cents(p.take_price)}</td>
                <td className="td text-[11px]"><span className={decay > 0.05 ? "text-neon-amber" : "text-white/40"}>{pct(decay, 0)}</span></td>
                <td className="td text-[11px] text-white/40">{timeAgo(p.opened_at)}</td>
              </tr>
            );
          })}
        </Table>
      )}
    </div>
  );
}
