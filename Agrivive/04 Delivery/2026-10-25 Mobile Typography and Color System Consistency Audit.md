---
title: Mobile Typography and Color System Consistency Audit
date: 2026-10-25
type: delivery
status: verified
related_documents:
  - "[[2026-10-25 Mobile Clean White Background Alignment]]"
  - "[[2026-10-25 Inventory and My Listings UI Replication]]"
  - "[[2026-10-25 Mobile Messages Page UI Replication]]"
  - "[[2026-10-25 Mobile Notifications Page UI Replication]]"
  - "[[2026-10-25 Seller Profile Page UI Enhancement]]"
  - "[[2026-10-25 Seller Analytics Screen UI Enhancement with Gifted Charts]]"
---

# Mobile Typography and Color System Consistency Audit

## What changed

A comprehensive, codebase-wide design audit was executed across all mobile screens (`mobile/app/` and `mobile/src/`) targeting fonts, background colors, font colors, and font sizes to ensure strict consistency with the Figma design system:

1. **Global Tokens & Theme Normalization (`mobile/src/theme/index.ts`)**:
   - `colors.background`: Standardized to pure `#FFFFFF`.
   - `colors.surface`: Standardized to `#FFFFFF`.
   - `colors.surfaceMuted`: Updated to crisp neutral light gray `#F9FAFB` (eliminating legacy beige `#F3EFE6`).
   - `colors.primary`: Updated to Figma vibrant green `#0F920F` (with pressed state `#0C770C`).
   - `colors.primaryLight`: Updated to `rgba(15, 146, 15, 0.10)`.
   - `colors.primarySurface`: Updated to `rgba(15, 146, 15, 0.05)`.
   - `colors.text`: Updated to Figma dark neutral `#111827` (replacing greenish-black `#202622`).
   - `colors.textMuted`: Updated to Figma cool neutral gray `#6B7280` (replacing greenish-gray `#6F776F`).
   - `colors.border`: Updated to neutral cool gray `#E5E7EB` (replacing yellowish cream `#E5E2DA`).
   - `shadows.card` & `shadows.elevated`: Replaced greenish shadow `#1F4D3A` with natural `#000000` with soft opacity.

2. **Native App Configuration (`mobile/app.json`)**:
   - Updated splash screen, adaptive icon background, and expo-splash-screen plugin background colors from `#F8F6F1` to `#FFFFFF` to prevent any cream flash on app startup.

3. **Elimination of Hardcoded Legacy Beige/Cream & Old Dark Green**:
   - `mobile/src/features/profile/components/ProfileHeaderBar.tsx`: Removed hardcoded `#F8F6F1` background & `#E5E2DA` border, aligned with `#FFFFFF` and `colors.border`.
   - `mobile/src/features/profile/components/ProfileVerificationCard.tsx`, `ProfileBusinessInfoCard.tsx`, `ProfileLocationCard.tsx`, `ProfileContactCard.tsx`, `ProfileSettingsList.tsx`: Replaced hardcoded `#E5E2DA` borders with `colors.border`.
   - `mobile/app/(app)/inventory/[id]/index.tsx`: Replaced `#E8E6DF` banner placeholder & `#EFECE6` with `colors.surfaceMuted`, and hardcoded `rgba(31, 77, 58, ...)` with `colors.primaryLight`.
   - `mobile/src/components/map-picker/MapPicker.styles.ts` & `MapPickerMap.tsx`: Replaced `#E8E6DF` with `colors.surfaceMuted` (`#F9FAFB`) and old dark green pin with `#0F920F`.
   - `mobile/src/components/BadgeComponent.tsx`: Replaced `#ECEAE4` with neutral `#F3F4F6` and `"rgba(31, 77, 58, 0.12)"` with `colors.primaryLight`.
   - `mobile/src/components/ButtonComponent.tsx`: Replaced `"rgba(31, 77, 58, 0.08)"` with `colors.primaryLight` and set button font to `fonts.body.semiBold`.
   - `mobile/app/(auth)/onboarding.tsx`: Replaced `#EFECE4` hero background with `colors.surfaceMuted`.
   - `ProductPhotoField.tsx`, `MessageCard.tsx`, `ProductInquiryCard.tsx`, `SellerBoostPromptSection.tsx`, `SellerNotificationCard.tsx`, `SellerPromotionInboxSection.tsx`, `OrderHandoverItemRow.tsx`, `VisibilityBreakdownCard.tsx`, `VisibilityFactorsGrid.tsx`, `account-recovery.styles.ts`, `ActivityStyles.ts`: Replaced hardcoded legacy green tints with `colors.primaryLight` and `colors.primarySurface`.

