"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  }

  const Icon = dark ? Sun : Moon;

  return (
    <button
      onClick={toggleTheme}
      className={
        compact
          ? "flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card/85 text-muted-foreground shadow-sm backdrop-blur-xl transition-colors hover:bg-muted"
          : "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-muted"
      }
      aria-label={dark ? "라이트 모드" : "다크 모드"}
    >
      <Icon className="h-5 w-5" aria-hidden />
      {compact ? null : <span>{dark ? "라이트" : "다크"}</span>}
    </button>
  );
}
