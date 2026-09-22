# SELLER INVENTORY MANAGEMENT — MOBILE UI/UX DESIGN

Design a modern mobile inventory management app for sellers. The interface should help sellers quickly understand current stock levels, record incoming and outgoing inventory, detect low-stock products, and review inventory history.

The app should follow major UI/UX principles including:

- Fitts's Law
- Hick's Law
- Miller's Law
- Jakob's Law
- Gestalt Principles
- Von Restorff Effect
- Serial Position Effect
- Tesler's Law
- Doherty Threshold
- Peak-End Rule
- Goal Gradient Effect
- Zeigarnik Effect
- Aesthetic-Usability Effect
- Progressive Disclosure
- Recognition over Recall
- Error Prevention
- Accessibility
- Thumb-Zone Design

---

# 1. MAIN NAVIGATION

Use only the most important destinations.

```text
┌──────────────────────────────┐
│                              │
│          SCREEN              │
│                              │
├──────────────────────────────┤
│ 🏠       📦       ⇄       👤 │
│ Home   Inventory Activity Me │
└──────────────────────────────┘
```

Primary navigation:

- Home
- Inventory
- Activity
- Profile

Do not place too many destinations in the bottom navigation.

This follows **Hick's Law** by reducing the number of decisions.

---

# 2. HOME DASHBOARD

The dashboard should immediately answer:

- How many products do I have?
- Which products are low in stock?
- What came in today?
- What went out today?
- What action should I take?

```text
┌────────────────────────────────┐
│ 9:41                       ▰▰▰ │
│                                │
│ Good morning                   │
│ Joaquin                  🔔    │
│                                │
│ Inventory Overview             │
│                                │
│ ┌───────────┐ ┌─────────────┐ │
│ │    124    │ │      8      │ │
│ │ Products  │ │ Low Stock   │ │
│ └───────────┘ └─────────────┘ │
│                                │
│ ┌───────────┐ ┌─────────────┐ │
│ │    +42    │ │     -31     │ │
│ │ Stock In  │ │ Stock Out   │ │
│ │ Today     │ │ Today       │ │
│ └───────────┘ └─────────────┘ │
│                                │
│ Quick Actions                  │
│                                │
│ [＋ Stock In]   [－ Stock Out] │
│                                │
│ [＋ Add Product]               │
│                                │
│ Low Stock                      │
│                        See All │
│                                │
│ ┌────────────────────────────┐ │
│ │ 🥬 Lettuce                │ │
│ │ 4 kg remaining            │ │
│ │ ⚠ Low Stock               │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ 🍅 Tomatoes               │ │
│ │ 7 kg remaining            │ │
│ │ ⚠ Low Stock               │ │
│ └────────────────────────────┘ │
│                                │
│ Recent Activity                │
│                                │
│ + 20 kg Tomatoes      9:20 AM │
│ - 5 kg Lettuce        8:44 AM │
│                                │
├────────────────────────────────┤
│ 🏠       📦       ⇄       👤 │
│ Home   Inventory Activity Me  │
└────────────────────────────────┘
```

---

# 3. INFORMATION HIERARCHY

Important information should have stronger visual emphasis.

Example:

```text
124
Products
```

The number should be larger than the label.

Hierarchy:

```text
32 px — Important number
24 px — Page title
20 px — Section title
16 px — Primary body text
14 px — Secondary information
12 px — Metadata
```

This improves scanning.

---

# 4. INVENTORY SCREEN

This is the main product-management screen.

```text
┌────────────────────────────────┐
│ ← Inventory                    │
│                                │
│ ┌────────────────────────────┐ │
│ │ 🔍 Search products...   ⚙ │ │
│ └────────────────────────────┘ │
│                                │
│ [All] [Low Stock] [Out]       │
│                                │
│ 124 Products                   │
│                                │
│ ┌────────────────────────────┐ │
│ │ 🥬 Lettuce                │ │
│ │ Vegetables                │ │
│ │                            │ │
│ │ 24 kg                     │ │
│ │ ₱65 / kg                  │ │
│ │                     ›      │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ 🍅 Tomatoes               │ │
│ │ Vegetables                │ │
│ │                            │ │
│ │ 7 kg                      │ │
│ │ ⚠ Low Stock              │ │
│ │                     ›      │ │
│ └────────────────────────────┘ │
│                                │
│                         [ ＋ ] │
│                                │
├────────────────────────────────┤
│ 🏠       📦       ⇄       👤 │
└────────────────────────────────┘
```

The floating `＋` button is used to add a new product.

---

# 5. HICK'S LAW

Do not show every possible filter.

Bad:

```text
All
Available
Unavailable
Low Stock
High Stock
Vegetables
Fruits
Today
Yesterday
Newest
Oldest
Highest
Lowest
```

