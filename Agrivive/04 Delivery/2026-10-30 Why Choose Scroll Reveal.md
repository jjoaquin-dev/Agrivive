---
title: Why Choose Agrivive Scroll Reveal
type: delivery
date: 2026-10-30
status: code complete, manual reduced-motion check pending
---

# Why Choose Agrivive Scroll Reveal

## What changed

1. **Cards use the same fade and rise as the other blocks** (`web/src/features/home/components/HomeWhySurplus.tsx`): the four benefit cards were `data-reveal="pop"`, which also scaled from 0.96 with an overshoot ease and a separate 0.55 s duration. They now use plain `data-reveal`, so the heading, the transparency panel and the four cards share one 0.7 s fade and rise (`DURATIONS.block`, `EASINGS.SETTLE`). Cards that enter together stagger by 0.08 s.
2. **Hover zoom removed from card photos** (`web/src/features/home/components/HomeWhySurplusCard.tsx`): the photo inside each card no longer scales to 105% on hover. The `group` class, which only served that zoom, is removed too. The card's existing hover lift (`hover:-translate-y-1`) is unchanged.

The reveal wiring already existed: `Features.tsx` calls `useRevealOnScroll` on the landing container, and this section already marked its heading, panel and cards with `data-reveal`. This change only adjusts the card motion and removes the hover zoom. No text, fields, data or layout changed.

## Affected files

- `web/src/features/home/components/HomeWhySurplus.tsx`
- `web/src/features/home/components/HomeWhySurplusCard.tsx`

## Verification

- `bun run typecheck` in `web/`: passed, no errors.
- `bun run build` in `web/`: passed.
- Browser (dev server on port 3002, because port 3001 was already held by another process): the six `[data-reveal]` items start at opacity 0 with a 24px offset. Once scrolled into view they fade and rise in a stagger and finish about 1 s later. Inline styles are cleared afterwards, so the hover lift still works.
- Reduced motion: not run in a browser. `useRevealOnScroll` returns before hiding anything when `prefers-reduced-motion: reduce` matches, so the content stays visible. Check this with the OS setting turned on.

## Related

- Earlier task: [[2026-10-30 Landing Navbar and Sections Redesign]]
- Snapshot: [[00-LATEST]]
