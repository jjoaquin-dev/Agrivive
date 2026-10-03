"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Camera, CheckCircle, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { BUYER_PROFILE_IMAGE_UPDATED_EVENT, uploadBuyerAvatar } from "../api/profile";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type ProfileAvatarUploaderProps = {
  imageUrl: string | null;
  initials: string;
  name: string;
  onUploaded: (imageUrl: string) => void;
};

export function ProfileAvatarUploader({ imageUrl, initials, name, onUploaded }: ProfileAvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => setImageFailed(false), [imageUrl]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    setSuccess(false);
    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Your image must be 5 MB or smaller.");
      return;
    }

    setUploading(true);
    try {
      const response = await uploadBuyerAvatar(file);
      onUploaded(response.imageUrl);
      window.dispatchEvent(new CustomEvent(BUYER_PROFILE_IMAGE_UPDATED_EVENT, { detail: response.imageUrl }));
      setSuccess(true);
      window.setTimeout(() => setSuccess(false), 4000);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload your photo. Try again.");
    } finally {
      setUploading(false);
    }
  }

  const showImage = Boolean(imageUrl) && !imageFailed;

  return (
    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
      <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary font-heading text-lg font-bold text-white shadow-xs ring-2 ring-primary/20 sm:size-20 sm:text-xl">
        {showImage ? (
          <img src={imageUrl || ""} alt={`Profile photo for ${name}`} className="size-full object-cover" onError={() => setImageFailed(true)} />
        ) : (
          initials
        )}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-black/45 py-1 text-[10px] font-medium text-white sm:hidden">
          <Camera className="size-3" aria-hidden="true" />
        </span>
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Profile photo</p>
        <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, or WebP · Up to 5 MB</p>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleFileChange} />
        <Button type="button" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()} className="mt-3 min-h-11 rounded-xl px-3 text-xs font-semibold">
          {uploading ? <><Spinner data-icon="inline-start" />Uploading photo…</> : <><Upload data-icon="inline-start" />Change photo</>}
        </Button>
        {error ? <p className="mt-2 max-w-xs text-xs font-medium text-destructive" role="alert">{error}</p> : null}
        {success ? <Alert className="mt-2 border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-800"><CheckCircle className="size-3.5 text-emerald-600" /><AlertDescription className="text-xs">Photo updated.</AlertDescription></Alert> : null}
      </div>
    </div>
  );
}
