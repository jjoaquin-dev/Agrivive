# Market Pulse Landing Integration & Session Route Guards

- **Date**: 2026-10-20
- **Type**: UI Integration & Security Route Guards
- **Related Requirements**: FR-16 (Public Market Analytics), User Authentication Flow, Jakob's Law, Visibility of System Status
- **Status**: Completed & Verified

---

## 1. Overview & Objective

To ensure seamless navigation between the public storefront, the public analytics dashboard, and the protected consumer marketplace, two key improvements were implemented:
1. **Public Market Pulse Integration**: The landing page's "Market Pulse" section now highlights public community metrics and features a primary CTA **"View Public Market Report"** routing directly to the newly built Total Dashboard (`/stakeholder/summary`). Navigation from the dashboard and header allows guests to return effortlessly to the landing page (`/`).
2. **Session & Guest Route Guards**:
   - **Authenticated Users (Active Session)**: Prevent logged-in users from seeing or accessing authentication forms (`/login` and `/signup`), automatically redirecting them to `/marketplace`. In the public landing header (`LandingHeader.tsx`), "Sign in" and "Register" are replaced with a direct "Go to Marketplace" action button.
   - **Unauthenticated Guests**: Protect the marketplace (`/marketplace` and `/marketplace/[id]`), redirecting unauthenticated users to `/login?next=...` so they must authenticate before reserving surplus produce. Public landing (`/`) and public market analytics (`/stakeholder/summary`) remain accessible to everyone without requiring login.

---

## 2. Key Changes Implemented

### A. Market Pulse Section (`HomeMarketPulse.tsx`)
- Changed CTA button label to **"View Public Market Report"**.
- Updated navigation destination to `/stakeholder/summary`.
- Retained clean styling adhering to Agrivive UI standards (Forest Green `#1F4D3A`, warm cream card containers).

### B. Landing & Marketplace Headers
- **`LandingHeader.tsx`**:
  - Dynamically reads `useBuyerSession()`.
  - When authenticated: Displays **"Go to Marketplace"** primary button.
  - When unauthenticated: Displays **"Sign in"** and **"Register"** buttons.
- **`BuyerSiteHeader.tsx`**:
  - Dynamically routes the Agrivive logo: directs authenticated buyers to `/marketplace` and unauthenticated guests to `/`.

### C. Route Protection & Guest Guards
- **`web/app/marketplace/page.tsx`**:
  - Guarded: unauthenticated users are redirected to `/login?next=/marketplace`.
- **`web/app/marketplace/[id]/page.tsx`**:
  - Guarded: unauthenticated users are redirected to `/login?next=/marketplace/${id}`.
- **`web/app/(auth)/login/page.tsx`**:
  - Guarded: active sessions are automatically redirected to `next` path or `/marketplace`.
- **`web/app/(auth)/signup/page.tsx`**:
  - Guarded: active sessions are automatically redirected to `/marketplace`.
  - Refactored to 195 lines (complying strictly with the $\le 200$ line limit rule).
  - Fixed `GoogleSignInButton` props to match the component signature (`nextPath`).

---

## 3. UI/UX Standards, Laws & Psychological Principles

- **Jakob's Law** *(Jakob Nielsen)*: Users expect that being logged in automatically skips redundant login/signup forms, taking them directly to the active application context.
- **Recognition Over Recall** *(Jakob Nielsen & Rolf Molich)*: Showing "Go to Marketplace" in the header immediately signals the user's logged-in status without requiring them to recall if they had already signed in.
- **Don't Make Me Think** *(Steve Krug)*: Clear, single-action CTA ("View Public Market Report") tells users exactly what they will see upon clicking.
- **Fitts's Law** *(Paul Fitts)*: Prominent header button with adequate tap target ensures quick access on both mobile and desktop viewports.

---

## 4. Affected File Paths & Line Counts ($\le 200$ Lines)

- `web/src/features/home/components/HomeMarketPulse.tsx`: 50 lines
- `web/src/features/home/components/LandingHeader.tsx`: 118 lines
- `web/src/components/BuyerSiteHeader.tsx`: 168 lines
- `web/app/marketplace/page.tsx`: 36 lines
- `web/app/marketplace/[id]/page.tsx`: 38 lines
- `web/app/(auth)/login/page.tsx`: 199 lines
- `web/app/(auth)/signup/page.tsx`: 195 lines

---

## 5. Verification Performed

- **TypeScript Typecheck**:
  - `bun run typecheck` (`web/`): Passed with 0 errors (`$ tsc --noEmit`).
- **Production Next.js Build**:
  - `bun run build` (`web/`): Verified clean compilation across all routes.
