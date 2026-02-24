#!/usr/bin/env bash
set -euo pipefail

STRICT_CLEAN=0
if [[ "${1:-}" == "--strict-clean" ]]; then
  STRICT_CLEAN=1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CALCULATOR_REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOCAL_CONFIG_PATH="$SCRIPT_DIR/check-repo-mapping.local.sh"

# Optional local overrides for machine-specific paths (ignored in git).
if [[ -f "$LOCAL_CONFIG_PATH" ]]; then
  # shellcheck source=/dev/null
  source "$LOCAL_CONFIG_PATH"
fi

FINOPS_CALCULATOR_PATH="${FINOPS_CALCULATOR_PATH:-$CALCULATOR_REPO_ROOT}"
FINOPS_CALCULATOR_ORIGIN="${FINOPS_CALCULATOR_ORIGIN:-https://github.com/duksh/finops-calculator.git}"
FINOPS_CALCULATOR_BRANCH="${FINOPS_CALCULATOR_BRANCH:-main}"

FINOPS_CALCULATOR_MCP_ORIGIN="${FINOPS_CALCULATOR_MCP_ORIGIN:-https://github.com/duksh/finops-calculator-mcp.git}"
FINOPS_CALCULATOR_MCP_BRANCH="${FINOPS_CALCULATOR_MCP_BRANCH:-main}"

DUKSH_GITHUB_IO_ORIGIN="${DUKSH_GITHUB_IO_ORIGIN:-https://github.com/duksh/duksh.github.io.git}"
DUKSH_GITHUB_IO_BRANCH="${DUKSH_GITHUB_IO_BRANCH:-main}"

# name|path|expected_origin|expected_branch
REPOS=(
  "finops-calculator|$FINOPS_CALCULATOR_PATH|$FINOPS_CALCULATOR_ORIGIN|$FINOPS_CALCULATOR_BRANCH"
)

if [[ -n "${FINOPS_CALCULATOR_MCP_PATH:-}" ]]; then
  REPOS+=("finops-calculator-mcp|$FINOPS_CALCULATOR_MCP_PATH|$FINOPS_CALCULATOR_MCP_ORIGIN|$FINOPS_CALCULATOR_MCP_BRANCH")
fi

if [[ -n "${DUKSH_GITHUB_IO_PATH:-}" ]]; then
  REPOS+=("duksh.github.io|$DUKSH_GITHUB_IO_PATH|$DUKSH_GITHUB_IO_ORIGIN|$DUKSH_GITHUB_IO_BRANCH")
fi

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

if [[ -z "${FINOPS_CALCULATOR_MCP_PATH:-}" ]]; then
  print_result "WARN" "finops-calculator-mcp" "path not configured (set FINOPS_CALCULATOR_MCP_PATH in env or scripts/check-repo-mapping.local.sh)"
  warnings=$((warnings + 1))
  echo ""
fi

if [[ -z "${DUKSH_GITHUB_IO_PATH:-}" ]]; then
  print_result "WARN" "duksh.github.io" "path not configured (set DUKSH_GITHUB_IO_PATH in env or scripts/check-repo-mapping.local.sh)"
  warnings=$((warnings + 1))
  echo ""
fi

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
