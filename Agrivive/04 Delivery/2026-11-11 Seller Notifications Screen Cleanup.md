---
title: Seller Notifications Screen Cleanup
type: delivery
date: 2026-11-11
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]] · Related: [[2026-11-11 Seller App Pill Controls and Quiet Borders]]

# Seller notifications screen cleanup

**Notifications.** Website white page, each notification is its own white card with a light border. Unread new reservations, messages and questions get a light green tint, a green edge and a "New" label with a filled green action button; urgent ones keep the amber tint, edge and "Needs action" label. The unread dot sits on the icon, titles are 16, section headings read Today, Yesterday, Earlier in sentence case, the summary line is 14.

**Pagination (app-wide).** The Show 5, 10, 20 options sit in a pill card again, with an outline and shadow so faint they only separate it from the page; the chosen size is filled green.

**Files.** `mobile/app/(app)/notifications.tsx`, `mobile/src/features/notifications/components/` (`NotificationTimelineCard` and its styles, header bar, summary, category tabs), `mobile/src/components/PaginationControl.tsx`.

**Checked.** Mobile typecheck. Not seen on a phone.
