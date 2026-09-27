# Buyer Web Authentication

Date: 2026-09-22

## What changed

- Added the first buyer web app shell with Next.js App Router.
- Added buyer sign-in, registration, email verification, and two-factor verification states.
- Connected the web forms to the existing Better Auth endpoints with cookie credentials.
- Added buyer role-safe registration by relying on the backend default role.
- Added credentialed backend CORS support for the configured web origin.
- Added a localhost and loopback CORS fallback so development origins still receive the preflight header when the backend starts without `WEB_TRUSTED_ORIGINS`.
- Added web-specific dependency and build ignores.
- Reworked the auth UI to use the approved split form and market-image layout.
- Added password visibility controls and the buyer market visual asset.

## Affected paths

- `web/package.json`
- `web/app/(auth)/login/page.tsx`
- `web/app/(auth)/signup/page.tsx`
- `web/app/(auth)/verify-email/page.tsx`
- `web/src/features/auth/components/PasswordInput.tsx`
- `web/public/brand/buyer-market-auth.png`
- `web/app/not-found.tsx`
- `web/pages/_document.tsx`
- `web/src/lib/auth-client.ts`
- `web/src/features/auth/`
- `web/src/styles/tokens.css`
- `web/tailwind.config.ts`
- `web/.env.example`
- `web/.gitignore`
- `backend/src/modules/auth/index.ts`
- `backend/src/index.ts`
- `backend/.env.example`
- `backend/.env` (local `WEB_TRUSTED_ORIGINS` only)

## Behavior

- Sign-up collects name, email, password, and password confirmation.
- The backend assigns the default buyer role; the browser cannot choose a role.
- Successful sign-up sends the existing email verification code.
- Unverified sign-in redirects to email verification.
- Accounts with two-factor enabled can complete an authenticator-code challenge.
- Sessions use cookies with `credentials: include`; no token is stored in browser storage.

## Verification

- `web/bun install --frozen-lockfile` completed successfully.
- `web/bun run typecheck` passed after the final two-factor response handling fix.
- `web/bun run build` passed after adding the minimal Pages Router document compatibility entry and App Router not-found page required by the installed Next.js version.
- The redesigned login and sign-up routes compile successfully with the split layout and new password controls.
- `backend/bunx tsc --noEmit` passed.
- `backend/bun build src/index.ts --outdir dist --target bun` passed.
- An `OPTIONS /api/auth/sign-up/email` preflight from `http://localhost:3001` returned `204` with `Access-Control-Allow-Origin: http://localhost:3001` and credentials enabled.
- The stale `web/.next` cache was removed; restart the web dev server before checking the page again so `layout.css` is regenerated.
- Generated `.next` output and web TypeScript build metadata were removed or ignored.
- Backend `dist/index.js` was restored after the build so the unrelated tracked bundle was not changed.

## Manual checks remaining

Restart the backend and web dev servers, then verify sign-up, email OTP delivery, email verification, login, invalid credentials, and two-factor login in a browser. The marketplace is not included in this change.

## Commit

Not committed yet.
