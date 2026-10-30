---
title: Hero Label Arrangement Matched to Reference
date: 2026-10-30
type: delivery
status: done
---

# Hero Label Arrangement Matched to Reference

## What changed

- The basket now takes 72% of the hero width from 768px up. It was 100% of a 680–780px box.
- The four floating labels are placed as in the owner's reference screenshot: "Rescue Vegetables" top left, "Surplus Produce" top right, "24-hour QR code" bottom left, "Help Local Sellers" right. Some labels sit beyond the basket's edges, as in the reference.
- Labels are positioned against the basket's own box, so they stay in place as the width changes.

## Affected files

- `web/src/components/sections/Hero.tsx`

## Verification

- `bun run typecheck` in `web/`: passed.
- Browser check on the dev server at port 3002, desktop width: arrangement matches the reference.
- Not run: phone and tablet widths (labels are hidden below 768px), production build, reduced-motion check.

## Commit

Not committed.
