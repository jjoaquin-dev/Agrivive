"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Smartphone } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // 1. Draw in topographic contour lines
      gsap.to(".topo-line", {
        strokeDashoffset: 0,
        duration: 2.2,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.1,
      });

      // 2. Multi-layer Parallax Scrub on Scroll
      gsap.to(".float-slice-1, .float-slice-2, .float-slice-3", {
        y: -110,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".float-slice-4, .float-slice-5, .float-slice-6", {
        y: -160,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to("#topo-container", {
        y: -70,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative overflow-hidden bg-[#457D00] pt-24 pb-14 sm:pt-36 sm:pb-24 text-white min-h-[92vh] sm:min-h-screen flex items-center"
    >
      {/* 1. Organic Paper Grain Micro-Texture */}
      <div className="hero-grain-overlay pointer-events-none" aria-hidden="true" />

      {/* 2. Animated Drawn Topographic Contour Lines */}
      <div id="topo-container" className="pointer-events-none absolute inset-0 overflow-hidden topo-layer" aria-hidden="true">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="#E2FD56" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.22">
            {/* Left Terraced Farm Ridges */}
            <path className="topo-line" d="M -40 120 C 180 80, 320 220, 240 420 C 180 580, 80 620, -40 680" />
            <path className="topo-line" d="M -40 220 C 140 190, 260 300, 200 480 C 150 620, 40 710, -40 760" />
            <path className="topo-line" d="M -40 340 C 90 320, 190 410, 150 560 C 110 680, 20 780, -40 840" strokeDasharray="6 8" />
            <path className="topo-line" d="M -40 480 C 60 460, 130 540, 90 660 C 60 760, 10 840, -40 920" />

            {/* Right Rolling Highland Ridges */}
            <path className="topo-line" d="M 1480 80 C 1260 60, 1120 210, 1180 390 C 1240 560, 1380 620, 1480 680" />
            <path className="topo-line" d="M 1480 180 C 1310 160, 1190 280, 1240 460 C 1290 620, 1410 710, 1480 770" strokeDasharray="6 8" />
            <path className="topo-line" d="M 1480 300 C 1350 290, 1260 400, 1300 550 C 1340 680, 1430 790, 1480 850" />
            <path className="topo-line" d="M 1480 440 C 1380 430, 1320 530, 1350 650 C 1380 760, 1440 850, 1480 920" />

            {/* Valley Ground Ridges */}
            <path className="topo-line" d="M -40 780 C 320 720, 680 840, 1120 760 C 1300 730, 1420 810, 1480 840" />
            <path className="topo-line" d="M -40 860 C 380 810, 780 900, 1180 830 C 1340 810, 1440 870, 1480 890" strokeDasharray="6 8" />
          </g>

          <g fill="#E2FD56" fontFamily="monospace" fontSize="10" fontWeight="bold" opacity="0.25" letterSpacing="1">
            <text x="210" y="370" transform="rotate(35 210 370)">240m</text>
            <text x="165" y="460" transform="rotate(38 165 460)">310m</text>
            <text x="1200" y="360" transform="rotate(-40 1200 360)">420m</text>
            <text x="1245" y="450" transform="rotate(-36 1245 450)">380m</text>
            <text x="720" y="810" textAnchor="middle">DAVAO FERTILE HIGHLAND ELEVATION 280m - 540m</text>
          </g>
        </svg>
      </div>

      {/* 3. Floating Produce Slices (Balanced Perimeter Framing) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Left Side Produce */}
        <div className="hero-slice absolute top-[7%] sm:top-[11%] left-[2%] sm:left-[8%] lg:left-[11%] w-[72px] sm:w-[168px] md:w-[192px] lg:w-[216px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)] opacity-85 sm:opacity-95">
          <div className="float-slice-1 w-full h-full">
            <Image
              src="/brand/slice-tomato-wheel.png"
              alt="Juicy red tomato slice"
              width={216}
              height={216}
              className="w-full h-auto object-contain -rotate-[16deg]"
            />
          </div>
        </div>

        <div className="hero-slice absolute top-[22%] sm:top-[24%] -left-2 sm:left-[3%] lg:left-[4%] w-[54px] sm:w-[112px] md:w-[136px] drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)] opacity-80 sm:opacity-90">
          <div className="float-slice-2 w-full h-full">
            <Image
              src="/brand/slice-cucumber-real.png"
              alt="Fresh green cucumber slice"
              width={136}
              height={136}
              className="w-full h-auto object-contain rotate-[18deg]"
            />
          </div>
        </div>

        <div className="hero-slice absolute top-[48%] sm:top-[44%] -left-3.5 sm:left-[6%] lg:left-[7%] w-[64px] sm:w-[136px] md:w-[168px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] opacity-85 sm:opacity-95">
          <div className="float-slice-3 w-full h-full">
            <Image
              src="/brand/slice-red-onion-ring.png"
              alt="Sliced red onion ring"
              width={168}
              height={168}
              className="w-full h-auto object-contain -rotate-[24deg]"
            />
          </div>
        </div>

        <div className="hero-slice absolute top-[70%] sm:top-[66%] left-[4%] sm:left-[9%] lg:left-[12%] w-[56px] sm:w-[104px] md:w-[128px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.45)] opacity-80 sm:opacity-90">
          <div className="float-slice-4 w-full h-full">
            <Image
              src="/brand/slice-carrot.png"
              alt="Sliced orange carrot coin"
              width={128}
              height={128}
              className="w-full h-auto object-contain rotate-[22deg]"
            />
          </div>
        </div>

        <div className="hero-slice hidden sm:block absolute top-[78%] left-[1.5%] sm:left-[3%] lg:left-[4%] w-18 sm:w-22 md:w-26 drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] opacity-85">
          <div className="float-slice-5 w-full h-full">
            <Image
              src="/brand/slice-basil-leaf.png"
              alt="Fresh basil leaf"
              width={104}
              height={104}
              className="w-full h-auto object-contain -rotate-[32deg]"
            />
          </div>
        </div>

        {/* Right Side Produce */}
        <div className="hero-slice absolute top-[3%] sm:top-[4%] right-[4%] sm:right-[18%] lg:right-[22%] w-[76px] sm:w-[152px] md:w-[184px] lg:w-[200px] drop-shadow-[0_25px_40px_rgba(0,0,0,0.55)] opacity-85 sm:opacity-90">
          <div className="float-slice-5 w-full h-full">
            <Image
              src="/brand/slice-tomato-stem.png"
              alt="Tomato cap with fresh green stem"
              width={200}
              height={200}
              className="w-full h-auto object-contain -rotate-[8deg]"
            />
          </div>
        </div>

        <div className="hero-slice absolute top-[15%] sm:top-[16%] -right-3 sm:right-[7%] lg:right-[9%] w-[80px] sm:w-[176px] md:w-[208px] lg:w-[232px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)] opacity-85 sm:opacity-95">
          <div className="float-slice-1 w-full h-full">
            <Image
              src="/brand/slice-tomato.png"
              alt="Vibrant red tomato slice"
              width={232}
              height={232}
              className="w-full h-auto object-contain rotate-[14deg]"
            />
          </div>
        </div>

        <div className="hero-slice hidden sm:block absolute top-[18%] right-[1%] sm:right-[2%] w-20 sm:w-24 md:w-28 drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)] opacity-90">
          <div className="float-slice-2 w-full h-full">
            <Image
              src="/brand/slice-basil-leaf.png"
              alt="Fresh basil leaf"
              width={112}
              height={112}
              className="w-full h-auto object-contain rotate-[28deg]"
            />
          </div>
        </div>

        <div className="hero-slice absolute top-[50%] sm:top-[48%] -right-3.5 sm:right-[6%] lg:right-[8%] w-[64px] sm:w-[136px] md:w-[168px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] opacity-85 sm:opacity-95">
          <div className="float-slice-3 w-full h-full">
            <Image
              src="/brand/slice-red-onion-ring.png"
              alt="Sliced red onion ring"
              width={168}
              height={168}
              className="w-full h-auto object-contain rotate-[32deg]"
            />
          </div>
        </div>

        <div className="hero-slice absolute top-[72%] sm:top-[70%] right-[4%] sm:right-[14%] lg:right-[17%] w-[60px] sm:w-[112px] md:w-[136px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.45)] opacity-80 sm:opacity-90">
          <div className="float-slice-6 w-full h-full">
            <Image
              src="/brand/slice-yellow-pepper.png"
              alt="Bright yellow pepper slice"
              width={136}
              height={136}
              className="w-full h-auto object-contain -rotate-[20deg]"
            />
          </div>
        </div>

        <div className="hero-slice hidden sm:block absolute top-[78%] right-[1.5%] sm:right-[2.5%] w-18 sm:w-22 md:w-26 drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] opacity-85">
          <div className="float-slice-4 w-full h-full">
            <Image
              src="/brand/slice-cucumber-real.png"
              alt="Fresh cucumber slice"
              width={104}
              height={104}
              className="w-full h-auto object-contain rotate-[12deg]"
            />
          </div>
        </div>

        {/* Ambient Glows */}
        <div className="hero-glow absolute left-1/4 top-1/2 size-[480px] rounded-full bg-[#E2FD56]/10 blur-[140px]" />
        <div className="hero-glow absolute right-1/4 top-1/3 size-[520px] rounded-full bg-[#E2FD56]/15 blur-[130px]" />
      </div>

      {/* 4. Hero Content — STRICTLY PRESERVING ALL REAL TEXT AND DATA */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          
          {/* Real Headline */}
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.12]">
            Rescue{" "}
            <span className="relative inline-block text-[#E2FD56]">
              Surplus
              <svg
                className="absolute -bottom-1.5 left-0 w-full text-[#E2FD56]/80 sm:-bottom-2"
                viewBox="0 0 110 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 9C30 3 80 3 107 9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>{" "}
            Vegetables in Davao City
          </h1>

          {/* Real Paragraph */}
          <p className="mt-4 sm:mt-6 max-w-2xl font-body text-sm leading-relaxed text-emerald-50/90 sm:text-lg">
            Reserve marketable surplus directly from verified local stalls. Secure your order with a 24-hour QR code and save money while helping vendors reduce food waste.
          </p>

          {/* Real Primary & Seller CTA Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:mt-8 w-full sm:w-auto">
            <Link
              href="/marketplace"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#E2FD56] px-8 text-sm font-black text-[#111827] shadow-lg transition-all hover:bg-[#d4f244] hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <span>Shop Today's Harvest</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="#sellers"
              className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 text-sm font-bold text-white shadow-xs backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
            >
              <Smartphone className="size-4 text-[#E2FD56] transition-colors" />
              <span>Are you a Seller? Get the App here</span>
            </Link>
          </div>
        </div>

        {/* Real Centerpiece Harvest Crates & Baskets Display */}
        <div className="relative mx-auto mt-8 sm:mt-10 w-full max-w-5xl px-2">
          <div className="relative mx-auto flex w-full items-center justify-center">
            <Image
              src="/brand/agrivive-harvest-crates.png"
              alt="Abundant fresh surplus vegetables in wooden crates, sacks, and baskets"
              width={1024}
              height={572}
              priority
              sizes="(min-width: 1024px) 860px, (min-width: 640px) 90vw, 100vw"
              className="h-auto w-full max-w-[760px] lg:max-w-[850px] object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-[1.015]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
