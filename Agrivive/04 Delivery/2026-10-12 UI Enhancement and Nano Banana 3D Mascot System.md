---
title: UI Enhancement and Nano Banana 3D Mascot System
date: 2026-10-12
type: delivery
status: completed
commit: 3726b5cb373bc1a70440e9bfd95f5255903d7c92
commit_message: "Fix Ui and add Landing page"
---

# UI Enhancement and Nano Banana 3D Mascot System

## Summary of Changes
Executed an end-to-end UI enhancement across five core buyer web experiences inspired by modern SaaS and e-commerce references, unified under the **Nano Banana & 3D Vegetable Cutiepies** nutritional wellness marketing strategy and strict 4px spatial hierarchy.

### 1. Login & Register (`/login` & `/signup`)
* Replaced the standard split layout with a **3D Cute Vegetables Showcase** on the left using `cute-veggies-auth.jpg` with top Davao market pill and bottom glassmorphism stats cards (*"8,750kg Harvest Rescued"*, *"Zero Waste"*, *"24h Hold"*).
* Overhauled the right form panel with rounded inputs, inline "Remember me" checkbox + "Forgot Password?" link via `LoginRememberRow.tsx`, high-contrast primary CTA button, and Google sign-in.
* Extracted `LoginTwoFactorSection.tsx` to maintain 2FA support while keeping file size strictly under 195 lines.

### 2. Marketplace Layout & Map Bugfix (`/marketplace`)
* Added a dedicated **Left Filter Sidebar** (`MarketplaceFilterSidebar.tsx`):
  * Active listing count and interactive **"Show on map" switch** to toggle the map strip.
  * Direct one-tap produce category pills (`Leafy Greens`, `Fruit Vegetables`, `Root Vegetables`, `Pod Vegetables`, `Tuber Vegetables`, `Bulb Vegetables`).
  * Dual min/max price range inputs.
  * Selling unit pills (`Kilo`, `Pile`, `Sack`).
  * Removed **"Seller Type"** section as requested to streamline buyer choices.
  * Extracted `MarketplaceLocationFilter.tsx` for nearby GPS stall search with radius locator.
* **Map Occlusion Bugfix**: Resolved issue where the Leaflet map covered the sticky header when scrolling:
  * Added `isolation: isolate !important; z-index: 0 !important;` to `.leaflet-container` and capped Leaflet panes (`z-10`) and controls (`z-20`) in `web/src/styles/tokens.css`.
  * Elevated `BuyerSiteHeader.tsx` to `z-40` and profile popup to `z-50`.
  * Adjusted sidebar sticky top offset to `lg:top-[124px]` so it stays fully visible below the 112px header.
  * Added `relative isolate z-0` to the map container in `MarketplaceBrowser.tsx` and `InteractiveSellerMap.tsx`.
* Integrated 3D Nano Banana Davao Organic Harvest Hero Banner (`cute-veggies-market.jpg`).
* Upgraded product cards grid to responsive 3-column layout (`grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`).

### 3. Order Details & Digital Pickup Pass (`/orders/[id]`)
* Added the **Top Order Summary Header** (`OrderSummaryHeader.tsx`) displaying Order ID, item count, total price, reservation date, and high-visibility green savings badge (**"You saved ~₱XX.XX"**).
* Refactored `OrderItemsCard.tsx` into a clean row layout with square vegetable thumbnails, unit/qty lines, price, and status pills.
* Added `OrderPaymentBreakdown.tsx` rendering itemized produce prices, highlighted green surplus discount row, free booking fee, total, and the celebratory **3D Nano Banana Wellness Badge** (`cute-veggies-order.jpg`).
* Extracted `OrderReportIssueRow.tsx` to keep `OrderDetail.tsx` under 195 lines.

### 4. Profile & Settings (`/profile`)
* Rebuilt the page into a canonical Settings dashboard with top header, search bar, and horizontal navigation tabs (`Profile`, `Reservations`, `Security`, `Notifications`).
* Split the Profile view into focused modular cards:
  * **Avatar (`ProfilePictureCard.tsx`)**: Circular avatar with ring accent, S3 presigned uploader, and removal action.
  * **Basic Info (`ProfileBasicInfoCard.tsx`)**: 2-column First/Last name inputs, verified email badge, SMS phone number input, and Davao district selector.
  * **Notifications (`ProfileNotificationsCard.tsx`)**: SMS and email restock alerts card.
  * **Security (`ProfileSecurityCard.tsx`)**: 2FA toggle and password settings.

### 5. Messaging & In-App Chat Console (`/messages`)
* Designed a responsive **3-column desktop messaging console** (`BuyerConversations.tsx`):
  * **Column 1 (`ConversationList.tsx`)**: Search bar, status filter tabs (`All`, `Unread`, `Important`, `Closed`), seller avatar, timestamp, produce preview tag, and terracotta unread badge.
  * **Column 2 (`ConversationThread.tsx`)**: Live chat thread with incoming/outgoing message bubbles, avatar markers, pinned produce card banner, and bottom input bar with attachment actions and send button.
  * **Column 3 (`ConversationDetailsPanel.tsx`)**: Seller profile card with stall location, quick phone contact action, and recent produce photo gallery.

