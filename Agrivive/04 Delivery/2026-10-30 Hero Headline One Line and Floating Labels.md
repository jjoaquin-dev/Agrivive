---
title: Hero Headline One Line and Floating Labels
date: 2026-10-30
type: delivery
status: done
---

# Hero Headline One Line and Floating Labels

## What changed

- Headline: "Rescue Surplus Vegetables" sits on one line from 1024px up; "in Davao City" sits on the line below. Phones still wrap. The page's existing `.hero-title-line` rule now applies, so the headline is 56px at most on desktop (it was 76px).
- Basket: narrower, max 680px on phones and tablets, 780px from 1024px up (was up to 1152px).
- Floating labels: four pills from the reference, "Rescue Vegetables", "Surplus Produce", "24-hour QR code", "Help Local Sellers", placed around the basket. They show from 768px up and are hidden on phones.

The labels are new copy. The owner asked for them in this turn, so the earlier decision to omit them was reversed.

## Affected files

- `web/src/components/sections/Hero.tsx`

## Verification

- `bun run typecheck` in `web/`: passed.
- Browser check on the dev server at port 3002, desktop width: one-line headline, smaller basket, all four labels visible. The "24-hour QR code" label sits just below the first screen.
- Phone check from the previous turn still applies; labels are hidden there.
- Not run: production build, reduced-motion check, tablet width.

## Commit

Not committed.
