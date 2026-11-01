"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Smartphone } from "lucide-react";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative overflow-hidden bg-white pt-[120px] sm:pt-[168px] text-[#111827] min-h-[92dvh] sm:min-h-dvh flex flex-col pb-10 lg:pb-0"
    >
      {/* Real Content */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:self-center lg:pb-16 lg:text-left">
          <h1 id="hero-title" className="type-display hero-title-line mt-0 font-brand text-[#111827]">
            <span>
              Rescue{" "}
              <span className="relative isolate inline-block text-[#457D00]">
                Surplus
                <svg className="absolute -bottom-1.5 left-0 -z-10 w-full text-[#E2FD56] sm:-bottom-2" viewBox="0 0 110 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path className="hero-underline" pathLength={1} d="M3 9C30 3 80 3 107 9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </span>{" "}
              <br className="hidden lg:block" />
              Vegetables
            </span>
            <br className="hidden sm:block" /> in Davao City
          </h1>

          <p id="hero-desc" className="type-lede mt-5 max-w-xl font-body text-[#4B5563] sm:mt-6 lg:text-[1.375rem]">
            Reserve fresh surplus from verified local stalls. Pick up with a 24-hour QR code and help cut food waste.
          </p>

          <div id="hero-actions" className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center sm:gap-4 lg:flex-wrap lg:justify-start">
            <Link
              href="/marketplace"
              className="inline-flex min-h-[56px] whitespace-nowrap items-center justify-center gap-2 rounded-full bg-[#457D00] px-8 text-base font-bold text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#386400] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <span>Shop Today's Harvest</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

            <a
              href="/downloads/agrivive-seller.apk"
              download="agrivive-seller.apk"
              className="inline-flex min-h-[56px] whitespace-nowrap items-center justify-center gap-2 rounded-full border-2 border-[#457D00] px-7 text-base font-bold text-[#457D00] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#457D00]/10 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <Smartphone className="size-4 text-[#457D00]" aria-hidden="true" />
              <span>Get the Seller App</span>
            </a>
          </div>
        </div>

        {/* Vegetable cart, sitting in the right column and bleeding slightly off the edge. Multiply blend hides the white background. */}
        <div id="hero-crate" className="relative mx-auto w-full max-w-[680px] lg:-mr-24 lg:mx-0 lg:max-w-none lg:self-end lg:-translate-x-20 xl:-mr-52 xl:-translate-x-28">
          <Image
            src="/brand/hero-cart-nobg.png"
            alt="Fresh surplus vegetables in a shopping cart"
            width={2000}
            height={1116}
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="block h-auto w-full object-contain mix-blend-multiply lg:w-[190%] lg:max-w-none"
          />
        </div>
      </div>
    </section>
  );
}
