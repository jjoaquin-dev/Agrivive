---
title: Marketplace Navbar Logo Transparent
type: delivery
date: 2026-11-01
status: complete
---

# Marketplace Navbar Logo Transparent

## What changed

- The buyer navbar logo showed a white box, because `agrivive-logo-full-new.png` has an opaque white background.
- A transparent copy, `web/public/brand/agrivive-logo-full-new-transparent.png`, was made with an edge flood fill of the white background. The original file is unchanged.
- `BuyerSiteHeader.tsx` now points at the transparent copy. Other pages that use the original logo, such as the auth pages, are unchanged.

## Affected files

- `web/src/components/BuyerSiteHeader.tsx`
- `web/public/brand/agrivive-logo-full-new-transparent.png` (new)

## Verification

- `bun run typecheck` in `web/` passed.
- Checked in the preview at `http://localhost:3001/marketplace`: the logo shows on the page background with no box.
