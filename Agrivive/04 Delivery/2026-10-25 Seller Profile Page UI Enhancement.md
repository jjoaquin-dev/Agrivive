---
title: Seller Profile Page UI Enhancement
date: 2026-10-25
type: delivery
status: verified
related_documents:
  - "[[2026-09-21 Seller Profile CRUD]]"
  - "[[2026-10-25 Seller Dashboard UI Replication and Real Data Integration]]"
  - "[[02 Product/Feature Map]]"
---

# Seller Profile Page UI Enhancement

## What Changed

Refactored and replicated the complete Seller Profile UI from the approved design reference (`media_1792866991369_88e3380b.png`) following the strict field-mapping and architectural principles in `.agents/rules/design-replication-rule/RULE.md` and repository guidelines in `AGENTS.md`.

Every visual section maps 100% directly to real system models, backend API responses, and user state:

1. **`ProfileHeaderBar.tsx`**:
   - Circular back button `<`, centered title ("Seller Profile"), and quick actions for editing profile (`/(app)/profile/edit`) and security settings (`/(app)/profile/security`).

2. **`ProfileHeroCard.tsx`**:
   - Deep forest green (`#14532D`) hero surface.
   - Avatar circle with camera badge supporting real photo upload via `expo-image-picker` and AWS S3 presigned upload.
   - Stall Name (`setup.profile.shopName`), Verified pill badge (`setup.sellerVerified` / `setup.badge`), owner name (`setup.account.name || session.user.name`), and classification subtitle.
   - 3 Stat Badges: Profile Completion (`setup.profileComplete`), Member Since (`profile.createdAt`), and Trust Standing (`trust.monitoring.weightedPoints` via `useSellerTrust()`).
   - Action buttons: "Edit Profile" and "Security Settings".

3. **`ProfileVerificationCard.tsx`**:
   - Verification status banner (Green `#ECFDF5` for verified accounts, Amber `#FFFBEB` for unverified).
   - Rows: Classification (`profile.sellerType`), Verified Since (`profile.createdAt`), and Account Status (`session.user.isActive`).
   - Direct link to request a trust or classification review via `/(app)/trust`.

4. **`ProfileBusinessInfoCard.tsx`**:
   - Business Name, Owner, Market Stall, Account Email, and formatted Seller ID (`AGV-${setup.account.id.slice(0, 8)}`) with an "Edit" shortcut.

5. **`ProfileLocationCard.tsx`**:
   - Confirmed GPS pickup location map preview rendered via read-only `MapPickerComponent`.
   - Market, Stall & Landmark details (`profile.detailAddress`), Pickup Instructions (`profile.pickupInstructions`), and City ("Davao City, Philippines").

6. **`ProfileContactCard.tsx`**:
   - Contact Phone (`profile.phoneNumber`), Account Email, Messaging Visibility ("In-App Messages Only"), and Channel ("Agrivive Messages").
   - Informational disclaimer explaining that buyers contact sellers directly through Agrivive messages.

7. **`ProfileSettingsList.tsx`**:
   - Navigation links with distinct icons and chevrons:
     - 🔔 Notification Preferences $\to$ `/(app)/notifications`
     - 🛡️ Trust & Account Records $\to$ `/(app)/trust`
     - 🔒 Security & Account (2FA) $\to$ `/(app)/profile/security`
     - 🔄 Change History & Ledger $\to$ `/(app)/activity`
   - Distinct red-bordered "Log Out" button invoking `signOut()` with confirmation dialog.

8. **`mobile/app/(app)/profile/index.tsx`**:
   - Modularized from the legacy 630-line monolithic file into clean, maintainable components.
   - Coordinates pull-to-refresh, safe-area layout, image picking, and sign-out logic.

## Verification Performed

1. **Mobile TypeScript Verification**:
   - Ran `bunx tsc --noEmit --project mobile/tsconfig.json` $\to$ **Exit code 0, 0 type errors**.
2. **Backend Verification**:
   - Ran `bunx tsc --noEmit` & `bun build src/index.ts --outdir dist --target bun` $\to$ **Exit code 0, 1704 modules bundled successfully**.
3. **Line Count Audit**:
   - All files strictly adhere to the $\le 200$ lines limit:
     - `ProfileHeaderBar.tsx`: 79 lines
     - `ProfileHeroCard.tsx`: 156 lines
     - `ProfileVerificationCard.tsx`: 195 lines
     - `ProfileBusinessInfoCard.tsx`: 117 lines
     - `ProfileLocationCard.tsx`: 125 lines
     - `ProfileContactCard.tsx`: 111 lines
     - `ProfileSettingsList.tsx`: 141 lines
     - `profile/index.tsx`: 196 lines
