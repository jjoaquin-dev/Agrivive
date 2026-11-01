# "Price Lowered" notice now says the new price was posted (2026-11-01)

**What:** After the automatic 6-hour cut is posted on Facebook, the seller gets a Price Lowered notice. It still told the seller to "boost it again" (the old prompt, now removed). Now it reads "<product> went from ₱X to ₱Y. The new price was posted on the Agrivive Facebook Page." It follows the Boost phone-alert setting instead of Stock and Price, because it is a Boost event.

**Files:** backend utils/seller-notifications/messages.ts, integrations notify-price-lowered.ts (dist rebuilt); mobile NotificationSettingsSheet.tsx (hints).

**Checked:** backend `bunx tsc --noEmit` and mobile `bun run typecheck` clean. Owner to test: wait for an automatic cut, or set `follow_up_due_at` to now on a running boost, and check Notifications.
