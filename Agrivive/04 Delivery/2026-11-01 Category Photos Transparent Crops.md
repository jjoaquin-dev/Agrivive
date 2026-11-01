---
title: Category Photos Transparent Crops
type: delivery
date: 2026-11-01
status: complete
---

# Category Photos Transparent Crops

## What changed

- The Fruit, Root and Tuber crops were saved as JPEG, which dropped the transparency. The feathered edges of the original PNGs became solid rectangles, so the cards showed boxes.
- The crops are now made from the original PNGs and keep their alpha. They are saved as `web/public/categories/card/*.png`. The JPEG crops were removed.
- `HomeCategories.tsx` points at the PNG crops. The per-category sizes from the previous change still apply: Fruit and Tuber at 85%, Root at 112%.

## Affected files

- `web/src/features/home/components/HomeCategories.tsx`
- `web/public/categories/card/fruit-vegetables.png`, `root-vegetables.png`, `tuber-vegetables.png` (new; replace the `.jpg` crops)

## Verification

- `bun run typecheck` in `web/` passed.
- Checked in the preview at `http://localhost:3001/#categories`: the six images load and show without boxes. Not checked at desktop widths.
