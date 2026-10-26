# 2026-10-26 Unified Pill Capsule Tab Bar Styling

## Summary of Changes
Unified the segmented tab bar styling across the Notification dropdown popover, the All Orders page, and the Notifications Hub page to match the clean, modern pill-capsule design pattern established on the Messages page (*Aesthetic-Usability Effect*, *Gestalt Law of Similarity*, and *Fitts's Law*). Also updated the All Orders page navigation button to a clean text button.

---

### What Changed & Why

1. **Notification Dropdown Popover (`NotificationDropdownComponent.tsx`)**:
   - Converted the rectangular filter tabs into the organic pill capsule container (`rounded-full bg-[#F5F6EE] p-1 border border-[#EAECE0]`).
   - Active tab: elevated white rounded pill (`bg-white text-[#202E1B] shadow-2xs`).
   - Inactive tabs: soft sage text (`text-[#7A8875] hover:text-[#202E1B]`).
   - Circular count badges: vibrant light lime circle (`bg-[#D2E794] text-[#244218]`) on active tab and muted circle (`bg-[#EAECE0] text-[#7A8875]`) on inactive tabs.

2. **All Orders Tab Navigation (`OrderFilterTabs.tsx`)**:
   - Replaced the underline tab bar style with the enlarged pill capsule segmented control (`rounded-full bg-[#F5F6EE] p-1.5 border border-[#EAECE0]`).
   - Increased button sizing to `px-4 py-2 text-sm font-semibold` with `min-h-[38px]` touch targets.
   - Preserved exact tab ids, labels, and count calculations while standardizing the circular count badges (`size-[22px]`).

3. **All Orders Page Header Navigation (`BuyerOrders.tsx`)**:
   - Transformed the solid green "Browse marketplace ->" button into a clean, minimal text button: `<ArrowLeft /> Back to Marketplace` (`text-neutral-500 hover:text-black font-medium text-[14px]`).
   - Provides consistent navigation back to `/marketplace` aligned with the Messages and Reservation Details pages.

4. **Notifications Hub Page (`BuyerNotifications.tsx`)**:
   - Replaced rectangular tabs with the enlarged pill capsule control (`rounded-full bg-[#F5F6EE] p-1.5 border border-[#EAECE0]`).
   - Styled active white pill with `shadow-2xs` and circular counter badge (`size-[22px]`).

---

## Affected File Paths
- `web/src/features/notifications/components/NotificationDropdownComponent.tsx`
- `web/src/features/orders/components/OrderFilterTabs.tsx`
- `web/src/features/orders/components/BuyerOrders.tsx`
- `web/src/features/notifications/components/BuyerNotifications.tsx`

---

## Verification Performed
- `cd web; bunx tsc --noEmit` — passed with 0 errors.
- Verified line count rule: all affected files strictly $\le 200$ lines (`NotificationDropdownComponent.tsx`: 137 lines, `BuyerNotifications.tsx`: 128 lines, `BuyerOrders.tsx`: 152 lines, `OrderFilterTabs.tsx`: 56 lines).
- Confirmed full preservation of counts, active tab state, filtering logic, and responsive scrolling behavior.
