---
title: Splash Pacing Three-Second Sequence
date: 2026-10-30
type: delivery-record
status: uncommitted
tags:
  - web
  - gsap
  - splash-screen
---

# Splash Pacing Three-Second Sequence

Recorded at 2026-10-30 10:00 PST.

## Objective

Make the splash feel premium rather than rushed, with each element recognizable, a short pause on the finished logo, and a smooth hand-off to the landing page. Target about 2.5 to 3 seconds in total. Keep the design, assets, colours, and the vegetable-to-cart animation unchanged.

## Implementation

File: `web/src/lib/gsap/timelines.ts`. Timing is now in real seconds (`speed` default `1`, previously `1.1`). Supersedes [[2026-10-30 Splash Timing and Wave Refinement]], which ran about 4 seconds.

| Stage | Time (s) | Change |
|---|---|---|
| Veggies drop | 0 to 0.76 | Each lands in 0.36, starts 0.2 apart (was 0.44 each, 0.28 apart). Cart squash is kept per landing. |
| Cart slide and wordmark | 1.01 to 1.71 | Slide 0.4, letters 0.42 with 0.028 stagger, cart tilt 0.32. |
| Pause on finished logo | 1.71 to 1.91 | New 0.2 hold before the wave. |
| Wave in | 1.91 to 2.42 | 0.018 column stagger, 0.2 fade, `power2.inOut`. |
| Exit | 2.46 to 3.04 | Logo fades 0.25. Edge tiles fade 0.2 with a 0.28 spread eased `power1.inOut`. The hero entrance starts with the exit. |

The overlay hands off at `tileOut+0.58`, after the last tile has finished fading, so the overlay does not vanish abruptly.

## Technical decisions

- Same animation library and architecture. No new dependencies.
- The exit begins as the last column lands. The green is the middle of one motion, not a stop.
- The 0.2 pause is the only added wait. Nothing delays site loading, because the splash is an overlay.
- Reduced motion and the once-per-tab-session rule are unchanged.

## Files modified

- `web/src/lib/gsap/timelines.ts`

## Validation

- `bun run typecheck` in `web/`: passed.
- Not run: browser playback. The total is arithmetic from the timeline values (about 3.04 s), not a measurement.

## Remaining issues

- Watch it in a browser, including a phone-sized viewport. Reduce `tileFade` or `staggerPerCol` for a faster wave, or raise them for a slower one.
