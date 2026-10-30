"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { EASINGS } from "@/src/lib/gsap/easings";
import { prefersReducedMotion } from "@/src/lib/motion";
import type { FadeInProps } from "@/src/types/animation";

export function useFadeIn<T extends HTMLElement = HTMLDivElement>(
  options: Omit<FadeInProps, "children" | "className"> = {}
) {
  const ref = useRef<T>(null);
  const {
    direction = "up",
    distance = 30,
    delay = 0,
    duration = 0.7,
    ease = EASINGS.SETTLE,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

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
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [direction, distance, delay, duration, ease]);

  return ref;
}