Better:

```text
[All] [Low Stock] [Out]

Filters ⚙
```

Advanced filters can appear after tapping **Filters**.

---

# 6. PRODUCT DETAILS

```text
┌────────────────────────────────┐
│ ← Product Details         ⋮    │
│                                │
│          PRODUCT IMAGE         │
│                                │
│ Lettuce                        │
│ Leafy Vegetables               │
│                                │
│ Current Stock                  │
│                                │
│ 24 kg                          │
│                                │
│ Selling Price                  │
│ ₱65 / kg                       │
│                                │
│ Low Stock Level                │
│ 5 kg                           │
│                                │
│ Last Updated                   │
│ Today, 9:21 AM                 │
│                                │
│ ┌────────────┐ ┌─────────────┐│
│ │ ＋ Stock In │ │ − Stock Out ││
│ └────────────┘ └─────────────┘│
│                                │
│ Inventory History             │
│                                │
│ +20 kg         Sep 21         │
│ -5 kg          Sep 20         │
│ +12 kg         Sep 19         │
│                                │
│ [ Edit Product ]              │
│                                │
└────────────────────────────────┘
```

The most frequent actions are close to the bottom thumb area.

This applies **Fitts's Law**.

---

# 7. STOCK-IN FLOW

Keep this very simple.

```text
┌────────────────────────────────┐
│ ← Stock In                     │
│                                │
│ Product                        │
│                                │
│ [ Lettuce                  › ] │
│                                │
│ Quantity                       │
│                                │
│ [      20                  ]   │
│                                │
│ Unit                           │
│                                │
│ [ Kilograms                ▼ ] │
│                                │
│ Supplier                       │
│                                │
│ [ Optional                 ]   │
│                                │
│ Notes                          │
│                                │
│ [ Optional notes...        ]   │
│                                │
│                                │
│ Current Stock                  │
│ 24 kg                          │
│                                │
│ After Stock In                 │
│ 44 kg                          │
│                                │
│ ┌────────────────────────────┐ │
│ │      Confirm Stock In      │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

Showing:

```text
Current Stock: 24 kg
After Stock In: 44 kg
```

prevents mistakes before confirmation.

This follows **Error Prevention**.

---

# 8. STOCK-OUT FLOW

```text
┌────────────────────────────────┐
│ ← Stock Out                    │
│                                │
│ Product                        │
│ [ Lettuce                  › ] │
│                                │
│ Available                      │
│ 24 kg                          │
│                                │
│ Quantity                       │
│ [      5                   ]   │
│                                │
│ Reason                         │
│                                │
│ [ Sold                     ▼ ] │
│                                │
│ Options:                       │
│ Sold                           │
│ Damaged                        │
│ Spoiled                        │
│ Returned                       │
│ Adjustment                     │
│                                │
│ After Stock Out                │
│ 19 kg                          │
│                                │
│ ┌────────────────────────────┐ │
│ │      Confirm Stock Out     │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

Never allow:

```text
Current stock: 10 kg
Stock out: 15 kg
```

Display:

```text
⚠ Only 10 kg are available.
```

---

# 9. ERROR PREVENTION

Validate stock before saving.

Example:

```text
Quantity

[ 30 ]

⚠ Available stock is only 24 kg.
```

Disable confirmation until the value becomes valid.

```text
[ Confirm Stock Out ]
      disabled
```

---

# 10. ADD PRODUCT SCREEN

```text
┌────────────────────────────────┐
│ ← Add Product                  │
│                                │
│ Product Image                  │
│                                │
│ ┌────────────────────────────┐ │
│ │        ＋ Add Image         │ │
│ └────────────────────────────┘ │
│                                │
│ Product Name                   │
│ [ Lettuce                  ]   │
│                                │
│ Category                       │
│ [ Leafy Vegetables         ▼ ] │
│                                │
│ Initial Quantity               │
│ [ 25                       ]   │
│                                │
│ Unit                           │
│ [ kg                       ▼ ] │
│                                │
│ Price                          │
│ [ ₱65                      ]   │
│                                │
│ Low Stock Alert                │
│ [ 5 kg                     ]   │
│                                │
│ ┌────────────────────────────┐ │
│ │        Add Product         │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

Only ask for fields needed to create the product.

Additional data can be added later.

This follows **Tesler's Law** and **Progressive Disclosure**.

---

# 11. LOW-STOCK SCREEN

```text
┌────────────────────────────────┐
│ ← Low Stock                    │
│                                │
│ 8 products need attention      │
│                                │
│ ┌────────────────────────────┐ │
│ │ 🍅 Tomatoes               │ │
│ │                            │ │
│ │ 3 kg remaining            │ │
│ │ Minimum: 5 kg             │ │
│ │                            │ │
│ │ [ Stock In ]              │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ 🥬 Lettuce                │ │
│ │                            │ │
│ │ 4 kg remaining            │ │
│ │ Minimum: 10 kg            │ │
│ │                            │ │
│ │ [ Stock In ]              │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

