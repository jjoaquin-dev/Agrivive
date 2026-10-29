"use client";

import React from "react";
import { useFadeIn } from "@/src/hooks/useFadeIn";
import type { FadeInProps } from "@/src/types/animation";

export function FadeIn({
  children,
  className = "",
  direction = "up",
  distance = 30,
  delay = 0,
  duration = 0.7,
  ease,
}: FadeInProps) {
  const ref = useFadeIn<HTMLDivElement>({
    direction,
    distance,
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
