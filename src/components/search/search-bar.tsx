"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Search by keyword, e.g. "liability", "auto-renew", or a counterparty...`}
          className="h-11 pl-9 pr-9 text-[15px]"
          autoFocus
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              router.push("/search");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 dark:hover:text-ink-100"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <Button type="submit" size="lg">
        Search
      </Button>
    </form>
  );
}