The action appears directly beside the problem.

Users do not need to navigate several screens.

---

# 12. VON RESTORFF EFFECT

Critical items should visually stand out.

Example:

```text
Tomatoes
3 kg remaining

⚠ LOW STOCK
```

Normal products should remain visually quiet.

Only unusual or important information should receive stronger emphasis.

---

# 13. INVENTORY ACTIVITY

```text
┌────────────────────────────────┐
│ Inventory Activity             │
│                                │
│ [All] [Stock In] [Stock Out]  │
│                                │
│ Today                          │
│                                │
│ ↑ Stock In                    │
│ Tomatoes                      │
│ +20 kg                        │
│ 9:21 AM                       │
│                                │
│ ↓ Stock Out                   │
│ Lettuce                       │
│ -5 kg                         │
│ 8:40 AM                       │
│                                │
│ Yesterday                      │
│                                │
│ ↓ Stock Out                   │
│ Carrots                       │
│ -8 kg                         │
│ Sold                          │
│                                │
├────────────────────────────────┤
│ 🏠       📦       ⇄       👤 │
└────────────────────────────────┘
```

Group records by date using **Gestalt Proximity**.

---

# 14. SEARCH

```text
┌────────────────────────────┐
│ 🔍 Search product...       │
└────────────────────────────┘
```

Search results should update quickly.

Example:

```text
Search:
"tom"

Tomatoes
Cherry Tomatoes
```

This applies the **Doherty Threshold**—interfaces should respond quickly enough to maintain attention.

---

# 15. SKELETON LOADING

Avoid an empty white page while fetching data.

```text
┌────────────────────────────┐
│ █████████████              │
│ ███████                    │
│                            │
│ █████████████████████      │
│ ███████████                │
└────────────────────────────┘
```

Keep the skeleton similar to the real content.

---

# 16. EMPTY STATES

Example when no products exist:

```text
          📦

Your inventory is empty

Add your first product to start
tracking inventory.

[ Add Product ]
```

Example when no low-stock products exist:

```text
          ✓

Everything looks good

No products are currently
running low on stock.
```

---

# 17. SUCCESS FEEDBACK

After stock-in:

```text
✓ Stock updated

20 kg added to Lettuce.

Previous: 24 kg
Current: 44 kg
```

After stock-out:

```text
✓ Stock updated

5 kg removed from Lettuce.

Current stock: 19 kg
```

This follows the **Peak-End Rule**.

---

# 18. UNDO

For safe actions, allow undo.

```text
Product archived

UNDO
```

This improves user control.

---

# 19. DELETE PRODUCT

Do not immediately delete products.

```text
Delete Lettuce?

This product will be removed from your
active inventory.

Its previous transaction records will
remain available.

[Cancel]                 [Delete]
```

For inventory systems, consider **Archive Product** instead of permanent deletion.

---

# 20. MILLER'S LAW

Break information into manageable groups.

Instead of:

```text
Name
Quantity
Unit
Price
Category
Created
Updated
Minimum
Supplier
Last sale
Last stock-in
Stock-out count
Stock-in count
```

Use:

```text
Product Information

Inventory

Pricing

Stock History
```

---

# 21. GESTALT PRINCIPLES

## Proximity

Keep related information together.

```text
Tomatoes
12 kg
Low Stock
```

## Similarity

All inventory cards should use the same structure.

## Common Region

Product information inside one card represents one product.

## Continuity

Align labels and values consistently.

---

# 22. FITTS'S LAW

Important buttons should be large.

Recommended:

```text
Height: 48–52 px
```

Examples:

```text
[ Confirm Stock In ]

[ Confirm Stock Out ]

[ Add Product ]
```

Avoid small text-only buttons for primary actions.

---

# 23. THUMB-ZONE DESIGN

Place frequent actions toward the bottom.

```text
Top
────────────────
Back
Title
Notifications

Middle
────────────────
Inventory data
Products

Bottom
────────────────
Stock In
Stock Out
Add Product
Navigation
```

---

# 24. JAKOB'S LAW

Use patterns users already understand:

- Magnifying glass → search
- `+` → add
- Bell → notifications
- Arrow left → back
- Three dots → more actions
- Trash → delete
- Pencil → edit
- Bottom navigation → main sections

Do not invent unfamiliar icons when established patterns already exist.

---

# 25. RECOGNITION OVER RECALL

Instead of asking:

```text
Enter Product ID
```

