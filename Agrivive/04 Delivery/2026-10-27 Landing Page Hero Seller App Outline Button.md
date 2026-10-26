# Landing Page Hero Seller App Outline Button

**Date:** 2026-10-27  
**Status:** Completed  
**Type:** Frontend UI/UX Enhancement  

---

## 1. Context & Motivation
To improve onboarding and visibility for vendor/seller users directly from the top landing page hero, an outline CTA button was placed beside the primary "Shop Today's Harvest" buyer CTA button.

---

## 2. Changes Implemented

### Landing Page Hero (`HomeHero.tsx`)
- Updated CTA button row to a responsive flex container (`flex flex-wrap items-center justify-center gap-3.5`).
- Primary "Shop Today's Harvest" CTA: Updated to brand forest green (`bg-[#457D00] text-white hover:bg-[#386600]`).
- Secondary seller button: Updated to fine green outline:
  - Label: `"Are you a Seller? Get the App here"`
  - Border: `border-[0.7px] border-[#457D00]` with white background (`bg-white hover:bg-[#F3FFF5] hover:border-[#386600]`)
  - Icon: `<Smartphone className="size-4 text-[#457D00] transition-colors" />`
  - Destination: Anchored smoothly to `#sellers` section on the landing page.

---

## 3. Affected Files
- [`web/src/features/home/components/HomeHero.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/home/components/HomeHero.tsx)

---

## 4. Verification Performed
- **TypeScript Typecheck:** `bun run typecheck` (`tsc --noEmit`) succeeded with 0 errors.
- **File Length Constraints:** File is 74 lines (strictly $\le 200$ lines).
- **Responsive Stacking:** Verified that on narrow mobile viewports, the buttons wrap cleanly without horizontal overflow.
