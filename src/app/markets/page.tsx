import { marketIntel } from "@/lib/queries";
import { Card, Badge, SectionTitle, Empty } from "@/components/ui";
import { Sparkline } from "@/components/charts";
import { usd, cents } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MarketsPage() {
  const { markets } = await marketIntel();
  return (
    <div className="space-y-6">
      <SectionTitle title="Market Intelligence" desc="Active markets with liquidity, spread, order-book snapshot, and price trend" />
      {markets.length === 0 ? (
        <Empty>No markets ingested yet.</Empty>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {markets.map((m) => {
            const yes = m.book?.midpoint ?? m.series.at(-1) ?? null;
            const trend = m.series.length > 1 ? m.series.at(-1)! - m.series[0] : 0;
            return (
              <Card key={m.id} className="!p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-white/90">{m.question}</div>
                    <div className="mt-0.5 text-[11px] text-white/35">{m.category}</div>
                  </div>
                  <Badge color={yes != null && yes > 0.5 ? "green" : "slate"}>{yes != null ? cents(yes) : "—"}</Badge>
                </div>
                <div className="mt-2"><Sparkline data={m.series.length ? m.series : [yes ?? 0.5]} color={trend >= 0 ? "#3ee08f" : "#ff5470"} /></div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                  <div><div className="text-white/35">Liquidity</div><div className="text-white/70">{usd(m.liquidity, 0)}</div></div>
                  <div><div className="text-white/35">Spread</div><div className="text-white/70">{m.book?.spread != null ? cents(m.book.spread) : "—"}</div></div>
                  <div><div className="text-white/35">Volume</div><div className="text-white/70">{usd(m.volume, 0)}</div></div>
                </div>
                {m.book && (
                  <div className="mt-2 flex justify-between text-[11px] text-white/40">
                    <span>bid {cents(m.book.best_bid)} · depth {Math.round(m.book.bid_depth)}</span>
                    <span>ask {cents(m.book.best_ask)} · depth {Math.round(m.book.ask_depth)}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
