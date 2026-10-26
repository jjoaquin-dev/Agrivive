# Header Brand Logo Proportions and Height Alignment

**Date:** 2026-10-27  
**Status:** Completed  
**Type:** Frontend UI/UX Refinement  

---

## 1. Context & Motivation
In site headers (`BuyerSiteHeader`, `LandingHeader`, and `SiteHeader`), the brand logo basket icon was sized at 36px (`size-9`), making it noticeably taller than the adjacent 28px "Agrivive" wordmark. The icon has been recalibrated so its visual height matches the cap-height and baseline of the wordmark.

---

## 2. Changes Implemented

### Header Logo Proportions (`BuyerSiteHeader.tsx`, `LandingHeader.tsx`, `SiteHeader.tsx`)
- Scaled image dimensions from `width={38} height={38}` and `size-9` (36px) to `width={26} height={26}` and `size-[26px]`.
- Adjusted flex gap to `gap-1.5` for balanced kerning between the icon mark and the letter "A".
- The basket mark now optically matches the 28px font cap-height without extending above or below the wordmark.

---

## 3. Affected Files
- [`web/src/components/BuyerSiteHeader.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/components/BuyerSiteHeader.tsx)
- [`web/src/features/home/components/LandingHeader.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/home/components/LandingHeader.tsx)
- [`web/src/components/SiteHeader.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/components/SiteHeader.tsx)

---

## 4. Verification Performed
- **TypeScript Typecheck:** `bun run typecheck` (`tsc --noEmit`) succeeded with 0 errors.
- **File Length Constraints:** All files remain under the 200-line ceiling:
  - `BuyerSiteHeader.tsx`: 189 lines
  - `LandingHeader.tsx`: 168 lines
  - `SiteHeader.tsx`: 196 lines
