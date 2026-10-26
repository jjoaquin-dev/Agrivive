# Agrivive Mobile Design System

## Scope

This guide applies to the **seller mobile app**. Agrivive empowers Davao City vegetable farmers and market vendors to list marketable surplus, manage live inventory, coordinate buyer reservations, scan digital pickup passes, and track surplus movement. Designed for React Native with Expo on Android 10+ and iOS, targeting a modern, responsive mobile viewport.

The visual direction is clean, high-contrast, professional, and accessible. It uses a **Clean White (`#FFFFFF`)** background with vibrant **AgriVive Green (`#16A34A` / `#0F920F`)**, generous whitespace, scannable card groups, and familiar touch controls. Avoid heavy shadows, cluttered layouts, and non-standard gestures.

## Brand Assets

- `agrivive-logo-full.png`: Use on onboarding, splash, and auth flows where the wordmark and tagline remain fully legible.
- `agrivive-logo-icon.png`: Compact brand placement, favicon, and app icons.
- Preserve aspect ratio and brand colors; do not recreate or redraw the mark from generated mockups.

## Canonical Color Tokens

These tokens are implemented in `mobile/src/theme/index.ts` and serve as the single source of truth across the mobile codebase:

| Token | Value | Semantic Usage |
|---|---|---|
| `primary` | `#0F920F` | Primary CTAs, active tab accents, key action cards |
| `primaryPressed` | `#0C770C` | Pressed button state (`:active` feedback) |
| `primaryLight` | `rgba(15, 146, 15, 0.10)` | Light tinted icon backgrounds, subtle badge fills |
| `primarySurface` | `rgba(15, 146, 15, 0.05)` | Card highlight backgrounds, subtle callout panels |
| `background` | `#FFFFFF` | Global screen background (Clean White) |
| `surface` | `#FFFFFF` | Cards, modal sheets, input backgrounds |
| `surfaceMuted` | `#F9FAFB` | Inactive chips, disabled surfaces, table headers |
| `text` | `#111827` | Headings, primary labels, values (Tailwind Gray 900) |
| `textMuted` | `#6B7280` | Subtitles, helper text, timestamps (Tailwind Gray 500) |
| `border` | `#E5E7EB` | Dividers, card borders, input borders (Gray 200) |
| `sage` | `#A8BFA3` | Secondary botanical accents |
| `terracotta` | `#C97850` | Marketing boost highlights |
| `success` | `#16A34A` | Completed pickups, active stock, positive trends |
| `warning` | `#D97706` | Low stock alerts, pending orders, advisory notices |
| `error` | `#DC2626` | Depleted stock, cancelled/expired orders, errors |

## Typography and Spacing

Use **Manrope** for screen and section headings and **Inter** for body text, form fields, numbers, and button labels.

| Role | Size | Weight | Line Height | Font Family |
|---|---:|---:|---:|---|
| Large Title | 28 | 700 (Bold) | 34 | Manrope |
| Screen Title | 22 | 700 (Bold) | 28 | Manrope |
| Section Heading | 16–18 | 600 (SemiBold) | 24 | Manrope |
| Body Text | 14–15 | 400 (Regular) | 20–22 | Inter |
| Labels / Medium Body | 12–13 | 500 (Medium) | 18 | Inter |
| Captions / Badges | 10–11 | 600 (SemiBold) | 14 | Inter |

- **Spacing Grid:** 4 px base unit (4, 8, 12, 16, 20, 24, 32, 40 px).
- **Border Radii:** `sm`: 6 px, `input`: 10 px, `button`: 14 px, `card`: 16 px, `sheet`: 20 px, `full`: 9999 px.
- **Touch Targets:** Minimum 44 × 44 px for icon buttons; minimum 48 px height for primary CTA buttons.

## Plain User-Facing Words (Five-Year-Old Rule)

User-facing buttons, labels, and notices must strictly use familiar, short words:

