# AHP–TOPSIS Multi-Criteria Decision Visibility Engine: Test Sheet

**Project/System:** Agrivive
**Tester:** Jara Joaquin T. Jara
**Test Date:**
**Build/Version:**
**Environment:**
**Overall Result:**

**Instruction:** Read each scenario, perform the action, and compare the actual result with the expected result. Mark P (Passed) or F (Failed) and add a short remark for any issue.

## Preconditions (apply to WSV-001 to WSV-009)

1. In `backend/.env`, set `VISIBILITY_POLICY=visibility-ahptopsis-v1`, then restart the API.
2. Seed a feed of at least 5 other active, marketable listings from sellers with complete public profiles (verified email, shop name, address, phone, map pin). Vary their age, remaining stock and seller rating.
3. TOPSIS ranks each listing against the others in the feed. A score is only meaningful relative to that seeded set. A lone listing always scores exactly 0.50 (Standard Exposure).
4. Weights: freshness 0.40, stock 0.30, seller reliability 0.20, recurrence 0.10.
5. Freshness is `1 − age/12 h` (1.0 when new, 0 at 12 h or older).
6. Tiers: Priority Boost at 0.60 or higher, Standard Exposure at 0.40 to below 0.60, Basic/Hold below 0.40.
7. Seller reliability is average order rating ÷ 5, or 0.50 when the seller has no reviews.
8. Recurrence is the seller's prior listing cycles of the same vegetable and unit in the last 30 days, divided by 3 and capped at 1.

| Test Case ID | Test Scenario / Description | Expected Result | Actual Result | Status | Remarks |
|---|---|---|---|---|---|
| WSV-001 | Publish a brand-new active tomato listing (10 kg, ₱40/kg) with 100% stock, a clear photo and a pickup location, from an active, well-rated seller, into the seeded feed. | The listing publishes successfully. Its score is 0.60 or higher (Priority Boost), and it appears at or near the top of the marketplace feed. The API returns `visibilityTier: "priority"` and `visibilityPolicyVersion: "visibility-ahptopsis-v1"`. | | | |
| WSV-002 | View an active cabbage listing published 6 hours ago with 50% stock left (5 of 10 kg) from an average-rated seller, in the seeded feed. | The API returns `visibilityTier: "standard"` (score 0.40 to below 0.60) and the listing sits in the middle of the feed, below fresher full-stock listings. | | | |
| WSV-003 | View an active eggplant listing published over 12 hours ago with 1 kg left of 20 kg from an unrated or low-rated seller, in the seeded feed. | The API returns `visibilityTier: "basic"` (score below 0.40) and the listing sits near the bottom of the feed. | | | |
| WSV-004 | Log in as a new seller with no order reviews and publish a fresh 15 kg sitaw listing. | The listing publishes without errors. Seller reliability is the neutral 0.50, and its rank is set by freshness and stock against the other listings. | | | |
| WSV-005 | Publish a fresh pechay listing from a seller who has listed pechay (same unit) 3 or more times in the last 30 days. Compare it with a fresh pechay listing from a first-time seller with the same stock and rating. | Recurrence is 1.0 for the repeat seller and 0 for the first-time seller. The repeat seller's listing scores higher and ranks above the other. | | | |
| WSV-006 | Reserve the last remaining kilograms of an active squash listing so that its quantity becomes 0. | The listing no longer appears in the marketplace feed (`productQty > 0` filter). On the product page `availability` is `sold_out`, the web page shows a "Sold out" state with ordering disabled, and further reservations are rejected. | | | |
| WSV-007 | Publish two vegetable listings (for example Carrots and Okra) 5 minutes apart with the same starting stock, seller rating and cycle history. Refresh the feed several times. | The order stays the same on every refresh with no swapping. The more recently published listing ranks first. Exact score ties break by newest publish time, then by listing id. | | | |
| WSV-008 | Open the buyer marketplace with more than 20 active listings. Scroll or tap Next Page using the returned `nextCursor` within 60 minutes. | Page 2 loads in descending score order with no duplicates and no skipped items, provided no listing is published and no stock changes between pages. A cursor older than 60 minutes returns 400 "Invalid marketplace cursor". | | | |
| WSV-009 | As a seller, open the Boost screen for an active listing in the mobile app ("Boost this produce?") and confirm the boost. | The screen shows the "Ready to Boost" headline and the boost is queued. Only one boost is allowed per listing, and a cooldown message ("Almost Time") appears after a recent boost. The seller's listing tier is shown as "Top spot" for Priority listings. *Note: the boost is not gated by Priority tier in the code read; verify that gating separately if it is required.* | | | |
| WSV-010 | Set `VISIBILITY_POLICY=visibility-v4` in `backend/.env`, restart the server and refresh the marketplace. Then set `VISIBILITY_POLICY=visibility-ahptopsis-v1`, restart and refresh. | With `visibility-v4`, the marketplace switches to the baseline formula (0.40 × posting age + 0.40 × remaining stock + 0.20 × recurrence, Priority at 0.70) with no errors, and the API reports `visibilityPolicyVersion: "visibility-v4"`. With `visibility-ahptopsis-v1`, AHP–TOPSIS ranking returns. | | | |

## Known behaviors to keep in mind

- **Baseline favors older listings.** Under `visibility-v4`, posting age is `age/12 h`, so older listings score higher. Under AHP–TOPSIS, older listings score lower. Do not compare tiers across the two policies.
- **Sold-out items are not in the feed.** The "Sold out" badge appears on product pages, cards that still load the product, and the wishlist.
- **Pagination re-ranks each page.** AHP–TOPSIS recalculates the ranking for the 500 newest candidates on every request. A new listing or a stock change between pages can shift relative scores and cause a duplicate or skipped item.
- **Boost details.** The mobile Boost screen text names the Agrivive Facebook Page. Confirm the Instagram path with the owner before writing it into an expected result.