show:

```text
Select Product

[ Search products... ]

Lettuce
Tomatoes
Carrots
Onion
```

The seller should recognize products instead of memorizing database IDs.

---

# 26. SERIAL POSITION EFFECT

Place frequently used navigation actions in memorable positions.

```text
Home | Inventory | Activity | Profile
```

Keep the order consistent across the whole app.

---

# 27. ACCESSIBILITY

Requirements:

- Minimum touch target around 44–48 px
- Strong text/background contrast
- Do not communicate status only through color
- Support larger text
- Use labels with icons
- Use readable font sizes
- Add accessible labels for screen readers

Instead of:

```text
🔴
```

Use:

```text
⚠ Low Stock
```

---

# 28. COLOR SEMANTICS

Use semantic design tokens.

```text
Primary
Background
Surface
Text Primary
Text Secondary
Border
Success
Warning
Error
Disabled
```

Possible meanings:

```text
Success → completed stock update

Warning → low stock

Error → invalid quantity

Neutral → normal inventory
```

Do not use too many colors.

---

# 29. 8-POINT SPACING SYSTEM

Use:

```text
4 px
8 px
16 px
24 px
32 px
48 px
```

Recommended:

```text
Screen padding: 16 px

Card padding: 16 px

Gap between cards: 12–16 px

Section gap: 24–32 px

Input height: 48–52 px

Button height: 48–52 px
```

---

# 30. INVENTORY CARD

Recommended card:

```text
┌──────────────────────────────┐
│ 🥬  Lettuce                 │
│     Leafy Vegetables        │
│                             │
│     24 kg                   │
│     ₱65 / kg                │
│                             │
│     Updated 10 mins ago  ›  │
└──────────────────────────────┘
```

Low stock:

```text
┌──────────────────────────────┐
│ 🍅  Tomatoes                │
│     Vegetables              │
│                             │
│     3 kg                    │
│     ⚠ Low Stock             │
│                             │
│     [ Stock In ]            │
└──────────────────────────────┘
```

---

# 31. QUICK ACTIONS

Limit quick actions to important operations.

```text
Quick Actions

[ ＋ Stock In ]

[ − Stock Out ]

[ ＋ Add Product ]
```

This is better than presenting 8–10 actions at once.

---

# 32. NOTIFICATION SCREEN

```text
Notifications

Today

⚠ Tomatoes are running low
3 kg remaining.

[Stock In]


⚠ Lettuce reached its minimum stock
5 kg remaining.

[Stock In]
```

Notifications should be actionable.

---

# 33. INVENTORY SUMMARY

Useful seller metrics:

```text
Total Products

124


Total Units

2,440


Low Stock

8


Out of Stock

3
```

Optional analytics:

```text
Stock In Today
42 units

Stock Out Today
31 units
```

Avoid overwhelming sellers with analytics that are not actionable.

---

# 34. DASHBOARD VISUAL HIERARCHY

Order of importance:

```text
1. Inventory alerts

2. Inventory summary

3. Quick actions

4. Low-stock products

5. Recent activity

6. Secondary analytics
```

The seller should see problems before less important statistics.

---

# 35. RESPONSIVE MOBILE STRUCTURE

Target:

```text
375 px
390 px
414 px
430 px
```

Use flexible widths:

```text
width: 100%

max-width based on container
```

Avoid hardcoded component widths.

---

# 36. COMPLETE APP STRUCTURE

```text
Seller Inventory App

Home
│
├── Inventory Overview
├── Low Stock
├── Quick Actions
└── Recent Activity


Inventory
│
├── All Products
├── Search
├── Filters
├── Product Details
│   ├── Stock In
│   ├── Stock Out
│   ├── Edit
│   └── History
│
└── Add Product


Activity
│
├── All
├── Stock In
├── Stock Out
└── Adjustments


Profile
│
├── Seller Information
├── Inventory Settings
├── Notifications
├── Account
└── Sign Out
```

---

# 37. CORE UX FLOW

The most important workflow should require very few actions.

## Stock In

```text
Inventory
   ↓
Select Product
   ↓
Stock In
   ↓
Enter Quantity
   ↓
Confirm
```

## Stock Out

```text
Inventory
   ↓
Select Product
   ↓
Stock Out
   ↓
Quantity + Reason
   ↓
Confirm
```

## Add Product

```text
Inventory
   ↓
Add Product
   ↓
Product Information
   ↓
Save
```

---

# 38. CORE UX RULE

Every screen should immediately communicate:

```text
Where am I?

What am I looking at?

What is the current inventory state?

What action can I perform?

What will happen if I perform it?

How can I recover if I make a mistake?
```

The goal is not to make the seller think about the interface.

The interface should make inventory management feel obvious.
