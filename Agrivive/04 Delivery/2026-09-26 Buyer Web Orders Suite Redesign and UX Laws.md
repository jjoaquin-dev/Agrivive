# 2026-09-26 Buyer Web Orders Suite Redesign and UX Laws

## Summary

Codified authoritative UI/UX standards, psychological laws, and theories (with their originating authors) into `AGENTS.md`. Overhauled the buyer Orders suite (`/orders` and `/orders/[id]`) and Cart Drawer (`CartDrawer.tsx`) to match senior UI/UX frontend engineer and web designer standards.

## What Changed

### 1. Repository Guidelines (`AGENTS.md`)
- Added a comprehensive `## Comprehensive UI/UX Standards, Laws & Psychological Theories` section cataloging 30+ principles across 4 core domains:
  - **Cognitive Psychology & Mental Models**: Jakob's Law (*Jakob Nielsen*), Hick-Hyman Law (*William Edmund Hick & Ray Hyman*), Miller's Law (*George A. Miller*), Tesler's Law (*Larry Tesler*), Postel's Law (*Jon Postel*), Recognition Over Recall (*Jakob Nielsen & Rolf Molich*), Don't Make Me Think (*Steve Krug*).
  - **Visual Perception & Gestalt Psychology**: Gestalt Laws of Proximity, Similarity, Common Region, Uniform Connectedness, Prägnanz, and Figure-Ground (*Max Wertheimer, Kurt Koffka, Wolfgang Köhler*), Von Restorff Effect (*Hedwig von Restorff*), Serial Position Effect (*Hermann Ebbinghaus*), Aesthetic-Usability Effect (*Masaaki Kurosu & Kaori Kashimura*).
  - **Ergonomics, Motor Skills & Interaction**: Fitts's Law (*Paul Fitts*), Affordances & Signifiers (*Don Norman*), Doherty Threshold (*Walter J. Doherty & Ahrvid J. Thadhani*), Touch Target Principle & Mobile-First Ergonomics (*Luke Wroblewski*).
  - **Feedback, System Status & Emotional Ergonomics**: Visibility of System Status (*Jakob Nielsen*), Peak-End Rule (*Daniel Kahneman & Barbara Fredrickson*), Goal-Gradient Effect (*Clark L. Hull*), Inline Validation (*Caroline Jarrett & Gerry Gaffney*), Ten Principles for Good Design (*Dieter Rams*).

### 2. Orders Suite Overhaul
- **`OrderPickupStepper.tsx` (New)**: Introduced a visual pickup progression stepper (**Reserved** $\rightarrow$ **Ready for pickup** $\rightarrow$ **Completed**) adhering to the *Goal-Gradient Effect* and *Law of Uniform Connectedness*.
- **`OrderQr.tsx` (Redesign)**: Converted plain QR card into an authentic **Digital Pickup Pass** ticket featuring Forest Green header, reservation short code (`AGR-XXXXXX`), stall attribution, high-contrast QR container, and reassuring payment-at-pickup instructions (*Peak-End Rule* & *Law of Common Region*).
- **`OrderCard.tsx` (Redesign)**: Replaced plain table-row style card with senior visual hierarchy: stall branding, status pill, clear price contrast in Agrivive Forest Green, date & market location chips, and pass readiness badge.
- **`BuyerOrders.tsx` (Redesign)**: Implemented status filter tabs (**All**, **Active Pickups**, **Completed**, **Past / Cancelled**) with dynamic count badges and dedicated empty states (*Hick-Hyman Law* & *Miller's Law*).
- **`OrderSellerCard.tsx` & `OrderItemsCard.tsx` (New)**: Decomposed `OrderDetail.tsx` into focused subcomponents, keeping each under 70 lines.
- **`OrderDetail.tsx` (Redesign)**: Assembled stepper, pass ticket, stall card, and item lists with responsive mobile/desktop positioning and background polling.

### 3. Cart Multi-Stall Grouping
- **`CartDrawer.tsx` (Redesign)**: Grouped cart items by market stall with dedicated stall headers (*Law of Common Region*), 44px tactile quantity step buttons (*Fitts's Law*), and clear pickup terms.

## Why

Eliminates amateur appearance and cognitive friction across the reservation journey. Aligns all interfaces with Agrivive's natural earth palette (Forest Green `#1F4D3A`, Warm Cream `#F8F6F1`, Sage `#A8BFA3`, Terracotta `#C97850`, Emerald `#3F7D58`), guarantees strict touch targets ($\ge 44\text{px}$ / $\ge 48\text{px}$), and maintains modular code maintainability ($\le 200$ lines).

## Affected File Paths

- `AGENTS.md`
- `web/src/features/orders/components/OrderPickupStepper.tsx`
- `web/src/features/orders/components/OrderSellerCard.tsx`
- `web/src/features/orders/components/OrderItemsCard.tsx`
- `web/src/features/orders/components/OrderQr.tsx`
- `web/src/features/orders/components/OrderCard.tsx`
- `web/src/features/orders/components/BuyerOrders.tsx`
- `web/src/features/orders/components/OrderDetail.tsx`
- `web/src/features/cart/components/CartDrawer.tsx`

## Verification Performed

- **Line Count Limits**: All source code files measured and confirmed strictly $\le 168$ lines (well under the 200 line maximum).
- **TypeScript Typecheck**: `bun run typecheck` (`tsc --noEmit`) completed with exit code 0.
- **Next.js Production Build**: `bun run build` (`next build`) compiled and generated 11/11 static/dynamic pages with 0 errors.
