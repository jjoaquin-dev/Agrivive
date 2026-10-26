"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

type ProductImageProps = {
  src: string | null;
  alt: string;
  category: string;
  className?: string;
};

export function ProductImage({ src, alt, category, className = "size-full object-cover" }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex size-full items-center justify-center bg-[#FAFAF8] p-3 text-center ${className}`}>
        <span className="flex max-w-[10rem] flex-col items-center gap-1.5 text-xs font-semibold text-[#8A9685]">
          <ImageOff aria-hidden="true" size={18} strokeWidth={1.7} />
          {category}
        </span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}
