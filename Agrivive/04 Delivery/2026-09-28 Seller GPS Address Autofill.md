---
title: Seller GPS Address Autofill
type: delivery
date: 2026-09-28
status: implemented; device verification pending
---

# Seller GPS Address Autofill

## What changed

- The seller profile map's GPS action now reverse-geocodes its coordinates and passes a nearby place name and address to the existing address autofill callback.
- The GPS pin remains set if reverse geocoding has no result. The app asks the seller to enter the stall address and landmark manually in that case.
- Split the map view and styles into focused files to meet the repository's 200-line source limit.

## Why

The GPS action previously returned coordinates only. The profile setup screen was already prepared to fill the address field from a suggested address, but never received one from GPS.

## Affected paths

- `mobile/src/components/MapPickerComponent.tsx`
- `mobile/src/components/map-picker/MapPickerMap.tsx`
- `mobile/src/components/map-picker/MapPicker.styles.ts`
- `mobile/src/components/map-picker/location-address.ts`
- `mobile/src/components/map-picker/types.ts`

## Verification

- `bunx tsc --noEmit` in `mobile/`: passed.
- Changed source files are all under 200 lines.
- `git diff --check` found no whitespace errors; Git reported an LF-to-CRLF normalization notice for `MapPickerComponent.tsx`.
- Physical-device or emulator testing remains pending. Verify GPS permission, pin movement, address suggestion, and manual entry when the reverse geocoder has no result. Stall numbers and unmapped landmarks still need seller input.
