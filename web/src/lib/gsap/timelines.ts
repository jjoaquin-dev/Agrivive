import gsap from "gsap";
import type { SplashTimelineOptions } from "@/src/types/animation";
import { createSplashGrid } from "./splash-grid";
import { setupHeroInitialStates, animateHeroEntrance } from "./hero-entrance";
import { addWaveColorInversion } from "./wave-inversion";
import { EASINGS } from "./easings";
import { addLogoFlight, addLogoHold } from "./splash-handoff";

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

  // STEP 1: VEGGIES DROP IN — LEFT (arc), RIGHT (arc), THEN MIDDLE (straight down)
  // Each landing hits the cart like a heavy rock: a deep squash, a rebound, then a springy wobble to rest.
  const heavyHit = (tilt: number) => ({
    keyframes: [
      { y: 14, rotation: tilt, scaleX: 1.12, scaleY: 0.86, duration: 0.07, ease: "power2.out" },
      { y: -6, rotation: -tilt * 0.7, scaleX: 0.96, scaleY: 1.05, duration: 0.07, ease: "power1.out" },
      { y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: 0.26, ease: EASINGS.BOUNCE },
    ],
  });

  // Pacing: each veggie lands, the cart finishes its wobble, then the next one arrives
  const VEG_ARC = 0.62; // left and right arcs
  const VEG_DROP = 0.55; // middle straight drop
  const V3_AT = 0.44; // right veggie launches
  const V2_AT = 0.9; // middle veggie launches

  if (v1) {
    mainTl.set(v1, { opacity: 1 }, "v1");
    mainTl.to(v1, { x: 0, rotation: -6, duration: VEG_ARC, ease: "power1.out" }, "v1");
    mainTl.to(v1, { y: 0, duration: VEG_ARC, ease: "power2.in" }, "v1");
  }
  mainTl.to(cartSvg, heavyHit(-3.5), `v1+=${VEG_ARC - 0.02}`);

  if (v3) {
    mainTl.set(v3, { opacity: 1 }, `v1+=${V3_AT}`);
    mainTl.to(v3, { x: 0, rotation: 6, duration: VEG_ARC, ease: "power1.out" }, `v1+=${V3_AT}`);
    mainTl.to(v3, { y: 0, duration: VEG_ARC, ease: "power2.in" }, `v1+=${V3_AT}`);
  }
  mainTl.to(cartSvg, heavyHit(4), `v1+=${V3_AT + VEG_ARC - 0.02}`);

  if (v2) {
    mainTl.set(v2, { opacity: 1 }, `v1+=${V2_AT}`);
    mainTl.to(v2, { y: 0, rotation: 0, duration: VEG_DROP, ease: "power2.in" }, `v1+=${V2_AT}`);
  }
  mainTl.to(cartSvg, heavyHit(0), `v1+=${V2_AT + VEG_DROP - 0.02}`);

  // STEP 2: CART SLIDES LEFT, WHEELS ROLL, AGRIVIVE ENTERS, CART TILTS (-11°)
  mainTl.to(cartBox, { x: 0, duration: 0.4, ease: EASINGS.GLIDE }, "assemble");
  mainTl.to(
    container.querySelectorAll(".cart-wheel"),
    { rotation: -360, transformOrigin: "center center", duration: 0.4, ease: EASINGS.GLIDE },
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
      ease: EASINGS.BOUNCE,
    },
    "assemble+=0.16"
  );

  mainTl.to(
    cartBox,
    { rotation: -11, transformOrigin: "left bottom", duration: 0.38, ease: "back.out(2)" },
    "assemble+=0.45"
  );

  // STEP 3: "<|" TRANSITION WAVE (Pure Vertical Bar "|" Sweep & Color Inversion)
  // The bouncy wordmark finishes at about assemble+0.92; a short beat on the finished logo, then the wave
  mainTl.addLabel("waveSweep", "assemble+=1.1");
  if (brandStage) mainTl.set(brandStage, { zIndex: 30 }, "waveSweep");

  // Wave in: each column fades with a soft inOut, so the green reads as one smooth sweep rather than a flicker
  const staggerPerCol = 0.018;
  const tileFade = 0.2;
  for (let c = 0; c < cols; c++) {
    const colTiles = rawTiles.filter((t) => t.c === c).map((t) => t.el);
    mainTl.to(colTiles, { opacity: 1, duration: tileFade, ease: EASINGS.GLIDE }, `waveSweep+=${(c * staggerPerCol).toFixed(4)}`);
  }
  addWaveColorInversion(mainTl, container, cartBox, chars, cols, staggerPerCol);

  const fullCoverTime = (cols - 1) * staggerPerCol + tileFade;

  // IMPORTANT: Switch container to transparent so peeling reveals the green #hero section
  mainTl.set(container, { backgroundColor: "transparent" }, `waveSweep+=${fullCoverTime}`);
  mainTl.call(() => {
    container.classList.remove("bg-white");
    container.classList.add("bg-transparent");
    brandUnit.classList.add("is-inverted");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [], `waveSweep+=${fullCoverTime}`);

  // STEP 4: LEFT EDGE "<" CHEVRON EXIT PEEL
  // Stop on the green frame with the white logo for 1.2 seconds, then peel out
  const GREEN_HOLD = 1.2;
  const holdTime = fullCoverTime + GREEN_HOLD;
  addLogoHold(mainTl, brandUnit, chars, fullCoverTime, GREEN_HOLD);
  mainTl.addLabel("tileOut", `waveSweep+=${holdTime}`);

  // The logo flies into the header while the tiles peel; without a header logo it just fades
  const FLIGHT = 0.75;
  const flew = addLogoFlight(mainTl, container, brandUnit, chars, "tileOut", FLIGHT);
  if (!flew) mainTl.to(brandUnit, { scale: 0.94, opacity: 0, duration: 0.25, ease: "power2.inOut" }, "tileOut");
  // Wave out: mirrors the wave in (same inOut feel), peeling from the left edge as a chevron
  // stagger.ease spreads the start times slow-fast-slow, so the peel accelerates and settles instead of ticking
  mainTl.to(tilesLeftEdge, { opacity: 0, duration: 0.2, stagger: { amount: 0.28, ease: "power1.inOut" }, ease: "power2.inOut" }, "tileOut+=0.06");
  // Overlay stops catching clicks as the peel starts; onTileOut fires once the last tile has faded
  mainTl.set(container, { pointerEvents: "none" }, "tileOut");
  // Unmount only after the logo has landed
  mainTl.call(() => { if (onTileOut) onTileOut(); }, [], flew ? `tileOut+=${(0.1 + FLIGHT + 0.02).toFixed(2)}` : "tileOut+=0.58");

  // STEP 5: HERO SECTION "IN" ENTRANCE TRANSITION
  animateHeroEntrance(mainTl, "tileOut", flew ? 0.4 : 0.04);

  return mainTl;
}
