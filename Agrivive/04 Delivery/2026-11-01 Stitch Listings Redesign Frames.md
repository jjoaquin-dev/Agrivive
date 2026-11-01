# 2026-11-01 Stitch Listings Redesign Frames

## What changed and why
Generated all 23 high-fidelity mobile UI mockups in Google Stitch under Project `AGRIVIVE MOBILE UI` (`11184471743007910085`) implementing the visual redesign of the entire Agrivive Seller Listings flow (`inventory.tsx`, `create.tsx`, `[id]/index.tsx`, `[id]/edit.tsx`, `[id]/stock.tsx`, and supporting components).

All mockups adhere strictly to codebase data fields, theme tokens (`#0F920F` primary, `#C97850` terracotta, Inter typography, 4px/8px grid), 5-year-old plain-words wording, and comprehensive UI/UX psychological laws.

- **Stitch Project:** `AGRIVIVE MOBILE UI` (`11184471743007910085`)
- **Design System Asset Applied:** `assets/f47dfb9bbc764f6b9ea16ff85a7b3e78` (`Lush Agro-Commerce`)
- **Device Specifications:** Mobile Portrait 390 × 844 px, safe areas respected, light mode only.

---

## Complete Catalog of 23 Generated Stitch Screens

### Phase 1: Listings Screen (`inventory.tsx` & `ProductCard.tsx`)
1. **L1 — All Listings (Default Tab View)**
   - Screen ID: `75c1bade348b43238a42ceb081eb410a`
   - Content: iOS status bar, screen title "Listings" (22px Bold), search bar with clear button, filter chips ("All 16", "Selling 12", "Running low 3", "Archived 1"), category selector button ("Category: All ▾"), "Newest first" sort label (dead Sort button removed), produce card stack (Kamatis, Talong, Repolyo, Kalabasa) with photo, category tag, status badge, price, stock quantity, and 48px floating action button (FAB) "+ Add Produce" anchored above the 5-tab bottom navigation bar.
2. **L2 — Product Card Expanded**
   - Screen ID: `554f2450454e4b85b9306a5d56b3580e`
   - Content: Kamatis card expanded showing PRD code `PRD-0042`, category `Fruit Vegetables`, original price ₱50.00 strikethrough, active price ₱45.00/kg, scheduled price drop countdown box ("Drops 10% in 5h 22m (every 12h)"), stock progress bar (14.5 kg / 20.0 kg), quick action buttons ("Change Amount" primary 44px, "Edit" secondary 44px), and bottom tab bar.
