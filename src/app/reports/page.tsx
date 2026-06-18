import { reports } from "@/lib/queries";
import { Card, Badge, SectionTitle, Empty } from "@/components/ui";
import { timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const { exp, daily, final } = await reports();
  if (!exp) return <Empty>No experiment running.</Empty>;

  return (
    <div className="space-y-6">
      <SectionTitle title="Reports" desc="Daily summaries and the final 7-day experiment verdict" />

      {final && (
        <Card className="border-neon-cyan/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Final Experiment Report</h2>
            <Badge color={final.verdict?.startsWith("PROMISING") ? "green" : final.verdict?.startsWith("NOT") ? "red" : "amber"}>VERDICT</Badge>
          </div>
          <p className="mt-2 text-sm font-medium text-neon-cyan">{final.verdict}</p>
          <p className="mt-2 text-sm text-white/70">{final.summary}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <div className="stat-label mb-2">Lessons Learned</div>
              <ul className="space-y-1 text-sm text-white/65">{final.lessons.map((l: string, i: number) => <li key={i}>• {l}</li>)}</ul>
            </div>
            <div>
              <div className="stat-label mb-2">Version 2 Roadmap</div>
              <ul className="space-y-1 text-sm text-white/65">{final.v2.map((l: string, i: number) => <li key={i}>• {l}</li>)}</ul>
            </div>
          </div>
        </Card>
      )}

      <SectionTitle title="Daily Reports" />
      {daily.length === 0 ? (
        <Empty>No daily reports yet — generated automatically each tick/day.</Empty>
      ) : (
        <div className="space-y-3">
          {daily.map((d) => (
            <Card key={d.id} className="!p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Day {d.day}</h3>
                <span className="text-[11px] text-white/35">{timeAgo(d.ts)}</span>
              </div>
              <p className="mt-1.5 text-sm text-white/65">{d.summary}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
