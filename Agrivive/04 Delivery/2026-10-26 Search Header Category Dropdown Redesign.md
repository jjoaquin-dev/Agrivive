---
title: Search Header Category Dropdown Redesign
date: 2026-10-26
type: delivery
status: verified
related_documents:
  - "[[2026-10-25 Marketplace Page Layout and Style Alignment]]"
  - "[[2026-10-25 Header and Footer Navigation Refinements]]"
---

# Search Header Category Dropdown Redesign

## What Changed

1. **Created Custom Category Dropdown Component (`HeaderCategoryDropdown.tsx`)**:
   - Replaced unstyleable native HTML `<select>` browser chrome with a custom, accessible React popover component.
   - Designed to match the user's reference mockup:
     - **Rounded Edges**: `rounded-2xl` (16px) floating card with soft ambient drop shadow (`shadow-[0_12px_36px_rgba(0,0,0,0.08)]`).
     - **Container Padding**: Outer `p-2` padding creating comfortable internal spacing.
     - **Option Padding & Shape**: `px-3.5 py-2.5 rounded-xl` for each category item.
     - **Brand Color Hover & Click State**: Applied `hover:bg-[#457D00]/10 hover:text-[#457D00]`, `active:bg-[#457D00]/10`, and selected state with `bg-[#457D00]/10 text-[#457D00] font-bold`.
   - **Accessible Dismissal**: Automatically closes on click outside (`pointerdown`) or `Escape` key.
   - **Interactive Trigger**: Includes `ChevronDown` with smooth 180-degree rotation when open.

2. **Trigger Button Single-Line Horizontal Layout**:
   - Prevented text from wrapping onto two lines (e.g. `"All"` on line 1, `"Categories ▾"` on line 2) inside the search form flex layout.
   - Applied `shrink-0` to the outer dropdown container and button to prevent flex compression by the search text input.
   - Added `whitespace-nowrap` to both the trigger `<button>` and the category title `<span>`.
   - Constrained `<ChevronDown className="size-3.5 shrink-0 ...">` to preserve icon dimensions without distortion.

3. **Integration in Headers**:
   - Integrated in `BuyerSiteHeader.tsx` replacing lines 75–88.
   - Integrated in `LandingHeader.tsx` replacing lines 61–72.

## UI/UX Standards Applied

- **Jakob's Law *(Jakob Nielsen)***: Intuitive popover dropdown behavior with expected outside click and keyboard dismissal.
- **Law of Prägnanz (Simplicity) *(Gestalt)***: A single straight horizontal line for category selection keeps the search bar clean, predictable, and scannable.
- **Fitts's Law *(Paul Fitts)***: Replaced cramped 18px native option rows with spacious `px-3.5 py-2.5 rounded-xl` touch targets.
- **Aesthetic-Usability Effect *(Masaaki Kurosu & Kaori Kashimura)***: Rounded 16px geometry and brand-tinted micro-interactions elevate visual trust.
- **Affordances & Signifiers *(Don Norman)***: Clear chevron indicator, active tinting, and hover states provide explicit interactive feedback.

## Affected Files & Verification

- New Component: `web/src/components/HeaderCategoryDropdown.tsx` (100 lines, strictly under 200-line ceiling)
- Modified Header: `web/src/components/BuyerSiteHeader.tsx` (155 lines, strictly under 200-line ceiling)
- Modified Landing Header: `web/src/features/home/components/LandingHeader.tsx` (170 lines, strictly under 200-line ceiling)
- Verification:
  - Frontend typecheck passed: `cd web && bunx --bun tsc --noEmit`
  - Backend typecheck and build passed: `cd backend && bunx --bun tsc --noEmit && bun build src/index.ts --outdir dist --target bun`
