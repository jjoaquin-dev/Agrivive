# 2026-10-26 Message Seller Product Preview and Chat Flow

## Context & Objectives
When a buyer clicks "Message Seller" on the product detail view (`/marketplace/[id]`), redirect them seamlessly to `/messages`, dynamically open or create a conversation with that product's seller, attach a linked product preview banner displaying the product's thumbnail image, name, current price, and availability status, reuse existing conversations with the same vendor without duplication, and provide a clear back-navigation link to return to the product listing or marketplace.

## Why
- Clicking "Message Seller" must take the buyer directly to an active chat with the vendor without falling back to unrelated inbox threads (*Jakob's Law*, *Don't Make Me Think*).
- Displaying the product thumbnail, price, and stock availability directly at the top of the chat ensures both parties have immediate context without needing to manually copy/paste links or descriptions (*Recognition Over Recall*).
- Reusing existing seller conversations prevents inbox clutter while dynamically attaching the new product inquiry (*Tesler's Law (Conservation of Complexity)*).
- Clear `"← Back to Listing"` navigation preserves user flow and cognitive momentum (*Fitts's Law*).

## What Changed
1. **`backend/src/modules/conversations/services/conversation.list.ts`**:
   - Included `productPrice`, `scalingType`, and `productQty` from `sellers_product` so conversation queries return full listing attributes.
2. **`backend/src/modules/conversations/services/conversation.create.ts`**:
   - Reused existing conversation records when a matching `contextKey` exists, appending the new message and updating `lastMessageAt` instead of throwing a `409 Conflict`.
3. **`web/src/features/conversations/types.ts` & `api.ts`**:
   - Added `productPrice`, `scalingType`, and `productQty` to `Conversation` and `ConversationLaunchContext`.
4. **`web/src/features/conversations/components/BuyerConversations.tsx`**:
   - Reconciled conversation selection: checks for exact product conversation match, then seller conversation match, falling back to new thread creation (avoiding fallback to `items[0]`).
   - Attached active product listing metadata to `activeContext`.
   - Added dual navigation paths: `"← Back to Listing"` (`/marketplace/${productId}`) and `"Back to Marketplace"` (`/marketplace`).
5. **`web/src/features/conversations/components/ConversationContextCard.tsx`**:
   - Upgraded top thread preview with product thumbnail, title, formatted Philippine Peso price (`₱... /unit`), availability status pill badge, and `"View listing →"` button.
6. **`web/src/features/conversations/components/ConversationDetailsPanel.tsx`**:
   - Displayed price and stock availability in the right-hand "Inquired Produce" panel.

## Affected Files
- `backend/src/modules/conversations/services/conversation.list.ts`
- `backend/src/modules/conversations/services/conversation.create.ts`
- `web/src/features/conversations/api.ts`
- `web/src/features/conversations/types.ts`
- `web/src/features/conversations/components/BuyerConversations.tsx`
- `web/src/features/conversations/components/ConversationContextCard.tsx`
- `web/src/features/conversations/components/ConversationDetailsPanel.tsx`

## Verification Performed
- Ran `bun run typecheck` (`tsc --noEmit`) in `web/` — exited with code 0.
- Ran `bunx tsc --noEmit` in `backend/` — exited with code 0.
- Ran `bun build src/index.ts --outdir dist --target bun` in `backend/` — bundled 1705 modules with 0 errors.
- Verified all source files strictly adhere to the $\le 200$ lines limit.
- Verified hot-reloading on active development servers (backend on `:3000`, frontend on `:3001`).
