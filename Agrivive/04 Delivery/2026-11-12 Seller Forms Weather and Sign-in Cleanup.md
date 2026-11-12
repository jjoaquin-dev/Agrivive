---
title: Seller Forms, Weather and Sign-in Screens Cleanup
type: delivery
date: 2026-11-12
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Related: [[2026-11-12 Seller Boost Screens Cleanup]]

# Seller forms, weather and sign-in screens cleanup

**Add Produce.** Pill tabs for Kilogram, Sack and Pile with a solid green chosen pill (the Add More and Take Away tabs match), 15 labels, 13 helper text, white optional boxes, pale dashed photo box, white footer.

**Weather and Holidays.** Advice card first, then the weather card with a 40 temperature, 17 section titles, soft amber for rain, white page and cards.

**Sign in, Sign up, Onboarding and code screens.** Website white page, 28 titles, 15 subtitles and labels, 1 px light input outlines, a softer glow on the Sign In button, a calmer password rules box, a lighter slide shadow. Sign in and Sign up now start below the status bar (they used to sit under the clock).

**Files.** `mobile/app/(auth)/login.tsx`, `register.tsx`, `onboarding.tsx`, `mobile/src/features/auth/components/` (`AuthScreenShell`, `PasswordChecklist`, `GoogleSignInButton`), `mobile/app/(app)/advisories.tsx` and `mobile/src/features/advisories/components/`, `ProductFormStyles.ts`, `ProductPhotoField.tsx`, `StockActionTabs.tsx`, `InputComponent.tsx`.

**Checked.** Mobile typecheck. Not seen on a phone.
