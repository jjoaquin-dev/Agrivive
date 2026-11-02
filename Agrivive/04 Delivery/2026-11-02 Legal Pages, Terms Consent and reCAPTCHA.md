---
title: Legal Pages, Terms Consent and reCAPTCHA
type: delivery
date: 2026-11-02
---

# Legal Pages, Terms Consent and reCAPTCHA

## What changed

- Web: new pages `/privacy`, `/terms`, `/cookies`; legal links in both footers; a consent note and Google reCAPTCHA notice under every sign-in form; a required "I agree" box on sign-up.
- Mobile: a required "I agree" box on seller registration; Privacy Policy and Terms of Use rows in Profile that open the web pages in the in-app browser (one source of truth).
- Backend: `user.terms_accepted_at` and `user.terms_version` (hand-written migration `20261102150000_terms_acceptance`); `/auth/register-role` requires `acceptedTerms: true` and `termsVersion`.
- reCAPTCHA v3: Better Auth `captcha` plugin on sign-in, email-code sign-in and code sending; `utils/recaptcha` check on `/auth/register-role` and `/trust/recovery/request`. Clients send the `x-captcha-response` header. Checks are skipped when `RECAPTCHA_SECRET_KEY` is empty.
- Mobile runs reCAPTCHA in a hidden WebView whose `baseUrl` is the web domain, so no extra web page is needed.

## Why

No legal text existed anywhere, and sign-up and code sending had no bot protection. The Data Privacy Act (RA 10173) and store listings need a public privacy policy.

## Files

- Backend: `src/db/schema.ts`, `src/modules/auth/index.ts`, `src/modules/auth/{index,model,services}/auth.role-*`, `src/modules/trust/index/trust.recovery.ts`, `src/utils/recaptcha/index.ts`, `drizzle/20261102150000_terms_acceptance/`, `.env.example`, `README.md`, rebuilt `dist/`.
- Web: `app/{privacy,terms,cookies}/page.tsx`, `src/features/legal/*`, `src/lib/recaptcha.ts`, auth forms and `AuthShell`, both footers, `Dockerfile`, `.env.example`.
- Mobile: `src/features/auth/{recaptcha.ts,components/RecaptchaHost.tsx,components/TermsConsent.tsx}`, `src/features/legal/legalLinks.ts`, auth screens, `ProfileSettingsList.tsx`, `eas.json`.
- Deploy: `docker-compose.yml`, `.github/workflows/web-cd.yml`, root `.env.example`.

## Verification

- Backend `bunx tsc --noEmit`, `bunx drizzle-kit check`, API and worker builds: passed.
- Web `bun run typecheck` and `bun run build`: passed, routes `/privacy`, `/terms`, `/cookies` built.
- Mobile `bun run typecheck`: passed.
- Not run: a live reCAPTCHA token check, the migration against a database, a phone test. Manual endpoint testing is still owed by the owner.

## Still needed before launch

- Fill `LEGAL_ENTITY` and `LEGAL_EMAIL` in `web/src/features/legal/content/version.ts` and have the legal text reviewed.
- Create the reCAPTCHA v3 keys; set `RECAPTCHA_SECRET_KEY` on the server, the site key in the `PUBLIC_RECAPTCHA_SITE_KEY` GitHub variable and `EXPO_PUBLIC_RECAPTCHA_SITE_KEY` in `eas.json`.
- Apply the migration as an explicit release step.
- Bump `LEGAL_VERSION` in both web and mobile when the legal text changes.
