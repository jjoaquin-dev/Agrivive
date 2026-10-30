"use client";

import React from "react";
import { useStagger } from "@/src/hooks/useStagger";
import type { StaggerProps } from "@/src/types/animation";

export function Stagger({
  children,
  className = "",
  stagger = 0.08,
  selector = "> *",
  delay = 0,
  duration = 0.65,
  ease,
}: StaggerProps) {
  const ref = useStagger<HTMLDivElement>({
    stagger,
    selector,
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
