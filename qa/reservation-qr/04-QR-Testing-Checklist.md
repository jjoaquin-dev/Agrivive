# QR Testing Checklist

Payload: `v1.<36-char order id>.<43-char signature>` = 83 characters. Web renders it with `qrcode.react`; seller app scans with the device camera. Error correction level and module size were **not** confirmed in code. Record what you observe.

Pass only when you scanned it yourself and filled the evidence. Leave blank otherwise.

## 0. Setup (fill once)

| Item | Value |
|---|---|
| Git commit under test | |
| Backend build (source or `dist`, rebuilt?) | |
| Seller app build (APK version) | |
| Tester / date | |
| Display used for QR (web browser, phone app) | |

## 1. Three phones

| Phone | Model | OS | Camera MP | Seller app version |
|---|---|---|---|---|
| P-A | | | | |
| P-B | | | | |
| P-C | | | | |

Rule: each phone scans the same set of QR codes: (a) buyer phone screen at full brightness, (b) buyer laptop screen, (c) projector/large display, (d) printed paper if used.

## 2. Two lighting conditions

| Code | Condition | Lux (app or meter) | Notes |
|---|---|---|---|
| L1 | Bright (outdoor shade or lit room) | | |
| L2 | Dim (indoor evening, stall light only) | | |

## 3. Scan time log

Time from camera showing the QR to the "scan accepted" screen. Use screen recording, count frames, or a stopwatch. 3 attempts per cell; write all three, then the median. Mark `FAIL` if no read within 10 s (this timeout is a **suggested** value, not a project requirement; confirm with the professor).

| Phone | Light | Source display | Try 1 (s) | Try 2 (s) | Try 3 (s) | Median | Result | Evidence |
|---|---|---|---|---|---|---|---|---|
| P-A | L1 | Phone screen | | | | | | |
| P-A | L1 | Laptop | | | | | | |
| P-A | L2 | Phone screen | | | | | | |
| P-A | L2 | Laptop | | | | | | |
| P-B | L1 | Phone screen | | | | | | |
| P-B | L1 | Laptop | | | | | | |
| P-B | L2 | Phone screen | | | | | | |
| P-B | L2 | Laptop | | | | | | |
| P-C | L1 | Phone screen | | | | | | |
| P-C | L1 | Laptop | | | | | | |
| P-C | L2 | Phone screen | | | | | | |
| P-C | L2 | Laptop | | | | | | |

Status of this section: **Not Tested**.

## 4. Large screen / projector readability

| Check | Distance (m) | QR size on screen (cm) | Phone | Reads? | Notes |
|---|---|---|---|---|---|
| Projector, full-screen QR | 1 | | | | |
| Projector, full-screen QR | 3 | | | | |
| Projector, full-screen QR | 5 | | | | |
| Projector, dim room | 3 | | | | |
| Projector, bright room | 3 | | | | |
| Glare on screen / angled 30° | 2 | | | | |
| Phone brightness at 30% | 0.3 | | | | |

Also check: the QR keeps a quiet (white) border; the page is not zoomed so the QR is cut; dark mode does not invert the code; screen auto-dim does not turn it off before scanning.

## 5. Functional checks during field testing

| Check | Result | Evidence |
|---|---|---|
| Valid QR → handover sheet shows correct items and total | | |
| Same QR scanned twice → second shows "no longer pending" | | |
| Screenshot of QR sent to another phone, scanned after the first pickup completed → rejected | | |
| QR of a cancelled order → no QR shown to buyer; old screenshot rejected | | |
| QR of an expired order → rejected with an "expired" message | | |
| Non-Agrivive QR (URL, Wi-Fi code) → "Invalid Code", no crash | | |
| Camera permission denied → clear message and a way to retry | | |
| Poor network at scan time → clear error, order not half-completed (check order status afterwards) | | |
| Seller scans an order of another seller → rejected | | |

## 6. Result

| Question | Answer |
|---|---|
| Any phone that failed in any condition? | |
| Slowest median scan time | |
| Smallest projector size that read on all phones | |
| Issues to report (link to evidence) | |
