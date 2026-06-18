/** Apply the schema to the configured database (SQLite or Postgres/Supabase). */
import { ensureSchema, getDb } from "../src/lib/db";
import { config } from "../src/lib/config";

async function main() {
  console.log(`[migrate] driver=${config.db.driver}`);
  await ensureSchema();
  const db = getDb();
  const probe = await db.get<{ n: number }>(`SELECT COUNT(*) AS n FROM experiment_runs`);
  console.log(`[migrate] schema ready. experiment_runs rows=${probe?.n ?? 0}`);
  process.exit(0);
}
main().catch((e) => {
  console.error("[migrate] failed", e);
  process.exit(1);
});
