# Wave 4 Execution Plan (Current)

## Purpose

Define the post-Release 3 execution path to harden browser-level quality and continue modular extraction from `index.html` into maintainable runtime modules.

---

## Starting point (post Release 3)

Wave 3 is complete and released as `v3.0.0` with:

- intent selector and routing
- intent KPI/recommendation orchestration
- guided decision paths + intent exports
- Node regression guardrails in CI

Release 3 reference:

- `docs/releases/release-3-wave-3-complete.md`

---

## Wave 4 outcome

By end of Wave 4, FiceCal should have:

1. stable browser E2E smoke coverage for the intent experience,
2. clearer module boundaries for intent/share-state runtime logic,
3. stronger release confidence with layered test evidence (contract + runtime + browser).

---

## Delivery lanes

## Lane A: Browser E2E quality gate (P0)

Goal: enforce a true user-flow smoke baseline in CI.

Scope:

- Playwright smoke flow for:
  - intent switch + mode sync,
  - share-state restore (`ui` + `um`),
  - guided path transition checks,
  - intent export trigger.
- Dedicated CI workflow for browser smoke.
- Stabilize selectors and test utilities for low-flake runs.

Initial artifacts already seeded:

- `scripts/test-wave3-playwright-smoke.js`
- `.github/workflows/wave3-playwright-smoke.yml`

## Lane B: Runtime extraction phase 1 (P1)

Goal: reduce inline-script coupling for intent/share-state orchestration.

Scope:

- extract intent profile/runtime helpers into `src/core/intent-runtime.js`,
- extract share-state codec/apply helpers into `src/core/share-state.js`,
- preserve parity adapter layer in `index.html`.

Non-goal:

- no formula changes in economics model during extraction.

## Lane C: Test architecture hardening (P1)

Goal: improve maintainability of regression suites.

Scope:

- remove brittle script-snippet extraction where practical,
- introduce reusable test fixtures for common input states,
- standardize QA command bundle for local/CI parity.

## Lane D: Release evidence and docs quality (P2)

Goal: make release evidence reproducible and auditable.

Scope:

- add a Wave 4 acceptance checklist,
- document E2E troubleshooting notes (timeouts, browser install, CI caveats),
- include release evidence table in next release note.

---

## Immediate execution (Wave 4.1)

1. Validate and stabilize the new Playwright smoke script in CI.
2. Add deterministic retry/wait guards for the 4 smoke assertions.
3. Draft extraction RFC for intent/share-state module boundaries.
4. Create Wave 4 acceptance checklist skeleton.

---

## Acceptance criteria (Wave 4)

1. Browser smoke workflow is green on PR and main for two consecutive release candidates.
2. Intent/share-state runtime logic is extracted into `src/core/*` modules with behavior parity.
3. Existing Wave 3 Node regressions remain green after extraction.
4. Wave 4 release note includes browser smoke evidence and mirror verification checklist.

---

## References

- `docs/roadmap/wave-3-execution-plan.md`
- `docs/releases/release-3-wave-3-complete.md`
- `.github/workflows/modularization-guardrails.yml`
- `.github/workflows/wave3-playwright-smoke.yml`
- `scripts/test-wave3-intent-share-state.js`
- `scripts/test-wave3-ui-contracts.js`
- `scripts/test-wave3-playwright-smoke.js`
