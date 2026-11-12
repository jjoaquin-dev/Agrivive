---
title: Web Inconsistency Fixes and Mobile Sheets
type: delivery
date: 2026-11-12
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Related: [[2026-11-12 Mobile Inconsistency Fixes]]

## Mobile
- Sign-out now turns push off for the phone first (`disableNotificationDevice`), using the device id saved at registration.
- Border radius, spacing and icon sizes snapped to fixed scales (4px rhythm).
- New `mobile/src/components/SlideModal.tsx`: the dim background fades in place and only the sheet slides. 19 bottom sheets use it.

## Web
- Deleted 19 unused files (old header, animation wrappers, profile cards, unused hooks, Card).
- Page titles added for cart, marketplace, product, seller, orders, order, profile, messages, notifications, favorites, sign-in pages, admin and stakeholder pages.
- Search boxes and the "what happened" box have accessible names. Two buttons got `type="button"`. A broken `hover:bg-[#457D00]/90/90` class was fixed.
- Report and reservation dialogs close on Escape (`src/hooks/useEscapeKey.ts`). Two dialogs got `role="dialog"`.
- Wrong point numbers removed from buyer copy (the real points come from AHP). Terms and privacy text now describe trust points, the 90-day window, two-person reports, the explain and dispute steps, and that only a block can be lifted by email code.

## Not done
- Colours still hard-coded (`#457D00` and others), arbitrary font sizes, shared date and number formatters, the unused `ui/Button` (raw buttons everywhere), missing `loading.tsx` and `error.tsx`, `window.confirm` in chat block.

## Checks
Web typecheck and build, mobile typecheck and Android export all pass. Nothing seen in a browser or on a phone.
