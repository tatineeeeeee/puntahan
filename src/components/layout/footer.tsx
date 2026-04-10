"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/festivals", label: "Festivals" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/journals", label: "Journals" },
];

const accountLinks = [
  { href: "/profile", label: "Profile" },
  { href: "/itineraries", label: "Itineraries" },
];

export function Footer() {
  const router = useRouter();

  function handleReplayTour() {
    localStorage.removeItem("puntahan_onboarded");
    router.push("/");
    // The OnboardingTrigger on the home page will detect missing flag
  }

  return (
    <footer className="border-t border-warm-gray/10 bg-warm-white mt-12">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Explore */}
          <nav aria-label="Explore links">
            <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal">
              Explore
            </h3>
            <ul className="mt-3 space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-gray hover:text-teal transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Account */}
          <nav aria-label="Account links">
            <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal">
              Account
            </h3>
            <ul className="mt-3 space-y-2">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-gray hover:text-teal transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* About */}
          <nav aria-label="About links">
            <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal">
              About
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-warm-gray hover:text-teal transition-colors"
                >
                  About puntahan
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleReplayTour}
                  className="text-sm text-warm-gray hover:text-teal transition-colors"
                >
                  Replay Tour
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-warm-gray/10 pt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-5 w-5 text-coral" />
            <span className="text-sm font-medium text-charcoal">puntahan</span>
          </div>
          <p className="text-xs text-warm-gray">
            Built by Justine
          </p>
        </div>
      </div>
    </footer>
  );
}
