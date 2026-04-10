"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { addToast } from "@/lib/hooks/use-toast";

interface PhotoUploadProps {
  destinationId: Id<"destinations">;
}

export function PhotoUpload({ destinationId }: PhotoUploadProps) {
  const { isAuthenticated } = useConvexAuth();
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const savePhoto = useMutation(api.photos.savePhoto);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!isAuthenticated) return null;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast("Photo must be under 5 MB", "error");
      return;
    }

    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      await savePhoto({ destinationId, storageId });
      addToast("Photo uploaded!");
    } catch {
      addToast("Upload failed", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        id="photo-upload"
        aria-label="Upload destination photo"
      />
      <Button
        variant="secondary"
        size="sm"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </Button>
    </div>
  );
}
