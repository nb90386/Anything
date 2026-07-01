"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const RiskConstellationScene = dynamic(
  () => import("./risk-constellation-scene").then((m) => m.RiskConstellationScene),
  { ssr: false, loading: () => null }
);

function StaticFallback() {
  return (
    <div
      className="h-full w-full rounded-full opacity-70"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, rgba(167,139,250,0.55), rgba(109,40,217,0.25) 45%, transparent 70%)",
      }}
      aria-hidden="true"
    />
  );
}

/**
 * The one tasteful 3D moment in this app: a slowly rotating node network
 * representing a contract portfolio orbiting a central intelligence core.
 * Lazy-loaded (three.js only ships to the browser that actually renders it)
 * and fully skipped in favor of a static gradient when the visitor has
 * requested reduced motion, or before the component has mounted client-side.
 */
export function RiskConstellation({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className={className} aria-hidden="true">
      {mounted && !reducedMotion ? <RiskConstellationScene /> : <StaticFallback />}
    </div>
  );
}
