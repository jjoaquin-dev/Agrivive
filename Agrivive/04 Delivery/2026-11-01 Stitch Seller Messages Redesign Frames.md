# 2026-11-01 Stitch Seller Messages Redesign Frames

**Date:** 2026-11-01  
**Project:** AGRIVIVE MOBILE UI (`11184471743007910085`)  
**Design System:** Lush Agro-Commerce (`assets/f47dfb9bbc764f6b9ea16ff85a7b3e78`)  
**Platform:** Expo / React Native (`mobile/`, TypeScript strict)  
**Viewport:** Mobile Portrait (390 × 844, safe area insets respected, light mode)  

---

## 1. High-Fidelity Stitch Screen Roster (Frames F1–F11)

All 12 screen variations have been generated directly into the project canvas:

| Frame | Screen Name | Screen ID | Download URL |
| :--- | :--- | :--- | :--- |
| **F1** | Messages — All Filter Active | `6c549aaa04694356bee1b436cf922823` | [Download F1](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/4c956034d4214e0c92b1b40fd4cd5063:download) |
| **F2** | Messages — Unread Filter & Search Active ("Kamatis") | `ea2d9c4fba974fc0ad78d12e34569f3d` | [Download F2](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/c8f8a4b079204d75ac6a9ac8da882a43:download) |
| **F3** | Messages — New Seller Empty State | `ac938f82d39545d786328ce2be6deee1` | [Download F3](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/8924c98db6004092b7b88db86b7e43a9:download) |
| **F3b** | Messages — Loading Skeleton (6 rows shimmer) | `35650554bc0141f3853651d55afe6413` | [Download F3b](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/2cabc512cb39432697192fdae1df96e5:download) |
| **F4** | Messages — Sort Sheet Bottom Modal | `af0fb3563c6141ea8e97cb4e59faad06` | [Download F4](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/11dc8f1e69a349a9a06c0e519d16d468:download) |
| **F5** | Questions — Waiting (Expanded Answer Composer) | `81e435bce89544949ef84624e873585e` | [Download F5](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/22f8b89d04b04868b70c91193c116c51:download) |
| **F6** | Questions — All (Answered Card & Send Error) | `af95a830f9074e0ba5ceb3e8bca88a4a` | [Download F6](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/93ab1b85b5214dc2858c8dc0ab6bba18:download) |
| **F7** | Chat — Order Context (Jose Reyes, Reservation Pass) | `1ac4914a8f93423898e5d09c3505131b` | [Download F7](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/fdb6b1e26ad94af69d7ee67edbb16948:download) |
| **F8** | Chat — Product Context (Maria Santos, Photo Uploading) | `9c809f7536324117b7927b42dbc25779` | [Download F8](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/862d21dddeac4f0e8ea7ec3a2ee6b28b:download) |
| **F9** | Chat — Network Reconnecting & Send Error State | `014a615a16914b708d19e7e2804b947a` | [Download F9](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/b8978b52aaf54d84b8efbaa22016977a:download) |
| **F10** | Chat — Closed State (Carlo Mendoza, Replaced Bar) | `7e50946f8f3a4a6abab3b621d98388bd` | [Download F10](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/53e2560942a848ce963dd03751eb0827:download) |
| **F11** | Chat — Full-Screen Photo Viewer Lightbox Modal | `8715a2bdba604e06afa5e5a5a0c88b45` | [Download F11](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/dda542244963469e8f61a68c9acd8538:download) |

---

## 2. Element → Field / Action → Codebase Mapping

