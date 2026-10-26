import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Smartphone } from "lucide-react";

export function HomeHero() {
  return (
    <section id="hero" className="relative overflow-hidden border-b border-neutral-100 bg-white pb-12 pt-10 sm:pb-16 sm:pt-14">
      {/* Subtle Ambient Radial Backdrops from Palette */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 size-[650px] rounded-full bg-[#FCEC9A]/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-1/4 top-10 size-[400px] rounded-full bg-[#457D00]/5 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered Headline Section */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Rescue{" "}
            <span className="relative inline-block text-[#457D00]">
              Surplus
              <svg
                className="absolute -bottom-1.5 left-0 w-full text-[#FEA938] sm:-bottom-2"
                viewBox="0 0 110 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 9C30 3 80 3 107 9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>{" "}
            Vegetables in Davao City
          </h1>

          <p className="mt-5 max-w-2xl font-body text-base leading-7 text-neutral-600 sm:text-lg">
            Reserve marketable surplus directly from verified local stalls. Secure your order with a 24-hour QR code and save money while helping vendors reduce food waste.
          </p>

          {/* Primary & Seller CTA Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5 sm:mt-7">
            <Link
              href="/marketplace"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#457D00] px-8 text-sm font-bold text-white shadow-md transition-all hover:bg-[#386600] hover:shadow-lg active:scale-95"
            >
              <span>Shop Today's Harvest</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="#sellers"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-[0.7px] border-[#457D00] bg-white px-6 text-sm font-bold text-neutral-900 shadow-xs transition-all hover:bg-[#F3FFF5] hover:border-[#386600] active:scale-95"
            >
              <Smartphone className="size-4 text-[#457D00] transition-colors" />
              <span>Are you a Seller? Get the App here</span>
            </Link>
          </div>
        </div>

        {/* Centerpiece Harvest Crates & Baskets Display (Moved Up & Sized for Full Visibility) */}
        <div className="relative mx-auto mt-4 w-full max-w-5xl px-2 sm:mt-6 sm:px-4">
          <div className="relative mx-auto flex w-full items-center justify-center">
            <Image
              src="/brand/agrivive-harvest-crates.png"
              alt="Abundant fresh surplus vegetables in wooden crates, sacks, and baskets"
              width={1024}
              height={572}
              priority
              sizes="(min-width: 1024px) 860px, (min-width: 640px) 90vw, 100vw"
              className="h-auto w-full max-w-[760px] lg:max-w-[850px] object-contain drop-shadow-[0_20px_45px_rgba(31,77,58,0.14)] transition-transform duration-500 hover:scale-[1.015]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
