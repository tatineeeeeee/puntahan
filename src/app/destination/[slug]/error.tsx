"use client";

import { Button } from "@/components/ui/button";

export default function DestinationError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold text-charcoal">
        Couldn&apos;t load destination
      </h2>
      <p className="mt-2 text-sm text-warm-gray">
        Something went wrong loading this destination. Please try again.
      </p>
      <Button onClick={reset} className="mt-4">
        Try again
      </Button>
    </div>
  );
}
