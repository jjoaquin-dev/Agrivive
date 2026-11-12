---
title: Reserve Confirmation Replaces Pickup Time Picker
type: delivery
date: 2026-11-11
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]]

# Reserve confirmation replaces pickup time picker

**What changed.** The "Choose your pickup time" modal is gone. Reserving now opens one confirmation that shows the seller's hours ("available 24 hours" or "6:00 AM to 8:00 PM"), a **Pick it up on or before** date and time, a missed-pickup warning, the total, and **Cancel** / **Reserve**.

**Deadline rule** (`backend/src/utils/pickup/reservation-deadline.ts`): a stall open 24 hours today (or with no hours saved) gives 24 hours after reserving, so 6 AM Sept 17 becomes 6 AM Sept 18. Set hours give 30 minutes before closing today, or the next open day when today is over or closed. The order stores `pickupStart` = reservation time and `pickupEnd` = deadline; the QR stops at `expiresAt`: exactly the deadline for 24-hour stalls (6:01 AM next day is expired), closing time for set hours (pick up by closing minus 30 minutes, but the QR still works until closing, so the seller can hand over late). Old orders keep end + 15 minutes.

**Seller app.** Order screen says "Buyer picks up by ..." and the QR end; the new-time sheet offers a 1-hour range when the old one is longer than 4 hours.

**Side effects.** Late cancellation now counts from `pickupEnd` (within 3 hours of the deadline). The buyer-overlap and seller-capacity checks no longer apply to new orders because there is no chosen slot. Order pages show "Pick up on or before ...". A stall with no hours saved is treated as open 24 hours (before it was refused).

**Files.** Backend: `utils/pickup/reservation-deadline.ts` (+ test), `modules/pickup/services/pickup.terms.read.ts`, `GET /buyer/sellers/:id/reservation-terms`, `buyer.order.persist.ts`, checkout and order models (pickup fields now optional), `qr-window.ts`, `buyer.order.cancel.ts`, `trust/dispute-rules.ts`. Web: `reservation/components/ReservePickupModal.tsx`, `reservation/lib/formatTerms.ts`, `reservation/api/reservation.ts`, `CartDrawer.tsx`, `ProductDetail.tsx`, `OrderQr.tsx`, `OrderPickupStepper.tsx`. `PickupPicker` and `PickupTimeDropdown` removed.

**Checked.** Backend typecheck, `src/utils/pickup`, `src/modules/pickup` and `src/modules/buyer` tests, web typecheck. One pickup flow test was changed to the new late-cancel rule. Not checked: the modal in a browser as a signed-in buyer, and the mobile app (it shows `pickupStart`/`pickupEnd` as a range for sellers).
