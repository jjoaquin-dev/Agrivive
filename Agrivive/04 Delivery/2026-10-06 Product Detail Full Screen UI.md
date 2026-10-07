# Product Detail Full-Screen UI

Date: 2026-10-06
Updated: 2026-10-06

## What changed

The buyer product-detail page now uses a wider, full-screen-oriented layout. The product image stage grows to the viewport on larger screens, the purchase panel stays visible while scrolling, and the mobile image area scales responsively without changing product, cart, wishlist, reservation, or recommendation behavior.

Marketplace product cards now use a fixed `h-52` image stage while the outer card keeps a natural content height instead of receiving an oversized fixed height. Buyer order list previews and order-detail item previews now receive the real ordered product image from the API and use an `h-96` image stage, with a clean fallback when an image is unavailable.

The product-detail page's Similar produce and MBA recommendation cards now use a taller `h-96` image stage and a 360px maximum card width. Their card height still follows the content. The shared product card media was separated from the card details so these two image sizes remain explicit and the source files stay under 200 lines.

The Similar produce and MBA recommendation rows are now capped at 1120px (three 360px cards plus two 20px gaps). This prevents wide desktop grid tracks from placing excessive space between the cards, while retaining the existing tablet and mobile column breakpoints and image height.

## Why it changed

The previous product-detail layout left too much unused space and made the product image feel secondary. The updated proportions establish the image as the primary visual anchor while keeping price, seller information, pickup details, quantity, cart, and reservation actions easy to find.

The change follows Jakob Nielsen's Law of Recognition, Gestalt Figure-Ground and Common Region, Aesthetic-Usability Effect, and Paul Fitts's touch-target guidance. Existing Agrivive colors, borders, controls, and responsive conventions remain in place.

The order image data is resolved in the shared order-read utility so the buyer order list and order-detail page use the same signed product image URL without adding client-side product fetches for each order card.

The product-page suggestion card previously filled a wide single-column grid track while its image stayed at 208px, making the image look shallow. The new width cap and tall image restore the intended portrait proportion without changing the marketplace listing grid.

The tighter recommendation spacing follows the Gestalt Law of Proximity (Max Wertheimer, Kurt Koffka, and Wolfgang Köhler): related suggestions should read as one group, not three isolated cards.

## Affected paths

- `web/src/features/marketplace/components/ProductDetail.tsx`
- `web/src/features/marketplace/components/ProductCard.tsx`
- `web/src/features/marketplace/components/ProductCardMedia.tsx`
- `web/src/features/marketplace/components/SimilarProduceSection.tsx`
- `web/src/features/marketplace/components/MbaRecommendationsSection.tsx`
- `web/src/features/marketplace/types.ts`
- `web/src/features/orders/components/OrderCardItems.tsx`
- `web/src/features/orders/components/OrderItemsCard.tsx`
- `backend/src/utils/order-read/index.ts`
- `backend/API_ENDPOINTS.md`

## Verification performed

- `cd web && bunx tsc --noEmit` passed.
- After the spacing correction, `cd web && bunx tsc --noEmit` passed again. The local product page measured three 360px Similar produce cards with 20px gaps at a 1280px viewport, and no horizontal overflow.
- Product-page visual review measured the Similar produce card at 360px wide with a 384px image at 620px viewport width, 313px wide at 360px, and 360px wide at 1280px. No horizontal page overflow was detected at those widths.
- The narrow-width browser review confirmed the price, stock, wishlist, and cart controls remain visible below the taller image. The reviewed listing used the no-image category fallback.
- `cd backend && bunx tsc --noEmit` passed.
- `cd backend && bun build src/index.ts --outdir dist --target bun` passed using a temporary verification output directory, which was removed afterward.
- `cd backend && bunx drizzle-kit check` passed.
- `git diff --check` reported no whitespace errors; Git only reported existing line-ending normalization warnings.
- Mobile browser review at the local product-detail route confirmed the larger image stage, full-width mobile composition, visible back link, and purchase controls remain reachable.
- The local listing used for review had no stored product image, so the missing-image fallback was inspected rather than a real product photo.
- The production web build remains subject to the existing Windows `spawn EPERM` host-process limitation documented in the MBA delivery note.

## Remaining owner acceptance checks

- Review the product-detail page at desktop, tablet, and mobile widths.
- Confirm the image remains clear with real product photos and with the missing-image fallback.
- Confirm sticky desktop behavior does not obscure purchase controls.
- Confirm add to cart, buy now, wishlist, seller link, MBA recommendations, and Similar produce still work.

## Commit

Not created yet.
