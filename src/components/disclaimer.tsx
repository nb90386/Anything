export function Disclaimer({ inline = false }: { inline?: boolean }) {
  if (inline) {
    return (
      <span className="text-[11px] text-neon-amber/80">
        Research tool only. Paper trading only. Not financial advice.
      </span>
    );
  }
  return (
    <div className="flex items-center justify-center gap-2 border-b border-neon-amber/20 bg-neon-amber/[0.06] px-4 py-1.5 text-center text-[11px] text-neon-amber/90">
      ⚠ Research tool only · Paper trading only · No real funds, keys, or orders · Not financial advice
    </div>
  );
}

export function SampleBanner() {
  return (
    <div className="flex items-center justify-center gap-2 bg-neon-violet/[0.08] px-4 py-1.5 text-center text-[11px] text-neon-violet/90">
      SAMPLE DATA MODE — live Polymarket APIs are unreachable from this environment, so figures below are generated sample
      data (labeled source=&quot;sample&quot;), not real market metrics. Deploy with open network egress for live data.
    </div>
  );
}
