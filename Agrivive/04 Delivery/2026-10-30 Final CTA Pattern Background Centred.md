---
title: Final CTA Pattern Background Centred
date: 2026-10-30
type: delivery
status: done
---

# Final CTA Pattern Background Centred

## What changed

- The "Start Shopping Today's Surplus" card uses the uploaded green vegetable line pattern as its background (`/brand/final-cta-pattern.webp`).
- The harvest photograph on the right is removed, along with its image import.
- Heading, sentence, search bar, popular-search chips and the trust row with the catalogue link are centred in one column. The layout is no longer a two-column grid.
- Search, category selection, popular-search buttons and links keep their behaviour and labels.

## Affected files

- `web/src/features/home/components/HomeFinalCta.tsx`
- `web/public/brand/final-cta-pattern.webp` (new, copy of the uploaded pattern)

## Verification

- `bun run typecheck` in `web/`: passed.
- Browser check on the dev server at port 3002, desktop width: pattern background visible, content centred, all rows on one column.
- Not run: phone and tablet widths, production build, search submit.

## Commit

Not committed.
