"use client";

import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Logo } from "@/components/ui/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationBell } from "./notification-bell";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";
import { LocaleToggle } from "./locale-toggle";

function NavLinks() {
  const user = useQuery(api.users.getCurrentUser);

  return (
    <div className="hidden items-center gap-3 sm:flex">
      <Link
        href="/itineraries"
        className="text-sm font-medium text-charcoal hover:text-teal transition-colors"
      >
        Itineraries
      </Link>
      <Link
        href="/leaderboard"
        className="text-sm font-medium text-charcoal hover:text-teal transition-colors"
      >
        Leaderboard
      </Link>
      <Link
        href="/profile"
        className="text-sm font-medium text-charcoal hover:text-teal transition-colors"
      >
        Profile
      </Link>
      {user?.role === "admin" && (
        <Link
          href="/admin"
          className="text-sm font-medium text-sunset hover:text-sunset/80 transition-colors"
        >
          Admin
        </Link>
      )}
    </div>
  );
}

export function Header() {
  return (
    <header className="relative border-b border-warm-gray/10 bg-warm-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={28} />
          <span className="text-lg font-bold text-charcoal">puntahan</span>
        </Link>

        <div className="flex items-center gap-3">
          <LocaleToggle />
          <ThemeToggle />
          <AuthLoading>
            <Skeleton className="h-8 w-20 rounded-full" />
          </AuthLoading>
          <Unauthenticated>
            <SignInButton mode="modal">
              <button type="button" className="rounded-lg bg-coral px-4 py-1.5 text-sm font-medium text-white hover:bg-coral/90 transition-colors">
                Sign in
              </button>
            </SignInButton>
          </Unauthenticated>
          <Authenticated>
            <NavLinks />
            <NotificationBell />
            <UserButton />
            <MobileMenu />
          </Authenticated>
        </div>
      </div>
    </header>
  );
}
