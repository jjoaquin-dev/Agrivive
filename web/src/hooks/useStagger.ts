"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { EASINGS } from "@/src/lib/gsap/easings";
import type { StaggerProps } from "@/src/types/animation";

export function useStagger<T extends HTMLElement = HTMLDivElement>(
  options: Omit<StaggerProps, "children" | "className"> = {}
) {
  const ref = useRef<T>(null);
  const {
    stagger = 0.08,
    selector = "> *",
    delay = 0,
    duration = 0.65,
    ease = EASINGS.SMOOTH,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll(selector);
      if (!targets.length) return;

      gsap.fromTo(
        targets,
        {
          y: 35,
          opacity: 0,
          scale: 0.96,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          delay,
          duration,
          stagger,
          ease,
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [stagger, selector, delay, duration, ease]);

  return ref;
}
