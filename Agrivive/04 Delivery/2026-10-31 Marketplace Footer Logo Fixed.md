---
title: Marketplace Footer Logo Fixed
type: delivery
date: 2026-10-31
status: complete
---

# Marketplace Footer Logo Fixed

## What changed

- The logo in the marketplace footer rendered as a solid white box. The footer used `agrivive-logo-full-new.png`, which has no transparent pixels, and the `brightness-0 invert` filter turned its whole background white.
- The footer now uses `agrivive-logo-full-white.png`, a white logo with a transparent background, and the filter is removed. The width is set to 137px to match its aspect ratio at 38px high.

## Affected files

- `web/src/features/marketplace/components/MarketplaceFooter.tsx`.

## Verification

- `bun run typecheck` in `web/`: see the result in the session.
- Not checked in a browser.
