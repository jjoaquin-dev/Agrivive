# Review System Test Cases

Covers eligibility, submission, display, editing and the seller reply. Rating math is in `02`, grouped review in `03`.

**Nothing here has been executed.** Every Actual Result is blank and every Status is Not Tested. Fill both only from a real run.

## Conventions

Requirement IDs (R-xx from project documents, P-xx from the professor items in the task) are defined in `04 Requirements Traceability Matrix.md`.

Evidence codes: **E-API** request and response (OpenAPI or Postman, with status code), **E-DB** SQL result of the named table, **E-UI** screenshot of the screen, **E-LOG** server log line.

Paths are relative to the API root. Buyer routes need a buyer session, seller routes a verified seller session.

## Shared test data

| Name | Meaning |
|---|---|
| B1, B2 | Active buyer accounts |
| S1, S2 | Verified sellers. S1 owns products P-A (Tomato), P-B (Eggplant), P-C (Okra) |
| O1 | B1 to S1, **completed**, 1 item (P-A) |
| O3 | B1 to S1, **completed**, 3 items (P-A, P-B, P-C) |
| O-PEND / O-CANC / O-EXP | B1 to S1 in status pending / cancelled / expired, 1 item each |
| O-B2 | B2 to S1, completed, 1 item |

`{rt}` and `{pt}` below mean the seller review route `POST /buyer/orders/:id/review` and the product review route `POST /buyer/orders/:id/items/:itemId/review`.

## A. Review eligibility

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Test Data | Expected Result | Actual Result | Status | Evidence Required |
|---|---|---|---|---|---|---|---|---|---|
| ELG-01 | R-01, R-06 | Completed order can get a seller review | B1 signed in; O1 completed; no review for O1 | 1. POST `{rt}` for O1 | `{"rating":5,"review":"Fresh and on time"}` | 201. Row in `order_reviews` with buyer B1, seller S1, rating 5 | | Not Tested | E-API, E-DB |
| ELG-02 | R-01, R-06 | Completed order item can get a product review | B1; O1 completed; no review for the item | 1. POST `{pt}` for O1 and its item | `{"rating":4}` | 201. Row in `product_reviews` with matching `ordered_item_id` and `product_id` | | Not Tested | E-API, E-DB |
| ELG-03 | R-06 | Cancelled order cannot be reviewed (seller) | O-CANC exists | 1. POST `{rt}` for O-CANC | `{"rating":3}` | 409 "Only completed orders can be reviewed". No row created | | Not Tested | E-API, E-DB |
| ELG-04 | R-06 | Cancelled order cannot be reviewed (product) | O-CANC | 1. POST `{pt}` for its item | `{"rating":3}` | 409 same message. No row | | Not Tested | E-API, E-DB |
| ELG-05 | R-06 | Expired order cannot be reviewed | O-EXP | 1. POST `{rt}`. 2. POST `{pt}` | `{"rating":3}` | Both 409. No rows | | Not Tested | E-API, E-DB |
| ELG-06 | R-06 | Incomplete (pending) order cannot be reviewed | O-PEND | 1. POST `{rt}`. 2. POST `{pt}` | `{"rating":5}` | Both 409. No rows | | Not Tested | E-API, E-DB |
| ELG-07 | R-06 | Order that becomes cancelled after a pending state stays unreviewable | O-PEND then cancel it | 1. Cancel O-PEND. 2. POST `{rt}` | `{"rating":1}` | 409. No row | | Not Tested | E-API, E-DB |
| ELG-08 | P-07 | One seller review per order: duplicate blocked | ELG-01 done | 1. POST `{rt}` for O1 again with a different rating | `{"rating":1}` | 409 "Order already reviewed". Original row unchanged (still 5) | | Not Tested | E-API, E-DB |
| ELG-09 | P-07 | One product review per item: duplicate blocked | ELG-02 done | 1. POST `{pt}` again for same item | `{"rating":1}` | 409 "This product has already been reviewed for this order". Row unchanged | | Not Tested | E-API, E-DB |
| ELG-10 | P-07 | Interpretation check: one seller review plus one review per item is allowed on the same order | O3 completed, no reviews | 1. POST `{rt}` for O3. 2. POST `{pt}` for each of the 3 items | `{"rating":4}` each | 4 rows total (1 order, 3 product), all 201. **Flag for Q-07**: "one review per completed order" may mean only the seller review | | Not Tested | E-API, E-DB |
| ELG-11 | R-01 | Double submit race (two parallel requests) | O1 with no review | 1. Send two identical `{rt}` calls at the same moment | `{"rating":5}` x2 | Exactly one 201 and one 409. Exactly one row | | Not Tested | E-API, E-DB |
| ELG-12 | R-06 | Another buyer cannot review the order | O1 belongs to B1; sign in as B2 | 1. POST `{rt}` for O1 | `{"rating":5}` | 404 "Order not found". No row | | Not Tested | E-API, E-DB |
| ELG-13 | R-06 | Item id from a different order is rejected | B1 has O1 and O3 | 1. POST `{pt}` with O1's order id and an item id from O3 | item of O3 | 404 "Order item not found". No row | | Not Tested | E-API, E-DB |
| ELG-14 | R-01 | Seller role cannot use buyer review routes | Signed in as S1 | 1. POST `{rt}` for any order | `{"rating":5}` | Rejected (expect 403; confirm actual code). No row | | Not Tested | E-API |
| ELG-15 | R-01 | Signed-out request rejected | No session | 1. POST `{rt}` | `{"rating":5}` | Rejected (expect 401; confirm actual code) | | Not Tested | E-API |
| ELG-16 | R-01 | Unknown or malformed order id | B1 signed in | 1. POST `{rt}` with a random valid uuid. 2. POST with id `abc` | uuid / `abc` | 1: 404. 2: schema error (expect 422; confirm) | | Not Tested | E-API |
| ELG-17 | R-06 | Product eligibility endpoint lists only completed purchases | B1 has O1 (completed) and O-PEND, O-CANC of P-A | 1. GET `/buyer/products/{P-A}/review-eligibility` | P-A id | `purchases` contains only the completed item(s); reviewed ones carry a `review` object, others `null` | | Not Tested | E-API |
| ELG-18 | R-06 | Eligibility for unknown product | B1 | 1. GET eligibility with a random uuid | random uuid | 404 "Marketplace product not found" | | Not Tested | E-API |
| ELG-19 | R-06 | Web hides review forms unless completed | O1 completed, O-PEND pending | 1. Open order detail for each as B1 | | O1 shows "Rate your pickup" forms. O-PEND shows none (`OrderDetail.tsx` gates on `completed`) | | Not Tested | E-UI |
| ELG-20 | R-01 | Review saved but trust step fails (risk) | Force `evaluateTrustAction` to fail (test environment only) | 1. POST `{rt}` with rating 1. 2. Retry same call | `{"rating":1}` | Record what happens. Code suggests 1: 500 with the row saved. 2: 409. Report as defect if the user sees an error for a saved review | | Not Tested | E-API, E-DB, E-LOG |

