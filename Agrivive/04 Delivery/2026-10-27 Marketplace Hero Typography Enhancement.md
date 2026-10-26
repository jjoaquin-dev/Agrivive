# Marketplace Hero Typography Enhancement

**Date:** 2026-10-27  
**Status:** Completed  
**Type:** Frontend UI/UX Enhancement  

---

## 1. Context & Motivation
Following user feedback, the typography within the marketplace banner card (`/marketplace`) was scaled up to provide stronger hierarchy, greater visual impact, and enhanced readability for desktop and mobile viewports.

---

## 2. Changes Implemented

### Marketplace Hero (`MarketplaceHero.tsx`)
- **Eyebrow ("SURPLUS TODAY, VALUE FOR EVERYONE"):**
  - Scaled from `11px` to `text-xs sm:text-sm font-bold uppercase tracking-widest text-[#457D00]`.
- **Primary Heading ("Your local connection to affordable, marketable vegetables"):**
  - Updated headline copy to: *"Your local connection to affordable, marketable vegetables"*.
  - Styled with `font-heading text-3xl font-bold leading-[1.15] tracking-tight text-[#14231A] sm:text-4xl lg:text-[44px]` for optimal balance and readability.
- **Subheader:**
  - Scaled up from `text-sm sm:text-base` to `text-base sm:text-lg font-medium leading-relaxed text-[#3B4E42]`.
- **Container Layout:**
  - Widened the text column constraint from `max-w-xl` to `max-w-2xl` and paragraph from `max-w-md` to `max-w-lg` to accommodate larger font metrics without awkward premature wrapping.

---

## 3. Affected Files
- [`web/src/features/marketplace/components/MarketplaceHero.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/marketplace/components/MarketplaceHero.tsx)

---

## 4. Verification Performed
- **TypeScript Typecheck:** `bun run typecheck` (`tsc --noEmit`) succeeded with 0 errors.
- **File Length Constraints:** File is 41 lines (strictly $\le 200$ lines).
- **Visual Balance:** Confirmed text hierarchy does not obscure the 3D produce sacks illustration anchored to the bottom right.
