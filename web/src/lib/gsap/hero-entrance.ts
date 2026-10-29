import gsap from "gsap";

export function setupHeroInitialStates() {
  if (typeof document === "undefined" || !document.getElementById("hero")) return;
  gsap.set(".topo-line", { strokeDashoffset: 1400 });
  gsap.set(".hero-slice", { scale: 0.35, opacity: 0, y: (i: number) => (i % 2 === 0 ? 30 : -30) });
  gsap.set("#hero-title", { y: 35, opacity: 0 });
  gsap.set("#hero-desc", { y: 28, opacity: 0 });
  gsap.set("#hero-actions > *", { y: 24, opacity: 0, scale: 0.92 });
  gsap.set("#hero-crate", { y: 48, opacity: 0, scale: 0.96 });
}

export function animateHeroEntrance(tl: gsap.core.Timeline, label = "tileOut") {
  if (typeof document === "undefined" || !document.getElementById("hero")) return;
  tl.to(".topo-line", { strokeDashoffset: 0, duration: 2.0, stagger: 0.07, ease: "power2.out" }, `${label}+=0.06`);
  tl.to(".hero-slice", { scale: 1, opacity: 0.9, y: 0, duration: 0.95, stagger: 0.045, ease: "back.out(1.35)" }, `${label}+=0.08`);
  tl.to("#hero-title", { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }, `${label}+=0.22`);
  tl.to("#hero-desc", { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, `${label}+=0.30`);
  tl.to("#hero-actions > *", { y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.1, ease: "back.out(1.4)" }, `${label}+=0.38`);
  tl.to("#hero-crate", { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }, `${label}+=0.44`);
}
