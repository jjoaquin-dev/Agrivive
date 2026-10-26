# Account Settings System Tabs, Search Bar, and Pill Inputs Redesign

**Date:** 2026-10-26  
**Status:** Completed  
**Type:** Frontend UI/UX Redesign  

---

## 1. Context & Motivation
The buyer account profile and settings experience (`/profile`) needed visual and interaction alignment with the system design system:
1. Adopting the unified capsule tab bar (`#F3F5EA` pill background with white rounded active pill tabs) mirroring the order filters design.
2. Replacing the boxy search input with a fully rounded pill search bar.
3. Upgrading the preferred market/district selector from a native HTML `<select>` to a custom floating popover matching the All Category dropdown design (`HeaderCategoryDropdown`).
4. Removing the redundant Reservations tab from settings (orders and reservations are dedicated to `/orders`).
5. Converting all input fields and action buttons to pill geometry (`rounded-full h-11`).
6. Enforcing strict UI/UX laws (Jakob's Law, Gestalt Principles, Fitts's Law, and Aesthetic-Usability Effect).

---

## 2. Changes Implemented

### A. System Tab Design (`BuyerProfile.tsx`)
- Integrated the system capsule tab bar:
  - Container: `inline-flex items-center gap-1.5 rounded-full bg-[#F3F5EA] border border-[#E5E9DC] p-1.5`.
  - Active Tab: `bg-white text-neutral-900 font-bold shadow-2xs rounded-full px-4 py-2 text-xs` with green icon accents (`#386600`).
  - Inactive Tabs: `text-neutral-600 font-semibold hover:text-neutral-900 rounded-full px-4 py-2 text-xs transition-all`.
  - Streamlined to three core settings tabs: **Profile**, **Security**, and **Notifications** (Reservations removed).

### B. Pill Search Bar (`BuyerProfile.tsx`)
- Container: `relative max-w-md`.
- Input: `h-11 w-full rounded-full border border-neutral-200/90 bg-white pl-11 pr-5 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-2xs` with magnifying glass icon positioned at `left-4`.

### C. All-Category Style District Dropdown (`ProfileDistrictDropdown.tsx`)
- Created a dedicated dropdown component matching `HeaderCategoryDropdown.tsx`:
  - Pill trigger button (`rounded-full h-11 pl-11 pr-4`) with `MapPin` icon and animated rotating `ChevronDown`.
  - Floating popover: `rounded-2xl border border-neutral-100 bg-white p-2 shadow-[0_12px_36px_rgba(0,0,0,0.08)] max-h-60 overflow-y-auto`.
  - Items: rounded option rows (`rounded-xl px-3.5 py-2.5 text-[13px]`) with soft green active background (`bg-[#457D00]/10 text-[#457D00] font-bold`) and trailing checkmark.
  - Complete click-outside and Escape key dismissal handling.

### D. Pill Ratio Text Boxes & Form Enhancements (`ProfileBasicInfoCard.tsx`)
- First Name, Last Name, Phone Number, and E-mail inputs updated to pill ratio (`h-11 rounded-full px-5`).
- E-mail field styled in soft neutral read-only styling with a green `Verified` badge.
- Save changes CTA updated to pill ratio (`h-11 rounded-full px-7 font-bold bg-[#386600] text-white`).

### E. Profile Picture Card (`ProfilePictureCard.tsx`)
- Upload photo button upgraded to pill ratio (`h-11 rounded-full px-6 font-bold bg-[#386600] text-white`).
- Circular avatar container harmonized with `#F4F6EE` background and subtle inner shadow.

---

## 3. Affected Files
- [`web/src/features/profile/components/ProfileDistrictDropdown.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/profile/components/ProfileDistrictDropdown.tsx) (New)
- [`web/src/features/profile/components/ProfileBasicInfoCard.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/profile/components/ProfileBasicInfoCard.tsx)
- [`web/src/features/profile/components/ProfilePictureCard.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/profile/components/ProfilePictureCard.tsx)
- [`web/src/features/profile/components/BuyerProfile.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/profile/components/BuyerProfile.tsx)

---

## 4. Verification Performed
- **TypeScript Typecheck:** `bun run typecheck` (`tsc --noEmit`) succeeded with 0 errors.
- **File Length Constraints:** All source files remain under the 200-line repository ceiling:
  - `ProfileDistrictDropdown.tsx`: 102 lines
  - `ProfileBasicInfoCard.tsx`: 189 lines
  - `ProfilePictureCard.tsx`: 137 lines
  - `BuyerProfile.tsx`: 162 lines
