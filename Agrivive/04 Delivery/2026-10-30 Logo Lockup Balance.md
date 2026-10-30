---
title: Logo Lockup Balance
type: delivery
date: 2026-10-30
---

# Logo Lockup Balance

## What changed
- Splash and landing header now share one lockup ratio: cart height ≈ 1.4× the wordmark font size.
- Splash cart was ≈ 2× the font size (too big): `--cart-w/-h/-overlap` reduced at every breakpoint in `web/app/globals.css`; text size unchanged. Overlap stays ≈ -0.275× cart width.
- Header cart was ≈ 1× (too small): 28×22 → 38×30 px, margin `-mr-1` → `-mr-3` in `LandingHeader.tsx`.
- Same proportions make the splash logo flight land cleanly on the header logo.

## Verification
`bun run typecheck` in `web/` passed. Not checked in a browser.
