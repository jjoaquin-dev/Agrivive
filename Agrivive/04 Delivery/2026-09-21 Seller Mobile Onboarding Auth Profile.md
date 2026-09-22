---
title: Seller Mobile Onboarding, Authentication, and Profile Setup
type: delivery
date: 2026-09-21
status: implemented; automated checks passing; manual device/email tests pending
---

# Seller Mobile Onboarding, Authentication, and Profile Setup

## Why

The Agrivive marketplace connects Davao City sellers with local buyers for marketable surplus vegetables. Previously, the repository had an Elysia backend with seller listing and trust operations, but the mobile application had not yet been scaffolded.

This delivery implements the complete seller onboarding, registration, email OTP verification, stall profile setup with interactive map coordinates in Davao City, server-derived **Verified account** badge, and optional TOTP two-factor security.

## What changed

### 1. Mobile Architecture & Design System
- Scaffolded Expo Router in `mobile/` with TypeScript, separating screens (`app/`), feature components (`src/components/`), theme tokens (`src/theme/`), API services (`src/api/`), and session context (`src/context/`).
- Followed `.agents/design/mobile-design/DESIGN.md`: canonical colors (`#1F4D3A` forest green, `#F8F6F1` ivory background, `#A8BFA3` sage, `#E5E2DA` border), Manrope headings, Inter body, 48 px touch targets, and layouts tailored for 360 px width Android devices.
- Incorporated the Callstack React Native Best Practices skill located in `.agents/skills/mobile/`.

### 2. Onboarding Flow & Routing Fixes
- Three visual onboarding pages:
  1. *Turn surplus into opportunity* (surplus produce listing benefits)
  2. *Manage reservations* (real-time order hold and preparation)
  3. *Arrange easy pickup* (fast QR verification at market stalls)
- Next, Skip, circular page indicators, and thumb-zone actions matching `seller-onboarding-concept-v2.png`.
- "Get started" button directly leads into registration (`/(auth)/register`), while "I already have an account" leads into sign in (`/(auth)/login`).
- `mobile/app/index.tsx` routes unauthenticated users directly to `/(auth)/onboarding` so the onboarding tour is always the entry point for new or unauthenticated users. Back navigation enabled on `login` to allow returning to onboarding.
- Added font loading resilience and splash screen safety timeout (1.2s) in `mobile/app/_layout.tsx` using system font fallbacks per `DESIGN.md`.
- Added dynamic Metro `hostUri` resolution in `mobile/src/api/client.ts` and 2s session timeout guard in `mobile/src/context/AuthContext.tsx` to prevent network freezes.
- **Brand Logo Redesign**: Replaced the squished opaque vertical logo with a 718×179 px 100% transparent horizontal logo lockup matching `seller-onboarding-concept-v2.png`, rendered with official `Manrope_700Bold` and `Inter_600SemiBold` typography and the circular Davao leaf emblem. Increased display size to `176 × 44` px in `mobile/app/(auth)/onboarding.tsx` for prominent visibility without background clipping.

### 3. Authentication & Security
- **Registration**: Email, password, and confirm password (validated client-side). Better Auth receives neutral provisional name `"Seller"`, which is replaced during stall profile setup.
- **Email OTP Verification**: 6-digit code entry, 30-second resend countdown, error messaging, and recovery from interrupted signups.
- **Better Auth Integration**: Session credentials stored in SecureStore via `@better-auth/expo` and forwarded via cookies and Bearer tokens for authenticated API requests.
- **Server-driven Routing**: Routes users dynamically based on server setup state: signed out → Login; unverified email → Verify Email; incomplete stall profile → Profile Setup; verified seller → Profile Overview.
- **Optional TOTP Security**: Selling requires verified email and completed seller profile; TOTP is optional in Profile Security settings. When enabled, signing in enforces the TOTP challenge or emergency backup code recovery.
- **Field-Level Error Ownership**: Conforming to `DESIGN.md`, eliminated generic top-of-form `errorBox` banners. Every form field (`login`, `register`, `verify-email`, `two-factor`, `profile/setup`, `profile/edit`, and `profile/security`) now owns its validation state directly via `InputComponent`'s `error` prop (with red outline and clear guidance beneath the field). Extended `MapPickerComponent` to also support an `error` prop with outline highlight and error text. Errors clear reactively as the user types.

