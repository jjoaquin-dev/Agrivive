# Grouped Review Test Cases (Professor Requirement)

**Status of the feature: not implemented.** The web order page (`OrderReviews.tsx`) shows one seller form and one form per item. There is no grouping, no "rate the whole group" button, no group endpoint, and no category fields. These cases therefore start with one baseline check of today's behaviour and then describe what to verify once the requirement is approved.

**Nothing here has been executed.** Actual Result is blank and Status is Not Tested for every case.

## Open points that block exact expected results

- The professor's feedback mentions **three rating categories**. They are **not named in any project document**, so they are not invented here. Cases write them as **Category 1, 2, 3 (names TBD)** and are marked **Q-01**.
- Whether a "group" is five items **inside one order**, or five items across orders, is undefined (**Q-02**). One order always belongs to one seller (multi-seller carts are split), so in-order grouping stays within one seller. Cases assume in-order grouping and say so.
- What the single group submission stores (one row per item, or one row per group) is undefined (**Q-02**). Cases assume **one review row per item** so existing tables and rating math keep working, and flag every place that depends on it.
- Whether a missing category answer blocks submission is undefined (**Q-08**).

Questions are listed in `06 Professor Clarification Questions.md`.

## Group split reference

Items are taken in the order the order page lists them, five per group.

| Items in order | Groups | Group sizes |
|---|---|---|
| 1 | 1 | 1 |
| 4 | 1 | 4 |
| 5 | 1 | 5 |
| 6 | 2 | 5, 1 |
| 10 | 2 | 5, 5 |
| 11 | 3 | 5, 5, 1 |
| 12 | 3 | 5, 5, 2 |
| 50 (checkout maximum) | 10 | 5 each |

## Test data

`O1`, `O5`, `O6`, `O10`, `O11`, `O12` are completed orders of B1 to S1 with 1, 5, 6, 10, 11 and 12 items. `O12-PEND` is a pending order with 12 items. Product names are distinct.

