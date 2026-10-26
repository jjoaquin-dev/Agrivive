"use client";

import { useEffect, useState } from "react";
import { Check, Store } from "lucide-react";

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

  return (
    <div className="relative shrink-0">
      {imageUrl && !imageFailed ? (
        <img
          src={imageUrl}
          alt={`${shopName} seller profile`}
          className="size-24 sm:size-28 shrink-0 rounded-2xl object-cover border border-[#E8E8E8] shadow-2xs"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          aria-label={`${shopName} seller profile`}
          className="flex size-24 sm:size-28 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-neutral-100 font-heading font-bold text-[#16A34A] border border-[#E8E8E8]"
        >
          <Store aria-hidden="true" className="size-7 text-[#16A34A]" />
          <span className="text-sm font-bold">{initials}</span>
        </div>
      )}
      <span
        className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-[#16A34A] text-white ring-2 ring-white shadow-2xs"
        aria-hidden="true"
      >
        <Check className="size-3.5 stroke-[3]" />
      </span>
    </div>
  );
}
