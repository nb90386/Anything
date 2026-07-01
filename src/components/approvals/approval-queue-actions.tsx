"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ApprovalQueueActions({ approvalId }: { approvalId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: "approved" | "rejected") {
    setError(null);
    let comment: string | undefined;
    if (decision === "rejected") {
      const input = typeof window !== "undefined" ? window.prompt("Optional: add a reason for rejecting") : null;
      comment = input?.trim() || undefined;
    }
    setPending(decision);
    try {
      const res = await fetch(`/api/approvals/${approvalId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, comment }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        setError(data.error ?? "Could not record decision.");
        setPending(null);
        return;
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message || "Unexpected error.");
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
          disabled={pending !== null}
          onClick={() => decide("rejected")}
        >
          {pending === "rejected" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
          Reject
        </Button>
        <Button type="button" size="sm" disabled={pending !== null} onClick={() => decide("approved")}>
          {pending === "approved" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          Approve
        </Button>
      </div>
      {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  );
}
