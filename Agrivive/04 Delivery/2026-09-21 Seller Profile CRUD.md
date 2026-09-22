---
title: Seller Profile CRUD
type: delivery
date: 2026-09-21
status: implemented; manual API checks pending
---

# Seller Profile CRUD

## Why

Seller profiles had create, read, and update routes, but no archive operation. Missing profiles returned unclear responses, and empty or invalid profile fields could be accepted. Archiving also needed to protect pending orders and unanswered inquiries.

## What changed

- Added canonical `POST /seller/profile` and retained `/seller/addprofile` with its previous response shape. Profile create, read, update, and delete now have matching route, model where needed, and single-function service files.
- Validated nonblank shop, address, and phone values, coordinate ranges, and nonempty updates. Read and update return 404 when no current profile exists.
- `DELETE /seller/profile` archives the current profile and deactivates owned listings in one transaction. It returns 409 while live pending orders or unanswered inquiries exist, and 204 after they are resolved or on a repeated successful archive.
- Profile creation and listing activation share an advisory lock with archive, preventing new active listings from appearing during profile deletion. A verified seller can create a new current profile later; old listings stay inactive until restored individually.
- Existing `is_current` and listing `is_active` columns support this behavior; no database migration was needed.

## Affected paths

- `backend/src/modules/seller/index/`, `backend/src/modules/seller/model/`, and `backend/src/modules/seller/services/`
- `backend/SELLER_TRUST_MANUAL_TESTING.md`

## Verification

- `bunx tsc --noEmit`: passed.
- `bun build src/index.ts --outdir dist --target bun`: passed.
- Isolated Elysia validation rejected blank shop names, out-of-range coordinates, and empty updates; valid create and partial update bodies passed.
- Anonymous route smoke checks reached the create, read, update, and delete URLs and were denied by validation or authentication.
- Authenticated Postman/OpenAPI checks remain for the owner, using `backend/SELLER_TRUST_MANUAL_TESTING.md`.
