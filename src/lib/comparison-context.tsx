"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { Id } from "../../convex/_generated/dataModel";

interface ComparisonContextType {
  selected: Id<"destinations">[];
  add: (id: Id<"destinations">) => void;
  remove: (id: Id<"destinations">) => void;
  clear: () => void;
  isSelected: (id: Id<"destinations">) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | null>(null);

const MAX_COMPARE = 3;

function readFromStorage(): Id<"destinations">[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem("compare");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Id<"destinations">[]>(readFromStorage);

  useEffect(() => {
    sessionStorage.setItem("compare", JSON.stringify(selected));
  }, [selected]);

  const add = useCallback((id: Id<"destinations">) => {
    setSelected((prev) => {
      if (prev.length >= MAX_COMPARE || prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const remove = useCallback((id: Id<"destinations">) => {
    setSelected((prev) => prev.filter((s) => s !== id));
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const isSelected = useCallback(
    (id: Id<"destinations">) => selected.includes(id),
    [selected],
  );

  return (
    <ComparisonContext.Provider value={{ selected, add, remove, clear, isSelected }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const ctx = useContext(ComparisonContext);
  if (!ctx) throw new Error("useComparison must be used within ComparisonProvider");
  return ctx;
}
