"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { BUYER_PROFILE_IMAGE_UPDATED_EVENT, uploadBuyerAvatar } from "../api/profile";

interface ProfilePictureCardProps {
  imageUrl: string | null;
  initials: string;
  name: string;
  onAvatarUploaded: (url: string | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function ProfilePictureCard({
  imageUrl,
  initials,
  name,
  onAvatarUploaded,
}: ProfilePictureCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    setSuccess(false);
    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("Please choose a JPG, PNG, or WebP photo.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Your image must be 5 MB or smaller.");
      return;
    }

    setUploading(true);
    try {
      const response = await uploadBuyerAvatar(file);
      onAvatarUploaded(response.imageUrl);
      window.dispatchEvent(
        new CustomEvent(BUYER_PROFILE_IMAGE_UPDATED_EVENT, { detail: response.imageUrl }),
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Could not upload photo. Try again.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card className="flex flex-col items-center rounded-2xl border border-neutral-200/80 bg-white p-6 text-center shadow-md">
      <div className="w-full border-b border-border/70 pb-4 text-left">
        <h2 className="font-heading text-lg font-bold text-neutral-900">Profile Picture</h2>
        <p className="text-sm text-neutral-500">
          Your picture helps market stall vendors recognize you during pickup.
        </p>
      </div>

      {/* Circular Avatar */}
      <div className="relative mt-6 mb-6 size-32 overflow-hidden rounded-full border-2 border-neutral-200/80 bg-[#F4F6EE] shadow-sm sm:size-36">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover object-center"
            unoptimized
          />
        ) : (
          <div className="flex size-full items-center justify-center font-heading text-3xl font-bold text-[#457D00]">
            {initials}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />

      {/* Action Buttons */}
      <div className="flex w-full flex-col items-center gap-2">
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="h-11 w-full max-w-[200px] rounded-full text-xs font-bold bg-[#457D00] hover:bg-[#14231A] text-white shadow-sm transition active:translate-y-px flex items-center justify-center gap-2 cursor-pointer"
        >
          {uploading ? (
            <><Spinner data-icon="inline-start" />Uploading…</>
          ) : (
            <><Upload className="size-4" />Upload a new one</>
          )}
        </Button>

        {imageUrl && (
          <button
            type="button"
            onClick={() => onAvatarUploaded(null)}
            className="py-1 text-xs font-semibold text-red-600 hover:underline cursor-pointer"
          >
            Remove photo
          </button>
        )}
      </div>

      {error ? (
        <Alert variant="destructive" className="mt-4 text-xs">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {success ? (
        <p className="mt-3 text-xs font-semibold text-[#16A34A]">Photo updated successfully!</p>
      ) : null}
    </Card>
  );
}
