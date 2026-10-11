---
title: Inventory Search Keyboard Focus Fix
type: delivery-record
status: implemented
date: 2026-10-12
---

# Inventory Search Keyboard Focus Fix

## What changed

- Changed the inventory `FlatList` header from `ListHeaderComponent={renderHeader}` to `ListHeaderComponent={renderHeader()}`.
- The header is now supplied as a rendered element, so the search `TextInput` stays mounted while the filtered product list updates.

## Why

The previous implementation passed a newly created render function to `FlatList` on every search keystroke. Updating `searchQuery` caused the header, including its `TextInput`, to remount. Android then dismissed the keyboard after the first character. Passing the rendered header element preserves the input instance and its focus while the search result changes.

## Affected path

- `mobile/app/(app)/(tabs)/inventory.tsx`

## Verification

- `mobile`: `bun run typecheck` passed.
- Manual Android retest should confirm that multiple characters can be entered without the keypad closing.
