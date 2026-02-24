#!/usr/bin/env bash
set -euo pipefail

# Sync selected public pages from finops-calculator source checkout
# to the duksh.github.io checkout.
#
# Usage:
#   ./scripts/sync-public-pages.sh            # copy files
#   ./scripts/sync-public-pages.sh --check    # dry check only

CHECK_ONLY=0
if [[ "${1:-}" == "--check" ]]; then
  CHECK_ONLY=1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$(cd "$SCRIPT_DIR/.." && pwd)"
LOCAL_CONFIG_PATH="$SCRIPT_DIR/sync-public-pages.local.sh"

# Optional local overrides for machine-specific paths.
if [[ -f "$LOCAL_CONFIG_PATH" ]]; then
  # shellcheck source=/dev/null
  source "$LOCAL_CONFIG_PATH"
fi

PUB="${PUB:-}"
if [[ -z "$PUB" ]]; then
  echo "[FAIL] Public repo path is not configured. Set PUB in env or scripts/sync-public-pages.local.sh"
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

echo "\nPre-sync status:"
git -C "$SRC" status --short || true
git -C "$PUB" status --short || true

echo "\nComparing files:"
for f in "${FILES[@]}"; do
  if cmp -s "$SRC/$f" "$PUB/$f"; then
    echo "[OK] $f already in sync"
  else
    echo "[DIFF] $f differs"
    if [[ "$CHECK_ONLY" -eq 0 ]]; then
      cp "$SRC/$f" "$PUB/$f"
      echo "[SYNC] copied $f"
    fi
  fi
done

if [[ "$CHECK_ONLY" -eq 1 ]]; then
  echo "\nCheck-only mode: no files copied."
  exit 0
fi

echo "\nPost-sync status (public repo):"
git -C "$PUB" status --short || true

echo "\nNext step:"
echo "  git -C \"$PUB\" add index.html document.html glossary.html"
echo "  git -C \"$PUB\" commit -m \"docs: sync public pages\""
echo "  git -C \"$PUB\" push"
