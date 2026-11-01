# 2026-11-02 Stitch App Start States Redesign Frames

**Date:** 2026-11-02  
**Project:** AGRIVIVE MOBILE UI (`11184471743007910085`)  
**Design System:** Lush Agro-Commerce (`assets/f47dfb9bbc764f6b9ea16ff85a7b3e78`)  
**Platform:** Expo / React Native (`mobile/`, TypeScript strict)  
**Viewport:** Mobile Portrait (390 × 844, safe area insets respected, light mode)  

---

## 1. High-Fidelity Stitch Screen Roster (Frames F1–F7)

The complete suite of app start states has been generated directly into the project canvas:

- **Stitch Project:** `AGRIVIVE MOBILE UI` (`11184471743007910085`)
- **Stitch Screen Canvas:** `Agrivive Seller App - App Start States (F1-F7)` (`7e109b890c104c4cb7a2b940d5cf5d90`)
- **Interactive Project Link:** [Open in Google Stitch](https://stitch.withgoogle.com/project/11184471743007910085)
- **High-Res Canvas Preview:** [Download Screenshot](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/93d44cd5e8884bccbe1ab589fb6e2167:download)
- **Bounded HTML/Tailwind Structure:** [Download HTML](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/9ba0cbdb3d114d7cb43ad7b71cc79fa1:download)

### Screen Breakdown
- **F1 — Native Splash**: Pure white `#FFFFFF` surface with the centered 240px wide Agrivive logo (`./assets/agrivive-splash.png`).
- **F2 — Unified Loading (Dual Phase)**:
  - *F2a (< 1.5s)*: Logo at identical position with 24px primary green spinner under it. No text flash.
  - *F2b (> 1.5s)*: Logo + spinner + caption `"Getting your stall ready…"`.
  - *F2c (> 10s)*: Adds secondary text button `"Taking too long? Try Again"`.
- **F3 — No Internet (Network Failure / Timeout 408)**: 40px `WifiOff` icon (`#6B7280`), title `"No Internet"`, body `"Check your mobile data or Wi-Fi, then try again."`, 48px primary button `[Try Again]` (spinner when active), text button `"Log Out"`, footer `"Signed in as n•••n@example.com"`.
- **F4 — Server Problem (5xx / Unexpected)**: 40px `CloudOff` icon (`#C97850`), title `"Agrivive Isn't Responding"`, body `"This is on our side. Try again in a minute."`, `[Try Again]`, text button `"Log Out"`, footer `"Signed in as n•••n@example.com"`.
- **F5 — Account Paused (403 Temporary Restriction)**: 40px `Clock` icon (`#D97706`), title `"Your Account Is Paused"`, backend seller reason, warning time pill `"Back in 11 hours"`, `[Try Again]`, text button `"Log Out"`, footer `"Signed in as n•••n@example.com"`.
- **F6 — Account Blocked (403 Indefinite Block)**: 40px `ShieldAlert` icon (`#DC2626`), title `"Your Account Is Blocked"`, backend reason, 48px primary button `[Restore My Account]` (routes to `/account-recovery` with email prefilled), text button `"Log Out"`, footer `"Signed in as n•••n@example.com"`.
- **F7 — Log Out Confirmation Dialog**: Modal dialog over dimmed backdrop: `"Log out of Agrivive?"` with `[Cancel]` and red `[Log Out]` (`#DC2626`).

---

## 2. Element → Field / Action → Codebase Mapping

| UI Element | Field / Action / Data Source | File & Line Reference |
| :--- | :--- | :--- |
| **Native Splash Container** | `expo-splash-screen` config (image `./assets/agrivive-splash.png`, width 240, `#FFFFFF`) | `mobile/app.json:42-49` |
| **Splash Hiding Hook** | `SplashScreen.hideAsync()` triggered once fonts load | `mobile/app/_layout.tsx:18-32` |
| **App Routing Decision** | `isReady`, `isSessionPending`, `session`, `loadingSetup`, `setupError`, `setup` | `mobile/app/index.tsx:9-97` |
| **Loading State Wait Check** | Unified check merging `!isReady`, `isSessionPending`, and `loadingSetup` | `mobile/app/index.tsx:21-54` |
| **Delayed Loading Caption** | 1.5s timer controlling visibility of `"Getting your stall ready…"` | `mobile/app/index.tsx:47-54` |
| **10s Slow Load Action** | 10s timer revealing `"Taking too long? Try Again"` calling `refreshSetup()` | `mobile/app/index.tsx:50-54`, `mobile/src/context/AuthContext.tsx:59-77` |
| **Error Status Classification** | `err.statusCode` from `ApiError` (408, 403, 5xx, or TypeError) | `mobile/src/api/client.ts:45-54`, `mobile/src/context/AuthContext.tsx:66-74` |
| **S3 No Internet UI** | `WifiOff`, `"No Internet"`, `"Check your mobile data or Wi-Fi, then try again."` | `mobile/app/index.tsx:57-69` |
| **S4 Server Problem UI** | `CloudOff`, `"Agrivive Isn't Responding"`, `"This is on our side. Try again in a minute."` | `mobile/app/index.tsx:57-69` |
| **S5 Account Paused UI** | `Clock` (`#D97706`), `"Your Account Is Paused"`, `endsAt` remaining time pill | `backend/src/modules/auth/services/auth.session.ts:50-84`, `mobile/app/index.tsx:57-69` |
| **S6 Account Blocked UI** | `ShieldAlert` (`#DC2626`), `"Your Account Is Blocked"`, `[Restore My Account]` | `backend/src/modules/auth/services/auth.session.ts:81-83`, `mobile/app/index.tsx:57-69` |
| **Try Again Action** | `refreshSetup()` retry invocation with active spinner | `mobile/src/context/AuthContext.tsx:59-77`, `mobile/app/index.tsx:64` |
| **Restore Account Navigation** | `router.push({ pathname: "/(auth)/account-recovery", params: { email } })` | `mobile/app/(auth)/account-recovery.tsx:20-44` |
| **Log Out Action** | `signOut()` modal confirmation calling `authClient.signOut()` | `mobile/src/context/AuthContext.tsx:106-113` |
| **Masked User Email** | Masked `session.user.email` caption (`n•••n@example.com`) | `mobile/src/context/AuthContext.tsx:12-31`, `mobile/app/index.tsx:57-69` |
| **408 Timeout String** | `client.ts` timeout rejection string | `mobile/src/api/client.ts:122-127` |
| **Backend 403 Paused Reason**| `trust_actions` check returning seller-specific explanation and time left | `backend/src/modules/auth/services/auth.session.ts:50-84` |

---

## 3. Copy Changes (Old Technical / Ambiguous → Plain Words)

| Old / Legacy Text | New Plain User-Facing Text | Context / Trigger |
| :--- | :--- | :--- |
| `Connecting to Agrivive...` | `Getting your stall ready…` | Loading state after 1.5s delay |
| *(None / Infinite Spinner)* | `Taking too long? Try Again` | Loading state after 10s delay |
| `Connection Error` | `No Internet` | Network failure / 408 timeout |
| `Connection Error` | `Agrivive Isn't Responding` | 5xx server errors / bad gateway |
| `Connection Error` | `Your Account Is Paused` | 403 temporary suspension |
| `Connection Error` | `Your Account Is Blocked` | 403 permanent/indefinite block |
| `Retry` | `Try Again` | Primary retry CTA button |
| `Could not connect to Agrivive. Check that the backend is running and your phone is on the same Wi-Fi.` | `Check your mobile data or Wi-Fi, then try again.` | 408 timeout / offline diagnostic body |
| `Failed to load seller setup status` | `This is on our side. Try again in a minute.` | 5xx server error body |
| *(No button)* | `Restore My Account` | Primary CTA on Account Blocked (S6) |
| *(No button)* | `Log Out` | Secondary text button on all error states (S3–S6) |
| `Your account is paused because previous reservations were not picked up before they expired...` | `Your account is paused because 2 buyer questions weren't answered in time. You can sell again in 11 hours.` | Backend seller suspension reason (S5) |

---

## 4. Required Behavior Changes (Code Implementation Tasks)

1. **Retain Status Codes in AuthContext**:
   - `AuthContext.tsx`: Update `setupError` state to store both the message and `statusCode` (or an error kind enum: `offline`, `server`, `paused`, `blocked`). Do not collapse errors into a generic string.
2. **Add Log Out & Restore Navigation to Start Screen**:
   - `index.tsx`: Render a secondary `"Log Out"` text button on all error screens (S3–S6) calling `signOut()`. On S6 (`blocked`), render `"Restore My Account"` navigating to `/(auth)/account-recovery` with `session.user.email` passed as a query param.
3. **Unified Loading Architecture with Staggered Copy**:
   - Merge `!isReady`, `isSessionPending`, and `loadingSetup` into one visual component. For the first 1.5 seconds, display only the logo and spinner (preventing layout flash for fast connections). After 1.5s, display `"Getting your stall ready…"`. If still loading after 10s, show `"Taking too long? Try Again"`.
4. **Strict Visual Alignment with Native Splash**:
   - Ensure the logo in `index.tsx` exactly matches the position, dimension (240px width), and scaling of `expo-splash-screen` (`./assets/agrivive-splash.png`) to eliminate screen jumps during font and asset hydration.
5. **Seller-Specific Account Suspension Backend Logic**:
   - `backend/src/modules/auth/services/auth.session.ts`: Stop returning buyer-specific pickup expiration messages to sellers. Check `current.role`; if `seller`, return seller-oriented trust reasons (e.g. unfulfilled reservations, unanswered buyer inquiries). Compute time left directly from `endsAt` without guessing from points. When `endsAt` is null, explicitly declare the account "blocked" with no time label.
6. **User-Friendly Timeout Messaging in API Client**:
   - `client.ts`: Replace the developer-focused 408 error message with `"Check your mobile data or Wi-Fi, then try again."`
