---
title: Seller Profile Regrouped With Quick Actions
type: delivery
date: 2026-11-11
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]]

# Seller Profile regrouped with quick actions

**What changed.** On the seller Profile page: a new **quick actions** card after the seller card shows "Close store today" (a switch that uses the existing Closed today route) and "Reviews waiting for your reply" with a count (from `summary.unansweredCount` of `GET /seller/reviews`). The settings list is split into three groups (Your store, Account and safety, About). Log Out moved out of the list into its own solid red button. The page background is whiter (`#FCFBF9`), borders are lighter (`#EEECE6`), and the stall card is calmer (shorter map, regular-weight address). The lighter tokens also apply to the other Profile screens that share `profileTokens.ts`.

**Files.** `mobile/app/(app)/profile/index.tsx`, `mobile/src/features/profile/components/ProfileQuickActions.tsx`, `ProfileSettingsList.tsx`, `ProfileLogoutButton.tsx`, `ProfileStallCard.tsx`, `hooks/useProfileActions.ts`, `profileTokens.ts`.

**Checked.** Mobile typecheck only. Not seen on a phone.
