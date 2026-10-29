import gsap from "gsap";
import type { SplashTimelineOptions } from "@/src/types/animation";
import { createSplashGrid } from "./splash-grid";
import { setupHeroInitialStates, animateHeroEntrance } from "./hero-entrance";
import { addWaveColorInversion } from "./wave-inversion";

export function createSplashTimeline(
  container: HTMLElement,
  options: SplashTimelineOptions = {}
): gsap.core.Timeline {
  const { onComplete, onTileOut, speed = 1 } = options;

  const mainTl = gsap.timeline({
    paused: true,
    onComplete: () => {
      if (onComplete) onComplete();
    },
  });

  mainTl.timeScale(speed);

  const cartBox = container.querySelector<HTMLElement>("#cart-box");
  const cartSvg = container.querySelector<SVGElement>(".cart-svg");
  const v1 = container.querySelector<SVGElement>("#v1");
  const v2 = container.querySelector<SVGElement>("#v2");
  const v3 = container.querySelector<SVGElement>("#v3");
  const brandStage = container.querySelector<HTMLElement>("#brand-stage");
  const brandUnit = container.querySelector<HTMLElement>("#brand-unit");
  const chars = container.querySelectorAll<HTMLElement>(".char");
  const tileGrid = container.querySelector<HTMLElement>("#tile-grid");

  if (!cartBox || !brandUnit || !tileGrid || !cartSvg) return mainTl;

  const { cols, rawTiles, tilesLeftEdge } = createSplashGrid(tileGrid);

  // Measure dead-center position for isolated cart start
  gsap.set(cartBox, { x: 0 });
  const cartRect = cartBox.getBoundingClientRect();
  const cartCenterX = cartRect.left + cartRect.width / 2;
  const viewportCenterX = (typeof window !== "undefined" ? window.innerWidth : 1200) / 2;
  const initialCartOffset = viewportCenterX - cartCenterX;

  gsap.set(cartBox, { x: initialCartOffset, y: 0, scale: 1, rotation: 0, opacity: 1 });
  gsap.set(cartSvg, { transformOrigin: "center bottom" });
  gsap.set(chars, { y: 35, opacity: 0, scale: 0.25, rotation: (i) => (i % 2 === 0 ? -12 : 12) });

  // Pre-hide hero elements and navigation so they cascade in upon peel
  setupHeroInitialStates();

  const isMobile = (typeof window !== "undefined" ? window.innerWidth : 1200) < 640;
  const projX = isMobile ? 160 : 240;
  const projY = isMobile ? 200 : 260;

  if (v1) gsap.set(v1, { x: -projX, y: -projY, rotation: -75, opacity: 0 });
  if (v2) gsap.set(v2, { x: 0, y: -(projY + 30), rotation: 120, opacity: 0 });
  if (v3) gsap.set(v3, { x: projX, y: -projY, rotation: 75, opacity: 0 });

  // STEP 1: 3 VEGGIES FLY INTO BASKET SLOTS (PROJECTILE ARCS & SQUASH)
  if (v1) {
    mainTl.set(v1, { opacity: 1 }, "v1");
    mainTl.to(v1, { x: 0, rotation: -6, duration: 0.44, ease: "power1.out" }, "v1");
    mainTl.to(v1, { y: 0, duration: 0.44, ease: "power2.in" }, "v1");
  }

  mainTl.to(
    cartSvg,
    {
      keyframes: [
        { y: 8, rotation: -3.5, scaleX: 1.08, scaleY: 0.92, duration: 0.06 },
        { y: -5, rotation: 2.5, duration: 0.06 },
        { y: 2, rotation: -1, duration: 0.05 },
        { y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: 0.09 },
      ],
      ease: "power1.out",
    },
    "v1+=0.42"
  );

  if (v2) {
    mainTl.set(v2, { opacity: 1 }, "v1+=0.28");
    mainTl.to(v2, { y: 0, rotation: 0, duration: 0.38, ease: "power2.in" }, "v1+=0.28");
  }

  mainTl.to(
    cartSvg,
    {
      keyframes: [
        { y: 12, scaleX: 1.12, scaleY: 0.88, duration: 0.06 },
        { y: -6, scaleX: 0.95, scaleY: 1.05, duration: 0.06 },
        { y: 0, scaleX: 1, scaleY: 1, duration: 0.12, ease: "elastic.out(1.2, 0.4)" },
      ],
    },
    "v1+=0.64"
  );

  if (v3) {
    mainTl.set(v3, { opacity: 1 }, "v1+=0.56");
    mainTl.to(v3, { x: 0, rotation: 6, duration: 0.44, ease: "power1.out" }, "v1+=0.56");
    mainTl.to(v3, { y: 0, duration: 0.44, ease: "power2.in" }, "v1+=0.56");
  }

  mainTl.to(
    cartSvg,
    {
      keyframes: [
        { y: 13, rotation: 4, scaleX: 1.1, scaleY: 0.9, duration: 0.06 },
        { y: -7, rotation: -3, duration: 0.06 },
        { y: 2.5, rotation: 1, duration: 0.06 },
        { y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: 0.12 },
      ],
    },
    "v1+=0.98"
  );

  // STEP 2: CART SLIDES LEFT, WHEELS ROLL, AGRIVIVE ENTERS, CART TILTS (-11°)
  mainTl.to(cartBox, { x: 0, duration: 0.55, ease: "power2.inOut" }, "assemble");
  mainTl.to(
    container.querySelectorAll(".cart-wheel"),
    { rotation: -360, transformOrigin: "center center", duration: 0.55, ease: "power2.inOut" },
    "assemble"
  );

  mainTl.to(
    chars,
    {
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.52,
      stagger: 0.035,
      ease: "elastic.out(1.15, 0.45)",
    },
    "assemble+=0.16"
  );

  mainTl.to(
    cartBox,
    { rotation: -11, transformOrigin: "left bottom", duration: 0.38, ease: "back.out(2)" },
    "assemble+=0.45"
  );

  // STEP 3: "<|" TRANSITION WAVE (Pure Vertical Bar "|" Sweep & Color Inversion)
  mainTl.addLabel("waveSweep", "+=0.2");
  if (brandStage) mainTl.set(brandStage, { zIndex: 30 }, "waveSweep");

  for (let c = 0; c < cols; c++) {
    const colTiles = rawTiles.filter((t) => t.c === c).map((t) => t.el);
    mainTl.to(colTiles, { opacity: 1, duration: 0.16, ease: "power1.inOut" }, `waveSweep+=${(c * 0.022).toFixed(4)}`);
  }

  const staggerPerCol = 0.022;
  addWaveColorInversion(mainTl, container, cartBox, chars, cols, staggerPerCol);

  const fullCoverTime = 0.56;

  // IMPORTANT: Switch container to transparent so peeling reveals the green #hero section
  mainTl.set(container, { backgroundColor: "transparent" }, `waveSweep+=${fullCoverTime}`);
  mainTl.call(() => {
    container.classList.remove("bg-white");
    container.classList.add("bg-transparent");
    brandUnit.classList.add("is-inverted");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [], `waveSweep+=${fullCoverTime}`);

  // STEP 4: LEFT EDGE "<" CHEVRON EXIT PEEL
  const holdTime = fullCoverTime + 0.45;
  mainTl.addLabel("tileOut", `waveSweep+=${holdTime}`);

  mainTl.to(brandUnit, { scale: 0.9, opacity: 0, duration: 0.22, ease: "power2.in" }, "tileOut");
  mainTl.to(tilesLeftEdge, { opacity: 0, duration: 0.18, stagger: 0.0025, ease: "power1.inOut" }, "tileOut+=0.04");
  mainTl.call(() => { if (onTileOut) onTileOut(); }, [], "tileOut+=0.55");

  // STEP 5: HERO SECTION "IN" ENTRANCE TRANSITION
  animateHeroEntrance(mainTl, "tileOut");

  return mainTl;
}
