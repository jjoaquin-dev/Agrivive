---
title: Hero Video Floor Boxes Refilled
type: delivery
date: 2026-10-31
status: partial
---

# 2026-10-31 Hero Video Floor Boxes Refilled

## What changed

Two boxes on the floor are refilled from the surrounding floor, with feathered edges, in the hero video:

- Frames 1.92–2.08 s: x 228–328, y 640–706. Targets the pinkish smear left of the cart wheel.
- Frames 2.17–2.38 s: x 190–265, y 688–720. Targets the bottom-left blotch.

Pixels in the refill source that are pinkish (red minus green above 6) or darker than 200 are excluded, so the fill is taken from clean floor only.

Both files are re-encoded from the previous hero files:

- `web/public/brand/hero-veggies.mp4`: H.264, CRF 14, no audio.
- `web/public/brand/hero-veggies.webm`: VP9 with alpha, re-keyed from the same frames.

## Limits

- A grey smear remains around x 255–315, y 660–690 at 2.0 s. It is part of the wheel shadow and is included in the fill.
- A faint lighter block with an edge near x 245 remains at the bottom at 2.25 s.
- Third encode of the MP4, so some softness is cumulative.
- Browser check not repeated. The Hero code is unchanged.

## Recommended next step

Regenerate the source clip without the pepper, then run the key once. That removes the need for these patches.

## Related

- [[2026-10-31 Hero Video Floor Blotches Lightened]].
- [[2026-10-31 Hero Video Floor Patch Attempts]].
