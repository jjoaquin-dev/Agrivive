---
title: Mobile Notifications Screen Redesign in Google Stitch
type: delivery
date: 2026-11-01
---

# Mobile Notifications Screen Redesign in Google Stitch

## What Changed

Generated 11 high-fidelity mobile UI mockups in Google Stitch project `AGRIVIVE MOBILE UI` (`11184471743007910085`) under design system `assets/f47dfb9bbc764f6b9ea16ff85a7b3e78` ("Lush Agro-Commerce") covering the complete seller **Notifications** suite: default view with unread/urgent notifications, scrolled state with pagination, category filter tabs (All, Reservations, Messages, Account), "All caught up" state, empty state, search zero-results state, skeleton loading state, Filter bottom sheet, and Phone Alerts bottom sheet.

Every mockup strictly respects existing code contracts, design tokens (Forest Green `#0F920F`, Terracotta `#C97850`, Inter font, 4px grid rhythm, 44px/48px touch targets), anti-hallucination rules (zero buyer avatars/photos, no product photos, no currency outside body text), and UX psychological laws (Hick-Hyman Law, Jakob's Law, Recognition over Recall, Von Restorff Effect, Law of Similarity, Fitts's Law, Visibility of System Status, and Law of Proximity).

### Generated Google Stitch Frames (11)

1. **Frame 1 (All · 3 unread, 2 urgent, scrolled top)**: `projects/11184471743007910085/screens/2e879a8e94f2497488f86d5ae30dde57`
   - Custom 56px header (back arrow, gear Settings icon, CheckCheck icon), borderless summary line ("3 new · 2 need you"), horizontal category chips with unread count badges, 44px search & filter row, and Today list with urgent amber indicator bars and unread green dots.
2. **Frame 2 (All · Scrolled to Earlier + Pagination)**: `projects/11184471743007910085/screens/41e94317d2d3437cbf4580564e728f5b`
   - Scrolled feed showing Yesterday items (Boost Again?, Running Low, Pickup Done) and Earlier urgent items (Account Warning, Boost Did Not Post) with 44px bottom pagination bar.
3. **Frame 3 (Reservations Filter Selected)**: `projects/11184471743007910085/screens/6599e93350e2419ab55b86c227706a01`
   - Active "Reservations" chip with white '2' badge, summary "2 new · 1 needs you", and filtered feed showing Reservation Ends Soon (urgent), New Reservation, and Pickup Done.
4. **Frame 4 (Messages Filter Selected)**: `projects/11184471743007910085/screens/46513180ab8e499c836fae1931e5719a`
   - Active "Messages" chip with white '1' badge, summary "1 new · 1 needs you", displaying New Buyer Message (Reply + View Product) and Buyer Is Waiting (urgent reminder).
5. **Frame 5 (Account Filter Selected)**: `projects/11184471743007910085/screens/eb52db8c002e41a7addb8ed968fc47a0`
   - Active "Account" chip (no unread badge), summary "1 needs you", showing read urgent Account Warning card with 3px amber bar and View Details action.
6. **Frame 6 (All Caught Up · Nothing Unread)**: `projects/11184471743007910085/screens/5862e037b3624e978320cd0ac064105f`
   - CheckCheck icon disabled (grey `#9CA3AF`), summary line with green checkmark: "You're all caught up", chips with zero badges, and all items rendered in read state without unread dots.
7. **Frame 7 (Empty State · No Notifications At All)**: `projects/11184471743007910085/screens/7e186c8ab29143428a9e937e67e88dc5`
   - Centered 80px circular container with 36px green Bell icon in `primaryLight`, title "No notifications yet", and subtext "Reservations, messages, and stock alerts show up here."
8. **Frame 8 (No Search Results · "carrot")**: `projects/11184471743007910085/screens/05402ae964d94e76a363cc55e5d70c18`
   - Search input populated with 'carrot' and active 'X' clear button; centered neutral search container with title 'Nothing matches "carrot"' and 44px ghost button "Clear search".
9. **Frame 9 (Loading Skeleton State)**: `projects/11184471743007910085/screens/7741fa0cf3944b83ade8e0840cde8a08`
   - 5 structured notification skeleton rows (40px circular skeleton, header title/time skeletons, multi-line body skeletons, and 14px radius button skeleton in `#F3F4F6`).
10. **Frame 10 (Filter Sheet Open · Unread Only On)**: `projects/11184471743007910085/screens/9c835d158eb34dfa823aa5cdbe309cd3`
    - 20px radius bottom sheet over dimmed backdrop: drag handle, "Filter" title with 44px X button, "Show" switches (Unread only ON, Needs action only OFF), "Order" segmented control (Newest first selected), ghost "Reset", and primary "Show Results" (48px).
11. **Frame 11 (Phone Alerts Sheet Open · Night Mode Off)**: `projects/11184471743007910085/screens/8b0c77be7c8f4766bba3241de0b1f0a6`
    - 20px radius bottom sheet over dimmed backdrop: drag handle, "Phone Alerts" title with 44px X button, explanatory caption, and 4 switch rows: Stock and Price (ON), Boost (ON), Account (ON), Night Mode 9 PM – 6 AM (OFF).

## Affected Codebase Files Mapped

- `mobile/app/(app)/notifications.tsx`
- `mobile/src/features/notifications/types.ts`
- `mobile/src/features/notifications/hooks/useUnifiedNotifications.ts`
- `mobile/src/features/notifications/utils/unifiedNotificationMappers.ts`
- `mobile/src/features/notifications/utils/sellerNoticeMapper.ts`
- `mobile/src/features/notifications/components/NotificationHeaderBar.tsx`
- `mobile/src/features/notifications/components/NotificationSummaryBanner.tsx`
- `mobile/src/features/notifications/components/NotificationCategoryTabs.tsx`
- `mobile/src/features/notifications/components/NotificationSearchBar.tsx`
- `mobile/src/features/notifications/components/NotificationTimelineCard.tsx`
- `mobile/src/features/notifications/components/NotificationTimelineCard.styles.ts`
- `mobile/src/features/notifications/components/NotificationFilterModal.tsx`
- `mobile/src/features/notifications/components/NotificationSettingsSheet.tsx`
- `backend/src/utils/seller-notifications/messages.ts`
- `mobile/src/components/PaginationControl.tsx`
- `mobile/src/theme/index.ts`

## Verification

- Grounding inspection completed across all 15 source files.
- All 11 Stitch screen mockups verified under project `11184471743007910085` with active session IDs and screenshots.
- Zero extra fields added; strict adherence to existing notification contracts and backend message texts.
