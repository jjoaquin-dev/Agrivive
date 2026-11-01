---
title: Boost Wait Time Shown Up Front
type: delivery
date: 2026-11-01
status: code complete, owner test pending
---

# Boost Wait Time Shown Up Front

## Problem

A running boost showed "Needs your choice" (a price-drop prompt), but tapping Boost failed with "A price drop post just went out". The backend blocks a second price-drop post for 3 hours after the last one (`priceDropPostGapHours`), and the automatic price-drop post creates the prompt right away. So the prompt appeared while posting was still blocked, and the screen only found out when the seller tapped.

## What changed

`readSellerVisibilityBoost` (`GET /seller/visibility-boost/...` for the product screen) now checks the same waiting time first. When posting is blocked:
- `eligibility.canBoost` is `false`, so the Boost button is disabled.
- `eligibility.headline` is "Almost Time" and `message` says "You just boosted this product. You can boost again in about N hours."
- `eligibility.waitUntil` holds the time it opens (new field; `null` otherwise).

Price-drop prompts use the price-drop wait; a first boost uses the first-post wait (only when no boost exists yet for it). The 3-hour rules and the 409 on the server are unchanged. Mobile only needed the type field `waitUntil` (`marketing/types.ts`); the existing note and disabled button show the message.

Files: `backend/src/modules/seller/services/seller.visibility-boost.read.ts`, `mobile/src/features/marketing/types.ts`.

## Owner test

Right after an automatic price-drop post, open the product's Boost screen: button disabled, text says to wait about N hours. After the wait, the button works and posts. Not tested against the live Page.

## Verification

Backend `bunx tsc --noEmit` and `bun build src/index.ts`, mobile `bun run typecheck` passed.
