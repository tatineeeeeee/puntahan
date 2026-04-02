"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function JournalEditor() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const createJournal = useMutation(api.journals.create);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-lg font-medium text-charcoal">
          Sign in to write a journal.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      await createJournal({
        title: title.trim(),
        content: content.trim(),
        destinationIds: [],
        isPublic,
      });
      router.push("/journals");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-charcoal mb-6">Write a Journal</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="journal-title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My trip to..."
        />

        <Textarea
          id="journal-content"
          label="Your Story"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your travel experience..."
          rows={12}
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border-warm-gray/30 text-teal focus:ring-teal"
          />
          <span className="text-sm text-charcoal">Make this journal public</span>
        </label>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting || !title.trim() || !content.trim()}>
            {submitting ? "Publishing..." : "Publish Journal"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
