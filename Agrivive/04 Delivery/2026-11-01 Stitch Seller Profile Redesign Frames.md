# 2026-11-01 Stitch Seller Profile Redesign Frames

**Date:** 2026-11-01  
**Project:** AGRIVIVE MOBILE UI (`11184471743007910085`)  
**Design System:** Lush Agro-Commerce (`assets/f47dfb9bbc764f6b9ea16ff85a7b3e78`)  
**Platform:** Expo / React Native (`mobile/`, TypeScript strict)  
**Viewport:** Mobile Portrait (390 × 844, safe area insets respected, light mode)  

---

## 1. High-Fidelity Stitch Screen Roster (Frames F1–F12)

All 13 screens (including F9b) have been generated directly into the project canvas:

| Frame | Screen Name | Screen ID | Download URL |
| :--- | :--- | :--- | :--- |
| **F1** | Profile Tab — Verified, Good Standing (Nena Dizon) | `d913261afe994623b4fe30dd96f11f08` | [Download F1](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/98411db06064484e88dd763f7495dbc3:download) |
| **F2** | Profile Tab — New Seller Checklist ("Not Verified Yet") | `ac65ce43433d4c16bb2a69b52bdea629` | [Download F2](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/9a862082b95d4ba189c23e5a5e3018b3:download) |
| **F3** | Profile Tab — Warning Standing ("Limited until Nov 2, 3:00 PM") | `33e4f8d5248b4d3a964d7da8e5cf7845` | [Download F3](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/129116d42fe34a378a569c91a5ebec50:download) |
| **F4** | Profile Tab — Avatar Action Sheet & Uploading Spinner | `76b4134a3da84eef91f0628e02353aea` | [Download F4](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/0f4a4b658fbd4ca889e3a672b4aaf092:download) |
| **F5** | Edit Profile — Form Filled with Phone Error & Sticky Save Bar | `ff888bf5e68a464b98a8069a81157ba3` | [Download F5](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/39fb936f766241ab922054af8c1bca9a:download) |
| **F6** | Edit Profile — "Leave Without Saving?" Dialog Overlay | `3c8e5c1cab8a452db87d6c1208d46607` | [Download F6](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/4257fdc74c8d47c2b42f04a387378d62:download) |
| **F7** | Setup — Step 2 "Your Stall" with Pin Not Moved Error | `e5c9964dfa794441bb9d0a4231f4de0a` | [Download F7](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/4ed9df7892264a2ca78421736f833b32:download) |
| **F8** | Sign-in Safety — Password Card + Sign-in Code Off | `bc100ee02e5547e7b94ce964ecdeded1` | [Download F8](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/730a2c00dbef4ab59c9c32da46b0c443:download) |
| **F9** | Sign-in Code Setup — Step 2: QR Code Scan & Secret Key | `be4764e4e85446eb9979619775ac1555` | [Download F9](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/c17d11f576be4471a7f69a1dc7689cbb:download) |
| **F9b** | Sign-in Code Setup — Step 3: 6 Digit Boxes & Invalid Error | `1a8cb1c60fea4ba2a7e265f575f01b63` | [Download F9b](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/c6987974bfce40cea6cf2b4d4753dba6:download) |
| **F10** | Sign-in Code Setup — Step 4: 10 Backup Codes & Copied Badge | `905e375908ef49e6a13997c84f9bea2a` | [Download F10](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/65e8e929d0d54b6a94d45c3e38ddc77e:download) |
| **F11** | Sign-in Safety — Sign-in Code On with In-Card Turn Off Alert | `53d32d55d8e347b094b3e6b18c3af4a1` | [Download F11](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/36615597fed242d7b5d5f2f1e60f5384:download) |
| **F12** | Profile Tab — "Log out of Agrivive?" Confirmation Dialog | `b2afa726d19a4870b8c8385d938cf2b1` | [Download F12](https://stitch.googleapis.com/v1/projects/11184471743007910085/files/1c6d479c15464fc78d7cc05a585453b8:download) |

---

## 2. Element → Field / Action → Codebase Mapping

| UI Element | Field / Action / Data Source | File & Line Reference |
| :--- | :--- | :--- |
| **Profile Screen Title** | Tab title "Profile" (no back button, no header icons) | `mobile/app/(app)/profile/index.tsx:28-36`, `mobile/src/features/profile/components/ProfileHeaderBar.tsx:1-40` |
| **Seller Identity Card** | Avatar (72px + camera badge), `shopName`, `name`, "Selling on Agrivive since..." | `mobile/src/features/profile/components/ProfileHeroCard.tsx:20-68` |
| **Verified Badge** | `sellerVerified ? "Verified Seller" : "Not Verified Yet"` | `mobile/src/features/profile/components/ProfileHeroCard.tsx:42-51` |
| **Edit Profile Button** | 48px outline primary button navigating to `/profile/edit` | `mobile/src/features/profile/components/ProfileHeroCard.tsx:64-74` |
| **Finish Setting Up Checklist** | `nextStep !== "ready"` checklist (`emailVerified`, `profileComplete`, `hasPassword`) | `mobile/src/features/profile/components/ProfileVerificationCard.tsx:32-75` |
| **Account Standing Card** | `monitoring.weightedPoints` + `actions[]` (Good Standing / Warning / Limited) | `mobile/src/features/profile/components/ProfileVerificationCard.tsx:78-120`, `mobile/src/features/trust/types.ts:1-25` |
| **Your Stall Card** | `shopName`, `detailAddress`, `pickupInstructions` ("How to find you") | `mobile/src/features/profile/components/ProfileBusinessInfoCard.tsx:18-62` |
| **Contact Card** | `email`, `phoneNumber` (with "Add" action when null) | `mobile/src/features/profile/components/ProfileContactCard.tsx:20-55` |
| **Settings List** | 56px rows: Reviews, Standing History, Change History, Notifications, Sign-in Safety, Log Out | `mobile/src/features/profile/components/ProfileSettingsList.tsx:24-95` |
| **Avatar Sheet & Uploading** | ImagePicker (camera/library) + `uploadSellerAvatar` spinner | `mobile/src/features/profile/components/ProfileHeroCard.tsx:25-40`, `mobile/src/api/seller.ts:60-75` |
| **Edit Profile Header** | Back arrow "←" (44×44), "Edit Profile" title, no Save in header | `mobile/app/(app)/profile/edit.tsx:40-52` |
| **Locked Legal Name** | `name` (disabled appearance, helper: "To change legal name, contact support") | `mobile/app/(app)/profile/edit.tsx:60-72` |
| **Mini Map Picker** | 140px interactive map picker with marker & Bankerohan center | `mobile/src/components/MapPickerComponent.tsx:20-85`, `mobile/app/(app)/profile/edit.tsx:80-92` |
| **Pickup Note Textarea** | `pickupInstructions` (≤500 chars, counter "35/500", helper copy) | `backend/src/db/schema.ts:145-155`, `mobile/app/(app)/profile/edit.tsx:94-110` |
| **Phone Inline Error** | `phoneNumber` validation regex with inline error under field | `mobile/app/(app)/profile/edit.tsx:112-130` |
| **Sticky Save Changes Bar** | 72px docked bar with full-width 48px primary button | `mobile/app/(app)/profile/edit.tsx:140-155` |
| **Unsaved Changes Dialog** | `hasUnsavedChanges` guard modal: "Leave without saving?" [Keep Editing] [Leave] | `mobile/app/(app)/profile/edit.tsx:160-185` |
| **Setup Stepper Header** | "Step 2 of 3 · Your Stall" with 3 step dots (Email ✓, Stall ●, Password ○) | `mobile/app/(app)/profile/setup.tsx:35-55` |
| **Setup Pin Error State** | Red border around map + inline error: "Move the pin to your stall first." | `mobile/app/(app)/profile/setup.tsx:70-95` |
| **First Error Auto-Scroll** | `scrollTo({ y: fieldOffset })` to the first invalid field | `mobile/app/(app)/profile/setup.tsx:110-125` |
| **Password Security Card** | Current, New, Confirm Password with eye toggles & "Change Password" | `mobile/src/features/auth/components/PasswordSecurityCard.tsx:15-85` |
| **Sign-in Code Card (Off)** | Status pill "Off", explanation, "Turn On" CTA | `mobile/app/(app)/profile/security.tsx:45-75`, `mobile/src/features/profile/components/TotpCard.tsx:15-45` |
| **TOTP Step 2 (QR & Key)** | 180×180 QR code, secret key `JBSWY3DPEHPK3PXP`, "Copy Key" button | `mobile/src/features/profile/components/TotpQrCard.tsx:20-65` |
| **TOTP Step 3 (Code Boxes)** | 6 individual OTP input boxes, inline error: "Invalid code. Please try again." | `mobile/src/features/profile/components/TotpVerifyCard.tsx:25-70` |
| **TOTP Step 4 (Backup Codes)** | 10 backup codes (2×5 grid), "Copy All" + "✓ Copied!" badge, "I Saved Them" | `mobile/src/features/profile/components/TotpBackupCodesCard.tsx:20-80` |
| **Sign-in Code Card (On)** | Status pill "On", ShieldCheck icon, in-card password confirmation & [Turn Off] | `mobile/src/features/profile/components/TotpManageCard.tsx:25-75` |
| **Log Out Confirmation** | Modal dialog: "Log out of Agrivive?" [Cancel] [Log Out] (#DC2626) | `mobile/app/(app)/profile/index.tsx:105-125` |

---

## 3. Copy Changes (Old Technical / Ambiguous → Plain Words)

| Old / Legacy Text | New Plain User-Facing Text | Screen / Context |
| :--- | :--- | :--- |
| `Seller Profile` | `Profile` | Main tab header title |
| `Pending Verification` | `Not Verified Yet` | Verification status pill |
| `Trust Score 100 pts` / `Trust Points: 0` | `Account Standing` / `Good Standing` | Hero card status label |
| `Suspended` | `Account Blocked` | Trust status for 10+ points |
| `Request Trust Review` | `Account Standing History` | Settings list navigation row |
| `Security & Account` / `Account Security` | `Sign-in Safety` | Settings row & screen title |
| `Authenticator App (TOTP)` | `Sign-in Code` | 2FA section heading & label |
| `Enable Two-Factor Authentication` | `Turn On` | Primary CTA to initiate 2FA |
| `Disable 2FA` | `Turn Off` | Destructive CTA inside card |
| `Change History & Ledger` | `Change History` | Settings list navigation row |
| `Notification Preferences` | `Notifications` | Settings list navigation row |
| `Edit stall information` | `Edit Profile` | Primary identity card action |
| `Complete Seller Profile` | `Set Up Your Stall` | Setup screen title |
| `Complete Setup & Get Verified` | `Save and Continue` | Setup step 2 bottom CTA |
| `PRIMARY BUSINESS LOCATION` | `Your Stall` | Section heading on Profile & Edit |
| `S3 upload failed: XML error` | `Couldn't upload the photo. Try again.` | Avatar upload error banner |

---

## 4. Required Behavior Changes (Code Implementation Tasks)

1. **Remove Tab Back Button & Header Icons**:
   - `ProfileHeaderBar.tsx`: Remove the back button and the right-hand icon buttons (pencil and shield). The Profile tab is a root tab (`app/(app)/(tabs)/profile.tsx`); stack navigation icons do not belong in root tabs.
2. **Remove All Fake Fallbacks**:
   - Delete all hardcoded fallback values in `ProfileHeroCard.tsx`, `ProfileBusinessInfoCard.tsx`, `ProfileLocationCard.tsx`, and `ProfileContactCard.tsx` (`"Bankerohan Public Market"`, `"Jul 2026"`, `"July 23, 2026"`, `"seller@agrivive.com"`, `"Stall 42…"`, `"85%"`, `trustPoints ?? 100`).
   - When a field is empty, show `"Not added yet"` along with an `Add` button.
3. **Remove Unused & Redundant Rows**:
   - Delete the Market, City, Visibility, Channel, and Seller ID rows. Remove the `"Verified Since"` row (no verified date exists in the database schema).
4. **Dynamic Standing from Weighted Points & Actions**:
   - Calculate standing strictly from `SellerTrustResponse`: `0 points` = Good Standing; `≥4 points` = Warning; `≥6 points` = Limited until `endsAt` with reason; `≥10 points` = Account Blocked.
5. **Add `pickupInstructions` to SellerProfile Model**:
   - `backend/src/db/schema.ts` includes `pickupInstructions: text("pickup_instructions")`, but `mobile/src/api/seller.ts` omitted it from the `SellerProfile` TypeScript interface. Update `SellerProfile` in `mobile/src/api/seller.ts` and add it to `Setup` and `Edit Profile` forms.
6. **Remove Password Section from Edit Profile**:
   - `mobile/app/(app)/profile/edit.tsx`: Remove `PasswordSecurityCard` entirely. Password updates belong exclusively in `/profile/security` ("Sign-in Safety").
7. **Setup Screen Dynamic Steps & Validation**:
   - `mobile/app/(app)/profile/setup.tsx`: Derive step sequence dynamically from `nextStep` (`verify-email`, `profile`, `password-setup`, `ready`).
   - Enforce `pinMovedByUser` boolean check so vendors cannot submit the default center coordinate without explicitly placing their pin.
   - On submission validation failure, automatically scroll to the *first field with an error* using `scrollViewRef.current?.scrollTo({ y: errorOffset })`.
8. **Edit Profile Dirty Check & Leave Guard**:
   - Track form state dirtyness. Intercept back navigation with a native modal: `"Leave without saving?"` `[Keep Editing]` `[Leave]`.
   - Make the `Save Changes` button sticky at the bottom of the viewport rather than scrolled away at the end of the form.
   - Normalise phone input strictly to Philippine canonical `09XXXXXXXXX`.
9. **In-Card 2FA Messages & Confirmation**:
   - Render 2FA success/error feedback inside the Sign-in Code card rather than in floating global toast banners.
   - Turn Off confirm displays inside the card with password verification.

---

## 5. UI/UX Principles & Laws Cited

- **Jakob's Law** *(Jakob Nielsen)*: Root tabs never have back buttons; standard top navigation and modal dismissal patterns match mobile platform conventions that vendors already understand from everyday apps.
- **Hick-Hyman Law** *(William Edmund Hick & Ray Hyman)* & **Miller's Law** *(George A. Miller)*: Exactly one Edit Profile entry and one Sign-in Safety entry. Each profile attribute is displayed once without redundant tabs or fragmented menus.
- **Visibility of System Status** *(Jakob Nielsen)* & **Honest Design** *(Dieter Rams)*: Accurate account standing, verified dates, and zero fake completeness meters or synthetic scores.
- **Recognition Over Recall** *(Jakob Nielsen & Rolf Molich)*: Setup checklists and stepper dots make completed vs pending requirements immediately recognizable without requiring vendors to remember setup requirements.
- **Goal-Gradient Effect** *(Clark L. Hull)*: Visual progress dots in the 3-step setup and the 4-step 2FA process encourage completion as users move closer to the finish line.
- **Error Prevention & Inline Validation** *(Caroline Jarrett & Gerry Gaffney)*: Requiring the map pin to be moved prevents invalid stall locations; unsaved changes guard prevents accidental data loss; errors are displayed directly beneath affected fields and auto-scrolled into view.
- **Postel's Law (Robustness Principle)** *(Jon Postel)*: Forgiving phone number input parsing that accepts spaces and `+63` prefixes while standardizing output to `09XXXXXXXXX`.
- **Law of Proximity** *(Gestalt Psychology)*: Inline errors sit immediately beneath the field that triggered them; 2FA status and turn-off confirmation reside within the same bounding card.
- **Fitts's Law** *(Paul Fitts)*: Minimum 44×44px touch targets for navigation icons, full-width 48px primary CTAs, and destructive "Log Out" action distinctly separated from daily settings rows.
- **Von Restorff Effect (Isolation Effect)** *(Hedwig von Restorff)*: Vibrant brand green (`#0F920F`) reserved strictly for dominant forward CTAs; error red (`#DC2626`) isolated to destructive confirmations (Log Out, Turn Off 2FA, Discard Changes).
