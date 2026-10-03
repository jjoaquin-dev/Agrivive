# Buyer Wishlist Heart

Date: 2026-10-03

## What changed

Replaced the buyer product-card heart's local-only toggle with a persisted buyer wishlist. Signed-in buyers can save and remove marketplace products, and the saved state is restored from the backend when the web app loads.

Guest buyers are sent to sign in when they select the heart. The return path keeps the buyer on the page they were browsing. The heart no longer selects a seller on the map; seller selection remains the responsibility of the map-pin action.

## Why it changed

The previous heart button only changed React state and reset on refresh. It looked like a wishlist control but did not save anything. The new flow follows Recognition Over Recall and Jakob's Law by making the familiar heart action behave like a familiar saved-items control. Visibility of System Status is supported through loading, pending, error, and accessible pressed states. The 44px target follows Paul Fitts's Law and the repository's touch-target guidance.

## API contract

- `GET /buyer/wishlist` returns `{ "productIds": string[] }` for the signed-in buyer.
- `POST /buyer/wishlist/:productId` saves a currently visible marketplace product and returns `{ productId, saved: true }`.
- `DELETE /buyer/wishlist/:productId` removes the buyer's saved product and returns `{ productId, saved: false }`.

The database uses a unique buyer/product index, buyer-scoped access, and cascading cleanup when a user or product is deleted.

## Affected paths

Backend:

- `backend/src/db/schema.ts`
- `backend/drizzle/20261003001018_familiar_pestilence/migration.sql`
- `backend/src/modules/buyer/model/buyer.wishlist.ts`
- `backend/src/modules/buyer/index/buyer.wishlist.list.ts`
- `backend/src/modules/buyer/index/buyer.wishlist.save.ts`
- `backend/src/modules/buyer/index/buyer.wishlist.remove.ts`
- `backend/src/modules/buyer/services/buyer.wishlist.list.ts`
- `backend/src/modules/buyer/services/buyer.wishlist.save.ts`
- `backend/src/modules/buyer/services/buyer.wishlist.remove.ts`
- `backend/src/modules/buyer/index.ts`
- `backend/API_ENDPOINTS.md`

Web:

- `web/src/features/wishlist/types.ts`
- `web/src/features/wishlist/api/wishlist.ts`
- `web/src/features/wishlist/WishlistProvider.tsx`
- `web/app/layout.tsx`
- `web/src/features/marketplace/components/ProductCard.tsx`

## Verification performed

- `cd backend && bunx tsc --noEmit` -> Passed.
- `cd backend && bun build src/index.ts --outdir dist --target bun` -> Passed.
- `cd backend && bunx drizzle-kit check` -> Passed.
- `cd web && bunx tsc --noEmit` -> Passed.
- OpenAPI contains `/buyer/wishlist` and `/buyer/wishlist/{productId}`.
- Anonymous `GET /buyer/wishlist` -> `401`, confirming the route is protected.
- The wishlist migration was generated but not applied automatically; applying it remains an owner/database step.
- `cd web && bun run build` was not rerun after this change because a user-owned Next.js dev server is active on port 3001 and shares the generated `.next` directory. The earlier build passed, and the final web type check passed. Run the production build after stopping the dev server to avoid cache corruption.
- With the active dev server refreshed, `/marketplace`, `/cart`, a live `/marketplace/:id`, and a live `/sellers/:id` each returned `200`.

## Remaining owner-only acceptance checks

- Apply the new migration in the configured database.
- Sign in as a buyer and save a product from the marketplace.
- Refresh the page and confirm the heart remains selected.
- Remove the saved product and confirm the heart returns to its neutral state.
- Open the same marketplace page in a second signed-in browser session and confirm the saved state is account-based.
- Confirm a guest is sent to login and returned to the original page.
- Confirm an invalid or no-longer-visible product cannot be saved.
- Confirm failed save requests roll back the heart state and show an accessible error.

Commit hash/message: no commit created.