| Technical / Internal Term (Forbidden in UI) | Approved Plain UI Term |
|---|---|
| Stock In | **Add More** |
| Stock Out | **Take Away** |
| Stock Adjustment / Correction | **Change Amount** |
| Activity Ledger / Audit Log | **Change History** |
| Depleted / Zero Inventory | **Out of Stock** |

## Navigation Architecture

### Bottom Tab Dock (5 Items with Center Floating FAB)
The app features a unified bottom tab dock configured in `mobile/app/(app)/(tabs)/_layout.tsx`:

```text
┌───────────────────────────────────────────────┐
│  [Home]   [Listings]   ( ＋ )   [Messages]  [Orders] │
│   🏠         📦         Add        💬         📅    │
└───────────────────────────────────────────────┘
```

1. **Home (`home.tsx`):** Operational dashboard summarizing active listings, twin action cards, 2×2 metric grid, and 3×2 attention tiles.
2. **Listings (`inventory.tsx`):** Surplus inventory catalog with search, category filters, stock indicators, and quick stock updates.
3. **Add Produce (`create.tsx`):** Elevated center green Floating Action Button (`#16A34A`, 48×48 px circle, white plus) navigating to `/(app)/inventory/create`.
4. **Messages (`messages.tsx`):** Real-time buyer-seller conversations with unread red badge counter (`#EF4444`).
5. **Reservations / Orders (`orders.tsx`):** Buyer order status (`pending`, `completed`, `cancelled`, `expired`) and handover tracking.

*Note: **Profile** is accessed directly via the user avatar circle in the top-right header of the Home screen (`/(app)/profile`).*

## Core Screens

1. **Onboarding & Sign-In (`mobile/app/(auth)/`):**
   - Value proposition carousel, email/password login, single-character OTP verification, 2FA/TOTP authenticator, and account recovery.
2. **Home Dashboard (`home.tsx`):**
   - **Header Brand Bar:** Shop name, GPS location pin, notification bell with unread dot, and seller avatar circle.
   - **Twin Actions:** Primary green card "Add Surplus Product" + white card "Scan Pickup QR".
   - **2×2 Metrics Grid:** Active Listings, Low Amount, Out of Stock, and Available Surplus (kg & sacks).
   - **3×2 Attention Hub:** Direct shortcuts to Low Stock, Messages, Analytics, Boosts, Change History, and Advisories.
   - **Alerts & Feed:** Low stock alert cards and recent stock change feed.
3. **Inventory Management (`inventory.tsx`, `inventory/create.tsx`):**
   - Vegetable catalog selection, packaging scale (`kilo`, `sack`, `pile`), initial quantity, price reduction schedule, and photo capture via S3 presigned URLs.
   - Repeat listing support for subsequent surplus harvest batches.
4. **Order Handover & QR Scanning (`orders/scan.tsx`, `orders/[id].tsx`):**
   - Camera QR scanner validating buyer reservation passes, displaying ordered items, quantity confirmation stepper, and grace period handling.
5. **Analytics (`analytics.tsx`):**
   - Sourced 100% from real data: `react-native-gifted-charts` for volume flow bar charts and lifecycle trendlines, 2×4 KPI metrics, packaging scale distribution bar, pickup outcome disposition, and AHP-TOPSIS visibility guides.
6. **Market Advisories (`advisories.tsx`):**
   - Local weather forecast (temperature, precipitation probability) and upcoming holiday demand warnings.
7. **Profile & Security (`profile/`):**
   - Stall location with interactive map picker, contact information, seller verification status, trust score, and security settings.

## Interaction & Accessibility

- Provide instant tactile feedback on touch (`:active` press states, minimum 48 px tap targets).
- Display inline field validation below inputs; prevent multi-submission during API calls.
- Support safe area insets on iOS and Android edge-to-edge layouts.
- Label synthetic or demo data clearly as "Sample data"; never imply simulated figures reflect real buyer purchases.
