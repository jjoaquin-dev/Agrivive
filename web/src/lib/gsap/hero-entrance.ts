import gsap from "gsap";
import { DURATIONS, EASINGS } from "./easings";

const HEADER_ITEMS = "#header-subnav, #header-actions";

export function setupHeroInitialStates() {
  if (typeof document === "undefined") return;
  gsap.set("#nav-pill", { y: -18, opacity: 0 });
  gsap.set(HEADER_ITEMS, { y: -10, opacity: 0 });
  if (!document.getElementById("hero")) return;
  gsap.set(".topo-line", { strokeDashoffset: 1400 });
  gsap.set(".hero-underline", { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set("#hero-title", { y: 28, opacity: 0 });
  gsap.set("#hero-desc", { y: 18, opacity: 0 });
  gsap.set("#hero-actions > *", { y: 14, opacity: 0 });
  gsap.set("#hero-crate", { y: 32, scale: 0.96, opacity: 0, transformOrigin: "50% 100%" });
}

/**
 * Staged hand-off: the logo flies to the header (label+0.1 .. +0.85), the header's other items arrive as it
 * lands, and the hero cascade begins while the logo is slowing down. Text settles, small things pop.
 * `at` is the number of seconds after `label` that the hero cascade starts.
 */
export function animateHeroEntrance(tl: gsap.core.Timeline, label = "tileOut", at = 0.4) {
  if (typeof document === "undefined") return;
  const t = (offset: number) => `${label}+=${(at + offset).toFixed(2)}`;
  const { small, block, image } = DURATIONS;

  // The pill itself drops in first so its surface is there when the logo and links arrive; clearProps frees the
  // fixed header from any transform (which would otherwise re-anchor the fixed progress bar inside it)
  tl.to("#nav-pill", { y: 0, opacity: 1, duration: 0.6, ease: EASINGS.SETTLE, clearProps: "transform,opacity" }, `${label}+=0.05`);

  // Header items land together with the logo; keep clearProps so hover and focus styles are untouched
  tl.to(HEADER_ITEMS, { y: 0, opacity: 1, duration: small, stagger: 0.06, ease: EASINGS.SETTLE, clearProps: "transform,opacity" }, `${label}+=0.75`);

  if (!document.getElementById("hero")) return;
  tl.to(".topo-line", { strokeDashoffset: 0, duration: 1.6, stagger: 0.05, ease: "power2.out" }, t(0));
  tl.to("#hero-title", { y: 0, opacity: 1, duration: block, ease: EASINGS.SETTLE }, t(0.1));
  // The underline is drawn in once the headline has landed: a small hand-made beat
  tl.to(".hero-underline", { strokeDashoffset: 0, duration: 0.5, ease: EASINGS.GLIDE }, t(0.6));
  tl.to("#hero-desc", { y: 0, opacity: 1, duration: small, ease: EASINGS.SETTLE }, t(0.25));
  // clearProps hands transform back to the buttons' CSS hover lift once they land
  tl.to("#hero-actions > *", { y: 0, opacity: 1, duration: small, stagger: 0.08, ease: EASINGS.POP, clearProps: "transform" }, t(0.35));
  // clearProps drops the crate's compositor layer once it settles
  tl.to("#hero-crate", { y: 0, scale: 1, opacity: 1, duration: image, ease: EASINGS.SETTLE, clearProps: "transform,opacity" }, t(0.4));
}