| UI Element | Field / Action / Data Source | File & Line Reference |
| :--- | :--- | :--- |
| **Messages Tab Badge** | `unreadMessages` badge count (shows "9+" above 9) | `mobile/app/(app)/(tabs)/_layout.tsx:55-66` |
| **Screen Title & Subtitle** | `Messages` title, `${unreadCount} unread` / `No unread messages` | `mobile/src/features/conversations/components/MessagesHeader.tsx:35-37` |
| **Mark All as Read CTA** | `markAllConversationsRead()` triggered when unread > 0 | `mobile/src/features/conversations/components/MessagesHeader.tsx:41-52` |
| **Search Toggle Button** | 44×44px icon button toggling search input | `mobile/src/features/conversations/components/MessagesHeader.tsx:58-69` |
| **Sort Sheet Button** | 44×44px button opening Sort bottom sheet | `mobile/src/features/conversations/components/MessagesHeader.tsx:71-84` |
| **Filter Chips Bar** | `All`, `Unread`, `Produce`, `Reservations`, `Questions` | `mobile/src/features/conversations/components/MessagesChipRow.tsx:19-25` |
| **Conversation List Item** | Buyer avatar initials, buyer name, produce name context pill | `mobile/src/features/conversations/components/ConversationListItem.tsx:42-88` |
| **Urgent Waiting Pill** | `Waiting for You` amber pill on unread customer questions | `mobile/src/features/conversations/components/ConversationListItem.tsx:75-81` |
| **Loading Skeleton (6 rows)** | 6 repeating shimmer rows with avatar and text blocks | `mobile/src/features/conversations/components/ConversationSkeletonList.tsx:16-48` |
| **Empty State Card** | Sprout icon, "No messages yet", plain explanation | `mobile/src/features/conversations/components/ConversationEmptyState.tsx:14-32` |
| **Sort Bottom Sheet** | Radio rows: `Newest first`, `Unread first`, `Oldest first` | `mobile/src/features/conversations/components/ConversationSortSheet.tsx:21-62` |
| **Questions Segmented Control** | `Waiting (N)` vs `All` sub-filter pills | `mobile/src/features/messages/components/ProductInquiryHeader.tsx:18-42` |
| **Question Card (Answered)** | Inset container with left green border, reply body, sent date | `mobile/src/features/messages/components/QuestionCard.tsx:90-98` |
| **Question Answer Box** | Multiline text input, `N/1000` counter, Cancel & Send buttons | `mobile/src/features/messages/components/QuestionAnswerBox.tsx:30-80` |
| **Inline Answer Send Error** | Red inline banner beneath input with "Try Again" retry action | `mobile/src/features/messages/components/QuestionAnswerBox.tsx:48-49` |
| **Chat Header Bar** | 44×44px back button, buyer initials avatar, name, no fake dots | `mobile/src/features/conversations/components/ConversationHeaderBar.tsx:22-54` |
| **Pinned Context Banner** | 40px produce thumbnail, quantity, price, order status pill | `mobile/src/features/conversations/components/ConversationContextBanner.tsx:40-89` |
| **Reservation Pass Card** | Order items breakdown, total amount, pass expiration date, CTA | `mobile/src/features/conversations/components/ConversationReservationCard.tsx:49-80` |
| **Date Dividers** | "Today", "Yesterday", or "MMM D" pill divider | `mobile/app/(app)/conversations/[id].tsx:16-24, 103-109` |
| **Clustered Message Bubbles** | Consecutive grouping: sender avatar on first, time on last | `mobile/src/features/conversations/components/ConversationBubble.tsx:46-117` |
| **Quick Replies Carousel** | Horizontal pills inserting drafts into input without autosend | `mobile/src/features/conversations/components/ConversationQuickReplies.tsx:22-50` |
| **Reconnecting Socket Banner** | Amber banner: "Reconnecting… new messages may be late." | `mobile/src/features/conversations/components/ConversationComposer.tsx:57-61` |
| **Failed Message Retry** | Red status line: "Not delivered." + "Try Again" button | `mobile/src/features/conversations/components/ConversationComposer.tsx:63-78` |
| **Photo Upload Preview Strip** | Inset strip: thumbnail, "Uploading…", "Photo ready", "✕" button | `mobile/src/features/conversations/components/ConversationComposer.tsx:80-98` |
| **Closed Chat Bar** | Full-width gray bar: "This chat is closed." (replaces composer) | `mobile/src/features/conversations/components/ConversationComposer.tsx:45-51` |
| **Full-Screen Photo Modal** | 100% black backdrop, sender info, 44×44px close "✕", save CTA | `mobile/src/features/conversations/components/ConversationBubble.tsx:83-101` |

---

## 3. Copy Changes (Old Technical / Ambiguous → Plain Words)

