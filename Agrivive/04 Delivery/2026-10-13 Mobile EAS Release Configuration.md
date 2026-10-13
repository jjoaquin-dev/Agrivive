# Mobile EAS Release Configuration

Date: 2026-10-13
Status: Seller auth and visibility boost flows implemented; Expo account and cloud build pending

## What changed

- Added a `production` EAS build profile for the Agrivive Seller Android application.
- Pinned Bun `1.4.2` in both EAS Android profiles because the default EAS SDK 57 builder Bun `1.3.14` could not read the repository's `bun.lock` format.
- Set the EAS app version source to `remote` so production `autoIncrement` uses EAS-managed Android build numbers.
- Kept the existing `preview` profile as an internal-distribution APK build.
- Configured the production profile to use the `production` EAS environment, increment Android build numbers automatically, and produce an Android App Bundle for Google Play.
- Updated the mobile release runbook with EAS project linking, preview and production API environment setup, preview-build sequencing, and Google Play internal-testing guidance.
- Added a shared mobile `Continue with Google` action to the login and registration screens using the existing Better Auth Expo deep-link flow.
- Documented the Android OAuth client as public mobile configuration only; the backend continues to use the Web OAuth client ID and secret.
- Changed new seller registration to open Seller Profile Setup immediately after account creation. Unverified accounts are routed to email verification after the profile is saved.
- Added a separate mobile email-code sign-in path alongside password sign-in. It requests a sign-in OTP through Better Auth, verifies the code, and routes the account according to its current setup state.
- Re-enabled Better Auth email OTP sign-in on the backend while keeping `disableSignUp: true`, so email codes can authenticate existing accounts without creating OTP-only accounts.
- Added seller-confirmed Boost Visibility after product creation, with a reusable Boost Visibility action from seller analytics.
- Added a durable boost queue with idempotency per listing-cycle trigger, bounded worker retries, and a protected n8n context endpoint that exposes current listing facts only after backend checks.
- Added scheduled 12-hour price-reduction processing that creates one seller boost prompt per reduction period and queues a seller push notification.
- Added mobile boost prompts with `Boost now` and `Not now` actions, plus the post-price-change price comparison.
- Added `N8N_VISIBILITY_BOOST_WEBHOOK_URL` and `N8N_VISIBILITY_BOOST_SERVICE_TOKEN` to the environment examples. The n8n workflow receives only the boost ID and reason, then fetches current facts from the protected backend context route.

## Why

The web application and backend are deployed. The next release step is to validate the seller mobile application against the live HTTPS API through an installable preview APK before creating the store-ready Android bundle.

The mobile client must receive only the public API origin through `EXPO_PUBLIC_API_URL`. Database credentials, Resend keys, S3 credentials, and Better Auth secrets remain server-side.

The Google mobile flow opens the provider sign-in page and returns through the existing `agrivive://` scheme. Better Auth handles both returning-user sign-in and first-time Google account creation; the root route then sends the user to profile setup or the home screen based on the existing seller setup state.

The approved seller email flow is now: create account → Seller Profile Setup → email verification → Inventory. Returning sellers may use either password sign-in or email-code sign-in. Email-code sign-in is limited to existing accounts because the backend keeps `disableSignUp: true` for the Email OTP plugin.

The approved seller promotion flow is: add product → choose Boost Visibility → queue n8n social posting, or choose Not now and keep the Boost Visibility action available. After a configured 12-hour price reduction, the worker creates a seller prompt and push notification; a seller confirmation queues another n8n post using the current price and stock.

## Affected files

- `mobile/eas.json`
- `mobile/README.md`
- `mobile/.env.example`
- `mobile/app/(auth)/login.tsx`
- `mobile/app/(auth)/register.tsx`
- `mobile/app/(auth)/_layout.tsx`
- `mobile/app/(auth)/email-otp-login.tsx`
- `mobile/app/(app)/profile/setup.tsx`
- `backend/src/modules/auth/index.ts`
- `backend/src/utils/email/index.ts`
- `backend/src/db/schema.ts`
- `backend/drizzle/20261013100000_seller_visibility_boosts/migration.sql`
- `backend/src/jobs/apply-seller-price-reductions.ts`
- `backend/src/jobs/deliver-seller-visibility-boosts.ts`
- `backend/src/jobs/deliver-push-notifications.ts`
- `backend/src/jobs/run-scheduled.ts`
- `backend/src/modules/seller/index/seller.visibility-boost.ts`
- `backend/src/modules/seller/services/seller.visibility-boost.queue.ts`
- `backend/src/modules/seller/services/seller.visibility-boost.prompts.list.ts`
- `backend/src/modules/seller/services/seller.visibility-boost.prompt.accept.ts`
- `backend/src/modules/seller/services/seller.visibility-boost.prompt.read.ts`
- `backend/src/modules/seller/services/seller.visibility-boost.prompt.dismiss.ts`
- `backend/src/modules/integrations/index/integrations.visibility-boost.ts`
- `backend/src/modules/integrations/services/integrations.visibility-boost.context.ts`
- `backend/.env.example`
- `deploy/backend.production.env.example`
- `mobile/src/features/boost/api/visibility-boosts.ts`
- `mobile/src/features/notifications/components/SellerBoostPromptSection.tsx`
- `mobile/app/(app)/inventory/create.tsx`
- `mobile/app/(app)/boost/[productId].tsx`
- `mobile/app/(app)/notifications.tsx`
- `mobile/src/features/auth/components/GoogleSignInButton.tsx`

