# Model Risk and Validation Notes

_Last updated: 2026-02-22_

This document records model-risk findings, remediation decisions, and validation guidance for the FinOps calculator in `index.html`.

## Why this exists

The calculator is used for decision support by product, finance, and engineering audiences. To keep outputs decision-safe, we track:

- formula integrity,
- unit consistency,
- deterministic behavior,
- output interpretation guardrails.

## Recent remediation applied

### 1) Unit consistency fix in strategic recommendations

Issue:
- Strategic recommendation logic compared ARPU (`€/client`) against a monthly total cost point (not unit cost).

Fix:
- Updated logic to use `minUnitCostPerClient` from an economic range scan.

Code references:
- `buildStrategicRecommendations`: `minUnitCostPerClient` usage
- `scanEconomicRange`: `minUnitCostPerClient` computation

### 2) Deterministic model reconstruction per recalculation

Issue:
- Mutable global model state could carry stale coefficients between edits.

Fix:
- `recalculate()` now rebuilds `nextModel` from `MODEL_DEFAULTS` every run, then applies current inputs.
- This removes path-dependent drift and keeps "same inputs => same outputs" behavior.

Code references:
- `recalculate()`: `const nextModel = { ...MODEL_DEFAULTS }` and final reassignment to `MODEL`.

### 3) Break-even and minimum unit-cost scanning aligned

Issue:
- Break-even used chart-sample points (`buildData`) with coarse resolution.

Fix:
- Added `scanEconomicRange(arpu, maxN, model)` to scan integer client counts directly.
- Reused in both KPI outputs and health scoring.

Code references:
- `scanEconomicRange`
- `updateOutputCards`
- `updateHealthAndRecommendations`

### 4) CCER handling when infra cost is zero

Issue:
- Zero infra could be treated as `0x` and penalized in health scoring.

Fix:
- CCER now resolves to `Infinity` when revenue exists and infra is zero.
- UI renders this as `∞` with explanatory subtext.
- Health score penalties apply only when CCER is finite and below thresholds.

Code references:
- `updateOutputCards` CCER block
- `updateHealthAndRecommendations` CCER scoring conditions

## Remaining assumptions (must be explicit)

1. `IC_cud(n) = g * c * n^(b*0.96)` assumes commitment behavior affects scaling exponent, not only level.
2. Health score thresholds and penalties are heuristic (policy rules), not statistically calibrated.
3. Forecast "confidence band" is scenario-spread based, not a probabilistic confidence interval.

## Validation checklist for future changes

Before shipping formula updates:

1. **Unit check**: every ratio/difference must use compatible units.
2. **State check**: outputs must be invariant to input edit order.
3. **Boundary check**: verify behavior for zero, missing, and extreme values.
4. **Interpretation check**: labels must match what is mathematically computed.
5. **Cross-panel check**: KPI cards, health score, and recommendations must agree numerically.

## Recommended next hardening steps

1. Add regression tests for economic scan parity (`breakEvenN`, `minUnitCostPerClient`) for known scenarios.
2. Distinguish scenario spread from statistical confidence in UI wording.
3. Add optional weighted normalization mode if `Priority Index` weighting is to be operationalized.
4. Document CFO governance defaults (thresholds/penalties) as configurable policy parameters.
