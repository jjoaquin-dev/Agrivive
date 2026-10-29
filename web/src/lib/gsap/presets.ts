import type gsap from "gsap";
import { EASINGS } from "./easings";

export const presets = {
  fadeIn: (vars: gsap.TweenVars = {}) => ({
    opacity: 1,
    duration: 0.6,
    ease: EASINGS.SMOOTH,
    ...vars,
  }),
  fadeUp: (y = 35, vars: gsap.TweenVars = {}) => ({
    y: 0,
    opacity: 1,
    duration: 0.7,
    ease: EASINGS.DECEL,
    ...vars,
  }),
  popIn: (vars: gsap.TweenVars = {}) => ({
    scale: 1,
    opacity: 1,
    duration: 0.5,
    ease: EASINGS.SPRING,
    ...vars,
  }),
  drawStroke: (vars: gsap.TweenVars = {}) => ({
    strokeDashoffset: 0,
    duration: 1.8,
    ease: EASINGS.SMOOTH,
    ...vars,
  }),
};
