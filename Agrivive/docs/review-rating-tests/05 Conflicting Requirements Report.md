# Conflicting Requirements Report

Findings come from reading code and documents. None was reproduced by running the system. Severity is the effect on the test plan, not on users.

| ID | Conflict | Evidence | Severity | Needs professor approval |
|---|---|---|---|---|
| C1 | **Simple average vs Bayesian seller rating.** Every rating shown or used today is a simple average. The Bayesian formula `R = (C × m + Σ ratings) / (C + n)`, C = 5, is not in code and not in the capstone PDF, the Alpha PDF, or the vault. | `buyer.seller.rating.ts`, `buyer.seller.reviews.ts`, `seller.reviews.list.ts`, `marketplace.sellers.map.ts` (all `avg()`); `visibility-ranking/load.ts` (`avg(rating)`). Only mention: `Agrivive/docs/References.md` line 136 says "bayesian rating adjustment", which the code does not contain. | High | **Yes.** Do not swap formulas without approval. Worked comparison: 2 reviews of 5 gives 5.00 simple, 4.29 Bayesian (m = 4.0). |
| C2 | **15-day edit period is not an approved rule.** No document sets it, and no edit feature exists. | No PATCH/PUT route, no `updated_at` on `order_reviews` or `product_reviews`; web shows saved reviews read-only; "15" absent from PDFs and vault. | High | **Yes.** Also needs the clock start (order completion or review time) and the effect on trust points already issued. |
| C3 | **Rating separation vs how ratings are used.** Product reviews feed seller trust and seller ranking. | `trust/score.ts` counts `product_reviews.rating ≤2` into `ratingSignals`; `buyer.order.product-review.create.ts` calls `evaluateTrustAction` for ratings ≤2; `load.ts` and `marketplace.products.list.ts` average order and product ratings together. Vault note (2026-11-02 "Shared Seller Rating") shows this was deliberate. | High | **Yes.** The deliberate design and the stated requirement disagree. |
| C4 | **Three categories vs one star.** Feedback says three rating categories; the schema holds one `rating` per review. No category is named anywhere. | `schema.ts` `order_reviews`, `product_reviews`; no category document found. | High | **Yes.** Names, scale and how three values become the stored rating. Not invented here. |
| C5 | **Inconsistent rounding.** The same seller can show 4.33 and 4.3 in two endpoints. | `buyer.seller.rating.ts` rounds to 2 decimals; the other seller and product summaries round to 1. | Low | Preferable |
| C6 | **Documentation claims a feature that is absent.** `References.md` lists "bayesian rating adjustment" under `visibility-ranking`. | Search of `backend/src` for "bayes" returns nothing. | Medium | Correct the document or build the feature |
| C7 | **Order size changes seller reliability.** Ranking averages rows, so an order with N items adds N+1 rating rows; a buyer's opinion of a large order outweighs one of a small order. | `load.ts` `union all` of both tables, no per-order weighting. | Medium | Yes, as part of C3 |
| C8 | **"One review per completed order" vs per-item product reviews.** Today one order allows 1 seller review and one product review for each item. | Unique indexes: `order_reviews.order_id`, `product_reviews.ordered_item_id`. | Medium | Yes (Q-07) |
| C9 | **Neutral rating value.** The Alpha PDF says no ratings counts as "middle (0.5)"; code uses 2.5 on the 1–5 scale. Equal only if the value is scaled by 5 before ranking. | `load.ts` `neutralRating = 2.5`; Alpha PDF page 7. | Low | Confirm the scale used in the paper |
| C10 | **Grouping and photos are not in project documents.** The grouped review (five per group, one button) and review photos appear only in the task request. | No match in code, PDFs or vault. | High | **Yes.** Treated as unconfirmed requirements. |
| C11 | **Non-completed orders share one message.** Pending, cancelled and expired all return "Only completed orders can be reviewed", so tests cannot tell them apart by message. | `buyer.order.review.create.ts` line 14, `buyer.order.product-review.create.ts` line 34. | Low | No |
| C12 | **Trust step failure after commit.** The review is committed first and the trust check runs afterwards; a failure returns 500 although the review is saved. | `buyer.order.review.create.ts` lines 9–23. | Low | No (defect to confirm, ELG-20) |

## What this means for the build

- Do not change the calculation until C1, C3 and C4 are answered. The current build matches the capstone's "weighted statistical tool" wording only through the trust points.
- Cases blocked by these conflicts are marked in `04` and name the question that unblocks them.
