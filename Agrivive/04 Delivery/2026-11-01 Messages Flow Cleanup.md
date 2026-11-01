---
title: Messages Flow Cleanup
date: 2026-11-01
status: completed
type: delivery
tags:
  - mobile
  - messages
  - conversations
  - ux
---

# Messages Flow Cleanup

## What Changed & Why

Cleaned up and modernized the seller Messages and Conversations experience across `mobile/` to align strictly with the backend conversational capabilities, eliminating visual AI slop and fake status indicators while ensuring fast, intuitive, thumb-friendly interaction for Davao market vendors.

### F1. Unread Count Source
- Added `fetchConversationUnreadCount()` and `fetchConversation(id)` to `mobile/src/features/conversations/api.ts`.
- Switched the bottom tab badge in `mobile/app/(app)/(tabs)/_layout.tsx` to use `unreadMessages` from `GET /conversations/unread-count` (displays "9+" when above 9). Removed legacy `fetchSellerMessages`. Maintained automatic refreshes on mount, on screen focus, and on `"seller_message"` push signals.
- Updated `mobile/app/(app)/(tabs)/home.tsx` to read `unreadMessages` for message count.

### F2. Messages Tab (Inbox) Split & Polish
- Split the monolithic `mobile/app/(app)/(tabs)/messages.tsx` (reduced from 185 to 112 lines) into focused, single-responsibility components:
  - `MessagesHeader.tsx` (188 lines): Clean header with title "Messages", subtitle ("{n} unread" or "No unread messages"), search toggle, sort toggle with indicator dot, and an inline "Mark All as Read" action when unread > 0. Removed the unnecessary back button (it is a bottom tab).
  - `MessagesChipRow.tsx` (90 lines): 36px chips ("All", "Unread {n}", "Produce", "Reservations", "Questions {openCount}") with 44px touch targets and `accessibilityRole="tab"`.
  - `ConversationList.tsx` (166 lines): Handles list presentation, pull-to-refresh, infinite scroll, and contextual empty states.
  - `ConversationSkeletonList.tsx` (80 lines): 6 shimmer skeleton rows replacing generic loading spinners.
  - `useConversationFilters.ts` (62 lines): Filter, search, and sort logic separated from the view.
- Renamed `ConversationFilterModal` to `ConversationSortSheet.tsx` (126 lines): Dedicated sort sheet with "Newest first", "Unread first", and "Oldest first" options and a "Done" button. Removed redundant filter list from the sheet.

