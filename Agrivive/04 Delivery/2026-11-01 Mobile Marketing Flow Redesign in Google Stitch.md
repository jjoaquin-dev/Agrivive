---
title: Mobile Marketing Flow Redesign in Google Stitch
type: delivery
date: 2026-11-01
---

# Mobile Marketing Flow Redesign in Google Stitch

## What Changed

Generated 14 high-fidelity mobile UI mockups in Google Stitch project `AGRIVIVE MOBILE UI` (`11184471743007910085`) under design system `assets/f47dfb9bbc764f6b9ea16ff85a7b3e78` ("Lush Agro-Commerce") covering the complete seller **Marketing (Boost)** flow:
- Screen A: Marketing Hub (Running tab with price-dropped prompt, empty state, skeleton loading, History tab with "All" filter and pagination, History tab with "Did not post" error state and retry, and "How Buyers Find You" visibility ranking tab with collapsed cards and Tomato "Why?" breakdown expanded).
- Sheet B: Boost Intro Sheet presented upon adding new produce over the Listings screen.
- Screen C: Preview Boost screen (allowed state with Facebook preview, allowed state with Instagram 1:1 preview, and not-allowed state with existing running boost timeline and disabled action).
- Screen D: Boost Started live confirmation screen (both platforms posting spinners, both posted with external links, and all failed error state).

