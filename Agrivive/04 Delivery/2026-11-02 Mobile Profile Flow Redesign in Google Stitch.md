---
title: Mobile Profile Flow Redesign in Google Stitch
type: delivery
date: 2026-11-02
---

# Mobile Profile Flow Redesign in Google Stitch

## What Changed

Generated 13 high-fidelity mobile UI mockups in Google Stitch project `AGRIVIVE MOBILE UI` (`11184471743007910085`) under design system `assets/f47dfb9bbc764f6b9ea16ff85a7b3e78` ("Lush Agro-Commerce") covering the complete seller **Profile & Security** flow:
- **Screen A**: Profile Tab (Verified Seller & Good Standing F1 top and F1b scrolled, New Seller with dynamic checklist & unadded fields F2, and Limited/Restricted standing with problem points F3).
- **Sheet B**: Avatar Photo Picker Sheet & Active Uploading State (F4).
- **Screen B**: Edit Profile screen (Filled state with inline phone validation error and sticky Save button F5, and Leave Without Saving confirmation guard F6).
- **Screen C**: First-Time Stall Setup screen (Step 2 of 3 with map pin unplaced error and scroll-to-first-error focus F7).
- **Screen D**: Sign-in Safety screen (Password & Sign-in Code Off F8, Step 2 QR code & key F9a, Step 3 6-digit code boxes with error F9b, Step 4 10 backup codes copied state F10, and Sign-in Code On with inline turn off password confirmation F11).
- **Dialog E**: Log Out confirmation modal dialog (F12).

All mockups strictly enforce Agrivive's design system tokens (Forest Green `#0F920F`, Terracotta `#C97850`, Inter font, 4px grid rhythm, 16px card radius, 14px button radius, 44px touch targets), anti-hallucination rules (zero fake completeness percentages, zero fake ratings or sales stars, zero fake fallbacks, real database fields only), plain language for farmers and market vendors in Davao City, and core UI/UX laws.

---

### Generated Google Stitch Frames (13)

1. **F1 (Profile tab · Verified Seller & Good Standing)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/004df644729b4097a1f3962e467b2641`
   - Features: Clean header without back button; Identity card with 72px avatar, "Aling Nena's Gulay", "Nena Dizon", green "Verified Seller" shield pill, "Selling on Agrivive since Oct 2026", and outline "Edit Profile" button; Account Standing card ("Good Standing", 0 problem points); Your Stall card with 140px Bankerohan map preview, address, pickup note, phone, email; 5-row Settings card; Log Out text button; 5-tab bar with Profile active.

2. **F1b (Profile tab · Scrolled View · Settings & Log Out)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/2ff73f9fd4c6477195d2322c07145423`
   - Features: View scrolled to bottom emphasizing Your Stall contact details, 56px rows for Ratings & Reviews, Account Standing History, Change History, Notifications, Sign-in Safety (with "Off" badge), and separated red #DC2626 "Log Out" action.

3. **F2 (Profile tab · New Seller · Finish Setting Up Checklist)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/716a925372384413a4a56ee5a0b24124`
   - Features: Warning pill "Not Verified Yet"; "Finish Setting Up" card showing "1 of 3 done" (Email Verified ✓, Add your stall ● active with green highlight and ArrowRight, Make a password ○ pending); "Continue" button; Your Stall card displaying missing fields as "Not added yet — Add".

4. **F3 (Profile tab · Limited Account Standing)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/4f78712422d54a2b892727c61c4f2252`
   - Features: Amber warning border; AlertTriangle icon; "Limited until Nov 2, 3:00 PM" headline; reason "Two reservations not answered for 48 hours."; "Problem points: 6 (lower is better)" with 6 in red; amber notice explaining that listings are hidden during restrictions.

