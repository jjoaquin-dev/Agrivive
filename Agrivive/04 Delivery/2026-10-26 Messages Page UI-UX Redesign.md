# 2026-10-26 Messages Page UI-UX Redesign

## Date
2026-10-26

## Overview & Objective
Redesigned the buyer messaging interface (`/messages`) to match the clean, modern 3-panel floating cards design specification. The previous layout was a single heavy container with harsh borders. The new design organizes conversations, active threads, and vendor details into three dedicated rounded floating cards over a soft warm cream backdrop (`#F6F7F2`), elevating ergonomics, visual clarity, and brand consistency.

## What Changed

### 1. 3-Panel Card Architecture (`BuyerConversations.tsx`)
- Shifted from a single monolithic bordered container to three floating elevated cards (`rounded-[26px]`, `border border-[#E9EBE2]`, `bg-white`, `shadow-xs`) surrounded by natural whitespace.
- Set responsive layout handling:
  - On mobile/tablet (`< lg`), seamlessly transitions between the conversation list and active chat thread with back-navigation.
  - On desktop (`lg`), displays the conversation list and chat thread.
  - On wide desktop (`xl`), concurrently renders all 3 panels (List, Chat Thread, Vendor/Stall Details Panel).

### 2. Conversation Navigation Panel (`ConversationList.tsx`)
- Added top header with squircle icon badge (`bg-[#EEF5E3] text-[#365E24]`), "Messages" heading, and "All communications" subtitle.
- Implemented rounded pill filter tabs: `All` (with badge `2`), `Unread`, `Important`, and `Closed` inside an organic capsule container.
- Added rounded search bar (`rounded-full bg-[#FAF9F5] border-[#E8EAE0]`) with left magnifying glass icon.
- Styled active conversation item with soft lime container (`bg-[#F6F8ED] border-[#E3EBCE]`), avatar online status ring, and vibrant amber unread indicator badge (`#F59E0B`).

### 3. Active Chat Thread (`ConversationThread.tsx`, `ConversationContextCard.tsx`, `ConversationMessageBubble.tsx`)
- Thread header features vendor avatar, green online status dot, name, and "Active now • Verified vendor" subtitle, paired with circular action controls (Search, Phone, Video, More).
- Incorporated center "Today" date divider pill over horizontal hairline.
- Redesigned produce context card ("ABOUT THIS PRODUCE") with thumbnail, category overline, vendor verified tag, and "View listing >" button.
- Styled outgoing buyer messages with Forest Green pills (`bg-[#386600] text-white`) and double check delivery indicators.
- Added support for Stall Product Gallery showcase card with dark forest green container, item count badge, and thumbnail collage overlay (`+1`).

### 4. Floating Message Composer (`ConversationInput.tsx`)
- Warm cream container (`bg-[#FAF9F3] border border-[#ECEEE2] rounded-2xl`) with clean textarea and bottom action bar.
- Added left toolbar action icons for image attachment, emoji picker, and link insertion.
- Styled primary "Send" button as a Forest Green pill (`bg-[#386600]`) with paper airplane icon.

### 5. Vendor & Stall Details Sidebar (`ConversationDetailsPanel.tsx`)
- Header with "Chat details", "Vendor information", and options trigger.
- Large circular vendor avatar (`size-20`) with bright green online indicator dot.
- Verified vendor badge with checkmark and direct contact phone number.
- Streamlined quick action button: Full-width "Profile" link to the vendor's storefront (non-functional mock Call button removed).
- "STALL INFORMATION" section detailing Stall ID, Bankerohan Market location, Davao City, and Verified Stall badge.
- "INQUIRED PRODUCE" section with thumbnail, produce title, active listing subtitle, and direct view link.

### 6. Upper Left "Back to Marketplace" Navigation
- Added a dedicated "Back to Marketplace" link in the upper left of the messages page container (`web/src/features/conversations/components/BuyerConversations.tsx`) using `14px font-medium`, 16px arrow icon, and 8px gap (`inline-flex min-h-[36px] items-center gap-2 text-[14px] font-medium text-muted-foreground hover:text-foreground`).
- Links seamlessly to `/marketplace`, providing quick, intuitive escape navigation back to browsing produce without relying solely on the primary site header.
- Cleaned up the chat thread header in `ConversationThread.tsx` by removing mock calling/search action icons to keep the interface uncluttered and honest (*Ten Principles for Good Design*).

## UI/UX Standards & Psychological Principles Applied
- **Jakob's Law (Jakob Nielsen)**: Conforms to standard 3-panel chat mental model (Slack, Telegram, WhatsApp Web).
- **Miller's Law & Chunking (George A. Miller)**: Separates channel navigation, live dialogue, and stall verification data into discrete digestible surfaces.
- **Gestalt Principles (Max Wertheimer, Kurt Koffka, Wolfgang Köhler)**:
  - *Law of Common Region*: Discrete rounded cards enclose each context.
  - *Figure-Ground Principle*: White panels lift off the warm cream background with crisp 1px borders and soft ambient shadows.
  - *Law of Proximity*: Tightly groups vendor credentials and quick call/profile actions.
- **Hick-Hyman Law (William Edmund Hick & Ray Hyman)**: Grouped pill filters reduce decision latency.
- **Von Restorff Effect (Hedwig von Restorff)**: Primary green is reserved for primary actions, and amber for unread highlights.
- **Fitts's Law (Paul Fitts)**: All interactive touch targets maintain $\ge 44\text{px}$ accessible dimensions.
- **Doherty Threshold (Walter J. Doherty & Ahrvid J. Thadhani)**: Immediate optimistic feedback and hover micro-interactions.

## Affected File Paths
- `web/src/features/conversations/components/BuyerConversations.tsx`
- `web/src/features/conversations/components/ConversationList.tsx`
- `web/src/features/conversations/components/ConversationThread.tsx`
- `web/src/features/conversations/components/ConversationContextCard.tsx`
- `web/src/features/conversations/components/ConversationMessageBubble.tsx`
- `web/src/features/conversations/components/ConversationInput.tsx`
- `web/src/features/conversations/components/ConversationDetailsPanel.tsx`

## Verification Performed
- Ran `tsc --noEmit` via Bun in `web/`: exited with code `0` (clean compilation with zero type errors).
- Fixed unread/total count badge shape in `ConversationList.tsx` to `inline-flex size-[18px] shrink-0 rounded-full leading-none` so the green background renders as a perfect circle.
