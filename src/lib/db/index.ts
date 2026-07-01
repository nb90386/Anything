import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA_SQL } from "./schema";

// Serverless platforms (Vercel, and similar) ship a read-only deployment bundle;
// only /tmp is writable there. Traditional Node hosts (local dev, Railway, Render,
// Fly, Docker) can write directly next to the project, which also survives restarts.
const DATA_DIR = process.env.VERCEL ? "/tmp/data" : path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "clm.db");

declare global {
  // eslint-disable-next-line no-var
  var __clmDb: Database.Database | undefined;
}

function createConnection(): Database.Database {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA_SQL);
  return db;
}

// Reuse a single connection across hot reloads / route invocations in dev.
export const db: Database.Database = globalThis.__clmDb ?? createConnection();
if (process.env.NODE_ENV !== "production") {
  globalThis.__clmDb = db;
}

export function isSeeded(): boolean {
  const row = db.prepare("SELECT COUNT(*) as count FROM contracts").get() as { count: number };
  return row.count > 0;
}
