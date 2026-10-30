---
title: Hero Basket Green Redesign
date: 2026-10-30
type: delivery
status: done
---

# Hero Basket Green Redesign

## What changed

The landing hero now follows the uploaded reference: a solid green field, the headline, sentence and both CTAs centred, and the vegetable basket photograph below them. The floating tomato, pepper, carrot and cabbage pieces are removed.

- Headline, sentence, "Shop Today's Harvest" and "Get the Seller App" are unchanged in wording and bindings. The seller app button now uses a thin outline instead of the frosted glass fill.
- The hero image is a cutout of the uploaded basket photograph: the white background is made transparent and the picture is cropped to the produce. Alt text describes what is shown.
- The reference's floating label chips ("Rescue Vegetables", "Surplus Produce", "24-hour QR code", "Help Local Sellers") are not added. They would introduce new copy, and the brief asked to keep the existing copy.
- Desktop scroll drift and resting bob on the slices are removed with the slices.

## Why

The owner asked to copy the second uploaded reference's style and to keep the existing copy and CTAs. Per the design-replication rule, only design was copied; no fields or copy were added or renamed.

## Affected files

- `web/src/components/sections/Hero.tsx` (rewritten)
- `web/src/lib/gsap/hero-entrance.ts` (slice entrance and initial state removed)
- `web/src/components/sections/HeroFloatingSlices.tsx` (deleted, no remaining imports)
- `web/src/components/sections/HeroOutlineArt.tsx` (deleted, only used by the removed slices)
- `web/public/brand/hero-basket.png` (new, transparent cutout)
- `web/public/brand/hero-basket-raw.webp` (new, copy of the uploaded source)

## Verification

- `bun run typecheck` in `web/`: passed (no output from `tsc --noEmit`).
- Browser check on the dev server at port 3002: desktop 1440 and phone 375. Copy and both CTAs are centred, the basket sits under them, and the phone layout stacks without horizontal scroll.
- Not run: `bun run build`, reduced-motion check, tablet width.
- The dev server was stopped after the check.

## Commit

Not committed.
