#!/usr/bin/env bash
set -euo pipefail

component="${1:-}"
case "$component" in
  backend|web) ;;
  *) echo "Usage: vps-release.sh backend|web" >&2; exit 2 ;;
esac

: "${VPS_HOST:?Set VPS_HOST in the production GitHub environment.}"
: "${VPS_USER:?Set VPS_USER in the production GitHub environment.}"
: "${VPS_SSH_PRIVATE_KEY:?Set VPS_SSH_PRIVATE_KEY in the production GitHub environment.}"
: "${VPS_SSH_KNOWN_HOSTS:?Set VPS_SSH_KNOWN_HOSTS in the production GitHub environment.}"
: "${GITHUB_SHA:?GitHub commit SHA is required.}"
: "${GITHUB_RUN_ID:?GitHub run ID is required.}"
: "${GITHUB_RUN_ATTEMPT:?GitHub run attempt is required.}"

release_id="${GITHUB_SHA}-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}"
archive="${RUNNER_TEMP}/${component}-${release_id}.tar.gz"
remote_archive="/srv/agrivive/incoming/${component}-${release_id}.tar.gz"

install -d -m 700 "$HOME/.ssh"
printf '%s\n' "$VPS_SSH_PRIVATE_KEY" > "$HOME/.ssh/id_agrivive_deploy"
chmod 600 "$HOME/.ssh/id_agrivive_deploy"
printf '%s\n' "$VPS_SSH_KNOWN_HOSTS" > "$HOME/.ssh/known_hosts"
chmod 600 "$HOME/.ssh/known_hosts"

tar -C "$component" \
  --exclude='.env' \
  --exclude='.env.*' \
  --exclude='node_modules' \
  --exclude='.next/cache' \
  -czf "$archive" .

ssh_options=(-i "$HOME/.ssh/id_agrivive_deploy" -o BatchMode=yes -o StrictHostKeyChecking=yes)
scp "${ssh_options[@]}" "$archive" "${VPS_USER}@${VPS_HOST}:${remote_archive}"

ssh "${ssh_options[@]}" "${VPS_USER}@${VPS_HOST}" \
  "bash -s -- '$component' '$release_id'" <<'REMOTE'
set -euo pipefail

component="$1"
release_id="$2"
case "$component" in backend|web) ;; *) exit 2 ;; esac

root=/srv/agrivive
release="$root/releases/$component/$release_id"
archive="$root/incoming/$component-$release_id.tar.gz"
current="$root/current/$component"
next="$root/current/.$component-$release_id"
previous=""
if [ -L "$current" ]; then
  previous="$(readlink "$current")"
fi

test -f "$archive"
test ! -e "$release"
mkdir -p "$release"
tar -xzf "$archive" -C "$release"

if [ "$component" = backend ]; then
  test -f "$root/shared/backend.env"
  ln -s "$root/shared/backend.env" "$release/.env"
else
  if [ -f "$root/shared/web.env" ]; then
    ln -s "$root/shared/web.env" "$release/.env"
  fi
fi

cd "$release"
bun install --frozen-lockfile --production

activate_release() {
  ln -s "$1" "$next"
  mv -Tf "$next" "$current"
}

restart_services() {
  if [ "$component" = backend ]; then
    sudo -n systemctl restart agrivive-api.service agrivive-worker.service
  else
    sudo -n systemctl restart agrivive-web.service
  fi
}

check_services() {
  if [ "$component" = backend ]; then
    curl --fail --silent --show-error --retry 10 --retry-delay 2 --retry-connrefused \
      --output /dev/null http://127.0.0.1:3000/health/ready || return 1
    sudo -n systemctl is-active --quiet agrivive-api.service || return 1
    sudo -n systemctl is-active --quiet agrivive-worker.service || return 1
  else
    curl --fail --silent --show-error --retry 10 --retry-delay 2 --retry-connrefused \
      --output /dev/null http://127.0.0.1:3001/ || return 1
    sudo -n systemctl is-active --quiet agrivive-web.service || return 1
  fi
}

activate_release "$release"
if ! restart_services || ! check_services; then
  echo "Deployment check failed for $component." >&2
  if [ -n "$previous" ]; then
    activate_release "$previous"
    restart_services || true
  else
    unlink "$current"
  fi
  exit 1
fi

echo "$component release $release_id is active."
REMOTE