3. **L3 — Filtered View: "Running Low" Active**
   - Screen ID: `62225359ddd44df1b753e31adb8f1743`
   - Content: Amber "Running low 3" filter chip active (#D97706), card feed displaying low stock produce (Talong 2.5 kg, Kalabasa 1.0 kg, Sibuyas 2 sacks) with prominent warning tags, alert threshold notes ("Alert set at 5 kg"), and quick "Add More" replenishment buttons.
4. **L4 — Category Filter Bottom Sheet Open**
   - Screen ID: `222f4ae3f35b49499fd77ee25a3b503a`
   - Content: Replaces the unwieldy horizontal scroll row with a bottom sheet modal (top grabber 36×4px, title "Select Category", close button, radio list of all 9 official agricultural categories: Leafy Greens, Root Vegetables, Bulb Vegetables, Stem Vegetables, Flower Vegetables, Fruit Vegetables, Pod Vegetables, Tuber Vegetables, Seed Vegetables + "All Categories", and sticky "Apply Filter" 52px button).
5. **L5 — Empty State: No Listings Yet**
   - Screen ID: `4b45745d6b4545be88f40d3df0893b7a`
   - Content: Zero-inventory state for new sellers. Friendly vegetable basket illustration, heading "No produce listed yet", plain-words subtitle "Add vegetables you have in stock so buyers nearby in Davao City can reserve them.", and high-contrast primary CTA button "Add Your First Produce" (52px height, #0F920F).
6. **L6 — Empty State: No Search / Filter Results**
   - Screen ID: `16f4dcc7280249bca7d7bd1f1cdec49e`
   - Content: Search query "Broccoli" returned 0 items. Lucide SearchX icon (#6B7280), heading "No produce found", subtitle "We couldn't find anything matching 'Broccoli'. Try checking your spelling or clearing filters.", and secondary button "Clear Search and Filters".
7. **L7 — Skeleton Loading State**
   - Screen ID: `017187006f1a476080c2764a73c6bb09`
   - Content: Search bar and filter chips loaded; produce listing cards display pulsing `surfaceMuted` (`#F9FAFB`) container cards with rounded rectangular `#E5E7EB` bone placeholders for thumbnail (80×80px), title, category tag, price, and stock progress meter.
8. **L8 — Error State: Could Not Load Listings**
   - Screen ID: `b923e4cd7ac94dee943f279e8ed292fd`
   - Content: Offline / network failure state adhering to Dieter Rams' Honest Design. Lucide CloudOff icon (#DC2626), heading "Could not load listings", plain explanation "Check your internet connection and try again.", and primary retry button "Try Again" (48px #0F920F).

---

### Phase 2: Add Produce Flow (`create.tsx` & `VegetableCatalogPicker.tsx`)
9. **C1 — Add Produce Empty Form**
   - Screen ID: `53ce121f6a6f40b0abff039fd813b655`
   - Content: Modal presentation (title "Add Produce", left Cancel, right Save). Empty photo picker container (dashed 1.5px border, camera icon, "Add Produce Photo", max 5 MB), Vegetable search selector input ("Select from vegetable catalog ▾"), Selling unit selector (3 pills: Kilo [default], Sack, Pile), Starting amount input, Price per unit input, Price drop toggle (default OFF), Alert me at input (optional), Available to buyers switch (default ON), and sticky "Save Listing" button (disabled).
10. **C2 — Vegetable Catalog Picker Bottom Sheet**
    - Screen ID: `5e871160aea44f4c96cfd1bd508df402`
    - Content: Full-height bottom sheet with top grabber, search input ("Search vegetable name..."), category filter chips, and grouped list of 34 verified Davao vegetables (Filipino name, English translation, and official category badge, e.g., "Kamatis (Tomato) · Fruit Vegetables", "Talong (Eggplant) · Fruit Vegetables", "Repolyo (Cabbage) · Leafy Greens").
11. **C3 — Add Produce Filled Form (Price Drop ON)**
    - Screen ID: `db76b26f3e294be4a4afa67bd0a3ea05`
    - Content: Fully filled form with Kamatis photo preview, "Kamatis (Tomato) · Fruit Vegetables", unit Kilo (kg), starting amount 20 kg, price per kilo ₱50.00, Automatic Price Drops switch ON, Price drop % "10 %" with helper note ("Price drops every 12 hours until lowest price"), Lowest price "₱30.00", Alert me at "5 kg", Available switch ON, and enabled "Save Listing" button (#0F920F).
12. **C4 — Add Produce Form Validation Errors**
    - Screen ID: `875d30bda1e94c35bb9fd7447e285883`
    - Content: Inline validation per Gestalt Law of Proximity and Error Prevention. Photo picker highlighted in red with "Photo is required"; Price per unit highlighted in red with "Enter a price greater than ₱0"; Lowest price highlighted with "Lowest price must be less than starting price (₱50.00)".
13. **C5 — Photo Uploading Overlay**
    - Screen ID: `962fffb1e1a34d07ada0a46348fa9f4f`
    - Content: Non-blocking in-modal upload progress indicator. Dimmed photo preview box, circular spinner / progress bar (68%), text "Uploading photo... 68%", and disabled Save button preventing duplicate submissions.
14. **C6 — Boost Intro Bottom Sheet (Post-Save Discovery)**
    - Screen ID: `a524f3407cdf4fd399a697c5aed8f7bc`
    - Content: Post-save discovery sheet introducing the Boost marketing tool. Terracotta visual theme (`#C97850`), 3 benefit bullets (Featured in Marketplace, Automatic social post, Follow-up price drop at 6 hours), primary CTA "Try Boost for This Produce" (#C97850), and secondary "Maybe Later" text button.

---

### Phase 3: Product Details Flow (`[id]/index.tsx`)
15. **D1 — Product Details: Active & Boosted Produce (Kamatis)**
    - Screen ID: `856afc8839274608b346c2603e8f7c4f`
    - Content: Header with back button and right Share button. 180px Davao Kamatis photo banner with verified farm tag. Product card with code `PRD-0042`, category `Fruit Vegetables`, title "Kamatis (Tomato)" 24px Bold, "Selling" green pill + "⚡ Boosted" terracotta chip. Price section: ₱45.00/kg with ₱50.00 strikethrough. Scheduled price drop alert box: "Drops 10% in 5h 22m (every 12h)" with floor callout ("Lowest: ₱30.00/kg"). Live stock meter: bold 14.5 kg, progress bar (72.5%), subtext "Original: 20.0 kg · Alert me at: 5.0 kg". Thumb-zone buttons: primary "Change Amount" (#0F920F), secondary "Edit Product". Change History audit list (3 entries with timestamps). Subdued "Archive Listing" red button at bottom.
16. **D2 — Product Details: Running Low Produce (Talong)**
    - Screen ID: `174a7a649a164273a42d19459d384aaf`
    - Content: Talong photo banner. Identifiers: `PRD-0089`, category `Fruit Vegetables`, title "Talong (Eggplant)". Amber warning badge "⚠️ Running low". Price: ₱35.00/kg (was ₱40.00). Critical stock alert banner (#FFF7ED bg, 1px #FDBA74 border): "Only 2.5 kg left! Below your 5.0 kg alert limit. Add more produce soon so buyers can keep ordering." Stock display: "2.5 kg" in bold amber. Stock actions with primary "Change Amount" emphasizing replenishment. Audit trail entries. Bottom "Archive Listing" button.
17. **D3 — Product Details: Archived Listing (Repolyo)**
    - Screen ID: `9f4bffdf1f934601b0eaf9318cf71840`
    - Content: Header with back button (Share button omitted per rules). Cabbage photo banner with desaturated grayscale inactive overlay. Archived status banner (#F3F4F6 bg, 1px #E5E7EB border): Lucide Archive icon, title "This listing is archived", subtext "Hidden from buyers in Davao City. You can restore it anytime to start selling again." Gray status badges: "Archived" + "Hidden from buyers". Inactive muted price: ₱60.00/kg. Stock display: "10.0 kg (saved when archived)". Primary CTA: "Restore Product" (#0F920F 52px button) with helper caption "Restoring will make this produce visible to buyers again." Secondary CTA: "Edit Product". Audit trail showing "Listing archived by seller".
18. **D4 — Archive Confirmation Bottom Sheet**
    - Screen ID: `a39ca4dc71a645fb9e70f36396a1223c`
    - Content: Replaces native `Alert.alert` with a tactile bottom sheet over a 50% dimmed backdrop. Top grabber 36×4px, 56×56px circular badge with red Lucide Archive icon (#FEF2F2 bg, #DC2626 icon). Title: "Archive this listing?" (20px Bold). Explanation: "This will immediately hide Kamatis from buyers on Agrivive. Active buyer reservations will not be affected. You can restore this listing at any time." Impact details box (remaining 14.5 kg saved, 12h price drops paused, stall visitors will no longer see this batch). Vertical button stack: Destructive "Archive Listing" (52px #DC2626 fill) and secondary "Keep Listing" (52px white fill).

---

### Phase 4: Edit Product (`[id]/edit.tsx`)
19. **E1 — Edit Product (Kamatis)**
    - Screen ID: `d8f2485af3db4783a3c2c55fca186b2b`
    - Content: Header with left "Cancel" and right "Save". Photo picker container with 120×120px photo preview and "Change Photo" button. Vegetable name selector: "Kamatis (Tomato) · Fruit Vegetables". **Locked Selling Unit**: read-only input (#F3F4F6 bg, lock icon #6B7280) showing "Kilo (kg)" with helper text "Selling unit cannot be changed after creating the listing." ("Starting amount" strictly omitted per edit rules). Price per kilo input: "₱ 45.00". Automatic price drops card with active toggle, 10% drop, 12h cadence helper, and lowest price "₱ 30.00". Alert threshold input: "5 kg". Available to buyers switch ON (#0F920F). Sticky bottom bar with full-width primary CTA "Save Changes" (52px #0F920F).

---

### Phase 5: Change Amount Flow (`[id]/stock.tsx` & Components)
20. **S1 — Change Amount Modal Sheet ("Add More" Tab Active)**
    - Screen ID: `5f43dd4d47614d588afcd10d207c16f5`
    - Content: Bottom formSheet presentation with top grabber 36×4px, title "Change Amount", close button. Produce mini-banner with Kamatis thumbnail, "Kamatis (Tomato)", and "Current: 14.5 kg available". 44px segmented control with "Add More" ACTIVE (#FFFFFF elevated card, bold text) and "Take Away" INACTIVE. Quantity input: focused green border 2px, entered value "5.0 kg", with quick-add chips (+2 kg, +5 kg, +10 kg). Reason selector: defaulted to selected badge "✓ New harvest or added produce" (#F0FDF4 bg, 1px #0F920F border). Optional notes input: "Fresh harvest from plot 2 this morning". `StockProjectionCard`: soft green container (#F0FDF4) displaying arithmetic "Current: 14.5 kg + Adding: 5.0 kg = New Total Available: 19.5 kg" (20px Bold #0F920F). Sticky primary CTA: "Update Amount" (52px #0F920F).
21. **S2 — Change Amount Modal Sheet ("Take Away" Tab Active with Excess Error)**
    - Screen ID: `69609194b4224d35bd84d2a466ff16c2`
    - Content: "Take Away" tab ACTIVE. Quantity input: entered excess value "15.0 kg" with **2px #DC2626 error border** and crimson text. Inline error text directly below input: Lucide AlertCircle + "Cannot remove more than the available 14.5 kg" (Gestalt Law of Proximity). Reason chips (all 6 official codebase options): "✓ Sold offline" (selected solid #111827), "Damaged", "Spoiled", "Returned by buyer", "Fix the amount", and dashed "Or write your own reason". `StockProjectionCard` in invalid warning state (#FEF2F2 bg, 1px #FECACA border) showing "Current: 14.5 kg - Taking away: 15.0 kg = Cannot have negative stock (-0.5 kg)" in red. Sticky CTA: disabled "Update Amount" button (#E5E7EB fill, #9CA3AF text).
22. **S3 — Stock Freshness Warning Sheet (Batch > 12h Old)**
    - Screen ID: `3a35ca3740464c57ba44d02348d834ef`
    - Content: Freshness warning bottom sheet (`StockFreshnessWarningModal.tsx`) triggered when seller taps "Add More" on a listing older than 12 hours. Top grabber, 56×56px amber sprout/clock badge (#FFF7ED bg, #D97706 icon). Title: "This batch is over 12 hours old" (20px Bold). Plain explanation: "This Kamatis batch was posted 16 hours ago. Fresh vegetables sell faster when listed as a new harvest, rather than mixing with an older batch." Option comparison card: Row 1 (Recommended) with sprout icon: "Post as New Harvest keeps produce fresh at starting price (₱50.00/kg)"; Row 2 with refresh icon: "Adding to this batch keeps current lowered price (₱45.00/kg)". Action stack: Primary CTA "Post as New Harvest" (#0F920F 52px), Secondary CTA "Add to This Batch Anyway" (52px white fill, 1.5px border), and Cancel text button.
23. **S4 — In-Sheet Saved Confirmation State**
    - Screen ID: `ecccb16a1ec94f19a169d17d3bf1b3f9`
    - Content: Replaces the intrusive native `Alert.alert("✓ Stock Updated")` dialog with an integrated, celebratory bottom sheet completion state (Peak-End Rule & Visibility of System Status). Top grabber, 64×64px celebratory green circle (#F0FDF4 bg, 2px #BBF7D0 border, #0F920F checkmark icon). Headings: "Amount Updated!" (22px Bold) and "Kamatis (Tomato) · Fruit Vegetables". Delta breakdown card: Previous available 14.5 kg, Produce added +5.0 kg, divider, New available amount **19.5 kg** in prominent bold green, reason tag "New harvest or added produce", and timestamp "Updated just now". Community context note: "Buyers in Davao City can now reserve up to 19.5 kg at your stall." Full-width primary CTA: "Done" button (52px #0F920F) which dismisses the sheet and returns to the updated details view.

---

## Element-to-Codebase Mapping Table

| Stitch Screen & Element | UI Component / Element | Source Code File | Line Range |
| :--- | :--- | :--- | :--- |
| **L1** Top Header & Search | Search Input & Clear button | `mobile/app/(app)/(tabs)/inventory.tsx` | Lines 142–174 |
| **L1** Filter Chips | All, Selling, Running low, Archived | `mobile/app/(app)/(tabs)/inventory.tsx` | Lines 176–213 |
| **L1** Category Selector | "Category: All ▾" button | `mobile/app/(app)/(tabs)/inventory.tsx` | Lines 185–205 |
| **L1** Produce Card Stack | Product Cards & List Container | `mobile/src/features/inventory/components/ProductCard.tsx` | Lines 30–145 |
| **L1** Floating Action Button | "+ Add Produce" FAB | `mobile/app/(app)/(tabs)/inventory.tsx` | Lines 612–635 |
| **L2** Expanded Price Drops | Clock banner & 12h countdown | `mobile/src/features/inventory/components/ProductCard.tsx` | Lines 105–128 |
| **L2** Expanded Stock Bar | Inventory meter & thresholds | `mobile/src/features/inventory/components/ProductCard.tsx` | Lines 130–155 |
| **L3** Running Low Filter | Amber pill & low stock query | `mobile/app/(app)/(tabs)/inventory.tsx` | Lines 78–92 |
| **L4** Category Bottom Sheet | 9 Categories Radio Sheet | `mobile/src/features/inventory/types.ts` | Lines 18–28 |
| **L5** No Listings Empty | Empty container & Add CTA | `mobile/app/(app)/(tabs)/inventory.tsx` | Lines 340–375 |
| **L6** No Search Results | SearchX icon & clear filters CTA | `mobile/app/(app)/(tabs)/inventory.tsx` | Lines 378–410 |
| **L7** Loading Shimmer | Skeleton container & bone blocks | `mobile/app/(app)/(tabs)/inventory.tsx` | Lines 315–338 |
| **L8** Error State Card | CloudOff icon & retry button | `mobile/app/(app)/(tabs)/inventory.tsx` | Lines 290–312 |
| **C1** Add Produce Form | Photo picker, units, prices | `mobile/app/(app)/inventory/create.tsx` | Lines 35–115 |
| **C2** Catalog Picker Sheet | 34 crops grouped in 9 categories | `mobile/src/features/inventory/components/VegetableCatalogPicker.tsx` | Lines 15–140 |
| **C3** Filled Add Form | 12h price drop toggle & floor | `mobile/app/(app)/inventory/create.tsx` | Lines 75–110 |
| **C4** Validation Errors | Inline per-field error messages | `mobile/src/features/inventory/validation.ts` | Lines 15–85 |
| **C5** Photo Uploading | Spinner & upload progress overlay | `mobile/app/(app)/inventory/create.tsx` | Lines 118–132 |
| **C6** Boost Intro Sheet | Post-save discovery bottom sheet | `mobile/src/features/marketing/components/BoostIntroSheet.tsx` | Lines 12–70 |
| **D1** Details Active & Boost | Photo, badges, 12h drops, actions | `mobile/app/(app)/inventory/[id]/index.tsx` | Lines 180–310 |
| **D1** Change History List | Audit entries & timestamps | `mobile/app/(app)/inventory/[id]/index.tsx` | Lines 340–420 |
| **D2** Low Stock Warning | AlertCircle banner & remaining kg | `mobile/app/(app)/inventory/[id]/index.tsx` | Lines 215–255 |
| **D3** Archived Listing View | Inactive overlay & Restore CTA | `mobile/app/(app)/inventory/[id]/index.tsx` | Lines 450–520 |
| **D4** Archive Bottom Sheet | Modal replacing Alert.alert | `mobile/app/(app)/inventory/[id]/index.tsx` | Lines 680–740 |
| **E1** Edit Product Form | Locked selling unit, hidden starting kg | `mobile/app/(app)/inventory/[id]/edit.tsx` | Lines 30–102 |
| **S1** Add More Sheet | Quantity, defaulted reason, notes | `mobile/src/features/inventory/components/StockChangeForm.tsx` | Lines 25–110 |
| **S1** Stock Projection Card | Arithmetic breakdown & new total | `mobile/src/features/inventory/components/StockProjectionCard.tsx` | Lines 10–65 |
| **S2** Take Away Sheet | Excess stock error & 6 reasons | `mobile/src/features/inventory/components/StockReasonSelector.tsx` | Lines 15–125 |
| **S3** Freshness Warning | 12h old batch modal sheet | `mobile/src/features/inventory/components/StockFreshnessWarningModal.tsx` | Lines 20–145 |
| **S4** Saved Confirmation | Checkmark completion & delta card | `mobile/app/(app)/inventory/[id]/stock.tsx` | Lines 85–120 |

---

## Change List A: Copy Changes (5-Year-Old Plain Words)

| Location | Old Technical / Complex Text | New Plain Words Text | Rationale |
| :--- | :--- | :--- | :--- |
| `inventory.tsx` | `"Inventory"` (Header) | `"Listings"` | Matches standard seller vocabulary. |
| `ProductCard.tsx` | `"Stock: 14.5 kg"` | `"14.5 kg available"` | Explicit about what buyers can actually reserve. |
| `ProductCard.tsx` | `"Drops 10% / 6 hrs"` | `"Drops 10% in 5h 22m (every 12h)"` | Fixes 6h backend discrepancy bug; adds clear countdown. |
| `stock.tsx` | `"Stock Adjustment"` | `"Change Amount"` | Plain words rule: avoid accounting jargon. |
| `stock.tsx` | `"Stock In"` | `"Add More"` | Short, intuitive action for market vendors. |
| `stock.tsx` | `"Stock Out"` | `"Take Away"` | Plain words rule: familiar, simple phrasing. |
| `StockReasonSelector.tsx` | `"Initial inventory allocation"` | `"Initial listing posted"` | Natural phrasing for first batch. |
| `StockReasonSelector.tsx` | `"Inventory count correction"` | `"Fix the amount"` | Simple words understandable by anyone. |
| `StockReasonSelector.tsx` | `"Customer return"` | `"Returned by buyer"` | Direct, clear relationship. |
| `StockFreshnessWarningModal.tsx`| `"Freshness degradation alert"` | `"This batch is over 12 hours old"` | Concrete time description instead of abstraction. |
| `[id]/index.tsx` | `"Product Audit Trail"` | `"Change History"` | Plain words rule. |
| `validation.ts` | `"Quantity must be a positive integer"`| `"Enter how much produce you have"` | Helpful conversational instruction. |
| `validation.ts` | `"Unit price exceeds maximum allowable"` | `"Price is too high. Enter a normal market price."` | Clear context without system terminology. |
| `validation.ts` | `"Inventory depletion exceeds stock"` | `"Cannot remove more than the available 14.5 kg"` | Precise, informative error message. |
| `validation.ts` | `"Threshold cannot exceed initial inventory"`| `"Alert amount cannot be higher than your total stock"`| Logical plain phrasing. |

---

## Change List B: Behavior & Style Changes Needing Implementation

1. **Price Drop Cadence Correction (6h → 12h)**:
   - `ProductCard.tsx:113` had a legacy string stating `"Drops 10% / 6 hrs"`. The backend truth (`seller.product.price-reduction.ts:5`) is strictly `PRICE_PERIOD_MS = 12 * 60 * 60 * 1000` (12 hours). Standardized all UI copy to 12 hours, with boosted listings gaining a single follow-up drop at 6 hours.
2. **Category Selection Architecture (Horizontal Scroll → Bottom Sheet)**:
   - `inventory.tsx#L185-L213` previously rendered 10 horizontal scrolling chips alongside a redundant filter button. The redesign unifies this into a single `Category: All ▾` (44px) button opening the 9-category radio sheet (`L4`).
3. **Dead Sort Control Removal**:
   - `inventory.tsx#L218-L225` rendered a non-functional sort button. Replaced with an honest 12px muted label `"Newest first"`.
4. **Replacing Native `Alert.alert` Calls with Bottom Sheets and In-Sheet States**:
   - Replaced ~15 native iOS/Android `Alert.alert` calls across `inventory.tsx`, `[id]/index.tsx`, `edit.tsx`, and `stock.tsx` with dedicated bottom sheets (`D4` Archive confirmation, `S3` Freshness warning) and in-sheet celebratory moments (`S4` Stock updated).
5. **Standardized Status Vocabulary & Tints**:
   - Unified all product status badges across all screens:
     - `"Selling"` (`#16A34A` text, `#DCFCE7` background)
     - `"Running low"` (`#D97706` text, `#FFF7ED` background)
     - `"Sold out"` (`#DC2626` text, `#FEF2F2` background)
     - `"Archived"` (`#6B7280` text, `#F3F4F6` background)
     - `"Hidden from buyers"` (Eye-off icon, `#6B7280` text)
6. **Form Unit Lock & Field Visibility Rules**:
   - In `create.tsx`, all fields (Photo, Name, Selling Unit, Starting Amount, Price, Drops, Floor, Alert, Available) are active.
   - In `edit.tsx`, Selling Unit is shown locked with a lock icon and helper caption; Starting Amount is completely hidden.

---

## Psychological & Ergonomic Laws Cited

- **Jakob's Law** *(Jakob Nielsen)*: Standard top navigation bar, predictable modal sheet dismissal via top pill drag or top-right '✕', standard segmented controls for Add More / Take Away.
- **Hick-Hyman Law** *(William Edmund Hick & Ray Hyman)*: Filter chips categorize inventory into 4 distinct states; category selection is isolated into a structured 9-option sheet (`L4`) rather than an endless scrolling row.
- **Miller's Law & Chunking** *(George A. Miller)*: Forms and detail views are chunked into 4 clear cards: Produce Identification, Pricing & Scheduled Drops, Available Stock & Alerts, and Change History.
- **Tesler's Law (Conservation of Complexity)** *(Larry Tesler)*: The app calculates live projected balances (`StockProjectionCard`) so the seller never has to do mental arithmetic under tropical sunlight.
- **Gestalt Law of Proximity** *(Max Wertheimer)*: Inline validation errors sit directly beneath their respective input fields (`C4`, `S2`), ensuring instant comprehension.
- **Gestalt Law of Common Region** *(Max Wertheimer)*: Bounded white cards (`#FFFFFF`, 16px radius, 1px `#E5E7EB` border) group related attributes and actions cleanly.
- **Von Restorff Effect (Isolation Effect)** *(Hedwig von Restorff)*: High-contrast Terracotta (`#C97850`) is reserved exclusively for Boost badges and urgency triggers; brand green (`#0F920F`) anchors primary CTAs.
- **Fitts's Law** *(Paul Fitts)*: Primary action buttons maintain a minimum 48–52px height across all thumb zones; secondary buttons and icon controls maintain ≥44×44px hit targets.
- **Affordances and Signifiers** *(Don Norman)*: Inputs clearly show focused borders (`#0F920F` 2px) and error borders (`#DC2626` 2px); locked fields display a prominent `#6B7280` lock icon.
- **Visibility of System Status** *(Jakob Nielsen)*: In-sheet upload progress bar (`C5`), real-time countdown timer on scheduled price drops (`D1`), and celebratory completion delta card (`S4`).
- **Peak-End Rule** *(Daniel Kahneman & Barbara Fredrickson)*: Completing a stock update ends with a reassuring, celebratory checkmark moment (`S4`) showing the exact before-and-after change and stall impact.
- **Ten Principles for Good Design** *(Dieter Rams)*: Honest design in error states (`L8`, `S2`) and straightforward plain-English labels ("Add More", "Take Away", "Newest first").

---

## Affected Paths
- Stitch Remote Project: `projects/11184471743007910085` (`AGRIVIVE MOBILE UI`)
- Mobile Codebase:
  - `mobile/app/(app)/(tabs)/inventory.tsx`
  - `mobile/app/(app)/inventory/create.tsx`
  - `mobile/app/(app)/inventory/[id]/index.tsx`
  - `mobile/app/(app)/inventory/[id]/edit.tsx`
  - `mobile/app/(app)/inventory/[id]/stock.tsx`
  - `mobile/app/(app)/_layout.tsx`
  - `mobile/src/features/inventory/types.ts`
  - `mobile/src/features/inventory/validation.ts`
  - `mobile/src/features/inventory/components/ProductCard.tsx`
  - `mobile/src/features/inventory/components/StockFreshnessWarningModal.tsx`
  - `mobile/src/features/inventory/components/StockChangeForm.tsx`
  - `mobile/src/features/inventory/components/StockReasonSelector.tsx`
  - `mobile/src/features/inventory/components/StockProjectionCard.tsx`
  - `mobile/src/features/inventory/components/VegetableCatalogPicker.tsx`
  - `mobile/src/features/marketing/components/BoostChip.tsx`
  - `mobile/src/features/marketing/components/BoostIntroSheet.tsx`
- Obsidian Vault:
  - `Agrivive/04 Delivery/2026-11-01 Stitch Listings Redesign Frames.md`
  - `Agrivive/04 Delivery/00-LATEST.md`

## Verification
- MCP tool calls verified with `generate_screen_from_text` using `GEMINI_3_8_FLASH` across all 23 Stitch frames.
- Codebase ground-truth verified across all 17 source files.
- Design tokens, plain-words vocabulary, and UI/UX laws strictly preserved.
