/**
 * Bootstrap a demo run: start an experiment and execute several ticks so the
 * dashboard is populated immediately. In offline/dev environments this uses the
 * clearly-labeled SAMPLE dataset (source="sample").
 */
import { startExperiment, tick } from "../src/lib/engine/experiment";

async function main() {
  const ticks = Number(process.argv[2] || 6);
  const exp = await startExperiment();
  console.log(`[seed] experiment ${exp.id} (${exp.status})`);
  for (let i = 0; i < ticks; i++) {
    const r = await tick();
    console.log(`[seed] tick ${i + 1}/${ticks}: mode=${r.mode} signals=${r.signals} eligible=${r.eligible} opened=${r.opened} closed=${r.closed} value=${r.portfolioValue}`);
  }
  console.log("[seed] done.");
  process.exit(0);
}
main().catch((e) => {
  console.error("[seed] failed", e);
  process.exit(1);
});