### 4. Seller Profile Setup & Verified Badge
- Stall profile collects personal name, shop name, phone number, stall address, and confirmed map pin.
- **Leaflet + OpenStreetMap via WebView**: Integrated Leaflet with OpenStreetMap tiles via `react-native-webview` in `MapPickerComponent.tsx`. Completely replaces the blank Google Maps view on Android with crisp, genuine OpenStreetMap tiles without requiring a Google Maps API Key. Features custom forest green pin (`#1F4D3A`), tap/drag placement, and interactive pan/zoom.
- **Davao City Public Market Presets**: Added horizontal quick-select market chips (*Bankerohan, Agdao, Toril, Mintal, Buhangin*) that automatically pan the map, set coordinates, and suggest the stall address in one tap.
- **Card-based Layout & Auto-Scroll on Error**: Structured inputs into two clean `CardComponent` sections (**1. Personal Contact** & **2. Stall & Market Location**). Resolved the floating error message and scrolled-off field glitch by adding automatic smooth scrolling to the top on validation failure.
- **Single Cohesive Header**: Disabled redundant native Stack header in `(app)/_layout.tsx` for `profile/setup` and wrapped with `SafeAreaView`, eliminating the double-header overlap and reclaiming 56 px vertical space.
- Personal name updated via Better Auth; stall details created via `POST /seller/profile` with graceful fallback to `PATCH /seller/profile` if a profile already exists, preventing duplicate profile errors.
- **Verified Account Badge**: Derived by the server in `GET /seller/setup` when `account.emailVerified && profileComplete && role.includes("seller")`. Its server explanation reads *"Email verified and seller profile completed."* Clients cannot grant badges or seller roles.

### 5. Enhanced Seller Profile Overview & React Native Optimizations
- **Merchant Identity Header**: Circular avatar with seller initial, sage green border (`#A8BFA3`), personal display name, shop identifier pill (`🏪 Jara`), email, and server-derived **Verified account** badge. Features a direct secondary action button to edit profile and stall details.
- **Market Stall Details Section**: Structured `CardComponent` displaying stall details (Shop Name, Contact Phone, and Stall Address with landmarks) accompanied by emoji markers.
- **Pickup Location Preview**: Embedded Leaflet OpenStreetMap preview with the seller's confirmed coordinates and locked pin, displaying exact location for buyer surplus pickup.
- **Security & Authentication**: Two-Factor Authentication (2FA) status pill (`Active` / `Optional`) with navigation to the full TOTP management flow (`profile/security.tsx`).
- **Davao Pilot Support**: Info card adhering to Section 7 of `DESIGN.md`, providing local marketplace context for Bankerohan, Agdao, Toril, and local public markets with direct helpdesk contact (`support@agrivive.com`).
- **Refined Sign Out**: Ghost action button with clear confirmation dialog to prevent accidental sign-outs.
- **Callstack React Native Best Practices**: Applied `.agents/skills/mobile/SKILL.md` guidelines:
  - Memoized coordinates via `useMemo` to prevent unnecessary Leaflet WebView re-renders and bridge overhead during parent state updates.
  - Wrapped interaction callbacks (`onRefresh`, `handleSignOut`) with `useCallback` for stable function references.
  - Eliminated nested ScrollViews and guaranteed compliant 48 px touch targets.

### 6. Backend Adjustments
- `backend/src/modules/seller/services/seller.setup.ts`: Updated `getSellerSetup` to include the server-derived `badge` object.
- `backend/SELLER_TRUST_MANUAL_TESTING.md`: Clarified that TOTP is optional security in Profile settings rather than mandatory for profile creation and selling.

