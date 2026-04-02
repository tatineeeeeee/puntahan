"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function UsersTab() {
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
              onChange={(e) => {
                const value = e.target.value;
                if (value === "user" || value === "admin") {
                  updateRole({ userId: user._id, role: value });
                }
              }}
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
