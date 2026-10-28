# Facebook Page Public Visibility and Permanent Token

**Date:** 2026-10-27
**Type:** Bug Fix & Integration Enhancement
**Scope:** Meta Graph API Publishing (`backend`)

## Context and Problem
Posts published from Agrivive to the official Facebook Page (`1418061001382207`) via Meta Graph API were only visible to the Page Admin/Developer and completely invisible to public followers and visitors, while Instagram posts remained publicly visible.

## Root Cause Analysis
1. **Meta App Mode Sandbox (Development Mode)**: The original Meta App (`2972741166439596`) had `Marketing API` and `Meta Ads Manager` use cases added. These use cases classified the application as a "Tech Provider" and locked it behind mandatory corporate Business Verification and Access Verification, preventing it from going Live. In Development mode, Meta strictly hides all API-created feed posts from anyone without a registered developer or admin role on the app.
2. **Missing `published: true` Flag**: `publishFacebookPagePhoto` called `POST /{version}/{pageId}/photos` without explicitly specifying `published: "true"`, causing photo uploads to be processed as album photos rather than immediate public timeline feed stories.

## Solution and Key Actions
1. **Clean Meta App Provisioning (`Agrivive_social`)**:
   - Created a clean Meta App (App ID: `2395489227863063`) without Marketing API, Ads Manager, or enterprise business constraints.
   - Configured only the necessary use cases: `Manage everything on your Page` and `Manage messaging & content on Instagram`.
   - Enabled granular scopes: `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`, `instagram_manage_contents`.
2. **Permanent, Never-Expiring Page Access Token**:
   - Generated a long-lived User Access Token and exchanged it against `GET /{page-id}?fields=access_token`.
   - Verified the derived Page Access Token via Meta Debug API:
     - `type`: `"PAGE"`
     - `expires_at`: `0` (`Never expires`)
     - `profile_id`: `"1418061001382207"` (Agrivive Facebook Page)
     - `instagram_business_account`: `"17841436644651187"`
   - Updated `backend/.env` with the new permanent token.
3. **Explicit Timeline Story Publishing**:
   - Updated `backend/src/modules/integrations/services/integrations.social-publish-facebook.ts` to include `published: "true"` in the `URLSearchParams` request body.

## Affected Files
- `backend/src/modules/integrations/services/integrations.social-publish-facebook.ts`: Explicitly added `published: "true"` to photo upload parameters.
- `backend/.env`: Updated `SOCIAL_META_PAGE_ACCESS_TOKEN` with the permanent, non-expiring Page Token.
- `backend/dist/index.js`: Rebuilt production bundle.

## Verification
- `bunx tsc --noEmit` in `backend/`: Passed with 0 errors.
- `bun build src/index.ts --outdir dist --target bun`: Successfully bundled 1819 modules.
- Meta Graph API Token Debug: Confirmed `is_valid: true`, `expires_at: 0`, and full publishing scopes.
