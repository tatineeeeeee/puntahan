"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AdvisoriesTab() {
  const destinations = useQuery(api.destinations.list, {});
  const setAdvisory = useMutation(api.admin.setAdvisory);
  const clearAdvisory = useMutation(api.admin.clearAdvisory);

  const [editingId, setEditingId] = useState<Id<"destinations"> | null>(null);
  const [level, setLevel] = useState<"info" | "warning" | "alert">("info");
  const [message, setMessage] = useState("");

  if (!destinations) return null;

  const withAdvisory = destinations.filter((d) => d.advisory);
  const withoutAdvisory = destinations.filter((d) => !d.advisory);

  async function handleSet() {
    if (!editingId || !message.trim()) return;
    await setAdvisory({ destinationId: editingId, level, message: message.trim() });
    setEditingId(null);
    setMessage("");
  }

  async function handleClear(id: Id<"destinations">) {
    await clearAdvisory({ destinationId: id });
  }

  return (
    <div className="space-y-6">
      {/* Active advisories */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal mb-3">
          Active Advisories ({withAdvisory.length})
        </h3>
        {withAdvisory.length === 0 ? (
          <p className="text-sm text-warm-gray">No active advisories.</p>
        ) : (
          <div className="space-y-2">
            {withAdvisory.map((d) => (
              <div key={d._id} className="flex items-center justify-between rounded-xl bg-sand p-3">
                <div>
                  <p className="text-sm font-medium text-charcoal">{d.name}</p>
                  <p className={cn(
                    "text-xs",
                    d.advisory?.level === "info" && "text-teal",
                    d.advisory?.level === "warning" && "text-sunset",
                    d.advisory?.level === "alert" && "text-coral",
                  )}>
                    [{d.advisory?.level}] {d.advisory?.message}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleClear(d._id)}>
                  Clear
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Set advisory */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal mb-3">
          Set Advisory
        </h3>
        {editingId ? (
          <div className="space-y-3 rounded-xl bg-sand p-4">
            <p className="text-sm font-medium text-charcoal">
              {destinations.find((d) => d._id === editingId)?.name}
            </p>
            <div className="flex gap-2">
              {(["info", "warning", "alert"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    level === l
                      ? l === "info" ? "bg-teal text-white"
                        : l === "warning" ? "bg-sunset text-white"
                        : "bg-coral text-white"
                      : "bg-warm-white text-charcoal",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Advisory message..."
            />
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleSet} disabled={!message.trim()}>
                Set Advisory
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {withoutAdvisory.slice(0, 20).map((d) => (
              <button
                key={d._id}
                type="button"
                onClick={() => setEditingId(d._id)}
                className="block w-full text-left rounded-lg bg-warm-white p-2 text-sm text-charcoal hover:bg-surface-hover transition-colors"
              >
                {d.name} — {d.province}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
