import { NextRequest, NextResponse } from "next/server";
import { startExperiment, pauseExperiment, resumeExperiment } from "@/lib/engine/experiment";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { action?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body */
  }
  const action = body.action;
  try {
    switch (action) {
      case "start": {
        const exp = await startExperiment();
        return NextResponse.json({ ok: true, status: exp.status, message: `Experiment ${exp.status.toLowerCase()}`, id: exp.id });
      }
      case "pause": {
        const exp = await pauseExperiment();
        return NextResponse.json({ ok: true, status: exp?.status ?? "NONE", message: "Paused" });
      }
      case "resume": {
        const exp = await resumeExperiment();
        return NextResponse.json({ ok: true, status: exp.status, message: "Resumed" });
      }
      default:
        return NextResponse.json({ ok: false, message: "unknown action" }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ ok: false, message: String(e) }, { status: 500 });
  }
}