5. **F4 (Profile tab · Avatar Photo Sheet & Uploading State)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/9fc3a7d160824ee2bceefd1187c52d39`
   - Features: Dimmed backdrop; bottom sheet modal with 20px top radii and drag handle; "Take Photo" and "Choose from Library" rows (44px icon circles); "Cancel" button; background avatar shows active circular spinner with "Uploading photo...".

6. **F5 (Edit Profile · Filled with Inline Phone Error & Sticky Save Bar)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/99de35c235f04902ae9a5186eb12ff0a`
   - Features: 44px back arrow, subtitle "Buyers see this when they pick up."; "You" card (80px avatar + Change Photo + Full Name); "Your Stall" card (Shop Name, Stall Pin map, 2-line Address, 3-line Pickup Note with counter "38/500"); "Contact" card with phone input in red error border and inline text "Please enter a valid phone number (at least 7 digits)."; sticky 48px "Save Changes" bar. No password fields.

7. **F6 (Edit Profile · Leave Without Saving Dialog)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/9afab55fefd64d478884112a552b8ba0`
   - Features: Dimmed overlay over edited stall form; centered 320px dialog card asking "Leave without saving?"; [Keep Editing] secondary button and [Leave] destructive red button.

8. **F7 (First-Time Setup · Step 2 Pin Not Moved Error & First-Error Scroll)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/dce156f89c954d3da66dc6a154c45792`
   - Features: Progress indicator "Step 2 of 3 · Your Stall" with 3 step dots (1 Email ✓, 2 Stall ●, 3 Password ○); title "Set Up Your Stall"; auto-scrolled to map section with red border and inline error "Move the pin to your stall first."; "Save and Continue" primary button; caption "You get the Verified Seller badge when every step is done.".

9. **F8 (Sign-in Safety · Password & Sign-in Code Off)**:
   - Stitch Screen ID: `projects/11184471743007910085/screens/e459c19385164b2e934792ba5ba2049e`
   - Features: Title "Sign-in Safety", subtitle "Keep other people out of your account."; Card 1 "Sign-in Code" with "Off" pill, plain explainer, and primary "Turn On" button; Card 2 "Password" with "Password is set" status, Current / New / Confirm fields with eye icons, and "Change Password" button.

10. **F9a (Sign-in Code Step 2 · QR & Monospace Key)**:
    - Stitch Screen ID: `projects/11184471743007910085/screens/4ba260a41f17484c9c5b972f8d0b0f09`
    - Features: Stepper header "Step 2 of 4 · Scan this code" with dots 1 ✓, 2 ●, 3 ○, 4 ○; centered 180×180px QR code with white padding; fallback monospace key "JBSWY3DPEHPK3PXP" with Copy button; [Cancel] and [Continue] buttons.

11. **F9b (Sign-in Code Step 3 · Code Boxes with Inline Error)**:
    - Stitch Screen ID: `projects/11184471743007910085/screens/664c338fc378471fbd2f74594834d5f6`
    - Features: Stepper header "Step 3 of 4 · Type the 6-digit code"; 6 discrete input boxes (44×52px) with digits "8 4 9 2 0 1" in red error border; inline error "Invalid or expired code. Please try again." directly beneath; [Cancel] and [Check Code] buttons.

12. **F10 (Sign-in Code Step 4 · Backup Codes Copied State)**:
    - Stitch Screen ID: `projects/11184471743007910085/screens/2d4201c3c4c340d7b159e2f023c5e80c`
    - Features: Stepper header "Step 4 of 4 · Save your backup codes"; amber warning banner "Each code works once. Keep them somewhere safe if you lose access to your authenticator app."; 2-column grid of 10 backup codes; "Copied to Clipboard ✓" feedback state; "I Saved Them" primary button.

13. **F11 (Sign-in Code On · Turn Off Confirm with Password)**:
    - Stitch Screen ID: `projects/11184471743007910085/screens/e427736bbd034d3c96f3cff4c0b6877f`
    - Features: Status pill "On" with green ShieldCheck; explainer "You need a code from your app each time you sign in."; inline soft red confirmation box "Turn Off Sign-in Code" requesting account password; [Cancel] and [Turn Off] destructive buttons.

14. **F12 (Log Out Confirm Dialog)**:
    - Stitch Screen ID: `projects/11184471743007910085/screens/c0795229fa5c487ab5c78208424778ca`
    - Features: Dimmed Profile background; centered dialog with soft red LogOut icon circle; title "Log out of Agrivive?"; body "You will need to sign in again to manage your stall and answer buyer reservations."; 48px [Cancel] and [Log Out] buttons.
