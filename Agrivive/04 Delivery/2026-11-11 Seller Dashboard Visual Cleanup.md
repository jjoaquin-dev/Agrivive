---
title: Seller Dashboard Visual Cleanup
type: delivery
date: 2026-11-11
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]]

# Seller dashboard visual cleanup

**What changed.** The Home tab uses the website's white: page `#FDFDFD`, cards `#FFFFFF`, a faint `#EEECE6` border and a barely-there shadow, all from one file (`mobile/src/features/dashboard/dashboardTokens.ts`). Section headings are one size (18 bold) with 24 px between sections and 12 px under each heading. The header name is larger (22), the two top actions use 16 titles and 13 hints, and the stock cards have 16 px padding, 13 labels, 12 pills with no border. More Tools tiles grow with their text.

**Files.** `mobile/app/(app)/(tabs)/home.tsx` and the `Dashboard*` components in `mobile/src/features/dashboard/components/`.

**Checked.** Mobile typecheck. Not seen on a phone.
