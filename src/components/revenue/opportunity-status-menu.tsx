"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, CircleSlash, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { LeakageStatus } from "@/lib/types";

export function OpportunityStatusMenu({ id, status }: { id: string; status: LeakageStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function setStatus(next: LeakageStatus) {
    setError(null);
    try {
      const res = await fetch(`/api/leakage/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("Update failed");
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Could not update status. Try again.");
    }
  }

  if (status !== "open") {
    return (
      <span className="text-xs text-ink-400 dark:text-ink-500">
        {status === "recovered" ? "Marked recovered" : "Dismissed"}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={pending}>
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Mark
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setStatus("recovered")}>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Recovered
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setStatus("dismissed")}>
            <CircleSlash className="h-4 w-4 text-ink-400" />
            Dismiss
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  );
}
