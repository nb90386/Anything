/**
 * Autonomous tick endpoint for Vercel Cron (or any external scheduler).
 *
 * Configure in vercel.json to run on a schedule. Protected by CRON_SECRET via
 * the Authorization: Bearer header (Vercel Cron sends it automatically when the
 * secret is set as an env var). In dev / same-origin it is also allowed so the
 * dashboard "Run Tick Now" button works.
 */
import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { tick } from "@/lib/engine/experiment";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: NextRequest): boolean {
  const auth = req.headers.get("authorization") || "";
  const url = new URL(req.url);
  const qsSecret = url.searchParams.get("secret");
  if (auth === `Bearer ${config.cronSecret}`) return true;
  if (qsSecret && qsSecret === config.cronSecret) return true;
  // allow same-origin dashboard button
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && origin.includes(host)) return true;
  // allow when no secret configured (local dev default)
  if (config.cronSecret === "change-me-to-a-long-random-secret") return true;
  return false;
}

async function handle(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, status: "UNAUTHORIZED" }, { status: 401 });
  }
  const result = await tick();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

export const GET = handle;
export const POST = handle;
