---
title: Hero Video Pushed Far Right
type: delivery
date: 2026-10-31
status: complete
---

# 2026-10-31 Hero Video Pushed Far Right

## What changed

The hero video moves further right on desktop, bleeding off the viewport edge. Offsets: `lg:-right-20` (1024px and up) and `xl:-right-28` (1280px and up). Width is `lg:w-[min(58vw,1000px)]`, narrowed from 62vw so less of it is lost.

## Trade-off

At 1440px the right side of the cart is cut off by the viewport edge. Keeping the whole cart visible needs a smaller offset or a narrower video, so the user chose the edge-bleed look.

## Files

- `web/src/components/sections/Hero.tsx`: video wrapper classes only.

## Verification

- Browser at 1440px emulation (pane scaled): the cart is pushed right and clipped at the edge. Text is not covered.
- Typecheck not re-run: only Tailwind class names changed.

## Related

- [[2026-10-31 Hero Video Nudged Right]].
