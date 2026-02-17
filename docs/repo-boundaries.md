# Repository Boundaries and Publishing Model

This document defines ownership boundaries between the three repositories to prevent content drift.

## Repositories and ownership

### 1) `duksh/finops-calculator`

Primary ownership:

- Calculator product source (`index.html`, `document.html`, assets)
- Product roadmap and planning docs (`docs/roadmap/*`)
- Product operations setup (`.github/ISSUE_TEMPLATE/*`)

Must not be treated as the MCP package source of truth.

### 2) `duksh/finops-calculator-mcp`

Primary ownership:

- MCP server implementation
- MCP schemas and examples
- MCP tests and packaging/release metadata

This repo is the source of truth for all MCP runtime and distribution artifacts.

### 3) `duksh/duksh.github.io`

Primary ownership:

- Public static pages only
- Published/mirrored summaries and documentation pages

Current public roadmap page:

- `/finops-roadmap.html`

No issue templates, internal planning docs, or MCP source code should live here.

## Local checkout to remote mapping

Use these directories as the canonical local checkouts:

- `/Users/duksh/Library/CloudStorage/GoogleDrive-d.koonjoobeeharry@providus.mu/My Drive/FinOps@Providus/finops-calculator`
  - remote: `https://github.com/duksh/finops-calculator.git`
  - working branch: `main`
- `/Users/duksh/Library/CloudStorage/GoogleDrive-d.koonjoobeeharry@providus.mu/My Drive/FinOps@Providus/finops-calculator-mcp`
  - remote: `https://github.com/duksh/finops-calculator-mcp.git`
  - working branch: `main`
- `/Users/duksh/Library/CloudStorage/GoogleDrive-arkadux14@gmail.com/My Drive/duksh@github.io/duksh.github.io`
  - remote: `https://github.com/duksh/duksh.github.io.git`
  - working branch: `main`

## Branch strategy

All three repos are now standardized on **`main` only** for active development and publishing.

`duksh.github.io` default branch and remote HEAD are now `main`.

## Publishing flow

1. Build and validate changes in `finops-calculator`.
2. Mirror selected public pages to `duksh.github.io`.
3. Keep MCP changes only in `finops-calculator-mcp`.

## Guardrails

- Before each push, run `git status` and confirm only intended files are staged.
- Keep commits scoped per repository responsibility.
- Avoid copying MCP workspace into `finops-calculator` unless intentionally vendoring with explicit documentation.
- Keep non-repository scratch files (screenshots, temporary exports, duplicate folders) outside repository roots.
