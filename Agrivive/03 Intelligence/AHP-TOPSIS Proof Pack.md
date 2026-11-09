---
title: AHP-TOPSIS Proof Pack
type: intelligence
last_updated: 2026-11-08
---

# AHP-TOPSIS Proof Pack

Answers the prof checklist of 2026-11-04 (Jara, sections A to D). Every number below was produced by the real engine (`backend/src/utils/ahp-topsis`) and checked by hand. Related: [[Weighted Surplus Visibility]], [[Marketing Boost]], [[Seller Analytics]], [[Boost Ranking Flow AHP-TOPSIS]], [[2026-11-08 Prof Feedback Jara Items]].

## Words used (kept apart on purpose)

| Word | Meaning | Where it comes from |
|---|---|---|
| Freshness (posting age) | Hours since the listing was posted. Bigger = older = shown sooner | Posting time |
| Price drop | Starting price minus today's price, in pesos | Seller price |
| Stock left | How much is still available | Current quantity |
| Seller reliability | The seller's average star rating out of 5 | Buyer reviews |
| Closeness score | How close a listing is to the best listing. 0 to 1, shown as 0 to 100 | TOPSIS result. Not listing age |

"Past surplus" (how often the same produce was posted) is a **definition only**. It is not one of the four ranking criteria in the current engine. The old prototype formula used it; see [[Weighted Surplus Visibility]].

## Current weights (these are the ones in the code)

| Criterion | Weight |
|---|---|
| Freshness (posting age) | 0.3507 (35.1%) |
| Price drop | 0.3507 (35.1%) |
| Stock left | 0.1892 (18.9%) |
| Seller reliability | 0.1093 (10.9%) |

Consistency ratio 0.0038, which is under the 0.10 limit. The older 40/30/20/10 weights belong to the old prototype and are no longer used.

## Six hours

- The six hours is one rule: a boosted listing is locked for 6 hours (`boostLockHours = 6`), and the old prototype score counts a listing as fully aged after 6 hours (`freshnessWindowHours = 6`). Both are typed in code, so changing them needs a code change and a release. They are not a setting.
- Why 6: the DA advised it. Mark this as the DA's advice in the paper, not as a farm-science fact.
- The prototype value was 12 hours before 2026-11-08. It is now 6 in code, in the stock warning on the phone ("over 6 hours old"), and in the vault.

## Sample listings

| Listing | Posted (hours ago) | Starting price | Price now | Price drop | Stock left | Seller rating |
|---|---|---|---|---|---|---|
| A | 12 | ₱40 | ₱32 | 8 | 40 | 4.8 |
| B | 8 | ₱30 | ₱26 | 4 | 25 | 4.5 |
| C | 4 | ₱25 | ₱25 | 0 | 60 | 4.0 |
| D | 1 | ₱20 | ₱20 | 0 | 15 | 3.6 |

## Hand math

**Step 1. Divide each column by its length** (square root of the sum of squares).

| Column | Working | Length |
|---|---|---|
| Freshness | √(12² + 8² + 4² + 1²) = √225 | 15.0000 |
| Price drop | √(8² + 4² + 0² + 0²) = √80 | 8.9443 |
| Stock left | √(40² + 25² + 60² + 15²) = √6050 | 77.7817 |
| Seller reliability | √(4.8² + 4.5² + 4.0² + 3.6²) = √72.25 | 8.5000 |

**Step 2. Scaled scores** (value ÷ length). Example: A freshness = 12 ÷ 15 = 0.8000.

| Listing | Freshness | Price drop | Stock left | Reliability |
|---|---|---|---|---|
| A | 0.8000 | 0.8944 | 0.5143 | 0.5647 |
| B | 0.5333 | 0.4472 | 0.3214 | 0.5294 |
| C | 0.2667 | 0.0000 | 0.7714 | 0.4706 |
| D | 0.0667 | 0.0000 | 0.1928 | 0.4235 |

**Step 3. Weighted scores** (scaled × weight). Example: A freshness = 0.8000 × 0.3507 = 0.2806.

| Listing | Freshness | Price drop | Stock left | Reliability |
|---|---|---|---|---|
| A | 0.2806 | 0.3137 | 0.0973 | 0.0617 |
| B | 0.1870 | 0.1568 | 0.0608 | 0.0579 |
| C | 0.0935 | 0.0000 | 0.1460 | 0.0514 |
| D | 0.0234 | 0.0000 | 0.0365 | 0.0463 |

**Step 4. Best and worst listing** (biggest and smallest in each column).

| | Freshness | Price drop | Stock left | Reliability |
|---|---|---|---|---|
| Best | 0.2806 | 0.3137 | 0.1460 | 0.0617 |
| Worst | 0.0234 | 0.0000 | 0.0365 | 0.0463 |

**Step 5. Distance to best and worst.** Example, listing A:
- To best: √(0² + 0² + (0.1460 − 0.0973)² + 0²) = 0.0487
- To worst: √((0.2806 − 0.0234)² + 0.3137² + (0.0973 − 0.0365)² + (0.0617 − 0.0463)²) = √0.1685 = 0.4105

**Step 6. Closeness score** = distance to worst ÷ (distance to best + distance to worst). Example, A: 0.4105 ÷ (0.0487 + 0.4105) = 0.8940, which is 89.4 out of 100.

