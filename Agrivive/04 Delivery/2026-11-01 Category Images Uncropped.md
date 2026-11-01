---
title: Category Images Uncropped
type: delivery
date: 2026-11-01
status: complete
---

# Category Images Uncropped

## What changed

- The six home category images now fill their card area with `fill` and `object-contain` and a small padding, so no part of an image is cut. Before, a fixed square box with a percentage width could clip the produce.
- Root Vegetables is larger and sits a little further left. The size and offset are set on a wrapper with `imageOffset`, so the hover zoom on the image itself still works.

## Affected files

- `web/src/features/home/components/HomeCategories.tsx`

## Verification

- `bun run typecheck` in `web/` passed.
- Checked in the preview at `http://localhost:3001/#categories`: all six images show whole in the grid at a narrow viewport. Not checked at desktop widths.
