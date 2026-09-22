# Agrivive Seller Mobile App

The Agrivive Seller Mobile application is built with **React Native**, **Expo SDK 57**, **Expo Router**, and **TypeScript**, connected to the Elysia backend API.

## Features in this Release

- **Three-step Onboarding**:
  1. *Turn surplus into opportunity* (surplus vegetable listing overview)
  2. *Manage reservations* (real-time order hold and preparation)
  3. *Arrange easy pickup* (QR code pickup verification)
  - Next/Skip navigation, indicator dots, existing account sign-in link, and SecureStore completion persistence.
- **Authentication**:
  - Email, password, and confirm password registration (provisional name `Seller`).
  - 6-digit Email OTP verification with 30s resend cooldown.
  - Recovery from interrupted signups.
  - Login with password and automatic detection of Two-Factor Authentication (TOTP).
- **Seller Profile Setup & Verification**:
  - Name, shop name, contact number, stall address.
  - Interactive Davao City map pin (`react-native-maps`) with optional `expo-location` assistance and manual placement fallback.
  - Server-derived **Verified account** badge: *"Email verified and seller profile completed."*
  - Duplicate profile prevention (handles interrupted setup / partial saves gracefully).
- **Security & Optional TOTP (2FA)**:
  - Sellers can sell without TOTP once email and profile are verified.
  - Optional TOTP enrollment in Profile Settings: password confirmation → QR code scan (`react-native-qrcode-svg`) or manual key → 6-digit confirmation code → emergency backup codes.
  - Login supports both 6-digit TOTP code and emergency backup code recovery.
  - Password-confirmed 2FA disabling.

---

## Device & Environment Setup

### 1. API Base URL Configuration

The mobile app connects to the Elysia backend via `EXPO_PUBLIC_API_URL`.

Create a `mobile/.env` file (which is git-ignored):

#### For Android Emulator:
The Android emulator routes the host development computer loopback via `10.0.2.2`:
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

#### For Physical Android / iOS Devices:
Use your development computer's Local Area Network (LAN) IP address (ensure your phone and computer are on the same Wi-Fi network):
```env
EXPO_PUBLIC_API_URL=http://192.168.1.XX:3000
```

*Note: Database credentials, Resend API keys, and Better Auth secrets remain exclusively on the backend (`backend/.env`).*

---

## Running the Application

From the `mobile/` directory:

```bash
# Start development server
bun run start

# Run on Android emulator / connected device
bun run android

# Run TypeScript type check
bun run typecheck
```

---

## Verification & Manual Testing Matrix

| Flow | Test Action | Expected Result | Status |
|---|---|---|---|
| **Onboarding Persistence** | Launch app on clean install; swipe 3 slides, tap "Get Started". Re-launch app. | Slide carousel displays; completion saved to SecureStore; subsequent launches bypass onboarding directly to Login. | Pending device test |
| **Onboarding Skip** | Tap "Skip" on slide 1 or 2. | Immediately navigates to Login and marks onboarding complete. | Pending device test |
| **Registration** | Register with new email, password (≥ 8 chars), matching confirm password. | Provisional name `Seller` submitted; redirects to Email OTP screen. | Pending device test |
| **Password Mismatch** | Enter non-matching passwords during registration. | Client-side error displayed; no network request submitted. | Pending device test |
| **Duplicate Signup** | Attempt registration with already registered email. | Error explains account already exists and offers sign-in link. | Pending device test |
| **Email OTP** | Enter 6-digit code received via email. | Code verified; user marked email verified; transitions to Profile Setup. | Pending email test |
| **Invalid / Expired OTP** | Enter incorrect or expired OTP. | Friendly error message displayed; form retained for retry. | Pending email test |
| **Resend OTP** | Tap "Resend Code" after 30s countdown. | Fresh OTP dispatched; countdown resets to 30s. | Pending email test |
| **Interrupted Setup** | Close app after email OTP verification before completing stall profile. Re-open and log in. | Server state routes user directly to Profile Setup. | Pending device test |
| **Stall Profile & Map** | Enter shop name, phone, address; select stall location on Davao City map. | Coordinates recorded; Better Auth name updated; `POST /seller/profile` creates stall profile; seller role assigned. | Pending device test |
| **Map Permission Denial** | Deny location permission when tapping "Use Current". | Alert explains manual placement; seller can drag/tap pin on map without error. | Pending device test |
| **Verified Account Badge** | View profile overview after setup. | "Verified account" badge appears with explanation: *"Email verified and seller profile completed."* | Pending device test |
| **Selling Without TOTP** | With verified profile and TOTP disabled, call listing/stock operations. | Authorized without requiring TOTP challenge. | Verified via backend |
| **TOTP Enrollment** | Go to Profile → Security Settings → Enable 2FA. Confirm password, scan QR code, verify 6-digit code. | Authenticator activated; backup codes generated with copy option. | Pending device test |
| **Mandatory TOTP Login** | Log out after enabling 2FA. Log in with email and password. | Password accepted; prompt for 6-digit TOTP code appears before granting session. | Pending device test |
| **Backup Code Recovery** | On TOTP login prompt, select "Use backup code" and enter one-time code. | Session granted; backup code consumed. | Pending device test |
| **Disable TOTP** | In Security Settings, tap "Disable 2FA" and confirm password. | 2FA deactivated; subsequent logins require only password. | Pending device test |
| **Profile Edit** | Update stall name, phone, address, or map pin in Edit Profile. | `PATCH /seller/profile` updates stall info without creating duplicates. | Pending device test |
| **Logout** | Tap "Sign Out" in Profile overview. | Session cleared from SecureStore; redirects to Login screen. | Pending device test |
