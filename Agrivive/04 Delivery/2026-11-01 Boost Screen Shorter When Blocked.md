---
title: Boost Screen Shorter When Blocked
type: delivery
date: 2026-11-01
status: code complete, no device check
---

# Boost Screen Shorter When Blocked

## What changed

On the Boost screen (`mobile/app/(app)/marketing/[productId].tsx`), when the seller cannot boost yet:
- The post preview and the price-drop card are hidden (nothing to post).
- A small product row (photo, name, price now) names the product (`BoostProductHeader`, new).
- The status note, the earlier boost card and "See boost history" stay.
- The disabled button says "Boost again in about N hours" when a wait applies (uses `eligibility.waitUntil`), otherwise keeps "Boost on Facebook & Instagram".

When the seller can boost, the screen is unchanged: preview, price-drop card, "You're all set!".

## Verification

`bun run typecheck` in `mobile/` passed. Not run on a device.
