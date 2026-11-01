---
title: Hero Video Nudged Right
type: delivery
date: 2026-10-31
status: complete
---

# 2026-10-31 Hero Video Nudged Right

## What changed

The hero video moves further right on desktop. Offset from the content column: `lg:-right-4` (1024px and up) and `xl:-right-8` (1280px and up). A larger offset (`-right-10` / `-right-16`) clipped the cart at the right edge, so it was reduced.

## Files

- `web/src/components/sections/Hero.tsx`: video wrapper classes only.

## Verification

- Browser at 1440px emulation (pane scaled): the whole cart is visible, further right than the previous position.
- Typecheck was not re-run: only Tailwind class names changed.

## Related

- [[2026-10-31 Hero Video Top Right Multiply]].
