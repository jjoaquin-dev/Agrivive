"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scrubs every `selector` item up into place as the scope scrolls into view. Later items start lower,
 * so a row lifts as a wave. Tied to scroll position, so it reverses when scrolling back up.
 * Reduced motion registers nothing.
 */
export function useScrollLift(scopeRef: RefObject<HTMLElement | null>, selector: string) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(selector, scope).forEach((item, i) => {
        gsap.fromTo(
          item,
          { y: 40 + i * 12 },
          {
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: scope, start: "top 98%", end: "top 55%", scrub: 0.6 },
          }
        );
      });
    });

    return () => mm.revert();
  }, [scopeRef, selector]);
}
