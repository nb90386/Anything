"use client";

import { useMemo, useState } from "react";
import { diffWords } from "diff";
import type { ContractVersion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

export function VersionDiffView({ versions }: { versions: ContractVersion[] }) {
  const sorted = useMemo(() => [...versions].sort((a, b) => a.versionNumber - b.versionNumber), [versions]);

  const [fromId, setFromId] = useState(sorted[sorted.length - 2].id);
  const [toId, setToId] = useState(sorted[sorted.length - 1].id);

  const fromVersion = sorted.find((v) => v.id === fromId) ?? sorted[sorted.length - 2];
  const toVersion = sorted.find((v) => v.id === toId) ?? sorted[sorted.length - 1];

  const parts = useMemo(
    () => diffWords(fromVersion.content, toVersion.content),
    [fromVersion.content, toVersion.content]
  );

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-500">
                Comparing from
              </label>
              <Select value={fromId} onChange={(e) => setFromId(e.target.value)}>
                {sorted.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} &middot; {formatDate(v.createdAt)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-500">
                Comparing to
              </label>
              <Select value={toId} onChange={(e) => setToId(e.target.value)}>
                {sorted.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} &middot; {formatDate(v.createdAt)}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {toVersion.changeSummary ? (
        <Card>
          <CardHeader>
            <CardTitle>Change summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            {toVersion.changeSummary}
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-ink-100 bg-ink-25 px-4 py-2.5 text-xs font-medium text-ink-500 dark:border-ink-800 dark:bg-ink-900/40 dark:text-ink-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm diff-add" />
          Added in {toVersion.label}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm diff-remove" />
          Removed from {fromVersion.label}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {fromVersion.label} &rarr; {toVersion.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="prose-contract max-h-[70vh] overflow-y-auto rounded-lg border border-ink-100 bg-white p-5 text-sm text-ink-800 dark:border-ink-800 dark:bg-ink-950 dark:text-ink-100">
            {parts.map((part, i) => {
              if (part.added) {
                return (
                  <span key={i} className="diff-add">
                    {part.value}
                  </span>
                );
              }
              if (part.removed) {
                return (
                  <span key={i} className="diff-remove">
                    {part.value}
                  </span>
                );
              }
              return <span key={i}>{part.value}</span>;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
