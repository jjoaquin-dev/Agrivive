# 2026-10-26 Product Detail View Listing Page Redesign

## Summary of Changes
Redesigned the entire Agrivive product detail / view listing page (`/marketplace/[id]`) into a modern, clean, cohesive, and professional marketplace interface adhering to `#FDFDFD` page background, pure white content cards, 1px solid `#E8E8E8` borders, subtle shadows, and consistent Agrivive green branding (`#457D00` / `#386600`). The architecture strictly conforms to Agrivive UI/UX cognitive psychology standards (*Jakob's Law*, *Hick-Hyman Law*, *Miller's Law*, *Fitts's Law*, *Figure-Ground Principle*, and *Aesthetic-Usability Effect*) and the project's $\le 200$ lines per file constraint.

### What Changed & Why

1. **Background & Card Foundations**:
   - Updated the overall page background to `#FDFDFD`.
   - Standardized all content cards with pure white background (`#FFFFFF`), crisp 1px solid `#E8E8E8` borders, and uniform `16px` border-radius (`rounded-[16px]`).
   - Removed visual clutter, arbitrary section border dividers, and uneven vertical gaps, creating a unified `24px` spacing between major page sections (`space-y-6`).

2. **Visual Hierarchy & Header Navigation**:
   - **Back to Marketplace Navigation**: Placed cleanly at the top with `text-[14px] font-medium text-neutral-500 hover:text-black` and a 16px arrow icon (`<ArrowLeft />`), matching the marketplace navigation pattern.
   - **Product Title**: Styled at `24px` bold leading-tight (`font-heading text-[24px] font-bold text-[#14231A]`).
   - **Category Badge**: Pill badge with `11px` font, Agrivive green accent (`border border-[#CDE5BA] bg-[#F0F7EB] text-[#386600]`).
   - **Pricing Hierarchy**: Discounted price at `24px` bold (`#457D00`), original base price at `12px` strikethrough (`line-through text-muted-foreground`), and scaling unit at `12px`.
   - **Stock Availability**: Pill badge at `12px` semibold (`border border-[#CDE5BA] bg-[#F0F7EB] text-[#386600]` or red when sold out).

3. **Responsive 2:1 Proportion Layout**:
   - Refined the main product section into a responsive two-column grid with a 2:1 proportion (`grid-cols-1 lg:grid-cols-3 gap-6`), dedicating 2 columns to the product image card and 1 column to the product information card.
   - Set 24px column gap (`gap-6`) and 24px outer page padding (`px-6 py-6`).
   - Top edges of both the image card and information card align perfectly (`items-start`).
   - On tablet and mobile viewports, smoothly stacks the image container above the information card.

4. **Product Image Container**:
   - Maximum height capped at `580px` on desktop (`h-[380px] sm:h-[480px] lg:h-[580px] max-h-[580px]`).
   - 16px container border radius with 1px `#E8E8E8` border, 12–16px internal padding (`p-3 sm:p-4`), and rounded 12px inner viewport (`rounded-[12px] bg-[#FAFAFA]`).
   - Responsive image sizing with `object-cover sm:object-contain lg:object-cover` preventing awkward cropping, distortion, or excessive empty space.

5. **Product Information Card**:
   - Extracted to dedicated `ProductInfoCard.tsx` (168 lines) to maintain modular separation and keep both `ProductDetail.tsx` (161 lines) and `ProductInfoCard.tsx` under the 200-line requirement.
   - 20px padding (`p-5`), 16px border radius, 12px spacing between related details, and 20px spacing between distinct information groups.
   - Seller information, seller type badge, and produce condition cleanly aligned with seller profile link and `MessageSellerButton`.
   - Pickup details card styled with `#FAFAFA` background, 1px `#E8E8E8` border, 14px address with `#457D00` map pin icon, and 12px pickup instructions.

6. **Standardized Quantity Input & Purchase Controls**:
   - Standardized quantity input: 40–44px height (`h-10 min-h-[40px]`), 12px border radius (`rounded-xl`), 14px text, 1px `#E8E8E8` border, and smooth `#457D00` focus ring.
   - Standardized purchase controls: 40–44px height (`h-10 min-h-[40px]`), 8px gap (`gap-2`), 12px border radius (`rounded-xl`), and 14px semibold button text.
   - **Buy Now**: Strong visual emphasis with Agrivive green background (`bg-[#457D00] text-white hover:bg-[#386600]`).
   - **Add to Cart**: Secondary treatment with 1px `#E8E8E8` border, white background, and neutral hover state (`hover:bg-[#F5F5F5]`).
   - Informative notice below controls: "Payment happens directly at pickup. Reservations expire after 24 hours."

7. **Unified Seller Ratings, Review Cards, and Question Section**:
   - **SellerReviewsSection**: 18px semibold section heading, 16px gap between review cards (`space-y-4`), 16px card border radius with 1px solid `#E8E8E8` borders, verified pickup badge (`#386600` on `#F0F7EB`), and clean seller response card.
   - **ReviewSummaryCard**: Standardized to `rounded-[16px] border border-[#E8E8E8] bg-white p-5 shadow-sm text-center`, 36px bold score, rating stars, and rating breakdown distribution bars with `#E8E8E8` dividers.
   - **ProductReviewsSection**: Standardized review cards (`rounded-[16px] border border-[#E8E8E8] bg-white p-4 shadow-sm`), 18px section heading, verified purchase badge, and empty state without excessive whitespace.
   - **ProductQuestionsSection**: Unified card with 16px border radius, 1px `#E8E8E8` border, 18px heading, `#457D00` message icon, and secondary `MessageSellerButton`.
   - **SimilarProduceSection**: Unified 18px section heading with `#457D00` sparkles icon, removing redundant top border dividers.

---

## Affected Files
- `web/src/features/marketplace/components/ProductDetail.tsx`
- `web/src/features/marketplace/components/ProductInfoCard.tsx` (new component)
- `web/src/features/marketplace/components/SellerStorefront.tsx`
- `web/src/features/marketplace/components/SellerReviewsSection.tsx`
- `web/src/features/marketplace/components/ReviewSummaryCard.tsx`
- `web/src/features/marketplace/components/ProductReviewsSection.tsx`
- `web/src/features/marketplace/components/ProductQuestionsSection.tsx`
- `web/src/features/marketplace/components/SimilarProduceSection.tsx`

---

## Verification Performed
1. **TypeScript Type Check**:
   - Ran `cd web; bunx tsc --noEmit` -> 0 errors.
   - Ran `cd backend; bunx tsc --noEmit` -> 0 errors.
2. **File Line Count Compliance ($\le 200$ lines)**:
   - `ProductDetail.tsx`: 161 lines
   - `ProductInfoCard.tsx`: 168 lines
   - `SellerStorefront.tsx`: 185 lines
   - `SellerReviewsSection.tsx`: 122 lines
   - `ReviewSummaryCard.tsx`: 45 lines
   - `ProductReviewsSection.tsx`: 155 lines
   - `ProductQuestionsSection.tsx`: 25 lines
   - `SimilarProduceSection.tsx`: 47 lines
