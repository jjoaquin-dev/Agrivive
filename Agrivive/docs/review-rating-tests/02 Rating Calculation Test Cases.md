# Rating Calculation and Separation Test Cases

**Nothing here has been executed.** Actual Result is blank and Status is Not Tested for every case.

Evidence codes: **E-API** request and response, **E-DB** SQL result, **E-UI** screenshot. Requirement IDs are in `04 Requirements Traceability Matrix.md`.

## How the code calculates today

| Value | Source rows | Formula | Rounding |
|---|---|---|---|
| Product average (`/marketplace/products/:id/reviews`, product cards, deals) | `product_reviews` for the product | Simple average | 1 decimal |
| Seller rating (`/buyer/sellers/:id/rating`) | `order_reviews` for the seller | Simple average | **2 decimals** |
| Seller reviews summary (`/buyer/sellers/:id/reviews`, seller Reviews screen) | `order_reviews` | Simple average | 1 decimal |
| Seller rating on the map (`marketplace.sellers.map`) | `order_reviews` | Simple average | 1 decimal |
| Seller reliability in ranking (AHP-TOPSIS) | `order_reviews` **plus** `product_reviews`, every row equal | Simple average; no rows = 2.5 | none (full precision) |
| Seller trust points | Completed orders that have an `order_reviews` **or** `product_reviews` row with rating ≤2 | 1 point per distinct order; last 90 days | whole numbers |

The Bayesian formula `R = (C × m + Σ ratings) / (C + n)` with C = 5 is **not implemented**. Its cases are marked Blocked and carry reference values so a future build can be checked.

## A. Rating calculation

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Test Data | Expected Result | Actual Result | Status | Evidence Required |
|---|---|---|---|---|---|---|---|---|---|
| CALC-01 | R-01 | Product average, repeating decimal | P-A has no reviews | 1. Add product ratings 5, 4, 4. 2. GET product reviews | 5,4,4 (sum 13, n 3) | `count` 3; `average` "4.3" | | Not Tested | E-API, E-DB |
| CALC-02 | R-01 | Rounding at .x5 | New product | 1. Add ratings 5,4,4,4 | sum 17, n 4, mean 4.25 | `average` "4.3" (database rounds half up). Record the actual string | | Not Tested | E-API |
| CALC-03 | R-01 | Rounding up at .75 | New product | 1. Add ratings 5,5,5,4 | mean 4.75 | `average` "4.8" | | Not Tested | E-API |
| CALC-04 | R-01 | Single review | New product | 1. Add one rating of 3 | n 1 | `average` "3.0"; `count` 1; breakdown 3:1 | | Not Tested | E-API |
| CALC-05 | R-01 | No reviews | New product and new seller | 1. GET product reviews. 2. GET seller rating | none | Product: `count` 0, `average` null. Seller: `count` 0, `average` null. No NaN or "0.0" | | Not Tested | E-API, E-UI |
| CALC-06 | R-01 | Count includes more than the 10 shown | 12 product reviews | 1. GET reviews | 12 ratings | `count` 12; `average` over all 12; `reviews` length 10 | | Not Tested | E-API |
| CALC-07 | R-01 | Breakdown totals match count | Mixed ratings | 1. GET reviews | 5,5,4,2,1 | Sum of breakdown values equals `count` (5) | | Not Tested | E-API |
| CALC-08 | R-01 | Same seller, different decimals by endpoint | S1 has order reviews 5, 4, 4 | 1. GET `/buyer/sellers/S1/rating`. 2. GET `/buyer/sellers/S1/reviews` | mean 4.3333 | Rating endpoint "4.33"; reviews endpoint "4.3". **Flag C5**: record and ask whether one precision is wanted | | Not Tested | E-API |
| CALC-09 | R-01 | Map and card values match the API | S1 with order reviews 5,4,4 | 1. Open the map pin for S1. 2. Open S1 storefront | | Both show 4.3 and the same review count | | Not Tested | E-UI |
| CALC-10 | R-01 | Product card average equals product reviews endpoint | P-A with ratings 5,4 | 1. Read the card on the marketplace list and deals row. 2. GET reviews | | All three show 4.5 and count 2 | | Not Tested | E-API, E-UI |
| CALC-11 | R-05 | Ranking reliability, no reviews | Seller with listings, zero reviews | 1. Read the visibility ranking input for the seller (ranking test script or debug output) | no rows | Reliability input 2.5 | | Not Tested | E-LOG |
| CALC-12 | R-05 | Ranking reliability mixes both tables | S1: order reviews 5 and 5; product reviews 1, 1, 1 | 1. Read ranking input | rows 5,5,1,1,1 | Reliability 2.6. Seller-only mean would be 5.0 (see SEP-07) | | Not Tested | E-LOG, E-DB |
| CALC-13 | R-05 | Order size changes the weight (Conflict C7) | S-X: one order, 5 items all rated 1, order rating 5. S-Y: one order, 1 item rated 1, order rating 5 | 1. Read ranking input for both | S-X rows 5,1,1,1,1,1; S-Y rows 5,1 | S-X 1.667, S-Y 3.0 for the same buyer opinions. Record as a finding for Q-04 | | Not Tested | E-LOG, E-DB |
| CALC-14 | R-04 | Trust points from low order ratings | S1 with 3 completed orders, order ratings 1, 2, 3 | 1. Read trust monitoring score | | `ratingSignals` 2 (ratings ≤2); `low_rating` points 2 | | Not Tested | E-API |
| CALC-15 | R-04 | One order with low seller and low product rating counts once | One completed order with order rating 1 and product rating 2 | 1. Read trust monitoring score | | `ratingSignals` 1 | | Not Tested | E-API |
| CALC-16 | R-04 | 90-day window | Order review of 1 created 91 days ago (backdated in test DB) and one 10 days ago | 1. Read trust score | | Only the recent one counts (`ratingSignals` 1) | | Not Tested | E-API, E-DB |
| CALC-17 | R-04 | Rating of 3 adds no trust point | Completed order rated 3 | 1. Read trust score | | `ratingSignals` unchanged | | Not Tested | E-API |

