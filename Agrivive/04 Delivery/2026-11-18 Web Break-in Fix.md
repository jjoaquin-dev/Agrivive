---
title: Web Break-in Fix
type: delivery
date: 2026-11-18
---

Up: [[Delivery Index 2026-11]] · Snapshot: [[00-LATEST]]

## What happened
The VPS `web` log showed errors named `RCE_RES` and digests that decode to `ok:patched` and `ok:updated`. Someone sent attack requests to the Next.js server and got command output back. The site ran Next 15.5.0 with React 19.1.0, which is in the range hit by the React Server Components attack (CVE-2025-55182).

## Done
- `web`: Next 15.5.0 to 15.5.29, React and React DOM 19.1.0 to 19.1.10 (`web/package.json`, `web/bun.lock`). Typecheck and `next build` pass.
- `docker-compose.yml`: the `web` container no longer loads the whole `.env`. It gets only public values (`NEXT_PUBLIC_*`, `AWS_REGION`, `AWS_S3_BUCKET_NAME`). Before, a break-in on `web` could read database, login and API secrets.

## Owner must do on the VPS
1. Pull, then `docker compose build --no-cache web` and `docker compose up -d --force-recreate`.
2. Treat every secret in the server `.env` as seen by the attacker: change the database password, Better Auth secret, service tokens, Groq, Meta, S3, Resend or Mailtrap, FCM and reCAPTCHA keys, then restart.
3. Look for leftovers: `ps aux --sort=-%cpu | head`, `crontab -l`, `ls /tmp`, `docker ps -a`, and unknown users or keys in `~/.ssh/authorized_keys`. If anything looks wrong, rebuild the server from a clean image.

## Not checked
Whether the attacker got further than the `web` container. The server itself was not inspected from here.
