import { Skeleton } from "@/components/ui/skeleton";

export default function DestinationLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-5 w-1/3" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  );
}
