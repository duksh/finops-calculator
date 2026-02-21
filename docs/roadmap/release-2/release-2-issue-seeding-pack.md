# Release 2 Issue Seeding Pack (Wave 0)

Use this pack to create and classify all Release 2 issues in GitHub Project v2.

References:

- State of FinOps baseline: https://data.finops.org
- Release brief: `docs/roadmap/release-2/release-2-brief.md`
- Backlog source: `docs/roadmap/release-2/release-2-epics-stories.md`
- KPI definitions: `docs/roadmap/release-2/release-2-kpi-trackers.md`
- Project fields/views: `docs/roadmap/release-2/release-2-github-project-mapping.md`

## 1) Pre-create milestones

Create these milestones before issue seeding:

1. `R2-Wave-1 Foundation`
2. `R2-Wave-2 AI + Shift-Left`
3. `R2-Wave-3 Forecast + Allocation`
4. `R2-Hardening and Release`

## 2) Epics to create (5)

All epics should include labels: `type:epic`, `priority:p0|p1` and one domain label.

| Epic Title | Labels | Priority | Milestone |
|---|---|---|---|
| `[EPIC][R2] Multi-technology spend model and normalization` | `type:epic,domain:finops,priority:p0` | P0 | R2-Wave-1 Foundation |
| `[EPIC][R2] AI spend granularity and value controls` | `type:epic,domain:ai-governance,priority:p0` | P0 | R2-Wave-2 AI + Shift-Left |
| `[EPIC][R2] Pre-deployment architecture costing` | `type:epic,domain:finops,priority:p0` | P0 | R2-Wave-2 AI + Shift-Left |
| `[EPIC][R2] Forecast confidence and value realization` | `type:epic,domain:finops,priority:p1` | P1 | R2-Wave-3 Forecast + Allocation |
| `[EPIC][R2] Allocation maturity and intersecting discipline workflows` | `type:epic,domain:itam,priority:p1` | P1 | R2-Wave-3 Forecast + Allocation |

## 3) Stories to create (15)

All stories should include labels: `type:story`, one domain label, and priority.

### Epic 1 - Multi-technology spend model and normalization

1. `[STORY][R2] Add technology domain selector and canonical schema`
   - Labels: `type:story,domain:finops,priority:p0`
   - Milestone: `R2-Wave-1 Foundation`

2. `[STORY][R2] Implement normalized cost dimensions (FOCUS-aligned)`
   - Labels: `type:story,domain:finops,priority:p0`
   - Milestone: `R2-Wave-1 Foundation`

3. `[STORY][R2] Build single-pane portfolio summary view`
   - Labels: `type:story,domain:finops,priority:p0`
   - Milestone: `R2-Wave-1 Foundation`

### Epic 2 - AI spend granularity and value controls

4. `[STORY][R2] Capture AI usage primitives`
   - Labels: `type:story,domain:ai-governance,priority:p0`
   - Milestone: `R2-Wave-2 AI + Shift-Left`

5. `[STORY][R2] Compute AI unit economics`
   - Labels: `type:story,domain:ai-governance,priority:p0`
   - Milestone: `R2-Wave-2 AI + Shift-Left`

6. `[STORY][R2] Add AI anomaly and threshold alerts`
   - Labels: `type:story,domain:ai-governance,priority:p1`
   - Milestone: `R2-Wave-2 AI + Shift-Left`

### Epic 3 - Pre-deployment architecture costing

7. `[STORY][R2] Add architecture what-if mode`
   - Labels: `type:story,domain:finops,priority:p0`
   - Milestone: `R2-Wave-2 AI + Shift-Left`

8. `[STORY][R2] Add recommendation rationale trace`
   - Labels: `type:story,domain:finops,priority:p0`
   - Milestone: `R2-Wave-2 AI + Shift-Left`

9. `[STORY][R2] Add shift-left credit tracking fieldset`
   - Labels: `type:story,domain:finops,priority:p1`
   - Milestone: `R2-Wave-2 AI + Shift-Left`

### Epic 4 - Forecast confidence and value realization

10. `[STORY][R2] Scenario compare v2 with confidence bands`
    - Labels: `type:story,domain:finops,priority:p1`
    - Milestone: `R2-Wave-3 Forecast + Allocation`

11. `[STORY][R2] Add realized vs identified savings ledger`
    - Labels: `type:story,domain:finops,priority:p1`
    - Milestone: `R2-Wave-3 Forecast + Allocation`

12. `[STORY][R2] Add cost avoidance metric support`
    - Labels: `type:story,domain:finops,priority:p1`
    - Milestone: `R2-Wave-3 Forecast + Allocation`

### Epic 5 - Allocation maturity and intersecting discipline workflows

13. `[STORY][R2] Shared-cost allocation enhancements`
    - Labels: `type:story,domain:itam,priority:p1`
    - Milestone: `R2-Wave-3 Forecast + Allocation`

14. `[STORY][R2] Container and service-level allocation support`
    - Labels: `type:story,domain:itam,priority:p1`
    - Milestone: `R2-Wave-3 Forecast + Allocation`

15. `[STORY][R2] Cross-discipline collaboration metadata`
    - Labels: `type:story,domain:itam,priority:p2`
    - Milestone: `R2-Wave-3 Forecast + Allocation`

## 4) KPI issues to create (7)

All KPI issues should include labels: `type:kpi`, `domain:finops`, `priority:p1`.

1. `[KPI][R2] Multi-technology coverage`
2. `[KPI][R2] AI granularity coverage`
3. `[KPI][R2] Shift-left adoption`
4. `[KPI][R2] Forecast accuracy`
5. `[KPI][R2] Realization ratio`
6. `[KPI][R2] Time to action on anomalies`
7. `[KPI][R2] Allocation completeness`

Milestone recommendation: `R2-Hardening and Release`

## 5) Project field defaults after issue creation

Set these values for every `[R2]` issue:

- `Release = v2.0`
- `Status = Inbox`
- `Quarter = 2026-Q2` (or appropriate quarter if re-scheduled)
- `Type = Epic|Story|KPI`
- `Domain` and `Priority` based on label set
- `Confidence = Medium` (initial)

## 6) Suggested issue creation command pattern (GH CLI)

Example pattern:

```bash
gh issue create \
  --repo duksh/finops-calculator \
  --title "[STORY][R2] Add architecture what-if mode" \
  --label "type:story,domain:finops,priority:p0" \
  --milestone "R2-Wave-2 AI + Shift-Left" \
  --template "story.md"
```

For KPI example:

```bash
gh issue create \
  --repo duksh/finops-calculator \
  --title "[KPI][R2] Forecast accuracy" \
  --label "type:kpi,domain:finops,priority:p1" \
  --milestone "R2-Hardening and Release" \
  --template "kpi.md"
```

## 7) Wave 0 completion checklist

- [ ] 5 epics created and linked in project.
- [ ] 15 stories created and linked to parent epics.
- [ ] 7 KPI issues created with owners.
- [ ] All items assigned `Release = v2.0` and initial target dates.
- [ ] Project views validated (Roadmap, Delivery Board, KPI Control, Feedback Triage).
