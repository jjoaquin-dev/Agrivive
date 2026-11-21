# 2026-11-12 Drop Condition and Pickup Capacity

Up: [[Delivery Index 2026-11]]

## Why
The team removed two fields from the paper's data dictionary and asked for the same in the database: the listing `condition` and the stall `pickup_capacity`.

## What changed
- **`sellers_product.condition`** and the `product_condition` type are gone: schema, create and update bodies, and the marketplace, deals, wishlist and product detail reads no longer send it. Web type updated.
- **`sellers_profile.pickup_capacity`** is gone. Pickups that may overlap at one stall are now fixed at 3 for every seller (`PICKUP_CAPACITY` in `backend/src/utils/pickup/rules.ts`). The seller no longer sets it: the stall settings body, the stall read, `mobile/app/(app)/stall.tsx` and `API_ENDPOINTS.md` were updated.
- **Migration** `backend/drizzle/20261112100000_drop_condition_and_pickup_capacity/migration.sql` drops both columns and the type. It is not applied to the live database; the owner runs it. Existing values are lost on apply.
- Tests: the two capacity tests now fill the 3 places first.

## Verification
Backend `tsc` clean, 275 tests pass, mobile and web typecheck clean, `backend/dist` rebuilt.
