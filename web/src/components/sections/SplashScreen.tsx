"use client";

import React, { useEffect, useRef, useState } from "react";
import { createSplashTimeline } from "@/src/lib/gsap/timelines";

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Lock scroll during splash
    document.body.style.overflow = "hidden";

    const tl = createSplashTimeline(container, {
      onTileOut: () => {
        document.body.style.overflow = "";
      },
      onComplete: () => {
        setIsDone(true);
        if (onComplete) onComplete();
      },
    });

    tl.play();

    return () => {
      document.body.style.overflow = "";
      tl.kill();
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      id="splash-container"
      className="fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-white"
      style={{ height: "100dvh" }}
      aria-hidden="true"
    >
      {/* Brand Stage */}
      <div className="viewport-stage flex h-full w-full items-center justify-center">
        <div className="brand-unit flex items-center justify-center gap-3 sm:gap-4" id="brand-unit">
          {/* Cart Box with 3 Veggies */}
          <div className="cart-box relative h-20 w-24 sm:h-28 sm:w-36 md:h-36 md:w-44 flex-shrink-0" id="cart-box">
            <svg
              className="cart-svg h-full w-full overflow-visible"
              viewBox="0 0 200 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Veggie 1: Carrot */}
              <g id="v1" className="veggie-group" style={{ transformOrigin: "84px 50px" }}>
                <path className="veggie-fill fill-[#457D00]" d="M 83 33 C 80 23 74 23 71 27 C 77 29 81 33 82 36 Z" />
                <path className="veggie-fill fill-[#457D00]" d="M 85 32 C 85 21 88 19 91 21 C 90 26 87 30 85 32 Z" />
                <path className="veggie-fill fill-[#457D00]" d="M 87 34 C 93 26 98 28 98 32 C 93 34 89 35 87 36 Z" />
                <path
                  className="veggie-fill veggie-cutout fill-[#457D00]"
                  d="M 76 36 Q 85 34 94 37 L 88 74 Q 85 78 82 74 Z"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>

              {/* Veggie 2: Tomato */}
              <g id="v2" className="veggie-group" style={{ transformOrigin: "114px 54px" }}>
                <path
                  className="veggie-stroke stroke-[#457D00]"
                  d="M 114 27 V 21 M 108 25 L 120 25 M 109 23 L 119 29"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle
                  className="veggie-fill veggie-cutout fill-[#457D00]"
                  cx="114"
                  cy="45"
                  r="14.5"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>

              {/* Veggie 3: Broccoli */}
              <g id="v3" className="veggie-group" style={{ transformOrigin: "144px 50px" }}>
                <path className="veggie-fill fill-[#457D00]" d="M 139 48 H 149 L 147 68 H 141 Z" />
                <circle className="veggie-fill veggie-cutout fill-[#457D00]" cx="137" cy="37" r="8.5" stroke="#ffffff" strokeWidth="1.5" />
                <circle className="veggie-fill veggie-cutout fill-[#457D00]" cx="151" cy="37" r="8.5" stroke="#ffffff" strokeWidth="1.5" />
                <circle className="veggie-fill veggie-cutout fill-[#457D00]" cx="144" cy="29" r="9.5" stroke="#ffffff" strokeWidth="1.5" />
              </g>

              {/* Cart Body */}
              <path
                className="cart-fill fill-[#457D00]"
                d="M 68 50 H 164 Q 172 50 170 58 L 160 98 Q 158 106 148 106 H 88 Q 80 106 78 98 L 65 58 Q 63 50 68 50 Z"
              />
              <path className="accent-cut" d="M 78 57 H 154 Q 158 57 157 61" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
              <path
                className="cart-stroke stroke-[#457D00]"
                d="M 32 38 L 46 38 Q 56 38 60 48 L 78 116 Q 81 126 92 126 L 152 126"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle className="cart-wheel fill-white stroke-[#457D00]" cx="88" cy="138" r="9.5" strokeWidth="6" />
              <circle className="cart-wheel fill-white stroke-[#457D00]" cx="144" cy="138" r="9.5" strokeWidth="6" />
            </svg>
          </div>

          {/* Brand Name Typography */}
          <div
            className="brand-text font-brand text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.035em] text-[#457D00] flex"
            id="brand-text"
          >
            <span className="char inline-block">A</span>
            <span className="char inline-block">g</span>
            <span className="char inline-block">r</span>
            <span className="char inline-block">i</span>
            <span className="char inline-block">v</span>
            <span className="char inline-block">i</span>
            <span className="char inline-block">v</span>
            <span className="char inline-block">e</span>
          </div>
        </div>
      </div>

      {/* 18x10 Grid for the Tile Sweep */}
      <div id="tile-grid" />
    </div>
  );
}
