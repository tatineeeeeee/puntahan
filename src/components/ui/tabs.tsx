"use client";

import { useState, useRef, useCallback, useId } from "react";
import { cn } from "@/lib/utils";

interface TabsProps<T extends string> {
  tabs: readonly T[];
  defaultTab?: T;
  onTabChange?: (tab: T) => void;
  children: (activeTab: T) => React.ReactNode;
  className?: string;
}

export function Tabs<T extends string>({
  tabs,
  defaultTab,
  onTabChange,
  children,
  className,
}: TabsProps<T>) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab ?? tabs[0]);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  const handleTabChange = useCallback(
    (tab: T) => {
      setActiveTab(tab);
      onTabChange?.(tab);
    },
    [onTabChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex: number | null = null;

      if (e.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        tabsRef.current[nextIndex]?.focus();
        handleTabChange(tabs[nextIndex]);
      }
    },
    [tabs, handleTabChange],
  );

  return (
    <div className={className}>
      <div
        className="flex gap-1 border-b border-warm-gray/10"
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab}
            ref={(el) => { tabsRef.current[index] = el; }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-selected={activeTab === tab}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => handleTabChange(tab)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab
                ? "border-b-2 border-coral text-coral"
                : "text-warm-gray hover:text-charcoal",
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel-${tabs.indexOf(activeTab)}`}
        aria-labelledby={`${id}-tab-${tabs.indexOf(activeTab)}`}
        className="mt-6"
      >
        {children(activeTab)}
      </div>
    </div>
  );
}
