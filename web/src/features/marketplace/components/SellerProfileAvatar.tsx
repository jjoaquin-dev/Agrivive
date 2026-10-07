"use client";

import { useEffect, useState } from "react";
import { Store } from "lucide-react";

type SellerProfileAvatarProps = {
  imageUrl: string | null;
  shopName: string;
};

export function SellerProfileAvatar({ imageUrl, shopName }: SellerProfileAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = shopName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => setImageFailed(false), [imageUrl]);

  if (imageUrl && !imageFailed) {
    return (
      <img
        src={imageUrl}
        alt={`${shopName} seller profile`}
        className="size-16 shrink-0 rounded-2xl object-cover ring-2 ring-primary/15 sm:size-20"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      aria-label={`${shopName} seller profile`}
      className="flex size-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl bg-agrivive-background font-heading font-bold text-primary ring-2 ring-primary/15 sm:size-20"
    >
      <Store aria-hidden="true" className="size-5" />
      <span className="text-sm">{initials}</span>
    </div>
  );
}
