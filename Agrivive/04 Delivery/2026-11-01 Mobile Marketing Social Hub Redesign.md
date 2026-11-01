# 2026-11-01 Mobile Marketing Social Hub Redesign

Builds on [[2026-11-01 Boost Facebook and Instagram Flow]] and [[2026-11-01 Mobile Type Scale Consistency]].

## What changed and why
The seller Marketing screen was redesigned to match standard, familiar patterns seen in Facebook, Instagram, Twitter, and modern mobile creator/advertising dashboards (adhering to Jakob's Law: users expect familiar interfaces and recognition over recall).

- **Header & Meta Brand Identity:** Added official Facebook and Instagram identity badges alongside the Marketing title and subtitle, clearly communicating the connected official social channels immediately upon opening the screen.
- **Social Broadcast Hub Banner (`SocialHubBanner.tsx`):** Added a top summary card in the Active tab showing live broadcast status, active broadcast counts, and official platform badges (`#1877F2` for Facebook, `#C13584` for Instagram).
- **Segmented Control Tabs (`MarketingSectionTabs.tsx`):** Styled like modern mobile social app segmented controls with active broadcast count pill badges (`Active (1)`).
- **Price Dropped Social Prompt (`PriceDropPromptList.tsx`):** Redesigned the price-drop prompt to look like a high-visibility social promotion card, with strikethrough original prices (`₱65.00 → ₱58.50`), a Sparkles badge, and prominent `Boost Again` / `Not now` tactile action buttons.
- **Active Campaign Cards (`BoostHistoryCard.tsx`):** Modeled after Facebook Ads / Instagram promotion cards, featuring produce thumbnail photos, social channel badges, live broadcast indicator pills, explicit current/floor pricing blocks, and direct `Manage Boost` actions.
- **Active Section Enhancements (`ActiveBoostsSection.tsx`):** Added a prominent call to action to boost produce from Listings when no boosts are currently running.

## Affected Files
- `mobile/app/(app)/marketing/index.tsx`
- `mobile/src/features/marketing/components/SocialHubBanner.tsx`
- `mobile/src/features/marketing/components/MarketingSectionTabs.tsx`
- `mobile/src/features/marketing/components/PriceDropPromptList.tsx`
- `mobile/src/features/marketing/components/BoostHistoryCard.tsx`
- `mobile/src/features/marketing/components/ActiveBoostsSection.tsx`

## Verification
- Mobile TypeScript typecheck (`cd mobile && bunx tsc --noEmit`) passed with 0 errors.
- Backend TypeScript typecheck (`cd backend && bunx tsc --noEmit`) passed with 0 errors.
- Visual mockup generated with `image-generator` demonstrating the revised design.
