---
title: Hero Video Pepper Removed
type: delivery
date: 2026-10-31
status: complete
---

# 2026-10-31 Hero Video Pepper Removed

## What changed

An orange bell pepper that falls out of the cart and rolls off the left edge (about 1.8–2.95 s) is removed from the hero video. Both files are rebuilt from the original download:

- `web/public/brand/hero-veggies.mp4`: H.264, no audio, 1280x720, 24 fps.
- `web/public/brand/hero-veggies.webm`: VP9 with alpha, same key as before.

## How it was removed

- Orange blob tracked in the lower-left region of each frame in the window.
- Mask: every non-white pixel within 30 px of that blob, dilated 3 px.
- OpenCV Telea inpainting (radius 15) on the affected frames only (26 frames).

## Known limits

- A faint pale smudge and some floor shadow are filled in around 2.25–2.5 s.
- Frames outside the window are unchanged.

## Verification

- Cropped frames at 1.9, 2.0, 2.25, 2.5, 2.75 and 3.0 s show no orange pepper.
- Both files decode.
- Not re-checked in the browser after this rebuild; the Hero code is unchanged.

## Related

- [[2026-10-31 Hero Video Transparent WebM]].
- [[2026-10-31 Hero Video Enlarged]].
