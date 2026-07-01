import { cn, initials } from "@/lib/utils";

const PALETTE = [
  "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
];

function hashColor(name: string): string {
  const idx = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % PALETTE.length;
  return PALETTE[idx];
}

export function Avatar({ name, className, size = "md" }: { name: string; className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "h-6 w-6 text-[10px]", md: "h-8 w-8 text-xs", lg: "h-11 w-11 text-sm" }[size];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        sizeClasses,
        hashColor(name),
        className
      )}
      title={name}
    >
      {initials(name)}
    </div>
  );
}