### F3. Chat Row (`ConversationListItem.tsx`)
- Removed fake online indicator dot and "⚠️ System" pseudo-warning tags.
- Restricted avatar fallback colors to design tokens: `primary` (#0F920F), `terracotta` (#C97850), `sage` (#A8BFA3), and `textMuted` (#6B7280) via updated `AVATAR_PALETTE` in `avatar.ts`.
- Line 2 tag: Shows produce name or "Reservation" / "Chat" with a 20px thumbnail image when available.
- Line 3 message preview: Recognizes photo URLs and displays `"📷 Photo"`. Prefixes seller's own messages with `"You: "`.
- Buyer response latency pill: When buyer was the last sender, displays a "Waiting {h} hrs" (or "Waiting {m} min" under 1 hour) badge colored by urgency (`textMuted` < 12h, `warning` >= 12h, `error` >= 24h).
- Added grey "Closed" badge for conversations with `status === "closed"`.

### F4. Questions Tab (Product-Page Inquiries)
- Added contextual info banner: *"Questions buyers asked on your product page. Your answer shows there and in your chat."*
- Segmented control toggling between `"Waiting {openCount}"` and `"All"` backed by `useSellerProductInquiries().setFilter("open" | "all")`. Exposed `openCount` from the hook.
- Split `ProductInquiryCard.tsx` into `QuestionCard.tsx` (161 lines) and `QuestionAnswerBox.tsx` (130 lines):
  - Updated copy to plain, respectful language: *"Question"*, *"Your Answer"*, *"Waiting for You"*, *"Answer"*, and *"Send Answer"*.
  - Added timestamp with relative age when waiting: e.g. *"Asked Oct 31, 4:12 PM · 13 hrs ago"*.
  - Added `0/1000` character counter and inline per-field error display.
  - Answering a question automatically refreshes the conversation list because the answer posts directly into the buyer's chat.

### F5. Chat Screen (`[id].tsx` + Components)
- `[id].tsx` (161 lines): Loads conversation directly via `fetchConversation(id)` instead of searching page 1 of all conversations. Split business logic into `useConversationDetail.ts` (115 lines) and `useConversationOrder.ts` (32 lines).
- `ConversationHeaderBar.tsx` (102 lines): Removed "● Online", fake online dot, and "⋮" menu. Back button enforces 44×44px hit area.
- `ConversationContextBanner.tsx` (120 lines): Single tappable bar with zero cryptic `ORD-`/`PRD-` codes:
  - Product chat: 40px thumbnail, produce name, "Listing" label, chevron → navigates to listing.
  - Order chat: produce name, status pill ("Waiting for Pickup", "Picked Up", "Cancelled", "Expired"), chevron → navigates to reservation.
- `ConversationReservationCard.tsx` (136 lines): Header "Reservation" with status badge, item list ("Repolyo — 4 kg"), total ("Total ₱152.00"), pass expiration countdown ("Pass ends Nov 2, 3:00 PM" for pending orders), and a 44px outline button "View Reservation".
- Message List & Bubbles:
  - Dynamic date dividers ("Today", "Yesterday", "Oct 28") computed from message timestamps.
  - Consecutive message grouping: avatar on the first bubble of a cluster, time under the last bubble.
  - "Sent" indicator displayed exclusively under the user's newest message.
  - `ConversationBubble.tsx` (194 lines): Removed legacy keyword-based system card parsing; all messages render cleanly as standard chat bubbles. Photo attachments include full-screen viewer with a 44×44px close control.
- `ConversationQuickReplies.tsx` (66 lines): Quick reply chips (36px height, 44px hit area) that populate and focus the composer draft without auto-sending. Hidden when chat is closed.
- `ConversationComposer.tsx` (139 lines) + `ConversationComposerStyles.ts` (111 lines):
  - 44×44px photo picker button (`ImagePlus` icon).
  - Normal layout status banner above composer (paused socket warning or send error with "Try Again" retry action).
  - Photo preview strip with "Uploading…" progress or "Photo ready" with a 44px touch target remove control.
  - Closed chat state: Replaces composer with a non-interactive grey bar *"This chat is closed."*.

---

## Files Affected

### Mobile App (`mobile/`)
- `mobile/app/(app)/(tabs)/_layout.tsx` (badge unread count source)
- `mobile/app/(app)/(tabs)/home.tsx` (dashboard unread count source)
- `mobile/app/(app)/(tabs)/messages.tsx` (refactored inbox screen, 112 lines)
- `mobile/app/(app)/conversations/[id].tsx` (refactored chat screen, 161 lines)
- `mobile/src/features/conversations/api.ts` (`fetchConversation`, `fetchConversationUnreadCount`)
- `mobile/src/features/conversations/types.ts`
- `mobile/src/features/conversations/utils/avatar.ts` (design token palette)
- `mobile/src/features/conversations/hooks/useConversationFilters.ts` (new)
- `mobile/src/features/conversations/hooks/useConversationOrder.ts` (new)
- `mobile/src/features/conversations/hooks/useConversationDetail.ts` (new)
- `mobile/src/features/conversations/components/MessagesHeader.tsx` (new)
- `mobile/src/features/conversations/components/MessagesChipRow.tsx` (new)
- `mobile/src/features/conversations/components/ConversationList.tsx` (new)
- `mobile/src/features/conversations/components/ConversationSkeletonList.tsx` (new)
- `mobile/src/features/conversations/components/ConversationListItem.tsx` (updated)
- `mobile/src/features/conversations/components/ConversationSortSheet.tsx` (renamed from `ConversationFilterModal`)
- `mobile/src/features/conversations/components/ConversationFilterModal.tsx` (backwards-compatible re-export)
- `mobile/src/features/conversations/components/ConversationHeaderBar.tsx` (updated)
- `mobile/src/features/conversations/components/ConversationContextBanner.tsx` (updated)
- `mobile/src/features/conversations/components/ConversationReservationCard.tsx` (updated)
- `mobile/src/features/conversations/components/ConversationBubble.tsx` (updated)
- `mobile/src/features/conversations/components/ConversationQuickReplies.tsx` (updated)
- `mobile/src/features/conversations/components/ConversationComposer.tsx` (new)
- `mobile/src/features/conversations/components/ConversationComposerStyles.ts` (new)
- `mobile/src/features/conversations/components/QuestionList.tsx` (new)
- `mobile/src/features/conversations/components/QuestionListStyles.ts` (new)
- `mobile/src/features/messages/types.ts` (`openCount` on `SellerProductInquiriesResponse`)
- `mobile/src/features/messages/hooks/useSellerProductInquiries.ts` (exposed `openCount`)
- `mobile/src/features/messages/components/QuestionCard.tsx` (new)
- `mobile/src/features/messages/components/QuestionAnswerBox.tsx` (new)
- `mobile/src/features/messages/components/ProductInquiryCard.tsx` (legacy forwarder)

---

## Verification Performed

1. **TypeScript Typecheck**:
   ```bash
   cd mobile && bun run typecheck
   # Output: $ tsc --noEmit (Clean exit 0, zero errors)
   ```
2. **Android Bundle Export**:
   ```bash
   cd mobile && node ./node_modules/expo/bin/cli export --platform android
   # Output: Exported: dist (Clean exit 0, 3951 modules bundled)
   ```
3. **Source File Line Count Audit**:
   - `messages.tsx`: 112 lines (< 200)
   - `[id].tsx`: 161 lines (< 200)
   - `MessagesHeader.tsx`: 188 lines (< 200)
   - `MessagesChipRow.tsx`: 90 lines (< 200)
   - `ConversationList.tsx`: 166 lines (< 200)
   - `ConversationSkeletonList.tsx`: 80 lines (< 200)
   - `ConversationListItem.tsx`: 187 lines (< 200)
   - `ConversationSortSheet.tsx`: 126 lines (< 200)
   - `ConversationHeaderBar.tsx`: 102 lines (< 200)
   - `ConversationContextBanner.tsx`: 120 lines (< 200)
   - `ConversationReservationCard.tsx`: 136 lines (< 200)
   - `ConversationBubble.tsx`: 194 lines (< 200)
   - `ConversationQuickReplies.tsx`: 66 lines (< 200)
   - `ConversationComposer.tsx`: 139 lines (< 200)
   - `ConversationComposerStyles.ts`: 111 lines (< 200)
   - `QuestionList.tsx`: 144 lines (< 200)
   - `QuestionListStyles.ts`: 87 lines (< 200)
   - `QuestionCard.tsx`: 161 lines (< 200)
   - `QuestionAnswerBox.tsx`: 130 lines (< 200)
   - `useConversationFilters.ts`: 62 lines (< 200)
   - `useConversationOrder.ts`: 32 lines (< 200)
   - `useConversationDetail.ts`: 115 lines (< 200)
   - `api.ts`: 111 lines (< 200)
   - Note: `mobile/app/(app)/(tabs)/home.tsx` is an existing file (224 lines); only 3 lines were touched for the unread count loader.

---

## Device Checks to Hand the Owner

1. **Badge & Subtitle Sync**: With 3 unread chat messages, the Messages tab badge shows `3` and the header subtitle says `"3 unread"`. Opening one chat causes both the badge and subtitle count to decrease immediately.
2. **Mark All as Read**: Tapping `"Mark All as Read"` in the header clears the unread count and badge across the screen.
3. **Buyer Waiting Urgency**: When a buyer's message is the last message sent 13 hours ago, the chat row displays an amber `"Waiting 13 hrs"` pill (transitions to red at 24 hrs, muted gray under 12 hrs, or `"Waiting {m} min"` under 1 hr).
4. **Questions Flow**: In Questions → Waiting, tap `"Answer"`, type reply, and tap `"Send Answer"`. The card moves to All as `"Answered"`, and the buyer's direct chat thread updates with the answer.
5. **Direct Navigation**: Open a conversation that is not on page 1 of the inbox list; the header correctly renders the buyer's real name and the produce or reservation context banner.
6. **Quick Replies Focus**: Tapping a quick reply chip populates the text field and focuses the composer without auto-sending.
7. **Offline Reconnection Banner**: Switching to airplane mode in a chat renders the inline `"Reconnecting… new messages may be late."` status bar directly above the composer without obscuring any UI elements.
8. **Closed Chat State**: A conversation with `status === "closed"` displays a static grey bar `"This chat is closed."` with no composer and hidden quick replies.

---

## UI/UX Laws & Theoretical Foundations

- **Jakob's Law** *(Jakob Nielsen)*: Standard tab-based inbox organization and chat layout mirroring familiar communication platforms (WhatsApp, Messenger), reducing friction for Davao market vendors.
- **Miller's Law & Chunking** *(George A. Miller)*: Broken down chat rows into distinct digestible visual chunks: avatar, title/timestamp, produce context tag, urgency pill, and message preview.
- **Fitts's Law** *(Paul Fitts)*: All primary buttons, text inputs, and actionable controls maintain a minimum height of 48px; back buttons and icon controls enforce minimum 44×44px hit targets.
- **Doherty Threshold** *(Walter J. Doherty & Ahrvid J. Thadhani)*: Instant optimistic updates for draft population from quick replies, inline composer retry, and smooth skeleton shimmers (<400ms visual response).
- **Von Restorff Effect (Isolation Effect)** *(Hedwig von Restorff)*: Reserved high-contrast Forest Green (`#0F920F`) for primary send actions and amber/red for response urgency alerts.
- **Error Prevention & Inline Validation** *(Caroline Jarrett & Gerry Gaffney)*: 1000-character counter on inquiry responses and field-level inline error messages displayed directly beneath the composer.
- **Visibility of System Status** *(Jakob Nielsen)*: Transparent connection banners ("Reconnecting…"), photo upload progress spinners, and explicit "Waiting for You" / "Waiting {h} hrs" badges.