| ID | Requirement | Scenario | Preconditions | Test Steps | Sample Test Data | Expected Result | Actual Result | Status | Evidence Required |
|---|---|---|---|---|---|---|---|---|---|
| GRP-00 | P-02 | Baseline: today's order page has no grouping | B1 on O6 (completed, 6 items) | 1. Open the order detail page. 2. Count review forms and group buttons | 6 items | **Gap**: 1 seller form plus 6 item forms; no group button; no category inputs | | Not Tested | E-UI |
| GRP-01 | P-02 | 5 items form exactly one group | Feature built; B1 on O5 | 1. Open the order's review section | 5 items | One group of 5 with one "rate this group" button | | Not Tested | E-UI |
| GRP-02 | P-02 | 6 items form two groups | O6 | 1. Open review section | 6 items | Groups of 5 and 1; each has its own button | | Not Tested | E-UI |
| GRP-03 | P-02 | 10 and 11 items split correctly | O10, O11 | 1. Open each | 10 / 11 items | 10: 5+5. 11: 5+5+1. No item missing or repeated | | Not Tested | E-UI |
| GRP-04 | P-02 | 1 item still shows a group | O1 | 1. Open review section | 1 item | One group of 1 with its button (or the approved single-item behaviour, Q-02) | | Not Tested | E-UI |
| GRP-05 | P-02 | Group order is stable | O6 | 1. Open page twice, refresh, open on mobile width | | Same items land in the same groups every time | | Not Tested | E-UI |
| GRP-06 | P-02, P-03 | One button submits the entire group | O5 | 1. Fill Category 1, 2, 3 for the group. 2. Press the group button once | all 5 star values chosen | One request or action; reviews recorded for all 5 items; success message once | | Not Tested | E-UI, E-API, E-DB |
| GRP-07 | P-02 | Every item in the group is saved to the right product | O5 with items P1 to P5 | 1. Submit the group. 2. Query reviews by `ordered_item_id` | 5 items | 5 rows, each with the correct `ordered_item_id`, `product_id`, buyer, seller | | Not Tested | E-DB |
| GRP-08 | P-03 | Three categories are all captured | O5 | 1. Choose a different value in each category. 2. Submit. 3. Read back | e.g. 5, 3, 1 | Each category value is stored and read back separately. **Blocked by Q-01** (names, scale, where stored) | | Not Tested | E-API, E-DB |
| GRP-09 | P-03 | Category value limits | O5 | 1. Submit with 0, 6, 3.5, text and missing values for one category | | Each rejected with a message beside the field (per AGENTS.md inline errors). Scale per Q-01 | | Not Tested | E-API, E-UI |
| GRP-10 | P-02 | Incomplete group (fewer than 5 items) can be submitted | O11 (last group has 1 item) | 1. Rate the group of 1 | | Accepted if approved; reviews saved for that 1 item only (Q-02) | | Not Tested | E-UI, E-DB |
| GRP-11 | P-02, P-03 | Group submitted with a category left empty | O5 | 1. Leave Category 2 empty. 2. Press button | | Behaviour matches Q-08 (blocked with inline error, or accepted). Nothing partial is saved if blocked | | Not Tested | E-UI, E-DB |
| GRP-12 | P-02 | Multiple groups, submitted one at a time | O12 (5, 5, 2) | 1. Submit group 1. 2. Reload. 3. Submit group 2, then 3 | | After each step only that group shows as rated; the others stay open; totals add to 12 rows | | Not Tested | E-UI, E-DB |
| GRP-13 | P-02 | Multiple groups, independent values | O12 | 1. Give group 1 high values, group 2 low values | | Each item holds its own group's values; no leakage between groups | | Not Tested | E-DB |
| GRP-14 | P-02 | Whole order submitted twice | O5 | 1. Submit group. 2. Submit the same group again (second tab) | | Second attempt refused with 409-style message; still 5 rows | | Not Tested | E-API, E-DB |
| GRP-15 | P-02, P-07 | Group contains an item already reviewed individually | O5, item 3 reviewed earlier | 1. Open the group. 2. Submit | | Behaviour per Q-02: item 3 skipped and shown as rated, or group blocked. Never a duplicate row | | Not Tested | E-UI, E-DB |
| GRP-16 | P-02 | Partial failure is all-or-nothing | O5; force the 4th item to fail (test environment) | 1. Submit group | | Either all 5 saved or none; user sees one clear error and can retry safely | | Not Tested | E-API, E-DB |
| GRP-17 | P-02, R-06 | Group review blocked for incomplete orders | O12-PEND; also cancelled and expired 12-item orders | 1. Open each order page. 2. Try the group endpoint directly | | No group controls shown; direct calls refused (409) | | Not Tested | E-UI, E-API |
| GRP-18 | P-02, R-06 | Group review by another buyer | B2 against B1's O5 | 1. Call the group action as B2 | | Refused (404) | | Not Tested | E-API |
| GRP-19 | P-02, P-04 | Group review and seller rating stay separate | O5 | 1. Submit group review. 2. GET seller rating | | Seller service rating does not move unless the seller form is also submitted | | Not Tested | E-API |
| GRP-20 | P-02, P-04 | Product averages update after a group | 5 products with ratings [5] each | 1. Submit group with category values (aggregation rule per Q-01) | | Each product's `count` +1; average follows the approved rule for turning three categories into the stored star | | Not Tested | E-API |
| GRP-21 | P-02, R-04 | Low group result and trust points | O5 | 1. Submit group with low values on all 5 items | | Trust points follow the approved rule; one order counts once (see CALC-15). Confirm no 5x penalty | | Not Tested | E-API |
| GRP-22 | P-02 | Optional comment and photo in a group | O5 | 1. Submit group with and without comment; try a photo | | Comment optional. Photo only if approved (P-01); otherwise absent | | Not Tested | E-UI |
| GRP-23 | P-02 | Large order (50 items) | 50-item completed order | 1. Open review section. 2. Submit group 10 | 50 items | 10 groups, page stays usable, no timeout, 5 rows saved for group 10 | | Not Tested | E-UI, E-DB |
| GRP-24 | P-02 | Phone width and keyboard use | O6 at 400px width | 1. Operate the group form by touch and by keyboard | | No horizontal scroll; buttons at least 48px high; all controls reachable by keyboard | | Not Tested | E-UI |
