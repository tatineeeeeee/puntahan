"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n";

const STORAGE_KEY = "puntahan_locale";
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Locale {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem(STORAGE_KEY) as Locale) || "en";
}

function getServerSnapshot(): Locale {
  return "en";
}

export function useLocale() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = useCallback((l: Locale) => {
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l === "fil" ? "fil" : "en";
    notify();
  }, []);

  const toggle = useCallback(() => {
    const current = getSnapshot();
    setLocale(current === "en" ? "fil" : "en");
  }, [setLocale]);

  return { locale, setLocale, toggle };
}
