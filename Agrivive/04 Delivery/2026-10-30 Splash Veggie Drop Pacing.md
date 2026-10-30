---
title: Splash Veggie Drop Pacing
type: delivery
date: 2026-10-30
---

# Splash Veggie Drop Pacing

## What changed
Slowed the veggie phase about 40% at the owner's request (`web/src/lib/gsap/timelines.ts`):
- Left and right arcs: 0.44 s → 0.62 s (`VEG_ARC`). Middle drop: 0.38 s → 0.55 s (`VEG_DROP`).
- Launches 0.44 s apart (`V3_AT` 0.44, `V2_AT` 0.9), so each cart wobble finishes before the next veggie lands.
- Landings at about 0.6, 1.04 and 1.43 s. The splash is about 0.45 s longer overall.

## Verification
`bun run typecheck` in `web/` passed. Not checked in a browser.
