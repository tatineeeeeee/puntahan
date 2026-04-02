"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold text-charcoal">Something went wrong</h2>
      <p className="mt-2 text-sm text-warm-gray">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset} className="mt-4">
        Try again
      </Button>
    </div>
  );
}
