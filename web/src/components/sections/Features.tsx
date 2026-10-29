"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HomeCategories } from "@/src/features/home/components/HomeCategories";
import { HomeFeaturedProduce } from "@/src/features/home/components/HomeFeaturedProduce";
import { HomeHowItWorks } from "@/src/features/home/components/HomeHowItWorks";
import { HomeWhySurplus } from "@/src/features/home/components/HomeWhySurplus";
import { HomeImpactTestimonials } from "@/src/features/home/components/HomeImpactTestimonials";
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
      // 1. Categories Cards Cascade
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

      // 2. How It Works Steps
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

      // 3. Why Surplus Bento Cards
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

      // 4. Testimonials Cards
      const testCards = el.querySelectorAll("#testimonials .grid > div");
      if (testCards.length > 0) {
        gsap.fromTo(
          testCards,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "#testimonials",
              start: "top 80%",
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <HomeCategories />
      <HomeFeaturedProduce />
      <HomeHowItWorks />
      <HomeWhySurplus />
      <HomeImpactTestimonials />
      <HomeFarmerFaq />
      <HomeFinalCta />
    </div>
  );
}
