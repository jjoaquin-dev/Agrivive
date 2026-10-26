---
title: Buyer Account Menu Notifications and Messages Redundancy Removal
date: 2026-10-26
type: delivery
status: completed
related_documents:
  - "[[2026-10-26 Web Spacing, Padding, and Sizing Standards Alignment]]"
---

# Buyer Account Menu Notifications and Messages Redundancy Removal

## Overview
1. Removed redundant "Notifications" and "Messages" items from the buyer profile dropdown menu ([`BuyerAccountMenu.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/components/BuyerAccountMenu.tsx)) because dedicated Message and Notification interactive triggers are already prominently located in the top navigation bar right beside the account avatar button.
2. Aligned the buyer profile dropdown style with the All Category dropdown list popover:
   - Applied floating card geometry (`rounded-2xl border border-neutral-100 bg-white p-2 shadow-[0_12px_36px_rgba(0,0,0,0.08)] animate-in fade-in-0 zoom-in-95 duration-150`).
   - Integrated `px-3.5 py-2.5 rounded-xl text-[13px] font-medium` item rows with brand green hover state `hover:bg-[#457D00]/10 hover:text-[#457D00]`.
   - Added an **All Orders** destination navigating directly to `/orders` with a `Package` icon.

## UI/UX & Psychological Principles
- **Hick-Hyman Law** (*William Edmund Hick & Ray Hyman*): Decreasing redundant choices in the profile dropdown minimizes decision-making latency and cognitive load.
- **Jakob's Law** (*Jakob Nielsen*) & **Don't Make Me Think** (*Steve Krug*): Standard user expectations align top-level communication icons (unread notification badges and chat drawers) directly in the global navigation bar, keeping the account avatar menu dedicated to account profile management, order tracking, and authentication actions.
- **Law of Similarity** (*Gestalt*): Reusing the Category dropdown's rounded geometry and hover tokens creates visual coherence across the header navigation.

## Affected File Paths
- `web/src/components/BuyerAccountMenu.tsx`

## Verification Performed
- Ran TypeScript typecheck (`bunx tsc --noEmit` inside `web/`), which completed with exit code 0 and zero errors.
