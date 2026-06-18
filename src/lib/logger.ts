import { getDb, ensureSchema, newId, nowIso } from "@/lib/db";

type Level = "DEBUG" | "INFO" | "WARN" | "ERROR";

async function write(level: Level, scope: string, message: string, detail?: unknown) {
  // eslint-disable-next-line no-console
  console[level === "ERROR" ? "error" : level === "WARN" ? "warn" : "log"](`[${level}] ${scope}: ${message}`);
  try {
    await ensureSchema();
    const db = getDb();
    await db.run(
      `INSERT INTO system_logs (id, level, scope, message, detail, source, created_at) VALUES (?,?,?,?,?,?,?)`,
      [newId("log"), level, scope, message, detail ? JSON.stringify(detail) : null, "system", nowIso()]
    );
  } catch {
    /* logging must never throw */
  }
}

export const log = {
  debug: (scope: string, msg: string, d?: unknown) => write("DEBUG", scope, msg, d),
  info: (scope: string, msg: string, d?: unknown) => write("INFO", scope, msg, d),
  warn: (scope: string, msg: string, d?: unknown) => write("WARN", scope, msg, d),
  error: (scope: string, msg: string, d?: unknown) => write("ERROR", scope, msg, d),
};

export async function heartbeat(job: string, ok: boolean, durationMs: number, detail?: unknown) {
  try {
    await ensureSchema();
    const db = getDb();
    await db.run(
      `INSERT INTO cron_heartbeats (id, job, ok, duration_ms, detail, source, created_at) VALUES (?,?,?,?,?,?,?)`,
      [newId("hb"), job, ok ? 1 : 0, Math.round(durationMs), detail ? JSON.stringify(detail) : null, "cron", nowIso()]
    );
  } catch {
    /* ignore */
  }
}
