# Review and Rating System: Implementation Audit

Audit date: 2026-11-08. Branch `ui-enhancements`. Read-only: no source file was changed and **no test was executed**. Every "Implemented" below means "the code exists and was read", not "verified working".

## What was read

- Backend: `backend/src/db/schema.ts` (`order_reviews`, `product_reviews`), `modules/buyer/{index,model,services}/buyer.order.review*`, `buyer.order.product-review.*`, `buyer.product.review-eligibility.ts`, `buyer.seller.rating.ts`, `buyer.seller.reviews.ts`, `modules/marketplace/services/marketplace.product.reviews.list.ts`, `marketplace.products.list.ts`, `marketplace.products.deals.ts`, `marketplace.sellers.map.ts`, `modules/seller/services/seller.reviews.list.ts`, `seller.order.review.respond.ts`, `seller.product-review.reply.ts`, `utils/trust/{policy,score,read-review}.ts`, `utils/visibility-ranking/load.ts`, `utils/ahp-topsis/index.ts`.
- Web: `OrderReviews.tsx`, `ProductReviewForm.tsx`, `ProductReviewsSection.tsx`, `OrderDetail.tsx`, `orders/api/orders.ts`.
- Documents: `backend/API_ENDPOINTS.md`, the capstone PDF, the Seller Mobile App Alpha Test Reviewer PDF, the vault notes (`Trust and Flagging`, `References`, `Open Decisions`, `00-LATEST`).

**The professor's feedback itself was not available.** A search of the repo, the vault and both PDFs found no text about "three rating categories", "groups of five", "15-day editing" or a Bayesian seller formula. Those items come only from your task description and are treated as unconfirmed requirements.

## Two review types exist today

| | Seller service review | Product review |
|---|---|---|
| Table | `order_reviews` | `product_reviews` |
| Granularity | One per order (`order_id` UNIQUE) | One per ordered item (`ordered_item_id` UNIQUE) |
| Fields | `rating` (smallint, 1–5), `review` (text, ≤2000), `seller_response` | same |
| Create route | `POST /buyer/orders/:id/review` | `POST /buyer/orders/:id/items/:itemId/review` |
| Read route | `GET /buyer/orders/:id/review` | `GET /buyer/orders/:id/items/:itemId/review` |
| Seller reply | `POST /seller/orders/:id/review-response` (once) | `POST /seller/product-reviews/:id/reply` (once) |

There is exactly **one star rating per target**. No category columns exist.

## Feature status

| Area | Status | Evidence |
|---|---|---|
| Review creation | **Implemented, unverified** | Services above; transaction plus `onConflictDoNothing`. |
| Product star rating | **Implemented, unverified** | `product_reviews.rating`, body schema integer 1–5. |
| Seller service star rating | **Implemented, unverified** | `order_reviews.rating`. Not a separate category set. |
| Review eligibility | **Implemented, unverified** | Only `orders.status = 'completed'`, else 409. Cancelled, expired and pending all share one check and one message. Wrong owner gives 404. |
| One review per order / per item | **Implemented, unverified** | DB unique indexes, 409 on conflict. "One review per completed order" holds for the seller review only. Products get one review per item. |
| Optional comment | **Implemented, unverified** | `review` optional, trimmed, empty becomes `null`, max 2000. |
| Review editing | **Missing** | No PATCH/PUT route. No `updated_at` column. Web shows a saved review read-only. Seller reply is the only later write. |
| Photo attachments on reviews | **Missing** | No column, upload route, or UI field. (Photos exist only for listings, chat and report evidence.) |
| Rating calculation, display | **Implemented, unverified** | Simple `avg()`; rounding differs by endpoint (see conflicts). |
| Bayesian seller rating `R=(C·m+Σr)/(C+n)` | **Missing** | Not in any code or approved document. `References.md` line 136 mentions "bayesian rating adjustment" but the code has none. |
| Seller trust rating | **Partially implemented** | Not a star average. Trust points: 1 point per completed order that has any rating ≤2, counted from **both** tables (`utils/trust/score.ts`). Window: last 90 days. |
| Seller reliability in ranking | **Implemented, unverified** | Plain average of `order_reviews` ∪ `product_reviews` rows; no reviews gives 2.5 (`visibility-ranking/load.ts`, `marketplace.products.list.ts`). |
| Product review display | **Implemented, unverified** | Latest 10, count, average (1 decimal), 1–5 breakdown, masked buyer name, seller reply. |
| Seller review display | **Implemented, unverified** | Web seller section, mobile Reviews screen, public `/buyer/sellers/:id/{rating,reviews}`. |
| Grouped product review (groups of five, one button, three questions) | **Missing** | Web renders one form per item plus one seller form. No grouping, no group endpoint, no category fields. |
| Automated tests | **Missing** | No review/rating test exists. Only `marketplace.products.visibility.test.ts` and `ahp-topsis.test.ts` (ranking). |

## Behaviours worth testing that the code reveals

1. Seller ranking and trust read **product ratings as seller signals**. This conflicts with the requirement that product rating and seller rating stay separate (Conflict C3).
2. The ranking average is over **rows**, so an order with N items adds N+1 rows. Large orders weigh more (C7).
3. `evaluateTrustAction` runs **after** the review transaction commits. If it throws, the caller gets a 500 although the review is saved, and a retry returns 409.
4. Three different seller averages exist: order-only (2 decimals), order-only (1 decimal), and order+product (full precision).

## Not verifiable from code (needs a running system)

Actual HTTP status for schema failures (Elysia validation, expected 422), role rejection codes (401/403), concurrent double-submit behaviour, UI rendering of states, and DB contents after each call.
