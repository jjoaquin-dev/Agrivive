# Buyer Marketplace Backend

Date: 2026-09-22

## Alignment

The vault's buyer journey requires public marketplace browsing, seller-declared condition, inventory age, storage notes, pickup information, seller type, search and filters, location distance, and verified seller visibility. This delivery adds those backend capabilities before buyer web marketplace UI work.

## What changed

- Added public `GET /marketplace/products` and `GET /marketplace/products/:id` routes.
- Added product condition, inventory age, and storage note fields.
- Added seller type and pickup instruction fields.
- Added search, product type, unit, seller type, price, quantity, radius, and cursor filters.
- Added newest-first cursor pagination and seller distance calculation.
- Restricted public listings to active, marketable, in-stock products from active, email-verified sellers with complete profiles.
- Kept sold-out product details readable while preventing reservation from marketplace reads.
- Reused the existing signed product image helper.
- Used safe defaults for existing seller mobile requests: `needs_inspection` for product condition and `supplier` for seller type.

## Affected paths

- `backend/src/db/schema.ts`
- `backend/drizzle/20260922190000_marketplace_fields/migration.sql`
- `backend/src/modules/marketplace/`
- `backend/src/modules/seller/model/`
- `backend/src/modules/seller/services/`
- `backend/src/index.ts`

## Privacy and scope

- Public responses include shop name, seller type, pickup address, coordinates, and pickup instructions.
- Seller phone numbers, credentials, and internal stock adjustment records remain private.
- Condition and storage values are seller-entered. The API makes no freshness, safety, spoilage, or shelf-life claims.
- Buyer reservation still uses the authenticated `POST /buyer/orders` flow, which remains authoritative for price and stock.
- No buyer web UI was added.

## Verification

- `bunx drizzle-kit migrate` completed successfully.
- Marketplace schema fields were applied to the local database.
- `bunx tsc --noEmit` passed.
- `bun build src/index.ts --outdir dist --target bun` passed; the tracked generated bundle was restored afterward.
- OpenAPI lists both marketplace routes and their query/path schemas.
- Anonymous `GET /marketplace/products` returned `200` with real listings and signed image URLs.
- Location-filtered listing returned `200` with `distanceKm` values.
- Invalid location and reversed price ranges returned `400`.
- Available product detail returned `200`; an unknown product returned `404`.
- Manual Postman/OpenAPI checks for hidden inactive, unverified, archived, and sold-out cases remain pending.

## Commit

Not committed yet.
