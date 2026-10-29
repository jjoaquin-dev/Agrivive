import gsap from "gsap";
import { EASINGS } from "./easings";
import type { SplashTimelineOptions } from "@/src/types/animation";

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
  const v1 = container.querySelector<HTMLElement>("#v1");
  const v2 = container.querySelector<HTMLElement>("#v2");
  const v3 = container.querySelector<HTMLElement>("#v3");
  const brandStage = container.querySelector<HTMLElement>("#brand-stage");
  const brandUnit = container.querySelector<HTMLElement>("#brand-unit");
  const chars = container.querySelectorAll<HTMLElement>(".char");
  const tileGrid = container.querySelector<HTMLElement>("#tile-grid");

  if (!cartBox || !brandUnit || !tileGrid) {
    return mainTl;
  }

  // 1. Initial State Setup
  gsap.set(cartBox, { scale: 0.8, opacity: 0, transformOrigin: "center bottom" });
  if (v1) gsap.set(v1, { y: -140, rotation: -28, opacity: 0 });
  if (v2) gsap.set(v2, { y: -170, rotation: 22, opacity: 0 });
  if (v3) gsap.set(v3, { y: -130, rotation: -18, opacity: 0 });
  gsap.set(chars, { y: 45, opacity: 0, scale: 0.85, rotation: 4 });

  // Clear any existing tiles and generate fresh 18x10 grid
  tileGrid.innerHTML = "";
  const cols = 18;
  const rows = 10;
  const rawTiles: { r: number; c: number; el: HTMLDivElement }[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tileGrid.appendChild(tile);
      rawTiles.push({ r, c, el: tile });
    }
  }

  // Sort tiles for Left Edge "<" exit peel (center row exits first)
  const tilesLeftEdge = [...rawTiles]
    .sort((a, b) => {
      const centerR = (rows - 1) / 2;
      const distA = Math.abs(a.r - centerR);
      const distB = Math.abs(b.r - centerR);
      const orderA = a.c + distA * 0.45;
      const orderB = b.c + distB * 0.45;
      return orderA - orderB;
    })
    .map((t) => t.el);

  // =================================================================
  // PHASE 1: PHYSICS ASSEMBLY
  // =================================================================
  mainTl.addLabel("assemble", 0.05);

  // Cart scales in
  mainTl.to(
    cartBox,
    {
      scale: 1,
      opacity: 1,
      duration: 0.42,
      ease: EASINGS.SPRING,
    },
    "assemble"
  );

  // Veggies drop into cart
  if (v1) {
    mainTl.to(
      v1,
      {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.52,
        ease: EASINGS.ELASTIC,
      },
      "assemble+=0.08"
    );
  }

  if (v2) {
    mainTl.to(
      v2,
      {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.58,
        ease: EASINGS.ELASTIC,
      },
      "assemble+=0.13"
    );
  }

  if (v3) {
    mainTl.to(
      v3,
      {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.48,
        ease: EASINGS.ELASTIC,
      },
      "assemble+=0.18"
    );
  }

  // Letters cascade in
  mainTl.to(
    chars,
    {
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.5,
      stagger: 0.035,
      ease: EASINGS.ELASTIC,
    },
    "assemble+=0.16"
  );

  // Cart playful tilt
  mainTl.to(
    cartBox,
    {
      rotation: -11,
      transformOrigin: "left bottom",
      duration: 0.38,
      ease: EASINGS.POP,
    },
    "assemble+=0.45"
  );

  // =================================================================
  // PHASE 2: "<|" TRANSITION WAVE (Solid Green Tile Sweep)
  // =================================================================
  mainTl.addLabel("waveSweep", "+=0.2");

  if (brandStage) {
    mainTl.set(brandStage, { zIndex: 30 }, "waveSweep");
  }

  // Pure vertical bar "|" sweep
  for (let c = 0; c < cols; c++) {
    const colTiles = rawTiles.filter((t) => t.c === c).map((t) => t.el);
    mainTl.to(
      colTiles,
      {
        opacity: 1,
        duration: 0.16,
        ease: EASINGS.ACCEL_DECEL,
      },
      `waveSweep+=${(c * 0.022).toFixed(4)}`
    );
  }

  // Coordinate-matched color switch to white
  const colWidth = (typeof window !== "undefined" ? window.innerWidth : 1200) / cols;
  const staggerPerCol = 0.022;

  const cartRect = cartBox.getBoundingClientRect();
  const cartCol = Math.max(0, Math.min(cols - 1, cartRect.left / colWidth));
  const cartWaveHit = cartCol * staggerPerCol;

  mainTl.to(
    container.querySelectorAll("#cart-box .cart-fill, #cart-box .veggie-fill"),
    { fill: "#ffffff", duration: 0.18, ease: EASINGS.SMOOTH },
    `waveSweep+=${cartWaveHit.toFixed(3)}`
  );

  mainTl.to(
    container.querySelectorAll("#cart-box .cart-stroke, #cart-box .veggie-stroke"),
    { stroke: "#ffffff", duration: 0.18, ease: EASINGS.SMOOTH },
    `waveSweep+=${cartWaveHit.toFixed(3)}`
  );

  mainTl.to(
    container.querySelectorAll("#cart-box .accent-cut, #cart-box .veggie-cutout"),
    { stroke: "#457D00", duration: 0.18, ease: EASINGS.SMOOTH },
    `waveSweep+=${cartWaveHit.toFixed(3)}`
  );

  mainTl.to(
    container.querySelectorAll("#cart-box .cart-wheel"),
    { fill: "#457D00", stroke: "#ffffff", duration: 0.18, ease: EASINGS.SMOOTH },
    `waveSweep+=${cartWaveHit.toFixed(3)}`
  );

  chars.forEach((charEl) => {
    const r = charEl.getBoundingClientRect();
    const col = Math.max(0, Math.min(cols - 1, r.left / colWidth));
    const hitTime = col * staggerPerCol;
    mainTl.to(
      charEl,
      { color: "#ffffff", duration: 0.16, ease: EASINGS.SMOOTH },
      `waveSweep+=${hitTime.toFixed(3)}`
    );
  });

  const fullCoverTime = 0.56;

  mainTl.call(
    () => {
      brandUnit.classList.add("is-inverted");
    },
    [],
    `waveSweep+=${fullCoverTime}`
  );

  // =================================================================
  // PHASE 3 & 4: CHEVRON EXIT PEEL ("<")
  // =================================================================
  const holdTime = fullCoverTime + 0.45;
  mainTl.addLabel("tileOut", `waveSweep+=${holdTime}`);

  mainTl.to(
    brandUnit,
    {
      scale: 0.9,
      opacity: 0,
      duration: 0.22,
      ease: "power2.in",
    },
    "tileOut"
  );

  // Left edge "<" peels tiles away
  mainTl.to(
    tilesLeftEdge,
    {
      opacity: 0,
      duration: 0.18,
      stagger: 0.0025,
      ease: EASINGS.ACCEL_DECEL,
    },
    "tileOut+=0.04"
  );

  mainTl.call(
    () => {
      if (onTileOut) onTileOut();
    },
    [],
    "tileOut+=0.55"
  );

  return mainTl;
}
