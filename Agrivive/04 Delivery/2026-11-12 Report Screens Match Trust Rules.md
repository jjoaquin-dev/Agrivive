---
title: Report Screens Match Trust Rules
type: delivery
date: 2026-11-12
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Mechanism: [[Trust and Flagging]]

## Why
The report screens said different things from the system. Both asked for 5 characters but the server needs 20. The mobile text promised "our review team", which no longer exists. The seller app offered "Listing inaccurate", which the server would count against the buyer.

## What changed
- Web `OrderReportModal.tsx` and mobile `SellerOrderReportModal.tsx`: 20-character minimum with a counter, a line saying a report alone adds no points and each order can be reported once, a warning about false reports (buyer side), and a hint under the reason saying whether it counts (conduct, QR misuse and listing inaccurate count when 2 different people report the same thing; pickup problem and other are saved only).
- Success text on both: adds no points by itself; a second person reporting the same thing confirms it.
- Reasons moved to `web/src/features/orders/reportReasons.ts`. Mobile drops "Listing inaccurate" and calls the conduct option "Buyer conduct".
- Backend `utils/trust/report.ts`: a seller report with reason `listing_inaccurate` is refused with 400. New test in `pickup.flow.test.ts`.

## Verification
Typecheck clean (backend, web, mobile); `bun test` 269 pass, 0 fail; `dist` rebuilt. Screens not opened on a device or browser.
