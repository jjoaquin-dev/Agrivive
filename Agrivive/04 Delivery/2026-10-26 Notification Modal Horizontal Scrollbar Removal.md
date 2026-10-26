# 2026-10-26 Notification Modal Horizontal Scrollbar Removal

## Context & Objectives
In the buyer notification dropdown modal, a default Windows horizontal scrollbar with track arrows was visible below the category filter pills (*"View all 0"*, *"Orders 0"*, *"Produce 0"*, *"Updates 0"*). The goal was to remove this scrollbar completely and ensure the filter capsule presents a clean, unified surface across all browsers.

## Why
- On Windows browsers, an intrusive native gray horizontal scrollbar appeared below the filter pills in `NotificationDropdownComponent`.
- The container had `overflow-x-auto` paired with a `.no-scrollbar` utility class that was not yet defined in the global CSS (`tokens.css`).
- This broke the visual aesthetic of the segmented capsule (*Aesthetic-Usability Effect*, *Gestalt Law of Common Region & Simplicity*).

## What Changed
1. **`web/src/styles/tokens.css`**:
   - Added cross-browser `.no-scrollbar` utility rules in `@layer utilities` to suppress scrollbars on WebKit (`::-webkit-scrollbar { display: none }`), Firefox (`scrollbar-width: none`), and IE/Edge (`-ms-overflow-style: none`).
2. **`web/src/features/notifications/components/NotificationDropdownComponent.tsx`**:
   - Applied explicit inline arbitrary Tailwind variants `[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden` to guarantee scrollbar removal.
   - Refined pill padding from `px-3` to `px-2.5` so all four tab pills sit naturally within the container without unnecessary overflow.
3. **`web/src/features/notifications/components/BuyerNotifications.tsx`**:
   - Added matching scrollbar suppression classes to the full-page notification pills for systemwide consistency.

## Affected Files
- `web/src/styles/tokens.css`
- `web/src/features/notifications/components/NotificationDropdownComponent.tsx`
- `web/src/features/notifications/components/BuyerNotifications.tsx`

## Verification Performed
- Ran `bun run typecheck` (`tsc --noEmit`) in `web/` — exited with code 0.
- Verified Next.js dev server hot reload active at `http://localhost:3001`.
- Verified all edited files adhere to the $\le 200$ lines limit.
