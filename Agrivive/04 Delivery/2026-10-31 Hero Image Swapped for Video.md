---
title: Hero Image Swapped for Video
type: delivery
date: 2026-10-31
status: complete
---

# 2026-10-31 Hero Image Swapped for Video

## What changed

The landing hero's vegetable image is replaced by a looping, muted video of a shopping cart full of vegetables on white.

## Files

- `web/src/components/sections/Hero.tsx`: `next/image` replaced by a `<video>` with `autoPlay muted loop playsInline`. The old image is the poster. Reduced motion pauses the video on mount. Width is capped at 680px to match the column.
- `web/public/brand/hero-veggies.mp4`: copied from the user's download, audio stripped, H.264 1280x720, 10 s.

## Verification

- `bun run typecheck` in `web/` passed.
- Browser at 1024px: video loads and plays (`currentTime` advanced, not paused), and sits inside the hero column without overlapping the headline or CTAs.
- The 1440px emulated view looked clipped, but measuring at the pane's 1024px width showed the video inside the page. Not re-checked at 1440px or on phones.
- Reduced motion path and mobile layout not browser-checked.

## Related

- The earlier intro animation ([[2026-10-31 Surplus Veggies Intro Animation]]) was rejected by the user and is not used here.
- Previous hero work: [[2026-10-30 Hero Basket Green Redesign]].
