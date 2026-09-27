# Agrivive Buyer Web Design System

## Scope

This guide defines the buyer website experience. It adapts the Agrivive mobile brand system for responsive web layouts.

The buyer website supports public marketplace browsing. Buyers may save products to a local cart as guests, then sign in before reserving them. Direct Buy Now remains available for one product; Cart checkout can reserve products from multiple stores together.

Reference viewport: 1366 × 768.
Responsive targets: 1024px tablet and 640px phone.

## Brand assets

Use:

- `web/public/brand/agrivive-logo-full.png` where the wordmark has room.
- `web/public/brand/agrivive-logo-icon.png` for compact navigation and small screens.

Preserve the supplied logo proportions and colors. Do not redraw the logo.

## Color tokens

| Token | Value | Use |
|---|---|---|
| `primary` | `#1F4D3A` | Main actions, links, active navigation |
| `primaryPressed` | `#17392B` | Pressed and focused primary controls |
| `background` | `#F8F6F1` | Page background |
| `surface` | `#FFFFFF` | Cards, panels, fields, dialogs |
| `text` | `#202622` | Headings and body text |
| `textMuted` | `#6F776F` | Supporting text and metadata |
| `sage` | `#A8BFA3` | Soft accents and filter tags |
| `terracotta` | `#C97850` | Small promotional accents |
| `border` | `#E5E2DA` | Borders and dividers |
| `success` | `#3F7D58` | Completed and available states |
| `warning` | `#C7953E` | Pending and attention states |
| `error` | `#B85450` | Failed, cancelled, and destructive states |

Status colors must always be paired with text or an icon.

## Typography

- Headings: Manrope, with a system fallback.
- Body, labels, prices, and buttons: Inter, with a system fallback.
- Page title: 32px / 40px, weight 700.
- Section title: 24px / 32px, weight 700.
- Card title: 18px / 24px, weight 600.
- Body: 16px / 24px.
- Label and metadata: 14px / 20px.
- Caption: 12px / 16px.

## Spacing and sizing

Use a 4px spacing grid.

- Page content max width: 1200px.
- Desktop page padding: 32px.
- Tablet page padding: 24px.
- Phone page padding: 16px.
- Card padding: 16px or 24px.
- Section spacing: 24px to 40px.
- Button and field minimum height: 48px.
- Icon-only controls: minimum 44 × 44px.
- Card radius: 12px.
- Field and button radius: 10px.

## Web navigation

Use a desktop header with:

- Agrivive logo.
- Marketplace link.
- Orders link for authenticated buyers.
- Sign in and Create account for guests; a Profile menu for authenticated buyers.
- A visible primary action only when it has a clear purpose.

The header must be session-aware. While the session is loading, reserve the account area with a quiet loading state. When a session exists, hide guest actions and show the buyer's name or email, Orders, and Sign out. Signing out returns to the public marketplace.

On phone widths, collapse secondary links into a menu. Do not use the seller mobile bottom-tab navigation on the buyer website.

## Icon system

Use `lucide-react` as the only general-purpose icon library on the buyer website.

- Use icons as signifiers beside familiar text, not as a replacement for important labels.
- Use `aria-hidden="true"` for decorative icons and an accessible name on icon-only buttons.
- Keep icon-only controls at least 44px by 44px and keep primary controls at least 48px high.
- Use a consistent 16px icon size for inline actions, 18px for compact navigation, and 20px to 24px for prominent controls.
- Use the same icon for the same concept: `Search` for search, `MapPin` for location, `RefreshCw` for retry, `ArrowLeft` for back, `Menu`/`X` for mobile navigation, and `Eye`/`EyeOff` for password visibility.
- Pair status icons with text and color; never make color or an icon the only status signal.
- Do not add decorative icons that compete with product names, prices, pickup details, or the Buy Now action.
- Prefer Lucide stroke icons over emoji, text glyphs, or one-off SVGs for controls and navigation.

## Marketplace patterns

