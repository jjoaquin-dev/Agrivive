# Hero Three-Part Layout (2026-10-30)

**What changed:** The landing hero is now left (existing headline, lede, both CTAs), centre (harvest basket cutout with a soft lime glow and shadow), right (the four existing labels as a vertical icon list). Below `lg` it stacks: text, basket, then a 2x2 label grid. Wording, colours, fonts and header are unchanged.

**Why:** Layout inspiration from a supplied reference image; only composition was borrowed.

**Files:**
- `web/src/components/sections/Hero.tsx` (layout, `features` list with lucide icons)
- `web/app/globals.css` (`.hero-title-line` size lowered to fit the left column)
- `web/src/lib/gsap/hero-entrance.ts` (`#hero-features > li` slide-in; `#hero-crate` id kept for the splash)

**Verification:** `bunx tsc --noEmit` clean; checked in browser at 1440 and 375 widths (no horizontal overflow). Not checked at tablet width or on a real device.

**Note:** The reference photo has a white background, so it was not reused; the existing `hero-basket.png` cutout stays as the centre image.
