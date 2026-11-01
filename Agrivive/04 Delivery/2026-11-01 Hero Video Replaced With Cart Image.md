---
title: Hero Video Replaced With Cart Image
type: delivery
date: 2026-11-01
status: complete
---

# Hero Video Replaced With Cart Image

## What changed

- The landing hero's looping video is replaced with a still image of the vegetable shopping cart, `web/public/brand/hero-cart.png` (669 × 373).
- The image sits in the right column of the hero grid, vertically centred with the headline, and bleeds slightly past the right edge at large widths. It was previously pinned absolutely to the top right.
- The video-only code (the video ref and the reduced-motion pause) is removed from `Hero.tsx`. The video files `hero-veggies.mp4` and `hero-veggies.webm` are still in `web/public/brand` and are no longer used.

## Affected files

- `web/src/components/sections/Hero.tsx`
- `web/public/brand/hero-cart.png` (new)

## Verification

- `bun run typecheck` in `web/` passed.
- In the preview at 1024px wide, the image renders at about 457 × 255px, inside the hero right column.
- Not checked visually: the splash screen covers the page in the preview, so the layout was checked by measurement only. Mobile and wide desktop widths are not checked.
