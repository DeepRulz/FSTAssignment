"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 rounded-md border p-1 opacity-50">
        <div className="h-7 w-7 rounded bg-muted animate-pulse" />
        <div className="h-7 w-7 rounded bg-muted animate-pulse" />
        <div className="h-7 w-7 rounded bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-md border p-1 bg-card">
      <button
        onClick={() => setTheme("light")}
        className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
          theme === "light"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted text-muted-foreground"
        }`}
        aria-label="Light theme"
      >
        <Sun className="h-3.5 w-3.5" />
        Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
          theme === "dark"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted text-muted-foreground"
        }`}
        aria-label="Dark theme"
      >
        <Moon className="h-3.5 w-3.5" />
        Dark
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
          theme === "system"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted text-muted-foreground"
        }`}
        aria-label="System theme"
      >
        <Laptop className="h-3.5 w-3.5" />
        System
      </button>
    </div>
  );
}