The marketplace page follows the structural reference documented in [`DESIGN-LAYOUT.md`](./DESIGN-LAYOUT.md#marketplace-reference-layout): a quiet two-level header, result/sort toolbar, persistent desktop filter rail, and responsive product grid. The reference screenshot is a hierarchy and spacing aid only; Agrivive keeps its own palette, type, produce content, direct Buy Now flow, and multi-store cart checkout.

Product cards show:

- Produce photo when available.
- Product name.
- Current price and unit.
- Available quantity.
- Seller or shop name.
- Pickup location or area.
- Listing state such as Available or Sold out.

Product detail pages show:

- Product image and name.
- Current price, unit, and available quantity.
- Seller details.
- Pickup instructions and location.
- Reservation quantity.
- Buy Now action.
- Sign-in prompt when the buyer is not authenticated.

Only show products that are active, marketable, priced, and available.

## Cart and multi-store checkout

- Show a persistent Cart link and item count in the shared buyer header.
- Allow guests to add products to the cart; keep cart contents through refresh and authentication with versioned local storage.
- Group cart items by store and show each store name, pickup area, items, subtotal, and the shared grand total.
- Keep `Add to cart` secondary to the direct `Buy now` action on product details.
- Checkout creates one seller order per store under one checkout; each seller receives and scans only that store's order QR code.
- Treat backend stock and current prices as authoritative. If an item changed, identify the conflict, keep the cart, and let the buyer review and retry.
- Clear the cart only after checkout succeeds. Payment remains direct at pickup.

## Authentication patterns

Login, sign-up, email verification, and two-factor verification use:

- One clear form heading.
- Persistent visible labels.
- Inline field errors below the affected field.
- A form-level message for network or service failures.
- A single primary action.
- Links to related authentication actions.
- Keyboard-friendly focus order.
- Password visibility controls with accessible labels.

## Authentication visual direction

Authentication uses a quiet marketplace editorial layout.

- Page background: `#F8F6F1`.
- Auth shell: white, maximum width 1180px, 24px to 32px outer padding, 24px radius.
- Desktop shell: form column on the left and a produce-market image panel on the right.
- Form column: 420px maximum reading width, left aligned, generous vertical spacing.
- Image panel: tall crop, 18px radius, `object-cover`, with a small dark overlay label.
- Use `web/public/brand/buyer-market-auth.png` for the buyer visual panel.
- Login and sign-up share the shell but use different headings and supporting copy.
- Do not show social login buttons until matching backend providers exist.
- On widths below 900px, hide the image panel and keep the form centered.
- Keep the primary action full width and at least 48px high.
- Keep field errors directly below their field or in a form alert above the first field.
- Preserve entered values after failed requests.

## Interaction and accessibility

- Use semantic headings, landmarks, buttons, and links.
- Keep keyboard focus visible.
- Do not rely on color alone.
- Respect browser zoom and text scaling.
- Preserve entered form values after recoverable errors.
- Announce loading and error changes where appropriate.
- Use 150–250ms transitions only when they clarify a state change.
- Avoid excessive shadows, gradients, decorative motion, and crowded layouts.

## Required states

Every data-driven screen must define:

- Loading.
- Empty results.
- Offline or connection failure.
- Retry.
- Unauthorized or verification required.
- Sold out or unavailable.
- Success confirmation.
- Validation errors.

Each error state must explain the problem in plain language and provide one clear recovery action.

## Order status polling

- Refresh an active pending buyer order every 15 seconds while its detail page is open.
- Pause requests when the browser tab is hidden and refresh when it becomes visible again.
- Back off network retries to 30 seconds, then up to 60 seconds; keep the current order visible during refresh.
- Stop polling after completed, cancelled, or expired status, and stop for unauthorized or missing orders.
- Show a quiet last-updated time and a small refresh error; do not replace an existing order with a full-page loader.

## Buyer flow

1. Browse marketplace publicly.
2. Search or filter listings.
3. Open a product detail page.
4. Sign in or create a buyer account when reserving.
5. Add one or more products to the Cart, or use one-item Buy Now.
6. Sign in before reserving, if needed.
7. View each seller order and its QR reservation.
8. Cancel when an order is still pending.

## UX laws and application rules

These principles are the shared decision rules for the buyer website. They are grouped for practical use; they are not a reason to add extra controls or decoration. The highest-priority rules for Agrivive are familiarity, clear hierarchy, low cognitive load, fast feedback, error recovery, responsive layout, accessibility, and performance.

### Familiarity, choice, and effort

1. **Jakob's Law:** use familiar logos, top navigation, forms, and links.
2. **Fitts's Law:** make primary actions large and keep related targets spaced apart.
3. **Hick's Law:** reduce unnecessary choices and competing actions.
4. **Miller's Law:** group information into small, memorable sections.
5. **Tesler's Law:** let the system handle unavoidable complexity.
6. **Postel's Law:** accept forgiving input while returning consistent output.
7. **Parkinson's Law:** keep simple actions short.
8. **Pareto Principle:** prioritize browsing, reservation, and pickup tasks.
9. **Occam's Razor:** choose the simplest design that solves the user's problem.
10. **Least Effort Principle:** reduce typing, clicking, and repeated navigation.
11. **Don't Make Me Think:** make the purpose and next action obvious.
12. **Recognition Over Recall:** show labels, navigation, defaults, and visible choices.

### Grouping, hierarchy, and visual structure

13. **Aesthetic-Usability Effect:** use deliberate typography, spacing, and alignment to improve perceived usability.
14. **Von Restorff Effect:** reserve contrast for the primary CTA, warnings, and important statuses.
15. **Serial Position Effect:** place key navigation and actions at the beginning or end of a group.
16. **Law of Proximity:** keep labels close to their fields and related controls together.
17. **Law of Similarity:** give similar actions consistent styles.
18. **Law of Common Region:** use cards and panels to show related content.
19. **Law of Uniform Connectedness:** use borders, backgrounds, and dividers to show relationships.
20. **Law of Prägnanz:** keep layouts easy to scan and visually simple.
21. **Law of Continuity:** align content so the eye follows a predictable path.
22. **Law of Closure:** use simplified, complete-looking marks for logos and icons.
23. **Figure-Ground Principle:** separate foreground content from the cream page background.
24. **Symmetry Principle:** keep panels and columns balanced.
25. **Visual Hierarchy:** make the product, price, status, and primary action dominate secondary metadata.
26. **Whitespace Principle:** use empty space to separate groups and prevent clutter.
27. **Typography Hierarchy:** distinguish titles, sections, labels, body text, and captions.
28. **Readable Line Length:** keep explanatory text comfortable to read.
29. **Scannability:** use short paragraphs, descriptive headings, and meaningful emphasis.
30. **Content-First Design:** size layouts around real product and seller content.

### Feedback, status, and recovery

31. **Doherty Threshold:** respond quickly with skeletons, progress, or immediate button feedback.
32. **Zeigarnik Effect:** show progress when a task is incomplete, such as verification.
33. **Peak-End Rule:** make reservation success, QR display, and recovery states clear and reassuring.
34. **Goal-Gradient Effect:** show progress when a multi-step flow exists.
35. **Feedback Principle:** every action receives visible feedback.
36. **Visibility of System Status:** show loading, completed, failed, offline, and expired states.
37. **Feedback Near Action:** place errors and success messages beside the action that caused them.
38. **Confirmation Principle:** clearly confirm successful reservations and verification.
39. **Loading-State Principle:** never leave users wondering whether a click worked.
40. **Responsive Feedback:** distinguish hover, active, disabled, focus, loading, success, and error states.
41. **Error Prevention:** disable impossible actions, validate early, and explain requirements.
42. **Error Recovery:** offer retry, back, cancel, or a useful next destination.
43. **Forgiving Design:** support mistypes, refreshes, connection loss, and changed decisions.
44. **Empty-State Principle:** explain what an empty screen means and what to do next.
45. **No Dead Ends:** every screen offers a useful next action.

### Navigation, information architecture, and progressive disclosure

46. **Progressive Disclosure:** show essential information first and advanced filters only when needed.
47. **Progressive Onboarding:** explain features where users encounter them.
48. **Navigation Consistency:** keep users oriented and provide a clear way back.
49. **Responsive Navigation:** preserve information architecture when navigation collapses on mobile.
50. **Information Scent:** name links and buttons by the destination or result.
51. **Information Architecture:** organize by buyer mental models, not database tables.
52. **Search Visibility:** keep marketplace search easy to find.
53. **Recognition in Navigation:** use plain labels such as Marketplace, Orders, and Sign in.
54. **Breadcrumb Principle:** provide a back path on product and order detail pages.
55. **Choice Architecture:** group filters and show meaningful differences.
56. **Mapping Principle:** place filters near the listings they change.
57. **Default Effect:** use safe defaults such as newest-first and a 10 km location radius.
58. **Constraints Principle:** prevent quantities above available stock and invalid ranges.
59. **Primary Action Principle:** make one main action obvious per screen.
60. **CTA Clarity:** describe the result, such as Create account, Verify email, and Buy now.

### Forms and accessible interaction

61. **Match Between System and Real World:** use buyer language such as reservation, pickup, and product.
62. **Form Clarity:** use visible labels, requirements, and plain validation messages.
63. **Inline Validation:** place field errors next to the affected input.
64. **Affordance Principle:** make inputs editable and buttons clickable by appearance.
65. **Signifiers:** use labels, focus rings, underlines, and clear menu controls.
66. **User Control and Freedom:** preserve entered values and allow back, cancel, and retry.
67. **Keyboard Accessibility:** make every important action keyboard-operable.
68. **Focus Visibility:** keep a strong, visible focus indicator.
69. **Semantic HTML:** use headings, labels, buttons, links, landmarks, and fieldsets correctly.
70. **Accessibility Principle:** support visual, motor, auditory, and cognitive access needs.
71. **Don't Rely on Color Alone:** pair status color with text or an icon.
72. **Touch Target Principle:** keep interactive controls at least 44px, with primary actions at least 48px.
73. **Contrast Principle:** maintain readable contrast for text, controls, errors, and focus.
74. **Consistency Principle:** keep terminology, controls, spacing, and behavior consistent.
75. **Similarity vs. Contrast:** make different actions visually different, especially destructive actions.
76. **Destructive Action Protection:** require deliberate cancellation and explain its effect.

### Responsive, resilient, and user-centered delivery

77. **Responsive Design:** adapt layout for phones, tablets, laptops, and large monitors.
78. **Mobile-First Design:** prioritize essential content and actions on small screens.
79. **Cognitive Load Principle:** use defaults, grouping, and automation to reduce thinking.
80. **Chunking:** break signup, verification, filters, and order detail into clear groups.
81. **Minimalist Design:** remove elements that do not help users complete their goal.
82. **Performance Is UX:** keep images, scripts, requests, and rendering efficient.
83. **Perceived Performance:** use skeletons and immediate state changes while work continues.
84. **Design for Edge Cases:** cover loading, empty, offline, retry, unauthorized, expired, sold-out, and long-text states.
85. **User-Centered Design:** design around what a buyer is trying to accomplish.
86. **Consistency Over Creativity:** familiar interactions take priority over novelty.
87. **Primary Action Protection:** do not let secondary actions compete with the main task.
88. **Confirmation and Completion:** make verification, reservation, and cancellation outcomes explicit.
89. **Responsive Feedback and Recovery:** ensure every state has a readable explanation and recovery path.
90. **Continuous Review:** use these laws as a checklist during design review rather than forcing every law onto every screen.

### Screen application checklist

- **Login, signup, and verification:** familiar home link, one primary action, visible labels, password guidance, inline errors, loading/disabled feedback, preserved `next` destination, and a clear recovery path.
- **Marketplace:** visible search, grouped filters, newest-first result feedback, constrained quantities, clear empty/offline/retry states, explicit product-card destination, and responsive filter disclosure.
- **Product detail:** product and pickup information first, one obvious Buy now action, stock-based quantity constraints, signed-image fallback, and conflict/sold-out feedback near the action.
- **Orders:** status text in addition to color, clear order-to-detail links, active QR only when valid, cancellation protection, and useful next actions for every state.
