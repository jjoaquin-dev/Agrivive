---
title: Hero Video Floor Patch Attempts
type: delivery
date: 2026-10-31
status: partial
---

# 2026-10-31 Hero Video Floor Patch Attempts

## Goal

Remove the pale floor patches left after the pepper was removed from the hero video (about 2.0–2.5 s).

## Attempts

1. Clean-floor plate from frame 1.0 s, with a rectangular search area: a visible seam at x=345 appeared, from the cart's wheel shadow.
2. Plate limited to pixels within 40 px of the pepper core: patches still visible, pure-white where the real floor is shaded.
3. Plate brightness-matched to the surrounding ring: patch still visible with a sharp edge.
4. Normalised Gaussian fill from the surrounding floor (sigma 12): faint blotches remain at about 2.0, 2.25 and 2.5 s, lighter than the shaded floor.

Attempt 4 is the file currently in `web/public/brand/`.

## Status

Partial. The pepper is removed. Faint floor blotches remain. Further options: a manual mask over the blotches, or regenerating the source clip without the pepper.

## Verification

- Cropped frames at 1.9–2.5 s.
- Both files decode at 240 frames.
- Browser check not repeated; the Hero code is unchanged.

## Related

- [[2026-10-31 Hero Video Pepper Removed]].
- [[2026-10-31 Hero Video Pepper Smudge Fix]].
