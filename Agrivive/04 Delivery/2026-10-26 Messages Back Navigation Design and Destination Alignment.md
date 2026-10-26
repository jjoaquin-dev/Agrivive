# Messages Back Navigation Design and Destination Alignment

**Date:** 2026-10-26  
**Context:** Buyer/Seller Messages View (`/messages`)

## What Changed

- **Standardized Back Navigation Design and Dynamic Destination**:
  - In `web/src/features/conversations/components/BuyerConversations.tsx`, unified the top navigation link into a single, clean text button matching the design pattern on the View Listing page (`ProductDetail.tsx`).
  - When viewing a conversation initiated from a listing (`activeContext?.productId`), the button links directly to `/marketplace/${productId}` with label **"Back to Listing"**.
  - For general conversations, it links to `/marketplace` with label **"Back to Marketplace"**.
  - Styled with a neutral grey font (`text-neutral-500`, `14px font-medium`), directional arrow (`ArrowLeft`, `size-4`), and smooth hover transition to solid black (`hover:text-black transition-colors cursor-pointer`), removing the previous green text and bullet dot separator.

## Affected File Paths

- `web/src/features/conversations/components/BuyerConversations.tsx`

## UI/UX Standards & Psychological Laws Applied

- **Jakob's Law** *(Jakob Nielsen)*: Unifies back navigation patterns across all pages (`ProductDetail` and `BuyerConversations`), aligning with standard web usability conventions.
- **Don't Make Me Think** *(Steve Krug)*: Providing a single contextual back button removes ambiguity and eliminates decision fatigue.
- **Affordances and Signifiers** *(Don Norman)*: The directional left arrow with `text-neutral-500` to `hover:text-black` hover transition gives a clear, intuitive signifier for navigation.

## Verification Performed

- Ran `bun run typecheck` (`tsc --noEmit`) in `web/` (passed with 0 errors).
- Verified file line count: `BuyerConversations.tsx` is 187 lines ($\le 200$ line constraint).