4. **Typography Hierarchy Standardization**:
   - **Screen Page Titles**: Standardized to `fontSize: 24`, `fontFamily: fonts.heading.bold` (`Manrope_700Bold`), `color: colors.text` (`#111827`), `lineHeight: 32` (Auth headers at `fontSize: 26`).
   - **Modal / Form Subheadings**: Standardized to `fontSize: 20`, `fontFamily: fonts.heading.bold`.
   - **Card / Section Titles**: Standardized to `fontSize: 16`, `fontFamily: fonts.heading.semiBold` (`Manrope_600SemiBold`), `color: colors.text`.
   - **Screen Subtitles**: Standardized to `fontSize: 14`, `fontFamily: fonts.body.regular` (`Inter_400Regular`), `color: colors.textMuted` (`#6B7280`), `lineHeight: 20`.
   - **Body Text**: Standardized to `fontSize: 14`, `fontFamily: fonts.body.regular`, `color: colors.text`.
   - **Metadata / Captions**: Standardized to `fontSize: 12`, `fontFamily: fonts.body.regular` / `medium`, `color: colors.textMuted`.
   - Normalized titles and subtitles in `analytics.tsx`, `boosts.tsx`, `notifications.tsx`, `boost/[productId].tsx`, `register.tsx`, and `password-setup.tsx`.

## Why

- To ensure visual consistency, clean modern contrast, and flawless adherence to Agrivive UI/UX standards (Jakob's Law, Aesthetic-Usability Effect, Gestalt Similarity & Common Region) across all mobile pages.
- Resolves inconsistencies between freshly built screens and older screens that carried legacy dark green, cream backgrounds, and fragmented font sizes.

## Affected paths

- `mobile/src/theme/index.ts`
- `mobile/app.json`
- `mobile/app/(app)/analytics.tsx`
- `mobile/app/(app)/boosts.tsx`
- `mobile/app/(app)/notifications.tsx`
- `mobile/app/(app)/boost/[productId].tsx`
- `mobile/app/(app)/inventory/[id]/index.tsx`
- `mobile/app/(auth)/onboarding.tsx`
- `mobile/app/(auth)/register.tsx`
- `mobile/app/(auth)/password-setup.tsx`
- `mobile/src/components/BadgeComponent.tsx`
- `mobile/src/components/ButtonComponent.tsx`
- `mobile/src/components/map-picker/MapPicker.styles.ts`
- `mobile/src/components/map-picker/MapPickerMap.tsx`
- `mobile/src/features/analytics/components/VisibilityBreakdownCard.tsx`
- `mobile/src/features/analytics/components/VisibilityFactorsGrid.tsx`
- `mobile/src/features/inventory/components/ActivityStyles.ts`
- `mobile/src/features/inventory/components/ProductPhotoField.tsx`
- `mobile/src/features/messages/components/MessageCard.tsx`
- `mobile/src/features/messages/components/ProductInquiryCard.tsx`
- `mobile/src/features/notifications/components/SellerBoostPromptSection.tsx`
- `mobile/src/features/notifications/components/SellerNotificationCard.tsx`
- `mobile/src/features/notifications/components/SellerPromotionInboxSection.tsx`
- `mobile/src/features/orders/components/OrderHandoverItemRow.tsx`
- `mobile/src/features/profile/components/ProfileBusinessInfoCard.tsx`
- `mobile/src/features/profile/components/ProfileContactCard.tsx`
- `mobile/src/features/profile/components/ProfileHeaderBar.tsx`
- `mobile/src/features/profile/components/ProfileLocationCard.tsx`
- `mobile/src/features/profile/components/ProfileSettingsList.tsx`
- `mobile/src/features/profile/components/ProfileVerificationCard.tsx`
- `mobile/src/features/trust/components/account-recovery.styles.ts`
- `Agrivive/04 Delivery/2026-10-25 Mobile Typography and Color System Consistency Audit.md`

## Verification performed

1. **Type Checking**:
   - `export PATH="$HOME/.bun/bin:$PATH" && cd mobile && bunx tsc --noEmit` &rarr; Passed with **0 errors**.
2. **Backend Integrity**:
   - `export PATH="$HOME/.bun/bin:$PATH" && cd backend && bunx tsc --noEmit && bun build src/index.ts --outdir dist --target bun` &rarr; Passed with **0 errors**, bundled successfully.
3. **Automated Token Grep Verification**:
   - Verified 0 remaining occurrences of legacy beige hexes (`#F8F6F1`, `#F3EFE6`, `#E8E6DF`, `#E5E2DA`, `#EFECE6`, `#EFECE4`, `#ECEAE4`).
   - Verified 0 remaining occurrences of legacy green hexes (`#1F4D3A`, `#17392B`, `#3F7D58`).
   - Verified 0 remaining occurrences of legacy text hexes (`#202622`, `#6F776F`).
   - Verified 0 remaining occurrences of hardcoded `rgba(31, 77, 58, ...)`.

## Commits

- `8dc5b3c`: `Enhance notifications and messages UI with real data integration` (Design token standardization, screen title normalization, pure white background alignment)
- `2460b7e`: `style: align profile card border colors to theme tokens` (ProfileVerificationCard, ProfileLocationCard, ProfileBusinessInfoCard)
- `4918600`: `style: align profile contact and settings list border colors to theme tokens` (ProfileContactCard, ProfileSettingsList)
- `9388bde`: `docs: add mobile typography and color system consistency audit delivery note`

