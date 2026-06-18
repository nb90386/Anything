/**
 * Resilient HTTP client for Polymarket PUBLIC / READ-ONLY endpoints.
 *
 * Features required by the Reliability Agent:
 *  - timeouts
 *  - exponential backoff with jitter
 *  - 429 / rate-limit aware retry
 *  - per-host health logging into api_health_checks
 *
 * SAFETY: only GET/POST to public read endpoints. No auth headers, no signing,
 * no order placement. Never sends private keys.
 */
import { getDb, ensureSchema, newId, nowIso } from "@/lib/db";

const UA = "PolyAlphaLab/1.0 (+research; paper-trading-only)";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function recordHealth(host: string, endpoint: string, ok: boolean, status: number | null, latency: number, error?: string) {
  try {
    await ensureSchema();
    const db = getDb();
    await db.run(
      `INSERT INTO api_health_checks (id, host, endpoint, ok, status_code, latency_ms, error, data_quality_score, created_at)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [newId("hc"), host, endpoint, ok ? 1 : 0, status, Math.round(latency), error ?? null, ok ? 1 : 0, nowIso()]
    );
  } catch {
    /* never let health logging break a fetch */
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface FetchOpts {
  method?: "GET" | "POST";
  body?: unknown;
  timeoutMs?: number;
  retries?: number;
  baseDelayMs?: number;
}

export async function fetchJson<T>(url: string, opts: FetchOpts = {}): Promise<T> {
  const { method = "GET", body, timeoutMs = 12_000, retries = 4, baseDelayMs = 600 } = opts;
  const host = new URL(url).host;
  const endpoint = new URL(url).pathname;
  let lastErr: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const started = Date.now();
    try {
      const res = await fetch(url, {
        method,
        signal: ctrl.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": UA,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
      });
      const latency = Date.now() - started;
      clearTimeout(timer);

      if (res.status === 429 || res.status >= 500) {
        const retryAfter = Number(res.headers.get("retry-after")) || 0;
        await recordHealth(host, endpoint, false, res.status, latency, `HTTP ${res.status}`);
        const delay = retryAfter > 0 ? retryAfter * 1000 : baseDelayMs * 2 ** attempt + Math.random() * 250;
        lastErr = new HttpError(res.status, `HTTP ${res.status} on ${url}`);
        if (attempt < retries) {
          await sleep(delay);
          continue;
        }
        throw lastErr;
      }
      if (!res.ok) {
        await recordHealth(host, endpoint, false, res.status, latency, `HTTP ${res.status}`);
        throw new HttpError(res.status, `HTTP ${res.status} on ${url}`);
      }
      const json = (await res.json()) as T;
      await recordHealth(host, endpoint, true, res.status, latency);
      return json;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      const latency = Date.now() - started;
      const isAbort = err instanceof Error && err.name === "AbortError";
      await recordHealth(host, endpoint, false, null, latency, isAbort ? "timeout" : String(err));
      if (attempt < retries) {
        await sleep(baseDelayMs * 2 ** attempt + Math.random() * 250);
        continue;
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(`fetch failed: ${url}`);
}
