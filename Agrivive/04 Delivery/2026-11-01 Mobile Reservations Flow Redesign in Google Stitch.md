---
title: Mobile Reservations Flow Redesign in Google Stitch
type: delivery
date: 2026-11-01
---

# Mobile Reservations Flow Redesign in Google Stitch

## What Changed

Generated 16 high-fidelity mobile UI mockups in Google Stitch project `AGRIVIVE MOBILE UI` (`11184471743007910085`) under design system `assets/f47dfb9bbc764f6b9ea16ff85a7b3e78` ("Lush Agro-Commerce") covering the complete seller **Reservations** flow: list view with filters, detailed order cards, loading/empty/error states, pending/completed/cancelled details, cancellation and report sheets, full-screen camera QR scanner, dynamic produce handover adjustment sheet, and proposed pickup completion screen.

All frames strictly follow Agrivive's design system tokens (Forest Green `#0F920F`, Inter typography, 4px spatial rhythm, 44px/48px Fitts's law touch targets, tinted status pills), anti-hallucination rules (zero invented fields; buyer displayed solely as `Buyer #{buyerId.slice(0, 8)}`), and UX psychological laws (Jakob's Law, Fitts's Law, Serial Position Effect, Visibility of System Status, Recognition over Recall, Error Prevention, Law of Similarity, Peak-End Rule, and Dieter Rams' principles).

### Generated Google Stitch Frames (16)

1. **A1 (Reservations · Waiting Filter)**: `projects/11184471743007910085/screens/ca583fca1116488c8ce22ef70f146f91`
   - Active "Waiting" chip, R1 card with 5 kg Tomato, pickup deadline clock banner, and scan QR action button.
2. **A2 (Reservations · All Filter & Pagination)**: `projects/11184471743007910085/screens/83ee95573a484707ac7992751011581a`
   - Active "All" filter displaying R1 (Pending), R2 (Completed), R3 (Cancelled), R4 (Expired), and 44px pagination controls.
3. **A3 (Reservations · Loading Skeleton)**: `projects/11184471743007910085/screens/bd1519026858427885e14b95e6680480`
   - Three animated card skeleton shapes using `surfaceMuted` (`#F9FAFB`) instead of a single spinning indicator.
4. **A4 (Reservations · Empty State for Waiting)**: `projects/11184471743007910085/screens/5c5232b0ce6e478e9047083a4d331e2b`
   - Plain words: "No one is waiting" / "New reservations show up here."
5. **A5 (Reservations · Could Not Load Error State)**: `projects/11184471743007910085/screens/2700f6130de74b04b429efb2e35c3b35`
   - Error tinted card (`#FEF2F2`, border `#FECACA`), descriptive error message, and secondary "Try Again" button.
6. **B (Reservation Details · R1 Pending)**: `projects/11184471743007910085/screens/249092967d694720a87c76939fe08c6d`
   - Stack header "Reservation", pickup warning card, full item breakdown, buyer question with answer input, quiet reference card, and sticky bottom bar ("Scan Pickup QR" + "Cancel Reservation").
7. **B' (Reservation Details · R2 Completed)**: `projects/11184471743007910085/screens/3c67083a1a1a48c980e5d32b68c58323`
   - Completed state, green "Picked up" badge, 5-star rating display (4/5), review response form, no sticky bar.
8. **B" (Reservation Details · R3 Cancelled)**: `projects/11184471743007910085/screens/05b2f928c7b743dfa33cb66790115335`
   - Cancelled state, red badge, cancellation reason in Reference card, no sticky bar.
9. **B1 (Cancel Reservation Sheet)**: `projects/11184471743007910085/screens/067546e4878d4a4c99e10e3a9dc7cd58`
   - 20px radius bottom sheet, 5-character validation counter/helper text, destructive confirmation button, ghost "Keep Reservation".
10. **B2 (Report a Problem Sheet)**: `projects/11184471743007910085/screens/7bfbc74bbf4a403b959c1a50ce2cd0cd`
    - Reason chips (Pickup problem, Conduct, Listing inaccurate, Other), 0/2,000 details counter, proof file selector, and success state.
11. **C1 (Camera Permission Modal)**: `projects/11184471743007910085/screens/11299990a2ca409cbbaf6e32ca5ba3ec`
    - White background, 42px green camera icon, "Allow Camera" primary CTA, "Not Now" ghost dismissal.
12. **C2 (Active QR Scanning Viewfinder)**: `projects/11184471743007910085/screens/0f287d1efa0447a5831f657a4710dfd7`
    - Dark camera overlay, 260×260 rounded reticle with corner guides, 44px top-left close button, high-contrast instructions.
13. **C4 (Invalid QR Error State)**: `projects/11184471743007910085/screens/08109ab2fbc24dcab81f4c93229497cb`
    - White bottom card, AlertCircle icon, plain copy: "This is not an Agrivive pickup code.", and secondary "Scan Again" CTA.
14. **D1 (Handover Sheet · Full Reserved Amount)**: `projects/11184471743007910085/screens/4f3ab0989a49492d904aa81680870904`
    - Scale weighing notice, 44px stepper controls (disabled `+` button at max), "Full amount" green pill, "Finish Pickup" CTA.
15. **D2 (Handover Sheet · Produce Lowered to 4 kg)**: `projects/11184471743007910085/screens/78e2b190a5b641778e3670f32e6d8c4c`
    - Tomato quantity adjusted from 5 kg to 4 kg, active stock restoration pill ("1 kg goes back to your stock"), updated total ₱1,190.00.
16. **E (Pickup Done · Proposed Completion State)**: `projects/11184471743007910085/screens/2a218a10cd174f57bb4a5aabc7580da1`
    - Peak-End celebratory confirmation: 64px green checkmark, "Pickup done!", ₱1,190.00 summary, "View Reservation", and "Scan Another".

## Affected Codebase Files Mapped

- `mobile/app/(app)/(tabs)/orders.tsx`
- `mobile/app/(app)/orders/[id].tsx`
- `mobile/app/(app)/orders/scan.tsx`
- `mobile/app/(app)/_layout.tsx`
- `mobile/app/(app)/(tabs)/_layout.tsx`
- `mobile/src/features/orders/types.ts`
- `mobile/src/features/orders/orderFormat.ts`
- `mobile/src/features/orders/components/OrderCard.tsx`
- `mobile/src/features/orders/components/OrderStatusBadge.tsx`
- `mobile/src/features/orders/components/OrderItemsList.tsx`
- `mobile/src/features/orders/components/OrderHandoverSheet.tsx`
- `mobile/src/features/orders/components/OrderHandoverItemRow.tsx`
- `mobile/src/features/orders/components/SellerOrderCommunication.tsx`
- `mobile/src/features/orders/components/SellerOrderReportModal.tsx`
- `mobile/src/components/PaginationControl.tsx`
- `mobile/src/theme/index.ts`

## Verification

- Grounding inspection performed against all 16 codebase source files.
- All 16 mobile frames verified in Google Stitch with valid session IDs, URLs, and screenshots.
- Zero extra fields added; strict adherence to existing data contracts.
