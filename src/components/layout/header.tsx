"use client";

import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Logo } from "@/components/ui/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationBell } from "./notification-bell";

export function Header() {
  return (
    <header className="border-b border-warm-gray/10 bg-warm-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={28} />
          <span className="text-lg font-bold text-charcoal">puntahan</span>
        </Link>

        <div className="flex items-center gap-3">
          <AuthLoading>
            <Skeleton className="h-8 w-20 rounded-full" />
          </AuthLoading>
          <Unauthenticated>
            <SignInButton mode="modal">
              <button className="rounded-lg bg-coral px-4 py-1.5 text-sm font-medium text-white hover:bg-coral/90 transition-colors">
                Sign in
              </button>
            </SignInButton>
          </Unauthenticated>
          <Authenticated>
            <Link
              href="/profile"
              className="text-sm font-medium text-charcoal hover:text-teal transition-colors"
            >
              Profile
            </Link>
            <NotificationBell />
            <UserButton />
          </Authenticated>
        </div>
      </div>
    </header>
  );
}
