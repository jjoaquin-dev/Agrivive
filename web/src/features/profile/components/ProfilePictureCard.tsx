"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Trash2, Upload } from "lucide-react";
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
    <Card className="flex flex-col items-center rounded-[24px] border border-border/80 bg-white p-6 text-center shadow-[0_8px_24px_rgba(31,77,58,0.04)] sm:p-8">
      <h2 className="self-start font-heading text-lg font-bold text-foreground">
        Profile Picture
      </h2>
      <p className="mb-6 self-start text-xs text-muted-foreground">
        Your picture helps market stall vendors recognize you during pickup.
      </p>

      {/* Circular Avatar */}
      <div className="relative mb-6 size-32 overflow-hidden rounded-full border-2 border-border/80 bg-gradient-to-br from-agrivive-primary/10 to-agrivive-sage/20 ring-4 ring-agrivive-primary/10 sm:size-36">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover object-center"
            unoptimized
          />
        ) : (
          <div className="flex size-full items-center justify-center font-heading text-3xl font-bold text-agrivive-primary">
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
      <div className="flex w-full flex-col items-center gap-2.5">
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="min-h-11 w-full max-w-[200px] rounded-full font-semibold"
        >
          {uploading ? (
            <><Spinner data-icon="inline-start" />Uploading…</>
          ) : (
            <><Upload data-icon="inline-start" className="size-4" />Upload a new one</>
          )}
        </Button>

        {imageUrl && (
          <button
            type="button"
            onClick={() => onAvatarUploaded(null)}
            className="text-xs font-semibold text-destructive hover:underline"
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
        <p className="mt-3 text-xs font-semibold text-emerald-700">Photo updated successfully!</p>
      ) : null}
    </Card>
  );
}
