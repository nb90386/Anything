export const usd = (n: number | null | undefined, dp = 2) =>
  n == null ? "—" : `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
export const pct = (n: number | null | undefined, dp = 2) => (n == null ? "—" : `${(n * 100).toFixed(dp)}%`);
export const num = (n: number | null | undefined, dp = 0) =>
  n == null ? "—" : Number(n).toLocaleString(undefined, { maximumFractionDigits: dp });
export const cents = (n: number | null | undefined) => (n == null ? "—" : `${(n * 100).toFixed(1)}¢`);
export const signed = (n: number | null | undefined) => (n == null ? "—" : `${n >= 0 ? "+" : ""}${usd(n)}`);
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "—";
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${Math.floor(s)}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
export const tone = (n: number | null | undefined) =>
  n == null ? "text-white/60" : n > 0 ? "text-neon-green" : n < 0 ? "text-neon-red" : "text-white/60";
