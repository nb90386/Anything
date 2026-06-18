/**
 * Continuous autonomous runner. Calls tick() on a fixed interval. Because all
 * state lives in the DB, this process can crash and restart at any time and the
 * experiment resumes exactly where it left off (missed ticks are simply skipped;
 * the next tick reconciles open positions and time-based day rollover).
 *
 * Usage:  TICK_MINUTES=10 npm run runner
 * For 7-day unattended operation run under a supervisor (pm2/systemd) or use the
 * Vercel Cron route at /api/cron/tick instead.
 */
import { tick } from "../src/lib/engine/experiment";

const TICK_MINUTES = Number(process.env.TICK_MINUTES || 10);
const INTERVAL_MS = Math.max(1, TICK_MINUTES) * 60_000;
let running = false;
let stopping = false;

async function safeTick() {
  if (running) {
    console.log("[runner] previous tick still running; skipping");
    return;
  }
  running = true;
  try {
    const r = await tick();
    console.log(`[runner] ${new Date().toISOString()} status=${r.status} mode=${r.mode ?? "-"} signals=${r.signals ?? 0} opened=${r.opened ?? 0} closed=${r.closed ?? 0} value=${r.portfolioValue ?? "-"} (${r.durationMs}ms)`);
    if (r.status === "COMPLETED") {
      console.log("[runner] experiment COMPLETED — final report generated. Stopping.");
      stopping = true;
    }
  } catch (e) {
    console.error("[runner] tick error", e);
  } finally {
    running = false;
  }
}

async function main() {
  console.log(`[runner] starting; interval=${TICK_MINUTES}m`);
  await safeTick();
  const timer = setInterval(async () => {
    if (stopping) {
      clearInterval(timer);
      process.exit(0);
    }
    await safeTick();
  }, INTERVAL_MS);
  process.on("SIGINT", () => {
    console.log("[runner] SIGINT — exiting (state persisted in DB)");
    clearInterval(timer);
    process.exit(0);
  });
}
main();
