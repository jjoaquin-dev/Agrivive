---
title: Web Typography Nunito Header and PT Sans Body Alignment
date: 2026-10-26
type: delivery
status: completed
related_documents:
  - "[[2026-10-26 Web Color Palette Alignment]]"
  - "[[2026-10-26 Web Spacing, Padding, and Sizing Standards Alignment]]"
---

# Web Typography Nunito Header and PT Sans Body Alignment

## Overview
Updated the web application typography system to replace Inter font with **Nunito** for all headers and **PT Sans** for subheaders, body text, buttons, and captions. Ensured all headers are strictly constrained between **500 and 700** font weights (medium, semibold, and bold), eliminating heavy 800, 900, and 1000 weights across the UI.

## Typography Changes
1. **Google Fonts Import (`web/app/layout.tsx`)**:
   - Replaced Inter with:
     - `Nunito:wght@500;600;700`
     - `PT+Sans:ital,wght@0,400;0,700;1,400;1,700`
2. **Design Tokens (`web/src/styles/tokens.css`)**:
   - `--font-heading: "Nunito"`
   - `--font-subheading: "PT Sans"`
   - `--font-body: "PT Sans"`
   - Set base `body` font to `"PT Sans"`.
   - Set base `h1`–`h6` headers to `"Nunito"` with default weights 600–700.
   - Added safety rule capping any `.font-heading.font-black`, `.font-heading.font-extrabold`, and `h1`–`h6` to max `font-weight: 700`.
   - Updated Leaflet popup font to `"PT Sans"`.
3. **Tailwind Configuration (`web/tailwind.config.ts`)**:
   - `heading`: `["var(--font-heading)", "Nunito", "ui-sans-serif", "system-ui", "sans-serif"]`
   - `subheading`: `["var(--font-subheading)", "PT Sans", "ui-sans-serif", "system-ui", "sans-serif"]`
   - `body`: `["var(--font-body)", "PT Sans", "ui-sans-serif", "system-ui", "sans-serif"]`
   - `sans`: `["var(--font-body)", "PT Sans", "ui-sans-serif", "system-ui", "sans-serif"]`
4. **Header Weight Normalization across Components**:
   - Replaced all `font-black` (900) and `font-extrabold` (800) classes on headers with `font-bold` (700) or `font-semibold` (600).

## UI/UX & Psychological Principles
- **Aesthetic-Usability Effect** (*Masaaki Kurosu & Kaori Kashimura*): Nunito's organic, friendly curves paired with PT Sans's crisp, highly-legible humanist forms create an approachable yet professional agricultural marketplace aesthetic.
- **Miller's Law & Chunking** (*George A. Miller*): Clear visual distinction between Nunito headers and PT Sans content chunks improves scanning and readability of produce listings.
- **Don't Make Me Think** (*Steve Krug*): Calibrated header boldness (500–700) prevents harsh visual aggression while maintaining immediate visual hierarchy.

## Affected File Paths
- `web/app/layout.tsx`
- `web/src/styles/tokens.css`
- `web/tailwind.config.ts`
- `web/src/features/home/components/HomeHero.tsx`
- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/components/SiteHeader.tsx`
- `web/src/features/home/components/LandingHeader.tsx`
- `web/src/features/home/components/HomeCategories.tsx`
- `web/src/features/home/components/HomeContactSocialModal.tsx`
- `web/src/features/home/components/HomeFarmerFaq.tsx`
- `web/src/features/home/components/HomeFeaturedProduce.tsx`
- `web/src/features/home/components/HomeFeaturedProduceCard.tsx`
- `web/src/features/home/components/HomeFinalCta.tsx`
- `web/src/features/home/components/HomeFooter.tsx`
- `web/src/features/home/components/HomeHowItWorks.tsx`
- `web/src/features/home/components/HomeImpactTestimonials.tsx`
- `web/src/features/home/components/HomeMarketPulse.tsx`
- `web/src/features/home/components/HomeSellerSection.tsx`
- `web/src/features/home/components/HomeWhyAgrivive.tsx`
- `web/src/features/home/components/HomeWhySurplus.tsx`
- `web/src/features/home/components/HomeWhySurplusCard.tsx`
- `web/src/features/marketplace/components/MarketplaceHero.tsx`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
- `web/src/features/marketplace/components/MarketplaceCategories.tsx`
- `web/src/features/marketplace/components/MarketplaceSellerSection.tsx`
- `web/src/features/marketplace/components/ReviewSummaryCard.tsx`
- `web/src/features/marketplace/components/SellerMapModal.tsx`
- `web/src/features/notifications/components/BuyerNotifications.tsx`

## Verification
- Executed `bun run typecheck` (`tsc --noEmit`) in `web/` with zero errors.
