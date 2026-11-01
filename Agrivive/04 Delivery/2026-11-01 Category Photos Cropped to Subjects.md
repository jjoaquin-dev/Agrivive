---
title: Category Photos Cropped to Subjects
type: delivery
date: 2026-11-01
status: complete
---

# Category Photos Cropped to Subjects

## What changed

- Fruit, Root, and Tuber category images are photographs with a coloured backdrop, not cutouts. Their subjects reached the photo edges, so they looked cut inside the cards.
- Each of the three photos is cropped to its subject, with a margin, and saved as `web/public/categories/card/*.jpg`. The originals are kept.
- Root Vegetables is no longer offset or scaled, because the crop centres it.
- All six category images use `p-1` padding with `object-contain`. Leafy Greens, Pod, and Bulb are still cutouts.

## Affected files

- `web/src/features/home/components/HomeCategories.tsx`
- `web/public/categories/card/fruit-vegetables.jpg`, `root-vegetables.jpg`, `tuber-vegetables.jpg` (new)

## Trade-off

- The three photo tiles look like rectangles on the card, while the other three are cutouts. A matching cutout of each photo would need a separate background removal, which is not reliable for these backdrops.

## Verification

- `bun run typecheck` in `web/` passed.
- Checked in the preview at `http://localhost:3001/#categories`: all six images show whole.