## B. Rating submission

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Test Data | Expected Result | Actual Result | Status | Evidence Required |
|---|---|---|---|---|---|---|---|---|---|
| SUB-01 | R-01 | Product star boundaries accepted | Fresh completed orders | 1. POST `{pt}` with rating 1. 2. Another item with 5 | 1 and 5 | Both 201; stored values 1 and 5 | | Not Tested | E-API, E-DB |
| SUB-02 | R-01 | Seller star boundaries accepted | Two completed orders | 1. POST `{rt}` rating 1 on one. 2. rating 5 on other | 1 and 5 | Both 201 | | Not Tested | E-API, E-DB |
| SUB-03 | R-01 | Invalid rating values rejected (seller route) | O1 unreviewed | 1. POST `{rt}` once per value | 0, 6, -1, 3.5, "5", "abc", null, `{}` (no rating) | Every call rejected (expect 422). No row for O1 | | Not Tested | E-API, E-DB |
| SUB-04 | R-01 | Invalid rating values rejected (product route) | Item unreviewed | Same as SUB-03 on `{pt}` | same values | Every call rejected. No row | | Not Tested | E-API, E-DB |
| SUB-05 | R-01 | Comment is optional (omitted) | O1 | 1. POST `{rt}` with rating only | `{"rating":4}` | 201; `review` is null | | Not Tested | E-API, E-DB |
| SUB-06 | R-01 | Empty comment stored as null | O1 | 1. POST with `"review":""` | `{"rating":4,"review":""}` | 201; `review` null | | Not Tested | E-API, E-DB |
| SUB-07 | R-01 | Whitespace-only comment stored as null | O1 | 1. POST with spaces and a newline | `"review":"   \n "` | 201; `review` null | | Not Tested | E-API, E-DB |
| SUB-08 | R-01 | Comment is trimmed | O1 | 1. POST with padded text | `"review":"  Good  "` | 201; stored `Good` | | Not Tested | E-API, E-DB |
| SUB-09 | R-01 | Comment length limit | Two reviewable orders | 1. POST 2000-char comment. 2. POST 2001-char comment | 2000 / 2001 chars | 1: 201. 2: rejected (expect 422), no row | | Not Tested | E-API, E-DB |
| SUB-10 | R-01 | Unicode and emoji comment | O1 | 1. POST comment with Filipino text, emoji, quotes | `"review":"Sariwa! 🍅 \"ok\" <b>"` | 201; stored and shown back exactly; no markup is rendered | | Not Tested | E-API, E-UI |
| SUB-11 | R-01 | Script text is not executed on display | SUB-10 stored `<script>alert(1)</script>` | 1. View the review on the product page and seller page | script string | Shown as plain text; no alert | | Not Tested | E-UI |
| SUB-12 | P-01 | Optional photo: field is not supported today | O1 | 1. POST `{rt}` with an extra `photoUrl` or multipart file | `{"rating":5,"photoUrl":"x.jpg"}` | **Gap**. Record actual result (field ignored or rejected). No photo is stored because no column exists. Mark requirement Not Implemented | | Not Tested | E-API, E-DB |
| SUB-13 | P-01 | Photo attach control absent in UI | B1 on O1 | 1. Open the review forms | | Record whether any photo control exists. Code shows none | | Not Tested | E-UI |
| SUB-14 | R-01 | Multiple products in one order, each rated separately | O3 | 1. POST `{pt}` for item 1 rating 5, item 2 rating 3, item 3 rating 1 | 5, 3, 1 | 3 rows, each linked to its own product id; no cross-effect | | Not Tested | E-API, E-DB |
| SUB-15 | R-01 | Some items reviewed, others left open | O3 | 1. Review item 1 only. 2. GET each item's review | | Item 1: 200. Items 2 and 3: 404 "Review not found". Later review of item 2 still works | | Not Tested | E-API |
| SUB-16 | R-01 | Order rated, products not (and reverse) | O1 | 1. POST `{rt}` only. 2. Another order: `{pt}` only | | Each type independent; no forced pairing | | Not Tested | E-API, E-DB |
| SUB-17 | R-01 | Web submit stays disabled with no star | B1 on O1 | 1. Leave stars empty and look at the button. 2. Pick a star | | Button disabled with no star; enabled after picking | | Not Tested | E-UI |
| SUB-18 | R-01 | Web duplicate message | O1 already reviewed from another tab | 1. Submit again from a stale tab | | Message "This review was already sent..." and the form refreshes to the saved rating | | Not Tested | E-UI |
| SUB-19 | R-01 | Read back own review | ELG-01 done | 1. GET `/buyer/orders/:id/review`. 2. As B2 call the same | | 1: 200 with the row. 2: 404 | | Not Tested | E-API |

