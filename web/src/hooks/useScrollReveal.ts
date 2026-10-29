"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASINGS } from "@/src/lib/gsap/easings";
import type { RevealProps } from "@/src/types/animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: Omit<RevealProps, "children" | "className"> = {}
) {
  const ref = useRef<T>(null);
  const {
    direction = "up",
    distance = 40,
    threshold = "top 85%",
    once = true,
    delay = 0,
    duration = 0.75,
    ease = EASINGS.DECEL,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const xOffset = direction === "left" ? distance : direction === "right" ? -distance : 0;
    const yOffset = direction === "up" ? distance : direction === "down" ? -distance : 0;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          x: xOffset,
          y: yOffset,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          delay,
          duration,
          ease,
          scrollTrigger: {
            trigger: el,
            start: threshold,
            toggleActions: once ? "play none none none" : "play reverse play reverse",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [direction, distance, threshold, once, delay, duration, ease]);

  return ref;
}
