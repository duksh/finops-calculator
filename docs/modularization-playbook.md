# FiceCal Modularization Playbook (Wave 3 Start)

## Objective

Adopt a feature-modular architecture so FiceCal can add, maintain, test, and release capabilities independently (plug-and-play style) while keeping the core calculator stable.

This playbook is intentionally incremental: we do **not** break the current `index.html` runtime first; we introduce module contracts, catalogs, and delivery controls before extraction.

---

## Design principles

1. **Core-first stability**
   - Core economics must remain operational even if optional features are disabled.
2. **Feature isolation**
   - Each feature owns its own metadata, inputs, outputs, and health checks.
3. **Contract-driven integration**
   - Features must declare dependencies, ownership, and rollout state in a manifest.
4. **Progressive UX exposure**
   - New modules are hidden by default unless explicitly enabled by mode or feature flag.
5. **GitOps traceability**
   - Every feature change maps to issues, release notes, and version tags.

---

## Target architecture (incremental)

## Layer 1: Runtime shell

- Existing page shell (`index.html`) remains active during transition.
- A feature catalog determines enabled modules.
- UI surfaces only features valid for the active mode (Quick / Operator / Architect).

## Layer 2: Core domain

- Core module: break-even, margin, CCER, budgeting, recommendations baseline.
- Mandatory for all runs.

## Layer 3: Optional modules

- Multi-technology normalization (existing)
- AI token economics (Wave 3)
- Future domains (GreenOps, ITAM extensions)

Each optional module should be independently:

- testable
- toggleable
- documented
- releasable

---

## Module contract

Each feature module must provide a manifest file (`feature.json`) with:

- `id`: unique module ID
- `version`: semver
- `owner`: accountable team/person
- `status`: `active | experimental | deprecated | disabled`
- `dependsOn`: list of module IDs
- `uiModes`: visibility target (`quick`, `operator`, `architect`)
- `inputs`: declared input keys
- `outputs`: declared output keys
- `healthSignals`: optional health signal keys

Reference files introduced in this wave:

- `src/features/feature-catalog.json`
- `src/features/core-economics/feature.json`
- `src/features/ai-token-economics/feature.json`

---

## UX guardrails for modular growth

1. **Mode-gated surfaces**
   - Quick: minimal metrics and required inputs only.
   - Operator: current FinOps controls.
   - Architect: advanced modules (e.g., AI token economics).
2. **Dependency-based disclosure**
   - Module controls appear only when prerequisite inputs are present.
3. **Complexity budget**
   - Max always-visible KPI cards: 6
   - Max visible controls per group before collapse: 10
4. **Safe fallback**
   - If optional module fails, it is removed from render; core remains intact.

---

## GitOps operating model

## Branch and PR model

- Keep `main` as release line.
- Use short-lived feature branches.
- One module focus per PR where possible.

## Required checks

- Manifest validation pass (`scripts/validate-feature-catalog.py`)
- Repo mapping and branch hygiene (`scripts/check-repo-mapping.sh`)
- Docs updated for any new feature contract or KPI changes.

## Release discipline

- Tag modular milestones under release waves.
- Include module-level change logs in release notes.
- If module schema changes, include migration note in docs.

---

## Deployment and resilience strategy

1. **Feature flags first**
   - New modules ship disabled-by-default until validated.
2. **Canary via mode exposure**
   - Expose modules first in Architect mode only.
3. **Fail-open core**
   - Module exceptions must not break full-page render.
4. **Rollback unit**
   - Rollback by disabling a module in catalog, not by reverting the entire app.

---

## Wave 3 delivery sequence

1. Define contracts and catalog (this step)
2. Add validation tooling and CI hooks (this step)
3. Extract AI token economics calculations as isolated module logic
4. Add minimal Architect-mode UI panel
5. Add recommendation hooks and KPI integration
6. Add MCP parity coverage for AI module payloads

---

## Definition of done (modularization foundation)

- Module catalog exists and validates.
- Core and AI modules are represented via manifests.
- Validation script runs locally and in CI.
- Release docs reference module changes by ID/version.
- UX mode strategy documented and adopted for new modules.
