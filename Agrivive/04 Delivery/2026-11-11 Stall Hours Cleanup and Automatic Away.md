---
title: Stall Hours Cleanup and Automatic Away
type: delivery
date: 2026-11-11
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Related: [[2026-11-11 Reserve Confirmation Replaces Pickup Time Picker]]

# Stall hours cleanup and automatic Away

**What changed.** The seller's Stall Hours screen lost the Away switch and the Pickup limits card ("Buyers at the same time", "Pick up within"), because new orders no longer pick a time slot. The day circles (Mon to Sun) are smaller and sit in one row, the schedule blocks are lighter, and From/To use smaller steppers.

**Away is automatic.** A seller who has not used the app for 30 minutes (`AWAY_AFTER_MINUTES` in `backend/src/utils/pickup/seller-presence.ts`) shows as Away to buyers. Activity is `user.lastActiveAt`, now written at most every 5 minutes (was 1 hour). It changes display only.

**Orders while Away.** Orders were never blocked by Away, and still are not. The existing 3-hour auto-confirm (`AUTO_CONFIRM_HOURS`, `pickup.order.auto-confirm.ts`) runs on the order's age only, so it applies to Away sellers too. The 12/24/48-hour reply timers no longer pause for Away (there is no manual Away any more); they still run only while the stall is open.

**Removed.** `PUT /seller/stall/away`, `PUT /seller/stall/settings`, `pickup.stall.away.set.ts`, `pickup.stall.settings.save.ts`, and the manual-Away flow test. Database columns (`away_*`, `pickup_capacity`, `pickup_within_minutes`, `seller_away_periods`) stay for older orders and data. Any manual Away still switched on ends by itself within 14 days.

**Checked.** Backend typecheck, `src/utils/pickup` and `src/modules/pickup` tests (102 pass), mobile typecheck. Not checked on a phone.
