# FiceCal Release Note Template

## Release summary

- **Release name:**
- **Tag:**
- **Release date:**
- **Scope statement:**

## Highlights

- 
- 
- 

## Module changes (mandatory)

| Module ID | Version | Rollout status | Schema impact | Migration notes |
| --- | --- | --- | --- | --- |
| core-economics | | active/experimental/deprecated/disabled | none/minor/major | |
| multi-tech-normalization | | active/experimental/deprecated/disabled | none/minor/major | |
| ai-token-economics | | active/experimental/deprecated/disabled | none/minor/major | |

> Add/remove module rows as needed. Every changed module must be listed.

## Product and UX updates

- 
- 

## Model and KPI updates

- 
- 

## Docs and operational updates

- 
- 

## Validation evidence

- `python3 scripts/validate-feature-catalog.py`
- `python3 scripts/validate-doc-links.py`
- Additional checks:
  - 

## Public mirror verification (required before any "fixed" confirmation)

- [ ] Source repo docs changes committed
- [ ] `scripts/sync-public-pages.sh --check` executed and reviewed
- [ ] Mirror-target diffs for `index.html`, `document.html`, `glossary.html` reviewed
- [ ] Mirror push completed in `duksh/duksh.github.io`

## Risks / follow-ups

- 
- 
