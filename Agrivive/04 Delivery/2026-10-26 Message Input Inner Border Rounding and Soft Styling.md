# Message Input Inner Border Rounding and Soft Styling

**Date:** 2026-10-26  
**Context:** Buyer/Seller Chat Conversation Thread (`/messages`)

## What Changed

- **Inner Input Rounded Corners and 0.5px Light Gray Border**:
  - In `web/src/features/conversations/components/ConversationInput.tsx`, replaced the unstyled textarea with a rounded `rounded-xl` input container featuring a thin `border-[0.5px] border-[#DCDED5]` (light gray with 0.5px boldness) and crisp `bg-white` background.
  - Suppressed the harsh, square 2px dark green global focus outline by applying `outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0` and transitioning to a soft `focus:border-[#C4C9BC]`.
  - Harmonized the outer `<form>` border to transition gracefully to `focus-within:border-[#D5DACB]`.

## Affected File Paths

- `web/src/features/conversations/components/ConversationInput.tsx`

## UI/UX Standards & Psychological Laws Applied

- **Jakob's Law** *(Jakob Nielsen)*: Modern messaging platforms (iMessage, Slack, WhatsApp) present typing inputs as soft, rounded pills/cards with delicate borders.
- **Gestalt Principle of Common Region** *(Max Wertheimer, Kurt Koffka)*: Giving the textarea its own rounded surface with a subtle 0.5px border cleanly separates the typing affordance from the attachment toolbar below.
- **Aesthetic-Usability Effect** *(Masaaki Kurosu & Kaori Kashimura)*: Soft, balanced geometry and subtle contrast reduce cognitive noise and increase interface trust.

## Verification Performed

- Ran `bun run typecheck` (`tsc --noEmit`) in `web/` (passed with 0 errors).
- Verified file length: `ConversationInput.tsx` is 174 lines ($\le 200$ line constraint).
