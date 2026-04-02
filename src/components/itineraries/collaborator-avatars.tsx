import Image from "next/image";
import { cn } from "@/lib/utils";

interface Collaborator {
  userId: string;
  accessLevel: string;
  name: string;
  imageUrl: string | null;
}

interface CollaboratorAvatarsProps {
  collaborators: Collaborator[];
  className?: string;
}

export function CollaboratorAvatars({
  collaborators,
  className,
}: CollaboratorAvatarsProps) {
  if (collaborators.length === 0) return null;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {collaborators.slice(0, 5).map((c) => (
        <div
          key={c.userId}
          title={`${c.name} (${c.accessLevel})`}
          className="relative h-7 w-7 rounded-full border-2 border-white overflow-hidden"
        >
          {c.imageUrl ? (
            <Image
              src={c.imageUrl}
              alt={c.name}
              width={28}
              height={28}
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-teal text-[10px] font-bold text-white">
              {c.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ))}
      {collaborators.length > 5 && (
        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-warm-gray/20 text-[10px] font-bold text-charcoal">
          +{collaborators.length - 5}
        </div>
      )}
    </div>
  );
}
