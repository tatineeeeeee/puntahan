"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Rating } from "@/components/ui/rating";

interface TipFormProps {
  destinationId: Id<"destinations">;
}

const defaultCategories = ["Food", "Transport", "Accommodation", "Activities"];

export function TipForm({ destinationId }: TipFormProps) {
  const { isAuthenticated } = useConvexAuth();
  const createTip = useMutation(api.tips.create);

  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [budgetRows, setBudgetRows] = useState(
    defaultCategories.map((cat) => ({ category: cat, amount: 0 })),
  );
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-warm-gray">
        Sign in to share your travel tips.
      </p>
    );
  }

  if (!showForm) {
    return (
      <Button variant="primary" onClick={() => setShowForm(true)}>
        Share a Tip
      </Button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || rating === 0) return;

    setSubmitting(true);
    try {
      const breakdown = budgetRows.filter((r) => r.amount > 0);
      await createTip({
        destinationId,
        content: content.trim(),
        rating,
        budgetBreakdown: breakdown,
      });
      setContent("");
      setRating(0);
      setBudgetRows(
        defaultCategories.map((cat) => ({ category: cat, amount: 0 })),
      );
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-sand p-4 space-y-4">
      <h3 className="font-bold text-charcoal">Share Your Tip</h3>

      {/* Rating */}
      <div>
        <p className="mb-1 text-sm font-medium text-charcoal">Your Rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              className="focus:outline-none"
            >
              <Rating value={star <= rating ? 1 : 0} max={1} size="md" />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <Textarea
        id="tip-content"
        label="Your Tip"
        placeholder="Share your experience, advice, or recommendations..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
      />

      {/* Budget */}
      <div>
        <p className="mb-2 text-sm font-medium text-charcoal">
          Budget Breakdown (optional)
        </p>
        <div className="space-y-2">
          {budgetRows.map((row, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={row.category}
                onChange={(e) => {
                  const next = [...budgetRows];
                  next[i] = { ...next[i], category: e.target.value };
                  setBudgetRows(next);
                }}
                className="flex-1"
                placeholder="Category"
              />
              <Input
                type="number"
                value={row.amount || ""}
                onChange={(e) => {
                  const next = [...budgetRows];
                  next[i] = {
                    ...next[i],
                    amount: parseInt(e.target.value) || 0,
                  };
                  setBudgetRows(next);
                }}
                className="w-28"
                placeholder="₱ Amount"
                min={0}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting || !content.trim() || rating === 0}>
          {submitting ? "Submitting..." : "Submit Tip"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
