# Release 2 KPI Trackers

Use this file to instantiate `[KPI][R2]` issues via `.github/ISSUE_TEMPLATE/kpi.md`.

## KPI set

| KPI ID | KPI Name | Definition | Baseline | Target (R2) | Cadence | Source |
|---|---|---|---|---|---|---|
| KPI-R2-01 | Multi-technology coverage | % of tracked spend mapped to normalized domains | 0% (new metric) | >= 80% | Monthly | Portfolio summary |
| KPI-R2-02 | AI granularity coverage | % of AI spend with token/request/GPU attribution | Baseline from pilot month | >= 90% | Monthly | AI module outputs |
| KPI-R2-03 | Shift-left adoption | % of new workload proposals evaluated pre-deployment | Baseline from current process | >= 50% | Monthly | What-if mode logs |
| KPI-R2-04 | Forecast accuracy | Absolute monthly forecast error | Current model baseline | < 8% | Monthly | Forecast compare view |
| KPI-R2-05 | Realization ratio | Realized savings / identified savings | Current v1 baseline | >= 65% | Monthly | Value ledger |
| KPI-R2-06 | Time to action on anomalies | Mean business time from anomaly detect to assigned action | Baseline from pilot | < 3 business days | Monthly | Alert workflow data |
| KPI-R2-07 | Allocation completeness | % of spend allocated to owner/team/workload | Current allocation baseline | >= 85% | Monthly | Allocation model |

## KPI issue starter snippets

### `[KPI][R2] Multi-technology coverage`
- Why this matters: FinOps 2026 confirms expansion beyond cloud; coverage is the first control signal.
- Baseline: capture first pilot month value.
- Target: >= 80% by Release 2 close.

### `[KPI][R2] AI granularity coverage`
- Why this matters: AI visibility is a top priority and required for governance.
- Baseline: initial percentage of AI costs with usage primitives.
- Target: >= 90% at release close.

### `[KPI][R2] Shift-left adoption`
- Why this matters: pre-deployment costing is a top tooling demand and value lever.
- Baseline: current architecture reviews with no formal FinOps costing.
- Target: >= 50% of new workloads evaluated pre-deployment.

### `[KPI][R2] Forecast accuracy`
- Why this matters: forecasting quality is core to trust and budget planning.
- Baseline: current absolute monthly forecast error.
- Target: < 8%.

### `[KPI][R2] Realization ratio`
- Why this matters: move from identified opportunities to verified value.
- Baseline: realized/identified ratio in v1 practices.
- Target: >= 65%.

## Measurement guardrails

1. Freeze metric definitions before first pilot month.
2. Do not change formulas mid-quarter without version note.
3. Track confidence level for each KPI datapoint.
4. Maintain one owner per KPI issue.
