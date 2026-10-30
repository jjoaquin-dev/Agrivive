import gsap from "gsap";
import { EASINGS } from "./easings";

const LIME = "#E2FD56";
const GREEN = "#457D00";

/** While the finished logo rests on green: a slow 3% scale-up and a lime shimmer running through the letters. */
export function addLogoHold(
  tl: gsap.core.Timeline,
  brandUnit: HTMLElement,
  chars: NodeListOf<HTMLElement>,
  startTime: number,
  duration: number
) {
  tl.to(brandUnit, { scale: 1.03, duration, ease: "sine.inOut" }, `waveSweep+=${startTime}`);
  tl.to(chars, { color: LIME, duration: 0.18, stagger: 0.05, ease: "power1.out" }, `waveSweep+=${startTime + 0.1}`);
  tl.to(chars, { color: "#ffffff", duration: 0.25, stagger: 0.05, ease: "power1.inOut" }, `waveSweep+=${startTime + 0.3}`);
}

/**
 * Glides the splash logo onto the header logo and turns it green on the way, so the splash and the site
 * read as one object. Returns false (and adds nothing) when the header logo is missing.
 */
export function addLogoFlight(
  tl: gsap.core.Timeline,
  container: HTMLElement,
  brandUnit: HTMLElement,
  chars: NodeListOf<HTMLElement>,
  label: string,
  duration = 0.75
): boolean {
  const header = document.getElementById("header-logo");
  if (!header) return false;

  gsap.set(header, { opacity: 0 });

  // Function values are read when the tween starts, so a resize during the hold is still honoured.
  const center = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  tl.to(
    brandUnit,
    {
      x: () => center(header.getBoundingClientRect()).x - center(brandUnit.getBoundingClientRect()).x,
      y: () => center(header.getBoundingClientRect()).y - center(brandUnit.getBoundingClientRect()).y,
      scale: () => header.getBoundingClientRect().width / brandUnit.offsetWidth,
      duration,
      ease: EASINGS.GLIDE,
    },
    `${label}+=0.1`
  );

  // Back to brand green and the header logo's white cut-outs, over the second half of the flight
  const back = `${label}+=${(0.1 + duration * 0.45).toFixed(3)}`;
  const q = (sel: string) => container.querySelectorAll(sel);
  const d = { duration: duration * 0.5, ease: "power1.inOut" };
  tl.to(q("#cart-box .cart-fill, #cart-box .veggie-fill"), { fill: GREEN, ...d }, back);
  tl.to(q("#cart-box .cart-stroke, #cart-box .veggie-stroke"), { stroke: GREEN, ...d }, back);
  tl.to(q("#cart-box .accent-cut, #cart-box .veggie-cutout"), { stroke: "#ffffff", ...d }, back);
  tl.to(q("#cart-box .cart-wheel"), { fill: "#ffffff", stroke: GREEN, ...d }, back);
  tl.to(chars, { color: GREEN, ...d }, back);

  // Land: the real header logo takes over from the flying copy
  const land = `${label}+=${(0.1 + duration).toFixed(3)}`;
  tl.set(header, { clearProps: "opacity" }, land);
  tl.set(brandUnit, { opacity: 0 }, land);
  return true;
}
