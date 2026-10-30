---
title: Splash Timing and Wave Refinement
date: 2026-10-30
type: delivery-record
status: uncommitted
tags:
  - web
  - gsap
  - splash-screen
---

# Splash Timing and Wave Refinement

## Objective

The splash felt rushed: the wordmark was covered before it could be read, and the green wave looked too fast. Make the splash slower and smoother, with an in-out feel.

## Implementation

File: `web/src/lib/gsap/timelines.ts`.

- Timeline speed: `1.4` to `1.1`. Supersedes the timing notes in [[2026-10-30 Splash Screen Refinement]], which describe the old `1.4`.
- Wave start: `assemble+0.7` to `assemble+1`, after the wordmark settles.
- Wave in: column stagger `0.022` to `0.038`; each column fades `0.16` to `0.28` with `power2.inOut`.
- Full-cover time is now computed from the stagger and fade values, so the logo colour flip stays in step with the wave.
- Green hold: `0.3` to `0.2` after full cover.
- Logo exit: `0.22` to `0.3` with `power2.inOut` (scale `0.9` to `0.92`).
- Wave out: edge tiles fade `0.18` to `0.3`, stagger `0.0025` to `0.004`, `power2.inOut`, starting at `tileOut+0.08`.
- Overlay hand-off (`onTileOut`): `tileOut+0.7` to `tileOut+1.1`.

## Technical decisions

- Keep the existing veggie-to-cart concept and tile grid. Only timing and easing change.
- Use the same ease on the wave in and out so the motion reads as one sweep.
- Keep the Skip button behaviour unchanged.

## Files modified

- `web/src/lib/gsap/timelines.ts`

## Validation

- `bun run typecheck` in `web/`: passed.
- Not run: browser playback. The duration below is estimated from the timeline arithmetic, not measured.
- Estimated total splash length: about 4.1 s, up from about 3.5 s after the speed change and about 2.5 s before it.

## Remaining issues

- Not watched in a browser. Adjust `speed` (`1.1` to `1.25` tightens everything evenly) or `staggerPerCol` (wave in) if it still feels off.
- Confirm the in-out feel on a phone-sized viewport.
