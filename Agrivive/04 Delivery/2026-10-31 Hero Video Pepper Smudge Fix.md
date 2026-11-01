---
title: Hero Video Pepper Smudge Fix
type: delivery
date: 2026-10-31
status: complete
---

# 2026-10-31 Hero Video Pepper Smudge Fix

## What changed

The pale ghost left by the earlier pepper removal is reduced. Both files are rebuilt from the original download:

- `web/public/brand/hero-veggies.mp4`: H.264, no audio, 1280x720, 24 fps, 240 frames.
- `web/public/brand/hero-veggies.webm`: VP9 with alpha, same key as before.

## How it was fixed

- The floor is taken from frame 1.0 s, before the pepper leaves the cart.
- In the window (1.8–2.95 s), pixels that differ from that floor by more than 18 levels, and that sit within 40 px of the pepper's orange core, are blended with the floor (Gaussian feather, sigma 1.5).
- Only components touching the pepper are used, so the broccoli, carrots and cart stay as they were.

## Tried and rejected

- A rectangular search area on the floor gave a visible seam at x=345, where the cart's wheel shadow starts.

## Known limits

- Two faint pale patches on the floor around 2.0 and 2.25 s are slightly brighter than the surrounding floor.
- Browser check not repeated. The Hero code is unchanged.

## Related

- [[2026-10-31 Hero Video Pepper Removed]].
