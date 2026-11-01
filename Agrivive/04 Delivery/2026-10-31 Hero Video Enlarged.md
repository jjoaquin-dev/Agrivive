---
title: Hero Video Enlarged
type: delivery
date: 2026-10-31
status: complete
---

# 2026-10-31 Hero Video Enlarged

## What changed

The hero video is a bit larger on desktop: `lg:w-[min(64vw,1120px)]`, up from `min(58vw,1000px)`. Its right offset is unchanged (`lg:-right-28` / `xl:-right-40`).

## Verification

- Measured at 1440px: the video box is 922px wide (663–1585px), 518px tall.
- Browser screenshot at 1440px (pane scaled): the cart is visible and larger. The right edge of the handle is clipped by the viewport.
- Typecheck not re-run: only a Tailwind class value changed.

## Related

- [[2026-10-31 Hero Video Transparent WebM]].
