---
title: Mobile and Backend Flow Enhancements
date: 2026-10-17
type: delivery
status: implemented
---

# Mobile and Backend Flow Enhancements

## What changed

1. **Google OAuth New Account Onboarding Redirection**:
   - Fixed `GoogleSignInButton.tsx` by awaiting `completeOnboarding()` and immediately refreshing setup status via `refreshSetup()`.
   - Prevented race conditions where `mobile/app/index.tsx` was redirecting uninitialized Google OAuth sessions back to `/(auth)/login`.
   - Guaranteed that new OAuth accounts land directly on the onboarding profile setup screen (`/(app)/profile/setup`).

2. **Voluntary Product Social Boost & Preview**:
   - Updated `backend/src/utils/promotion-eligibility/index.ts` to include product name, vegetable category, unit, price, and shop name in shared eligibility results even when the automated priority score is below `0.60`.
   - Modified `backend/src/modules/seller/services/seller.social-campaign.create.ts` to allow verified sellers to create voluntary manual social campaign drafts for their active listings with stock $> 0$, eliminating the 409 error: *"Visibility is below Priority Boost"*.
   - Ensured the draft preview with AI-generated caption copy and official channel checkboxes (Facebook, Instagram, X) displays immediately upon tapping "Boost now".

3. **Edit Profile Password Management**:
   - Embedded `PasswordSecurityCard` directly into `mobile/app/(app)/profile/edit.tsx`.
   - Automatically detects whether the account has an existing credential password (rendering "Update Password" with current, new, and confirm fields) or is a Google OAuth account without a password (rendering "Set Password" with new and confirm fields).

4. **Mandatory OAuth Password Setup Sequence**:
   - Added `"password-setup"` to the server setup `nextStep` union in `backend/src/modules/seller/services/seller.setup.ts` and `mobile/src/api/seller.ts`.
   - Enforced routing from `mobile/app/(app)/profile/setup.tsx` directly to `/(auth)/password-setup` upon profile completion for Google OAuth sellers who have not yet configured a password.

5. **Messenger-Style Categorized Messaging**:
   - Redesigned `mobile/app/(app)/messages.tsx` into a modern Messenger-style UI with a top segmented category bar:
     - **Direct Chats**: 1-on-1 live buyer conversations featuring avatar presence pips, unread count badges, context badges (`Listing Inquiry`, `Direct Inquiry`, `Reservation Order`), and snippet previews via `mobile/src/features/conversations/components/ConversationListItem.tsx`.
     - **Web Inquiries & Feedback**: Customer questions and comments from the marketplace web store with filter chips (`Waiting for reply` vs. `All questions`) and inline reply composer via `ProductInquiryCard.tsx`.

6. **Categorized Notifications & 60-Second Periodic Reminder**:
   - Segmented `mobile/app/(app)/notifications.tsx` with filter category pills: **All**, **Priority Boost**, **Orders**, **Messages**, and **Trust**. Priority Boost prompts and follow-up notices are featured within their category tab.
   - Implemented `mobile/src/features/notifications/hooks/useUnreadReminder.ts`, mounted globally in `NotificationRegistration.tsx`, which runs every 60 seconds and triggers a local notification via `expo-notifications` whenever unread notifications or messages exist.

## Why

To resolve friction points in the seller onboarding, listing, communication, and notification experience identified during end-to-end testing, while strictly adhering to Agrivive UI/UX laws (Jakob's Law, Miller's Law Chunking, Fitts's Law touch targets $\ge 48$px, and Forest Green `#1F4D3A` visual hierarchy).

## Affected paths

### Backend
- `backend/src/modules/seller/services/seller.social-campaign.create.ts`
- `backend/src/modules/seller/services/seller.setup.ts`
- `backend/src/utils/promotion-eligibility/index.ts`

### Mobile App
- `mobile/app/index.tsx`
- `mobile/app/(app)/messages.tsx`
- `mobile/app/(app)/notifications.tsx`
- `mobile/app/(app)/profile/setup.tsx`
- `mobile/app/(app)/profile/edit.tsx`
- `mobile/src/api/seller.ts`
- `mobile/src/features/auth/components/GoogleSignInButton.tsx`
- `mobile/src/features/conversations/components/ConversationListItem.tsx`
- `mobile/src/features/notifications/hooks/useUnreadReminder.ts`
- `mobile/src/features/notifications/push/NotificationRegistration.tsx`

### Obsidian Vault
- `Agrivive/04 Delivery/2026-10-17 Mobile and Backend Flow Enhancements.md`
- `Agrivive/05 Enhancements/05 Mobile and Backend Flow Enhancements.md`
- `Agrivive/05 Enhancements/00 Feature Enhancements Index.md`

## Verification performed

1. **Backend Build & Typecheck**:
   - `bunx tsc --noEmit` — passed with 0 errors.
   - `bun build src/index.ts --outdir dist --target bun` — passed, bundled 1695 modules into `dist/index.js`.
2. **Mobile Build & Typecheck**:
   - `bun run typecheck` (`tsc --noEmit`) — passed with 0 errors.
