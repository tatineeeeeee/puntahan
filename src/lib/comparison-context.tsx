"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { Id } from "../../convex/_generated/dataModel";

export interface DestinationRef {
  id: Id<"destinations">;
  name: string;
}

interface ComparisonContextType {
  selected: DestinationRef[];
  selectedIds: Id<"destinations">[];
  add: (id: Id<"destinations">, name: string) => void;
  remove: (id: Id<"destinations">) => void;
  clear: () => void;
  isSelected: (id: Id<"destinations">) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | null>(null);

const MAX_COMPARE = 3;
const STORAGE_KEY = "compare_v2";

function readFromStorage(): DestinationRef[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as DestinationRef[]) : [];
  } catch {
    return [];
  }
}

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<DestinationRef[]>(readFromStorage);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  }, [selected]);

  const add = useCallback((id: Id<"destinations">, name: string) => {
    setSelected((prev) => {
      if (prev.length >= MAX_COMPARE || prev.some((s) => s.id === id)) return prev;
      return [...prev, { id, name }];
    });
  }, []);

  const remove = useCallback((id: Id<"destinations">) => {
    setSelected((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const isSelected = useCallback(
    (id: Id<"destinations">) => selected.some((s) => s.id === id),
    [selected],
  );

  const selectedIds = selected.map((s) => s.id);

  return (
    <ComparisonContext.Provider value={{ selected, selectedIds, add, remove, clear, isSelected }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const ctx = useContext(ComparisonContext);
  if (!ctx) throw new Error("useComparison must be used within ComparisonProvider");
  return ctx;
}
