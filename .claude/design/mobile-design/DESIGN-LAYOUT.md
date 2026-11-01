# AGRIVIVE SELLER APP — MOBILE UI/UX DESIGN & LAYOUT SPECIFICATION

Design specification for the Agrivive mobile seller experience in Davao City. The interface empowers vegetable farmers and market vendors to list surplus produce batches, track inventory, verify buyer pickup reservations, scan QR passes, and monitor surplus movement through real-time descriptive analytics.

The app strictly adheres to recognized cognitive psychology principles, ergonomics, and accessibility standards:

- **Jakob's Law** *(Jakob Nielsen)*: Standard top-header brand navigation, thumb-reachable 5-item bottom dock, and standard sheet dismissals.
- **Hick-Hyman Law** *(William Edmund Hick & Ray Hyman)*: Reduced choices through segmented category pills, status tabs, and focused twin actions.
- **Miller's Law & Chunking** *(George A. Miller)*: Information grouped into discrete, digestible 2×2 metric cards, 3×2 attention tiles, and separated form sections.
- **Tesler's Law (Conservation of Complexity)** *(Larry Tesler)*: The app absorbs multi-criteria AHP-TOPSIS calculations and expiration timers so the seller experiences intuitive simplicity.
- **Fitts's Law** *(Paul Fitts)*: Primary CTAs $\ge 48$ px high, icon-only buttons $\ge 44 \times 44$ px, and elevated center action button for adding surplus.
- **Gestalt Principles** *(Wertheimer, Koffka, Köhler)*: Law of Common Region (crisp rounded cards `#FFFFFF`), Proximity (form labels directly above inputs), and Similarity (brand green `#16A34A` for primary actions).
- **Von Restorff Effect (Isolation Effect)** *(Hedwig von Restorff)*: Reserved high-contrast Forest Green (`#457D00`) and terracotta accents exclusively for primary actions and urgent stock warnings.
- **Plain User-Facing Words Rule**: Short, familiar language suitable for five-year-olds (`Add More`, `Take Away`, `Change Amount`, `Change History`).

---

# 1. MAIN NAVIGATION DOCK

The app uses a thumb-optimized **5-item bottom dock with an elevated center Floating Action Button (FAB)**:

```text
┌────────────────────────────────────────────────────────┐
│                                                        │
│                     SCREEN CONTENT                     │
│                                                        │
├────────────────────────────────────────────────────────┤
│   🏠          📦          ( ＋ )         💬         📅 │
│  Home      Listings        Add       Messages    Orders│
└────────────────────────────────────────────────────────┘
```

### Destination Breakdown:
1. **Home (`home.tsx`):** Real-time operational dashboard, twin action cards, 2×2 metric grid, and 3×2 attention hub.
2. **Listings (`inventory.tsx`):** Surplus produce catalog with category search, packaging scale filters, and stock adjustment dialogs.
3. **Add Produce (`create.tsx`):** Elevated center green circular button (`#16A34A`, 48×48 px) opening `/(app)/inventory/create`.
4. **Messages (`messages.tsx`):** Direct buyer-seller chat with order reservation context and unread counter badge.
5. **Reservations / Orders (`orders.tsx`):** Buyer orders, status tabs, and digital pickup pass verification.

*Profile is accessed via the seller initials avatar in the top-right header of the Home screen (`DashboardHeader.tsx`).*

---

# 2. HOME DASHBOARD WIREFRAME

The dashboard immediately answers:
- What is my current active surplus inventory?
- Which produce items are running low?
- What actions need my immediate attention?
- What was the latest stock adjustment?

