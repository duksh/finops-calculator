# Release 2 Epics and Stories Backlog

This backlog is designed for GitHub Issues using existing templates under `.github/ISSUE_TEMPLATE`.

## Label conventions

- Type: `type:epic`, `type:story`, `type:kpi`
- Domain: `domain:finops`, `domain:itam`, `domain:greenops`, `domain:ai-governance`
- Priority: `priority:p0`, `priority:p1`, `priority:p2`

## Epic 1 - Multi-Technology Spend Foundation

**Suggested issue title**: `[EPIC][R2] Multi-technology spend model and normalization`

### Stories

1. **[STORY][R2] Add technology domain selector and canonical schema**
   - Acceptance:
     - User can classify spend entries by domain (Cloud, SaaS, Licensing, Private Cloud, Data Center, Labor).
     - Inputs validate required fields per domain.

2. **[STORY][R2] Implement normalized cost dimensions (FOCUS-aligned)**
   - Acceptance:
     - Calculator derives comparable dimensions across domains.
     - Output cards show normalized and raw values side by side.

3. **[STORY][R2] Build single-pane portfolio summary view**
   - Acceptance:
     - Summary includes domain totals, unit-cost trend, and allocation completeness.

## Epic 2 - AI Economics and Governance

**Suggested issue title**: `[EPIC][R2] AI spend granularity and value controls`

### Stories

1. **[STORY][R2] Capture AI usage primitives**
   - Acceptance:
     - Inputs support tokens, requests, GPU-hours, and inference volume.
     - Pricing profile supports at least fixed and variable cost components.

2. **[STORY][R2] Compute AI unit economics**
   - Acceptance:
     - Outputs include cost per token, request, inference, and workload-level AI burden.

3. **[STORY][R2] Add AI anomaly and threshold alerts**
   - Acceptance:
     - User can define alert thresholds and view breach states.

## Epic 3 - Shift-Left Costing

**Suggested issue title**: `[EPIC][R2] Pre-deployment architecture costing`

### Stories

1. **[STORY][R2] Add architecture what-if mode**
   - Acceptance:
     - User can model two architecture options pre-deployment.
     - Decision output includes delta in unit cost, margin impact, and commitment fit.

2. **[STORY][R2] Add recommendation rationale trace**
   - Acceptance:
     - Recommendation explains assumptions and formulas used.

3. **[STORY][R2] Add shift-left credit tracking fieldset**
   - Acceptance:
     - Output records estimated cost avoidance from pre-deployment decisions.

## Epic 4 - Forecasting and Value Realization

**Suggested issue title**: `[EPIC][R2] Forecast confidence and value realization`

### Stories

1. **[STORY][R2] Scenario compare v2 with confidence bands**
   - Acceptance:
     - Baseline, best, and worst scenarios displayed together.

2. **[STORY][R2] Add realized vs identified savings ledger**
   - Acceptance:
     - User can track planned savings, realized savings, and residual gap.

3. **[STORY][R2] Add cost avoidance metric support**
   - Acceptance:
     - Model captures prevention outcomes from shift-left decisions.

## Epic 5 - Allocation and Cross-Discipline Operations

**Suggested issue title**: `[EPIC][R2] Allocation maturity and intersecting discipline workflows`

### Stories

1. **[STORY][R2] Shared-cost allocation enhancements**
   - Acceptance:
     - Supports shared platform allocation percentages with validation.

2. **[STORY][R2] Container and service-level allocation support**
   - Acceptance:
     - Can allocate shared spend to teams/services using defined keys.

3. **[STORY][R2] Cross-discipline collaboration metadata**
   - Acceptance:
     - Issues can capture ITFM/ITAM/ITSM/ESG touchpoints and owners.

## Suggested sequencing

1. Epic 1 and Epic 2 (parallel, both P0).
2. Epic 3 (P0) once schema and AI primitives are stable.
3. Epic 4 and Epic 5 (P1) in staggered delivery.
