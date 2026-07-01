import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";

export const runtime = "nodejs";

export async function POST() {
  try {
    const { count } = await seedDatabase();
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