```text
┌────────────────────────────────────────────────────────┐
│ 9:41                                              100% │
│                                                        │
│ 🍃 Agrivive              📍 Bankerohan Public Market  │
│ Good morning,                                          │
│ Joaquin Jara            [✓ Verified]         🔔  (JJ)  │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ＋  Add Surplus Product                          › │ │
│ │     Declare new vegetable harvest batch            │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 📷  Scan Pickup QR                               › │ │
│ │     Verify buyer digital pickup pass               │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ 2×2 METRIC GRID                                        │
│ ┌──────────────────────────┐ ┌───────────────────────┐ │
│ │ 📋 Active Listings       │ │ ⚠️ Low Amount         │ │
│ │    14 batches            │ │    2 batches          │ │
│ │    Visible to buyers     │ │    Needs attention    │ │
│ └──────────────────────────┘ └───────────────────────┘ │
│ ┌──────────────────────────┐ ┌───────────────────────┐ │
│ │ 📦 Out of Stock          │ │ 🍃 Available Surplus  │ │
│ │    1 batch               │ │    450 kg · 12 sacks  │ │
│ │    Depleted produce      │ │    Across listings    │ │
│ └──────────────────────────┘ └───────────────────────┘ │
│                                                        │
│ NEEDS YOUR ATTENTION (3×2 Hub)                         │
│ ┌───────────────┐ ┌───────────────┐ ┌────────────────┐ │
│ │ ⚠️ Low Stock  │ │ 💬 Messages   │ │ 📊 Analytics   │ │
│ │    2 items    │ │    3 unread   │ │    Sales trend │ │
│ └───────────────┘ └───────────────┘ └────────────────┘ │
│ ┌───────────────┐ ┌───────────────┐ ┌────────────────┐ │
│ │ 📢 Boosts     │ │ 🔄 History    │ │ 🌡️ Advisories  │ │
│ │    Promote    │ │    Audit log  │ │    Weather/hol │ │
│ └───────────────┘ └───────────────┘ └────────────────┘ │
│                                                        │
│ LOW AMOUNT ALERTS                                      │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🍅 Tomatoes (Kamatis)                 [ Add More ] │ │
│ │    4 kg remaining (Threshold: 10 kg)               │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ RECENT CHANGE HISTORY                                  │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ＋ Added 50 kg Cabbage                      10:15 AM│ │
│ │ － Took away 5 kg Spoilage                   8:30 AM│ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│   🏠          📦          ( ＋ )         💬         📅 │
│  Home      Listings        Add       Messages    Orders│
└────────────────────────────────────────────────────────┘
```

---

# 3. INFORMATION HIERARCHY & TYPOGRAPHY

Information hierarchy uses strict typographic rhythm:

```text
28 px Bold        — Key metric numbers, Onboarding headlines
22 px Bold        — Screen titles
16–18 px SemiBold — Section titles, Card headings
14–15 px Regular  — Primary body text, Input values
12–13 px Medium   — Secondary descriptions, Input labels
10–11 px SemiBold — Badges, Pills, Status labels
```

---

# 4. INVENTORY SCREEN (`inventory.tsx`)

Main catalog management screen for active surplus produce:

- **Search Bar:** Real-time filter across product names and vegetable categories.
- **Category Filter Pills:** Horizontal scrolling filter (`All`, `Leafy`, `Fruit-bearing`, `Root crops`, `Legumes`).
- **Listing Cards:**
  - Produce photo (1:1 crop, presigned S3 upload).
  - Produce name, category tag, and pricing scale (`₱60 / kg`, `₱1,200 / sack`).
  - Remaining stock balance and threshold warning badge.
  - Action buttons: `[ Change Amount ]` and `[ Share / Boost ]`.
- **Repeat Listing Action:** Enables relisting recurring surplus batches for harvested crops without re-entering catalog identities.

---

# 5. STOCK ADJUSTMENT FLOW ("Change Amount")

Strictly adheres to plain words: **Add More** (stock in), **Take Away** (stock out/loss/donation), and **Change History**.

```text
Change Amount Modal
┌──────────────────────────────────────────────┐
│ Adjust Stock — 🍅 Fresh Tomatoes             │
│ Current balance: 14 kg                       │
│                                              │
│ [ ＋ Add More ]      [ － Take Away ]        │
│                                              │
│ Amount:                                      │
│ [ 20                                    kg ] │
│                                              │
│ Reason:                                      │
│ (•) Restocked from new harvest               │
│ ( ) Produce spoilage or sorting loss         │
│ ( ) Community donation                       │
│ ( ) Manual correction                        │
│                                              │
│ [ Cancel ]             [ Save Changes (48px) ]│
└──────────────────────────────────────────────┘
```

---

# 6. ORDER HANDOVER & QR SCANNING (`orders/scan.tsx`)

Physical verification flow when a buyer arrives at the market stall:

1. **Scan Screen:** High-speed camera QR scanner overlay with targeting box.
2. **Order Verification Card:**
   - Buyer name and order ID.
   - Reserved vegetable batches and requested quantities.
   - Real-time stock reservation status (Active, Grace Period, Expired).
