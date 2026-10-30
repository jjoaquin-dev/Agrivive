"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { createSplashTimeline } from "@/src/lib/gsap/timelines";
import { markSplashSeen, shouldSkipSplash, waitForSplashAssets } from "@/src/lib/motion";

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<ReturnType<typeof createSplashTimeline> | null>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Play once per browser session, and never for people who ask for less motion.
    if (shouldSkipSplash()) {
      setIsDone(true);
      if (onComplete) onComplete();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let ctx: gsap.Context | undefined;

    // Lock scroll during splash
    document.body.style.overflow = "hidden";

    // The server-rendered stage stays hidden (see layout.tsx) until fonts and the hero image are ready.
    waitForSplashAssets(document.querySelector<HTMLImageElement>("#hero-crate img")).then(() => {
      if (cancelled) return;

      document.documentElement.classList.remove("splash-pending");
      markSplashSeen();

      // gsap.context scopes every tween and timeline created here, so cleanup reverts them all.
      ctx = gsap.context(() => {
        const tl = createSplashTimeline(container, {
          // Hero entrance keeps running after this; the overlay itself is finished.
          onTileOut: () => {
            document.body.style.overflow = "";
            setIsDone(true);
            if (onComplete) onComplete();
          },
        });

        timelineRef.current = tl;
        tl.play();
      }, container);
    });

    return () => {
      cancelled = true;
      document.body.style.overflow = "";
      timelineRef.current = null;
      ctx?.revert();
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <>
    <div
      ref={containerRef}
      id="splash-container"
      className="fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-white"
      style={{ height: "100dvh" }}
      aria-hidden="true"
    >
      {/* Brand Stage */}
      <div className="viewport-stage" id="brand-stage">
        <div className="brand-unit" id="brand-unit">
          {/* Cart Component with 3 Veggies */}
          <div className="cart-box" id="cart-box">
            <svg
              className="cart-svg"
              viewBox="0 0 200 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Veggie 1: Carrot (Left Slot: X=84, Y=50) */}
              <g id="v1" className="veggie-group" style={{ transformOrigin: "84px 50px" }}>
                <path className="veggie-fill" d="M 83 33 C 80 23 74 23 71 27 C 77 29 81 33 82 36 Z" />
                <path className="veggie-fill" d="M 85 32 C 85 21 88 19 91 21 C 90 26 87 30 85 32 Z" />
                <path className="veggie-fill" d="M 87 34 C 93 26 98 28 98 32 C 93 34 89 35 87 36 Z" />
                <path
                  className="veggie-fill veggie-cutout"
                  d="M 76 36 Q 85 34 94 37 L 88 74 Q 85 78 82 74 Z"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>

              {/* Veggie 2: Tomato (Center Slot: X=114, Y=54) */}
              <g id="v2" className="veggie-group" style={{ transformOrigin: "114px 54px" }}>
                <path
                  className="veggie-stroke"
                  d="M 114 27 V 21 M 108 25 L 120 25 M 109 23 L 119 29"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle
                  className="veggie-fill veggie-cutout"
                  cx="114"
                  cy="45"
                  r="14.5"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>

              {/* Veggie 3: Broccoli (Right Slot: X=144, Y=50) */}
              <g id="v3" className="veggie-group" style={{ transformOrigin: "144px 50px" }}>
                <path className="veggie-fill" d="M 139 48 H 149 L 147 68 H 141 Z" />
                <circle className="veggie-fill veggie-cutout" cx="137" cy="37" r="8.5" stroke="#ffffff" strokeWidth="1.5" />
                <circle className="veggie-fill veggie-cutout" cx="151" cy="37" r="8.5" stroke="#ffffff" strokeWidth="1.5" />
                <circle className="veggie-fill veggie-cutout" cx="144" cy="29" r="9.5" stroke="#ffffff" strokeWidth="1.5" />
              </g>

              {/* Cart Body */}
              <path
                className="cart-fill"
                d="M 68 50 H 164 Q 172 50 170 58 L 160 98 Q 158 106 148 106 H 88 Q 80 106 78 98 L 65 58 Q 63 50 68 50 Z"
              />
              <path className="accent-cut" d="M 78 57 H 154 Q 158 57 157 61" strokeWidth="3.5" strokeLinecap="round" />
              <path
                className="cart-stroke"
                d="M 32 38 L 46 38 Q 56 38 60 48 L 78 116 Q 81 126 92 126 L 152 126"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle className="cart-wheel" cx="88" cy="138" r="9.5" strokeWidth="6" />
              <circle className="cart-wheel" cx="144" cy="138" r="9.5" strokeWidth="6" />
            </svg>
          </div>

          {/* Agrivive Text in Parkinsans SemiBold */}
          <div className="brand-text" id="brand-text">
            <span className="char">A</span>
            <span className="char">g</span>
            <span className="char">r</span>
            <span className="char">i</span>
            <span className="char">v</span>
            <span className="char">i</span>
            <span className="char">v</span>
            <span className="char">e</span>
          </div>
        </div>
      </div>

      {/* 18x10 Tile Grid Overlay for <| Transition Shape */}
      <div id="tile-grid" />
    </div>

    {/* Outside the aria-hidden stage so keyboard and screen reader users can reach it */}
    <button
      type="button"
      onClick={() => timelineRef.current?.timeScale(10)}
      id="splash-skip"
      className="fixed bottom-4 right-4 z-[10000] inline-flex min-h-12 items-center rounded-full border border-neutral-300 bg-white/95 px-5 text-sm font-semibold text-neutral-800 shadow-md transition-transform hover:bg-white active:scale-95"
    >
      Skip
    </button>
    </>
  );
}
