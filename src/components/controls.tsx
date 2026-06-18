"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Action = "start" | "pause" | "resume" | "tick";

export function ExperimentControls({ status }: { status: string | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<Action | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function run(action: Action) {
    setBusy(action);
    setMsg(null);
    try {
      const url = action === "tick" ? "/api/cron/tick" : "/api/control";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: action === "tick" ? undefined : JSON.stringify({ action }),
      });
      const json = await res.json();
      setMsg(json.message || json.status || (res.ok ? "done" : "error"));
      startTransition(() => router.refresh());
    } catch (e) {
      setMsg(String(e));
    } finally {
      setBusy(null);
    }
  }

  const Btn = ({ action, label, color }: { action: Action; label: string; color: string }) => (
    <button
      onClick={() => run(action)}
      disabled={busy !== null || pending}
      className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${color}`}
    >
      {busy === action ? "…" : label}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(!status || status === "COMPLETED") && (
        <Btn action="start" label="▶ Start 7-Day Experiment" color="border-neon-green/40 text-neon-green hover:bg-neon-green/10" />
      )}
      {status === "RUNNING" && <Btn action="pause" label="⏸ Pause" color="border-neon-amber/40 text-neon-amber hover:bg-neon-amber/10" />}
      {status === "PAUSED" && <Btn action="resume" label="▶ Resume" color="border-neon-green/40 text-neon-green hover:bg-neon-green/10" />}
      <Btn action="tick" label="↻ Run Tick Now" color="border-white/15 text-white/70 hover:bg-white/5" />
      {msg && <span className="text-xs text-white/40">{msg}</span>}
    </div>
  );
}
