---
title: UAT Beta Test Cases Buyer and Seller
type: test-sheet
status: draft
---

# UAT Beta Test Cases: Buyer and Seller

Parent: [[Docs Index]]

Mark each case **Pass** or **Fail**. If Fail, write what went wrong in Notes. Do not help the tester while they work.

Tester name: ____________  Date: ____________  Device / browser: ____________

## A. Buyer (website)

| # | Task | Expected result | Pass | Fail | Notes |
|---|------|-----------------|:----:|:----:|-------|
| B1 | Create an account with your email and sign in with the code sent to you. | You land on the marketplace, signed in. | ☐ | ☐ | |
| B2 | Find a vegetable using search or a category. | The matching produce shows up. | ☐ | ☐ | |
| B3 | Open a produce page. | You can see the photo, price, amount left and the seller's stall. | ☐ | ☐ | |
| B4 | Add the produce to your cart and reserve it. | The reservation is made and appears in My Orders. | ☐ | ☐ | |
| B5 | Choose a pickup time (Today or Tomorrow). | Your chosen time shows on the order. | ☐ | ☐ | |
| B6 | Open your Digital Pickup Pass. | A QR code shows for that order. | ☐ | ☐ | |
| B7 | Send a message to the seller. | The message sends and shows in Messages. | ☐ | ☐ | |
| B8 | Cancel a different reservation. | The order shows as cancelled and you get a notice. | ☐ | ☐ | |
| B9 | After pickup, leave a review (stars, and optional comment or photo). | The review is saved and shows on the order. | ☐ | ☐ | |
| B10 | Read every screen above. Is the wording easy to understand with no help? | You never had to ask what a word or button meant. | ☐ | ☐ | |

Buyer result: ____ of 10 passed.

### Buyer user experience

Mark **Pass** if the statement is true for you, **Fail** if it is not.

| # | Statement | Pass | Fail | Notes |
|---|-----------|:----:|:----:|-------|
| BX1 | I knew what to do first when I opened the website. | ☐ | ☐ | |
| BX2 | I could find the produce I wanted in under one minute. | ☐ | ☐ | |
| BX3 | The produce photos and prices were clear and easy to read. | ☐ | ☐ | |
| BX4 | Reserving took few steps and I never felt lost. | ☐ | ☐ | |
| BX5 | I always knew the status of my order (reserved, ready, done). | ☐ | ☐ | |
| BX6 | Buttons and text were big enough to tap or click easily. | ☐ | ☐ | |
| BX7 | Pages loaded fast, and I saw a clear sign while waiting. | ☐ | ☐ | |
| BX8 | When I made a mistake, the message told me exactly how to fix it. | ☐ | ☐ | |
| BX9 | The site looked clean, trustworthy and worked well on my phone. | ☐ | ☐ | |
| BX10 | I would use Agrivive again to buy my vegetables. | ☐ | ☐ | |

Buyer experience result: ____ of 10 passed.

## B. Seller (Android app)

| # | Task | Expected result | Pass | Fail | Notes |
|---|------|-----------------|:----:|:----:|-------|
| S1 | Install the app, sign in, and finish Seller Setup. | Setup is complete and you reach Home. | ☐ | ☐ | |
| S2 | Add a produce listing with a photo, price and amount. | The listing shows in Listings and on the buyer website. | ☐ | ☐ | |
| S3 | Use Add More or Take Away to change the amount. | The new amount shows right away. | ☐ | ☐ | |
| S4 | Receive a buyer's reservation. | The order shows in Reservations and you get a notice. | ☐ | ☐ | |
| S5 | Open the reservation and read the order details. | You can see the buyer, items, amount and pickup time. | ☐ | ☐ | |
| S6 | Scan the buyer's QR code at pickup. | The scan works and the order opens. | ☐ | ☐ | |
| S7 | Finish the handover. | The order shows as complete and the buyer sees it. | ☐ | ☐ | |
| S8 | Reply to a buyer's message. | The buyer receives your reply. | ☐ | ☐ | |
| S9 | Open Notifications and Weather & Holidays. | Both open and show current information. | ☐ | ☐ | |
| S10 | Read every screen above. Is the wording easy to understand with no help? | You never had to ask what a word or button meant. | ☐ | ☐ | |

Seller result: ____ of 10 passed.

### Seller user experience

Mark **Pass** if the statement is true for you, **Fail** if it is not.

| # | Statement | Pass | Fail | Notes |
|---|-----------|:----:|:----:|-------|
| SX1 | I knew what to do first after opening the app. | ☐ | ☐ | |
| SX2 | Adding produce took less than 3 minutes without help. | ☐ | ☐ | |
| SX3 | The app is easy to use with one hand and in sunlight at the stall. | ☐ | ☐ | |
| SX4 | Buttons were big enough and I rarely tapped the wrong one. | ☐ | ☐ | |
| SX5 | I could tell new reservations from finished ones at a glance. | ☐ | ☐ | |
| SX6 | Scanning the QR code was quick and worked on the first or second try. | ☐ | ☐ | |
| SX7 | The words in the app were simple and I understood all of them. | ☐ | ☐ | |
| SX8 | Notices came at useful times and did not feel like too many. | ☐ | ☐ | |
| SX9 | The app felt fast and never froze or closed by itself. | ☐ | ☐ | |
| SX10 | I would use Agrivive every day to sell my produce. | ☐ | ☐ | |

Seller experience result: ____ of 10 passed.

## Rule for the team

Score the task cases and the experience statements on their own, for each role.

- 9 or 10 passed: ready.
- 7 or 8 passed: fix the failed items, then test again.
- 6 or fewer passed: do not release.
- Experience statements BX10 and SX10 ("I would use it again") are the overall verdict. Count how many testers passed them.
- Any failed case on B4, B6, S6 or S7 blocks release, because reserving and pickup are the main job of the app.

Tested results are recorded only after the tester reports them.
