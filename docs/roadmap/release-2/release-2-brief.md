# Release 2 Brief - FinOps and Cloud Economics Calculator

## Release framing

Release 2 evolves the calculator from a cloud-cost model into a multi-technology FinOps decision engine.

This release is grounded on the State of FinOps 2026 baseline at:

- https://data.finops.org

## Why Release 2 now

State of FinOps 2026 indicates six practical shifts that directly affect product direction:

1. AI value management is now mainstream and urgent.
2. FinOps scope has expanded across SaaS, licensing, private cloud, and data center.
3. Optimization remains necessary, but value realization now matters more.
4. FinOps influence is moving upward into CTO/CIO-led decisions.
5. Shift-left costing is desired but still immature in many teams.
6. Convergence with ITFM, ITAM/SAM, ITSM, and ESG is accelerating.

## Release 2 objectives

1. Provide one decision surface across cloud and non-cloud technology spend.
2. Add AI-specific economics visibility (token/request/GPU/inference).
3. Enable shift-left architecture costing before deployment decisions.
4. Improve explainability from recommendation to measurable value outcomes.

## In-scope features

### P0 (must ship)

- Multi-technology spend model (Cloud, SaaS, Licensing, Private Cloud, Data Center, optional Labor).
- FOCUS-aligned normalization layer for comparable cost/usage dimensions.
- AI spend granularity model (tokens, LLM requests, GPU utilization, inference cost).
- Pre-deployment architecture costing mode (shift-left what-if assessment).
- Unified portfolio dashboard (single-pane technology value view).

### P1 (high value)

- Forecast confidence bands with scenario compare v2 (base, best, worst).
- Advanced shared-cost allocation (containers, shared platforms, SaaS seat/license allocation).
- Policy and guardrails engine (budget caps, margin floors, anomaly triggers).
- Value realization ledger (identified savings, realized savings, cost avoidance, AI ROI signal).

### P2 (stretch)

- Cross-discipline workspace links (ITFM, ITAM, ITSM, ESG).
- AI-for-FinOps assistant (NLQ, recommendation explanation, anomaly narratives).

## Out of scope for Release 2

- Full enterprise workflow orchestration across external systems.
- Full policy remediation automation in production environments.
- Industry-specific benchmarking packs beyond core model metrics.

## Success criteria

- At least 80% of tracked spend mapped to normalized cost domains.
- At least 90% of tracked AI spend attributed at token/request/GPU dimension level.
- At least 50% of new workload assessments using pre-deployment costing mode.
- Monthly forecast error below 8% in pilot portfolios.

## Dependencies and assumptions

- Access to representative cost and usage exports (cloud + SaaS + licensing).
- Stable ownership model across Finance, Engineering, and Platform teams.
- GitHub-native delivery model remains the system of execution.

## Release label

- Suggested version label: `v2.0.0`
- Suggested release title: `Release v2.0`
