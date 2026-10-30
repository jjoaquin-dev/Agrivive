"use client";

import { useRef } from "react";
import { HomeCategories } from "@/src/features/home/components/HomeCategories";
import { HomeFeaturedProduce } from "@/src/features/home/components/HomeFeaturedProduce";
import { HomeHowItWorks } from "@/src/features/home/components/HomeHowItWorks";
import { HomeWhySurplus } from "@/src/features/home/components/HomeWhySurplus";
import { HomeFarmerFaq } from "@/src/features/home/components/HomeFarmerFaq";
import { HomeFinalCta } from "@/src/features/home/components/HomeFinalCta";
import { useRevealOnScroll } from "@/src/hooks/useRevealOnScroll";

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Each section marks its own [data-reveal] elements; reduced motion registers nothing, so all stay visible.
  useRevealOnScroll(containerRef);

  return (
    <div ref={containerRef} className="relative">
      <HomeCategories />
      <HomeFeaturedProduce />
      <HomeHowItWorks />
      <HomeWhySurplus />
      <HomeFarmerFaq />
      <HomeFinalCta />
    </div>
  );
}