## Verification performed

- Parsed `mobile/eas.json` and `mobile/app.json` successfully.
- Ran `git diff --check` successfully.
- Ran `bun run typecheck` from `mobile/` successfully.
- Ran the mobile type check after adding the Google button; it passed.
- Ran `bun run typecheck` from `mobile/` after the approved registration and email-code sign-in changes; it passed.
- Ran `bunx tsc --noEmit` from `backend/`; it passed.
- Ran `bun build src/index.ts --outdir dist --target bun` from `backend/`; it passed.
- Ran `bunx tsc --noEmit` from `backend/` after the visibility boost changes; it passed.
- Ran `bun run typecheck` from `mobile/` after the visibility boost changes; it passed.
- Ran `bun build src/index.ts --outdir dist --target bun` from `backend/` after the visibility boost changes; it passed.
- Ran `git diff --check` successfully after the visibility boost changes.
- Real-device verification of registration → profile setup → email verification, password sign-in, and email-code sign-in remains pending.
- Real-device verification of the post-listing Boost Visibility modal, n8n delivery, 12-hour reduction prompt, push notification, and prompt actions remains pending.
- The first `npx expo export --platform android` attempt was blocked by the local sandbox's permission to write Hermes temporary output. The host-permission retry then completed successfully with `node ./node_modules/expo/bin/cli export --platform android`; the export produced the Android bundle and `dist/` output.
- Inspected EAS build `fe06eb5a-2407-4fbd-b46b-a017e1174573`; the API variable and Android credentials were accepted, and the failure was `bun install --frozen-lockfile` rejecting `bun.lock` with `Unknown lockfile version` under Bun `1.3.14`.

## Still required before the first preview build

- Sign in to the intended Expo account.
- Link the repository with `npx eas-cli@latest project:init`.
- Set the real HTTPS API origin in the EAS `preview` and `production` environments.
- Review and commit the generated `extra.eas.projectId` in `mobile/app.json`.
- Configure `EXPO_TOKEN` in GitHub if the manual preview workflow will be used.
- Build and install the Android preview APK on a real phone.
- Test authentication, listings, recurring listings, inventory, analytics, QR order flow, image upload, WebSocket conversations, and notifications.

## Production release commands for the approved boost flow

Run these on the VPS from the repository checkout. Keep the real database, Resend, S3, Better Auth, and n8n values only in `deploy/backend.production.env`; never paste those values into Git.

```bash
cd /srv/agrivive/Agrivive
git pull --ff-only origin development
cd /srv/agrivive/Agrivive/deploy
nano backend.production.env
docker compose --env-file compose.production.env -f docker-compose.production.yml run --rm api bunx drizzle-kit migrate
docker compose --env-file compose.production.env -f docker-compose.production.yml up -d --build --force-recreate api worker web proxy
docker compose --env-file compose.production.env -f docker-compose.production.yml ps
docker compose --env-file compose.production.env -f docker-compose.production.yml logs --tail=200 api worker
```

The production backend environment must include these two new values after the n8n workflow is created:

```dotenv
N8N_VISIBILITY_BOOST_WEBHOOK_URL=https://your-n8n-host/webhook/agrivive-visibility-boost
N8N_VISIBILITY_BOOST_SERVICE_TOKEN=use-a-long-random-shared-token
```

The worker sends n8n only `{ "boostId": "...", "reason": "initial" | "price_reduction" }`. The n8n workflow must call `GET https://api.agrivive.tech/integrations/visibility-boosts/{boostId}/context` with the same bearer token, then use the returned current listing facts for the social post. The context endpoint is the source of truth for current price, stock, seller, photo, and listing URL.

## References

- [Expo EAS environment variables](https://docs.expo.dev/eas/environment-variables/)
- [Expo EAS build profiles](https://docs.expo.dev/build/eas-json/)
- [Expo internal distribution](https://docs.expo.dev/build/internal-distribution/)
- [Expo SDK 57 app configuration](https://docs.expo.dev/versions/v57.0.0/config/app/)
- [Expo push notification setup](https://docs.expo.dev/push-notifications/push-notifications-setup/)
- [Better Auth Expo integration](https://better-auth.com/docs/integrations/expo)
- [Expo SDK 57 AuthSession reference](https://docs.expo.dev/versions/v57.0.0/sdk/auth-session/)
- [Google OAuth credentials](https://developers.google.com/workspace/guides/create-credentials?authuser=531)
