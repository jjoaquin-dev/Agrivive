---
title: Security Hardening and Cloudflare Audit Remediation
date: 2026-10-20
type: delivery
status: verified
related_documents:
  - "[[2026-10-20 Mobile Splash Screen, App Icon, and App Name Alignment]]"
  - "[[Architecture and Integrations]]"
---

# Security Hardening and Cloudflare Audit Remediation

## What changed

1. **Root-Level Repository Protection**:
   - Created root `.gitignore` to prevent accidental commits of environment secrets (`.env`, `.env.*`), keys/certificates (`*.pem`, `*.key`), and OS/IDE artifacts (`.DS_Store`, `Thumbs.db`).

2. **Authentication Origins Lockdown**:
   - In `backend/src/modules/auth/index.ts`, gated LAN/localhost wildcards (`http://localhost:*`, `http://127.0.0.1:*`, `http://10.0.2.2:*`, `http://192.168.*:*`, `http://10.*:*`) so they are strictly included only in development (`process.env.NODE_ENV !== "production"`). Production environments now only trust explicitly configured scheme and trusted origin domains.

3. **In-Memory Rate Limiting & Protection**:
   - Created `backend/src/plugins/rate-limit.plugin.ts`: A zero-dependency, sliding-window in-memory rate limiter that protects against brute-force credential stuffing and resource exhaustion.
   - Restricts general requests to 120 req/min and sensitive auth endpoints (`/api/auth/*`, `/auth/*`) to 30 req/min per IP.
   - Emits standard `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and `Retry-After` headers; gracefully allows `/health` and `/health/ready` probes.

4. **Global HTTP Security Headers**:
   - Created `backend/src/plugins/security-headers.plugin.ts`: Injects defense-in-depth headers across all API responses:
     - `X-Content-Type-Options: nosniff`
     - `X-Frame-Options: DENY`
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `Permissions-Policy: camera=(self), geolocation=(self), microphone=()`
     - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (in production).

5. **Production CORS & OpenAPI Gating**:
   - In `backend/src/index.ts`, restricted `localWebOrigin` so it is not appended to CORS origins in production when `WEB_TRUSTED_ORIGINS` is configured.
   - Gated `@elysia/openapi` swagger documentation to non-production environments to avoid exposing internal API route schemas to public scrapers.

6. **Next.js Image Optimization Scoping**:
   - In `web/next.config.ts`, replaced global `**.amazonaws.com` wildcard with bucket-specific hostnames matching `${s3Bucket}.s3.${s3Region}.amazonaws.com`, mitigating SSRF and open proxy abuse on Next.js image optimization.

7. **Conversation Attachment Filename Sanitization**:
   - In `backend/src/modules/conversations/services/conversation.attachment.ts`, sanitized user-provided attachment filenames to strip control characters and script injection vectors (`[^a-zA-Z0-9._-]`), defending against stored XSS.

8. **Cloudflare Security Audit Skill Integration**:
   - Installed `cloudflare/security-audit-skill` into `.agents/skills/security-audit/` via `npx skills add`.

## Why

- To close the security vulnerabilities and posture gaps identified during the comprehensive security audit, hardening the Agrivive platform against unauthorized origin access, credential brute-forcing, image proxy abuse, and information disclosure.

## Affected Files

- `.gitignore`
- `backend/src/index.ts`
- `backend/src/modules/auth/index.ts`
- `backend/src/plugins/rate-limit.plugin.ts`
- `backend/src/plugins/security-headers.plugin.ts`
- `backend/src/modules/conversations/services/conversation.attachment.ts`
- `web/next.config.ts`
- `.agents/skills/security-audit/`

## Verification Performed

- Ran `bunx tsc --noEmit` in `backend/` (passed with code 0).
- Ran `bun build src/index.ts --outdir dist --target bun` in `backend/` (bundled 1705 modules in 412ms, exit code 0).
- Ran `bun run typecheck` in `web/` (passed with code 0).
- Ran post-remediation verification scan using Cloudflare Security Audit methodology: all identified high and medium vulnerabilities resolved.
