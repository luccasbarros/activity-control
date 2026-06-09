"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { UI_COPY } from "@/lib/copy";
import { THEME_STORAGE_KEY } from "@/lib/constants";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (stored === "dark" || stored === "light") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }

  const Icon = theme === "light" ? Moon : Sun;

  return (
    <button
      aria-label={
        theme === "light"
          ? UI_COPY.theme.switchToDark
          : UI_COPY.theme.switchToLight
      }
      className="icon-button"
      onClick={toggleTheme}
      type="button"
    >
      <Icon aria-hidden="true" size={18} />
    </button>
  );
}
