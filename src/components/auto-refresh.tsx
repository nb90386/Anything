"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresh({ seconds = 15 }: { seconds?: number }) {
  const router = useRouter();
  const [on, setOn] = useState(true);
  const [last, setLast] = useState<number>(Date.now());
  useEffect(() => {
    if (!on) return;
    const t = setInterval(() => {
      router.refresh();
      setLast(Date.now());
    }, seconds * 1000);
    return () => clearInterval(t);
  }, [on, seconds, router]);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60 hover:text-white"
      title="Toggle live auto-refresh"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-neon-green animate-pulseDot" : "bg-white/30"}`} />
      {on ? "Live" : "Paused"}
    </button>
  );
}
