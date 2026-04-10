"use client";

import { useToast } from "@/lib/hooks/use-toast";

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2 sm:bottom-6"
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismiss(toast.id)}
          className={`rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-opacity ${
            toast.type === "success" ? "bg-teal" : "bg-coral"
          }`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