### 7. Trusted Origins & Email Sandbox Configuration
- **Better Auth Origin Validation**: Expanded `trustedOrigins` in `backend/src/modules/auth/index.ts` to trust Expo scheme (`exp://`), local loopbacks (`localhost`, `127.0.0.1`), emulator bridge (`10.0.2.2`), and local subnet wildcards (`192.168.*:*`, `10.*:*`) alongside `MOBILE_TRUSTED_ORIGINS`. Resolves the `INVALID_ORIGIN` ("invalid origin") error when Expo Go and React Native make auth requests.
- **Mailtrap Email Sandbox & Resend Fallback**: Updated `backend/src/utils/email/index.ts` to support Mailtrap Sandbox HTTP API (`sandbox.api.mailtrap.io`). When `MAILTRAP_API_TOKEN` and `MAILTRAP_INBOX_ID` are set, verification emails are captured in the Mailtrap web inbox dashboard without recipient domain restrictions. Also falls back cleanly to Resend or local simulation.
- **Terminal OTP Logging**: Every authentication OTP generated is printed directly to the server terminal (`[AUTH OTP] EMAIL-VERIFICATION CODE FOR ...: 123456`) for transparent, instant local development.
- **Backend `.env` Fields**: Updated `backend/.env` with all required environment keys: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MOBILE_TRUSTED_ORIGINS`, `ORDER_QR_SECRET`, `MAILTRAP_API_TOKEN`, `MAILTRAP_INBOX_ID`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL`.

### 8. Lucide Icons System Standardization
- **Lucide React Native Integration**: Installed `lucide-react-native@1.47.0`, leveraging existing `react-native-svg` for clean, crisp vector iconography across all Android and iOS viewports.
- **Component Upgrades**:
  - `InputComponent`: Added optional `leftIcon` prop and replaced ASCII/text buttons with interactive `Eye` and `EyeOff` password visibility toggles with expanded 48 px touch areas.
  - `BadgeComponent`: Replaced ASCII checkmarks with vector `BadgeCheck`, `CheckCircle2`, `AlertCircle`, and `AlertTriangle` status icons.
  - `MapPickerComponent`: Replaced emoji markers with `LocateFixed` on the GPS button and `MapPin` on Davao City public market quick-select chips.
- **Screen Iconography Standardization**:
  - `profile/index.tsx`: Replaced all emoji markers with `Store`, `Phone`, `MapPin`, `ShieldCheck`, `Shield`, `Info`, `Pencil`, `Mail`, and `LogOut`, styled within circular 32 px sage wash containers (`rgba(31, 77, 58, 0.08)`).
  - `profile/setup.tsx` & `profile/edit.tsx`: Equipped form fields with semantic left icons (`User`, `Store`, `Phone`, `MapPin`) and primary buttons with `CheckCircle` / `Check`.
  - `profile/security.tsx`: Standardized on `Shield`, `ShieldCheck`, `Key`, `Copy`, `Check`, and `Lock`.
  - Auth flows (`login.tsx`, `register.tsx`, `verify-email.tsx`, `two-factor.tsx`, `onboarding.tsx`): Replaced text/emojis with `Mail`, `Lock`, `LogIn`, `ArrowRight`, `KeyRound`, and `ArrowLeft`.

---

## Affected Files

### Backend
- `backend/src/modules/seller/services/seller.setup.ts`
- `backend/src/modules/auth/index.ts`
- `backend/src/utils/email/index.ts`
- `backend/.env`
- `backend/.env.example`
- `backend/SELLER_TRUST_MANUAL_TESTING.md`

