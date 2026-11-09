---
title: Flagging Rules Without Admin
type: changelog
date: 2026-11-09
---

# 2026-11-09 Flagging Rules Without Admin

Up: [[Delivery Index 2026-11]] · Latest: [[00-LATEST]] · Builds on [[2026-11-08 Remove Admin Role from Trust]] · Rules: [[Trust and Flagging]]

**What changed:** The system now follows `Flagging Rules Without Admin 2.pdf`. Levels, 90-day window, fault rate, excuse, Away mode and re-check were already built; the rows marked New were added.

**Built:**
- Missed pickup is +2 every time (the free first miss is gone). Web and mobile text updated.
- Decline at pickup: a seller dispute gives nobody points, closes the order as declined at pickup and does not restock. The disputed order counts only in the fault-rate denominator.
- Orders from own account: refused, +3, account blocked (`self_order` is a serious kind). `utils/trust/self-order.ts`.
- Order flood: more than 5 orders in 7 days, one buyer to one seller, sets `orders.counts_for_ranking = false`. Seller analytics and fault rate skip them. `utils/trust/order-flood.ts`.
- Fake reports: each group of 3 reports in 14 days with none confirmed gives the reporter +1. `utils/trust/fake-reports.ts`.
- Review bomb: `order_reviews.ignored_at`. Ignored ratings leave averages, star counts, ranking reliability, Bayesian rating and low-rating points. Buyers get a 0-point notice. `utils/trust/review-bomb.ts`, `review-counts.ts`.
- Chat: same message 5 times in 10 minutes pauses sending for 10 minutes (HTTP 429); phone or email hides the message. `utils/trust/chat-rules.ts`.
- Dispute re-check now covers `self_order` and `buyer_fake_reports`.

**Migration:** `drizzle/20261109120000_trust_rules_without_admin` adds `order_reviews.ignored_at` and `orders.counts_for_ranking`, and moves old 0-point first misses to 2. Not applied anywhere.

**Verification:** `bunx tsc --noEmit` shows only the 4 old errors in `ahp-test.ts` and `topsis-test.ts`. `bun test` passes file by file: pickup flow 62, policy 28, review 38 and 13, pickup rules 21, fault rate 13. New tests cover self-order, order flood, fake reports, review bomb (both ways) and both chat rules. API build succeeds. Not checked on a phone or browser.

**Limits:**
- The PDF does not say what happens after the 3rd or later event, so the 2nd and 3rd steps repeat.
- Chat spam and personal-data events cannot be settled by a dispute (the hidden text is not kept), so they stay unresolved.
- A fake-report point is not removed if one of the 3 reports is confirmed later.
- A hidden message from a buyer still starts the seller's reply clock; a hidden seller reply does not stop it.
- A phone check of 9 or more digits could hide a long number that is not a phone.
