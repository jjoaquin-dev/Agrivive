"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HomeCategories } from "@/src/features/home/components/HomeCategories";
import { HomeFeaturedProduce } from "@/src/features/home/components/HomeFeaturedProduce";
import { HomeHowItWorks } from "@/src/features/home/components/HomeHowItWorks";
import { HomeWhySurplus } from "@/src/features/home/components/HomeWhySurplus";
import { HomeFarmerFaq } from "@/src/features/home/components/HomeFarmerFaq";
import { HomeFinalCta } from "@/src/features/home/components/HomeFinalCta";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // 1. Section Headings Reveal
      const headings = el.querySelectorAll("section h2");
      headings.forEach((heading) => {
        gsap.fromTo(
          heading,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 2. Categories Cards Cascade
      const catCards = el.querySelectorAll("#categories a");
      if (catCards.length > 0) {
        gsap.fromTo(
          catCards,
          { y: 35, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "#categories",
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 3. How It Works Steps
      const stepCards = el.querySelectorAll("#how-it-works .grid > div");
      if (stepCards.length > 0) {
        gsap.fromTo(
          stepCards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "#how-it-works",
              start: "top 78%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 4. Why Surplus Bento Cards
      const bentoCards = el.querySelectorAll("#why-agrivive .grid > div");
      if (bentoCards.length > 0) {
        gsap.fromTo(
          bentoCards,
          { y: 45, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "#why-agrivive",
              start: "top 78%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 5. FAQ Accordion Items
      const faqItems = el.querySelectorAll("#faq .divide-y > div");
      if (faqItems.length > 0) {
        gsap.fromTo(
          faqItems,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "#faq",
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 6. Final CTA Banner Card Scale Entrance
      const ctaCard = el.querySelector("#cta-banner, section:last-child > div");
      if (ctaCard) {
        gsap.fromTo(
          ctaCard,
          { y: 40, scale: 0.95, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaCard,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

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
