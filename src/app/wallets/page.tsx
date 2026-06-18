import { smartWallets } from "@/lib/queries";
import { Badge, SectionTitle, Empty, Table } from "@/components/ui";
import { usd, num } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function WalletsPage() {
  const { traders } = await smartWallets();
  return (
    <div className="space-y-6">
      <SectionTitle title="Smart Wallets" desc="Tracked leaderboard wallets, scores, and current market exposure (read-only public data)" />
      {traders.length === 0 ? (
        <Empty>No tracked wallets yet — run a tick to ingest the leaderboard.</Empty>
      ) : (
        <Table head={["Rank", "Wallet", "PnL", "Volume", "Score", "Held Markets", "Signal Contribution"]}>
          {traders.map((t, i) => (
            <tr key={t.id} className="hover:bg-white/[0.02]">
              <td className="td text-white/50">#{t.rank ?? i + 1}</td>
              <td className="td"><div className="font-mono text-xs text-white/80">{t.handle || `${t.address.slice(0, 10)}…`}</div></td>
              <td className="td text-neon-green">{usd(t.pnl, 0)}</td>
              <td className="td text-white/60">{usd(t.volume, 0)}</td>
              <td className="td">{t.score ? <Badge color="cyan">{Number(t.score.score).toFixed(2)}</Badge> : <span className="text-white/30">—</span>}</td>
              <td className="td">
                <div className="flex flex-wrap gap-1">
                  {t.positions.length === 0 && <span className="text-white/30">—</span>}
                  {t.positions.map((p: any, j: number) => (
                    <span key={j} className={`rounded border px-1.5 py-0.5 text-[10px] ${p.side === "YES" ? "border-neon-green/30 text-neon-green/80" : "border-neon-red/30 text-neon-red/80"}`}>
                      {p.side} {num(p.size, 0)}
                    </span>
                  ))}
                </div>
              </td>
              <td className="td text-[11px] text-white/45">{t.positions.length} positions feed Consensus + Smart-Wallet signals</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
