import { Skeleton } from "@/components/ui/skeleton";

export default function JournalsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
