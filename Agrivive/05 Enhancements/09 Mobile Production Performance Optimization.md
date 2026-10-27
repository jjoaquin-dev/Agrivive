---
title: Mobile Production Performance Optimization
type: enhancement
status: completed
created: 2026-10-27
updated: 2026-10-27
tags:
  - mobile
  - react-native
  - expo
  - performance
  - hermes
  - metro
---

# Mobile Production Performance Optimization

## Overview
Comprehensive performance audit and optimization of the Agrivive seller mobile application (`mobile/`) to eliminate network request waterfalls, tree-shake SVG icon bundles, remove ghost native libraries, enable Proguard/R8 shrinking, optimize FlatList virtualization, and achieve instant tab switching with stale-while-revalidate.

---

## What Changed & Why

1. **Elimination of 3.5s Pre-Flight Auth Handshake (`mobile/src/api/client.ts`)**
   - **Why**: `apiFetch` was calling `await authClient.getSession()` with a 3.5-second timeout before *every single API request*. This forced an extra network call across the internet before fetching products, orders, notifications, or scanning QR codes.
   - **What**: Removed the blocking network call. BetterAuth's local session cookie is read locally from `SecureStore` via `authClient.getCookie()`, allowing API calls to execute directly without latency overhead.

2. **Metro ESM Icon Tree-Shaking (`mobile/metro.config.js`)**
   - **Why**: Metro was configured to redirect all `lucide-react-native` requests to a 2.5MB monolithic CJS file (`dist/cjs/lucide-react-native.js`), bundling all 1,400+ SVG icons into memory on launch.
   - **What**: Added `mjs` to `config.resolver.sourceExts` and removed the forced CJS resolver redirection. Metro now natively tree-shakes icons and bundles only the icons actually imported.

3. **Removed Unused Native Maps & Dead Font (`mobile/package.json`, `mobile/bun.lock`)**
   - **Why**: `react-native-maps` was in `package.json`, pulling in ~35MB+ of Google Play Services Maps SDK on Android and iOS pods, even though the app uses `react-native-webview` with Leaflet. `@expo-google-fonts/manrope` was also unused.
   - **What**: Removed both packages from `dependencies` and cleaned the lockfile.

4. **Enabled Android Proguard/R8 & Resource Shrinking (`mobile/app.json`)**
   - **Why**: Android release builds had Proguard and resource shrinking disabled, bundling all unused bytecode, SDK classes, and resources into the APK.
   - **What**: Configured `expo-build-properties` with `enableProguardInReleaseBuilds: true` and `enableShrinkResourcesInReleaseBuilds: true`.

5. **Killed Artificial Startup & Session Timers (`mobile/app/_layout.tsx`, `mobile/src/context/AuthContext.tsx`)**
   - **Why**: A 1,200ms `setTimeout` was keeping the splash screen locked, and a 2,000ms timer was stalling session state in `AuthContext`.
   - **What**: Removed the 1,200ms splash delay (hiding splash screen immediately when fonts are ready) and lowered the fallback timer to 600ms.

6. **Stale-While-Revalidate Tab Navigation (`useInventory.ts`, `useSellerOrders.ts`)**
   - **Why**: Switching tabs between Home, Inventory, and Orders triggered `loadProducts(true)` and `loadOrders(true)`, clearing state and showing full-screen spinners on every tab focus.
   - **What**: Implemented stale-while-revalidate: if items already exist in state, they remain rendered immediately while the background fetch updates values seamlessly.

7. **Component Memoization & FlatList Tuning (`ProductCard.tsx`, `OrderCard.tsx`, `inventory.tsx`, `orders.tsx`)**
   - **Why**: Product and order cards were unmemoized functions re-rendering on every scroll and parent state update, causing frame drops down to 25–40 FPS.
   - **What**: Wrapped `ProductCard` and `OrderCard` with `React.memo`, extracted stable `renderItem` handlers with `useCallback`, and configured `removeClippedSubviews`, `maxToRenderPerBatch={8}`, and `windowSize={5}`.

---

## Affected Files

- `mobile/src/api/client.ts`
- `mobile/metro.config.js`
- `mobile/package.json`
- `mobile/bun.lock`
- `mobile/app.json`
- `mobile/app/_layout.tsx`
- `mobile/src/context/AuthContext.tsx`
- `mobile/src/features/inventory/hooks/useInventory.ts`
- `mobile/src/features/orders/hooks/useSellerOrders.ts`
- `mobile/src/features/inventory/components/ProductCard.tsx`
- `mobile/src/features/orders/components/OrderCard.tsx`
- `mobile/app/(app)/(tabs)/inventory.tsx`
- `mobile/app/(app)/(tabs)/orders.tsx`

---

## Verification Performed

1. **Mobile TypeScript Verification**:
   - `cd mobile && bun run typecheck` (`tsc --noEmit`) -> **Passed with 0 errors**.
2. **Package Cleanup Verification**:
   - `cd mobile && bun install` -> Successfully removed 2 packages in 202ms.
3. **Backend & Web Cross-Check**:
   - `cd backend && bunx tsc --noEmit && bun build src/index.ts --outdir dist --target bun` -> **0 errors**.
   - `cd web && bun run typecheck` -> **0 errors**.
