# N8N Marketing Boost Test Cases

**Project/System:** Agrivive
**Tester:** Jara Joaquin T. Jara
**Test Date:** ____________________
**Build/Version:** ____________________
**Environment:** ____________________
**Overall Result:** ____________________

**Instruction:** Read each test scenario carefully, perform the stated action, and compare the actual result with the expected result. Mark P for Passed or F for Failed and add a short remark for any issue found.

**Notes:** The first post is a normal post. The ranking only decides which listing the automatic round picks next, and a listing cannot be picked again for 6 hours. The 6-hour waits can be skipped by moving the saved times earlier; the worker runs every 60 seconds.

| Test Case ID | Test Scenario / Description | Expected Result | Actual Result | Status | Remarks |
| ------------ | --------------------------- | --------------- | ------------- | ------ | ------- |
| N8N-001 | Post a new listing on social media (First Post). Add produce with a photo and stock, then answer "Post it on Facebook and Instagram?" with Preview Post. | The post goes out as a normal post. The Facebook Page and Instagram each show their own status, from "Waiting to post" to "Posted", with a View link for each. | | | |
| N8N-002 | Boost a listing with no photo (Photo Needed). Try to boost a listing that has no product photo. | The app refuses with "Add a product photo before boosting visibility". Nothing is posted. | | | |
| N8N-003 | Boost a listing with no stock or one that is hidden (Sold Out). Try a listing with 0 kg left, and an archived one. | The app refuses with "This listing is not available to boost". Nothing is posted. | | | |
| N8N-004 | Boost the same listing twice in a row (First Post Gap). Boost a listing, then try to boost it again right away. | The app refuses with "You just boosted this product. Please wait about N hours before you boost it again." No second post is made. | | | |
| N8N-005 | Boost from a seller who is paused or has a high fault rate (Trust Block). Use a seller whose fault rate is 15% or more, then a paused seller. | The app refuses with "Priority Boost is off because your fault rate is 15% or more." or "Priority Boost is off while your account is paused." Nothing is posted. | | | |
| N8N-006 | Call a protected n8n link without the secret key (Authorization). Open the listing details link for n8n with no key, then with a wrong key. | Both times the backend answers 401 "Visibility boost authentication required". No product details are shown. | | | |
| N8N-007 | Check the post text (AI Caption). Post a listing and read the Facebook post. | The text is written by Groq through n8n and shows the listing's real price. The AI writes no link. If the price in the text is wrong, the backend replaces it with its own text. | | | |
| N8N-008 | Facebook or Instagram does not post (Failure and Retry). Post while one or both pages refuse, then tap Post Again. | The page that failed shows "Did not post" and the card says the post did not go out. Post Again goes back to "Waiting to post", not the old failure. Each page then shows its own new result. | | | |
| N8N-009 | Pick the next listing to boost (Ranking and 6-Hour Rule). With several listings ranked by AHP-TOPSIS, let the automatic round run. Then run it again within 6 hours. | The first round picks the top-ranked listing that was not boosted in the last 6 hours. A listing boosted less than 6 hours ago is skipped even when it ranks first, and the next one is picked. | | | |
| N8N-010 | Automatic posting needs a yes (Auto-Post). Make one seller say yes to auto-post and have posted by hand once. Make another seller say no, or never post by hand. | Automatic rounds only pick the listing from the seller who said yes and already made the first post. The other seller's listing is never posted automatically. | | | |
| N8N-011 | Ask the seller for the price drop (6-Hour Notice). Post a listing and wait 6 hours. To skip the wait, move the saved time earlier. Try once with the price drop not set and once already set. | The seller gets one "Set Your Price Drop" notice 6 hours after the post. If the drop amount and final price were already set, no notice is sent. | | | |
| N8N-012 | Save a price drop with missing numbers (Price Drop Check). Turn price drops on without a drop amount or without a final price. | The app refuses with "Set a drop amount and a final price first". The price does not change. | | | |
| N8N-013 | Set the price drop and lower the price (Price Drop). On a cabbage at ₱100, set ₱10 less each time and ₱70 as the final price, then save. | The price goes down once to ₱90.00 and is saved. The next drop is set 6 hours later. n8n never writes to the database. | | | |
| N8N-014 | Keep the final price (Price Floor). On a carrot at ₱75, set ₱10 less each time and ₱70 as the final price. Let the next drop run. | The price stops at exactly ₱70.00, never lower. At ₱70.00 no cut happens and no second post is made. | | | |
| N8N-015 | Post again with the new price (Second Post). After the cabbage drops to ₱90, check the second Facebook post. | The second post is a flash-sale caption written by Groq, shows the new ₱90 price, and is saved as the second post for that listing. | | | |
