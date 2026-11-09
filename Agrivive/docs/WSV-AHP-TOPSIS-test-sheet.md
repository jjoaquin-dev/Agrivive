# AHP–TOPSIS Multi-Criteria Decision Visibility Engine: Test Sheet

**Project/System:** Agrivive
**Tester:** Jara Joaquin T. Jara
**Test Date:** ____________________
**Build/Version:** ____________________
**Environment:** ____________________
**Overall Result:** ____________________

**Instruction:** Read each test scenario carefully, perform the stated action, and compare the actual result with the expected result. Mark P for Passed or F for Failed and add a short remark for any issue found.

## Preconditions (apply to WSV-001 to WSV-012)

1. `VISIBILITY_POLICY` is not set to `visibility-v4` (AHP-TOPSIS is the default). Restart the API after any change to `backend/.env`.
2. Seed a feed of at least 5 other active listings from sellers with complete public profiles. Vary their age, price drop, stock and seller rating.
3. TOPSIS ranks each listing against the others. A score only means something compared with the same feed. A lone listing scores exactly 0.50.
4. Criteria (all raw values, all counted as bigger is better): posting age in hours, price drop (base price minus current price), stock left, and seller reliability (average order service rating out of 5, or 2.5 with no reviews).
5. Weights come from the AHP matrix: 0.351, 0.351, 0.189 and 0.109 in the order above.
6. The six-hour freshness window only belongs to the old `visibility-v4` formula, not to AHP-TOPSIS.

| Test Case ID | Test Scenario / Description | Expected Result | Actual Result | Status | Remarks |
| ------------ | --------------------------- | --------------- | ------------- | ------ | ------- |
| WSV-001 | Check the criteria weights (AHP). Read the weights the engine computes from its pairwise matrix. | Weights are posting age 0.351, price drop 0.351, stock level 0.189 and seller reliability 0.109. They add up to 1. The consistency ratio is about 0.004, which is under the 0.10 limit. | | | |
| WSV-002 | Compare an old listing with a new one (Posting Age). Seed a feed. Publish two listings with the same price, stock and seller rating, one posted 5 hours ago and one posted just now. | The older listing ranks above the newer one. Listing age counts as bigger is better, so produce that has waited longer is shown first. | | | |
| WSV-003 | Compare a listing with a lower price against the same listing at full price (Price Drop). Use two listings with the same age, stock and seller rating. Lower the price of one with a price drop. | The listing with the bigger peso drop (base price minus current price) ranks higher. | | | |
| WSV-004 | Compare a full-stock listing with a nearly empty one (Stock Level). Use two listings with the same age, price drop and seller rating, one with 20 kg and one with 2 kg. | The listing with more stock ranks higher. | | | |
| WSV-005 | Compare a well-rated seller with a low-rated seller (Seller Reliability). Use two listings that are the same except for the seller's average order rating (for example 4.8 and 2.0). | The listing from the higher-rated seller ranks higher. Only the order service stars count. Product stars are not part of it. | | | |
| WSV-006 | Publish a listing from a new seller with no reviews (Cold-Start). Log in as a seller with 0 reviews and publish a fresh sitaw listing. | The listing publishes with no error. The seller counts as 2.5 out of 5 (the middle of the scale), and the rank comes from the other three criteria. | | | |
| WSV-007 | View a feed with only one eligible listing (Single Listing). Hide or sell out every other listing so only one remains. | The one listing scores exactly 0.50 and still appears in the feed. | | | |
| WSV-008 | Hide listings from sellers who are not ready (Eligibility). Use a seller whose profile setup is not finished (for example no map pin saved yet), a seller whose email is not verified, and a seller who is paused or inactive, each with an active listing. Open the marketplace feed. Then finish the setup, verify the email or end the pause and refresh. | The listings from sellers who are not ready do not appear. A seller with a complete, active profile still appears. After the seller is ready, the listing appears again. | | | |
| WSV-009 | Reserve the last remaining kilograms of a listing (Sold Out). Reserve so the quantity becomes 0. | The listing leaves the feed. The product page says Sold out, ordering is disabled, and more reservations are refused. | | | |
| WSV-010 | Publish two listings 5 minutes apart with the same criteria (Tie-Breaking). Refresh the feed several times. | The order never changes between refreshes. When scores tie, the newer listing is first, then the larger listing id. | | | |
| WSV-011 | Scroll the feed with more than 20 listings (Cursor Paging). Load page 2 with the returned cursor. Then try a cursor older than 60 minutes. | Page 2 follows in score order with no repeats and no skipped listings. An old cursor gives 400 "Invalid marketplace cursor". | | | |
| WSV-012 | Switch the ranking back and forth (Safe Rollback). Set VISIBILITY_POLICY=visibility-v4, restart and refresh. Then set any other value or remove it, restart and refresh. | With visibility-v4 the old formula runs and the API says visibilityPolicyVersion visibility-v4. Any other value, or no value, gives AHP-TOPSIS (visibility-ahptopsis-v1). No errors either way. | | | |

## Known behaviors to keep in mind

- **Older listings rank higher.** Posting age is bigger-is-better, so produce that has waited longer is shown first.
- **Scores are relative.** The same listing can score differently when other listings join or leave the feed.
- **Sold-out items are not in the feed.** The "Sold out" badge appears on product pages and the wishlist.
- **Paging re-ranks each page.** A new listing or a stock change between pages can shift scores and cause a repeat or a skip.
