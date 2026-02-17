#!/usr/bin/env bash
set -euo pipefail

STRICT_CLEAN=0
if [[ "${1:-}" == "--strict-clean" ]]; then
  STRICT_CLEAN=1
fi

# name|path|expected_origin|expected_branch
REPOS=(
  "finops-calculator|/Users/duksh/Library/CloudStorage/GoogleDrive-d.koonjoobeeharry@providus.mu/My Drive/FinOps@Providus/finops-calculator|https://github.com/duksh/finops-calculator.git|main"
  "finops-calculator-mcp|/Users/duksh/Library/CloudStorage/GoogleDrive-d.koonjoobeeharry@providus.mu/My Drive/FinOps@Providus/finops-calculator-mcp|https://github.com/duksh/finops-calculator-mcp.git|main"
  "duksh.github.io|/Users/duksh/Library/CloudStorage/GoogleDrive-arkadux14@gmail.com/My Drive/duksh@github.io/duksh.github.io|https://github.com/duksh/duksh.github.io.git|main"
)

failures=0
warnings=0

print_result() {
  local level="$1"
  local repo="$2"
  local msg="$3"
  printf "[%s] %s: %s\n" "$level" "$repo" "$msg"
}

check_repo() {
  local name="$1"
  local path="$2"
  local expected_origin="$3"
  local expected_branch="$4"

  if [[ ! -d "$path" ]]; then
    print_result "FAIL" "$name" "path not found: $path"
    failures=$((failures + 1))
    return
  fi

  if [[ ! -d "$path/.git" ]]; then
    print_result "FAIL" "$name" "not a git repository: $path"
    failures=$((failures + 1))
    return
  fi

  local actual_origin
  actual_origin="$(git -C "$path" remote get-url origin 2>/dev/null || true)"
  if [[ "$actual_origin" != "$expected_origin" ]]; then
    print_result "FAIL" "$name" "origin mismatch (expected $expected_origin, got ${actual_origin:-<none>})"
    failures=$((failures + 1))
  else
    print_result "PASS" "$name" "origin matches"
  fi

  local branch
  branch="$(git -C "$path" symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
  if [[ "$branch" != "$expected_branch" ]]; then
    print_result "FAIL" "$name" "branch mismatch (expected $expected_branch, got ${branch:-<detached>})"
    failures=$((failures + 1))
  else
    print_result "PASS" "$name" "branch is $expected_branch"
  fi

  local upstream
  upstream="$(git -C "$path" rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
  if [[ "$upstream" != "origin/$expected_branch" ]]; then
    print_result "WARN" "$name" "upstream is ${upstream:-<unset>} (expected origin/$expected_branch)"
    warnings=$((warnings + 1))
  else
    print_result "PASS" "$name" "upstream is origin/$expected_branch"
  fi

  local changes
  changes="$(git -C "$path" status --porcelain 2>/dev/null || true)"
  if [[ -n "$changes" ]]; then
    if [[ "$STRICT_CLEAN" -eq 1 ]]; then
      print_result "FAIL" "$name" "working tree not clean (--strict-clean enabled)"
      failures=$((failures + 1))
    else
      print_result "WARN" "$name" "working tree has local changes"
      warnings=$((warnings + 1))
    fi
  else
    print_result "PASS" "$name" "working tree clean"
  fi
}

for repo in "${REPOS[@]}"; do
  IFS='|' read -r name path expected_origin expected_branch <<< "$repo"
  check_repo "$name" "$path" "$expected_origin" "$expected_branch"
  echo ""
done

if [[ "$failures" -gt 0 ]]; then
  printf "Mapping check completed with %d failure(s) and %d warning(s).\n" "$failures" "$warnings"
  exit 1
fi

printf "Mapping check passed with %d warning(s).\n" "$warnings"
exit 0