3. **Quantity Stepper:** Allows seller to adjust actual dispensed amount if produce was weighed slightly lower or higher.
4. **Confirm Handover:** Single primary button (`#16A34A`, 48 px) executing verified atomic transaction and adjusting stock ledger.

---

# 7. ANALYTICS & TRENDS (`analytics.tsx`)

Replicated strictly from production design with `react-native-gifted-charts`:

- **Header Hero Banner:** Green card (`#457D00`) summarizing business performance.
- **Filter Row:** Window selector (`7 Days`, `Last 30 Days`, `Last 90 Days`), Unit filters (`All`, `kg`, `sacks`, `piles`), and Produce selector.
- **2×4 KPI Grid:**
  - Posted Produce, Completed Pickups (with $\pm X\%$ trend pill), Sell-Through Rate, Gross Sales Value, Available Surplus, Reserved Produce, Remaining Balance, and Repeat Listings.
- **Volume Flow Chart (`AnalyticsMovementChart.tsx`):**
  - Interactive toggle: **[Bar]** vs **[Trend]**.
  - Visualizes Posted, Sold, Reserved, Available Stock, and Unclaimed volumes.
- **Unit Distribution Bar (`AnalyticsUnitDistribution.tsx`):**
  - Segmented horizontal progress bar showing proportion across Kilograms, Sacks, and Piles.
- **Pickup Outcomes (`AnalyticsOrderOutcomes.tsx`):**
  - 4 disposition boxes: Completed (`#ECFDF5`), Reserved (`#EFF6FF`), Cancelled (`#FEF2F2`), Expired (`#FFFBEB`).
- **AHP-TOPSIS Visibility Guide (`VisibilityBreakdownCard.tsx`):**
  - Placement score, Tier badge, factor grid (Freshness 40%, Stock 30%, Reliability 20%, Recurrence 10%), and Visibility Boost CTA.

---

# 8. CONVERSATIONS & MESSAGING (`messages.tsx`)

Real-time coordination channel between sellers and buyers:

- **Order Reservation Context Banner:** Top banner displaying the active order ID, pickup time window, and produce items.
- **Quick Reply Chips:** Pre-built messages (`"Produce is ready for pickup"`, `"Location: Stall #42"`, `"Produce freshly weighed"`).
- **Message Bubbles:**
  - Sent: AgriVive Green (`#457D00`), white text.
  - Received: Neutral surface (`#F3F4F6`), dark text (`#111827`).
- **Media Attachments:** Presigned S3 photo sharing for produce inspection.

---

# 9. COLOR SEMANTICS & DESIGN TOKENS

```text
Primary Green:      #457D00 (CTAs, Active Tab, Highlights)
Screen Background:  #FFFFFF (Pure Clean White)
Card Surfaces:      #FFFFFF with 1px border #E5E7EB
Muted Surfaces:     #F9FAFB (Chips, Table Headers, Inactive States)
Primary Text:       #111827 (Tailwind Gray 900)
Muted Text:         #6B7280 (Tailwind Gray 500)
Success Status:     #16A34A (Completed Handover, Active Listings)
Warning Status:     #D97706 (Low Stock, Grace Period)
Error Status:       #DC2626 (Expired Reservations, Out of Stock)
```

---

# 10. SPACING & ERGONOMICS (8-POINT SYSTEM)

- **Screen Padding:** 16 px horizontal.
- **Card Padding:** 16 px internal padding.
- **Card Separation:** 12–16 px gap.
- **Section Headers:** 24–32 px top margin, 8–12 px bottom margin.
- **Form Controls:** Minimum 48 px height with 10 px border radius.
- **Touch Ergonomics:** High-priority actions positioned within the bottom natural thumb-zone.

---

# 11. ACCESSIBILITY STANDARDS

- Every icon-only button provides `accessibilityRole="button"` and a descriptive `accessibilityLabel`.
- Color is never used as the sole indicator of status; every status includes an explicit textual label (e.g. `[✓ In Stock]`, `[⚠ Low Stock]`, `[✕ Out of Stock]`).
- Minimum touch target size is $44 \times 44$ px.
- All text and foreground elements maintain a minimum 4.5:1 contrast ratio against the clean white background.
