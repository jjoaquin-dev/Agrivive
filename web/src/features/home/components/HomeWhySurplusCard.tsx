import { ReactNode } from "react";
import Image from "next/image";

interface BenefitCardProps {
  tag: string;
  headline: string;
  description: string;
  bgType: "image" | "cream" | "sage";
  imageSrc?: string;
  icon?: ReactNode;
  className?: string;
  revealed?: boolean;
}

export function HomeWhySurplusBenefitCard({
  tag,
  headline,
  description,
  bgType,
  imageSrc,
  icon,
  className = "",
  revealed = false,
}: BenefitCardProps) {
  const revealProps = revealed ? { "data-reveal": true } : {};
  if (bgType === "image" && imageSrc) {
    return (
      <div
        {...revealProps}
        className={`group relative flex flex-col justify-between overflow-hidden rounded-[28px] p-7 text-white shadow-sm transition-[transform,box-shadow] duration-200 ease-settle hover:-translate-y-1 hover:shadow-xl ${className}`}
      >
        <Image
          src={imageSrc}
          alt={headline}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-settle group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />

        <div className="relative z-10">
          <span className="inline-flex items-center rounded-xl bg-white/20 px-3.5 py-1.5 font-heading text-xs font-bold text-white shadow-xs backdrop-blur-md border border-white/20">
            {tag}
          </span>
        </div>

        <div className="relative z-10 mt-16 sm:mt-24">
          <h3 className="type-card font-heading text-white">
            {headline}
          </h3>
          <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-white/85">
            {description}
          </p>
        </div>
      </div>
    );
  }

  const isCream = bgType === "cream";
  const bgStyles = isCream
    ? "bg-[#FFF9EE] border-[#F4E6CF] text-neutral-900"
    : "bg-[#F0F7ED] border-[#CFECC0] text-neutral-900";
  const tagStyles = isCream
    ? "bg-[#FEF0D8] text-[#B45309] border-[#FDE68A]"
    : "bg-[#E2F2D5] text-[#2E6B18] border-[#BBF7D0]";

  return (
    <div
      {...revealProps}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[28px] border p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-[transform,box-shadow] duration-200 ease-settle hover:-translate-y-1 hover:shadow-lg ${bgStyles} ${className}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-xl px-3.5 py-1.5 font-heading text-xs font-bold border ${tagStyles}`}
        >
          {tag}
        </span>
        {icon && <div className="text-neutral-700">{icon}</div>}
      </div>

      <div className="mt-14 sm:mt-20">
        <h3 className="type-card font-heading text-neutral-900">
          {headline}
        </h3>
        <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-neutral-600">
          {description}
        </p>
      </div>
    </div>
  );
}
