---
title: Mobile and Backend Flow Enhancements
type: enhancement-changelog
status: implemented
created: 2026-10-17
related_modules:
  - backend/src/modules/seller/
  - backend/src/utils/promotion-eligibility/
  - mobile/src/features/auth/
  - mobile/src/features/conversations/
  - mobile/src/features/messages/
  - mobile/src/features/notifications/
  - mobile/app/
---

# Mobile and Backend Flow Enhancements (2026-10-17)

## Summary of Enhancements

This update addresses 6 core seller workflow and user experience issues across the Agrivive React Native mobile app and ElysiaJS backend:

1. **Google OAuth New Account Redirection**:
   * **Problem**: New Google OAuth accounts were redirecting back to the sign-in screen instead of the onboarding profile setup.
   * **Cause**: `GoogleSignInButton.tsx` did not await `completeOnboarding()` or refresh the setup state before routing. `Index` checked uninitialized session state with `isOnboardingCompleted: true`, kicking the user back to `/(auth)/login`.
   * **Solution**: Await onboarding completion, load fresh session and setup status, and route directly to `/(app)/profile/setup`.

2. **Voluntary Social Boost on Newly Listed Products**:
   * **Problem**: Tapping "Boost now" immediately after adding a product caused an error: *"Your post is not ready yet. Visibility is below Priority Boost"*, preventing sellers from seeing the post preview.
   * **Cause**: `seller.social-campaign.create.ts` enforced automated worker AHP-TOPSIS score criteria ($\ge 0.60$) on manual seller draft requests.
   * **Solution**: Included product and shop context in `getPriorityPromotionEligibility` shared results and allowed manual draft generation for active marketable listings with stock $> 0$, letting sellers preview draft text and select official channels.

3. **Edit Profile Password Management**:
   * **Problem**: `Edit Profile` lacked password configuration options.
   * **Solution**: Embedded `PasswordSecurityCard` into `mobile/app/(app)/profile/edit.tsx`. Automatically detects whether the seller has an existing password (showing "Update Password") or signed in via OAuth (showing "Set Password").

4. **OAuth Mandatory Password Flow**:
   * **Problem**: OAuth accounts could complete setup without establishing password credentials.
   * **Solution**: Added `"password-setup"` to the `nextStep` sequence in `seller.setup.ts`. Directed sellers with completed profiles to `/(auth)/password-setup` before entering the main app.

5. **Messenger-Style Categorized Messaging**:
   * **Problem**: `messages.tsx` only showed a flat list of order chats and ignored marketplace questions or ratings.
   * **Solution**: Redesigned `mobile/app/(app)/messages.tsx` into a segmented Messenger UI with two tabs:
     * **Direct Chats**: 1-on-1 live buyer conversations with avatar presence indicators, unread count badges, and context tags via `ConversationListItem.tsx`.
     * **Web Inquiries & Feedback**: Customer questions and comments from the marketplace web store with inline reply composer via `ProductInquiryCard.tsx`.

6. **Categorized Notifications & 60-Second Periodic Reminder**:
   * **Problem**: Notifications were uncategorized and sellers lacked automatic reminders for unread updates.
   * **Solution**:
     * Segmented `mobile/app/(app)/notifications.tsx` into filter categories: `All`, `Priority Boost`, `Orders`, `Messages`, and `Trust`.
     * Implemented `useUnreadReminder.ts` running a 60-second periodic checker that triggers local notifications via `expo-notifications` whenever unread notifications or messages exist.

---

## Affected Files

### Backend
* [`backend/src/modules/seller/services/seller.social-campaign.create.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/backend/src/modules/seller/services/seller.social-campaign.create.ts)
* [`backend/src/modules/seller/services/seller.setup.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/backend/src/modules/seller/services/seller.setup.ts)
* [`backend/src/utils/promotion-eligibility/index.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/backend/src/utils/promotion-eligibility/index.ts)

### Mobile App
* [`mobile/app/index.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/app/index.tsx)
* [`mobile/app/(app)/messages.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/app/%28app%29/messages.tsx)
* [`mobile/app/(app)/notifications.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/app/%28app%29/notifications.tsx)
* [`mobile/app/(app)/profile/setup.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/app/%28app%29/profile/setup.tsx)
* [`mobile/app/(app)/profile/edit.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/app/%28app%29/profile/edit.tsx)
* [`mobile/src/api/seller.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/src/api/seller.ts)
* [`mobile/src/features/auth/components/GoogleSignInButton.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/src/features/auth/components/GoogleSignInButton.tsx)
* [`mobile/src/features/conversations/components/ConversationListItem.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/src/features/conversations/components/ConversationListItem.tsx)
* [`mobile/src/features/notifications/hooks/useUnreadReminder.ts`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/src/features/notifications/hooks/useUnreadReminder.ts)
* [`mobile/src/features/notifications/push/NotificationRegistration.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/mobile/src/features/notifications/push/NotificationRegistration.tsx)

---

## Verification & Testing Performed

1. **Backend Verification**:
   * Ran `bunx tsc --noEmit` $\to$ Exit code 0, 0 type errors.
   * Ran `bun build src/index.ts --outdir dist --target bun` $\to$ Bundled 1695 modules successfully into `dist/index.js`.
2. **Mobile App Verification**:
   * Ran `bun run typecheck` (`tsc --noEmit`) $\to$ Exit code 0, 0 type errors.
