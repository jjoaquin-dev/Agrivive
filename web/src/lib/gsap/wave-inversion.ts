import gsap from "gsap";

/** Invert cart & text colors as the green tile wave sweeps across them. */
export function addWaveColorInversion(
  mainTl: gsap.core.Timeline,
  container: HTMLElement,
  cartBox: HTMLElement,
  chars: NodeListOf<HTMLElement>,
  cols: number,
  staggerPerCol: number
) {
  const colWidth = (typeof window !== "undefined" ? window.innerWidth : 1200) / cols;
  const cartRect = cartBox.getBoundingClientRect();
  const cartCol = Math.max(0, Math.min(cols - 1, cartRect.left / colWidth));
  const cartWaveHit = cartCol * staggerPerCol;
  const t = `waveSweep+=${cartWaveHit.toFixed(3)}`;

  mainTl.to(container.querySelectorAll("#cart-box .cart-fill, #cart-box .veggie-fill"), { fill: "#ffffff", duration: 0.18, ease: "power1.out" }, t);
  mainTl.to(container.querySelectorAll("#cart-box .cart-stroke, #cart-box .veggie-stroke"), { stroke: "#ffffff", duration: 0.18, ease: "power1.out" }, t);
  mainTl.to(container.querySelectorAll("#cart-box .accent-cut, #cart-box .veggie-cutout"), { stroke: "#457D00", duration: 0.18, ease: "power1.out" }, t);
  mainTl.to(container.querySelectorAll("#cart-box .cart-wheel"), { fill: "#457D00", stroke: "#ffffff", duration: 0.18, ease: "power1.out" }, t);

  chars.forEach((charEl) => {
    const r = charEl.getBoundingClientRect();
    const col = Math.max(0, Math.min(cols - 1, r.left / colWidth));
    mainTl.to(charEl, { color: "#ffffff", duration: 0.16, ease: "power1.out" }, `waveSweep+=${(col * staggerPerCol).toFixed(3)}`);
  });
}
