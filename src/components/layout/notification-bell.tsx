"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const { isAuthenticated } = useConvexAuth();
  const count = useQuery(
    api.notifications.unreadCount,
    isAuthenticated ? {} : "skip",
  );
  const notifications = useQuery(
    api.notifications.listForUser,
    isAuthenticated ? {} : "skip",
  );
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-1.5 text-charcoal hover:bg-surface-hover transition-colors"
        aria-label="Notifications"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {(count ?? 0) > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-surface-highest shadow-lg border border-warm-gray/10 dark:border-warm-gray/20 z-50">
          <div className="flex items-center justify-between border-b border-warm-gray/10 px-4 py-2.5">
            <p className="text-sm font-bold text-charcoal">Notifications</p>
            {(count ?? 0) > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="text-xs text-teal hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {!notifications || notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-warm-gray">
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={cn(
                    "px-4 py-3 border-b border-warm-gray/5 last:border-0",
                    !n.isRead && "bg-sand/50",
                  )}
                >
                  <p className="text-sm text-charcoal">{n.message}</p>
                  <p className="mt-0.5 text-xs text-warm-gray">
                    {new Date(n.createdAt).toLocaleDateString("en-PH", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