All frames strictly follow Agrivive's design system tokens (Forest Green `#0F920F`, Terracotta `#C97850` boost accent, Inter typography, 4px spatial rhythm, 44px/48px/52px Fitts's law touch targets, tinted status badges), strict anti-hallucination rules (zero invented metrics, reach, likes, impressions, clicks, or ad budgets; boosts remain 100% free posts to official Agrivive pages), and UX psychological laws (Jakob's Law, Hick-Hyman Law, Don't Make Me Think, Gestalt Uniform Connectedness and Law of Similarity, Serial Position Effect, Visibility of System Status, Peak-End Rule, and Dieter Rams' honesty principle).

---

### Generated Google Stitch Frames (14)

1. **A1 (Hub · Running tab with price-dropped prompt + 2 running boosts)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/b4ec555bcd4146b9a5a67d49cde34e17`
   - Features: Stack header "Boost", 44px intro row with flame icon, segmented control (Running with badge "2", History, How Buyers Find You), Cabbage price-drop prompt card with "Boost Again" CTA, Tomato running boost card with multi-step timeline, and Eggplant card with "Posting now" badge.
2. **A2 (Hub · Running tab empty state)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/14003a805eb1440dbfefa687bf2bfb7c`
   - Features: Flame icon in primaryLight circle, plain-language empty copy ("No boosts running" / "Boost a product from your Listings to share it."), and primary "Go to Listings" CTA.
3. **A3 (Hub · Running tab loading skeleton)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/e52812ace70f43139320b471bc07b7f8`
   - Features: Cohesive shimmer skeleton layout (1 prompt skeleton container + 2 card skeletons) matching final card dimensions instead of a generic circular activity spinner.
4. **A4 (Hub · History tab "All" chip + pagination)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/ff42060d878e47b8bfdc4c59e004d7e9`
   - Features: Horizontal filter chip bar (All, Running, Posted, Needs your choice, Did not post), 4 cards (Tomato, Eggplant, Pechay, Kangkong), and bottom pagination control ("Showing 1–4 of 4 boosts · Show: [5] [10] [20]").
5. **A5 (Hub · History tab "Did not post" chip)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/e4f1337d074f49fdb26f5cc36d3e78ba`
   - Features: Filtered view for failed items, Pechay card with error-tinted status pill, red error notice box ("Facebook did not accept the post."), and secondary "Try Again" retry button.
6. **A6 (Hub · How Buyers Find You tab · 4 cards)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/1dcb578cdcb04eaab262b88250e96630`
   - Features: Caption ("How high your listings show when buyers browse."), 4 listing cards with human place badges ("Top spot", "Middle", "Lower", "Not shown yet"), 4-segment progress bars with rounded score ("Score 71 of 100"), plain-words explanation lines, and action buttons ("Why?" + "Boost" / "View Boost").
7. **A7 (Hub · How Buyers Find You · Tomato "Why?" expanded)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/1b71424009164ecf9d5d81e7884fb05e`
   - Features: Tomato card with "Why?" button toggled open (ChevronUp), revealing nested factors breakdown panel sorted by weight: Fresh (40% weight — 90%), Amount left (30% weight — 75%), Reliability (20% weight — 60%), Sells often (10% weight — 30%), and reassuring footnote ("Fresher, bigger, reliable listings show higher.").
8. **Sheet B (Boost Intro Sheet over Listings screen)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/cd5c8ba84fae43dd8633ac86e52b6f16`
   - Features: Dimmed backdrop over Listings view, 24px rounded bottom sheet with top drag handle, Megaphone icon in 64px circle, title "Boost this produce?", 3 numbered benefit rows with platform badges, honest notice box ("Free. This is not a paid ad."), 52px primary "Preview Post" CTA, and 44px ghost "Not Now".
9. **C1 (Preview Boost · allowed state · Facebook selected)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/5dc0a94bb3f646afb35a1179a8595072`
   - Features: Stack header "Preview Boost", success-tint eligibility note ("You can boost this product."), two 56px platform selector tabs with Facebook active (1.5px green border), Facebook 16:9 landscape photo post mockup, 6-hour 10% price-drop card down to ₱45.00 floor, and sticky bottom bar with 52px "Boost on Facebook & Instagram" button and "See boost history" link.
10. **C2 (Preview Boost · allowed state · Instagram selected)**:
    - Stitch Screen ID: `projects/11184471743007910085/screens/aa48f415b50a4ab597effa9b7b7f7931`
    - Features: Instagram tab active, post preview adapted to Instagram's native 1:1 square image format and short caption styling, identical sticky bottom action bar.
11. **C3 (Preview Boost · not allowed state · existing boost running)**:
    - Stitch Screen ID: `projects/11184471743007910085/screens/cf18912b38ce4d34bd4fa7bada4ce3ba`
    - Features: Warning-tint eligibility note with Clock icon ("Boost already running"), existing boost status card showing "Running" badge and live 3-step timeline (initial post, price drop post, next price drop scheduled), and disabled grey sticky bottom button.
12. **D1 (Boost started · both posting spinners)**:
    - Stitch Screen ID: `projects/11184471743007910085/screens/34d860cb39e34656b68190fe0f50eaa3`
    - Features: Full-screen confirmation without stack header, 120px primaryLight circle with 64px green CheckCircle, "Your boost has started!", live platform card with spinning activity indicators on both Facebook and Instagram rows ("Posting now"), 3-step "What happens now" guide, and "View My Produce" primary CTA.
13. **D2 (Boost started · both posted with "View" links)**:
    - Stitch Screen ID: `projects/11184471743007910085/screens/3fed09ebb35b4410b9c61973b1193a92`
    - Features: Both platform rows updated to green "Posted" status badges with external "View" link buttons directing to the live published posts.
14. **D3 (Boost did not post · all failed)**:
    - Stitch Screen ID: `projects/11184471743007910085/screens/9f2a8f686209497db57e0b3e3308a276`
    - Features: 120px error-tint circle with 64px red XCircle, "Your boost did not post", "Neither page took the post. You can try again from your produce.", platform card showing both failed with "Did not post" badges, error notice box, no "What happens now" card, and "View My Produce" CTA.

---

## Affected Codebase Files Mapped

| Screen / Component | File Path | Key Line Numbers | Elements Mapped |
| :--- | :--- | :--- | :--- |
| **Stack Navigation** | `mobile/app/(app)/_layout.tsx` | L67–69 | Stack header title "Boost" (replaces "Marketing"), "Preview Boost", and `headerShown: false` for `started.tsx`. |
| **Hub Container** | `mobile/app/(app)/marketing/index.tsx` | L18–19, L42–66 | Top intro row (44px square, Flame icon, helper copy, platform marks), active section state, segmented control tabs. |
| **Segmented Tabs** | `mobile/src/features/marketing/components/MarketingSectionTabs.tsx` | L15–19, L22–49 | Tab definitions: "Running" (with active badge), "History", and "How Buyers Find You". |
| **Running Section** | `mobile/src/features/marketing/components/ActiveBoostsSection.tsx` | L26–56 | Removal of redundant `SocialHubBanner`, rendering price-drop prompt group, "Running boosts (count)" heading, cards, and empty state. |
| **Price-Drop Prompts** | `mobile/src/features/marketing/components/PriceDropPromptList.tsx` | L27–65 | Struck-through old price, new bold green price, "Share the lower price so more buyers see it.", "Boost Again" primary button. |
| **History Section** | `mobile/src/features/marketing/components/BoostHistorySection.tsx` | L35–88 | Horizontal status chips (All, Running, Posted, Needs your choice, Did not post), boost card feed, pagination controls. |
| **Boost Card** | `mobile/src/features/marketing/components/BoostHistoryCard.tsx` | L38–98 | 56px thumbnail, product code `PRD-XXXX`, unified status badge, price comparison row, timeline integration, error box, "Manage Boost" / "Try Again" footer. |
| **Timeline** | `mobile/src/features/marketing/components/BoostTimeline.tsx` | L20–60 | Connected vertical timeline dots (initial post, price drop post, next scheduled drop). |
| **Visibility Section**| `mobile/src/features/marketing/components/VisibilityGuideSection.tsx` | L32–55 | Section caption ("How high your listings show when buyers browse.") and listing breakdown list. |
| **Visibility Card** | `mobile/src/features/marketing/components/VisibilityBreakdownCard.tsx` | L34–98, L142–160 | Place badges ("Top spot", "Middle", "Lower", "Not shown yet"), score out of 100 with 4-segment bar, plain-words ranking explanations, "Why?" accordion toggle. |
| **Factors Breakdown**| `mobile/src/features/marketing/components/VisibilityFactorsGrid.tsx` | L22–48 | Weight-ordered progress bars: Fresh (40%), Amount left (30%), Reliability (20%), Sells often (10%), and plain summary footnote. |
| **Intro Sheet** | `mobile/src/features/marketing/components/BoostIntroSheet.tsx` | L15–49 | 24px radius bottom sheet, Megaphone icon, 3 numbered benefit rows with Facebook/Instagram marks, honest "Free promotion" notice, 52px primary action. |
| **Inventory Create** | `mobile/app/(app)/inventory/create.tsx` | L186–192 | Modal presentation trigger for `BoostIntroSheet` after vegetable creation. |
| **Preview Screen** | `mobile/app/(app)/marketing/[productId].tsx` | L56–68 | Immediate eligibility feedback at top, platform switcher tabs, post preview, price drop card, sticky bottom bar (52px button + history link, removing redundant "Back" button). |
| **Eligibility Note** | `mobile/src/features/marketing/components/BoostEligibilityNote.tsx` | L15–35 | Success tint container ("You can boost this product.") and warning tint container ("Boost already running"). |
| **Post Mock Preview**| `mobile/src/features/marketing/components/BoostPostPreview.tsx` | L22–55 | Brand "A" avatar, 16:9 (Facebook) / 1:1 (Instagram) produce photo, price per kg, platform-specific short caption disclaimer. |
| **Price Drop Info** | `mobile/src/features/marketing/components/BoostPriceDropCard.tsx` | L18–40 | 6-hour 10% price drop explanation down to floor price. |
| **Status Card** | `mobile/src/features/marketing/components/BoostStatusCard.tsx` | L20–55 | Existing boost status display with timeline for not-allowed preview state. |
| **Started Screen** | `mobile/app/(app)/marketing/started.tsx` | L40–68 | Live polling feedback, 120px hero icon, "Your boost has started!" / "Your boost did not post", platform card with live statuses and external links, "What happens now" guide, "View My Produce". |
| **Channel Status** | `mobile/src/features/marketing/components/BoostChannelList.tsx` | L25–60 | Facebook and Instagram rows with spinning loaders, checkmarks, error indicators, and "View" links. |
| **Marketing Types** | `mobile/src/features/marketing/types.ts` | L4–6, L113–137 | Canonical state types (`BoostState`), human-readable labels (`boostStateLabel`), `productCode` helper. |
| **Design Tokens** | `mobile/src/theme/index.ts` | Entire file | Primary `#0F920F`, terracotta `#C97850`, surface `#FFFFFF`, surfaceMuted `#F9FAFB`, borders `#E5E7EB`, tints, Inter typography. |

---

## Change Lists Versus Existing Codebase

### A. Copy Changes (Old → New)

| Location | Old Copy | New Plain Copy | UX Principle & Rationale |
| :--- | :--- | :--- | :--- |
| **Stack Header** | `"Marketing"` | `"Boost"` | **Jakob's Law**: Single familiar verb across tabs, buttons, and tiles. |
| **Hub Intro** | `"Promote produce on official Agrivive Facebook & Instagram."` | `"Share your produce on the Agrivive Facebook and Instagram pages for free."` | **Plain Words**: Transparent, welcoming, emphasizes 100% free benefit. |
| **Tab 1** | `"Active"` | `"Running"` | **Plain Words**: Active verbs match state; matches badge labels. |
| **Tab 3** | `"Visibility Guide"` | `"How Buyers Find You"` | **Don't Make Me Think**: Focuses on buyer outcome, eliminates platform jargon. |
| **Banner Headline** | `"Agrivive Social Marketing"` / `"ACTIVE BROADCASTS"` | *(Removed redundant banner)* | **Hick-Hyman Law & Minimalism**: Declutters interface; info consolidated in intro row. |
| **Active Section** | `"Active Broadcasts (count)"` | `"Running boosts (count)"` | **Law of Similarity**: Consistent terminology ("Boost", not "Broadcast"). |
| **Active Empty** | `"No broadcasts running"` / `"Boost from Listings"` | `"No boosts running"` / `"Go to Listings"` | **Plain Words**: Simpler navigation destination. |
| **Price Drop Prompt**| `"Price Drop Active"` / generic notice | `"Share the lower price so more buyers see it."` | **Recognition over Recall**: Clearly communicates the reason to re-boost. |
| **Visibility Badge**| `"PRIORITY TIER"` / `"STANDARD TIER"` | `"Top spot"` / `"Middle"` / `"Lower"` / `"Not shown yet"` | **Plain Words**: Concrete physical ranking positions instead of abstract tiers. |
| **Placement Score** | `item.score.toFixed(4)` (e.g. `0.7123`) | `"Score 71 of 100"` | **Miller's Law & Don't Make Me Think**: Easily digestible whole-number scale. |
| **Visibility Line** | `"Featured near top of buyer browse"` | `"Buyers see this near the top."` | **Plain Words**: Conversational phrasing for five-year-olds. |
| **Factors Header** | `"Evaluation Criteria (Highest Weight at Top)"` | Nested `"Why?"` breakdown panel | **Progressive Disclosure**: Keeps card compact until user asks "Why?". |
| **Factors Jargon** | `"Freshness (Recency) 40% WT"` / `"0.40 pts max"` | `"Fresh" · 40% of score — 90%` | **Plain Words**: Clear percentage weight and actual score percentage. |
| **Factors Jargon** | `"Available Stock 30% WT"` | `"Amount left" · 30% of score — 75%` | **Plain Words**: Simple, relatable language. |
| **Factors Jargon** | `"Seller Reliability 20% WT"` | `"Reliability" · 20% of score — 60%` | **Plain Words**: Removes abbreviation clutter. |
| **Factors Jargon** | `"Surplus Recurrence 10% WT"` | `"Sells often" · 10% of score — 30%` | **Plain Words**: Clear metric meaning. |
| **Factors Footnote**| *(None)* | `"Fresher, bigger, reliable listings show higher."` | **Visibility of System Status**: Explains the ranking logic at a glance. |
| **Intro Sheet Free**| `"Free promotion · Not a paid advertisement."` | `"Free. This is not a paid ad."` | **Dieter Rams (Honest)**: Crisp, unambiguous clarity. |
| **Preview Action** | `"Boost on Facebook & Instagram"` + `"Back"` | `"Boost on Facebook & Instagram"` (sticky bottom bar, redundant "Back" dropped) | **Fitts's Law**: Thumb-reachable sticky CTA; stack arrow handles back navigation. |
| **Started Step 3** | `"Your price can automatically decrease if it remains unsold."` | `"Your price can drop by itself if it does not sell."` | **Plain Words**: Natural everyday phrasing. |
| **Started Heading** | `"What's next?"` | `"What happens now"` | **Plain Words**: Reassuring and present-tense. |

---

### B. Behavior & Style Changes

1. **Header Normalization & Banner Removal**:
   - Change stack header title in `mobile/app/(app)/_layout.tsx` from `"Marketing"` to `"Boost"`.
   - Remove redundant second header block and `SocialHubBanner` from `mobile/app/(app)/marketing/index.tsx` and `ActiveBoostsSection.tsx`, replacing it with a single 44px top intro row with Flame icon and platform badges.
2. **Tab Naming & State Alignment**:
   - Update `MarketingSectionTabs.tsx` tabs to `"Running"`, `"History"`, and `"How Buyers Find You"`.
3. **Skeleton Loading Screens**:
   - Replace generic spinning `ActivityIndicator` in `ActiveBoostsSection` and `[productId].tsx` with structured skeleton shapes matching final prompt and card dimensions (as shown in Frame A3).
4. **Tokenized Badge System**:
   - Eliminate hardcoded `rgba(63, 125, 88, 0.12)`, `rgba(100, 116, 139, 0.12)`, and `#EA580C` strings across `VisibilityBreakdownCard.tsx` and status badges.
   - Enforce unified status badge token styling: `borderRadius: radii.full`, tinted fill, icon, and 11px SemiBold text.
5. **Score Out of 100 & 4-Segment Visual Bar**:
   - Convert raw 4-decimal floating point score (`0.7123`) to rounded whole number (`Score 71 of 100`).
   - Add 4-segment visual progress indicator (1 segment for score > 0, 2 for > 0.25, 3 for > 0.50, 4 for > 0.75).
6. **Progressive Disclosure for Visibility Breakdown**:
   - Refactor `VisibilityFactorsGrid` into an accordion panel toggled by a 44px "Why?" button (with `ChevronDown` / `ChevronUp` indicator), decluttering the default list view.
7. **Preview Screen Layout & Sticky Bottom Bar**:
   - Reorder `[productId].tsx` content:
     1. Eligibility note at the top for immediate feedback.
     2. Platform switcher tabs (Facebook / Instagram) with real-time preview toggle (16:9 vs 1:1 image).
     3. Price drop explanation card.
     4. Existing boost card (when not allowed).
   - Move "Boost on Facebook & Instagram" into a fixed/sticky bottom action bar (`minHeight: 52px`), paired with a text link "See boost history".
   - Drop the redundant secondary "Back" button (handled by the native navigation header).
8. **Confirmation Screen States**:
   - In `started.tsx`, omit the "What happens now" card entirely when all channels fail (`allFailed === true`), focusing the user on error recovery and "View My Produce".

---

## Verification

- **Stitch MCP Generation**: Verified all 14 screens successfully created in project `11184471743007910085`.
- **Visual Design Compliance**: Confirmed 100% adherence to typography (`Inter`), colors (Primary `#0F920F`, Terracotta `#C97850`, Border `#E5E7EB`), 16px card radii, and 14px button radii.
- **Anti-Hallucination Audit**: Verified zero fake engagement metrics (likes, reach, impressions, followers), zero ad budgets or audience targeting, and strict adherence to official Agrivive free post rules.
