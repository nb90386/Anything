"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsContext {
  value: string;
  setValue: (v: string) => void;
}
const Ctx = createContext<TabsContext | null>(null);

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  children: ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const value = controlledValue ?? internal;
  const setValue = (v: string) => {
    setInternal(v);
    onValueChange?.(v);
  };
  return (
    <Ctx.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </Ctx.Provider>
  );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-ink-100/70 p-1 dark:bg-ink-800/60",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs");
  const active = ctx.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx.setValue(value)}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-white text-ink-900 shadow-card dark:bg-ink-950 dark:text-white"
          : "text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("TabsContent must be used within Tabs");
  if (ctx.value !== value) return null;
  return <div className={cn("animate-fade-in", className)}>{children}</div>;
}
