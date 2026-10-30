"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Smartphone } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroFloatingSlices } from "./HeroFloatingSlices";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const mm = gsap.matchMedia(heroRef);

    // Desktop only: a light two-depth drift on the decorative slices. Phones and reduced motion keep them still.
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const scrollTrigger = { trigger: el, start: "top top", end: "bottom top", scrub: 0.8 };
      gsap.to(".float-slice-1, .float-slice-2, .float-slice-3", { y: -60, ease: "none", scrollTrigger: { ...scrollTrigger } });
      gsap.to(".float-slice-4, .float-slice-5, .float-slice-6", { y: -100, ease: "none", scrollTrigger: { ...scrollTrigger } });
    });

    // Resting life: each slice bobs a few pixels on its own slow loop, paused while the hero is off screen.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const bobs = gsap.utils.toArray<HTMLElement>(".hero-slice", el).map((slice) =>
        gsap.to(slice, {
          y: gsap.utils.random(-14, -8),
          duration: gsap.utils.random(3, 4.5),
          delay: gsap.utils.random(0, 2),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );
      const watcher = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => bobs.forEach((bob) => (self.isActive ? bob.resume() : bob.pause())),
      });
      return () => watcher.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative overflow-hidden bg-[#457D00] pt-[120px] pb-12 sm:pt-[168px] sm:pb-20 text-white min-h-[92dvh] sm:min-h-dvh flex items-center"
    >
      {/* 1. Organic Paper Grain Micro-Texture */}
      <div className="hero-grain-overlay pointer-events-none" aria-hidden="true" />

      {/* 2. Topographic Contour Lines */}
      <div id="topo-container" className="pointer-events-none absolute inset-0 overflow-hidden topo-layer" aria-hidden="true">
        <svg className="w-full h-full object-cover" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#E2FD56" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.22">
            <path className="topo-line" d="M -40 120 C 180 80, 320 220, 240 420 C 180 580, 80 620, -40 680" />
            <path className="topo-line" d="M -40 220 C 140 190, 260 300, 200 480 C 150 620, 40 710, -40 760" />
            <path className="topo-line" d="M -40 340 C 90 320, 190 410, 150 560 C 110 680, 20 780, -40 840" strokeDasharray="6 8" />
            <path className="topo-line" d="M -40 480 C 60 460, 130 540, 90 660 C 60 760, 10 840, -40 920" />
            <path className="topo-line" d="M 1480 80 C 1260 60, 1120 210, 1180 390 C 1240 560, 1380 620, 1480 680" />
            <path className="topo-line" d="M 1480 180 C 1310 160, 1190 280, 1240 460 C 1290 620, 1410 710, 1480 770" strokeDasharray="6 8" />
            <path className="topo-line" d="M 1480 300 C 1350 290, 1260 400, 1300 550 C 1340 680, 1430 790, 1480 850" />
            <path className="topo-line" d="M 1480 440 C 1380 430, 1320 530, 1350 650 C 1380 760, 1440 850, 1480 920" />
            <path className="topo-line" d="M -40 780 C 320 720, 680 840, 1120 760 C 1300 730, 1420 810, 1480 840" />
            <path className="topo-line" d="M -40 860 C 380 810, 780 900, 1180 830 C 1340 810, 1440 870, 1480 890" strokeDasharray="6 8" />
          </g>
        </svg>
      </div>

      {/* 3. Floating Produce Slices */}
      <HeroFloatingSlices />

      {/* 4. Real Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p id="hero-eyebrow" className="type-eyebrow inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[#E2FD56]">
            <MapPin className="size-3.5" aria-hidden="true" />
            Davao City Farms &amp; Public Market Stalls
          </p>

          <h1 id="hero-title" className="type-display mt-5 font-heading text-white sm:mt-6">
            Rescue{" "}
            <span className="relative inline-block text-[#E2FD56]">
              Surplus
              <svg className="absolute -bottom-1.5 left-0 w-full text-[#E2FD56]/80 sm:-bottom-2" viewBox="0 0 110 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path className="hero-underline" pathLength={1} d="M3 9C30 3 80 3 107 9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>{" "}
            Vegetables
            <br className="hidden sm:block" /> in Davao City
          </h1>

          <p id="hero-desc" className="type-lede mt-5 max-w-xl font-body text-emerald-50/90 sm:mt-6">
            Reserve fresh surplus from verified local stalls. Pick up with a 24-hour QR code and help cut food waste.
          </p>

          <div id="hero-actions" className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/marketplace"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#E2FD56] px-8 text-[15px] font-bold text-[#111827] shadow-lg transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#d4f244] hover:shadow-xl active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#457D00]"
            >
              <span>Shop Today's Harvest</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

            <a
              href="/downloads/agrivive-seller.apk"
              download="agrivive-seller.apk"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 text-[15px] font-bold text-white backdrop-blur-md transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/20 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#457D00]"
            >
              <Smartphone className="size-4 text-[#E2FD56]" aria-hidden="true" />
              <span>Get the Seller App</span>
            </a>
          </div>
        </div>

        {/* Harvest Crates */}
        <div id="hero-crate" className="relative mx-auto mt-10 sm:mt-14 w-full max-w-5xl px-2">
          <div className="relative mx-auto flex w-full items-center justify-center">
            <Image
              src="/brand/agrivive-harvest-crates.png"
              alt="Abundant fresh surplus vegetables in wooden crates, sacks, and baskets"
              width={1024}
              height={572}
              priority
              sizes="(min-width: 1024px) 860px, (min-width: 640px) 90vw, 100vw"
              className="h-auto w-full max-w-[760px] lg:max-w-[850px] object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
