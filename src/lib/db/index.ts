/**
 * Database adapter. One async API over two engines:
 *   - SQLite (better-sqlite3) — default, zero-config, great for local/dev and
 *     the ephemeral build environment.
 *   - Postgres (pg) — production / Supabase, enabled via DB_DRIVER=postgres.
 *
 * SQL is written with `?` placeholders (SQLite style); the Postgres adapter
 * rewrites them to `$1..$n`. All callers use `await`.
 */
import { config } from "@/lib/config";
import { SCHEMA_SQL } from "@/lib/db/schema";

export interface Db {
  all<T = any>(sql: string, params?: any[]): Promise<T[]>;
  get<T = any>(sql: string, params?: any[]): Promise<T | undefined>;
  run(sql: string, params?: any[]): Promise<void>;
  exec(sql: string): Promise<void>;
  driver: "sqlite" | "postgres";
}

let _db: Db | null = null;

function toPgPlaceholders(sql: string): string {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

function createSqlite(): Db {
  // Lazy require so the native module is only loaded server-side.
  const Database = require("better-sqlite3");
  const fs = require("fs");
  const path = require("path");
  const file = config.db.sqlitePath;
  const dir = path.dirname(file);
  if (dir && dir !== "." && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const sqlite = new Database(file);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return {
    driver: "sqlite",
    async all<T>(sql: string, params: any[] = []) {
      return sqlite.prepare(sql).all(...params) as T[];
    },
    async get<T>(sql: string, params: any[] = []) {
      return sqlite.prepare(sql).get(...params) as T | undefined;
    },
    async run(sql: string, params: any[] = []) {
      sqlite.prepare(sql).run(...params);
    },
    async exec(sql: string) {
      sqlite.exec(sql);
    },
  };
}

function createPostgres(): Db {
  const { Pool } = require("pg");
  const pool = new Pool({
    connectionString: config.db.databaseUrl,
    ssl: config.db.databaseUrl.includes("localhost") ? false : { rejectUnauthorized: false },
    max: 5,
  });
  return {
    driver: "postgres",
    async all<T>(sql: string, params: any[] = []) {
      const r = await pool.query(toPgPlaceholders(sql), params);
      return r.rows as T[];
    },
    async get<T>(sql: string, params: any[] = []) {
      const r = await pool.query(toPgPlaceholders(sql), params);
      return r.rows[0] as T | undefined;
    },
    async run(sql: string, params: any[] = []) {
      await pool.query(toPgPlaceholders(sql), params);
    },
    async exec(sql: string) {
      // pg can run multiple statements in one query call.
      await pool.query(sql);
    },
  };
}

export function getDb(): Db {
  if (_db) return _db;
  _db = config.db.driver === "postgres" ? createPostgres() : createSqlite();
  return _db;
}

let _migrated = false;
export async function ensureSchema(): Promise<void> {
  if (_migrated) return;
  const db = getDb();
  // Both engines accept the multi-statement schema via exec().
  await db.exec(SCHEMA_SQL);
  _migrated = true;
}

/** Convenience: generate a sortable-ish unique id usable as TEXT PK on both engines. */
export function newId(prefix = ""): string {
  const rnd = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  return prefix ? `${prefix}_${rnd}` : rnd;
}

export const nowIso = () => new Date().toISOString();
