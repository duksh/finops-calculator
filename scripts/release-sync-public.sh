#!/usr/bin/env bash
set -euo pipefail

# One-step public mirror release sync for duksh.github.io.
#
# Modes:
#   ./scripts/release-sync-public.sh
#     Sync pages + src, commit in public repo, and push.
#
#   ./scripts/release-sync-public.sh --check
#     Guard mode. Exit non-zero if public repo is out of sync.
#
# Optional flags:
#   --no-push        Commit but do not push.
#   --commit-message "..."  Override commit message.

CHECK_ONLY=0
NO_PUSH=0
COMMIT_MESSAGE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --check)
      CHECK_ONLY=1
      shift
      ;;
    --no-push)
      NO_PUSH=1
      shift
      ;;
    --commit-message)
      COMMIT_MESSAGE="${2:-}"
      if [[ -z "$COMMIT_MESSAGE" ]]; then
        echo "[FAIL] --commit-message requires a value"
        exit 2
      fi
      shift 2
      ;;
    *)
      echo "[FAIL] Unknown argument: $1"
      echo "Usage: ./scripts/release-sync-public.sh [--check] [--no-push] [--commit-message \"...\"]"
      exit 2
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$(cd "$SCRIPT_DIR/.." && pwd)"
SYNC_LOCAL_CONFIG_PATH="$SCRIPT_DIR/sync-public-pages.local.sh"
MAPPING_LOCAL_CONFIG_PATH="$SCRIPT_DIR/check-repo-mapping.local.sh"

if [[ -f "$SYNC_LOCAL_CONFIG_PATH" ]]; then
  # shellcheck source=/dev/null
  source "$SYNC_LOCAL_CONFIG_PATH"
fi

if [[ -f "$MAPPING_LOCAL_CONFIG_PATH" ]]; then
  # shellcheck source=/dev/null
  source "$MAPPING_LOCAL_CONFIG_PATH"
fi

PUB="${PUB:-${DUKSH_GITHUB_IO_PATH:-}}"
if [[ -z "$PUB" ]]; then
  echo "[FAIL] Public repo path is not configured. Set PUB or DUKSH_GITHUB_IO_PATH in local config."
  echo "       See scripts/sync-public-pages.local.example.sh and scripts/check-repo-mapping.local.example.sh"
  exit 1
fi

FILES=(
  "index.html"
  "document.html"
  "glossary.html"
)

if [[ ! -d "$SRC/.git" ]]; then
  echo "[FAIL] Source repo not found at $SRC"
  exit 1
fi

if [[ ! -d "$PUB/.git" ]]; then
  echo "[FAIL] Public repo not found at $PUB"
  exit 1
fi

echo "Source: $SRC"
echo "Public: $PUB"

out_of_sync=0

echo "\nComparing top-level pages:"
for f in "${FILES[@]}"; do
  if cmp -s "$SRC/$f" "$PUB/$f"; then
    echo "[OK] $f already in sync"
  else
    echo "[DIFF] $f differs"
    out_of_sync=1
  fi
done

echo "\nComparing runtime assets (src/):"
SRC_DIFF_PREVIEW="$(rsync -anic --omit-dir-times --no-perms --no-owner --no-group "$SRC/src/" "$PUB/src/" || true)"
if [[ -n "$SRC_DIFF_PREVIEW" ]]; then
  echo "[DIFF] src/ differs"
  out_of_sync=1
else
  echo "[OK] src/ already in sync"
fi

if [[ "$CHECK_ONLY" -eq 1 ]]; then
  if [[ "$out_of_sync" -eq 1 ]]; then
    echo "\n[FAIL] Public mirror is out of sync with source."
    echo "Run: ./scripts/release-sync-public.sh"
    exit 1
  fi
  echo "\n[PASS] Public mirror is in sync."
  exit 0
fi

if [[ "$out_of_sync" -eq 0 ]]; then
  echo "\n[OK] Nothing to sync. Public mirror already matches source."
  exit 0
fi

echo "\nSyncing top-level pages..."
for f in "${FILES[@]}"; do
  cp "$SRC/$f" "$PUB/$f"
done

echo "Syncing runtime assets (src/)..."
rsync -a "$SRC/src/" "$PUB/src/"

echo "\nPublic repo status after sync:"
git -C "$PUB" status --short || true

echo "\nStaging synced files..."
git -C "$PUB" add index.html document.html glossary.html src/

if [[ -z "$(git -C "$PUB" diff --cached --name-only)" ]]; then
  echo "[OK] No staged changes to commit after sync."
  exit 0
fi

if [[ -z "$COMMIT_MESSAGE" ]]; then
  SRC_SHA="$(git -C "$SRC" rev-parse --short HEAD)"
  COMMIT_MESSAGE="docs: sync public mirror from finops-calculator ${SRC_SHA}"
fi

echo "Committing in public repo..."
git -C "$PUB" commit -m "$COMMIT_MESSAGE"

if [[ "$NO_PUSH" -eq 1 ]]; then
  echo "\n[INFO] --no-push enabled. Commit created but not pushed."
  exit 0
fi

echo "Pushing public repo..."
git -C "$PUB" push

echo "\n[PASS] Public mirror synced and pushed."
echo "Verify: https://duksh.github.io/#calculator-section"
