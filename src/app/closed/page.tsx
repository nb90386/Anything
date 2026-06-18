import { closedTrades } from "@/lib/queries";
import { Badge, SectionTitle, Empty, Table, Stat } from "@/components/ui";
import { STRATEGY_META, type StrategyId } from "@/lib/types";
import { usd, pct, cents, tone } from "@/lib/format";

export const dynamic = "force-dynamic";

const REASON_COLOR: Record<string, "green" | "red" | "amber" | "slate" | "cyan"> = {
  TAKE_PROFIT: "green",
  STOP_LOSS: "red",
  TRAILING_STOP: "cyan",
  MARKET_RESOLVED: "violet" as any,
  EXPERIMENT_END: "slate",
  STALE_DATA: "amber",
  LIQUIDITY_GONE: "amber",
  SIGNAL_DECAY: "amber",
};

function mistakeNote(p: any): string {
  const pl = p.realized_pl ?? 0;
  if (p.exit_reason === "STOP_LOSS") return "Hit stop — entry thesis invalidated or too-wide entry spread.";
  if (p.exit_reason === "TRAILING_STOP" && pl > 0) return "Locked gains via trailing stop — worked as designed.";
  if (p.exit_reason === "STALE_DATA") return "Closed on stale data — data-quality guard, not a thesis change.";
  if (p.exit_reason === "TAKE_PROFIT") return "Target hit cleanly.";
  if (pl <= 0) return "Loser — review signal score vs realized move.";
  return "Winner.";
}

export default async function ClosedPage() {
  const { exp, trades } = await closedTrades();
  if (!exp) return <Empty>No experiment running.</Empty>;
  const realized = trades.reduce((s, t) => s + (t.realized_pl ?? 0), 0);
  const wins = trades.filter((t) => (t.realized_pl ?? 0) > 0).length;

  return (
    <div className="space-y-6">
      <SectionTitle title="Closed Trades" desc="Full trade history with exit reason and mistake analysis" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Closed Trades" value={trades.length} />
        <Stat label="Realized P/L" value={usd(realized)} subTone={realized} />
        <Stat label="Win Rate" value={trades.length ? pct(wins / trades.length, 1) : "—"} />
        <Stat label="Winners / Losers" value={`${wins} / ${trades.length - wins}`} />
      </div>
      {trades.length === 0 ? (
        <Empty>No closed trades yet.</Empty>
      ) : (
        <Table head={["Market", "Side", "Strategy", "Entry → Exit", "P/L", "Reason", "Analysis"]}>
          {trades.map((t) => (
            <tr key={t.id} className="hover:bg-white/[0.02]">
              <td className="td max-w-[240px]"><div className="truncate text-white/90">{t.question}</div><div className="text-[11px] text-white/35">{t.category}</div></td>
              <td className="td"><Badge color={t.side === "YES" ? "green" : "red"}>{t.side}</Badge></td>
              <td className="td text-white/60">{STRATEGY_META[t.strategy as StrategyId]?.short ?? t.strategy}</td>
              <td className="td text-[12px] text-white/60">{cents(t.entry_price)} → {cents(t.exit_price)}</td>
              <td className={`td ${tone(t.realized_pl)}`}>{usd(t.realized_pl)}</td>
              <td className="td"><Badge color={REASON_COLOR[t.exit_reason] ?? "slate"}>{(t.exit_reason || "").replace(/_/g, " ")}</Badge></td>
              <td className="td max-w-[260px] text-[11px] text-white/45">{mistakeNote(t)}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
