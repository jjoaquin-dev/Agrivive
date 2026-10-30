# Agrivive Buyer Web Layout Guide

## Desktop shell

```text
┌──────────────────────────────────────────────────────────────┐
│ Agrivive      Marketplace      Orders          Sign in        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Page content max-width: 1200px                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Use a centered content container with a maximum width of 1200px. Keep the header visible while browsing.

## Marketplace page

```text
┌──────────────────────────────────────────────────────────────┐
│ Browse fresh surplus                                         │
│ Search produce or seller                         [Search]     │
│                                                              │
│ Filters                         Product results              │
│ ┌─────────────────────┐        ┌────────┐ ┌────────┐         │
│ │ Unit                │        │ photo  │ │ photo  │         │
│ │ Price range         │        │ name   │ │ name   │         │
│ │ Location            │        │ price  │ │ price  │         │
│ │ Seller type         │        │ stock  │ │ stock  │         │
│ └─────────────────────┘        └────────┘ └────────┘         │
└──────────────────────────────────────────────────────────────┘
```

On tablet, filters may become a filter button and drawer. On phone, use a single-column result list with a filter sheet.

## Marketplace reference layout

Use the marketplace screenshot supplied by the project owner on **2026-09-24** as a structural reference. It shows a dense commerce layout with a two-level header, a result toolbar, a filter rail, and a product grid. Agrivive should borrow the information hierarchy and spacing—not the other site's branding, product language, or unapproved features.

### Adapted desktop structure

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Agrivive logo   Marketplace   Orders                 Sign in / account       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Pickup area: Davao City     Produce categories        Seller access          │
├──────────────────────────────────────────────────────────────────────────────┤
│ Fresh surplus near you                                      Sort: Newest     │
│ Search produce or seller                                      Grid / list     │
├───────────────────────┬──────────────────────────────────────────────────────┤
│ FILTERS               │ 24 listings                                           │
│                       │ ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│ Product type          │ │ produce    │ │ produce    │ │ produce    │          │
│ Selling unit          │ │ image      │ │ image      │ │ image      │          │
│ Price range           │ │ name       │ │ name       │ │ name       │          │
│ Seller type           │ │ price/unit │ │ price/unit │ │ price/unit │          │
│ Pickup area           │ │ stock      │ │ stock      │ │ stock      │          │
│                       │ │ seller     │ │ seller     │ │ seller     │          │
│ [Clear filters]       │ └────────────┘ └────────────┘ └────────────┘          │
│                       │                                                      │
│                       │             [Load more listings]                    │
└───────────────────────┴──────────────────────────────────────────────────────┘
```

### Structural rules

- Keep the first header row quiet: logo, Marketplace, Orders, Cart, and the account action. Favorites remain out of scope until separately approved.
- Use a slim second row for location context and produce categories. On small screens it becomes a horizontal scroll row or a menu button; it must not compete with Search.
- Put the result count and sorting control above the grid. Sorting is visual/API state, not a card action.
- Keep the filter rail around 220–240px at desktop widths. Group filters with short labels, visible values, and checkbox or select controls; use a two-field row for minimum and maximum price.
- Keep product cards visually calm. The top half is image and availability; the lower half contains product name, current price and unit, quantity, seller, and pickup area. Use a small Available/Sold out text-and-color state instead of star ratings.
- Use the API's signed image URL when present. When no image exists, show a quiet sage/cream placeholder with the product category rather than a broken image icon.
- Keep a three-column grid at wide desktop widths. At tablet widths, use two columns beside a collapsible filter drawer. At phone widths, use one column and a full-width Filter button.
- Use Load more with the API cursor instead of numbered pagination so the page preserves the browsing context.

### Reference-to-Agrivive mapping

| Reference pattern | Agrivive treatment |
|---|---|
| Category button | Produce category menu using the six backend product types |
| Location row | Seller pickup area and optional Davao City distance filter |
| Price min/max fields | `minPrice` and `maxPrice` query filters |
| Brand/gender/diet checkboxes | Product type, selling unit, and seller type filters |
| Rating/review metadata | Availability, quantity, seller, and pickup area; reviews are out of scope for this first web release |
| Favorites controls | Omit until separately approved |
| Sort and view controls | Newest-first API result order plus a compact grid/list presentation control |

This reference is a layout and hierarchy aid only. Preserve the Agrivive palette, Manrope/Inter typography, plain buyer language, direct Buy Now flow, and multi-store Cart checkout defined in this guide.

## Product detail page

```text
┌──────────────────────────────────────────────────────────────┐
│ ← Back to marketplace                                        │
│                                                              │
│ ┌───────────────────┐  Product name                         │
│ │                   │  ₱ price / unit                       │
│ │      photo        │  Available quantity                    │
│ │                   │  Seller and pickup area                │
│ └───────────────────┘  Quantity [−] 1 [+]                   │
│                         [Buy now]                            │
│                                                              │
│ Pickup instructions and seller details                       │
└──────────────────────────────────────────────────────────────┘
```

On phone, stack the image above product information and keep Buy Now visible after the quantity control.

## Authentication pages

### Desktop

```text
┌──────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────┐  ┌──────────────────────────┐ │
│  │ AGRIVIVE                  │  │                          │ │
│  │                           │  │   local market image    │ │
│  │ Sign up                   │  │                          │ │
│  │ Let's get you closer to   │  │   Fresh surplus from     │ │
│  │ good local produce.       │  │   nearby sellers.        │ │
│  │                           │  │                          │ │
│  │ Your name                 │  │                          │ │
│  │ [                       ] │  │                          │ │
│  │ Email                     │  │                          │ │
│  │ [                       ] │  │                          │ │
│  │ Password                  │  │                          │ │
│  │ [                       ] │  │                          │ │
│  │ Confirm password          │  │                          │ │
│  │ [                       ] │  │                          │ │
│  │ [ Create account        ] │  │                          │ │
│  │                           │  │                          │ │
│  │ Already have an account? │  │                          │ │
│  │ Sign in                  │  │                          │ │
│  └───────────────────────────┘  └──────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

At phone widths, render the form first and hide the image panel. Keep the shell white with 16px page padding. Error messages remain inside the form column and must not create horizontal overflow.

## Orders page

Show pending, completed, cancelled, and expired orders in a readable list or table.

Each order row includes:

- Product name.
- Quantity and total.
- Seller or pickup location.
- Status label.
- Date.
- Link to order details.

The order detail view shows the QR reservation, pickup instructions, cancellation action when allowed, and clear status explanations.

## Responsive behavior

- `>= 1200px`: two-column marketplace layout with persistent filters.
- `768px–1199px`: flexible content with collapsible filters.
- `< 768px`: single-column layout, compact header, stacked cards.
- `< 640px`: 16px page padding, full-width primary actions, no horizontal scrolling.

## Layout review checklist

- The main action is visible without searching.
- Product price, unit, quantity, seller, and pickup area are readable together.
- Keyboard focus is visible.
- Cards remain usable at 360px width.
- Empty, offline, retry, and sold-out states fit the same layout.
- Text can wrap without clipping.
