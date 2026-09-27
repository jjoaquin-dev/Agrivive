"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

type ProductImageProps = {
  src: string | null;
  alt: string;
  category: string;
  className?: string;
};

export function ProductImage({ src, alt, category, className = "" }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex h-full min-h-48 items-center justify-center bg-agrivive-background p-6 text-center ${className}`}>
        <span className="flex max-w-[12rem] flex-col items-center gap-2 text-sm font-semibold text-agrivive-muted"><ImageOff aria-hidden="true" size={22} strokeWidth={1.7} />{category}</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={`h-full w-full object-contain ${className}`} onError={() => setFailed(true)} />;
}
