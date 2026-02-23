# Wave 3 Modularization Backlog

## Goal

Create a modular foundation for FiceCal so new capabilities (starting with AI token economics) can be added with low coupling and lower release risk.

## Backlog lanes

## Lane A: Contracts and metadata (P0)

- [x] Create feature catalog (`src/features/feature-catalog.json`)
- [x] Create module manifests for core, normalization, and AI token economics
- [x] Add manifest validation script
- [x] Add CI workflow for modular guardrails

## Lane B: Runtime extraction scaffolding (P1)

- [x] Introduce `src/core/` runtime shell helpers
- [x] Extract pure economics helpers from `index.html` into `src/core/economics.js`
- [x] Add compatibility adapter so current page behavior is unchanged
- [x] Add feature gate resolver to enable/disable optional modules

## Lane C: UX mode architecture (P1)

- [x] Add explicit mode state (`quick`, `operator`, `architect`)
- [x] Hide advanced controls by mode
- [x] Add mode switcher and persistence in shared state
- [x] Set AI module visibility to Architect mode only

## Lane D: AI token economics module (P2)

- [ ] Implement token cost formulas in isolated module
- [ ] Add module outputs to KPI and recommendation pipeline
- [ ] Add module health checks (allocation reconcile, retry inflation, premium mix)
- [ ] Add baseline scenario presets

## Lane E: GitOps reliability (P1)

- [x] Add `scripts/sync-public-pages.sh` to standardize mirror sync
- [ ] Add release checklist item requiring public mirror verification before “fixed” confirmation
- [ ] Add CI check to ensure docs links point to canonical RTD URL where expected
- [ ] Add release note template section for module changes

## Exit criteria for modularization foundation

1. Feature contracts and catalog are required in CI.
2. Core runtime can execute with optional modules disabled.
3. UI mode strategy controls feature exposure.
4. AI token economics can be developed and tested as an isolated module.
5. Public docs publishing and mirror flow are scripted and repeatable.
