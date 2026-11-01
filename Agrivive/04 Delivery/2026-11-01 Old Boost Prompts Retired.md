# Old "boost again" prompts retired (2026-11-01)

**What:** Boosts left over from the removed "boost again after a price drop" flow (status `prompt`) still showed "Needs your choice" even though price drops had posted. They now show as skipped, a migration marks them dismissed, and the "Price dropped · Boost again" chip on listing cards is gone. Pressing Boost on a listing that is already boosted now answers 409 instead of looking like a new boost.

**Files:** backend seller.visibility-boost.progress.ts, queue.ts, seller.product.list.boost.ts, drizzle/20261101180000_dismiss_boost_prompts (new, not applied), API_ENDPOINTS.md (dist rebuilt); mobile BoostChip, marketing types.

**Checked:** backend `bunx tsc --noEmit`, mobile `bun run typecheck`. Not run on a device. Owner to apply the migration.
