import Image from "next/image";
import { FormEvent } from "react";

interface MarketplaceHeroProps {
  searchInput?: string;
  onSearchInputChange?: (value: string) => void;
  onSearchSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function MarketplaceHero(_props: MarketplaceHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-neutral-800/40 shadow-xs">
      {/* Full Card Background Image */}
      <Image
        src="/brand/marketplace-hero-farm-stall.jpg"
        alt="Fresh vegetables in crates and woven baskets at a local farm stall"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark gradient overlay for text readability & contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[300px] flex-col justify-center px-6 py-10 sm:min-h-[350px] sm:px-10 sm:py-12 md:min-h-[380px] lg:min-h-[400px] lg:px-12">
        <div className="max-w-md sm:max-w-xl lg:max-w-2xl">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#FCEC9A]">
            Surplus Today, Value for Everyone
          </p>
          <h1 className="mt-2.5 font-heading text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[44px] drop-shadow-xs">
            Your local connection to affordable, marketable vegetables
          </h1>
          <p className="mt-3.5 max-w-lg text-base sm:text-lg font-medium leading-relaxed text-white/90 drop-shadow-xs">
            Discover surplus vegetables from local vendors at prices that work for you.
          </p>
        </div>
      </div>
    </section>
  );
}
