"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const tabs = ["Dashboard", "Pending Tips", "Users"] as const;
type Tab = (typeof tabs)[number];

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Dashboard");
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

      <div className="flex gap-1 border-b border-warm-gray/10 mb-6" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
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

      {activeTab === "Dashboard" && <DashboardTab />}
      {activeTab === "Pending Tips" && <PendingTipsTab />}
      {activeTab === "Users" && <UsersTab />}
    </div>
  );
}

function DashboardTab() {
  const stats = useQuery(api.admin.dashboardStats);

  if (stats === undefined) {
    return <Skeleton className="h-32 w-full rounded-xl" />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[
        { label: "Users", value: stats.totalUsers },
        { label: "Destinations", value: stats.totalDestinations },
        { label: "Tips", value: stats.totalTips },
        { label: "Pending", value: stats.pendingTips },
      ].map((s) => (
        <div key={s.label} className="rounded-xl bg-sand p-4 text-center">
          <p className="text-2xl font-bold text-charcoal">{s.value}</p>
          <p className="text-xs text-warm-gray">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function PendingTipsTab() {
  const tips = useQuery(api.admin.pendingTips);
  const approve = useMutation(api.admin.approveTip);
  const reject = useMutation(api.admin.rejectTip);

  if (tips === undefined) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (tips.length === 0) {
    return <p className="text-sm text-warm-gray">No pending tips.</p>;
  }

  return (
    <div className="space-y-3">
      {tips.map((tip) => (
        <div key={tip._id} className="rounded-xl bg-sand p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal">
                {tip.userName} on {tip.destinationName}
              </p>
              <p className="text-xs text-warm-gray">
                Rating: {tip.rating}/5 · Budget: ₱{tip.totalBudget.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => approve({ tipId: tip._id })}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => reject({ tipId: tip._id })}
              >
                Reject
              </Button>
            </div>
          </div>
          <p className="text-sm text-charcoal/80">{tip.content}</p>
        </div>
      ))}
    </div>
  );
}

function UsersTab() {
  const users = useQuery(api.admin.allUsers);
  const updateRole = useMutation(api.admin.updateUserRole);

  if (users === undefined) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between rounded-xl bg-sand p-3"
        >
          <div>
            <p className="text-sm font-medium text-charcoal">
              {user.name ?? "No name"}
            </p>
            <p className="text-xs text-warm-gray">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={user.role === "admin" ? "budget" : "default"}>
              {user.role}
            </Badge>
            <select
              value={user.role}
              onChange={(e) =>
                updateRole({ userId: user._id, role: e.target.value })
              }
              className="rounded-lg border border-warm-gray/20 px-2 py-1 text-xs"
              aria-label={`Role for ${user.name ?? user.email}`}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
