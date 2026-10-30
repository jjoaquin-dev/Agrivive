"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/src/lib/motion";
import { DURATIONS, EASINGS } from "@/src/lib/gsap/easings";

/**
 * Fades every [data-reveal] element inside the scope up once, the first time it enters the viewport.
 * Plain [data-reveal] blocks settle upward; [data-reveal="pop"] items (cards, tiles) also scale up with a light pop.
 * Elements that enter together stagger in DOM order. IntersectionObserver is used instead of ScrollTrigger
 * so late-loading content (live produce) cannot leave trigger positions stale.
 *
 * Mark stable wrappers, not data-driven children: a wrapper reveals once, and content that renders
 * inside it later (loaded or refreshed products) appears without replaying the entrance.
 */
const isPop = (el: Element) => el.getAttribute("data-reveal") === "pop";

export function useRevealOnScroll(scopeRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || prefersReducedMotion()) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope);
    if (items.length === 0) return;

    const distance = window.matchMedia("(max-width: 639px)").matches ? 14 : 24;
    // Opacity only, never visibility, so keyboard focus can still reach (and so reveal) hidden items.
    const ctx = gsap.context(() => gsap.set(items, { opacity: 0, y: distance, scale: (_, el) => (isPop(el) ? 0.96 : 1) }));

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target);
        if (entering.length === 0) return;
        entering.forEach((target) => observer.unobserve(target));
        const blocks = entering.filter((el) => !isPop(el));
        const pops = entering.filter(isPop);
        ctx.add(() => {
          const done = { opacity: 1, y: 0, scale: 1, clearProps: "transform,opacity" };
          // Hands transform back to CSS so hover lifts work after the reveal
          if (blocks.length) gsap.to(blocks, { ...done, duration: DURATIONS.block, stagger: 0.08, ease: EASINGS.SETTLE });
          if (pops.length) gsap.to(pops, { ...done, duration: 0.55, stagger: 0.07, ease: EASINGS.POP });
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, [scopeRef]);
}
