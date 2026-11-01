---
title: Category Photo Sizes Adjusted
type: delivery
date: 2026-11-01
status: complete
---

# Category Photo Sizes Adjusted

## What changed

- Fruit Vegetables and Tuber Vegetables images are scaled to 85% inside their cards.
- Root Vegetables is scaled to 112%. Its crop is already centred, so it sits in the middle of the card.
- The sizes are per-category `imageScale` values on a wrapper, so the hover zoom on each image still works.

## Open question

- The screenshot the user sent shows cutout versions of these images, with the backgrounds removed. The repo only has the photos with coloured backdrops (`web/public/categories/card/*.jpg`). The cutouts are not in the repo. The sizes above apply to the photos on the page.

## Affected files

- `web/src/features/home/components/HomeCategories.tsx`

## Verification

- `bun run typecheck` in `web/` passed.
- Checked in the preview at `http://localhost:3001/#categories`. Not checked at desktop widths.
