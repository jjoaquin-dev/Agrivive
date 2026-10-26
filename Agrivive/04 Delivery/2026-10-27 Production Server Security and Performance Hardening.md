# 2026-10-27 Production Server Security and Performance Hardening

## Overview
Hardened the production server configuration against external penetration, DDoS, resource exhaustion (OOM), and disk exhaustion across Caddy reverse proxy and Docker container configurations.

## What Changed

1. **Caddy Reverse Proxy (`deploy/Caddyfile`)**:
   - Added `(security_headers)` snippet applying:
     - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (HSTS).
     - `X-Content-Type-Options: nosniff` (MIME sniffing defense).
     - `X-Frame-Options: SAMEORIGIN` (Clickjacking defense).
     - `Referrer-Policy: strict-origin-when-cross-origin`.
     - Explicit removal of server signature headers (`-Server` and `-X-Powered-By`) to prevent technology stack reconnaissance.
   - Added `request_body` size limits (15MB for web, 25MB for API) to prevent payload-based memory exhaustion attacks.
   - Enhanced `reverse_proxy` transport headers (`Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`) for accurate client IP tracking.

2. **Container Resource Limits & Log Rotation (`docker-compose.yml`)**:
   - Implemented `deploy.resources.limits` across all 4 production containers:
     - `api`: 1.5 CPUs, 1536M RAM.
     - `web`: 1.5 CPUs, 1536M RAM.
     - `worker`: 0.5 CPUs, 512M RAM.
     - `proxy`: 0.5 CPUs, 256M RAM.
   - Configured Docker `json-file` logging driver with strict file caps (`max-size: 20m`, `max-file: 5` for high-volume services; `max-size: 10m`, `max-file: 3` for auxiliary services) to prevent unmonitored disk exhaustion.

## Affected Files
- `deploy/Caddyfile`
- `docker-compose.yml`

## Verification Performed
- Validated `docker-compose.yml` schema and syntax using `docker compose --env-file .env.example config --quiet`.
- Confirmed file line counts: `docker-compose.yml` (105 lines $\le 200$), `deploy/Caddyfile` (52 lines $\le 200$).
