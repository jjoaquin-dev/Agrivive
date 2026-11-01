# 2026-11-02 Web Look, Password Reset and Messages Photos

## Checklist
1. **Duplicate back buttons**: done. The auth layout (`mobile/app/(auth)/_layout.tsx`) no longer draws its own header on Sign In With Email Code, Sign-in Code and Verify Your Email, because those screens draw their own back arrow and title. Verify Your Email still cannot be swiped back.
2. **Reset password code did not send**: done. "Forgot password?" opened the account-restore screen, which only sends a code for blocked accounts. New `app/(auth)/forgot-password.tsx` sends a real password-reset code (`forget-password`), then takes the 6-digit code plus the new password (same web rule and checklist) and calls `emailOtp.resetPassword`. Account restore for blocked accounts is unchanged and still opens from the App Start screen.
3. **Messages: sender photo missing**: done. `GET /seller/product-inquiries` now returns `buyerName` and `buyerImage` (signed photo link). The question card shows the sender's photo (initials when there is none) and name. New `AvatarComponent`. Backend `dist/index.js` rebuilt (7 lines changed).
4. **Web fonts and colours**: done. Fonts: Parkinsans (headings) and Plus Jakarta Sans (body), as in `web/app/layout.tsx`, from `@expo-google-fonts/parkinsans` and `@expo-google-fonts/plus-jakarta-sans`. Colours: the web's `agrivive` palette (`web/tailwind.config.ts`): primary `#457D00`, pressed `#386600`, background `#F8F6F1`, text `#202622`, muted `#636B63`, border `#E5E2DA`, sage `#96B125`, orange `#FEA938`, error `#B85450`. Hard-coded old greens, greys and red in 53 files were mapped to the same values. `.claude/design/mobile-design/DESIGN.md` updated to match.
5. **Web logo**: done. The web's full cart-and-wordmark logo replaces the bag icon on Sign In (140 wide), Create Account (140 wide) and Onboarding (120 wide), and the start screen (`assets/agrivive-splash.png`, shown 200 wide, same size on the native splash and the loading screen). Phone launcher icon not changed.

## Deliberate exception
`warning` stays `#D97706`, not the web's `#FEA938`, because the app uses it for text and the web orange is too pale on white.

## Other fixes
Six type errors in older code (list empty/footer `null`, text input ref type, `beforeRemove` listener) appeared after the install refreshed `node_modules`. Fixed with type-only changes.

## Not changed
Backend email wording still reads "Your forget-password code is 123456." (works, but not plain words). The web's "Forgot Password?" link also opens account restore, so the web has the same gap.

## Verification
Mobile typecheck, Android export, backend typecheck and backend build pass. Not checked on a phone or against the live backend (reset email, messages photos).
