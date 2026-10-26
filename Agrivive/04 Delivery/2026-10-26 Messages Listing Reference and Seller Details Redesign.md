# Messages Listing Reference and Seller Details Redesign

**Date:** 2026-10-26  
**Status:** Completed  
**Type:** Frontend UI/UX Redesign  

---

## 1. Context & Motivation
In the buyer-to-seller messaging experience (`/messages`), the listing context reference card pinned at the top of the chat thread and the vendor details side panel needed visual redesign to align with reference design patterns while preserving the existing product data model and dynamic launch context.

---

## 2. Changes Implemented

### A. Listing Reference Card (`ConversationContextCard.tsx`)
- **Dashed Border Container:** Replaced solid border with clean dashed border (`border border-dashed border-[#D2D6DC] bg-white rounded-2xl p-3.5`).
- **Width Constraint & Centering:** Added `w-[calc(100%-3rem)] max-w-xl mx-auto` to cap the width at 576px and center it in the thread, eliminating the overly wide stretched gap on wide displays.
- **Squircle Store Icon:** White rounded container (`size-12 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs`) displaying a green `Store` icon or produce thumbnail.
- **Header Badges:** Uppercase `LISTING REFERENCE` tag paired with an alert badge in warm peach/orange (`bg-[#FFF4E5] text-[#EA580C] uppercase font-bold text-[10px] px-2 py-0.5 rounded-md`) displaying `[QTY] [UNIT] AVAILABLE`.
- **Typography & Pricing:** Product title styled in bold (`text-[15px] font-bold text-neutral-900`) with price in muted gray and seller name highlighted in vibrant green (`#16A34A`).
- **Pill CTA:** Refined `View listing >` action button styled as a white rounded pill button with subtle shadow and chevron icon.

### B. Seller Information Panel (`ConversationDetailsPanel.tsx`)
- **Cleaned Top Layout:** Removed redundant "Chat details" header in favor of direct vendor focus.
- **Vendor Identity Avatar:** Circular avatar (`rounded-full border border-neutral-200/80 size-20`) with absolute bottom-right active indicator dot in green (`size-4 rounded-full bg-[#16A34A] ring-2 ring-white`).
- **Vendor Badging:** Centered stall name (`font-heading text-lg font-bold text-neutral-900`), verified vendor badge with checkmark (`#16A34A`), and formatted contact number (`+63 912-345-6789`).
- **Full-Width Profile Action:** Clean white rounded button (`rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50`) directing to `/sellers/[id]`.
- **Stall Information Section:** Displays Stall ID, Market Location, City, and Verified Stall status.
- **Inquired Produce Card:** Features `INQUIRED PRODUCE` header with `VIEW >` quick link, squircle thumbnail, price, quantity, and active green dot indicator.

---

## 3. Affected Files
- [`web/src/features/conversations/components/ConversationContextCard.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/conversations/components/ConversationContextCard.tsx)
- [`web/src/features/conversations/components/ConversationDetailsPanel.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/conversations/components/ConversationDetailsPanel.tsx)

---

## 4. Verification Performed
- **TypeScript Typecheck:** Ran `cd web; bun run typecheck` (`tsc --noEmit`) with 0 errors.
- **File Length Constraints:** Both files strictly respect the 200-line repository limit (`ConversationContextCard.tsx`: 102 lines; `ConversationDetailsPanel.tsx`: 164 lines).
- **Design Alignment:** Verified against reference mockup for dashed border treatment, squircle iconography, peach badge accents, and verified status hierarchy.
