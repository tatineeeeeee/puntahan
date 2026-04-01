"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "light";
  return (document.documentElement.dataset.theme as Theme) || "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  localStorage.setItem("theme", t);
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      applyTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      applyTheme("dark");
    }
  }, []);

  const setTheme = useCallback((t: Theme) => applyTheme(t), []);

  const toggle = useCallback(() => {
    const current = getThemeSnapshot();
    applyTheme(current === "light" ? "dark" : "light");
  }, []);

  const mounted = typeof window !== "undefined";

  return { theme, setTheme, toggle, mounted };
}
