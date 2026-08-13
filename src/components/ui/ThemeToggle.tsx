"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";

const STORAGE_KEY = "taskboard-theme";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  };

  // Avoid rendering a mismatched icon before we know the real theme (hydration-safe)
  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden />;
  }

  return (
    <Button
      variant="ghost"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="px-2.5"
    >
      {isDark ? "☀️" : "🌙"}
    </Button>
  );
}
