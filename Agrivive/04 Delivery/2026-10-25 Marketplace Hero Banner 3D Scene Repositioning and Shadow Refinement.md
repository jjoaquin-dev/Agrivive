---
title: Marketplace Hero Banner 3D Scene Repositioning and Shadow Refinement
date: 2026-10-25
type: delivery
status: verified
related_documents:
  - "[[2026-10-25 Marketplace Page Layout and Style Alignment]]"
---

# Marketplace Hero Banner 3D Scene Repositioning & Shadow Refinement

## What Changed

1. **3D Vegetable & Sacks Repositioning (+70px Right Shift)**:
   - Shifted the entire 3D produce cluster (burlap sacks, spilled produce, onion, and dancing mascots) 70px to the right.
   - De-crowded the left headline typography to eliminate overlap under the subtitle `"before market close"`.

2. **Soft Ground Drop Shadow Synthesis**:
   - Fixed the abrupt vertical cutoff of the shadow at `x = 844` by synthesizing a feathered, organic 55px asymmetric ground shadow lobe.
   - Matches the lighting, tint (`#EEF5F0` darkening), and ambient occlusion profile of the rest of the 3D scene.

3. **Transparent Light Green Glassmorphic Background (`#ddfedd` / `#ddffdd`)**:
   - Replaced solid opaque `bg-[#EEF5F0]` with a translucent `bg-[#ddfedd]/50` wash and `backdrop-blur-xs`.
   - Allows the website's Warm Cream (`#F8F6F1`) surface to subtly show through, harmonizing with the organic aesthetic and glassmorphism standards.
   - Refined the card border to `border-[#CDE8D2]/80` and applied `shadow-xs`.

4. **Seller Card Photo Avatars** (`MarketplaceSellerSection.tsx`):
   - Replaced generic `<MapPin />` location pin icons on the nearby seller stall selector cards with circular vendor photo avatars (`rounded-full ring-2 ring-neutral-200/80`).
   - Added graceful fallback to stall initials against soft mint backing (`bg-[#EDF2EB] text-[#1F4D3A]`) when images fail or are absent.

5. **Banner Illustration Alignment and Positioning to the Right Side** (`MarketplaceHero.tsx` & `marketplace-hero-transparent.png`):
   - **Tailwind Utility Alignment Fix**: Corrected invalid `object-bottom-right` to `object-right-bottom` in `MarketplaceHero.tsx`, resolving the browser fallback to `object-position: center` that left a 120px+ void on the right and pushed vegetables under the left headline.
   - **Asset Shift (+80px Right)**: Shifted the entire 3D produce cluster in `marketplace-hero-transparent.png` +80px to the right and smoothly attenuated the ground drop shadow, placing the sacks and mascots directly on the right side of the card with balanced 30–50px breathing room.
   - **Responsive Rightward Translation & 16px Border Spacing**: Applied `translate-x-[10px] lg:translate-x-[18px]` in `MarketplaceHero.tsx` to maintain an exact 16px margin between the rightmost burlap sack and the card's rounded border across mobile, tablet, and desktop viewports.

6. **Complete Elimination of Black Silhouette Border & Dark Halo Fringe** (`marketplace-hero-transparent.png`):
   - Removed 715,000+ pixels of artificial near-black shadow (`RGB [20, 35, 26]`) that were previously coating the semi-transparent anti-aliased edges of the vegetables and burlap sacks.
   - Generated a pure, defringed cutout via `u2net` segmentation with color dilation extending genuine object colors to the silhouette boundaries.
   - Preserved crisp natural anti-aliased transitions that blend seamlessly into the mint `#EEF5F0` background card without any outline, stroke, or dark halo.

7. **Marketplace Filter Sidebar Redesign** (`MarketplaceFilterSidebar.tsx` & `MarketplacePriceSlider.tsx`):
   - **Top Section**: Crisp dark leaf green (`#1F4D3A`) typography on pale buttercream yellow (`#FAF6E9`) with Reset action.
   - **Vegetable Category**: Vertical list of large UI chips (46px+ high); active chip styled with soft yellow-green (`#EAF4DC`), dark green border (`border-2 border-[#1F4D3A]`), and a checkmark.
   - **Price Range Dual-Thumb Slider**: Extracted into focused `MarketplacePriceSlider.tsx`, featuring a thick dark leaf green active track (`#1F4D3A`), vibrant orange thumbs (`#F97316`), and two clean `Min ₱` and `Max ₱` input fields with bidirectional sync.
   - **Seller Distance**: Sleek, equal-width 4-segment control (`1km`, `3km`, `5km`, `10km`) with `10km` highlighted in solid `#1F4D3A`.
   - **Bottom Section**: Modern mid-tone green (`#3F7D58`) pill toggle switch for `Show on map`.
   - **Base**: Sticky floating bottom bar housing a prominent, 48px solid dark leaf green `Apply Filters` button.

## UI/UX Standards Applied

- **Jakob's Law *(Jakob Nielsen)***: Standard dual-range slider, segmented tabs, and iOS-style pill switches leverage universal e-commerce conventions.
- **Fitts's Law *(Paul Fitts)***: Large UI chips (46px), segmented tabs (40px), and sticky `Apply Filters` button (48px) provide effortless touch targets.
- **Von Restorff Effect *(Hedwig von Restorff)***: Vibrant orange thumbs (`#F97316`) on the dark green track clearly signal drag affordances.
- **Affordances & Signifiers *(Don Norman)***: Tactile buttons, active state checkmarks, and photo avatars provide explicit interactive signifiers.
- **Gestalt Law of Proximity *(Max Wertheimer)***: Generous negative space between text and illustrations.
- **Law of Prägnanz & Figure-Ground *(Max Wertheimer, Kurt Koffka)***: Clean ground contact shadows and butter-yellow header panels delineate distinct information chunks (**Miller's Law**).
- **Aesthetic-Usability Effect *(Masaaki Kurosu & Kaori Kashimura)***: Harmonious color rhythm and balanced margins elevate user trust.

## Affected Files & Verification

- New Component: `web/src/features/marketplace/components/MarketplacePriceSlider.tsx` (115 lines, under 200-line limit)
- Redesigned Component: `web/src/features/marketplace/components/MarketplaceFilterSidebar.tsx` (171 lines, under 200-line limit)
- Updated Hero: `web/src/features/marketplace/components/MarketplaceHero.tsx` (41 lines, under 200-line limit)
- Modified Component: `web/src/features/marketplace/components/MarketplaceSellerSection.tsx` (144 lines, strictly under 200-line ceiling)
- Target Web Brand Asset: `web/public/brand/marketplace-hero-transparent.png` (1485 × 768, RGBA with soft organic ground drop shadow)
- Artifact Banner: `marketplace-hero-banner-repositioned.png` (1024 × 414)
- Artifact Cutout: `marketplace-hero-repositioned-transparent.png` (1024 × 414)
- Verification: 
  - Frontend typecheck passed (`cd web; bunx tsc --noEmit`).
  - Backend typecheck and build passed (`cd backend; bunx tsc --noEmit; bun build src/index.ts --outdir dist --target bun`).
  - Seamless monotonic ground shadow attenuation from `alpha = 83` down to `0`.
  - All source files strictly comply with the 200-line limit.
