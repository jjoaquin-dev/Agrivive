---
title: Mobile Login and Marketplace Visibility Fix
type: delivery
date: 2026-09-28
status: implemented; type check and live marketplace query passed; device OTP delivery pending owner verification
---

# Mobile Login and Marketplace Visibility Fix

## What changed

- Updated mobile password login to recognize Better Auth's `EMAIL_NOT_VERIFIED` response, send an email-verification OTP, and open the existing verification screen.
- Corrected the seven active, in-stock products belonging to `jaraz@gmail.com` by setting them as available to buyers and publishing their current stock cycle.
- Kept the public marketplace filters unchanged: inactive, unavailable, unmarketable, unpriced, or incomplete seller listings remain hidden.

## Why

Unverified mobile accounts were rejected before the login screen reached its OTP dispatch branch, so no verification code was sent. Jaraz's seller account and profile were valid, but every product had `isMarketable: false`; the website intentionally excludes those records.

## Affected paths

- `mobile/app/(auth)/login.tsx`
- Database rows in `sellers_product` for `jaraz@gmail.com`

## Verification performed

- `cd mobile && node node_modules/typescript/bin/tsc --noEmit --pretty false` — passed.
- Queried the seller's products after correction — seven active, in-stock listings are marketable and have publication timestamps.
- Called the marketplace listing service with a 50-item limit — all seven Jaraz products were returned.
- Manual mobile login with an unverified account and confirmation that the OTP arrives remain pending owner verification.
