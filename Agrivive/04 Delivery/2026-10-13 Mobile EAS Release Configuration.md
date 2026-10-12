# Mobile EAS Release Configuration

Date: 2026-10-13
Status: Configuration implemented; Google mobile auth added; Expo account and cloud build pending

## What changed

- Added a `production` EAS build profile for the Agrivive Seller Android application.
- Pinned Bun `1.4.2` in both EAS Android profiles because the default EAS SDK 57 builder Bun `1.3.14` could not read the repository's `bun.lock` format.
- Set the EAS app version source to `remote` so production `autoIncrement` uses EAS-managed Android build numbers.
- Kept the existing `preview` profile as an internal-distribution APK build.
- Configured the production profile to use the `production` EAS environment, increment Android build numbers automatically, and produce an Android App Bundle for Google Play.
- Updated the mobile release runbook with EAS project linking, preview and production API environment setup, preview-build sequencing, and Google Play internal-testing guidance.
- Added a shared mobile `Continue with Google` action to the login and registration screens using the existing Better Auth Expo deep-link flow.
- Documented the Android OAuth client as public mobile configuration only; the backend continues to use the Web OAuth client ID and secret.

## Why

The web application and backend are deployed. The next release step is to validate the seller mobile application against the live HTTPS API through an installable preview APK before creating the store-ready Android bundle.

The mobile client must receive only the public API origin through `EXPO_PUBLIC_API_URL`. Database credentials, Resend keys, S3 credentials, and Better Auth secrets remain server-side.

The Google mobile flow opens the provider sign-in page and returns through the existing `agrivive://` scheme. Better Auth handles both returning-user sign-in and first-time Google account creation; the root route then sends the user to profile setup or the home screen based on the existing seller setup state.

## Affected files

- `mobile/eas.json`
- `mobile/README.md`
- `mobile/.env.example`
- `mobile/app/(auth)/login.tsx`
- `mobile/app/(auth)/register.tsx`
- `mobile/src/features/auth/components/GoogleSignInButton.tsx`

## Verification performed

- Parsed `mobile/eas.json` and `mobile/app.json` successfully.
- Ran `git diff --check` successfully.
- Ran `bun run typecheck` from `mobile/` successfully.
- Ran the mobile type check after adding the Google button; it passed.
- Attempted `npx expo export --platform android` after the auth change. Metro first failed to write Hermes temporary bytecode in the sandbox, and the host-permission retry then failed on a Windows Metro temporary-cache file read. The application export after this change is therefore not yet verified.
- Ran `node ./node_modules/expo/bin/cli export --platform android` successfully. The export produced the Android bundle and `dist/` output.
- The first export attempt was blocked by the local sandbox's permission to write Hermes temporary output; rerunning the same check with host permission completed successfully.
- Inspected EAS build `fe06eb5a-2407-4fbd-b46b-a017e1174573`; the API variable and Android credentials were accepted, and the failure was `bun install --frozen-lockfile` rejecting `bun.lock` with `Unknown lockfile version` under Bun `1.3.14`.

## Still required before the first preview build

- Sign in to the intended Expo account.
- Link the repository with `npx eas-cli@latest project:init`.
- Set the real HTTPS API origin in the EAS `preview` and `production` environments.
- Review and commit the generated `extra.eas.projectId` in `mobile/app.json`.
- Configure `EXPO_TOKEN` in GitHub if the manual preview workflow will be used.
- Build and install the Android preview APK on a real phone.
- Test authentication, listings, recurring listings, inventory, analytics, QR order flow, image upload, WebSocket conversations, and notifications.

## References

- [Expo EAS environment variables](https://docs.expo.dev/eas/environment-variables/)
- [Expo EAS build profiles](https://docs.expo.dev/build/eas-json/)
- [Expo internal distribution](https://docs.expo.dev/build/internal-distribution/)
- [Expo SDK 57 app configuration](https://docs.expo.dev/versions/v57.0.0/config/app/)
- [Expo push notification setup](https://docs.expo.dev/push-notifications/push-notifications-setup/)
- [Better Auth Expo integration](https://better-auth.com/docs/integrations/expo)
- [Expo SDK 57 AuthSession reference](https://docs.expo.dev/versions/v57.0.0/sdk/auth-session/)
- [Google OAuth credentials](https://developers.google.com/workspace/guides/create-credentials?authuser=531)
