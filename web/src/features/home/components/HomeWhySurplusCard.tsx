import { ReactNode } from "react";
import Image from "next/image";

interface BenefitCardProps {
  tag: string;
  headline: string;
  description: string;
  imageSrc?: string;
  icon?: ReactNode;
}

// One card shape for every benefit: a media panel on top (photo or icon tile), then the copy below
export function HomeWhySurplusBenefitCard({ tag, headline, description, imageSrc, icon }: BenefitCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm transition-[transform,background-color,border-color] duration-200 ease-settle hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#1E3327]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-[#B8EB5E]/15 text-[#B8EB5E]">{icon}</div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 pt-5">
        <span className="font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-[#B8EB5E]">{tag}</span>
        <h3 className="type-card mt-2 font-heading text-white">{headline}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{description}</p>
      </div>
    </article>
  );
}
