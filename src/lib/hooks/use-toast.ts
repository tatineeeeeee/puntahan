"use client";

import { useCallback, useSyncExternalStore } from "react";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function getSnapshot(): Toast[] {
  return toasts;
}

const EMPTY_TOASTS: Toast[] = [];

function getServerSnapshot(): Toast[] {
  return EMPTY_TOASTS;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function addToast(message: string, type: "success" | "error" = "success") {
  const id = nextId++;
  toasts = [...toasts, { id, message, type }];
  notify();
  setTimeout(() => removeToast(id), 3000);
}

function removeToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function useToast() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const dismiss = useCallback((id: number) => removeToast(id), []);
  return { toasts: current, addToast, dismiss };
}
