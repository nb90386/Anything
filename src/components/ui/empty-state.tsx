import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-ink-200 bg-ink-25 px-6 py-14 text-center dark:border-ink-800 dark:bg-ink-900/40",
        className
      )}
    >
      {icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500">
          {icon}
        </div>
      ) : null}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">{title}</p>
        {description ? <p className="max-w-sm text-sm text-ink-500 dark:text-ink-400">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
