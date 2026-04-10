"use client";

import { useLocale } from "@/lib/hooks/use-locale";

export function LocaleToggle() {
  const { locale, toggle } = useLocale();

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-lg border border-warm-gray/20 px-2 py-1 text-xs font-bold text-warm-gray hover:text-charcoal transition-colors"
      aria-label={`Switch to ${locale === "en" ? "Filipino" : "English"}`}
    >
      {locale === "en" ? "FIL" : "EN"}
    </button>
  );
}
