---
title: Chat Attachments, Avatars, and Marketplace Map Pinpoint Fix
date: 2026-10-19
type: delivery
status: verified
related_documents:
  - "[[Real-time Buyer Seller Conversations]]"
  - "[[Full Interactive Mapping]]"
  - "[[Buyer Web Design and Skills]]"
---

# Chat Attachments, Avatars, and Marketplace Map Pinpoint Fix

## What changed

1. **Marketplace Map Pinpoint Interaction**:
   - In `web/src/features/marketplace/components/MarketplaceBrowser.tsx`, decoupled map pinpoint clicks (`handleSelectSellerFromMap`) from product card clicks (`handleSelectSellerFromCard`). Clicking a pin on the map opens the stall marker and sets the active seller filter without calling `.scrollIntoView()`, keeping the map view stable and in focus.

2. **S3 Avatar Presigning and Graceful Fallback**:
   - In `backend/src/modules/conversations/services/conversation.list.ts`, wrapped raw seller image keys in `getAvatarDisplayUrl(row.sellerImage)` so conversation lists provide authorized, presigned S3 URLs instead of forbidden raw keys.
   - In `backend/src/modules/marketplace/services/marketplace.product.get.ts`, presigned the seller's profile image and returned it in the product detail seller context.
   - In `web/src/features/conversations/components/ConversationDetailsPanel.tsx`, `ConversationThread.tsx`, and `ConversationMessageBubble.tsx`, added `onError` fallback state so that if an avatar fails to load, it cleanly renders stall initials or a placeholder icon instead of a broken image symbol.

3. **Produce Gallery Removal**:
   - Removed the mock "Stall Produce Gallery" and sample mascot images from `ConversationDetailsPanel.tsx` in accordance with user requirements.

4. **S3 Presigning for Conversation Image Attachments**:
   - Created `backend/src/utils/s3-conversation/index.ts` containing `getConversationAttachmentDisplayUrl` and `presignConversationMessageBody` using `@aws-sdk/s3-request-presigner` (24-hour validity).
   - In `backend/src/modules/conversations/services/conversation.attachment.ts`, return the presigned `displayUrl` so uploaded attachments show immediately without 403 Access Denied errors.
   - In `backend/src/modules/conversations/services/conversation.messages.list.ts`, presign message bodies on retrieval so historical conversation images always render with valid AWS S3 signatures.
   - In `backend/src/modules/conversations/services/conversation.message.create.ts`, presign outgoing message bodies before returning and broadcasting over WebSockets.
   - In `web/src/features/conversations/components/ConversationMessageBubble.tsx`, enhanced image rendering with `min-h-[140px] min-w-[200px]` containers and graceful error fallback.

5. **Mobile Chat Attachments & Image Viewer**:
   - In `mobile/src/features/conversations/api.ts`, added `uploadConversationAttachment(imageUri: string)` using `expo-file-system` and `FormData`.
   - Created `mobile/src/features/conversations/components/ConversationBubble.tsx` to parse image URLs in message bodies, render rounded produce thumbnails, and provide full-screen zoom modals.
   - In `mobile/app/(app)/conversations/[id].tsx`, added `<Paperclip />` button using `expo-image-picker`, upload staging pill with thumbnail and removal button, and integrated `ConversationBubble`.

## Why

- **Private S3 Bucket Access**: The Agrivive S3 bucket (`agrivive-s3-5p3nb0`) is private. Direct requests to raw URLs return HTTP 403 Forbidden. Presigning with AWS credentials ensures authorized, temporary access for both Web and Mobile clients.
- **Cross-Platform Parity**: Buyers and sellers communicating on mobile need to exchange produce photos for quality verification just like on the web platform.
- **Source Code Modularity**: Extracted `ConversationBubble.tsx`, `ConversationInput.tsx`, and `s3-conversation` utilities so all files strictly comply with the $\le 200$ line-length limit.

## Affected paths

- `backend/src/utils/s3-conversation/index.ts`
- `backend/src/modules/conversations/services/conversation.attachment.ts`
- `backend/src/modules/conversations/services/conversation.list.ts`
- `backend/src/modules/conversations/services/conversation.messages.list.ts`
- `backend/src/modules/conversations/services/conversation.message.create.ts`
- `backend/src/modules/conversations/index/conversation.routes.ts`
- `backend/src/modules/marketplace/services/marketplace.product.get.ts`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
- `web/src/features/marketplace/types.ts`
- `web/src/features/conversations/api.ts`
- `web/src/features/conversations/components/BuyerConversations.tsx`
- `web/src/features/conversations/components/ConversationDetailsPanel.tsx`
- `web/src/features/conversations/components/ConversationThread.tsx`
- `web/src/features/conversations/components/ConversationMessageBubble.tsx`
- `web/src/features/conversations/components/ConversationInput.tsx`
- `mobile/src/features/conversations/api.ts`
- `mobile/src/features/conversations/components/ConversationBubble.tsx`
- `mobile/app/(app)/conversations/[id].tsx`
- `Agrivive/04 Delivery/2026-10-19 Chat Attachments Avatars and Marketplace Map Pinpoint Fix.md`

## Verification performed

1. **Backend Verification**:
   - `bunx tsc --noEmit` exited with code 0 (no errors).
   - `bun build src/index.ts --outdir dist --target bun` exited with code 0 (bundled 1698 modules in 1.9s).
2. **Web Typecheck**:
   - `bun run typecheck` (`tsc --noEmit`) in `web/` exited with code 0 (no errors).
3. **Mobile Typecheck**:
   - `bun run typecheck` (`tsc --noEmit`) in `mobile/` exited with code 0 (no errors).
4. **File Length Compliance**:
   - `s3-conversation/index.ts`: 37 lines ($\le 200$)
   - `conversation.attachment.ts`: 20 lines ($\le 200$)
   - `conversation.messages.list.ts`: 29 lines ($\le 200$)
   - `conversation.message.create.ts`: 88 lines ($\le 200$)
   - `ConversationMessageBubble.tsx`: 95 lines ($\le 200$)
   - `mobile/src/features/conversations/api.ts`: 75 lines ($\le 200$)
   - `ConversationBubble.tsx`: 70 lines ($\le 200$)
   - `mobile/app/(app)/conversations/[id].tsx`: 164 lines ($\le 200$)
