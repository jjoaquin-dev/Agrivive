---
title: Splash Bounce Restore and Veggie Order
type: delivery
date: 2026-10-30
---

# Splash Bounce Restore and Veggie Order

## What changed
- Restored the springy `elastic.out(1.15, 0.45)` letter entrance (now `EASINGS.BOUNCE`) and the cart's `back.out(2)` tilt. The motion harmonization pass had softened both to `back.out(1.6)`, which the owner read as the animation being removed.
- Veggie order now matches the owner's scene: left arc, right arc, then middle straight drop (was left, middle, right).
- Each landing is a heavy hit: deeper squash, rebound, springy wobble to rest (`heavyHit` in `timelines.ts`).
- Wave starts at `assemble+1.1` so the bouncy wordmark finishes first.

## Owner's splash scene (reference)
Cart centered; left and right veggies arc in, then the middle one drops; the cart shakes on each like heavy rocks; cart slides slightly left; Agrivive letters bounce in; green tile wave left to right shaped `<|`; cart and letters turn white as the wave hits; hold 1.2 s; transition into the landing page.

## Files
- `web/src/lib/gsap/timelines.ts`
- `web/src/lib/gsap/easings.ts`

## Verification
`bun run typecheck` in `web/` passed. Not checked in a browser.