### 6. Mobile Brand Logo Alignment & Wordmark Removal
* Processed the new mobile leaf-embossed "A" logo:
  * Isolated the signature icon mark, removing the "Agrivive" wordmark text beneath it.
  * Extracted the creamy background to produce a crystal-clear, transparent PNG (`web/public/brand/agrivive-logo-icon.png`) centered on a 512×512 canvas with smooth anti-aliased edges.
* Updated webpage navigation headers:
  * Removed the `AGRIVIVE` text span across [`BuyerSiteHeader.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/components/BuyerSiteHeader.tsx), [`SiteHeader.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/components/SiteHeader.tsx), and [`AuthShell.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/auth/components/AuthShell.tsx).
  * Web headers now display only the clean, modern standalone transparent logo icon.

### 7. Landing Page Section Header & Laravel-Style Mascot Footer
* **Landing Page Section Header (`LandingHeader.tsx`)**: Replaced generic buyer navigation on `/` with smooth anchor section links (`#benefits`, `#why-agrivive`, `#how-it-works`, `#market-pulse`, `#sellers`) and standalone action buttons (`Marketplace`, `Sign In`), paired with the new transparent logo.
* **3D Vegetable Cutiepies Climbing AGRIVIVE (`cute-veggies-footer.jpg`)**: Generated custom 16:9 3D clay artwork depicting the Nano Banana, baby carrot, glossy tomato, eggplant, climbing peas, and broccoli playing across giant 3D AGRIVIVE letters.
* **Laravel-Style Footer (`HomeFooter.tsx`)**:
  * Multi-column category links (Marketplace, Platform, Get Started).
  * 3D mascot centerpiece banner framed in soft rounded borders.
  * Giant low-opacity Laravel-style display watermark typography (`AGRIVIVE`).
  * Sub-bar with Davao market attribution and copyright.

---

## Affected Files

### Assets
* `web/public/brand/agrivive-logo-icon.png`
* `web/public/brand/agrivive-logo-full.png`
* `web/public/brand/cute-veggies-auth.jpg`
* `web/public/brand/cute-veggies-market.jpg`
* `web/public/brand/cute-veggies-order.jpg`
* `web/public/brand/cute-veggies-footer.jpg`

### Landing Page & Home Features
* `web/app/page.tsx`
* `web/src/features/home/components/LandingHeader.tsx`
* `web/src/features/home/components/HomeFooter.tsx`
* `web/src/features/home/components/HomeFinalCta.tsx`
* `web/src/features/home/components/HomeBenefits.tsx`
* `web/src/features/home/components/HomeWhyAgrivive.tsx`
* `web/src/features/home/components/HomeMarketPulse.tsx`
* `web/src/features/home/components/HomeSellerSection.tsx`

### Global & Styling
* `web/src/styles/tokens.css`
* `web/src/components/BuyerSiteHeader.tsx`
* `web/src/components/SiteHeader.tsx`

### Authentication
* `web/src/features/auth/components/AuthShell.tsx`
* `web/src/features/auth/components/LoginTwoFactorSection.tsx`
* `web/src/features/auth/components/LoginRememberRow.tsx`
* `web/app/(auth)/login/page.tsx`

### Marketplace
* `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
* `web/src/features/marketplace/components/MarketplaceHero.tsx`
* `web/src/features/marketplace/components/MarketplaceProductGrid.tsx`
* `web/src/features/marketplace/components/MarketplaceFilterSidebar.tsx`
* `web/src/features/marketplace/components/MarketplaceLocationFilter.tsx`
* `web/src/features/marketplace/components/InteractiveSellerMap.tsx`

### Orders
* `web/src/features/orders/components/OrderSummaryHeader.tsx`
* `web/src/features/orders/components/OrderPaymentBreakdown.tsx`
* `web/src/features/orders/components/OrderItemsCard.tsx`
* `web/src/features/orders/components/OrderReportIssueRow.tsx`
* `web/src/features/orders/components/OrderDetail.tsx`

### Profile
* `web/src/features/profile/components/ProfilePictureCard.tsx`
* `web/src/features/profile/components/ProfileBasicInfoCard.tsx`
* `web/src/features/profile/components/ProfileNotificationsCard.tsx`
* `web/src/features/profile/components/BuyerProfile.tsx`

### Conversations / Messaging
* `web/src/features/conversations/components/BuyerConversations.tsx`
* `web/src/features/conversations/components/ConversationList.tsx`
* `web/src/features/conversations/components/ConversationThread.tsx`
* `web/src/features/conversations/components/ConversationDetailsPanel.tsx`

---

## Verification Performed

1. **Line Count Audit**: Every single modified and newly created source file is strictly $< 200$ lines (maximum file size across all 24 components is 199 lines).
2. **Web TypeScript Typecheck**: `npm run typecheck` in `web/` passed with exit code 0.
3. **Next.js Production Build**: `npm run build` in `web/` passed with exit code 0; all 16 static and dynamic routes compiled and generated without errors.
4. **Backend Typecheck**: `bunx tsc --noEmit` in `backend/` passed with exit code 0.
5. **Backend Production Build**: `bun build src/index.ts --outdir dist --target bun` in `backend/` bundled 1,679 modules in 832ms with exit code 0.
