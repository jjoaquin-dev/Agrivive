import type React from "react";

export type AnimationDirection = "up" | "down" | "left" | "right";

export interface AnimationBaseProps {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
}

export interface FadeInProps extends AnimationBaseProps {
  direction?: AnimationDirection;
  distance?: number;
}

export interface StaggerProps extends AnimationBaseProps {
  stagger?: number;
  selector?: string;
}

export interface RevealProps extends AnimationBaseProps {
  direction?: AnimationDirection;
  distance?: number;
  threshold?: string;
  once?: boolean;
}

export interface ParallaxProps extends AnimationBaseProps {
  speed?: number;
  rotate?: number;
}

export interface SplashTimelineOptions {
  onComplete?: () => void;
  onTileOut?: () => void;
  speed?: number;
}
