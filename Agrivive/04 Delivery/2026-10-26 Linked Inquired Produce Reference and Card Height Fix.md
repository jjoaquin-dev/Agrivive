# Linked Inquired Produce Reference and Card Height Fix

**Date:** 2026-10-26  
**Context:** Buyer View Listing (`/marketplace/[id]`) and Messaging (`/messages`) Produce Reference Flow

## What Changed

1. **Produce Context Retention on "Message Seller"**:
   - Resolved the issue where navigating to `/messages?productId=...` lost the produce context banner and reset the conversation context.
   - Removed the premature `useEffect` hook in `web/src/features/conversations/components/ConversationThread.tsx` that previously replaced the URL with `/messages?conversationId=...` and stripped `productId` upon loading an existing thread.
   - Updated `web/src/features/conversations/components/BuyerConversations.tsx` to preserve `productId` in search params when creating or updating conversations, and cleanly spread `launchContext` produce attributes into `activeContext`.
   - Updated `web/src/features/conversations/api.ts` and `web/src/features/conversations/hooks/useConversationThread.ts` to forward `productId` when sending messages and invoke creation callbacks strictly on message transmission.

2. **Backend Duplicate Prevention and Produce Re-association**:
   - In `backend/src/modules/conversations/model/conversation.ts`, expanded `sendConversationMessageBody` with optional `productId: t.Optional(t.String({ format: "uuid" }))`.
   - In `backend/src/modules/conversations/services/conversation.create.ts`, enhanced the existing conversation lookup to reuse existing conversations between the same buyer and seller (`contextType in ('product', 'seller')`), updating `conversations.productId` to the newly inquired product and appending the inquiry without creating duplicate threads.
   - In `backend/src/modules/conversations/services/conversation.message.create.ts`, updated `conversations.productId` when provided, and recorded inquiries in `product_inquiries`.

3. **Silent Live WebSocket Fallback**:
   - In `web/src/features/conversations/hooks/useConversationThread.ts`, replaced `socket.onerror = () => setError(...)` with a non-intrusive warning log. This prevents false-positive, destructive red error modals ("Live messages are unavailable. You can still refresh the conversation.") from masking the chat interface while REST HTTP fallback is fully operational.

4. **Product Detail Image Card & Info Card Height Synchronization**:
   - In `web/src/features/marketplace/components/ProductImage.tsx`, removed conflicting hardcoded classes so callers can specify exact positioning.
   - In `web/src/features/marketplace/components/ProductDetail.tsx`, wrapped the image container with `relative flex-1 w-full min-h-[380px] sm:min-h-[460px] lg:min-h-0 overflow-hidden rounded-[18px] bg-[#FAFAF8]` and positioned `ProductImage` with `absolute inset-0 size-full object-cover`.
   - On desktop (`lg:` viewports), the grid row height is governed cleanly by `ProductInfoCard`, and both the left Image Card (`lg:col-span-2`) and right Information Card (`lg:col-span-1`) stretch to the exact same vertical bounds, matching top and bottom borders.

## Affected File Paths

- `backend/src/modules/conversations/model/conversation.ts`
- `backend/src/modules/conversations/services/conversation.create.ts`
- `backend/src/modules/conversations/services/conversation.message.create.ts`
- `web/src/features/conversations/api.ts`
- `web/src/features/conversations/hooks/useConversationThread.ts`
- `web/src/features/conversations/components/ConversationThread.tsx`
- `web/src/features/conversations/components/BuyerConversations.tsx`
- `web/src/features/marketplace/components/ProductImage.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`

## UI/UX Standards & Psychological Laws Applied

- **Jakob's Law** *(Jakob Nielsen)* & **Recognition Over Recall** *(Jakob Nielsen & Rolf Molich)*: Inquired produce information stays prominently pinned at the top of the chat view (thumbnail, name, price, availability, and "View listing"), eliminating the need to remember listing details.
- **Tesler's Law (Conservation of Complexity)** *(Larry Tesler)*: Chat reuse, produce re-association, and URL query preservation are handled seamlessly behind the scenes without user friction.
- **Gestalt Principles (Law of Common Region & Figure-Ground)** *(Max Wertheimer, Kurt Koffka)*: Both cards on the View Listing page feature matching `rounded-[24px]` borders and synchronized top/bottom borders, creating visual equilibrium.

## Verification Performed

- Ran `bunx tsc --noEmit` and `bun build src/index.ts --outdir dist --target bun` in `backend/` (passed with 0 errors).
- Ran `bun run typecheck` (`tsc --noEmit`) in `web/` (passed with 0 errors).
- Checked source file line constraints: all files strictly adhere to the $\le 200$ line threshold (`BuyerConversations.tsx`: 196 lines, `ProductDetail.tsx`: 159 lines).
- Verified backend marketplace API endpoint responds with valid JSON produce listings on port 3000.
