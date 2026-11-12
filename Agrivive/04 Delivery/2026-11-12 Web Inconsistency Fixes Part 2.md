---
title: Web Inconsistency Fixes Part 2
type: delivery
date: 2026-11-12
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Related: [[2026-11-12 Web Inconsistency Fixes and Mobile Sheets]]

## Done
- Colours: brand and grey hex values in classes moved to `agrivive-*` tokens in `tailwind.config.ts` (new: ink, forest, stone, gray, line, mist, paper, lime, wash). About 150 one-off hex classes remain.
- Font sizes `text-[Npx]` moved to Tailwind sizes. Bare `rounded` and `rounded-3xl` snapped. Tap targets under 44px raised.
- New `web/src/lib/format.ts`: the only date, time and number formatters (en-PH, Asia/Manila). Pesos go through `formatPeso`. About 30 files switched.
- `loading.tsx` for cart, messages, notifications, profile, favorites, seller page, admin, stakeholder, overview (shared `PageLoading`), plus `app/error.tsx`.
- Blocking a seller in chat uses the confirmation dialog, not `window.confirm`.
- Modal layers: dialogs at z-100, toasts at z-110. Focus ring added where `outline-none` had none. Disabled buttons all at 50% opacity. Errors use `text-destructive`. "…" used everywhere. Numbers use tabular figures.
- Files over 200 lines split (conversation row, notice link and time, product pickup box, sign-up email message). Unused duplicate `ui/Button.tsx` removed (the real Button is `components/ui/button.tsx`).
- Profile page has a hidden `h1`.

## Left on purpose
- Raw `<img>` (user photos and previews), page widths (1000, 1180, 1600, 1720 are per design), the placeholder X link in the contact modal (real account unknown).

## Checks
Web typecheck and build pass. Not seen in a browser.
