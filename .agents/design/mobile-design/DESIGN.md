# Agrivive Mobile Design System

## Scope

This guide applies to the **seller mobile app only**. Agrivive helps Davao City vegetable sellers list marketable surplus, manage available stock, respond to reservations, and confirm self-pickup. Design for React Native on Android 10+ and a 360 px wide reference screen. The `mobile/` directory currently holds design assets; this document is the reference for future mobile screens.

The visual direction is calm, natural, minimal, and professional. Keep primary tasks easy to scan at a market stall, including on smaller phones. Use restrained color, generous whitespace, clear labels, and familiar mobile controls. Avoid heavy shadows, crowded layouts, excessive gradients, overly rounded controls, and large decorative graphics outside onboarding.

## Brand Assets

Use `agrivive-logo-full.png` where the wordmark and tagline have room to remain legible, such as onboarding. Use `agrivive-logo-icon.png` for compact placements such as a splash mark. Preserve their proportions and original colors; do not redraw the mark from a generated mockup. `seller-onboarding-concept-v2.png` is a visual reference, not an implementation asset.

## Canonical Color Tokens

The supplied draft includes two different palettes. Use **this table** as the mobile source of truth; it follows the explicit palette and component rules in the draft. Do not mix in the alternate YAML colors.

| Token | Value | Use |
|---|---|---|
| `primary` | `#1F4D3A` | Main buttons, active navigation, key icons |
| `primaryPressed` | `#17392B` | Pressed primary controls |
| `background` | `#F8F6F1` | Screen background |
| `surface` | `#FFFFFF` | Cards, fields, sheets, navigation |
| `text` | `#202622` | Titles and body text |
| `textMuted` | `#6F776F` | Supporting text and metadata |
| `sage` | `#A8BFA3` | Soft accents and tags |
| `terracotta` | `#C97850` | Occasional promotion highlights |
| `border` | `#E5E2DA` | Dividers and input outlines |
| `success` / `warning` / `error` | `#3F7D58` / `#C7953E` / `#B85450` | Meaningful status only |

Use white text on primary buttons. Pair every status color with a text label or icon. Use terracotta sparingly; it must not imply a produce quality or food-safety judgment.

## Typography and Spacing

Use **Manrope** for screen and section headings and **Inter** for body text, labels, inputs, prices, and buttons. In React Native, use platform font fallbacks if the font files are unavailable. Use these sizes as density-independent layout values:

| Role | Size | Weight | Line height |
|---|---:|---:|---:|
| Screen title | 28 | 700 | 34 |
| Section heading | 22 | 600–700 | 28 |
| Card title | 18 | 600 | 24 |
| Body | 16 | 400 | 24 |
| Label / metadata | 14 | 400–600 | 20 |
| Caption | 12 | 400 | 16 |

Keep important explanatory text at least 14. Support system text scaling and wrapping. Use a 4 px spacing grid with 16 px horizontal screen padding, 16 px card padding, 24–32 px between sections, and 8–12 px between related elements. Preserve Android status-bar, navigation-bar, and keyboard safe areas.

## Components

- **Buttons:** One dominant action per screen or task. Primary buttons use `primary`, white text, 10 px radius, and at least 48 px height. Secondary actions use an outline or text treatment. Destructive actions use `error` only when they have real consequences.
- **Fields:** White fill, `border` outline, 10 px radius, at least 48 px height, and persistent visible labels. Show validation beside the relevant field and explain how to correct it.
- **Cards:** White surface, light border, 12 px radius, and 16 px padding. Group related facts through spacing; use only subtle elevation when separation is needed.
- **Images:** Use consistent 1:1 or 4:3 crops for produce photos with 10–12 px corners. Keep condition, price, unit, and quantity as readable text outside the photo.
- **Chips and badges:** Use compact pills for status and filters. Include a text label such as `Available`, `Reserved`, or `Completed`; never rely on color alone.
- **Sheets and dialogs:** Use white surfaces and 16 px corners. A bottom sheet handles one short action; use a full screen for longer forms or QR scanning.
- **Icons:** Use one consistent rounded outline family at 20–24 px. Every icon-only control needs an accessible label and a minimum 44 × 44 px touch target.

## Seller Navigation and Screens

Keep primary navigation focused on **Home, Listings, Reservations, Insights, and Profile**. Put **Add listing** in a prominent reachable action on Home and Listings. Make **Scan QR** visible from the reservation or pickup flow, where its purpose is clear.

1. **Onboarding and sign-in:** State the seller value clearly, then guide registration and required verification. Use the supplied full logo. Keep each step short and show progress only for a real multi-step flow.
2. **Home:** Summarize active listings, available and reserved stock, upcoming pickups, and one next action. Avoid dense analytics on the first screen.
3. **Create or edit listing:** Collect vegetable, current photo, seller-declared condition, price, unit, quantity, availability, and pickup details. Group the form into short sections and preserve a draft when practical.
4. **Listings:** Show photo, name, current price and unit, available quantity, and listing state. Make stock and price edits easy to find; confirm consequential changes.
5. **Reservations and pickup:** Show buyer reservation details, quantity, status, and pickup instructions. Scan and validate the active QR code before the seller confirms handover. Explain invalid, expired, cancelled, or reused codes with a recovery action.
6. **Insights and advisories:** Present posted, reserved, sold, expired, and remaining quantities with clear time periods. Label any storage or weather guidance as advisory; never claim the app has certified freshness or safety.
7. **Profile:** Show seller identity, shop, contact and pickup location, verification state, settings, and support.

## Interaction and Accessibility

Use one clear primary action in each context. Confirm taps immediately; show loading, success, or a useful error when a network action takes time. Keep layout stable with skeletons for longer loads. Use 150–250 ms transitions only where they clarify a state change. Preserve entered data through recoverable errors and avoid duplicate submissions.

Design explicit empty, offline, permission-denied, sold-out, and expired-reservation states. Use short, plain language and one recovery action. Maintain readable contrast, support text scaling, and keep interactive targets at least 44 × 44 px. Test the seller journey at 360 px width with the keyboard open and with larger system text.

## Review Checklist

Before approving a screen, check that the seller can identify the screen, the most important information, and the next action at a glance. Check that quantities, units, prices, reservation states, and pickup actions are unambiguous. Verify the screen uses these mobile tokens, the supplied logo assets, safe areas, readable text, accessible touch targets, and a useful loading or error state.
