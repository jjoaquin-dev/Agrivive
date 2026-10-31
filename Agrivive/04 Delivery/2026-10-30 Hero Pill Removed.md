---
title: Hero Pill Removed
type: delivery
date: 2026-10-30
status: code complete, browser check done on the home page
---

# Hero Pill Removed

## What changed

- Removed the "Davao City Farms & Public Market Stalls" pill above the hero headline from `web/src/components/sections/Hero.tsx`, and its unused `MapPin` import.
- Removed the pill's entrance animation (the `#hero-eyebrow` set and tween) from `web/src/lib/gsap/hero-entrance.ts`.

## Why

- The owner asked to remove the pill after the hero was restored to the last commit. An earlier snapshot had already recorded the pill as removed.

## Fields and behavior

- No other hero content changed. The headline, subtitle, both buttons, the produce slices and the crate photo are unchanged.

## Verification

- `bun run typecheck` in `web/` passed.
- No remaining references to `hero-eyebrow` or `MapPin` in the hero files.
- The home page at `localhost:3001` renders without the pill. The headline now sits slightly lower because its top margin remains.
- Not checked: reduced motion, phone width, and the entrance sequence.
