---
title: Hero Video Floor Blotches Lightened
type: delivery
date: 2026-10-31
status: partial
---

# 2026-10-31 Hero Video Floor Blotches Lightened

## What changed

Pale floor blotches left after the pepper removal are lightened in frames 1.83–2.67 s. The lower floor strip (x 0–330, y 610–720) is replaced, where it is brighter than its local median, with that median. Shaded floor is darker than its median, so it is left as is.

Both files are re-encoded from the previous hero files:

- `web/public/brand/hero-veggies.mp4`: H.264, CRF 16, no audio.
- `web/public/brand/hero-veggies.webm`: VP9 with alpha, re-keyed from the same frames.

## Limits

- Two faint residual patches remain near 2.0 s (bottom centre) and 2.25 s (bottom left). They are pinkish or grey and much less visible than before.
- The MP4 is encoded twice (once in the earlier fix, once here), which adds a little compression softness.
- Browser check not repeated. The Hero code is unchanged.

## Related

- [[2026-10-31 Hero Video Floor Patch Attempts]].
- [[2026-10-31 Hero Video Pepper Removed]].
