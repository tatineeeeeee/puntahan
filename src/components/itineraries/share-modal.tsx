"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareModalProps {
  itineraryId: Id<"itineraries">;
  onClose: () => void;
}

export function ShareModal({ itineraryId, onClose }: ShareModalProps) {
  const generateShareLink = useMutation(api.itineraries.generateShareLink);
  const addCollaborator = useMutation(api.itineraries.addCollaborator);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState("view");
  const [copied, setCopied] = useState(false);

  async function handleGenerateLink() {
    const token = await generateShareLink({ id: itineraryId });
    setShareUrl(`${window.location.origin}/itinerary/${token}`);
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
    } catch {
      // User not found or already shared
    }
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
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-charcoal">Share Itinerary</h3>

        {/* Share link */}
        <div>
          <p className="text-sm font-medium text-charcoal mb-2">Share Link</p>
          {shareUrl ? (
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 rounded-lg border border-warm-gray/20 bg-sand px-3 py-2 text-xs text-charcoal"
              />
              <Button size="sm" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={handleGenerateLink}>
              Generate Link
            </Button>
          )}
        </div>

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
              onChange={(e) => setAccessLevel(e.target.value)}
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
