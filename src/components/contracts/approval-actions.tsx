"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

export function ApprovalActions({ approvalId }: { approvalId: string }) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: "approved" | "rejected") {
    setPending(decision);
    setError(null);
    try {
      const res = await fetch(`/api/approvals/${approvalId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ decision, comment: comment.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to record decision");
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setPending(null);
    }
  }

  return (
    <div className="mt-3 space-y-2 rounded-lg border border-ink-100 bg-ink-25 p-3 dark:border-ink-800 dark:bg-ink-900/40">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional comment..."
        className="min-h-[60px] bg-white text-xs dark:bg-ink-900"
      />
      {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="primary"
          disabled={pending !== null}
          onClick={() => decide("approved")}
          className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
        >
          {pending === "approved" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          Approve
        </Button>
        <Button size="sm" variant="danger" disabled={pending !== null} onClick={() => decide("rejected")}>
          {pending === "rejected" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
          Reject
        </Button>
      </div>
    </div>
  );
}