### Mobile
- `mobile/package.json`
- `mobile/app.json`
- `mobile/index.ts`
- `mobile/README.md`
- `mobile/src/theme/index.ts`
- `mobile/src/api/client.ts`
- `mobile/src/api/seller.ts`
- `mobile/src/context/AuthContext.tsx`
- `mobile/src/components/ButtonComponent.tsx`
- `mobile/src/components/InputComponent.tsx`
- `mobile/src/components/CardComponent.tsx`
- `mobile/src/components/BadgeComponent.tsx`
- `mobile/src/components/MapPickerComponent.tsx`
- `mobile/app/_layout.tsx`
- `mobile/app/index.tsx`
- `mobile/app/(auth)/_layout.tsx`
- `mobile/app/(auth)/onboarding.tsx`
- `mobile/app/(auth)/login.tsx`
- `mobile/app/(auth)/register.tsx`
- `mobile/app/(auth)/verify-email.tsx`
- `mobile/app/(auth)/two-factor.tsx`
- `mobile/app/(app)/_layout.tsx`
- `mobile/app/(app)/profile/setup.tsx`
- `mobile/app/(app)/profile/index.tsx`
- `mobile/app/(app)/profile/edit.tsx`
- `mobile/app/(app)/profile/security.tsx`

---

## Verification Performed

1. **Mobile TypeScript Check**:
   ```bash
   cd mobile && bunx tsc --noEmit
   ```
   *Result:* Passed with 0 errors.

2. **Mobile Android Bundle Export**:
   ```bash
   cd mobile && bunx expo export --platform android
   ```
   *Result:* Passed with 0 errors. 1,756 modules bundled into Hermes bytecode (`.hbc`), 53 assets resolved.

3. **Backend TypeScript Check**:
   ```bash
   cd backend && bunx tsc --noEmit
   ```
   *Result:* Passed with 0 errors.

4. **Backend Bun Build**:
   ```bash
   cd backend && bun build src/index.ts --outdir dist --target bun
   ```
   *Result:* Passed with 0 errors (1,236 modules bundled in 219 ms).

5. **Origin Check Verification**:
   - Tested HTTP POST requests with `Origin: exp://<local-ip>:8081` and `Origin: http://<local-ip>:3000`: both accepted without `INVALID_ORIGIN` error.
   - Tested malicious origin (`Origin: https://evil.com` with session cookie): correctly rejected with `HTTP 403 Forbidden: {"message":"Invalid origin","code":"INVALID_ORIGIN"}`.

6. **Manual Device & Email Testing**:
   Recorded as pending until the project owner executes the manual test matrix in `mobile/README.md` on a physical device or emulator connected to Resend and PostgreSQL.

## Section 9 — Lucide Metro Fix & Profile Edit Avatar Upload (2026-09-21)

### Why
- Metro bundler could not resolve `lucide-react-native` because v1.47.0 ships a broken `package.json` `exports` field pointing to a non-existent `dist/esm/lucide-react-native.mjs` file.
- The `profile/edit.tsx` avatar upload widget was incomplete — imports were in place but the UI widget and handlers were not yet inserted.

### What changed

#### `mobile/metro.config.js` [NEW]
Created the Metro config file with a targeted `resolveRequest` override. Rather than disabling `unstable_enablePackageExports` globally (which breaks `better-auth/react` and other subpath imports), the override intercepts only `lucide-react-native` requests and redirects them straight to `dist/cjs/lucide-react-native.js`, bypassing the broken exports map. All other packages (better-auth, @better-auth/expo, etc.) continue to use the normal package-exports resolver.

#### `mobile/app/(app)/profile/edit.tsx` [MODIFIED]
- Added `uploadingAvatar` state.
- Added `performAvatarUpload` and `handlePickAvatar` callbacks (same pattern as `profile/index.tsx`).
- Added `avatarUrl` and `sellerInitial` derived values.
- Inserted the avatar `<Pressable>` widget with circular image/initial + camera badge at the top of the form, above the text inputs.
- Added `avatarSection`, `avatarWrapper`, `avatarImage`, `avatarCircle`, `avatarInitial`, `cameraBadge`, and `avatarHint` styles.

### Affected files
- `mobile/metro.config.js` — NEW
- `mobile/app/(app)/profile/edit.tsx` — MODIFIED

### Verification
- Backend TypeScript check: **Passed (0 errors)** — 2026-09-21
- Restart Expo with `--clear` flag to apply metro.config.js changes

## 2026-09-22 vault privacy cleanup

Replaced the private development LAN address with `<local-ip>`. No credentials,
tokens, passwords, database URLs, signed URLs, or private keys are recorded in
this vault note.
