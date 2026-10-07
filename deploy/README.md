# VPS deployment

The backend and web CD workflows are manual. Once their files are on the repository's default `main` branch, run **Deploy Backend** or **Deploy Web** from GitHub Actions. Existing CI checks remain separate. Neither workflow applies database migrations or changes the n8n workflow.

## Prepare the server

Use an Ubuntu x86-64 VPS with Bun, Node.js 22, `tar`, `curl`, and `systemd`. Configure an HTTPS reverse proxy to send the API hostname to port 3000 and the buyer website hostname to port 3001. Keep those application ports off the public internet. Create a non-root deploy user and these deploy-user-writable directories:

```text
/srv/agrivive/incoming
/srv/agrivive/releases/backend
/srv/agrivive/releases/web
/srv/agrivive/current
/srv/agrivive/shared
```

Place the backend's private configuration at `/srv/agrivive/shared/backend.env`, readable by the deploy user and API/worker services. The web's optional private configuration belongs at `/srv/agrivive/shared/web.env`. Never put secrets in GitHub variables or `NEXT_PUBLIC_` settings. Back up the database before any separately approved migration.

Create `agrivive-api.service`, `agrivive-worker.service`, and `agrivive-web.service` with working directories `/srv/agrivive/current/backend`, `/srv/agrivive/current/backend`, and `/srv/agrivive/current/web`, respectively. Start the backend from `dist/index.js`, its **single** worker from `dist/worker.js`, and the web server with `node_modules/.bin/next start --port 3001`. Give the deploy user passwordless `systemctl restart` and `systemctl is-active` permission **only** for these three service units. Set the service environment to production and enable restart-on-failure. The deploy user must be able to create releases but should not be a root login.

The first deployment needs the service units and `/srv/agrivive/current` directory prepared, but their targets need not exist yet. Failed health checks switch the symlink back to the previous release when one exists and restart the affected services. Releases remain on disk for rollback; review disk usage and remove old releases manually only after confirming they are not active.

## Configure GitHub

Create a `production` environment and restrict it to `main`. Add these environment **secrets**:

- `VPS_HOST`: server hostname or IP address.
- `VPS_USER`: non-root deploy username.
- `VPS_SSH_PRIVATE_KEY`: private key for that deploy user.
- `VPS_SSH_KNOWN_HOSTS`: verified host-key line for the server. Obtain and verify its fingerprint outside the workflow; do not blindly trust `ssh-keyscan` output.

If your GitHub plan or repository visibility does not allow environment secrets, put the same names in repository secrets; the workflows use GitHub's `secrets` context. Keep the manual trigger and `main` branch guard in place.

Add the environment **variable** `PUBLIC_API_URL` with the full `https://` API origin. The web workflow rejects an empty or non-HTTPS value and includes it in the Next.js build as `NEXT_PUBLIC_API_URL`. It is public configuration, not a secret.

On the server, set production `DATABASE_URL`, `BETTER_AUTH_URL`, `WEB_TRUSTED_ORIGINS`, `WEB_APP_URL`, mail and S3 settings, and the rotated `N8N_PROMOTION_SERVICE_TOKEN` as appropriate. Set `N8N_PROMOTION_WEBHOOK_URL` to the n8n webhook origin. Keep the n8n Header Auth credential in sync with the backend's service token. Do not paste token values into GitHub workflow files or logs.

## Run and verify

1. Merge the desired commit into `main`; manual GitHub workflows are available from the default branch.
2. Run **Deploy Backend** and confirm its readiness check and single worker are healthy.
3. Run **Deploy Web** and confirm it points to the production HTTPS API.
4. In a browser, check the HTTPS website and API `/health/ready`, then manually test sign-in and one buyer/seller flow. An Actions success alone does not prove end-to-end behavior.

The mobile EAS build is a separate step. This deployment does not publish or update a mobile app.
