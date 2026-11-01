---
title: Scanner, Handover, Report and Pickup Done Reference
type: delivery
date: 2026-11-01
---

# Scanner, Handover, Report and Pickup Done Reference

## What changed

Applied the remaining Stitch "Reservations v1" frames (project `11184471743007910085`): B2 Report sheet, C1 camera permission, C2 scanning, C4 wrong code, D1/D2 handover sheet, E Pickup done.

- Report sheet: "Report a Problem", "We keep this for our review team. Add what happened and any proof.", pill reason chips (44px), "Proof (optional, up to 5 files)", "Add Proof", "Send Report", success "Report sent. Thank you for telling us.", 50% backdrop. Upload and retry logic unchanged.
- Camera permission: back chevron, green camera icon, "Camera access needed", "Allow Camera", "Not Now" (closes).
- Scanning: green corner brackets over the camera, "Align buyer's pickup code within the frame", "Looking for code…", "Checking code…" while the order loads. Wrong code card: "Invalid Code", "This is not an Agrivive pickup code.", "Scan Again". Other failures (network) say "Could Not Check Code" with the real message.
- Handover sheet: "Check the Amount", "Reservation #…", plain note, per item "Reserved 5 kg · ₱60.00 per kg", "Amount given" stepper with units, "+" stays visible but dims at the reserved amount, step is 0.5 for kg and 1 for sacks and piles, pills "1 kg goes back to your stock" / "Full amount", summary "Reserved total" (struck only when changed) and "Collect from buyer", buttons "Finish Pickup" and "Scan Again".
- Pickup done (new, was a proposed state): after a successful pickup, shows "Pickup done!", amount collected, one line per item (given amount and what returned to stock), "View Reservation" and "Scan Another". Before, the app went straight to Reservation details.

Not copied: "Sample data" captions, the "Proposed state" chip, status bar art.

## Files

- `mobile/app/(app)/orders/scan.tsx`
- New: `OrderScanPermission.tsx`, `OrderScanOverlay.tsx`, `OrderPickupDone.tsx` in `mobile/src/features/orders/components/`
- `OrderHandoverSheet.tsx`, `OrderHandoverItemRow.tsx`, `SellerOrderReportModal.tsx`, `seller-order-report.styles.ts`
- `mobile/src/features/orders/orderFormat.ts`

## Verification

`bun run typecheck` in `mobile/` passed. Not run on a device. Camera scanning, the real handover request and the report upload were not exercised. The scan API call and payload are unchanged.
