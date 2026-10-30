---
title: Hero Decluttered with Line Art
type: delivery
date: 2026-10-30
status: code complete, browser check done at desktop width
---

# Hero Decluttered with Line Art

## What changed

- **Floating pieces cut from 12 to 5.** `web/src/components/sections/HeroFloatingSlices.tsx`:
  - Three photographs: a tomato wheel top left, a whole tomato slice top right, and a yellow pepper slice lower right.
  - Two line drawings from `HeroOutlineArt.tsx`: a carrot pair lower left and a cabbage middle right, in the lime line-art style.
  - The two top photographs show only from the extra-large breakpoint (1280px and up), so they never sit behind the headline. Below 768px no pieces show, which keeps the phone layout clear.
  - The blurred lime glows behind the pieces are removed.
- **Contour lines removed.** The topographic SVG behind the hero is gone from `web/src/components/sections/Hero.tsx`, which cuts the background noise.
- **Entrance animation targets updated.** `web/src/lib/gsap/hero-entrance.ts` now animates `.hero-slice-art` (the photograph or line drawing itself) instead of `.hero-slice img`, so line drawings and photographs enter the same way.

## Why

- The owner asked for a hero that is less crowded, with interesting, premium images and illustrations.
- Fewer, larger pieces give the headline and the crate photograph room to lead.
- Line drawings add a second visual language that reads as illustration, in the hero's lime accent.
- Law of Prägnanz (Gestalt): a simpler composition reads faster.
- Von Restorff (isolation): one photograph per corner stands out because the others are quiet.

## Fields and behavior

- Headline, subtitle, both buttons, the crate photograph and the parallax and bobbing motion are unchanged. The GSAP entrance sequence keeps its timing.

## Verification

- `bun run typecheck` in `web/` passed.
- Checked in the built-in browser at 1440px: the five pieces show, the headline has clear space, and the crate photograph stays the focal point.
- Checked at 977px: the top photographs stay hidden, and the line drawings sit clear of the headline.
- The design-taste lint still flags existing hero styling (photo drop shadows, the glass seller button, the backdrop blur). That styling was kept on purpose, so the lint was not applied.
- Not checked: a phone-width screenshot and reduced motion.