## B. Bayesian seller rating (Blocked: not implemented, formula not approved)

Reference values for `R = (5 × m + Σ ratings) / (5 + n)`. `m` must be defined first (Q-03). Use m = 4.0 unless stated.

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Test Data | Expected Result | Actual Result | Status | Evidence Required |
|---|---|---|---|---|---|---|---|---|---|
| BAY-01 | P-05 | No reviews | Approved rule and m defined | 1. Compute seller rating | n 0, m 4.0 | R = 4.0000 (simple average: none) | | Not Tested | E-API |
| BAY-02 | P-05 | One perfect review | same | 1. Compute | n 1, ratings [5] | R = (20+5)/6 = 4.1667 (simple 5.0) | | Not Tested | E-API |
| BAY-03 | P-05 | Two perfect reviews | same | 1. Compute | n 2, [5,5] | R = 30/7 = 4.2857 | | Not Tested | E-API |
| BAY-04 | P-05 | Three poor reviews | same | 1. Compute | n 3, [2,2,2] | R = 26/8 = 3.2500 (simple 2.0) | | Not Tested | E-API |
| BAY-05 | P-05 | Ten perfect reviews | same | 1. Compute | n 10, all 5 | R = 70/15 = 4.6667 | | Not Tested | E-API |
| BAY-06 | P-05 | Fifty perfect reviews approach the simple value | same | 1. Compute | n 50, all 5 | R = 270/55 = 4.9091 | | Not Tested | E-API |
| BAY-07 | P-05 | Different marketplace average | m 3.5 | 1. Compute | n 2, [4,4] | R = (17.5+8)/7 = 3.6429 | | Not Tested | E-API |
| BAY-08 | P-05 | Which reviews feed `n` and `m` | Seller with order and product reviews | 1. Compute with order reviews only. 2. Compute with both tables | | Result follows the approved source (Q-03). Today's code mixes both for ranking and uses order-only for display | | Not Tested | E-API, E-DB |
| BAY-09 | P-05 | Ordering effect | Seller A: n 1 [5]. Seller B: n 20 all 4.8 | 1. Compare ranks | | B ranks above A under Bayesian; A ranks above B under simple average. Confirms the discrepancy before approval | | Not Tested | E-API |
| BAY-10 | P-05 | Simple average stays correct where Bayesian is not approved | Current build | 1. Confirm no endpoint returns a Bayesian value | | All values equal the simple average rules in the table above | | Not Tested | E-API |

## C. Rating separation

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Test Data | Expected Result | Actual Result | Status | Evidence Required |
|---|---|---|---|---|---|---|---|---|---|
| SEP-01 | P-04 | Product rating does not change the seller service rating | S1 order reviews [5]; product P-A has none | 1. GET `/buyer/sellers/S1/rating`. 2. Add a product review of 1 on P-A. 3. GET again | | Seller rating stays "5.00" and count 1 | | Not Tested | E-API |
| SEP-02 | P-04 | Seller service rating does not change the product rating | P-A product reviews [5] | 1. GET P-A reviews. 2. Add an order review of 1 for the seller. 3. GET again | | P-A average stays "5.0" and count 1 | | Not Tested | E-API |
| SEP-03 | P-04 | Seller behaviour does not lower the product rating | P-A reviews [5,5] | 1. Record a seller cancellation and a missed reply (trust events) for S1. 2. GET P-A reviews | | Product average and count unchanged | | Not Tested | E-API, E-DB |
| SEP-04 | P-04 | Poor product condition (1-star product review) vs seller trust | Completed order; product review 1; seller (order) review 5 | 1. Read trust score | | **Current code**: `ratingSignals` 1 (product review counts). **Requirement**: must not penalize the seller automatically. Result is expected to fail the requirement. Report as Conflict C3 | | Not Tested | E-API, E-DB |
| SEP-05 | P-04 | Poor seller service (1-star seller review) with a 5-star product | Completed order; order review 1; product review 5 | 1. Read trust score. 2. GET product reviews | | Trust `ratingSignals` 1 (service signal counts). Product average unchanged at 5.0 | | Not Tested | E-API |
| SEP-06 | P-04, R-05 | Ranking input uses the approved source | S1: order reviews [5]; product reviews [1] | 1. Read ranking reliability | | **Current**: 3.0 (both tables). **Requirement**: use the approved source only (Q-05). Record and flag | | Not Tested | E-LOG |
| SEP-07 | P-04, R-05 | Ranking tier effect of product ratings | Seller whose product reviews are low and order reviews high | 1. Run WSV ranking check for the seller before and after adding 5 low product reviews | | Record whether tier changes; any change confirms product ratings leak into seller reliability | | Not Tested | E-LOG |
| SEP-08 | P-04 | Written feedback is context, not points | Seller with 3 written comments, no ratings ≤2 | 1. Read trust score | | `writtenFeedbackCount` 3; `weightedPoints` 0 | | Not Tested | E-API |
| SEP-09 | R-04 | Low product review triggers a trust check (current behaviour) | Completed order | 1. POST product review rating 2. 2. Check `trust_actions` and server log | | Trust action evaluated (code runs `evaluateTrustAction` for ratings ≤2 on both routes). Record for Q-05 | | Not Tested | E-DB, E-LOG |
| SEP-10 | P-04 | Review of one seller never touches another | Two sellers, one review each | 1. Add a 1-star review for S1 | | S2 rating, count, trust points unchanged | | Not Tested | E-API |
