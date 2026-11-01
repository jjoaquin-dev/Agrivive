"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

type ProductImageProps = {
  src: string | null;
  alt: string;
  category: string;
  className?: string;
};

function isOptimizableHost(urlStr: string): boolean {
  if (urlStr.startsWith("/")) return true;
  try {
    const url = new URL(urlStr);
    const host = url.hostname.toLowerCase();
    return (
      host.endsWith(".amazonaws.com") ||
      host === "lh3.googleusercontent.com" ||
      host === "localhost" ||
      host === "127.0.0.1"
    );
  } catch {
    return false;
  }
}

export function ProductImage({ src, alt, category, className = "size-full object-cover" }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex size-full items-center justify-center bg-[#F4F7EE] p-3 text-center ${className}`}>
        <span className="flex max-w-[10rem] flex-col items-center gap-1.5 text-xs font-semibold text-[#8A9685]">
          <ImageOff aria-hidden="true" size={18} />
          {category}
        </span>
      </div>
    );
  }

  const isOptimizable = isOptimizableHost(src);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized={!isOptimizable}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