## C. Review editing

Editing does not exist in the code (no route, no `updated_at`). These cases confirm the gap today and describe the checks to run **after** professor approval of an edit rule. The 15-day figure is **unconfirmed** (Conflict C2, Question Q-06), so the period below is written as `{N}` days.

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Test Data | Expected Result | Actual Result | Status | Evidence Required |
|---|---|---|---|---|---|---|---|---|---|
| EDT-01 | P-06 | Edit route does not exist today | ELG-01 done | 1. PATCH, PUT and POST to `/buyer/orders/:id/review` with a new rating | `{"rating":2}` | **Gap**. PATCH/PUT not found (404/405); POST returns 409. Rating stays 5 | | Not Tested | E-API, E-DB |
| EDT-02 | P-06 | Web has no edit control | B1 on reviewed O1 | 1. Look for an edit action on the saved rating | | None shown today | | Not Tested | E-UI |
| EDT-03 | P-06 | Edit inside the approved period (after approval) | Edit feature built; review age < `{N}` days | 1. Edit rating 5 to 3 and comment | `{"rating":3}` | 200. Same row id; `updated_at` set; rating 3 | | Not Tested | E-API, E-DB |
| EDT-04 | P-06 | Edit after the period is refused | Review age > `{N}` days (move clock or backdate row in test DB) | 1. Try to edit | | Refused with a clear message; row unchanged | | Not Tested | E-API, E-DB |
| EDT-05 | P-06 | Boundary day (N, N+1) | Backdate to exactly `{N}` days and `{N}`+1 days | 1. Edit at each age | | Matches the approved boundary rule (inclusive or exclusive per Q-06) | | Not Tested | E-API |
| EDT-06 | P-06 | Edit does not create a duplicate | EDT-03 done | 1. Count rows for the order or item | | Still 1 row | | Not Tested | E-DB |
| EDT-07 | P-06 | Product average updates after edit | Product with ratings 5,5; edit one 5 to 1 | 1. GET `/marketplace/products/:id/reviews` before and after | 5,5 then 5,1 | Average 5.0 then 3.0; breakdown shifts; count unchanged | | Not Tested | E-API |
| EDT-08 | P-06 | Seller rating updates after edit | Seller with one order review 5; edit to 1 | 1. GET `/buyer/sellers/:id/rating` before and after | 5 then 1 | 5.00 then 1.00 | | Not Tested | E-API |
| EDT-09 | P-06, R-04 | Trust score after editing a low rating up | Order review 1 counted as 1 trust point; edit to 5 | 1. Read trust monitoring score before and after | 1 then 5 | Rating signal drops by 1. Note: a warning or pause already issued is not undone unless the policy says so (confirm with Q-06) | | Not Tested | E-API |
| EDT-10 | P-06 | Edit up to a low rating adds trust points | Order review 5; edit to 1 | 1. Read trust score | 5 then 1 | Rating signal rises by 1 and trust action is evaluated | | Not Tested | E-API |
| EDT-11 | R-02 | Seller reply survives an edit | Review has a seller reply | 1. Edit the rating | | `seller_response` unchanged (or policy-defined) | | Not Tested | E-DB |
| EDT-12 | P-06 | Only the author can edit | B2 tries to edit B1's review | 1. Edit as B2 | | 404 or 403; unchanged | | Not Tested | E-API |
| EDT-13 | P-06 | Which clock starts the period | Order completed day 0, review day 5 | 1. Try edit at day 16 and day 21 | | Behaviour matches the approved starting point (order completion vs review time, Q-06) | | Not Tested | E-API |

