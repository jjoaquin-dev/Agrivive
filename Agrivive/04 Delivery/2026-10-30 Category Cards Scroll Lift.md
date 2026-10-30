---
title: Category Cards Scroll Lift
type: delivery
date: 2026-10-30
---

# Category Cards Scroll Lift

## What changed
- "Our Popular Categories" cards now rise into place as the section scrolls into view, scrubbed to scroll position (reverses when scrolling up). Each column starts 12 px lower than the one before, so the row lifts as a wave. Reduced motion: no lift.
- New hook `useScrollLift(scopeRef, selector)`; `HomeCategories` became a client component and each card gets a `.category-lift` wrapper so reveal (li), lift (wrapper) and hover (Link) never share a transform.

## Files
`web/src/hooks/useScrollLift.ts` (new), `web/src/features/home/components/HomeCategories.tsx`

## Verification
`bun run typecheck` in `web/` passed. Not checked in a browser.
