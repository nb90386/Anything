"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ResetDemoDataCard() {
  const router = useRouter();
  const [resetting, setResetting] = useState(false);
  const [justReset, setJustReset] = useState(false);

  async function handleReset() {
    setResetting(true);
    setJustReset(false);
    try {
      await fetch("/api/demo/reset", { method: "POST" });
      setJustReset(true);
      router.refresh();
    } finally {
      setResetting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Demo data</CardTitle>
          <CardDescription>
            Reseeds the sample 25-contract portfolio. Any uploads, approval decisions, or chat history created
            during this session are wiped and replaced with the original seeded dataset.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={handleReset} disabled={resetting}>
          <RefreshCcw className={resetting ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          {resetting ? "Resetting..." : "Reset demo data"}
        </Button>
        {justReset && !resetting ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Portfolio reseeded
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}
