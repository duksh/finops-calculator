# Wave 3 Execution Plan (Current)

## Purpose

Provide a single operational plan for what is completed in Wave 3, what remains, and how Intent-based UI/UX rehauling is staged without destabilizing the core calculator.

---

## Current delivery status

Source of truth for lane tracking remains:

- `docs/roadmap/wave-3-modularization-backlog.md`

Snapshot:

- Lane A (contracts + metadata): complete
- Lane B (runtime extraction scaffolding): complete
- Lane C (mode architecture): complete
- Lane D (AI token economics MVP): complete
- Lane E (GitOps reliability): complete

---

## Immediate next execution (Intent-based UI/UX rehauling)

Progress snapshot:

- I1. Intent selector and routing: complete
- I2. KPI and recommendation orchestration: complete
- I3. Guided decision paths: complete

Closeout artifacts:

- Acceptance checklist: `docs/roadmap/wave-3-acceptance-checklist.md`
- Regression test script: `scripts/test-wave3-intent-share-state.js`
- UI contract regression script: `scripts/test-wave3-ui-contracts.js`
- Release note: `docs/releases/release-2-wave-3-complete.md`

## I1. Intent selector and routing

1. Add a top-level intent selector in calculator header.
2. Map intent -> default mode + feature visibility profile.
3. Persist intent in shared state (same pattern as `um`).

Status: complete.

## I2. KPI and recommendation orchestration

1. Prioritize KPI card order by selected intent.
2. Add intent-specific "why this first" helper text.
3. Re-rank recommendation emphasis by intent while preserving numeric logic.

Status: complete.

## I3. Guided decision paths

1. Add step ribbons per intent (e.g., Viability -> Risk -> Action).
2. Track completion state by step.
3. Add one-click export presets tuned to each intent.

Status: complete.

---

## Intent-based FiceCal UI/UX rehauling (Blueprint)

## Goal

Move from control-centric interaction to intent-centric interaction, where users start from what they are trying to do, and FiceCal presents only the minimum required surfaces.

## Intent taxonomy (initial)

1. **Validate viability quickly**
   - Primary user: founder / product owner
   - Default mode: `quick`
   - Focus: break-even, min price, contribution margin
2. **Operate monthly FinOps**
   - Primary user: operator / cloud-finops analyst
   - Default mode: `operator`
   - Focus: budget variance, forecast band, realization metrics, normalization overlays
3. **Architect scenario and policy**
   - Primary user: architect / platform lead
   - Default mode: `architect`
   - Focus: AI token economics, policy sensitivity, allocation governance
4. **Prepare executive readout**
   - Primary user: CFO / finance lead
   - Default mode: `operator` with dashboard-first layout
   - Focus: summarized KPI set + recommendation confidence and risks

## UX behavior model

For each selected intent:

- set default UI mode,
- pre-filter visible modules,
- prioritize relevant KPI cards,
- rewrite recommendation emphasis (same engine, different narrative order),
- optionally preload a safe scenario preset.

This keeps one model while changing presentation and decision flow.

## Rehauling scope (incremental)

## Phase I - Intent selector and routing

- Add intent selector in calculator header.
- Map each intent to mode + module visibility profile.
- Persist selected intent in share state (same pattern as `um`).

## Phase II - KPI and recommendation orchestration

- Per intent, order KPI cards by relevance.
- Add "why this first" helper text per intent.
- Prioritize recommendation categories dynamically by intent.

## Phase III - Guided decision paths

- Add step ribbons per intent (e.g., Viability -> Risk -> Action).
- Add completion state for each path.
- Add one-click export presets tuned to each intent.

---

## Acceptance criteria for Intent-based rehauling

1. Users can choose intent in < 1 click from header.
2. Quick intent hides advanced controls by default while preserving numeric parity.
3. Architect intent exposes AI module and policy controls with no mode-switch confusion.
4. Shared links preserve both mode and intent context.
5. Recommendation quality remains numerically consistent across intents.

---

## References

- `docs/modularization-playbook.md`
- `docs/ai-token-economics.md`
- `docs/roadmap/wave-3-modularization-backlog.md`
- `docs/roadmap/wave-3-acceptance-checklist.md`
- `docs/releases/release-2-wave-3-complete.md`
