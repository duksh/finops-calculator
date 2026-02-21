# Release 2 GitHub Project Mapping

This maps Release 2 execution to GitHub Project (v2) roadmap management.

## Project setup

- Project name: `FinOps Calculator - Release 2`
- Default repository: `duksh/finops-calculator`
- Visibility: aligned with repository policy

## Custom fields

1. `Status` (single select)
   - Inbox, Planned, In Progress, Blocked, Done
2. `Type` (single select)
   - Epic, Story, Task, KPI, Feedback, Spike
3. `Release` (single select)
   - v1.0, v2.0, Future
4. `Quarter` (single select)
   - 2026-Q1, 2026-Q2, 2026-Q3, 2026-Q4, Backlog
5. `Domain` (single select)
   - FinOps, ITAM, GreenOps, AI Governance, Platform
6. `Priority` (single select)
   - P0, P1, P2, P3
7. `Target Date` (date)
8. `Confidence` (single select)
   - Low, Medium, High
9. `KPI Link` (text/url)
10. `Value Theme` (single select)
   - Visibility, Optimization, Governance, Forecasting, Allocation, AI Value

## Views

### 1) Roadmap Timeline
- Layout: Roadmap
- Group: Quarter
- Sort: Target Date
- Filter: `Release = v2.0`

### 2) Delivery Board
- Layout: Board
- Columns: Status
- Filter: `Release = v2.0 and Type in (Epic, Story, Task)`

### 3) KPI Control
- Layout: Table
- Filter: `Release = v2.0 and Type = KPI`
- Columns: KPI Link, Confidence, Target Date, Status

### 4) Feedback Triage
- Layout: Table
- Filter: `Type = Feedback`
- Sort: Created desc

## Workflow automation rules

1. Auto-add new issues from `duksh/finops-calculator`.
2. On item added:
   - Set `Status = Inbox`
   - Set `Release = v2.0` when issue title contains `[R2]`
3. On issue closed:
   - Set `Status = Done`
4. On issue reopened:
   - Set `Status = In Progress`

## Release 2 issue naming

- Epic: `[EPIC][R2] <title>`
- Story: `[STORY][R2] <title>`
- KPI: `[KPI][R2] <title>`
- Feedback: `[FEEDBACK][R2] <title>`

## Operating cadence

- Weekly: feedback triage and backlog refinement.
- Bi-weekly: epic/story planning and dependency check.
- Monthly: KPI review and confidence re-score.
- Release close: tag + GitHub release summary.
