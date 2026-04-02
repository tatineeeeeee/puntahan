"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs";
import { DashboardTab } from "./dashboard-tab";
import { PendingTipsTab } from "./pending-tips-tab";
import { UsersTab } from "./users-tab";

const tabs = ["Dashboard", "Pending Tips", "Users"] as const;

export function AdminPage() {
  const currentUser = useQuery(api.users.getCurrentUser);

  if (currentUser === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-lg font-medium text-charcoal">Access Denied</p>
        <p className="mt-1 text-sm text-warm-gray">
          You need admin privileges to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-charcoal mb-6">Admin Panel</h1>

      <Tabs tabs={tabs} defaultTab="Dashboard">
        {(activeTab) => (
          <>
            {activeTab === "Dashboard" && <DashboardTab />}
            {activeTab === "Pending Tips" && <PendingTipsTab />}
            {activeTab === "Users" && <UsersTab />}
          </>
        )}
      </Tabs>
    </div>
  );
}
