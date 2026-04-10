"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/hooks/use-locale";
import { t } from "@/lib/i18n";

const navItems = [
  { href: "/", labelKey: "nav.browse", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/itineraries", labelKey: "nav.trips", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/leaderboard", labelKey: "nav.top", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  { href: "/profile", labelKey: "nav.profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { locale } = useLocale();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-warm-gray/10 bg-warm-white sm:hidden">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors",
                isActive ? "text-coral" : "text-warm-gray",
              )}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {t(item.labelKey, locale)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
