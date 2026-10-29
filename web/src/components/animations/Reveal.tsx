"use client";

import React from "react";
import { useScrollReveal } from "@/src/hooks/useScrollReveal";
import type { RevealProps } from "@/src/types/animation";

export function Reveal({
  children,
  className = "",
  direction = "up",
  distance = 35,
  threshold = "top 85%",
  once = true,
  delay = 0,
  duration = 0.75,
  ease,
}: RevealProps) {
  const ref = useScrollReveal<HTMLDivElement>({
    direction,
    distance,
    threshold,
    once,
    delay,
    duration,
    ease,
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
