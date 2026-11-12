---
title: Seller Messages Screens Cleanup
type: delivery
date: 2026-11-11
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Related: [[2026-11-11 Seller Notifications Screen Cleanup]]

# Seller messages screens cleanup

**Messages list.** Website white page, title 28, each chat is its own white card with a light border; chats with unread messages are tinted green. Filter chips are white pills; a chip only shows when it is useful: Unread when there are unread chats, Questions when questions are open, Produce and Reservations only when chats of both kinds exist (otherwise they equal All). All and Archived always show, and so does the open tab.

**Chat.** White page, other person's messages in a soft grey bubble (no border), mine in green. The reservation card in the chat has a filled green "View Reservation Details" button and a softer pass-ends note. Quick replies are soft green pills, the composer and header use lighter borders.

**Files.** `mobile/app/(app)/(tabs)/messages.tsx`, `mobile/app/(app)/conversations/[id].tsx`, and the conversation components (`MessagesHeader`, `MessagesChipRow`, `ConversationListItem`, `ConversationBubble`, `ConversationReservationCard`, `ConversationQuickReplies`, composer styles, header bar, context banner, date divider).

**Checked.** Mobile typecheck. Not seen on a phone.
