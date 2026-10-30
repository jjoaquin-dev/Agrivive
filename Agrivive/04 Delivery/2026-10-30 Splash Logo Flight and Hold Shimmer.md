---
title: Splash Logo Flight and Hold Shimmer
type: delivery
date: 2026-10-30
---

# Splash Logo Flight and Hold Shimmer

## What changed
- The finished white logo now rests on the green frame for 1.2 s (`GREEN_HOLD`), with a 3% slow scale-up and a lime (`#E2FD56`) shimmer running through the letters.
- On exit the logo glides and shrinks onto the header logo, turning green on the way (0.75 s). The real header logo takes over on landing; then the overlay unmounts.
- If no `#header-logo` exists, the old fade-out is used.
- `.is-inverted` colour rules lost `!important` so inline tweens can change the colours. The header logo is hidden by `.splash-pending #header-logo` until the splash lands.

## Files
- `web/src/lib/gsap/splash-handoff.ts` (new)
- `web/src/lib/gsap/timelines.ts`
- `web/app/globals.css`
- `web/src/features/home/components/LandingHeader.tsx` (id `header-logo`)

## Verification
`bun run typecheck` in `web/` passed. Not checked in a browser. Total splash is about 4.4 s.