| Old / Legacy Text | New Plain User-Facing Text | Screen / Context |
| :--- | :--- | :--- |
| `Web Inquiries` | `Questions` | Top segmented control tab |
| `Inquiries` | `Produce` | Filter chip on Messages list |
| `Reservation Orders` | `Reservations` | Filter chip on Messages list |
| `Filter & Sort Messages` | `Sort Chats` | Bottom sheet modal title |
| `Filter By Context` | *(Removed from Sort sheet; handled by top chips)* | Sort sheet simplification |
| `Mark all messages as read` | `Mark All as Read` | Subtitle action button |
| `Connecting to real-time service...` | `Reconnecting… new messages may be late.` | Network reconnecting banner |
| `Delivery failed: network timeout` | `Not delivered. Check your connection.` | Failed message status line |
| `Retry delivery` | `Try Again` | Failed message action button |
| `This thread has been archived` | `This chat is closed.` | Completed order chat composer bar |
| `Customer Name` (on web inquiries) | *(Omitted; questions are anonymous public questions)* | QuestionCard header |
| `Product Inquiry from Storefront` | `Questions on Your Produce` | Informational guidance callout |
| `Enter message to broadcast` | `Write your answer to the buyer...` | QuestionAnswerBox placeholder |
| `Reservation Pass Active` | `Waiting for Pickup` | Reservation status badge |

---

## 4. Behavior Changes & Architectural Truths

1. **Messages Tab Badge Alignment**:
   - The bottom tab badge is populated strictly from `GET /conversations/unread-count` (`unreadMessages`). Shows numeric count `1`–`9` and `"9+"` when greater than 9.
   - Stopped polling heavy endpoints on tab switch; cached data renders optimistically.
2. **Conversation Fetching by ID**:
   - Pushed chat route `mobile/app/(app)/conversations/[id].tsx` loads the thread directly via `GET /conversations/:id` instead of assuming it exists in memory.
3. **Product Question Answers Cross-Posting**:
   - When a seller answers a public product-page question, the backend automatically finds or creates a direct conversation thread with the buyer, inserting the answered question as a contextual chat message. The mobile app immediately refreshes both `direct` conversations and `web` product inquiries.
4. **Sort Sheet Boundary**:
   - The Sort Sheet modal exclusively manages ordering (`Newest first`, `Unread first`, `Oldest first`). Context filtering is performed directly by the horizontal chip row on the main screen, eliminating duplicate filter controls.
5. **Quick Replies Ergonomics**:
   - Tapping a quick reply chip populates the draft input and focuses the keyboard rather than instantly transmitting the message, preventing accidental sends by market vendors with damp or gloved hands.
6. **No Phantom Social Proof or Online States**:
   - No fake green "online" dots, no fake typing indicators, and no read-receipt double-ticks that aren't verified by the database schema.
7. **Photo Lightbox Viewing**:
   - Any image sent in chat is parsed via standard URL matchers and renders an inline preview with a "View" badge. Tapping opens a full-screen, hardware-accelerated black modal with an accessible 44×44px dismiss button.

---

## 5. UI/UX Laws & Cognitive Theories Applied

- **Jakob's Law** *(Jakob Nielsen)*: Uses standard mobile chat and messaging patterns (pushed thread without bottom tabs, clear back button, left-aligned buyer bubbles, right-aligned seller bubbles, bottom keyboard composer).
- **Hick-Hyman Law** *(William Edmund Hick & Ray Hyman)*: Categorizes conversation contexts into distinct top tabs (`Chats` vs. `Questions`) and top chips (`All`, `Unread`, `Produce`, `Reservations`), keeping choices manageable.
- **Miller's Law & Chunking** *(George A. Miller)*: Information inside the chat stream is chunked into logical units: date dividers (`Yesterday`, `Today`), consecutive bubble clustering, and isolated Reservation Pass cards.
- **Tesler's Law (Conservation of Complexity)** *(Larry Tesler)*: The system automatically links produce inquiries, reservation passes, and order statuses to conversation threads so the vendor doesn't have to manually look up order numbers.
- **Recognition Over Recall** *(Jakob Nielsen & Rolf Molich)*: Pinned context banner shows produce photo, quantity, and reservation status at the top of the chat at all times; vendors never have to remember what the buyer reserved.
- **Fitts's Law** *(Paul Fitts)*: All primary buttons (`Send Answer`, `Done`, `View Reservation`) have a minimum height of 48px; all icon touch targets (`Back`, `Search`, `Sort`, `Close`) are at least 44×44px.
- **Doherty Threshold** *(Walter J. Doherty & Ahrvid J. Thadhani)*: 6-row shimmer skeleton state renders immediately while network fetches occur, preventing blank screen flashes.
- **Error Prevention & Inline Validation** *(Caroline Jarrett & Gerry Gaffney)*: Inline retry banner beneath failed messages and questions prevents silent failure and lets the vendor retry with a single tap.
- **Dieter Rams' Ten Principles for Good Design**: Unobtrusive, honest design — no fabricated online statuses, clear indicators when a chat is closed, and genuine photo upload progress.
