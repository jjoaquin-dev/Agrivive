---
title: Low Stock Alert Field Restored
type: delivery
date: 2026-11-01
status: code complete, no device check
---

# Low Stock Alert Field Restored

## What changed

Add Produce and Edit Product have the "Alert me when stock is low (optional)" field again. The number is saved as `lowStockThreshold`. When the amount left reaches it after a reservation, the backend already sends the seller a "running low" notice (`buyer.order.reserve.ts`). Leaving it empty turns the alert off; clearing it on Edit saves `null`.

No backend change: create and update already accepted the field.

Files: `mobile/src/features/inventory/components/ProductForm.tsx`, `ProductFormOperations.tsx`.

## Verification

`bun run typecheck` in `mobile/` passed. Not tested on a device.
