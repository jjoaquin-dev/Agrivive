---
title: Handover Amount Can Go Up or Down
type: delivery
date: 2026-11-18
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]]

## Why
After scanning a pickup QR, the seller could only lower the amount given. A buyer who takes more than reserved could not be served.

## Done
- API `POST /seller/orders/scan`: `dispensedQuantity` may now be more than reserved. The extra is taken from the listing's stock in the same transaction (guarded: needs enough stock, else 409 "Not enough stock left to give more. Only N more is available."). Less than reserved still returns the rest to stock. Item subtotals and the order total are recalculated. New file `seller.scan-order.items.ts` holds this; `seller.scan-order.ts` calls it.
- Seller app: the Check the Amount sheet lets the plus button go past the reserved amount, shows "N more comes out of your stock", and the done screen says "N more taken from stock". Sheet text explains both directions.
- Setup screen: Save and Continue now shows a "Check Your Stall" pop-up with the first problem and scrolls to the hours when only they need fixing (the button looked dead before); the "Hours Not Saved" box shows the server's reason.
- `API_ENDPOINTS.md` and `backend/dist` updated.

## Checks
Backend and mobile typecheck pass. Not tested with a real scan. Needs API deploy and a new APK.
