# Meta Graph API & Instagram Business Account Setup

- **Date**: 2026-10-20
- **Type**: Operational Setup / Integration Verification
- **Status**: Verified & Operational

---

## 1. Overview & Objective

To support the Agrivive seller **Priority Boost Visibility** feature, automated social posting to official channels requires active integration with both Facebook and Instagram via the Meta Graph API.

This setup links the official Instagram Professional Business profile (`@agri.vive`) to the Agrivive Facebook Page (`1418061001382207`), provisions a permanent (`Expires: Never`) Page Access Token with full publishing permissions, and validates both endpoints live.

---

## 2. Configuration & Asset Identifiers

| Parameter | Value | Description |
| :--- | :--- | :--- |
| **Meta App Name** | Agrivive | App registered on Meta Developer Platform |
| **Meta App ID** | `2972741166439596` | Application ID |
| **Facebook Page Name** | Agrivive | Official Facebook Page |
| **Facebook Page ID** | `1418061001382207` | Numeric Facebook Page ID |
| **Instagram Account** | `@agri.vive` | Professional Business Profile |
| **Instagram Business Account ID** | `17841436644651187` | 17-digit Meta IG User ID (`SOCIAL_INSTAGRAM_USER_ID`) |
| **Token Type** | `PAGE` | Facebook Page Access Token |
| **Token Expiry** | `0` (`Expires: Never`) | Extended permanent page token |

---

## 3. Granted API Permissions & Scopes

The active token has been validated with the following granular permissions:
- `pages_show_list`
- `pages_read_engagement`
- `pages_manage_posts`
- `instagram_basic`
- `instagram_content_publish`
- `instagram_manage_contents`
- `public_profile`

---

## 4. Verification Performed

Live endpoint tests were executed against the Meta Graph API (`v21.0` / `v26.0`):

1. **Token Validation (`/debug_token`)**:
   - Status: Valid (`is_valid: true`)
   - Type: `PAGE`
   - `expires_at`: `0` (Permanent / Never Expiring)
2. **Page Node (`/1418061001382207?fields=name,instagram_business_account`)**:
   - Confirmed Page `Agrivive` returns `instagram_business_account: { "id": "17841436644651187" }`.
3. **Instagram Node (`/17841436644651187?fields=id,username,name`)**:
   - Successfully resolves to `username: "agri.vive"` and `name: "Agrivive"`.
4. **Backend Typecheck & Build**:
   - `bunx tsc --noEmit` exited with code 0 (zero errors).
   - `bun build src/index.ts --outdir dist --target bun` bundled cleanly.
