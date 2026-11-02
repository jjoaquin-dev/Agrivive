---
title: Seller App Install Guide
type: delivery
date: 2026-11-02
---

# Seller App Install Guide

## What changed

- New web page `/download-app` with a download button, five install steps (including the Play Protect "Install anyway" step), a "Something went wrong?" box, and a support email line.
- "How to install" links next to the seller app download in the Hero and in both footers.
- All three download links now use `SELLER_APK_URL` (`web/src/lib/appDownload.ts`), which points at the APK in S3 (`downloads/agrivive-seller.apk`) and can be overridden with `NEXT_PUBLIC_APK_URL`.

## Why

The APK is installed outside the Play Store, so first-time installers meet "Install unknown apps" and Play Protect prompts. The guide keeps non-technical sellers from giving up.

## Files

`web/app/download-app/page.tsx`, `web/src/features/download/{content.ts,components/InstallGuide.tsx}`, `web/src/lib/appDownload.ts`, `web/src/components/sections/Hero.tsx`, `web/src/features/home/components/HomeFooter.tsx`, `web/src/features/marketplace/components/MarketplaceFooter.tsx`.

## Verification

Web `bun run typecheck` and `bun run build` passed; `/download-app` built. Not checked: the S3 link on a phone, step wording on Samsung, Xiaomi and Oppo screens.
