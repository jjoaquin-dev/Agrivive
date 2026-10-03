# Agrivive Buyer UI Reference Research

Date: 2026-10-03
Status: UI implementation complete and verified.
Scope: Web buyer-facing UI only. Backend contracts, buyer behavior, mapping logic, URL structure, and deployment configuration stay unchanged.

## Design read

Reading this as a redesign of a trust-first local produce marketplace for buyers, with a calm editorial-commerce language, strong food imagery, clear discovery controls, and restrained motion.

The implementation will preserve Agrivive's existing information architecture, green brand identity, marketplace filters, interactive map, notification behavior, orders, cart, and accessibility states. The references are used for layout and interaction patterns, not for copying visual assets or code.

## Research findings

### Discovery and filtering

Curated galleries such as [LandingPicks](https://www.landingpicks.com/), [Site of Sites](https://www.siteofsites.co/), [Maxi Best Of](https://maxibestof.one/), and [Lapa Ninja](https://www.lapa.ninja/) make browsing easier through visible categories, search, and style or industry filters. For Agrivive, this supports keeping category chips and marketplace filters close to the first product results, with clear active-filter removal.

### Commerce hierarchy

[Ecomm Design](https://ecomm.design/), [Commerce Cream](https://commercecream.com/), [Showit Store](https://store.showit.com/), [Webflow Templates](https://webflow.com/templates), and [Squarespace Templates](https://www.squarespace.com/templates) show the value of a strong image, short product or seller context, a clear price, and one primary action. Agrivive will use that hierarchy for product cards, seller summaries, the cart drawer, and order actions without changing the underlying flow.

### Editorial spacing and type

[Minimal Gallery](https://minimal.gallery/), [Landbook](https://land-book.com/), [Landingfolio](https://www.landingfolio.com/), [One Page Love](https://onepagelove.com/), [Fonts In Use](https://fontsinuse.com/), and [Brand New](https://www.underconsideration.com/brandnew/) reinforce generous spacing, deliberate type scale, clear content grouping, and fewer competing accents. Agrivive will retain its Manrope and Inter foundation while improving hierarchy, rhythm, and density rather than adding a new font dependency.

### Visual reference organization

[Muzli](https://muz.li/), [Savee](https://savee.it/), [Cosmos](https://cosmos.so/), [Designspiration](https://www.designspiration.com/), [Pinterest](https://www.pinterest.com/), [Dribbble](https://dribbble.com/), and [Behance](https://www.behance.net/) demonstrate searchable visual libraries and strong image-first scanning. Agrivive will borrow the scan-friendly composition and visible grouping, not add an inspiration-library feature to the product.

### Motion and experimental references

[Codrops](https://tympanus.net/codrops/), [Hover States](https://www.hoverstat.es/), [Brutalist Websites](https://brutalistwebsites.com/), [FWA](https://thefwa.com/), [Awwwards](https://www.awwwards.com/), [CSS Design Awards](https://www.cssdesignawards.com/), [CSS Winner](https://www.csswinner.com/), and [CSS Nectar](https://cssnectar.com/) are useful for studying motion, hover feedback, and composition. Agrivive will use motion only for hierarchy, feedback, and state transitions. The marketplace will not receive scroll hijacking, decorative cursor effects, or motion that competes with product discovery.

### Brand and template systems

[Wix Studio Inspiration](https://www.wix.com/studio/inspiration), [Abduzeedo](https://abduzeedo.com/), [Killer Portfolio](https://www.killerportfolio.com/), [Curated](https://www.curated.design/), and [Site of Sites](https://www.siteofsites.co/) are useful for studying brand consistency across navigation, hero, cards, and footer surfaces. Agrivive will use one light visual theme, one green accent family, and a documented radius and shadow rhythm.

## Proposed Agrivive visual direction

### Three design dials

- DESIGN_VARIANCE: 6. The marketplace should feel considered and distinct without making local produce discovery unpredictable.
- MOTION_INTENSITY: 3. Use hover, pressed, focus, loading, and state-change feedback only. Respect reduced motion.
- VISUAL_DENSITY: 4. Keep enough product information visible for comparison while giving the map, imagery, and primary actions room to breathe.

### Palette

- Forest green `#1F4D3A` remains the primary action color.
- Deep pressed green `#17392B` remains the active state.
- Warm field background `#F8F6F1` remains the page surface.
- White remains the elevated content surface.
- Sage `#A8BFA3` remains the supporting accent.
- Terracotta `#C97850` remains reserved for important attention states.

### Layout rules

- Keep the existing routes, navigation labels, search field names, and marketplace URL filters.
- Use a compact sticky header with a clear browse, orders, notifications, cart, and account hierarchy.
- Use a left-aligned marketplace hero with one clear job: help the buyer find produce nearby.
- Keep category chips and filters close to the result count.
- Keep the interactive map and listing results visibly related through common region and proximity.
- Use product imagery as the visual anchor of cards, with seller, price, stock, distance, and action in a consistent order.
- Use larger, quieter surfaces for order details, messages, pickup progress, and QR actions.
- Use full-width stacked layouts below 768px and keep all primary touch targets at least 48px high.

### Interaction rules

- Preserve loading, empty, error, unauthorized, stale-data, and retry states.
- Make active filters visible and removable without requiring recall.
- Use tactile pressed states on buttons without adding continuous animation.
- Keep selected seller state visible in both map and list.
- Keep Google Maps directions as an external action.
- Do not add Google Places, seller-name search, recommendations, or a new marketplace search model.

## Implementation surfaces

The following are the proposed UI-only paths. No backend or API files are part of this redesign.

- `web/src/styles/tokens.css`
- `web/tailwind.config.ts`
- `web/src/components/BuyerSiteHeader.tsx`
- `web/src/components/SiteHeader.tsx`
- `web/src/components/PageContainer.tsx`
- `web/app/page.tsx`
- `web/src/features/auth/components/AuthShell.tsx`
- `web/src/features/marketplace/components/MarketplaceHero.tsx`
- `web/src/features/marketplace/components/MarketplaceBrowser.tsx`
- `web/src/features/marketplace/components/MarketplaceFilters.tsx`
- `web/src/features/marketplace/components/ActiveFilters.tsx`
- `web/src/features/marketplace/components/MarketplaceProductGrid.tsx`
- `web/src/features/marketplace/components/ProductCard.tsx`
- `web/src/features/marketplace/components/ProductDetail.tsx`
- `web/src/features/marketplace/components/SellerStorefront.tsx`
- `web/src/features/marketplace/components/InteractiveSellerMap.tsx`
- `web/src/features/cart/components/CartDrawer.tsx`
- `web/src/features/cart/components/CartRoute.tsx`
- `web/src/features/notifications/components/BuyerNotifications.tsx`
- `web/src/features/orders/components/BuyerOrders.tsx`
- `web/src/features/orders/components/OrderCard.tsx`
- `web/src/features/orders/components/OrderDetail.tsx`
- `web/src/features/orders/components/OrderItemsCard.tsx`
- `web/src/features/orders/components/OrderMessages.tsx`
- `web/src/features/orders/components/OrderPickupStepper.tsx`
- `web/src/features/orders/components/OrderSellerCard.tsx`
- `web/src/features/profile/components/ProfileOrdersSummaryCard.tsx`
- `web/src/features/profile/components/ProfilePersonalCard.tsx`
- `web/src/features/profile/components/ProfileSecurityCard.tsx`
- `web/src/features/orders/components/OrderReviews.tsx`
- `web/src/features/orders/components/OrderReportSuccess.tsx`
- `web/src/features/orders/components/OrderReportModal.tsx`

The approved UI pass kept the existing routes, API contracts, URL filters, map behavior, and buyer workflows intact. It changed only presentation, spacing, hierarchy, state styling, and shared visual tokens in the web buyer experience. The mapping and notification paths listed above were included because they are visible buyer surfaces; no new backend behavior was introduced by this UI pass.

## Implementation completed

The UI pass used the references as pattern research rather than copied code or imagery. The finished work includes:

- Shared warm field surfaces, green action hierarchy, rounded cards, calm shadows, focus states, and restrained pressed/hover feedback in `web/src/styles/tokens.css`, `web/components/ui/button.tsx`, and `web/components/ui/card.tsx`.
- A clearer home entry screen, sticky buyer navigation, compact marketplace search, and signed-in notification entry points in `web/app/page.tsx`, `web/src/components/SiteHeader.tsx`, `web/src/components/BuyerSiteHeader.tsx`, and `web/src/components/MarketplaceHeaderSearch.tsx`.
- Editorial marketplace discovery with a split hero, category chips, filters, active-filter grouping, product cards, map framing, and responsive list/map composition in `web/src/features/marketplace/components/MarketplaceHero.tsx`, `web/src/features/marketplace/components/MarketplaceBrowser.tsx`, `web/src/features/marketplace/components/MarketplaceFilters.tsx`, `web/src/features/marketplace/components/ActiveFilters.tsx`, `web/src/features/marketplace/components/MarketplaceProductGrid.tsx`, `web/src/features/marketplace/components/ProductCard.tsx`, `web/src/features/marketplace/components/InteractiveSellerMap.tsx`, and `web/src/features/marketplace/components/seller-map-popup.ts`.
- More consistent seller, product, auth, cart, notification, and order surfaces in `web/src/features/marketplace/components/SellerStorefront.tsx`, `web/src/features/marketplace/components/ProductDetail.tsx`, `web/src/features/auth/components/AuthShell.tsx`, `web/src/features/notifications/components/BuyerNotifications.tsx`, `web/src/features/cart/components/CartDrawer.tsx`, `web/src/features/orders/components/BuyerOrders.tsx`, `web/src/features/orders/components/OrderCard.tsx`, `web/src/features/orders/components/OrderDetail.tsx`, `web/src/features/orders/components/OrderItemsCard.tsx`, `web/src/features/orders/components/OrderMessages.tsx`, `web/src/features/orders/components/OrderPickupStepper.tsx`, and `web/src/features/orders/components/OrderSellerCard.tsx`.
- Ergonomic 44px+ touch targets on interactive controls (Cart quantity selectors, modal dismiss controls, QR action buttons) and 48px+ primary action buttons per Fitts's Law and Luke Wroblewski's touch guidelines in `web/src/features/cart/components/CartDrawer.tsx`, `web/src/features/profile/components/ProfileOrdersSummaryCard.tsx`, `web/src/features/profile/components/ProfilePersonalCard.tsx`, `web/src/features/profile/components/ProfileSecurityCard.tsx`, `web/src/features/orders/components/OrderReviews.tsx`, `web/src/features/orders/components/OrderReportSuccess.tsx`, and `web/src/features/orders/components/OrderReportModal.tsx`.

The UI decisions apply the repository standards: Jakob Nielsen's Jakob's Law and Recognition Over Recall for familiar marketplace and inbox patterns; Nielsen's Visibility of System Status for loading, stale, and error states; Paul Fitts's Law and Luke Wroblewski's mobile-first ergonomics for touch targets; Gestalt Proximity and Common Region for grouping filters, maps, product results, and order sections; Miller's Law through bounded seller and order summaries; Caroline Jarrett and Gerry Gaffney's inline validation guidance for user-facing errors; and Dieter Rams's principle of restraint through one primary accent and limited motion.

## Compact density follow-up

The owner reported that the filter panel and product cards were too tall in the rendered marketplace. The follow-up keeps the same marketplace behavior while tightening the visual density:

- `web/src/features/marketplace/components/MarketplaceFilters.tsx` now uses a responsive grid so filter groups hold stable columns instead of wrapping the nearby pickup controls into an oversized second row. The location action stays on one line and the radius control keeps a bounded width.
- `web/src/features/marketplace/components/ProductCard.tsx` now uses a shorter image frame, tighter card header/content/footer spacing, and content-driven height instead of stretching the body with `flex-1`.
- `web/src/features/marketplace/components/ProductImage.tsx` no longer applies a minimum fallback height that could override the shorter card image frame.
- `web/src/features/marketplace/components/MarketplaceProductGrid.tsx` uses shorter loading placeholders that match the finished card proportions.

This follow-up applies Uizze's Polish guidance, Gestalt Proximity, Paul Fitts's touch-target guidance, and Miller's Law through smaller, more scannable product summaries. It does not change filters, URL parameters, map behavior, product data, or cart actions.

## Active navigation follow-up

The owner reported that the marketplace navigation always showed `Browse produce` as the active item, even after selecting a category or opening Orders. The shared buyer header now derives active state from the current path and `productType` URL parameter:

- `web/src/components/BuyerSiteHeader.tsx` marks `All listings` active for the unfiltered marketplace, the matching produce category active for `?productType=...`, and `Orders` active for `/orders` and order-detail routes.
- Desktop and mobile navigation now expose the same active state with `aria-current="page"` and the existing primary/ghost button variants.
- The `useSearchParams()` lookup is isolated behind a Suspense boundary with a lightweight header fallback so static routes such as `/profile` continue to build successfully.

No navigation destination, query parameter, or buyer workflow changed.

## Duplicate category navigation follow-up

The owner noted that the header and marketplace page both showed produce category controls. The page-level `Browse by produce` heading and chip row were removed from `web/src/features/marketplace/components/MarketplaceBrowser.tsx`. The persistent `web/src/components/BuyerSiteHeaderNav.tsx` category navigation remains the single produce-category entry point. The result count and filter controls remain on the marketplace page.

This changes presentation only; `productType` URLs, active navigation state, filtering behavior, and marketplace results are unchanged. The change follows Jakob Nielsen's Jakob's Law by keeping one familiar category navigation pattern and Gestalt Proximity by keeping filters and results together without a repeated control group.

## Reference list

1. [Muzli](https://muz.li/)
2. [Landing Picks](https://www.landingpicks.com/)
3. [Maxi Best Of](https://maxibestof.one/)
4. [Site of Sites](https://www.siteofsites.co/)
5. [Landbook](https://land-book.com/)
6. [One Page Love](https://onepagelove.com/)
7. [CSS Design Awards](https://www.cssdesignawards.com/)
8. [Unsection](https://www.unsection.com/)
9. [Minimal Gallery](https://minimal.gallery/)
10. [Godly](https://godly.website/)
11. [Lapa Ninja](https://www.lapa.ninja/)
12. [Landings](https://landings.dev/)
13. [Landing Folio](https://www.landingfolio.com/)
14. [Killer Portfolio](https://www.killerportfolio.com/)
15. [CSS Winner](https://www.csswinner.com/)
16. [FWA](https://thefwa.com/)
17. [Commerce Cream](https://commercecream.com/)
18. [Ecomm Design](https://ecomm.design/)
19. [Awwwards](https://www.awwwards.com/)
20. [CSS Nectar](https://cssnectar.com/)
21. [Webdesign-Inspiration](https://www.webdesign-inspiration.com/)
22. [Brutalist Websites](https://brutalistwebsites.com/)
23. [Hover States](https://www.hoverstat.es/)
24. [Wix Inspiration](https://www.wix.com/studio/inspiration)
25. [Codrops](https://tympanus.net/codrops/)
26. [Abduzeedo](https://abduzeedo.com/)
27. [Fonts In Use](https://fontsinuse.com/)
28. [Brand New](https://www.underconsideration.com/brandnew/)
29. [Dribbble](https://dribbble.com/)
30. [Behance](https://www.behance.net/)
31. [Pinterest](https://www.pinterest.com/)
32. [Savee](https://savee.it/)
33. [Cosmos](https://cosmos.so/)
34. [Design Inspiration](https://www.designspiration.com/)
35. [Showit Store](https://store.showit.com/)
36. [Webflow Templates](https://webflow.com/templates)
37. [Curated Design](https://www.curated.design/)
38. [Squarespace Templates](https://www.squarespace.com/templates)

The Brand New and Squarespace links were normalized from the shortened URLs in the request so the note contains usable destinations.

## Research access notes

The public pages were reviewed on 2026-10-03. Some sites expose only partial content to automated browsing, require JavaScript, redirect to a new host, or return an access error. They remain useful as reference destinations, but the implementation is based only on patterns that were observable and appropriate for Agrivive.

## Product card height 80, grid width, and buyer typography enhancement (2026-10-03)

### What changed and why
- **ProductCard height 80 (`h-80` / 320px)**: Set card fixed height to `h-80` (`h-[20rem]` = 320px) with `h-32` image container, non-colliding category and availability badges, balanced 1-line title, and 44px "Add to cart" CTA (`ProductCard.tsx`).
- **Product grid 2-column layout & skeleton matching (`MarketplaceProductGrid.tsx`)**: Replaced cramped 3-column grid (`xl:grid-cols-3`) with a clean 2-column grid (`grid-cols-1 sm:grid-cols-2`). Beside the interactive map on desktop, this expands card width from ~180px to ~280-300px, eliminating price and stock line wrapping. Updated skeleton loaders to matching `h-80 rounded-[18px]`.
- **Pricing typography scaling (`MarketplacePrice.tsx`)**: Balanced card price display to `text-base font-bold sm:text-lg` with `text-xs` unit (`/{unit}`) and compact old price, preventing wrapping on sale items.
- **Product image fallback padding (`ProductImage.tsx`)**: Reduced placeholder container padding from `p-6` to `p-3` with `size={18}` icon to fit compactly within `h-32`.
- **Modular question inquiries list (`ProductInquiriesList.tsx` & `ProductQuestionsSection.tsx`)**: Extracted previous inquiries list into `ProductInquiriesList.tsx` (66 lines) to bring `ProductQuestionsSection.tsx` from 221 lines down to 152 lines, strictly obeying the repository's 200-line limit. Upgraded send CTA to 48px height (`min-h-12`).
- **Product reviews card refinement (`ProductReviewsSection.tsx`)**: Applied rounded-20px surfaces (`rounded-[20px]`), warm subtle shadows (`shadow-xs`), and 44px button touch targets.
- **Header ergonomics & touch targets (`BuyerSiteHeader.tsx`)**: Upgraded all interactive icon buttons (cart, profile, login, signup, mobile menu toggle) to 44×44px minimum touch targets (`size-11 min-h-11 min-w-11`), adhering to Fitts's Law.
- **Hero CTA streamlining (`web/app/page.tsx`)**: Focused hero action row into a prominent primary "Browse marketplace" button and secondary "Sign in", with unobtrusive "Create a free account" helper link below, adhering to Hick-Hyman Law and Von Restorff effect.

### Affected file paths
- `web/src/features/marketplace/components/ProductCard.tsx` (150 lines)
- `web/src/features/marketplace/components/MarketplaceProductGrid.tsx` (87 lines)
- `web/src/features/marketplace/components/MarketplacePrice.tsx` (43 lines)
- `web/src/features/marketplace/components/ProductImage.tsx` (23 lines)
- `web/src/features/marketplace/components/ProductQuestionsSection.tsx` (152 lines)
- `web/src/features/marketplace/components/ProductInquiriesList.tsx` (66 lines)
- `web/src/features/marketplace/components/ProductReviewsSection.tsx` (137 lines)
- `web/src/components/BuyerSiteHeader.tsx` (185 lines)
- `web/app/page.tsx` (59 lines)

## Orders page design layout enhancement (2026-10-03)

### What changed and why
- **Reference Layout Applied (`media_1790979751866.png`)**: Applied the clean e-commerce order management layout to the buyer's orders page (`/orders`).
- **All Orders Header & Action (`BuyerOrders.tsx`)**: Formatted header with "All Orders" title, clear descriptive subtitle ("Check all orders and reservations at a single place. It's easy to manage."), and high-contrast "Browse marketplace" CTA button.
- **Underline Tabs Navigation (`OrderFilterTabs.tsx`)**: Extracted and rendered horizontal tabs with bottom active indicator lines and counter badges: `All order ({counts.all})`, `Processing ({counts.pending})`, `Completed ({counts.completed})`, and `Canceled ({counts.archived})`.
- **Search & Sort Toolbar (`BuyerOrders.tsx`)**: Built live search input with magnifying glass icon for querying orders by ID, produce name, or status, alongside a sort dropdown ("New Order", "Oldest Order", "Highest Amount", "Lowest Amount").
- **Table Column Header Strip (`BuyerOrders.tsx`)**: Added desktop-visible column header strip matching the order row columns: `Product`, `Price`, `Payment`, `Status`, and `Action`.
- **Order Card Container (`OrderCard.tsx`)**: Styled each order in a distinct white card (`rounded-[18px] border border-border/80 bg-white shadow-xs p-5`) with:
  - Top metadata strip: Checkbox, Market Stall attribution, Date of Order, and Order ID (`AGR-[ID]`).
  - Dashed separator line: `border-t border-dashed border-border/70 my-3.5`.
  - Column aligned body: Product details, formatted total price, payment method ("Cash on pickup / Pay at market stall"), status pill badge, and actions.
- **Product Row & Expandable Accordion (`OrderCardItems.tsx`)**: Created modular items component showing primary product thumbnail and specs, with an interactive "Show more (N items) v" / "Show less ^" toggle for multi-item orders.
- **Soft Tinted Status Badges (`OrderStatusBadge.tsx`)**: Implemented soft-tinted pill badges matching the reference mockup (amber for pending, emerald for completed, rose for cancelled, muted gray for expired) with subtext notes ("Please pick up before [Date/Time]").
- **Ergonomic Action Buttons (`OrderCard.tsx`)**: Provided a 44px primary action button ("View Pass" with QR icon for pending pickups; "View details" for completed orders) and a secondary "Cancel Order" action (active for pending, disabled light-gray button for closed orders).

### Affected file paths
- `web/src/features/orders/components/OrderStatusBadge.tsx` (34 lines)
- `web/src/features/orders/components/OrderCardItems.tsx` (67 lines)
- `web/src/features/orders/components/OrderCard.tsx` (107 lines)
- `web/src/features/orders/components/OrderFilterTabs.tsx` (44 lines)
- `web/src/features/orders/components/BuyerOrders.tsx` (174 lines)

## Product card reference design layout enhancement (2026-10-03)

### What changed and why
- **Reference Layout Applied (`media_1790980433577.png`)**: Applied the modern e-commerce product card layout to [`ProductCard.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/marketplace/components/ProductCard.tsx).
- **Hero Image with Top Badges & Save Action**:
  - Top-left dynamic discount pill (`${discountPct}% OFF` in terracotta) when base price > current price; otherwise category badge (`VEGETABLES`).
  - Top-right floating heart/save button with terracotta accent (`Heart` icon with toggle state and stall selection).
- **Category & Stall Kicker**: Formatted above the title in bold uppercase tracking text (`productType` · `shopName`).
- **Typography & Price**: Clamped single-line bold title, bold current price (`₱`), struck-through original price, unit (`/kg`), and stock remaining counter.
- **Split Action & Stepper Control (`ProductCardAction.tsx`)**:
  - When not in cart: High-contrast 44px primary `ADD TO CART` button (with `ShoppingBag` icon) paired with a 44×44px square `MapPin` button to highlight the stall on the interactive map.
  - When in cart: Seamlessly transitions to an interactive `[-] {quantity} [+]` stepper with real-time cart synchronization directly from the card.
- **Strict $\le 200$ Line Compliance**: Extracted the split action and stepper logic into [`ProductCardAction.tsx`](file:///c:/Users/Arianne%20Bartiquien/Desktop/Agrivive/web/src/features/marketplace/components/ProductCardAction.tsx) (91 lines), keeping `ProductCard.tsx` at 154 lines.
- **Card Height**: Maintained strictly at `h-80` (320px) without any vertical overflow or text truncation issues.

### Affected file paths
- `web/src/features/marketplace/components/ProductCard.tsx` (154 lines)
- `web/src/features/marketplace/components/ProductCardAction.tsx` (91 lines)

## Seller map popup UI/UX standards & accessibility overhaul (2026-10-03)

### What changed and why
- **Color Contrast & Brand Similarity (`tokens.css` & `seller-map-popup.ts`)**:
  - Eliminated Leaflet's default blue link color leak (`.leaflet-popup-content a { color: #0078A8; }`) by setting global override in `tokens.css` and explicit inline `!text-white` / `!text-agrivive-primary` in `seller-map-popup.ts`.
  - Replaced non-brand `bg-emerald-900` with Agrivive primary Forest Green `#1F4D3A` (`bg-agrivive-primary`), restoring WCAG AAA contrast ratio.
- **Ergonomics & Fitts's Law (`seller-map-popup.ts`)**:
  - Upgraded both action buttons from `min-h-10` (40px) to `h-11 min-h-[44px]` (44px touch target) for mobile thumb accessibility per Fitts's Law and Luke Wroblewski's guidelines.
- **Plain User-Facing Words (`seller-map-popup.ts`)**:
  - Replaced technical seller-centric copy (`"View seller"` and `"${count} matching listings"`) with plain 5-year-old friendly language: **`"View stall"`** and **`"${count} fresh items"`**.
- **Gestalt Common Region & Figure-Ground (`tokens.css`)**:
  - Styled Leaflet popup container with Agrivive surface tokens: `rounded-[18px]`, crisp 1px border (`#E5E2DA`), warm cream background, soft elevation shadow (`0 16px 36px -6px rgba(31,77,58,0.14)`), and circular rounded close button.

### Affected file paths
- `web/src/features/marketplace/components/seller-map-popup.ts` (66 lines)
- `web/src/styles/tokens.css` (96 lines)

## Verification performed

- `cd web && bunx tsc --noEmit` -> Passed cleanly (exit code 0).
- `cd web && bun run build` -> Passed cleanly (exit code 0; 14/14 static and dynamic routes compiled and generated successfully).
- `cd backend && bunx tsc --noEmit` -> Passed cleanly (exit code 0).
- `cd backend && bun build src/index.ts --outdir dist --target bun` -> Passed cleanly (bundled 1557 modules in 408ms).
- Verified line counts: Every single modified and created file strictly complies with the repository limit of 200 lines or fewer (`seller-map-popup.ts` is 66 lines; `tokens.css` is 96 lines).

## Remaining owner acceptance

- Open `/marketplace` and click any stall pin on the interactive map.
- Verify popup appearance:
  - Stall name in bold Forest Green `#1F4D3A`.
  - Soft green chip showing produce count in plain words (e.g. "4 fresh items").
  - Clean distance badge with map pin icon.
  - "View stall" primary CTA in Forest Green with crisp white text (no blue link leak).
  - "Directions" secondary button in white with crisp `#1F4D3A` text and `#E5E2DA` border.
  - Rounded `18px` corners and smooth card shadow.

No commit was created, so there is no commit hash or commit message to record yet.



