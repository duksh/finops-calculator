# FiceCal Wave 3 Complete (Release 2)

## Release summary

- **Release name:** Release 2 - Wave 3 Intent-based UI/UX rehauling complete
- **Tag:** r2-wave3-complete
- **Release date:** 2026-02-23
- **Scope statement:** Closeout of Wave 3 intent architecture: intent routing, KPI/recommendation orchestration, guided decision paths, and hardening checks.

## Highlights

- Added full intent-first interaction model (`viability`, `operations`, `architecture`, `executive`) with deterministic mode routing.
- Added intent-guided KPI prioritization and recommendation emphasis while preserving health-score numeric logic.
- Added guided path ribbons with step completion state and one-click intent-tuned export presets.

## Module changes (mandatory)

| Module ID | Version | Rollout status | Schema impact | Migration notes |
| --- | --- | --- | --- | --- |
| core-economics | inherited (no formula change) | active | none | No migration needed. |
| multi-tech-normalization | inherited (no formula change) | active | none | No migration needed. |
| ai-token-economics | inherited (integrated into intent orchestration/export) | active | none | No migration needed. |

> Add/remove module rows as needed. Every changed module must be listed.

## Product and UX updates

- Added top-level intent selector and local persistence.
- Added share-state persistence for `ui` intent key in addition to `um` mode key.
- Added intent-specific KPI ordering, recommendation helper text, and recommendation category tie-break ordering.
- Added guided decision path ribbons with live status (`todo` / `active` / `done`).
- Added intent-specific export presets as CSV from calculator header action panel.

## Model and KPI updates

- No core formula change in Wave 3 closeout.
- Health score and zone calculations remain numerically stable across intents.
- Recommendation eligibility remains zone/provider driven; intent affects presentation emphasis only.

## Docs and operational updates

- Added Wave 3 acceptance checklist: `docs/roadmap/wave-3-acceptance-checklist.md`.
- Updated Wave 3 execution status: `docs/roadmap/wave-3-execution-plan.md`.
- Added Wave 3 regression script: `scripts/test-wave3-intent-share-state.js`.

## Validation evidence

- `node scripts/test-ai-token-economics.js`
- `node scripts/test-wave3-intent-share-state.js`
- `python3 scripts/validate-feature-catalog.py`
- `python3 scripts/validate-doc-links.py`
- Additional checks:
  - Manual acceptance flow using `docs/roadmap/wave-3-acceptance-checklist.md`

## Public mirror verification (required before any "fixed" confirmation)

- [ ] Source repo docs changes committed
- [ ] `scripts/sync-public-pages.sh --check` executed and reviewed
- [ ] Mirror-target diffs for `index.html`, `document.html`, `glossary.html` reviewed
- [ ] Mirror push completed in `duksh/duksh.github.io`

## Risks / follow-ups

- Add browser-automation coverage (Playwright) for guided path transitions as a future enhancement.
- Consider extracting intent/share-state helpers into `src/core/` for cleaner unit testing without HTML script extraction.
