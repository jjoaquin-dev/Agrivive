"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ParallaxProps } from "@/src/types/animation";
import { prefersReducedMotion } from "@/src/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Parallax({
  children,
  className = "",
  speed = -60,
  rotate = 0,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: speed,
        rotation: rotate,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [speed, rotate]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
