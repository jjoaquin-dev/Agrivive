# Landing Page Mascot Removal and Clean Modernization

**Date:** 2026-10-27  
**Status:** Completed  
**Type:** Frontend UI/UX Refinement  

---

## 1. Context & Motivation
Per user request, the 3D cartoon vegetable character mascots were removed from the landing page to achieve a cleaner, more modern, professional, and mature aesthetic.

---

## 2. Changes Implemented

### A. Why Surplus Section (`HomeWhySurplus.tsx`)
- Removed the peeking 3D cartoon tomato mascot (`cute-3d-tomato.png`) from Card 1 ("Real-Time Photos and Verified Sellers").
- Removed the peeking 3D cartoon carrot mascot (`cute-3d-carrot.png`) from Card 2 ("Fight Food Waste").
- Standardized grid top spacing from the exaggerated mascot clearance (`mt-28 sm:mt-36 lg:mt-44`) down to natural, balanced padding (`mt-12 sm:mt-16`).
- Removed mobile offset `mt-14 sm:mt-20` on Card 2.

### B. Farmer FAQ Section (`HomeFarmerFaq.tsx`)
- Removed the group of four 3D vegetable mascots (`cute-3d-faq-veggies.png`) beneath the left callout column.
- Left column now cleanly presents the FAQ heading, description, and "Contact us" action button.

---

## 3. Affected Files
- [`web/src/features/home/components/HomeWhySurplus.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/home/components/HomeWhySurplus.tsx)
- [`web/src/features/home/components/HomeFarmerFaq.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/home/components/HomeFarmerFaq.tsx)

---

## 4. Verification Performed
- **TypeScript Typecheck:** `bun run typecheck` (`tsc --noEmit`) succeeded with 0 errors.
- **File Length Constraints:** Both files remain well under the 200-line limit:
  - `HomeWhySurplus.tsx`: 122 lines
  - `HomeFarmerFaq.tsx`: 134 lines