## D. Seller reply

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Test Data | Expected Result | Actual Result | Status | Evidence Required |
|---|---|---|---|---|---|---|---|---|---|
| RSP-01 | R-02 | Seller answers an order review once | ELG-01 done, S1 verified | 1. POST `/seller/orders/O1/review-response` | `{"response":"Thank you!"}` | 200; `seller_response` set | | Not Tested | E-API, E-DB |
| RSP-02 | R-02 | Second answer refused | RSP-01 done | 1. Post another response | `{"response":"Again"}` | 404 "Unanswered review not found"; first reply kept | | Not Tested | E-API, E-DB |
| RSP-03 | R-02 | Another seller cannot answer | S2 signed in | 1. POST response on O1 | | 404; no change | | Not Tested | E-API |
| RSP-04 | R-02 | Seller answers a product review | ELG-02 done; id of product review | 1. POST `/seller/product-reviews/:id/reply` | `{"response":"Glad you liked it"}` | 200; reply stored; second call 404 | | Not Tested | E-API, E-DB |
| RSP-05 | R-02 | Empty or oversize response rejected | Unanswered review | 1. Post `""`. 2. Post 2001 chars | | Both rejected; no change | | Not Tested | E-API |
| RSP-06 | R-02 | Reply appears on public pages | RSP-04 done | 1. GET `/marketplace/products/:id/reviews` | | The review shows `sellerResponse` | | Not Tested | E-API, E-UI |

## E. Display

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Test Data | Expected Result | Actual Result | Status | Evidence Required |
|---|---|---|---|---|---|---|---|---|---|
| DSP-01 | R-01 | Product reviews list, newest first, max 10 | P-A with 12 reviews | 1. GET `/marketplace/products/{P-A}/reviews` | 12 reviews | `reviews` has 10 items, newest first; `count` is 12 | | Not Tested | E-API |
| DSP-02 | R-01 | Buyer name masked | Buyer named "Nena Cruz"; one-word name; no name | 1. View reviews of each | | "Nena C."; "Maria"; "Verified buyer" | | Not Tested | E-API, E-UI |
| DSP-03 | R-01 | Product with no reviews | New product | 1. GET reviews. 2. Open product page | | `count` 0, `average` null, empty list, empty-state text, no NaN | | Not Tested | E-API, E-UI |
| DSP-04 | R-01 | Star breakdown adds up | P-A with 5,5,4,2 | 1. GET reviews | | breakdown 5:2, 4:1, 2:1, others 0; total equals count | | Not Tested | E-API |
| DSP-05 | R-01 | Review form appears only for buyers with a completed purchase | B1 with and without completed P-A order | 1. Open P-A page as each | | Form for B1 with a completed purchase; none otherwise | | Not Tested | E-UI |
| DSP-06 | R-02 | Seller sees order reviews and product reviews on mobile | S1 with both kinds | 1. Open Reviews screen and switch the Seller/Product tabs | | Each tab lists only its own kind; filters (all/unanswered/replied, star) work | | Not Tested | E-UI |
| DSP-07 | R-01 | Public seller reviews | S1 with reviews | 1. GET `/buyer/sellers/:id/reviews` signed out | | 200 with summary and up to 10 reviews | | Not Tested | E-API |
