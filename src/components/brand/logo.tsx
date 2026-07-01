// Self-drawn placeholder mark. This is an ORIGINAL geometric design, not
// Malbek's real logo. If official brand assets are available (see
// /assets/brand/README.md for where to place them and how to wire them in),
// swap <PlaceholderMark /> below for an <svg> or <Image> pointing at the real
// asset. Nothing here is fetched from the network.

import { cn } from "@/lib/utils";

function PlaceholderMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#logo-gradient)" />
      {/* three connected nodes: legal, sales/finance, procurement converging on one intelligence layer */}
      <circle cx="10" cy="10" r="2.4" fill="white" fillOpacity="0.95" />
      <circle cx="22" cy="10" r="2.4" fill="white" fillOpacity="0.95" />
      <circle cx="16" cy="22" r="2.9" fill="white" />
      <path d="M11.6 11.4L14.6 20.1M20.4 11.4L17.4 20.1M12.4 10H19.6" stroke="white" strokeOpacity="0.85" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function BrandMark({ className, size = 32 }: { className?: string; size?: number }) {
  return <PlaceholderMark className={cn(className)} style={{ width: size, height: size }} />;
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-semibold tracking-tight text-ink-900 dark:text-white", className)}>
      Malbek <span className="font-normal text-ink-500 dark:text-ink-400">Revenue Intelligence</span>
    </span>
  );
}
