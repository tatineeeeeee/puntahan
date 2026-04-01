"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTemplateForCategories } from "@/lib/checklist-templates";

interface ChecklistPanelProps {
  itineraryId: Id<"itineraries">;
  categories: string[];
}

export function ChecklistPanel({ itineraryId, categories }: ChecklistPanelProps) {
  const { isAuthenticated } = useConvexAuth();
  const checklist = useQuery(
    api.checklists.getByItinerary,
    isAuthenticated ? { itineraryId } : "skip",
  );
  const createChecklist = useMutation(api.checklists.create);
  const updateItems = useMutation(api.checklists.updateItems);
  const [newItem, setNewItem] = useState("");

  if (!isAuthenticated) return null;

  if (checklist === undefined) return null;

  if (checklist === null) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={async () => {
          const templateItems = getTemplateForCategories(categories);
          await createChecklist({
            name: "Packing List",
            items: templateItems.map((text) => ({ text, isChecked: false })),
            itineraryId,
          });
        }}
      >
        Generate Packing List
      </Button>
    );
  }

  const checkedCount = checklist.items.filter((i) => i.isChecked).length;
  const progress =
    checklist.items.length > 0 ? (checkedCount / checklist.items.length) * 100 : 0;

  async function handleToggle(index: number) {
    if (!checklist) return;
    const newItems = [...checklist.items];
    newItems[index] = { ...newItems[index], isChecked: !newItems[index].isChecked };
    await updateItems({ id: checklist._id, items: newItems });
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.trim() || !checklist) return;
    await updateItems({
      id: checklist._id,
      items: [...checklist.items, { text: newItem.trim(), isChecked: false }],
    });
    setNewItem("");
  }

  async function handleRemoveItem(index: number) {
    if (!checklist) return;
    const newItems = checklist.items.filter((_, i) => i !== index);
    await updateItems({ id: checklist._id, items: newItems });
  }

  return (
    <div className="rounded-xl bg-sand p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-charcoal">Packing List</h3>
        <span className="text-xs text-warm-gray">
          {checkedCount}/{checklist.items.length} packed
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-warm-gray/20">
        <div
          className="h-2 rounded-full bg-teal transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Items */}
      <div className="space-y-1">
        {checklist.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={item.isChecked}
              onChange={() => handleToggle(i)}
              className="h-4 w-4 rounded border-warm-gray/30 text-teal focus:ring-teal"
            />
            <span
              className={`flex-1 text-sm ${item.isChecked ? "line-through text-warm-gray" : "text-charcoal"}`}
            >
              {item.text}
            </span>
            <button
              type="button"
              onClick={() => handleRemoveItem(i)}
              className="text-xs text-warm-gray hover:text-coral"
              aria-label={`Remove ${item.text}`}
            >
              x
            </button>
          </div>
        ))}
      </div>

      {/* Add item */}
      <form onSubmit={handleAddItem} className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add custom item..."
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={!newItem.trim()}>
          Add
        </Button>
      </form>
    </div>
  );
}
