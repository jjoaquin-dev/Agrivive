---
title: Hero Video Transparent WebM
type: delivery
date: 2026-10-31
status: complete
---

# 2026-10-31 Hero Video Transparent WebM

## What changed

The hero video's white background is removed in the file itself, not just hidden by blending. The white is keyed out to alpha in `web/public/brand/hero-veggies.webm` (VP9, yuva420p, 1280x720, 24 fps, 240 frames). The hero plays the WebM first and falls back to the MP4. The video is moved further right on desktop: `lg:-right-28` and `xl:-right-40`.

## How the key works

- Alpha comes from the pixel's smallest RGB channel: at or above 240 is background (transparent), at or below 200 is subject (opaque), with a linear ramp between.
- Edge colours are un-mixed against white to avoid a white halo.

## Known limits

- Thin light-grey chrome wires pick up a faint halo, because they are close to white.
- The pale floor shadow under the cart stays as a light patch.
- Safari plays the MP4 fallback, which has no alpha. The multiply blend still hides its white.

## Files

- `web/public/brand/hero-veggies.webm`: new.
- `web/src/components/sections/Hero.tsx`: `<source>` WebM then MP4; wrapper offsets.

## Verification

- Keyed frame composited over magenta: background gone, cart and vegetables intact, halo on the chrome wires.
- `bun run typecheck` in `web/` passes.
- Browser at 1440px emulation: the WebM plays (`currentSrc` ends in `.webm`), and the background is gone.
- Not checked: Safari and Firefox playback, reduced motion, phone widths.

## Related

- [[2026-10-31 Hero Video Pushed Far Right]].
