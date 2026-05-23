"use client";

import { useRef, useState, useEffect } from "react";
import { useTheme } from "@/lib/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect -- hydration guard
  }, []);

  function handleToggle() {
    const button = buttonRef.current;

    // Store the button centre as the ripple origin for the CSS keyframe
    if (button) {
      const { top, left, width, height } = button.getBoundingClientRect();
      document.documentElement.style.setProperty("--vt-x", `${Math.round(left + width / 2)}px`);
      document.documentElement.style.setProperty("--vt-y", `${Math.round(top + height / 2)}px`);
    }

    // View Transitions API — circle ripple from button; plain toggle fallback
    if (document.startViewTransition) {
      document.startViewTransition(() => { toggle(); });
    } else {
      toggle();
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      className="rounded-full p-1.5 text-charcoal hover:bg-surface-hover transition-colors"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      suppressHydrationWarning
    >
      <span className="block h-5 w-5" suppressHydrationWarning>
        {mounted ? (
          theme === "light" ? (
            /* Moon — switch to dark */
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            /* Sun — switch to light */
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )
        ) : (
          <span className="h-5 w-5" />
        )}
      </span>
    </button>
  );
}
