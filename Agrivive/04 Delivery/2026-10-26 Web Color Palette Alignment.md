---
title: Complete Web Color Palette Alignment
date: 2026-10-26
type: delivery
status: completed
related_documents:
  - "[[2026-10-25 Find a Seller Nearby Subtle Palette Gradient]]"
  - "[[2026-10-25 Marketplace UI-UX Sections, Gradients, Typography, and Filter Alignment]]"
---

# Complete Web Color Palette Alignment

## Overview
Aligned all web application pages, components, tokens, and Leaflet interactive map overlays to the official 5-color brand palette provided by user reference, while strictly preserving 100% of the existing UI layout, typography hierarchy, spacing, border radiuses, and UX interaction designs without alteration.

## Official 5-Color Brand Palette Applied
1. **Vibrant Forest Green** (`#457D00` | `rgb(69, 125, 0)`):
   - **Primary brand color**: Header logos, active navigation tabs, category labels, primary buttons, price callouts, Leaflet marker highlights, and live inventory badges.
   - **Pressed/Hover Companion**: `#386600` (deep botanical olive).
2. **Golden Olive / Chartreuse** (`#C6C736` | `rgb(198, 199, 54)`):
   - **Transitional botanical wash**: Subtle background glows and card tints.
3. **Fresh Lime / Foliage Green** (`#96B125` | `rgb(150, 177, 37)`):
   - **Secondary botanical accent**: Category filters, selection rings, and card hover borders.
4. **Warm Tangerine / Marigold** (`#FEA938` | `rgb(254, 169, 56)`):
   - **Warm highlight CTA**: Replaced legacy terracotta (`#C97850`); applied to headline curves, discount badges, ratings, and primary hero CTAs.
   - **Pressed/Hover Companion**: `#E99525` / `#B45309`.
5. **Butter Cream / Pale Warm Yellow** (`#FCEC9A` | `rgb(252, 236, 154)`):
   - **Luminous background wash & selection**: Ambient radial lighting, selection highlight background (`::selection`), and footer accent text.

## UI/UX & Psychological Principles
- **Aesthetic-Usability Effect** (*Masaaki Kurosu & Kaori Kashimura*): Unified color harmony evokes fresh, organic agriculture, elevating perceived trustworthiness and visual coherence.
- **Law of Similarity** (*Max Wertheimer, Kurt Koffka, Wolfgang Köhler*): Elements with consistent interactive roles share identical color tokens (`#457D00` for primary actions, `#FEA938` for warm alerts and discount callouts).
- **Von Restorff Effect (Isolation Effect)** (*Hedwig von Restorff*): High-contrast `#FEA938` accents highlight essential value propositions and call-to-action buttons without visual clutter.

## Affected File Paths
- `web/tailwind.config.ts`
- `web/src/styles/tokens.css`
- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/components/BuyerSiteHeaderNav.tsx`
- `web/src/features/home/components/LandingHeader.tsx`
- `web/src/features/home/components/HomeHowItWorks.tsx`
- `web/src/features/home/components/HomeFeaturedProduce.tsx`
- `web/src/features/home/components/HomeFeaturedProduceCard.tsx`
- `web/src/features/home/components/HomeCategories.tsx`
- `web/src/features/home/components/HomeFarmerFaq.tsx`
- `web/src/features/home/components/HomeImpactTestimonials.tsx`
- `web/src/features/home/components/HomeWhySurplus.tsx`
- `web/src/features/home/components/HomeContactSocialModal.tsx`
- `web/src/features/home/components/HomeFinalCta.tsx`
- `web/src/features/home/components/HomeFooter.tsx`
- `web/src/features/marketplace/components/ProductCard.tsx`
- `web/src/features/marketplace/components/MarketplaceCategories.tsx`
- `web/src/features/marketplace/components/MarketplaceHero.tsx`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
- `web/src/features/marketplace/components/MarketplaceSellerSection.tsx`
- `web/src/features/marketplace/components/InteractiveSellerMap.tsx`
- `web/src/features/marketplace/components/seller-map-popup.ts`
- `web/src/features/marketplace/components/MarketplaceFooter.tsx`
- `web/app/(auth)/login/page.tsx`
- `web/app/(auth)/signup/page.tsx`
- `web/src/features/auth/components/SignUpForm.tsx`
- `web/app/(auth)/account-recovery/page.tsx`
- `web/app/(auth)/verify-email/page.tsx`
- `web/src/features/auth/components/AuthInput.tsx`
- `web/src/features/auth/components/AuthShell.tsx`
- `web/src/features/auth/components/LoginRememberRow.tsx`
- `web/src/features/auth/components/OtpCodeInput.tsx`
- `web/src/features/auth/components/PasswordChecklist.tsx`
- `web/src/features/auth/components/PasswordInput.tsx`

## Verification Performed
- **Zero Old Colors Remaining**: Verified with Python AST scan that `#1F4D3A`, `#C97850`, `#2D6A4F`, and old hover shades are completely replaced across the entire `web` codebase.
- **Web Typecheck**: `npm run typecheck --prefix web` (`tsc --noEmit`) exited with code 0.
- **Backend Typecheck & Build**: `cd backend; bunx tsc --noEmit; bun build src/index.ts --outdir dist --target bun` passed with 0 errors (1705 modules bundled in 559ms).
- **200-Line Limit Rule**: Every single modified TypeScript / CSS file strictly verified <= 200 lines.
