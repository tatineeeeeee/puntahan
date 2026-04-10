"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "puntahan_onboarded";
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return !localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot(): boolean {
  return false;
}

export function useOnboarding() {
  const showOnboarding = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    notify();
  }, []);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    notify();
  }, []);

  return { showOnboarding, completeOnboarding, resetOnboarding };
}
