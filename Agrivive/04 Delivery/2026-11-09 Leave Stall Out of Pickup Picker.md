---
title: Leave Stall Out of Pickup Picker
type: changelog
date: 2026-11-09
---

# 2026-11-09 Leave Stall Out of Pickup Picker

Up: [[Delivery Index 2026-11]] · Latest: [[00-LATEST]] · Related: [[2026-11-09 Flagging Rules Without Admin]]

**Problem:** A cart with two stalls needed a pickup time for both. A stall that had not set opening hours kept **Review order** locked, so the stall that was set up could not be reserved.

**Change:** Each stall in the pickup picker has **Leave this stall out** (and **Add this stall back**). Only the stalls that stay in need a time. The total follows the stalls that stay in. After a successful reservation, only the reserved items leave the cart; the left-out stall's items stay.

**Files:** `web/src/features/reservation/components/ReservePickupModal.tsx`, `web/src/features/cart/components/CartDrawer.tsx`.

**Verification:** `bun run typecheck` in `web/` passes. Not checked in a browser.
