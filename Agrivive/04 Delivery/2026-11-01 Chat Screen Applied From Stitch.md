# Chat screen applied from Stitch (2026-11-01)

**Frames used:** F7 order chat, F8 listing chat with photo upload, F9 reconnecting banner and not-delivered message, F10 closed chat, F11 full-screen photo.

**What changed (mobile only, no backend change):**
- Header: back, picture, name, a second line ("Order #REF" or "Listing: name", with "• Completed" when the chat is closed after pickup), and an info button that opens the order or the listing.
- Banner under the header: order chat shows first item and amount, total and the reservation pill; listing chat shows price per unit, stock left and the listing status (read from the listing).
- Reconnecting notice is now a full-width amber banner with a spinner under the header.
- Day labels are rounded chips; every message shows its time inside the bubble; the seller's newest message shows a tick (sent). No double tick: messages have no read time in the database.
- Photos in the chat say "Tap to expand" and open a full-screen viewer: who sent it and when, Share, the listing's name, price and stock, and Back to Chat.
- A message that fails stays in the chat with a red outline, "Not delivered." and Try Again. It keeps its client message id, so a retry cannot post twice. The text box is cleared when it fails, so it is not sent twice by hand.
- Photo upload strip: the real picture, file name, a moving bar and a Cancel button that really stops the upload (no percent: the upload gives none).
- Reservation card (Reservation Pass #REF): items with unit price, total, "Pickup Pass ends", and View Reservation Details. It sits at the end of the thread. A line says when the order was picked up, cancelled or expired.
- Closed chat: lock panel "This chat is closed." with the reason from the order status.
- The chat opens at the newest message.

**Not applied, on purpose:** "Save Photo" (no photo-save package installed), "Cash on pickup" (the app has no payment wording), the sample labels "Davao Harvest Batch", "1/1", and the Filipino sample messages and quick replies (we keep our own).

**Backend finding:** nothing sets a conversation to "closed"; the server only refuses messages when it is. The closed panel will not show until a rule closes chats (for example when the order is picked up).

**Files:** mobile app/(app)/conversations/[id].tsx; src/features/conversations/{api.ts, hooks/useConversationDetail.ts, hooks/useConversationProduct.ts (new), utils/chatFormat.ts (new)}; components ConversationHeaderBar, ConversationContextBanner, ConversationBubble, ConversationComposer(+Styles), ConversationReservationCard, and new ConversationReconnectBanner, ConversationDateDivider, ConversationFailedBubble, ConversationPhotoViewer, ConversationUploadStrip, ConversationClosedBar, ConversationOrderEvent.

**Checked:** `bun run typecheck` clean. Not run on a device.
