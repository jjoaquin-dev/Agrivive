---
title: Web Spacing, Padding, and Sizing Standards Alignment
date: 2026-10-26
type: delivery
status: completed
related_documents:
  - "[[2026-10-26 Web Color Palette Alignment]]"
  - "[[2026-10-26 Product Card Typography and Price Size Enhancement]]"
---

# Web Spacing, Padding, and Sizing Standards Alignment

## Overview
Performed a comprehensive UI/UX audit and standardized spacing, padding, dimensions, and responsive alignment across the web application while strictly maintaining 100% of the existing visual style, colors, typography hierarchy, themes, and layouts without alteration.

## Core Adjustments & Corrections
1. **Marketplace Seller Section Responsive Padding & Chevron Sizing**:
   - Replaced invalid Tailwind class `p-4.5` on the section container with `p-4 sm:p-5 lg:p-6` (16px mobile, 20px tablet, 24px desktop) to prevent content colliding flush with card borders on mobile devices.
   - Replaced undefined `size-7.5` on the card navigation Chevron with standard `size-7` (28px).
2. **OTP Verification Input Dimensions**:
   - Replaced undefined `h-13` with standard `h-12` (48px) on mobile viewports (`h-12 w-11 sm:h-14 sm:w-12`), adhering to Fitts's Law touch target standards and matching all authentication input heights.
3. **Popular Categories Section Pacing**:
   - Replaced undefined `sm:py-18` on `HomeCategories` with `py-14 sm:py-20`, aligning section vertical rhythm with adjacent landing page sections.
4. **Contact Social Modal Icon Alignment**:
   - Replaced unscaled `size-4.5` on the X (Twitter) SVG with `size-5`, achieving exact 20×20px sizing harmony across Facebook, Instagram, and X channels.
5. **Farmer FAQ Accordion Icon Centering**:
   - Cleaned undefined `sm:size-5.5` to `size-5` inside the 32px (`size-8`) circular button, preserving 6px uniform padding on all sides.
6. **Notification Dropdown Badge Padding**:
   - Replaced undefined `py-0.2` with `py-0.5` (2px), providing consistent pill badge padding matching the rest of the application.
7. **Active Filters Toolbar Height Uniformity**:
   - Standardized the "Clear all" button to `min-h-10` (40px) matching the sibling filter chips in the same horizontal flex row (*Gestalt Law of Similarity*).
8. **Product Card Flex Robustness & Truncation**:
   - Added `min-w-0` to the category/location flex container and stall button in `ProductCard`, guaranteeing proper ellipsis truncation without horizontal container blowout on narrow mobile viewports (*Postel's Law*).
9. **Cart Drawer Typography & Stepper Controls Refinement**:
   - Upgraded vegetable name from small `text-sm` (13px) to `font-heading text-base font-bold text-foreground` (15px Manrope), establishing clear visual dominance.
   - Refined `+` and `-` quantity stepper buttons and trash icon from oversized `size-11` (44×44px) to `size-8` (32×32px) with `size-3.5` icons, eliminating clunkiness and achieving proportional harmony with the vegetable thumbnail and text block (*Fitts's Law* and *Aesthetic-Usability Effect*).

## UI/UX & Psychological Principles
- **Fitts's Law** (*Paul Fitts*): Standardized touch targets (minimum 40px–48px) prevent mis-taps and unconstrained bounding boxes on mobile screens.
- **Law of Similarity** (*Max Wertheimer, Kurt Koffka, Wolfgang Köhler*): Adjacent interactive chips and action buttons in toolbars share consistent height.
- **Postel's Law (Robustness Principle)** (*Jon Postel*): Defensive `min-w-0` constraints ensure graceful text truncation across mobile viewports.
- **Aesthetic-Usability Effect** (*Masaaki Kurosu & Kaori Kashimura*): Precise 4px grid rhythm and consistent internal card padding eliminate visual tension.

## Affected File Paths
- `web/src/features/marketplace/components/MarketplaceSellerSection.tsx`
- `web/src/features/auth/components/OtpCodeInput.tsx`
- `web/src/features/home/components/HomeCategories.tsx`
- `web/src/features/home/components/HomeContactSocialModal.tsx`
- `web/src/features/home/components/HomeFarmerFaq.tsx`
- `web/src/features/notifications/components/NotificationDropdownComponent.tsx`
- `web/src/features/marketplace/components/ActiveFilters.tsx`
- `web/src/features/marketplace/components/ProductCard.tsx`
- `web/src/features/cart/components/CartDrawer.tsx`

## Verification Performed
- **Zero Undefined Spacing Classes**: AST scan verified 0 invalid or unscaled Tailwind spacing classes across the entire web codebase.
- **Web Typecheck**: `npm run typecheck --prefix web` (`tsc --noEmit`) exited with code 0.
- **Backend Typecheck & Build**: `cd backend; bunx tsc --noEmit; bun build src/index.ts --outdir dist --target bun` bundled 1705 modules with 0 errors.
- **200-Line Limit Rule**: Every single modified TypeScript file verified strictly <= 200 lines.
- **Zero Visual Style Changes**: 100% of established colors, fonts, themes, borders, shadows, and layout structures preserved.
