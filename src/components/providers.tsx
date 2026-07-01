"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { Role } from "@/lib/types";

// ── Theme ────────────────────────────────────────────────────────────────

type Theme = "light" | "dark";
interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}
const ThemeContext = createContext<ThemeCtx | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within Providers");
  return ctx;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = (localStorage.getItem("clm-theme") as Theme | null) ?? null;
    const preferred = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(preferred);
    document.documentElement.classList.toggle("dark", preferred === "dark");
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("clm-theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  };

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

// ── Active role (lightweight demo-only role switcher, not real auth) ─────

interface RoleCtx {
  role: Role;
  setRole: (r: Role) => void;
}
const RoleContext = createContext<RoleCtx | null>(null);

export const ROLE_LABELS: Record<Role, string> = {
  legal: "Legal",
  sales: "Sales",
  finance: "Finance",
  procurement: "Procurement",
  executive: "Executive",
};

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within Providers");
  return ctx;
}

function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("legal");

  useEffect(() => {
    const stored = localStorage.getItem("clm-role") as Role | null;
    if (stored) setRoleState(stored);
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    localStorage.setItem("clm-role", r);
  };

  const value = useMemo(() => ({ role, setRole }), [role]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <RoleProvider>{children}</RoleProvider>
    </ThemeProvider>
  );
}
