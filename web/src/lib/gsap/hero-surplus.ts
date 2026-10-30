import gsap from "gsap";
import { DURATIONS, EASINGS } from "./easings";

const CHIPS = ".surplus-chip";
const WORD = ".surplus-text";

export function setupSurplusInitialStates() {
  gsap.set(CHIPS, { opacity: 0, scale: 0.2, y: -28 });
  gsap.set(WORD, { opacity: 0, rotationX: -90, transformOrigin: "50% 100%" });
}

/**
 * The four produce chips drop in, flip once together, then shrink away while the word "Surplus" turns up
 * into their place. `t` maps a number of seconds to a timeline position (see hero-entrance.ts).
 */
export function addSurplusMorph(tl: gsap.core.Timeline, t: (offset: number) => string) {
  tl.to(CHIPS, { opacity: 1, scale: 1, y: 0, duration: DURATIONS.small, stagger: 0.08, ease: EASINGS.POP }, t(0.45));
  tl.to(CHIPS, { rotationY: 360, duration: 0.6, stagger: 0.08, ease: "power2.inOut" }, t(0.95));
  tl.to(CHIPS, { scale: 0, opacity: 0, duration: 0.3, stagger: 0.03, ease: "back.in(2)" }, t(1.5));
  tl.to(WORD, { opacity: 1, rotationX: 0, duration: DURATIONS.block, ease: EASINGS.SETTLE }, t(1.55));
}
