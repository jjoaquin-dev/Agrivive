---
title: Boost Amount Left Matches Feed
type: delivery
date: 2026-11-01
---

# Boost Amount Left Matches Feed

## What changed

The seller Boost screen ("Why?" breakdown, score and tier) now reads original stock from the product, the same number the Listings screen and the buyer feed use. Before, it read the first listing cycle's original stock. That value does not grow when a seller adds more stock to a running listing, so a listing with 6 kg left of 50 showed "Amount left 98%" on Boost while Listings showed it as running low.

## Files

- `backend/src/utils/visibility-ranking/load.ts`: original stock is `coalesce(product original, cycle original)`.

## Verification

- `bunx tsc --noEmit` clean, `bun test` 29 passed, API build works.
- Dev database, read-only: Mangga (9 of 25 on the product, 20 on the cycle) went from 45% to 36% amount left, matching the feed.
- Not run against the VPS data; Singkamas is only there.

## Not changed

Seller analytics ("posted quantity") still sums the cycle original stock, so it undercounts after Add More. Existing cycle rows still differ from the product on 3 dev products. A fix would update the cycle on Add More and repair old rows with a migration; not done without owner approval.