| Rank | Listing | To best | To worst | Closeness | Shown on screen |
|---|---|---|---|---|---|
| 1 | A | 0.0487 | 0.4105 | 0.8940 | 89.4 / 100 |
| 2 | B | 0.2015 | 0.2283 | 0.5311 | 53.1 / 100 |
| 3 | C | 0.3654 | 0.1301 | 0.2626 | 26.3 / 100 |
| 4 | D | 0.4204 | 0.0000 | 0.0000 | 0.0 / 100 |

The seller card shows the score as `89.4 / 100` (closeness × 100, one decimal). A closeness of 0.8940 is above 0.60, so it is in the Priority range of the paper.

**Tier ranges in the paper** (not yet shown by the app): 60 and above = Priority Boost, 40 to 59.9 = Standard, below 40 = Basic/Hold. The app shows the score and rank today. The tier label is not built yet. Tier columns below apply the paper ranges by hand to the real scores.

## Test table

| # | Situation | Tier expected | Score the system gave | Tier from the paper ranges | Match |
|---|---|---|---|---|---|
| 1 | Sample A (oldest, biggest drop, good rating) | Priority Boost | 89.4 | Priority Boost | Yes |
| 2 | Sample B (middle of everything) | Standard | 53.1 | Standard | Yes |
| 3 | Sample C (new, no drop, lots of stock) | Basic/Hold | 26.3 | Basic/Hold | Yes |
| 4 | Sample D (newest, no drop, least stock, lowest rating) | Basic/Hold | 0.0 | Basic/Hold | Yes |
| 5 | One listing is best in every column (X, with Y and Z) | Priority Boost | 100.0 | Priority Boost | Yes |
| 6 | One listing is worst in every column (Z) | Basic/Hold | 0.0 | Basic/Hold | Yes |
| 7 | Only one listing in the feed | Standard (nothing to compare) | 50.0 | Standard | Yes |
| 8 | Four identical listings | Standard (a tie) | 50.0 each | Standard | Yes |
| 9 | Every value is zero | Standard, no crash | 50.0 each | Standard | Yes |

Scores are relative to the other listings in the same feed. Case 7 shows this: a lone listing always gets 50.0.

## Change one value (proves the weights matter)

| Change | Before | After | What moved |
|---|---|---|---|
| A freshness 12 hours → 1 hour | A 89.4 Priority Boost | A 53.7 Standard | B rises to 63.8 Priority Boost and takes rank 1 |
| C freshness 4 hours → 12 hours | C 26.3 Basic/Hold | C 42.6 Standard | C stays rank 3 |
| D price drop 0 → ₱8 (price ₱20 → ₱12) | D 0.0 Basic/Hold | D 45.5 Standard | D jumps from rank 4 to rank 3 |
| B stock left 25 → 2 (smaller weight) | B 53.1 Standard | B 49.1 Standard | Tier stays. The move is only 4 points, because stock counts 18.9% |

Freshness and price drop (35.1% each) change tiers. Stock (18.9%) moves a score by a few points.

## Who sees what

- Buyers see no rank and no score on any screen. Sellers see only their own score and rank on the Visibility card.
- One caution: the buyer API still sends a hidden `visibilityScore` number with each product. The buyer website uses it only to sort, and shows it nowhere. Say "buyers see no rank on any screen" in the paper, not "the system never sends a score to buyers".

## n8n split: backend decides, n8n posts

- The backend ranks listings (AHP-TOPSIS), applies the 6-hour lock and decides which listing to boost. n8n only receives a boost id and a reason (`initial` or `follow_up`), then fetches the product details from the protected API.
- Proof that the choice is made before n8n: `pickBoostCandidate` in `backend/src/utils/visibility-ranking/boost-select.ts`, 6 tests pass (run 2026-11-08). A listing still locked from a boost in the last 6 hours is skipped even if it ranks first.
- The 60/40 tier gate is not in the code yet. Today the backend gate is rank plus the 6-hour lock, and it is the same for every listing. A Hold listing is not blocked by a tier. Do not claim it is until the tier check is built.
- Where automation stops: the seller taps Boost for the first post of a listing. After that, the 6-hour follow-up (price cut by the seller's peso amount, never below the final price, then the second post) runs by itself. Automatic ranked posting without a tap exists only when `AUTO_BOOST_ENABLED=true` on the server and the seller turned on auto-post. It is off by default.
- Buyer alert: when the price drops, the **seller** gets an app notice (`price_lowered`), and the new price goes out in the Facebook and Instagram post. A direct buyer notification for a price drop is not built.

## Sell-through (analytics)

Sell-through = picked-up quantity ÷ posted quantity × 100, for the chosen days. The same formula is in `seller.analytics.metrics.ts`.

| Sample | Posted | Picked up | Sell-through |
|---|---|---|---|
| Carrots, these days | 50 kg | 35 kg | 35 ÷ 50 × 100 = 70.0% |

The dashboard shows "How Much Sold" with the same percentage, or "N/A" when nothing was posted. Check on a phone with this sample before the demo.

## Dashboard items checked in code (2026-11-08)

| Item | Result |
|---|---|
| Sell-through rate card | Present, same formula |
| Pie chart | There is no pie chart. "Pickup Results" is two bars (picked up, not picked up) and "Stock Right Now" splits stock by sack, kilo and pile |
| Date filter | Chooses the days to look at |
| This period vs last period (example carrot) | Pick the produce in the filter. The Sold card shows the change against the days before |
| Inventory vs sales chart | "Where Your Produce Went" (posted, picked up, waiting, cancelled, expired) plus "Stock Right Now" |
| Description under every chart | Added 2026-11-08 |
| Repeat listings table with sell-through | Not built. The screen shows only a count of repeats |
| "Period Comparison" table | The component exists but is not shown on the screen |
