# N8N Marketing Boost Test Cases

**Project/System:** Agrivive
**Tester:** Jara Joaquin T. Jara
**Test Date:** ____________________
**Build/Version:** ____________________
**Environment:** ____________________
**Overall Result:** ____________________

**Instruction:** Read each test scenario carefully, perform the stated action, and compare the actual result with the expected result. Mark P for Passed or F for Failed and add a short remark for any issue found.

| Test Case ID | Test Scenario / Description | Expected Result | Actual Result | Status | Remarks |
| ------------ | --------------------------- | --------------- | ------------- | ------ | ------- |
| N8N-001 | Boost a Priority Boost listing (Seller Boost). As an active seller with a Priority Boost listing (score 0.60 or higher, photo added, stock above 0), open the Boost screen and tap Boost. | The app accepts the boost. The Agrivive Facebook Page and Instagram account each show their own status, from "Waiting to post" to "Posted", with a View link for each post. | | | |
| N8N-002 | Open Boost on a listing below Priority Boost (Gate). As a seller, open the Boost screen of a listing whose score is below 0.60. | The Boost button is off and the screen says Boost opens at Priority Boost, with the listing's current tier. No boost is created and nothing is sent to n8n. | | | |
| N8N-003 | Boost a listing with no stock or that is not active (Sold Out). Try to start a boost on a listing with 0 kg left, or one that is archived. | The backend refuses with a plain message ("This listing is not available to boost"). No boost is queued and nothing is posted. | | | |
| N8N-004 | Call an n8n callback without the service token (Authorization). Send `GET /integrations/visibility-boosts/:id/context` with no Bearer token, then with a wrong one. | The backend returns HTTP 401 "Visibility boost authentication required" both times. No product details are returned. | | | |
| N8N-005 | Check the generated post text (AI Caption). Start a boost and read the Facebook post. | The caption is written by openai/gpt-oss-20b through n8n, shows the listing's real price, and has no link written by the model. A caption with the wrong price is replaced by the backend's own text. | | | |
| N8N-006 | Facebook or Instagram does not post (Failure and Retry). Start a boost while one or both pages refuse the post, then tap Boost again. | The failed page shows "Did not post" and the card says "Boost did not post". Tapping Boost again puts it back to "Waiting to post" (not the old failure), and each page then shows its own new result. | | | |
| N8N-007 | Check the 6-hour follow-up (Scheduling). After the first post is published, read the boost's next price drop time. | The backend saves the next drop time as 6 hours after the first post. n8n does not wait; the worker triggers it at that time. | | | |
| N8N-008 | Lower the price by the seller's amount (Price Drop). Set a cabbage at ₱100 with a ₱10 drop and a ₱70 final price. Let the 6-hour follow-up run. | The backend lowers the price once to ₱90.00 and saves it. n8n never writes to the database. | | | |
| N8N-009 | Keep the final price (Price Floor). Set a carrot at ₱75 with a ₱10 drop and a ₱70 final price. Let the follow-up run. | The price stops at exactly ₱70.00, never below. If it is already at ₱70.00, no cut happens and no second post is made. | | | |
| N8N-010 | Post the follow-up with the new price (Second Post). After the price drops to ₱90 on the cabbage, check the second Facebook post. | The second post shows the new ₱90 price and is saved as the second post for that boost. | | | |
