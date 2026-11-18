---
title: Seller Role Cache Fix
type: delivery
date: 2026-11-18
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]]

## Why
In seller setup, "Save and Continue" created the stall, then the stall hours failed with "You do not have permission to do that. This action requires a seller account." Creating the stall adds the seller role, but `sessionAuth` keeps each user's roles for 30 seconds, so the very next seller-only request still saw the old roles.

## Done
- `seller.profile.create.ts`: clears the user's cached status after the stall is created (`forgetUserStatus`).
- `auth.role-expand.ts`: same after an account gains the buyer or seller role.
- `backend/dist` rebuilt. `pickup.flow.test.ts` passes (67 tests). Not tried with a real sign-up.

## Owner must do
Deploy the API. No app build is needed for this fix (the new "Hours Not Saved" reason text is only in the next APK).
