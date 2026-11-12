---
title: Seller Reservations Screens Cleanup
type: delivery
date: 2026-11-11
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]]

# Seller reservations screens cleanup

**What changed.** The Reservations list, the reservation detail and the Report a Problem sheet use the shared website white (`mobile/src/theme/surface.ts`: page `#FDFDFD`, cards `#FFFFFF`, border `#EEECE6`, barely-there shadow).

**List.** The card leads with the produce and the total; the reference and time are small; the pick-up deadline now uses the order's real pick-up time (`pickupEnd`), not the QR end.

**Detail.** The orange banner that repeated the pick-up time (with a different time than the card) is gone. One Pickup time card shows "Buyer picks up by" in large type, the QR end under it, the progress steps, and the Offer a New Pickup Time link. The next thing to do (Confirm this order, Get it ready) is a light green card marked "Next step". Back button now says "Back" instead of "(tabs)".

**Report sheet.** Bigger title, clearer labels, lighter borders, round close button.

**Checked.** Mobile typecheck. Not seen on a phone.
