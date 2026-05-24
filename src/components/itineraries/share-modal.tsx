"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareModalProps {
  itineraryId: Id<"itineraries">;
  onClose: () => void;
}

export function ShareModal({ itineraryId, onClose }: ShareModalProps) {
  const data = useQuery(api.itineraries.getById, { id: itineraryId });
  const generateShareLink = useMutation(api.itineraries.generateShareLink);
  const revokeShareLink = useMutation(api.itineraries.revokeShareLink);
  const rotateShareLink = useMutation(api.itineraries.rotateShareLink);
  const addCollaborator = useMutation(api.itineraries.addCollaborator);
  const removeCollaborator = useMutation(api.itineraries.removeCollaborator);
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState<"view" | "edit">("view");
  const [copied, setCopied] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  const shareUrl = data?.shareToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/itinerary/${data.shareToken}`
    : null;
  const collaborators = data?.collaborators ?? [];

  async function handleGenerateLink() {
    await generateShareLink({ id: itineraryId });
  }

  async function handleRevoke() {
    await revokeShareLink({ id: itineraryId });
  }

  async function handleRotate() {
    await rotateShareLink({ id: itineraryId });
    setCopied(false);
  }

  async function handleAddCollaborator(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await addCollaborator({
        id: itineraryId,
        email: email.trim(),
        accessLevel,
      });
      setEmail("");
      setEmailStatus("If that email matches a puntahan user, they've been added.");
    } catch {
      setEmailStatus("If that email matches a puntahan user, they've been added.");
    }
  }

  async function handleRemoveCollaborator(userId: Id<"users">) {
    await removeCollaborator({ id: itineraryId, userId });
  }

  function handleCopy() {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        className="w-full max-w-md rounded-xl bg-warm-white p-6 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="share-modal-title" className="text-lg font-bold text-charcoal">Share Itinerary</h3>

        {/* Share link */}
        <div>
          <p className="text-sm font-medium text-charcoal mb-2">Share Link</p>
          {shareUrl ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  aria-label="Share link URL"
                  className="flex-1 rounded-lg border border-warm-gray/20 bg-sand px-3 py-2 text-xs text-charcoal"
                />
                <Button size="sm" onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleRotate}>
                  Rotate (invalidates old link)
                </Button>
                <Button variant="ghost" size="sm" onClick={handleRevoke}>
                  Revoke
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={handleGenerateLink}>
              Generate Link
            </Button>
          )}
        </div>

        {/* Collaborators */}
        {collaborators.length > 0 && (
          <div>
            <p className="text-sm font-medium text-charcoal mb-2">Collaborators</p>
            <ul className="space-y-1">
              {collaborators.map((c) => (
                <li
                  key={c.userId}
                  className="flex items-center justify-between rounded-lg bg-sand p-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-charcoal">{c.name}</p>
                    <p className="text-xs text-warm-gray">
                      {c.accessLevel === "edit" ? "Can edit" : "View only"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCollaborator(c.userId)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Add collaborator */}
        <form onSubmit={handleAddCollaborator} className="space-y-2">
          <p className="text-sm font-medium text-charcoal">Add Collaborator</p>
          <div className="flex gap-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              type="email"
              className="flex-1"
            />
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value as "view" | "edit")}
              className="rounded-lg border border-warm-gray/20 px-2 text-sm"
              aria-label="Access level"
            >
              <option value="view">View</option>
              <option value="edit">Edit</option>
            </select>
          </div>
          <Button type="submit" size="sm" disabled={!email.trim()}>
            Add
          </Button>
          {emailStatus && (
            <p className="text-xs text-warm-gray">{emailStatus}</p>
          )}
        </form>

        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
